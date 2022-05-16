package models

import constants.{CVDefaultBool, CVDefaultDate, CVDefaultInt, CVDefaultLong}
import dao.vertica
import org.joda.time.{DateTime, DateTimeZone}
import play.api.Logger

import java.sql.Timestamp
import scala.util.{Failure, Success, Try}

case class PushNotification(notification_id: Long, email: String, mps: String, rule_id: Long, rule_name: String, title: String, body: String, details: String, alert_filter: String, sent_time: String, read: Boolean, read_time: String, deleted: Boolean, deleted_time: String)
case class BulkUpdateNotificationTime(mps: Option[String], notificationIds: Seq[Long], email: Option[String])
case class MarkAllNotificationTime(mps: Option[String], email: Option[String])

object Notification {
  val log = Logger("Model_Notification")

  def notificationList(mfr: String, prod: String, sch: String, email: String, deletedOpt: Option[Boolean], readOpt: Option[Boolean], stOpt: Option[Int], enOpt: Option[Int]): (Try[List[PushNotification]], Int) = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val rows = vertica.notification.selectRows(email, mps, deletedOpt, readOpt, stOpt, enOpt)
      log.debug(s"notification rows size : ${rows.size}")
      val pushNotifications = (for {
        row <- rows
      } yield {
        val notificationId = models.Utils.getDBLongVal(row, vertica.notification.Col_notification_id, CVDefaultLong)
        val user = models.Utils.getDBStringVal(row, vertica.notification.Col_email, "")
        val mps = models.Utils.getDBStringVal(row, vertica.notification.Col_mps, "")
        val rule_id = models.Utils.getDBLongVal(row, vertica.notification.Col_rule_id, CVDefaultLong)
        val rule_name = models.Utils.getDBStringVal(row, vertica.notification.Col_rule_name, "")
        val title = models.Utils.getDBStringVal(row, vertica.notification.Col_title, "")
        val body = models.Utils.getDBStringVal(row, vertica.notification.Col_body, "")
        val details = models.Utils.getDBStringVal(row, vertica.notification.Col_details, "")
        val alert_filter = models.Utils.getDBStringVal(row, vertica.notification.Col_alert_filter, "")
        val sent_time = models.Utils.getDBDateVal(row, vertica.notification.Col_sent_time, CVDefaultDate).toString()
        val read = models.Utils.getDBBooleanVal(row, vertica.notification.Col_read, CVDefaultBool)
        val read_time = models.Utils.getDBDateVal(row, vertica.notification.Col_read_time, CVDefaultDate).toString()
        val deleted = models.Utils.getDBBooleanVal(row, vertica.notification.Col_deleted, CVDefaultBool)
        val deleted_time = models.Utils.getDBDateVal(row, vertica.notification.Col_deleted_time, CVDefaultDate).toString()
        PushNotification(notificationId, user, mps, rule_id, rule_name, title, body, details, alert_filter, sent_time, read, read_time, deleted, deleted_time)
      }).distinct
      val rowsCount = vertica.notification.selectRowsCount(email, mps, deletedOpt, readOpt, None, None)
      (Success(pushNotifications), rowsCount)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while fetching notifications for user: $email and mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        (Failure(ex), 0)
      }
    }
  }

  def updateNotificationsReadTime(mfr: String, prod: String, sch: String, email: String, read: Boolean, payload: BulkUpdateNotificationTime): Try[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val notificationIds = payload.notificationIds.toList
      val dateTime = DateTime.now
      val currTime = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      vertica.notification.updateReadTime(mps, email, notificationIds, read, currTime)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while updating read time for user: $email and mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def updateNotificationsDeletedTime(mfr: String, prod: String, sch: String, email: String, deleted: Boolean, payload: BulkUpdateNotificationTime): Try[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val notificationIds = payload.notificationIds.toList
      val dateTime = DateTime.now
      val currTime = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      vertica.notification.updateDeletedTime(mps, email, notificationIds, deleted, currTime)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while updating read time for user: $email and mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def markAllNotificationsReadTime(mfr: String, prod: String, sch: String, email: String, read: Boolean, payload: MarkAllNotificationTime): Try[String] = {
    try {
      val dateTime = DateTime.now
      val currTime = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      vertica.notification.markAllReadTime(payload.mps, email, read, currTime)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while updating read time for user: $email and mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def markAllNotificationsDeletedTime(mfr: String, prod: String, sch: String, email: String, deleted: Boolean, payload: MarkAllNotificationTime): Try[String] = {
    try {
      val dateTime = DateTime.now
      val currTime = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      vertica.notification.markAllDeletedTime(payload.mps, email, deleted, currTime)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while updating read time for user: $email and mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }
}
