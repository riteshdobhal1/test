package dao.vertica

import play.api.Logger
import constants._
import models.DB

object clinsights_dashboard {
  val log = Logger("Dao_CLINSIGHTS_DASHBOARD")

  /* start : columns of clinsights_dashboard table*/
  lazy val Col_dashboard_id = "dashboard_id"
  lazy val Col_mps = "mps"
  lazy val Col_d_id = "d_id"
  lazy val Col_r_id = "r_id"
  lazy val Col_base_url = "base_url"
  lazy val Col_landing_page_report_url_id = "landing_page_report_url_id"
  /* end : columns of clinsights_dashboard table*/

  def selectRows(mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsDashboard WHERE $Col_mps = ?;"
      log.debug(s"Values : $mps")
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsDashboard} table for mps : {$mps}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsById(mps: String, dashboard_id: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsDashboard WHERE $Col_mps = ? AND $Col_dashboard_id = ?;"
      log.debug(s"Values : $mps, $dashboard_id")
      val rows = DB.selectQueryResult(q,List(mps, dashboard_id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsDashboard} table for mps : {$mps} and dashboard_id : {$dashboard_id}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByIds(mps: String, d_id: String, r_id: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsDashboard WHERE $Col_mps = ? AND $Col_d_id = ? AND $Col_r_id = ?;"
      log.debug(s"Values : $mps, $d_id, $r_id")
      val rows = DB.selectQueryResult(q,List(mps, d_id, r_id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsDashboard} table for mps : {$mps} and d_id : {$d_id} and r_id : {$r_id}, ex: " + ex)
        List()
      }
    }
  }
}
