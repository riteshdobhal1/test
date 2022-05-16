package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

import scala.util.{Failure, Success, Try}

object notification {
  val log = Logger("Dao_NOTIFICATION")

  /* start : columns of mps_feature table*/
  lazy val Col_notification_id = "notification_id"
  lazy val Col_email = "email"
  lazy val Col_mps = "mps"
  lazy val Col_rule_id = "rule_id"
  lazy val Col_rule_name = "rule_name"
  lazy val Col_title = "title"
  lazy val Col_body = "body"
  lazy val Col_details = "details"
  lazy val Col_alert_filter = "alert_filter"
  lazy val Col_sent_time = "sent_time"
  lazy val Col_read = "read"
  lazy val Col_read_time = "read_time"
  lazy val Col_deleted = "deleted"
  lazy val Col_deleted_time = "deleted_time"
  /* end : columns of mps_feature table*/

  def selectRows(user: String, mps: String, deletedOpt: Option[Boolean], readOpt: Option[Boolean], stOpt: Option[Int], enOpt: Option[Int]): List[Map[String, Option[Any]]] = {
    try {
      val email = user.toLowerCase()
      val offsetQry = stOpt match{
        case Some(st) => {
          val en = enOpt.getOrElse(st)
          val lr = if(en > st) en-st else en
          s" OFFSET $st LIMIT $lr"
        }
        case _ => ""
      }
      val dscOrder = s"ORDER BY $Col_sent_time desc"
      readOpt match {
        case Some(read) => {
          deletedOpt match {
            case Some(deleted) => {
              val q = s"SELECT * FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_read=? AND $Col_deleted=? $dscOrder $offsetQry;"
              log.debug(s"values : $email, $mps, $read, $deleted")
              DB.selectQueryResult(q, List(email, mps, read, deleted))
            }
            case _ => {
              val q = s"SELECT * FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_read=? $dscOrder $offsetQry;"
              log.debug(s"values : $email, $mps, $read")
              DB.selectQueryResult(q, List(email, mps, read))
            }
          }
        }
        case _ => {
          deletedOpt match{
            case Some(deleted) => {
              val q = s"SELECT * FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_deleted=? $dscOrder $offsetQry;"
              log.debug(s"values : $email, $mps, $deleted")
              DB.selectQueryResult(q,List(email, mps, deleted))
            }
            case _ => {
              val q = s"SELECT * FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? $dscOrder $offsetQry;"
              log.debug(s"values : $email, $mps")
              DB.selectQueryResult(q,List(email, mps))
            }
          }
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNNotification} table : $user, $mps, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsCount(user: String, mps: String, deletedOpt: Option[Boolean], readOpt: Option[Boolean], stOpt: Option[Int], enOpt: Option[Int]): Int = {
    try {
      val email = user.toLowerCase()
      val offsetQry = stOpt match{
        case Some(st) => {
          val en = enOpt.getOrElse(st)
          val lr = if(en > st) en-st else en
          s" OFFSET $st LIMIT $lr"
        }
        case _ => ""
      }

      val rows = readOpt match {
        case Some(read) => {
          deletedOpt match {
            case Some(deleted) => {
              val q = s"SELECT COUNT(*) FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_read=? AND $Col_deleted=?;"
              log.debug(s"values : $email, $mps, $read, $deleted")
              DB.selectQueryResult(q, List(email, mps, read, deleted))
            }
            case _ => {
              val q = s"SELECT COUNT(*) FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_read=?;"
              log.debug(s"values : $email, $mps, $read")
              DB.selectQueryResult(q, List(email, mps, read))
            }
          }
        }
        case _ => {
          deletedOpt match{
            case Some(deleted) => {
              val q = s"SELECT COUNT(*) FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=? AND $Col_deleted=?;"
              log.debug(s"values : $email, $mps, $deleted")
              DB.selectQueryResult(q,List(email, mps, deleted))
            }
            case _ => {
              val q = s"SELECT COUNT(*) FROM $KsUMS.$CFNNotification where $Col_email=? AND $Col_mps=?;"
              log.debug(s"values : $email, $mps")
              DB.selectQueryResult(q,List(email, mps))
            }
          }
        }
      }
      if(rows.size > 0) models.Utils.getDBIntVal(rows.head, "COUNT") else 0
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNNotification} table : $user, $mps, ex: " + ex)
        0
      }
    }
  }

  def updateReadTime(mps: String, user: String, notificationList: List[Long], read: Boolean, readTs: Long): Try[String] = {
    try {
      val email= user.toLowerCase()
      val readTime = new java.sql.Timestamp(readTs)
      val notificationIds = DBUtils.scalaTosqlLongList(notificationList)
      val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_read=?, $Col_read_time=? WHERE $Col_email=? AND $Col_mps=? AND $Col_notification_id IN ($notificationIds);"
      val res = DB.updateQueryResult(q,List(read, readTime, email, mps))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update read time")
        case _ => Success(s"Updated info successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating rows in {$KsUMS.$CFNNotification} table : $notificationList, $mps, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def updateDeletedTime(mps: String, user: String, notificationList: List[Long], deleted: Boolean, deletedTs: Long): Try[String] = {
    try {
      val email= user.toLowerCase()
      val deletedTime = new java.sql.Timestamp(deletedTs)
      val notificationIds = DBUtils.scalaTosqlLongList(notificationList)
      val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_deleted = ?, $Col_deleted_time = ? WHERE $Col_email= ? AND $Col_mps = ? AND $Col_notification_id IN ($notificationIds);"
      val res = DB.updateQueryResult(q,List(deleted, deletedTime, email, mps))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update deleted time")
        case _ => Success(s"Updated info successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating rows in {$KsUMS.$CFNNotification} table : $notificationList, $mps, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def markAllReadTime(mpsOpt: Option[String], user: String, read: Boolean, readTs: Long): Try[String] = {
    try {
      val email= user.toLowerCase()
      val readTime = new java.sql.Timestamp(readTs)
      val res = mpsOpt match{
        case Some(mps) =>
          val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_read = ?, $Col_read_time = ? WHERE $Col_email= ? AND $Col_mps = ? ;"
          log.debug(s"Values: $read, $readTime, $email, $mps")
          DB.updateQueryResult(q,List(read, readTime, email, mps))
        case _ =>
          val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_read = ?, $Col_read_time = ? WHERE $Col_email= ? ;"
          log.debug(s"Values: $read, $readTime, $email")
          DB.updateQueryResult(q,List(readTime, readTime, email))
      }
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update read time")
        case _ => Success(s"Updated info successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating rows in {$KsUMS.$CFNNotification} table : $user, $mpsOpt, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def markAllDeletedTime(mpsOpt: Option[String], user: String, deleted: Boolean, deletedTs: Long): Try[String] = {
    try {
      val email= user.toLowerCase()
      val deletedTime = new java.sql.Timestamp(deletedTs)
      val res = mpsOpt match{
        case Some(mps) =>
          val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_deleted = ?, $Col_deleted_time = ? WHERE $Col_email= ? AND $Col_mps = ? ;"
          log.debug(s"Values: $deleted, $deletedTime, $email, $mps")
          DB.updateQueryResult(q,List(deleted, deletedTime, email, mps))
        case _ =>
          val q = s"UPDATE $KsUMS.$CFNNotification SET $Col_deleted = ?, $Col_deleted_time = ? WHERE $Col_email= ? ;"
          log.debug(s"Values: $deleted, $deletedTime, $email")
          DB.updateQueryResult(q,List(deleted, deletedTime, email))
      }
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update deleted time")
        case _ => Success(s"Updated info successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating rows in {$KsUMS.$CFNNotification} table : $user, $mpsOpt, ex: " + ex)
        Failure(ex)
      }
    }
  }

}
