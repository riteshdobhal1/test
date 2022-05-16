package dao.vertica

import play.api.Logger
import constants._
import models.DB
import java.util.Date

object prospect {
  val log = Logger("Dao_PROSPECT")

  /* start : columns of prospect table*/
  lazy val Col_email = "email"
  lazy val Col_first_name = "first_name"
  lazy val Col_last_name = "last_name"
  lazy val Col_passwd_hash = "passwd_hash"
  lazy val Col_org = "org"
  lazy val Col_phone = "phone"
  lazy val Col_city = "city"
  lazy val Col_state = "state"
  lazy val Col_country = "country"
  lazy val Col_created_on = "created_on"
  lazy val Col_veri_code = "veri_code"
  lazy val Col_role = "role"
  lazy val Col_realm_def = "realm_def"
  lazy val Col_url_def = "url_def"
  lazy val Col_mps_def = "mps_def"
  lazy val Col_campaigns = "campaigns"
  lazy val Col_company_name = "company_name"
  /* end : columns of prospect table*/

  def insertRow(email: String, f_name: String, l_name: String, encPasswd: String, org: String, ts: java.sql.Timestamp, tokenId: String, role: String, realm_def: String, url_def: String, mps_def: String, company_name: String): Option[String] = {
    try {
      val q = s"INSERT INTO $KsUMS.$CFNProspect ($Col_email, $Col_first_name, $Col_last_name, $Col_passwd_hash, $Col_org, $Col_created_on, $Col_veri_code, $Col_role, $Col_realm_def, $Col_url_def, $Col_mps_def, $Col_company_name) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(q,List(email.toLowerCase(), f_name, l_name, encPasswd, org, ts, tokenId, role, realm_def, url_def, mps_def, company_name))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        None
      }
    }
  }

  def isRowAvailable(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_email FROM $KsUMS.$CFNProspect WHERE $Col_email=?;"
      val res = DB.selectQueryResult(q,List(email.toLowerCase))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def selectRow(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNProspect WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting prospect from {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def selectProspect(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_veri_code, $Col_first_name, $Col_last_name FROM $KsUMS.$CFNProspect WHERE $Col_email= ?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting prospect from {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def deleteRow(email: String): Option[String] = {
    try {
      val q = s"DELETE FROM $KsUMS.$CFNProspect WHERE $Col_email=?;"
      val res = DB.deleteQueryResult(q,List(email.toLowerCase))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateCreatedOn(email: String, createdOn: Date): Option[String] = {
    try {
      val q = s"Update $KsUMS.$CFNProspect set $Col_created_on = ? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(createdOn,email.toLowerCase))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNProspect} table : $email, ex: " + ex)
        None
      }
    }
  }

}
