package controllers

import play.api.Logger
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import models._
import org.joda.time._
import play.api.Play
import play.api.Play.current
import play.api.cache.Cache
import play.api.http.HeaderNames
import play.api.http.MimeTypes
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.libs.ws.WS
import play.api.mvc.Action
import play.api.mvc.Controller
import helpers.Auth0Config
import constants._

object Callback extends Controller {

  val log = Logger("Controller_SSOAUTH")

  val redirect_def_url = Play.application.configuration.getString("sso.redirect_def_url").getOrElse("")
  val redirect_fail_url = Play.application.configuration.getString("sso.redirect_fail_url").getOrElse("")

  
  def callback(version: String, mfr: String, prod: String, domain: String, codeOpt: Option[String] = None) = Action.async {

    request => { val sch = Auth.ssoMPS.getString(mfr + "_" + prod).get
    val mps = mfr + "/" + prod + "/" + sch
    var RedirectUrlSsoSuccess = Auth.ReqProtocol + "://" + domain + "/" + redirect_def_url + "?mps=" + mps
    val RedirectUrlSsoFailure = Auth.ReqProtocol + "://" + domain + "/" + redirect_fail_url + "?mps=" + mps

    (for {
      code <- codeOpt
    } yield {
      getToken(code,version,mfr,prod,domain).flatMap { case (idToken,accessToken) =>
       getUser(accessToken).map { user =>
          //Cache.set(idToken+ "profile", user)
         val username = (user \ "email").as[String].toLowerCase()

         val status = if(version == CASSANDRA_VERSION) models.User.notActiveSSO(username) else models.vUser.notActiveSSO(username)

         if(status.toLowerCase == "inactive" || status == "") {
            Redirect(RedirectUrlSsoFailure)
         } else {

	   val user_role = if(version == CASSANDRA_VERSION) models.User.userRole(username) else models.vUser.userRole(username)
           val role_info = if(version == CASSANDRA_VERSION) models.Role.roleDetails(user_role) else models.vRole.roleDetails(user_role)
           var isAdmin = false
           val features = role_info.get.features
           val domainlist = role_info.get.domains
           val newMPSList = for(value <- role_info.get.domains.values) yield value.split("/").mkString(":")
           for ( (k,v) <- domainlist){
           val mps = v.split("/")
            if(mps(0).equals(mfr)){
             if(features(v).contains("admin")){
               isAdmin = true
             }
           }
          } 
	   
           val realms = role_info.get.realm.mkString(",")
	   val domains_list = role_info.get.domains.values.mkString(",")
           val currentTime = DateTime.now.getMillis().toString
           val cookie: Map[String, String] = Map(
           SKUserId -> username,
           SKUserOrg -> mfr,
           SKUserRole -> user_role,
           SKUserRealms -> realms,
           SKUserDomains -> newMPSList.mkString(","),
           SKCurrentTime -> currentTime,
	   SKAdmin -> isAdmin.toString,
           SKRemoteAddress -> request.remoteAddress
         )
           val sess = play.api.mvc.Session.encode(cookie)
           val session_id = sess.split("-")(0)

	    if(status.toLowerCase == "active"){
            	Redirect(RedirectUrlSsoSuccess).withSession(
             	SKUserId -> username,
             	SKUserOrg -> mfr,
             	SKUserRole -> user_role,
             	SKUserRealms -> realms,
             	SKUserDomains -> newMPSList.mkString(","),
             	SKCurrentTime -> currentTime,
           	SKAdmin -> isAdmin.toString,
                SKRemoteAddress -> request.remoteAddress,
             	SKSessionId -> session_id)
	   } else {

             val user_status = if(version == CASSANDRA_VERSION) models.User.enableSSOUser(username) else models.vUser.enableSSOUser(username)
                  if(user_status){
                    if(version == CASSANDRA_VERSION) models.User.trackUserLoginActivity(mfr, prod, sch, username, session_id) else models.vUser.trackUserLoginActivity(mfr, prod, sch, username, session_id)
                    
	            Redirect(RedirectUrlSsoSuccess).withSession(
                    SKUserId -> username,
                    SKUserOrg -> mfr,
                    SKUserRole -> user_role,
                    SKUserRealms -> realms,
                    SKUserDomains -> newMPSList.mkString(","),
                    SKCurrentTime -> currentTime,
                    SKAdmin -> isAdmin.toString,
                    SKRemoteAddress -> request.remoteAddress,
                    SKSessionId -> session_id)

                  }else{
                      Redirect(RedirectUrlSsoFailure)
                  }  
                  

           }
	}  
      }
      }.recover {
        case ex: IllegalStateException => {
          log.error(s"User is not authorized " + ex.getMessage)
          //Unauthorized(ex.getMessage)
          Redirect(RedirectUrlSsoFailure)
        }
      }  
    }).getOrElse {

      log.error(s"Parameters are not supplied ")
      //Future.successful(BadRequest("No parameters supplied"))
      Future.successful(Redirect(RedirectUrlSsoFailure))

    }
   }
  }

  def getToken(code: String,version: String, mfr: String, prod: String, domain: String): Future[(String,String)] = {
    val config = Auth0Config.get()
    val callback = config.callbackURL + '/' + version + '/' + mfr + '/' + prod + '/' + domain
    val RedirectUrlSsoFailure = Auth.ReqProtocol + "://" + domain + "/" + redirect_fail_url
    val tokenResponse = WS.url(String.format("%s/oauth/token", config.tokenURL))(Play.current).
      //withHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON).
     // withHeaders("Content-Type" -> "application/x-www-form-urlencoded").
     withHeaders("Content-Type" -> "application/json").
      post(
        Json.obj(
          "client_id" -> config.clientId,
          "client_secret" -> config.secret,
          "redirect_uri" -> callback,
          "code" -> code,
          "grant_type"-> "authorization_code"

        )
      )

    tokenResponse.flatMap { response =>
      log.error(s"RESPONSE==" + response.json)
      (for {
        idToken <- (response.json \ "id_token").asOpt[String]
        accessToken <- (response.json \ "access_token").asOpt[String]
      } yield {
        Future.successful((idToken,accessToken)) 
      }).getOrElse {
        log.error(s"Tokens not sent ")
        //Future.successful[(String, String)](Redirect(RedirectUrlSsoFailure))
        Future.failed[(String, String)](new IllegalStateException("Tokens not sent"))
        //Future.successful((""))
      }
    }
    
  }
  
  def getUser(accessToken: String): Future[JsValue] = {
    val config = Auth0Config.get()
    val userResponse = WS.url(String.format("%s/userinfo", config.userinfoURL))(Play.current)
      .withQueryString("access_token" -> accessToken)
      //.withHeaders("Authorization" -> accessToken)
      .get()
    
    userResponse.flatMap(response =>
	{
		 log.error(s"USERINFO==" + response.json)
		 Future.successful(response.json)
	})
  }
}
