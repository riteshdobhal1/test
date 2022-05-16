package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object user_device_info {
  val log = Logger("Dao_USER_DEVICE_INFO")

  /* start : columns of user_device_info table*/
  lazy val Col_email = "email"
  lazy val Col_app_type = "app_type"
  lazy val Col_device_token = "device_token"
  lazy val Col_app_id = "app_id"
  /* end : columns of user_device_info table*/

  def selectRows(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUserDeviceInfo where $Col_email= ?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNUserDeviceInfo} table : ${email.toLowerCase()}, ex: " + ex)
        List()
      }
    }
  }

  def selectTokenRows(device_token: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_email FROM $KsUMS.$CFNUserDeviceInfo WHERE $Col_device_token=?;"
      log.debug(s"values : $device_token")
      DB.selectQueryResult(q,List(device_token))
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserDeviceInfo} table : ex: " + ex)
        List()
      }
    }
  }

  def insertRow(emailId: String, app_type: Int, device_token: String, app_id: String): Option[String] = {
    try{
      val email = emailId.toLowerCase()
      val q = s"INSERT INTO $KsUMS.$CFNUserDeviceInfo ($Col_email, $Col_app_type, $Col_device_token, $Col_app_id) VALUES(?, ?, ?, ?);"
      log.debug(s"values : $email, $app_type, $device_token, $app_id")
      val res = DB.insertQueryResult(q,List(email, app_type, device_token, app_id))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUserDeviceInfo} table, ex: " + ex)
        None
      }
    }
  }

  def deleteRow(emailId: String, app_type: Int, device_token: String): Option[String] = {
    try {
      val email = emailId.toLowerCase()
      val q = s"DELETE FROM $KsUMS.$CFNUserDeviceInfo WHERE $Col_email = ? AND $Col_app_type = ? AND $Col_device_token = ?;"
      log.debug(s"values : $email, $app_type, $device_token")
      val res = DB.deleteQueryResult(q,List(email, app_type, device_token))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNUserDeviceInfo} table : $emailId, $app_type, $device_token, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteUserDeviceRow(emailId: String, device_token: String): Option[String] = {
    try {
      val email = emailId.toLowerCase()
      val q = s"DELETE FROM $KsUMS.$CFNUserDeviceInfo WHERE $Col_email = ? AND $Col_device_token = ?;"
      log.debug(s"values : $email, $device_token")
      val res = DB.deleteQueryResult(q,List(email, device_token))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNUserDeviceInfo} table : $emailId, $device_token, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteUsersRows(emailId: String): Option[String] = {
    try {
      val email = emailId.toLowerCase()
      val q = s"DELETE FROM $KsUMS.$CFNUserDeviceInfo WHERE $Col_email = ?;"
      log.debug(s"values : $email")
      val res = DB.deleteQueryResult(q,List(email))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNUserDeviceInfo} table : $emailId, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

}
