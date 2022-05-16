package dao.vertica

import play.api.Logger
import constants._
import models.DB

object clinsights_master_menu {
  val log = Logger("Dao_CLINSIGHTS_MASTER_MENU")

  /* start : columns of clinsight_master_menu table*/
  lazy val Col_menu_id = "menu_id"
  lazy val Col_parent_node_id = "parent_node_id"
  lazy val Col_sequence = "sequence"
  lazy val Col_name = "name"
  lazy val Col_report_url = "report_url"
  /* end : columns of clinsight_master_menu table*/

  def selectRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsMasterMenu ORDER BY $Col_parent_node_id, $Col_sequence ASC;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsMasterMenu} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByMenuId(id: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsMasterMenu WHERE $Col_menu_id = ?;"
      log.debug(s"Values : $id")
      val rows = DB.selectQueryResult(q,List(id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsMasterMenu} table for id : {$id}, ex: " + ex)
        List()
      }
    }
  }
}
