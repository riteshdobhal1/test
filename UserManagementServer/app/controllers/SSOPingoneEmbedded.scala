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

object SSOPingoneEmbedded extends Controller {
  val log = Logger("Controller_SSOPingoneEmbedded")

  def isNotEmpty(x: String) = x != null && x.trim.nonEmpty

  def getUserInfo(version: String, mfr: String, prod: String, domain: String,dashboardId: String, tokenId: String, agentId: String) = Action.async { implicit request =>
    log.debug(s"payload: mfr: $mfr, prod: $prod, domain: $domain, dashboardId: $dashboardId, tokenId: $tokenId, agentId: $agentId")
    val agent_id = agentId
    val token_id = tokenId
    val stageDomain = Play.current.configuration.getString("pingone.stagedomain").getOrElse("")
    val user = if(isNotEmpty(domain) && isNotEmpty(stageDomain) && domain == stageDomain) Play.current.configuration.getString("pingone.userEmbeddedStage").getOrElse(                "") else Play.current.configuration.getString("pingone.userEmbedded").getOrElse("")


    val password = Play.current.configuration.getString("pingone.password").getOrElse("")
    val callbackUrl = Play.current.configuration.getString("pingone.apiBaseUrl").getOrElse("")
    val redirect_domain = domain
    val redirect_dashboard = dashboardId
    val redirect_fail_url = Play.current.configuration.getString("sso.redirect_fail_url").getOrElse("")
    val sch = Auth.ssoMPS.getString(mfr + "_" + prod).get
    val userEmail = Auth.ssoUserDetails.getString("email").get
    val RedirectUrlSsoFailure = Auth.ReqProtocol + "://" + redirect_domain + "/" + redirect_fail_url
    if (!(isNotEmpty(agent_id) && isNotEmpty(token_id) && isNotEmpty(user) && isNotEmpty(password) && isNotEmpty(callbackUrl) && isNotEmpty(redirect_domain) && isNotEmpty(redirect_dashboard))) {
      log.error(s"Atlease one of the configuration parameters is missing")
      Redirect(RedirectUrlSsoFailure)
    }
    log.debug(s"Web service call to Pingone to get the user credentials for agent id and token id as " + "AgentId : " + agent_id + " TokenId : " + token_id)
    val feedUrl = callbackUrl + token_id + "/" + agent_id
    WS.url(feedUrl).withAuth(user, password, WSAuthScheme.BASIC).withHeaders("Cookie" -> agent_id).get().map { response =>
      log.info(s"PINGONE RESPONSE: ${response.status}, ${response.allHeaders}")
      response.status match {
        case 200 =>
          log.info(s"PINGONE RESPONSE SUCCESS: ${response.json}")
          val username = (response.json \ s"${userEmail}").as[String].toLowerCase
          val status = models.vUser.notActiveSSO(username)
          if (status.toLowerCase == "inactive" || status.toLowerCase == "invited") {
            Redirect(RedirectUrlSsoFailure)
          } else {
            models.vClinsight.getHealthcheckSummaryUrl(mfr, prod, sch)
            var dashboard_url = models.vClinsight.getHealthcheckSummaryUrl(mfr, prod, sch)

            if (dashboard_url != "") {
                if (models.vUser.updateSSOToken(username, token_id)) {
                  val encryptedUsernameOpt = Utils.encryptString(username)
                  val encryptedUsername = encryptedUsernameOpt.get
                  dashboard_url = dashboard_url + "&username=" + encryptedUsername + "&token_id=" + token_id
                  val v_message = "User " + username + " redirected successfully to " + dashboard_url
                  log.debug(v_message)
                  Redirect(dashboard_url)
                }
                else {
                  val v_message = "Unable to update token in DB for " + username
                  log.error(v_message)
                  Redirect(RedirectUrlSsoFailure)
                }
            }
            else {
              val v_message = "DashboardId not found or dashboard missing for dashboard Id for " + mfr + "/" + prod + "/" + sch
              log.error(v_message)
              Redirect(RedirectUrlSsoFailure)
            }
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
}
