package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.i18n.Messages.Implicits._
import models._
import views._
import constants._
import models.Auth
import play.api.cache.Cache
import org.joda.time._
import play.api.libs.json.Format.GenericFormat
import play.api.libs.json._
import dao._
import play.api.libs.iteratee.{Done, Input}

import scala.slick.jdbc.GetResult

/**
 * Provide security features
 */


trait Secured {
 
  
  val log_secured = Logger("Controller_Secured")
  
  lazy val sessionTimeoutInMillis = Play.current.configuration.getInt("user.session.timeout").getOrElse(1800)*1000
  
   /**
   * Retrieve the connected user's id.
   */
  def userId(request: RequestHeader) = request.session.get(SKUserId) 
  
  /**
   * Retrieve the connected user's first name.
   */  
  def userName(request: RequestHeader) = request.session.get(SKUserName)  

  /**
   * Retrieve the connected user's role.
   */  
  def userRole(implicit request: RequestHeader) = request.session.get(SKUserRole)

  /**
   *   Retrieve the connected user's realms 
   */  
  
  def userRealms(implicit request: RequestHeader) = request.session.get(SKUserRealms)
  
  /**
   * Retrieve the connected user's domains 
   */
  
  def userDomains(implicit request: RequestHeader) = request.session.get(SKUserDomains)
  
  /**
   * Retrieve the connected user's studio projects as mps 
   */
  
  def userProjects(implicit request: RequestHeader) = request.session.get(SKUserProjects)

  /**
    * Retrieve the connected user's mps.
    */
  def userMfr(implicit request: RequestHeader) = request.session.get(SKUserMfr)
  def userProd(implicit request: RequestHeader) = request.session.get(SKUserProd)
  def userSch(implicit request: RequestHeader) = request.session.get(SKUserSch)

  def jwtToken(implicit request: RequestHeader) = request.headers.get(JWT_HEADER_TOKEN).getOrElse(CVDefaultStr)

  /**
    * Retrieve the connected user's details from request header.
    */
  def userReqHeaderRole(implicit request: RequestHeader): String = {
    val headerCookie = request.headers.get("Cookie").getOrElse("NA")
    if(headerCookie.equals("NA")) "NA"
    else{
      val ps = headerCookie
      val keyValue = ps.split("&")
      val role = keyValue.filter(u => {
        val m = u.split("=")
        (m(0) == SKUserRole)
      })
      if(role(0).equals("role=admin"))
        GBAdmin
      else
        "NA"
    }
  }
  def userReqHeaderOrg(implicit request: RequestHeader): String = {
    val headerCookie = request.headers.get("Cookie").getOrElse("NA")
    if(headerCookie.equals("NA")) "NA"
    else{
      val ps = headerCookie
      val keyValue = ps.split("&")
      val org = keyValue.filter(u => {
        val m = u.split("=")
        (m(0) == SKUserOrg)
      })
      if(org(0).equals("org=glassbeam"))
        GBName
      else
        "NA"
    }
  }

  /**
   * Retrieve the connected user's organization.
   */  
  def userOrg(implicit request: RequestHeader) = request.session.get(SKUserOrg)
  
  def featuresMps(implicit request: RequestHeader) = request.session.get(SKFeaturesMps)
  
  def features(implicit request: RequestHeader) = request.session.get(SKFeatures)
  /**
   * Redirect to login page if the user is not authenticated.
   */
  def onUnAuthenticated(request: RequestHeader) = if(request.headers.get("Referer").getOrElse("NA").equals("NA")) 
    Results.Redirect(routes.Application.vHome(APIVersion)).flashing(FKRedirect -> request.uri)
    else Results.Forbidden("Only Authorized users allowed!!")

  /**
   * Redirect to not-permitted page if the user is not authorized.
   */
  def onUnAuthorized(request: RequestHeader) = Results.Redirect(routes.Application.vHome(APIVersion)).flashing(FKRedirect -> request.uri)

  /** 
   * Action for custom authenticated users.
   */
  def CustomAuthentication(userinfo: RequestHeader => Option[String], onFailure: RequestHeader => Result)(action: String => EssentialAction): EssentialAction = {
    EssentialAction { request =>
      userinfo(request).map { user =>
        action(user)(request)
      }.getOrElse {
        val access_token = request.headers.get(JWT_HEADER_TOKEN).getOrElse(CVDefaultStr)
          if (access_token.equals(CVDefaultStr)) {
            Done(onFailure(request), Input.Empty)
          } else {
            val user = models.JWTUtils.getTokenUsername(access_token)
            user.map { uid =>
              action(uid)(request)
            }
            .getOrElse {
              Done(onFailure(request), Input.Empty)
            }
          }
      }
    }
  }

