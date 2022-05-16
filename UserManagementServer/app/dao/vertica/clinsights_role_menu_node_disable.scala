package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

import scala.util.{Failure, Success, Try}

object clinsights_role_menu_node_disable {
  val log = Logger("Dao_CLINSIGHTS_ROLE_MENU_NODE_DISABLE")

  /* start : columns of clinsights_role_menu_node_disable table*/
  lazy val Col_clinsights_role_id = "clinsights_role_id"
  lazy val Col_menu_id = "menu_id"
  lazy val Col_access_end_date = "access_end_date"
  /* end : columns of clinsights_role_menu_node_disable table*/

  def selectRows(clinsights_role_id: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsRoleMenuNodeDisable WHERE $Col_clinsights_role_id = ?;"
      log.debug(s"Values : $clinsights_role_id")
      val rows = DB.selectQueryResult(q,List(clinsights_role_id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table for clinsights_role_id : {$clinsights_role_id}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByTime(clinsights_role_id: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsRoleMenuNodeDisable WHERE $Col_clinsights_role_id = ? AND (TIMESTAMPDIFF(second, SYSDATE(), $Col_access_end_date) <= 0 OR $Col_access_end_date IS null);"
      log.debug(s"Values : $clinsights_role_id")
      val rows = DB.selectQueryResult(q,List(clinsights_role_id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table for mps : {$mps}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByMpsList(clinsightsRoleList: List[Long]): List[Map[String, Option[Any]]] = {
    try {
      val clinsightsRoles = DBUtils.scalaTosqlLongList(clinsightsRoleList)
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsRoleMenuNodeDisable WHERE $Col_clinsights_role_id IN ($clinsightsRoles);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table for role(s) : {$clinsightsRoleList}, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(clinsights_role_id: Long, menu_id: String, access_end_date: Option[Long]): Try[String] = {
    try {
      val ts = access_end_date match{
        case Some(t) => new java.sql.Timestamp(t)
        case _ => null
      }
      val q = s"INSERT INTO $KsUMS.$CFNClinsightsRoleMenuNodeDisable($Col_clinsights_role_id, $Col_menu_id, $Col_access_end_date) VALUES(?,?,$ts);"
      log.debug(s"Values: $clinsights_role_id, $menu_id")
      val res = DB.insertQueryResult(q,List(clinsights_role_id, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def updateRow(clinsights_role_id: Long, menu_id: String, access_end_date: Option[Long]): Try[String] = {
    try{
      val ts = access_end_date match{
        case Some(t) => new java.sql.Timestamp(t)
        case _ => null
      }
      val q = s"UPDATE $KsUMS.$CFNClinsightsRoleMenuNodeDisable SET $Col_access_end_date = $ts WHERE $Col_clinsights_role_id = ? and $Col_menu_id = ?;"
      log.debug(s"Values: $clinsights_role_id, $menu_id")
      val res = DB.updateQueryResult(q,List(clinsights_role_id, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def deleteRow(clinsights_role_id: Long, menu_id: String): Try[String] = {
    try{
      val q = s"DELETE FROM $KsUMS.$CFNClinsightsRoleMenuNodeDisable WHERE $Col_clinsights_role_id = ? and $Col_menu_id = ?;"
      log.debug(s"Values: $clinsights_role_id, $menu_id")
      val res = DB.updateQueryResult(q,List(clinsights_role_id, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry in {$KsUMS.$CFNClinsightsRoleMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }
}
