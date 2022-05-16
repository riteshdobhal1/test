package controllers

import models._
import org.joda.time.DateTime
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation._

import scala.util.{Failure, Success}

object Notification extends Controller with Secured {
  val log = Logger("Controller_Notification")

  implicit val notificationWrite = Json.writes[PushNotification]

  val bulkUpdateNotificationReadTimeForm = Form(
    mapping(
      "mps" -> optional(text),
      "notificationIds" -> seq(longNumber).verifying(models.Utils.nonEmptySeq),
      "email" -> optional(text)
    )(BulkUpdateNotificationTime.apply)(BulkUpdateNotificationTime.unapply))

  val markAllNotificationReadTimeForm = Form(
    mapping(
      "mps" -> optional(text),
      "email" -> optional(text)
    )(MarkAllNotificationTime.apply)(MarkAllNotificationTime.unapply))

  /** Get list of notifications for a given user and mps
   *
   * @return Success/Failure list of notifications
   */
  def notificationList(version: String, mfr: String, prod: String, sch: String, email: String, deletedOpt: Option[Boolean], readOpt: Option[Boolean]) = IsUserAuthorized(mfr, prod, sch, version){ userid =>
    implicit request => {
      val startTime = DateTime.now
      val res = models.Notification.notificationList(mfr, prod, sch, email, deletedOpt, readOpt, None, None)
      val endTime = DateTime.now
      log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      res._1 match {
        case Success(response) =>
          Ok(models.Utils.jsonResponseNotificationInfo("Success", s"List of notifications.", Json.toJson(response), res._2))
        case Failure(exception) =>
          log.error(s"[$mfr/$prod/$sch] - Unable to fetch notifications for $mfr, $prod, $sch")
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /** Get list of paginated notifications for a given user and mps
   *
   * @return Success/Failure list of notifications
   */
  def notificationPaginationList(version: String, mfr: String, prod: String, sch: String, email: String, st: Int, en: Int, deletedOpt: Option[Boolean], readOpt: Option[Boolean]) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val startTime = DateTime.now
    val res = models.Notification.notificationList(mfr, prod, sch, email, deletedOpt, readOpt, Some(st), Some(en))
    val endTime = DateTime.now
    log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
    res._1 match {
      case Success(response) =>
        Ok(models.Utils.jsonResponseNotificationInfo("Success", s"List of notifications.", Json.toJson(response), res._2))
      case Failure(exception) =>
        log.error(s"[$mfr/$prod/$sch] - Unable to fetch notifications for $mfr, $prod, $sch")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  /** update list of notifications for a given user and mps
   *
   * @return Success/Failure msg
   */
  def updateNotificationsReadTime(version: String, mfr: String, prod: String, sch: String, email: String, read: Boolean) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    bulkUpdateNotificationReadTimeForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"updateNotificationsReadTime payload : $c")
        val res = models.Notification.updateNotificationsReadTime(mfr, prod, sch, email, read, c)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Notifications updated successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Notifications updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to update notifications for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** update list of notifications for a given user and mps
   *
   * @return Success/Failure msg
   */
  def updateNotificationsDeletedTime(version: String, mfr: String, prod: String, sch: String, email: String, delete: Boolean) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    bulkUpdateNotificationReadTimeForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"updateNotificationsDeletedTime payload : $c")
        val res = models.Notification.updateNotificationsDeletedTime(mfr, prod, sch, email, delete, c)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Notifications updated successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Notifications updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to update notifications for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** update list of notifications for a given user and mps
   *
   * @return Success/Failure msg
   */
  def markAllNotificationsReadTime(version: String, mfr: String, prod: String, sch: String, email: String, read: Boolean) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    markAllNotificationReadTimeForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"markAllNotificationsReadTime payload : $c")
        val res = models.Notification.markAllNotificationsReadTime(mfr, prod, sch, email, read, c)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Notifications updated successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Notifications updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to update notifications for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** update list of notifications for a given user and mps
   *
   * @return Success/Failure msg
   */
  def markAllNotificationsDeletedTime(version: String, mfr: String, prod: String, sch: String, email: String, delete: Boolean) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    markAllNotificationReadTimeForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"markAllNotificationsDeletedTime payload : $c")
        val res = models.Notification.markAllNotificationsDeletedTime(mfr, prod, sch, email, delete, c)
        val endTime = DateTime.now
        log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Notifications updated successfully for $c")
            Ok(models.Utils.jsonResponse("Success", s"Notifications updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr/$prod/$sch] - Unable to update notifications for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }
}
