package dao.vertica

import java.sql.Timestamp

import play.api.Logger
import constants._
import dao.vertica.user.{Col_email, Col_first_name, Col_last_name, Col_mps_def, Col_realm_id, log, mapUserState}
import models.DB

object user_by_mps {
  val log = Logger("Dao_USER_BY_MPS")

  /* start : columns of user_by_mps table*/
  lazy val Col_mps = "mps"
  lazy val Col_email = "email"
  lazy val Col_last_access = "last_access"
  lazy val Col_last_login = "last_login"
  lazy val Col_last_logout = "last_logout"
  lazy val Col_last_sess_id = "last_sess_id"
  lazy val Col_otp = "otp"
  lazy val Col_otp_generation_time = "otp_generation_time"
  /* end : columns of user_by_mps table*/

  def selectRow(mps: String, email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUserByMps WHERE $Col_mps= ? and $Col_email= ?;"
      val rows = DB.selectQueryResult(q,List(mps,email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserByMps} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def getLastSessionId(mps:String, email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_last_sess_id,$Col_last_access FROM $KsUMS.$CFNUserByMps WHERE $Col_mps= ? and $Col_email=? order by $Col_last_access desc LIMIT 1;"
      val rows = DB.selectQueryResult(q,List(mps,email))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserByMps} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def updateLastLogout(mps:String, email: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUserByMps set $Col_last_logout = ? WHERE $Col_mps = ? AND $Col_email = ?;"
      val res = DB.updateQueryResult(q, List(currTime, mps, email))
      res match {
        case Some(SQL_ERROR) => {
          log.error(s"Failed to update last logout time $KsUMS.$CFNUserByMps.$email")
          None
        }
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating last logout in {$KsUMS.$CFNUserByMps} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateLastAccess(mps:String, email: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUserByMps set $Col_last_access = ? WHERE $Col_mps = ? AND $Col_email = ?;"
      val res = DB.updateQueryResult(q, List(currTime, mps, email))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating last access in {$KsUMS.$CFNUserByMps} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateOTPTime(mps:String, otp: String, otpTime: Timestamp, email: String): Option[String] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUserByMps set $Col_otp = ?, $Col_otp_generation_time = ? WHERE $Col_mps = ? AND $Col_email = ?;"
      log.debug(s"Values : $otp, $otpTime, $mps, $email")
      val res = DB.updateQueryResult(q, List(otp, otpTime, mps, email))
      res match {
        case Some(SQL_ERROR) => None
        case _ => Some("otp successfully updated")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating last access in {$KsUMS.$CFNUserByMps} table : $mps, ex: " + ex)
        None
      }
    }
  }

  def upsertOTPTime(mps:String, otp: String, otpTime: Timestamp, email: String, first_name: String, last_name: String): Option[String] = {
    try {
      val readQry = s"SELECT * FROM $KsUMS.$CFNUserByMps WHERE $Col_mps = ? AND $Col_email = ?;"
      val readRes = DB.selectQueryResult(readQry, List(mps, email))
      if(readRes.size > 0){
        updateOTPTime(mps, otp, otpTime, email.toLowerCase())
      } else{
        val q = s"INSERT INTO $KsUMS.$CFNUserByMps ($Col_mps, $Col_email, $Col_first_name, $Col_last_name, $Col_otp, $Col_otp_generation_time) VALUES (?, ?, ?, ?, ?, ?);"
        log.debug(s"Values : $mps, $email, $first_name, $last_name, $otp, $otpTime")
        val res = DB.insertQueryResult(q, List(mps, email, first_name, last_name, otp, otpTime))
        res match {
          case Some(SQL_ERROR) => None
          case _ => Some("otp successfully updated")
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating last access in {$KsUMS.$CFNUserByMps} table : $mps, ex: " + ex)
        None
      }
    }
  }

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT mps, email, last_access, last_logout, last_login, last_sess_id FROM $KsUMS.$CFNUserByMps;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserByMps} table : ex: " + ex)
        List()
      }
    }
  }

  def userLoginActivity(mps:String,email: String,first_name: String,last_name: String,last_sess_id: String): Option[String] = {
    val currTime = new java.sql.Timestamp(System.currentTimeMillis())
    try {
      val q_s = s"SELECT email FROM $KsUMS.$CFNUserByMps WHERE $Col_mps=? AND $Col_email=?;"
      val rows = DB.selectQueryResult(q_s,List(mps,email))
      if(rows.size == 0) {
        val q = s"INSERT INTO $KsUMS.$CFNUserByMps (mps, email, first_name, last_name, last_access, last_login, last_sess_id) VALUES (?, ?, ?, ?, ?, ?, ?);"
        val res = DB.insertQueryResult(q, List(mps, email, first_name, last_name, currTime, currTime, last_sess_id))
        res match {
          case Some(SQL_ERROR) => {
            log.error("Failed to track User login activity")
            None
          }
          case _ => None
        }
      } else {
        val q = s"UPDATE $KsUMS.$CFNUserByMps SET $Col_last_access = ?, $Col_last_login = ?, $Col_last_sess_id = ? WHERE $Col_mps=? AND $Col_email=?;"
        val res = DB.updateQueryResult(q, List(currTime, currTime, last_sess_id, mps, email))
        res match {
          case Some(SQL_ERROR) => {
            log.error("Failed to track User login activity")
            None
          }
          case _ => None
        }

      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting {$KsUMS.$CFNUserByMps} table : $email ex: " + ex)
        None
      }
    }
  }
  def addUser(mps:String,email: String,first_name: String,last_name: String): Option[String] = {
    try {

      val q_s = s"DELETE FROM $KsUMS.$CFNUserByMps WHERE $Col_mps=? AND $Col_email=?;"
      DB.deleteQueryResult(q_s, List(mps, email))
      val q = s"INSERT INTO $KsUMS.$CFNUserByMps (mps, email, first_name, last_name) VALUES (?, ?, ?, ?);"
      DB.insertQueryResult(q, List(mps, email, first_name, last_name))
      None
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting {$KsUMS.$CFNUserByMps} table : $email ex: " + ex)
        None
      }
    }
  }

}