  def IsAuthenticated(f: => String => Request[AnyContent] => Result) = CustomAuthentication(userId, onUnAuthenticated) { uid =>
    Action(request =>
      f(uid)(request))
  }

  /**
   * Action for mobile-device users.
   */

  def IsUserAccessTokenAuthenticated(f: => String => Request[AnyContent] => Result) = IsAuthenticated { uid =>
    implicit request => {
      if(jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        val res = models.JWTUtils.validateAccessToken(jwtToken, uid)
        log_secured.debug(s"res : $res, status : ${res.header.status}")
        res.header.status match {
          case 200 => f(uid)(request)
          case 403 => Results.Forbidden("Only Authorized users allowed!!")
          case _ => Results.Forbidden("Only Authorized users allowed!!")
        }
      }
    }
  }

  /**
   * Action for authenticated GB users only.
   */
  def IsAuthorizedGBUser(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        if (userReqHeaderOrg.equals("NA") && userReqHeaderRole.equals("NA")) {
          if (Auth.authorizedGBUser(userOrg.getOrElse("NA"), userRole.getOrElse("NA"))) {
            f(uid)(request)
          } else {
            Results.Forbidden("Only Glassbeam Admin Users allowed!!")
          }
        } else {
          if (Auth.authorizedGBUser(userReqHeaderOrg, userReqHeaderRole)) {
            f(uid)(request)
          } else {
            Results.Forbidden("Only Glassbeam Admin Users allowed!!")
          }
        }
      }
  }

  /** Action for authorized uer for the org
   *  
   */
  def IsAuthorizedForOrg(mfr: String, version: String = constants.CASSANDRA_VERSION)(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated {uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        if (Auth.authorizedForOrg(version, mfr, userOrg.getOrElse("NA"), userRole.getOrElse("NA"), userRealms.getOrElse("NA"))) {
          f(uid)(request)
        } else {
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
  }

  /**
   * Action for authenticated and authorized users.
   */
  def IsUserAuthorized(mfr: String, prod: String, sch: String, version:String = constants.CASSANDRA_VERSION)(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        def concat(s: String*) = s filter (_.nonEmpty) mkString "-"
        if (Auth.authDisbaled || Auth.authorized_user(version, mfr, prod, sch, userOrg.getOrElse("NA"), userRole.getOrElse("NA"), userRealms.getOrElse("NA"))) {
          val currentTime = DateTime.now.getMillis().toString
          val previousTime = request.session.get(SKCurrentTime).getOrElse(currentTime)
          val ck = request.session.get(SKCurrentTime)
          if (currentTime.toLong - previousTime.toLong > sessionTimeoutInMillis) {
            log_secured.error(s"Session Timed Out")
            Results.Forbidden(models.Utils.jsonResponse("Failure", "User Session timeout", Json.toJson(Auth.LoginPageUrl)))
          } else {
            f(uid)(request)
          }
        } else {
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
  }

  /**
    * Action for authenticated and authorized users.
    */
  def IsClinsightUserAuthorized(version: String = constants.CASSANDRA_VERSION)(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        val mfr = userMfr.getOrElse("NA")
        val prod = userProd.getOrElse("NA")
        val sch = userSch.getOrElse("NA")

        def concat(s: String*) = s filter (_.nonEmpty) mkString "-"

        if (Auth.authDisbaled || Auth.authorized_user(version, mfr, prod, sch, userOrg.getOrElse("NA"), userRole.getOrElse("NA"), userRealms.getOrElse("NA"))) {
          f(uid)(request)
        } else {
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
  }

  def IsAuthorizedAdminForOrg(mfr: String, version: String = constants.CASSANDRA_VERSION)(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        if (Auth.authorizedAdminForOrg(version, mfr, userOrg.getOrElse("NA"), userRole.getOrElse("NA"), userRealms.getOrElse("NA"))) {
          f(uid)(request)
        } else {
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
  }
  def IsAdminForOrg(mfr: String, version: String = constants.CASSANDRA_VERSION)(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        if (Auth.adminForOrg(version, mfr, userOrg.getOrElse("NA"), userRole.getOrElse("NA"), userRealms.getOrElse("NA"))) {
          f(uid)(request)
        } else {
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
  }
  def IsSuperAdmin()(f: => String => Request[AnyContent] => Result) = IsUserAccessTokenAuthenticated { uid =>
    implicit request =>
      if(!jwtToken.equals(CVDefaultStr)){
        f(uid)(request)
      } else {
        if (Auth.adminSuper(uid, userOrg.getOrElse("NA"), userRole.getOrElse("NA"))) {
          f(uid)(request)
        } else {
          Results.Forbidden("Only Super Admin is allowed!!")
        }
      }
  }
  
}

