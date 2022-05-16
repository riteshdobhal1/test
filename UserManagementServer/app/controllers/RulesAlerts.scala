package controllers

import models._
import org.joda.time.DateTime
import play.api.libs.json.Json
import play.api.mvc.Controller
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._

import scala.util.{Failure, Success, Try}
import scala.util.{Failure, Success}

object RulesAlerts extends Controller with Secured {
  val log = Logger("Controller_RulesAlerts")
  implicit val rulesAlertsFiltersWrite = Json.writes[RulesAlertsFiltersList]
  implicit val addAlertFiltersWrite = Json.writes[AddAlertFilters]

  val addAlertFiltersForm = Form(
    seq(mapping(
      "mps" -> optional(text),
      "ruleId" -> longNumber,
      "email" -> nonEmptyText,
      "group" -> text,
      "excSysIds" -> seq(text)
    )(AddAlertFilters.apply)(AddAlertFilters.unapply)))

  val bulkRulesDeleteAlertFiltersForm = Form(
    mapping(
      "mps" -> optional(text),
      "ruleIds" -> seq(longNumber),
      "email" -> optional(text)
    )(BulkRulesDeleteAlertFilters.apply)(BulkRulesDeleteAlertFilters.unapply))

  val bulkUsersDeleteAlertFiltersForm = Form(
    mapping(
      "mps" -> optional(text),
      "emailIds" -> seq(text),
      "ruleId" -> longNumber
    )(BulkUsersDeleteAlertFilters.apply)(BulkUsersDeleteAlertFilters.unapply))

  val deleteByRuleIdsAlertFiltersForm = Form(
    mapping(
      "mps" -> optional(text),
      "ruleIds" -> seq(longNumber)
    )(DeleteByRuleIdsAlertFilters.apply)(DeleteByRuleIdsAlertFilters.unapply))

  val notificationForm = Form(
    mapping(
      "mps" -> text,
      "group" -> optional(text),
      "send_notification" -> optional(boolean),
      "user_group_info" -> optional(seq(mapping(
        "user" -> text,
        "old_group" -> text,
        "new_group" -> text
      )(UserGroupInfo.apply)(UserGroupInfo.unapply)))
    )(GroupUpdateNotification.apply)(GroupUpdateNotification.unapply))

  /** Get list of rules alerts filters info for a given mps
   *
   * @return Success/Failure list of rules alerts filters
   */
  def alertFilterList(version: String, mfr: String, prod: String, sch: String, ruleIdOpt: Option[Long], userOpt: Option[String]) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val startTime = DateTime.now
    val qData = AlertFilterQueryData(mfr, prod, sch, ruleIdOpt, userOpt)
    log.debug(s"alertFilterList payload : $qData")
    val res = models.RulesAlerts.alertFilterList(mfr, prod, sch, qData)
    val endTime = DateTime.now
    log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
    res match {
      case Success(response) =>
        Ok(models.Utils.jsonResponse("Success", s"List of alerts filters.", Json.toJson(response)))
      case Failure(exception) =>
        log.error(s"[$mfr/$prod/$sch] - Unable to fetch alerts filters for $mfr, $prod, $sch")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  /** Add list of rules alerts filters for a given mps, ruleId and user
   *
   * @return Success/Failure msg
   */
  def addUpdateAlertFiltersAtributes(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    addAlertFiltersForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        val res = models.RulesAlerts.addUpdateAlertFiltersAtributes(mfr, prod, sch, c, reqSession)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Alerts filters added successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Alerts filter added successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to add alerts filters for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** Delete list of rules alerts filters for a given mps, ruleIds and user
   *
   * @return Success/Failure msg
   */
  def bulkRulesDeleteAlertFiltersAtributes(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    bulkRulesDeleteAlertFiltersForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"bulkRulesDeleteAlertFiltersAtributes payload : $c")
        val res = models.RulesAlerts.bulkRulesDeleteAlertFiltersAtributes(mfr, prod, sch, c, reqSession)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Alerts filters deleted successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Alerts filter deleted successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to delete alerts filters for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** Delete list of rules alerts filters for a given mps, ruleId and users
   *
   * @return Success/Failure msg
   */
  def bulkUsersDeleteAlertFiltersAtributes(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    bulkUsersDeleteAlertFiltersForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"bulkUsersDeleteAlertFiltersAtributes payload : $c")
        val res = models.RulesAlerts.bulkUsersDeleteAlertFiltersAtributes(mfr, prod, sch, c, reqSession)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Alerts filters deleted successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Alerts filter deleted successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to delete alerts filters for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** Sends an email to group users about the changes made in their assigned group
   *
   * @return Success/Failure msg
   */
  def sendNotification(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    notificationForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"sendNotification payload : $c")
        val res = models.RulesAlerts.sendNotification(mfr, prod, sch, c)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Sent notification to group users successfully $c")
            Ok(models.Utils.jsonResponse("Success", s"Sent notification to group users successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Failed to send notification to group users $mfr, $prod, $sch and $c")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }
}
