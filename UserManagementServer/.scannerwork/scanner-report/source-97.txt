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
import play.api.i18n.{MessagesApi, I18nSupport}
import play.api.i18n.Messages.Implicits._
import com.ning.http.client.Realm.AuthScheme
import org.joda.time._
import scala.util.{ Try, Success, Failure }
import models._
import views._

import constants._
object CGIHandler extends Controller {
	val log = Logger("Controller_CGIHandler")
	
	def isNotEmpty(x: String) = x != null && x.trim.nonEmpty

	def forward(serialNumber:Option[String],cust_name: Option[String], db: Option[String],sessionId: Option[String], serverUrl: Option[String], dashboardId: Option[String]) = Action { implicit request =>
    val host = request.host
	val mp = Auth.ssoOldDomain.getString(host).get
	val mfr = mp.split(":")(0)
	val prod = mp.split(":")(1)
	val redirect_fail_url = Play.current.configuration.getString("sso.redirect_fail_url").getOrElse("")
	val sso_ui_domain = Play.current.configuration.getString("sso.ui_domain").getOrElse("")
	val RedirectUrlSsoFailure = Auth.ReqProtocol + "://" + sso_ui_domain + "/" + redirect_fail_url
	val p1 = serialNumber.getOrElse("")
    val p2 = cust_name.getOrElse("")
    val p3 = db.getOrElse("")
    val p4 = sessionId.getOrElse("")
    val p5 = serverUrl.getOrElse("")
	val p6 = dashboardId.getOrElse("")

	var additional_params = if(p6.nonEmpty && p6 != null) "dashboardId=" + p6 else ""

    if (p1.nonEmpty && p1 != null) {
      if (additional_params.equals("")) {
        additional_params = "serialNumber=" + p1
      } else {
        additional_params = additional_params + "~" + "serialNumber=" + p1
      }
    } else {
      if (p2.nonEmpty && p2 != null)
        additional_params = additional_params + "~" + "cust_name=" + p2
      if (p3.nonEmpty && p3 != null)
        additional_params = additional_params + "~" + "db=" + p3
    }

	val routesUrl = "/v1/sso/soap/" + mfr + "/" + prod + "/" + sso_ui_domain + "?sessionId=" + p4 + "&serverUrl=" + p5 + "&additional_params={" + additional_params + "}" 
	if(p4.nonEmpty && p4 != null && p5.nonEmpty && p5 != null){
		log.error(s"Transformed URL to be called: " + routesUrl)
		Redirect(routesUrl)
	}else{
		log.error(s"One of the required parameters is empty\nsessionId="+p4+"\nserverUrl="+p5+"\ndashboardId="+p6)
		Redirect(RedirectUrlSsoFailure)
	}
	
  }

}
