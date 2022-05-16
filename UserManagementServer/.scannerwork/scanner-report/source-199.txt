package dao.vertica

import play.api.Logger
import constants._
import models.DB

object clinsights_role {
  val log = Logger("Dao_CLINSIGHTS_ROLE")

  /* start : columns of clinsights_role table*/
  lazy val Col_clinsights_role_id = "clinsights_role_id"
  lazy val Col_mps = "mps"
  lazy val Col_clinsights_role_name = "clinsights_role_name"
  lazy val Col_inactive_dashboard_message = "inactive_dashboard_message"
  lazy val Col_landing_page_report_url_id = "landing_page_report_url_id"
  /* end : columns of clinsights_role table*/

  def selectRowsByName(mps: String, role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsRole WHERE $Col_mps = ? AND $Col_clinsights_role_name = ?;"
      log.debug(s"Values : $mps, $roleName")
      val rows = DB.selectQueryResult(q,List(mps, roleName))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsRole} table for mps : {$mps} and role : {$role}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsById(mps: String, role: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsRole WHERE $Col_clinsights_role_id = $role;"
      log.debug(s"Values : $role")
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsRole} table for mps : {$mps} and role : {$role}, ex: " + ex)
        List()
      }
    }
  }
}
