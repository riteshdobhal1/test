package dao.vertica

import play.api.Logger
import constants._
import models.DB

object org {
  val log = Logger("Dao_ORG")

  /* start : columns of org table*/
  lazy val Col_mfr_id = "mfr_id"
  lazy val Col_name = "name"
  lazy val Col_description = "description"
  lazy val Col_type = "type"
  lazy val Col_max_users = "max_users"
  lazy val Col_max_licensed_users = "max_licensed_users"
  lazy val Col_max_creator_licenses = "max_creator_licenses"
  lazy val Col_max_viewer_licenses = "max_viewer_licenses"
  lazy val Col_Two_Auth_Enabled = "two_auth_enabled"
  lazy val Col_Two_Auth_Trigger_Duration = "two_auth_trigger_duration"
  lazy val Col_email_template_body = "email_template_body"
  lazy val Col_email_template_subject = "email_template_subject"
  lazy val Col_email_template_header = "email_template_header"
  lazy val Col_email_template_footer = "email_template_footer"
  lazy val Col_email_template_link = "email_template_link"
  lazy val Col_email_template_link_expiry = "email_template_link_expiry"
  lazy val Col_end_customer_domain = "end_customer_domain"

  /* end : columns of org table*/

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNOrg;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNOrg} table, ex: " + ex)
        List()
      }
    }
  }


  def selectRows(name: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNOrg where $Col_name=?;"
      val rows = DB.selectQueryResult(q,List(name))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNOrg} table : $name, ex: " + ex)
        List()
      }
    }
  }

  def selectOrgName(typeId: Int): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT name FROM $KsUMS.$CFNOrg where $Col_type=?;"
      val rows = DB.selectQueryResult(q,List(typeId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting org name from {$KsUMS.$CFNOrg} table : $typeId, ex: " + ex)
        List()
      }
    }
  }

  def selectAllOrgName(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT name FROM $KsUMS.$CFNOrg;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all org name from {$KsUMS.$CFNOrg} table, ex: " + ex)
        List()
      }
    }
  }

  def selectOrgId(orgName: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_mfr_id FROM $KsUMS.$CFNOrg where $Col_name=?;"
      val rows = DB.selectQueryResult(q,List(orgName))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting mfr_id from {$KsUMS.$CFNOrg} table : $orgName, ex: " + ex)
        List()
      }
    }
  }

}
