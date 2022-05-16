package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.Logger
import play.api.libs.ws._
import play.api.libs.json._
import play.api.libs.Jsonp

import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.i18n.Messages.Implicits._
import com.ning.http.client.Realm.AuthScheme
import org.joda.time._

import scala.util.{Failure, Success, Try}
import models._
import views._
import constants._
import controllers.Callback.Redirect
import dao.vertica

object SSOPingone extends Controller {
  val log = Logger("Controller_SSOPingone")

  def isNotEmpty(x: String) = x != null && x.trim.nonEmpty

  def getUserInfo(version: String, mfr: String, prod: String, domain: String, tokenId: String, agentId: String) = Action.async { implicit request =>
    log.debug(s"payload: mfr: $mfr, prod: $prod, domain: $domain, tokenId: $tokenId, agentId: $agentId")
    val agent_id = agentId
    val token_id = tokenId
    val stageDomain = Play.current.configuration.getString("pingone.stagedomain").getOrElse("")
    val user = if(isNotEmpty(domain) && isNotEmpty(stageDomain) && domain == stageDomain) Play.current.configuration.getString("pingone.userStage").getOrElse("") else               Play.current.configuration.getString("pingone.user").getOrElse("")
    val password = Play.current.configuration.getString("pingone.password").getOrElse("")
    val callbackUrl = Play.current.configuration.getString("pingone.apiBaseUrl").getOrElse("")
    val redirect_domain = domain
    val customer_domain = Play.current.configuration.getString("xdomain.name").getOrElse("")
    val redirect_def_url = Play.current.configuration.getString("sso.redirect_def_url").getOrElse("")
    val redirect_fail_url = Play.current.configuration.getString("sso.redirect_fail_url").getOrElse("")
    val sch = Auth.ssoMPS.getString(mfr + "_" + prod).get
    val userEmail = Auth.ssoUserDetails.getString("email").get
    val userRole = Auth.ssoUserDetails.getString("role").get
    val userDisplayName = Auth.ssoUserDetails.getString("display_name").get
    val mps = mfr + "/" + prod + "/" + sch
    val url_def = Play.current.configuration.getString("sso.redirect_def_url").getOrElse("")
    val defaultRoleNameConfig = Play.current.configuration.getString("sso.default_role").getOrElse("default")
    val default_role = s"${mfr}_${prod}_${sch}_$defaultRoleNameConfig"
    val defRoleRows = vertica.role.selectRoleId(default_role)
    val def_role_id = models.Utils.getDBLongVal(defRoleRows.head, vertica.role.Col_role_id, CVDefaultLong)
    val RedirectUrlSsoSuccess = Auth.ReqProtocol + "://" + redirect_domain + "/" + redirect_def_url + "?mps=" + mps
    val RedirectUrlSsoFailure = Auth.ReqProtocol + "://" + redirect_domain + "/" + redirect_fail_url
    if (!(isNotEmpty(agent_id) && isNotEmpty(token_id) && isNotEmpty(user) && isNotEmpty(password) && isNotEmpty(callbackUrl) && isNotEmpty(redirect_domain)))
      log.error(s"Atlease one of the configuration parameters is missing")

    log.debug(s"Web service call to Pingone to get the user credentials for agent id and token id as " + "AgentId : " + agent_id + " TokenId : " + token_id)
    val feedUrl = callbackUrl + token_id + "/" + agent_id
    WS.url(feedUrl).withAuth(user, password, WSAuthScheme.BASIC).withHeaders("Cookie" -> agent_id).get().map { response =>
      log.info(s"PINGONE RESPONSE: ${response.status}, ${response.allHeaders}")
      response.status match {
        case 200 =>
          log.info(s"PINGONE RESPONSE SUCCESS: ${response.json}")
          val test = (response.json \ "pingone.subject")
          val username = (response.json \ s"${userEmail}").as[String].toLowerCase
          val user_display_name = (response.json \ s"${userDisplayName}") match{
            case JsDefined(x) =>
              x.as[String]
              case _ => ""
          }
          val res_role = (response.json \ s"${userRole}") match{
            case JsDefined(x) =>
              val name = x.as[String].toLowerCase
              s"${mfr}_${prod}_${sch}_$name"
            case _ => ""
          }
          log.debug(s"res role : $res_role")
          log.debug(s"res user display name : $user_display_name")
          val status = models.vUser.notActiveSSO(username)
          if (status.toLowerCase == "inactive") {
            Redirect(RedirectUrlSsoFailure)
          } else if(status.equals("")){
            val (role_id, role_name, role_info) = if(!res_role.equals("")){
              val roleRows = vertica.role.selectRoleId(res_role)
              if(roleRows.size > 0){
                val db_role_id = models.Utils.getDBLongVal(roleRows.head,vertica.role.Col_role_id)
                (db_role_id, res_role, models.vRole.roleDetails(res_role))
              } else{
                (def_role_id, default_role, models.vRole.roleDetails(default_role))
              }
            } else{
              (def_role_id, default_role, models.vRole.roleDetails(default_role))
            }
            val rows = vertica.user.selectRoleMfrRealmId(mps,role_name)
            val first_name = if(user_display_name == "") "" else user_display_name.split(" ")(0)
            val last_name = if(user_display_name == "") "" else user_display_name.split(" ")(1)

            val mfr_id = if(rows.size > 0) models.Utils.getDBIntVal(rows.head, vertica.org.Col_mfr_id,CVDefaultInt) else 0
            val realm_id = if(rows.size > 0) models.Utils.getDBLongVal(rows.head, vertica.realm.Col_realm_id) else 0L
            val ui_url = if(rows.size > 0) models.Utils.getDBStringVal(rows.head, vertica.realm.Col_ui_url, "") else ""
            val res = vertica.user.insertUser(username.toLowerCase(),1, first_name, last_name , "", mfr, "", "", "", "", "", role_id, realm_id, url_def, mps, "", false, false, true, false,true, false,0,true,0, "", "" , mfr_id, ui_url)
            res match {
              case Some(SQL_ERROR) => Redirect(RedirectUrlSsoFailure)
              case _ => successFailureResponse(mfr, prod, sch, username, role_name, status, role_info, request, RedirectUrlSsoSuccess, RedirectUrlSsoFailure)
            }
          } else {
            val user_role = models.vUser.userRole(username)
            val userRoleRows = vertica.role.selectRoleId(user_role)
            val user_role_id = models.Utils.getDBLongVal(userRoleRows.head,vertica.role.Col_role_id)
            val (role_id, role_name, role_info) = if(!user_role.equals("") && !res_role.equals("") && res_role.equals(user_role)){
              log.debug(s"user's role : $user_role, SAML's role : $res_role, both roles are same")
              (user_role_id, user_role, models.vRole.roleDetails(user_role))
            } else if(!res_role.equals("") && !res_role.equals(user_role)){
              log.debug(s"user's role : $user_role, SAML's role : $res_role, both roles are different so updating SAML role : $res_role")
              val roleRows = vertica.role.selectRoleId(res_role)
              if(roleRows.size > 0){
                val db_role_id = models.Utils.getDBLongVal(roleRows.head,vertica.role.Col_role_id)
                vertica.user.updateUserRole(username, db_role_id)
                (db_role_id, res_role, models.vRole.roleDetails(res_role))
              } else{
                (user_role_id, user_role, models.vRole.roleDetails(user_role))
              }
            } else if(res_role.equals("")){
              log.debug(s"SAML's role is empty")
              (user_role_id, user_role, models.vRole.roleDetails(user_role))
            } else{
              (def_role_id, default_role, models.vRole.roleDetails(default_role))
            }
            successFailureResponse(mfr, prod, sch, username, role_name, status, role_info, request, RedirectUrlSsoSuccess, RedirectUrlSsoFailure)
          }
        case _ =>
          log.error(s"PINGONE RESPONSE FAILURE : ${response.json}")
          response.status match {
            case 400 => log.error(s"The request format isn't supported")
            case 401 => log.error(s"The HTTP Basic authentication failed")
            case 404 => log.error(s"The requested resource or token doesn't exist")
            case _ => log.error(s"Unknown Error")
          }
          Redirect(RedirectUrlSsoFailure)
      }
    }
  }

  def successFailureResponse(mfr: String, prod: String, sch: String, username: String, user_role: String, status: String, role_info: Try[RoleDetails], request: Request[AnyContent], RedirectUrlSsoSuccess: String, RedirectUrlSsoFailure: String): play.api.mvc.Result = {
    var isAdmin = false
    val features = role_info.get.features
    val domainlist = role_info.get.domains
    val newMPSList = for (value <- role_info.get.domains.values) yield value.split("/").mkString(":")
    for ((k, v) <- domainlist) {
      val mps = v.split("/")
      if (mps(0).equals(mfr)) {
        if (features(v).contains("admin")) {
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
    if (status.toLowerCase == "active") {
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
      val user_status = models.vUser.enableSSOUser(username)
      if (user_status) {
        models.vUser.trackUserLoginActivity(mfr, prod, sch, username, session_id)
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
        Redirect(RedirectUrlSsoFailure)
      }
    }
  }
} 
