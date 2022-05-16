package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

import scala.util.{Failure, Success, Try}

object clinsights_mps_menu_node_disable {
  val log = Logger("Dao_CLINSIGHTS_MPS_MENU_NODE_DISABLE")

  /* start : columns of clinsights_mps_menu_node_disable table*/
  lazy val Col_mps = "mps"
  lazy val Col_menu_id = "menu_id"
  lazy val Col_access_end_date = "access_end_date"
  /* end : columns of clinsights_mps_menu_node_disable table*/

  def selectRows(mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsMpsMenuNodeDisable WHERE $Col_mps = ?;"
      log.debug(s"Values : $mps")
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table for mps : {$mps}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByTime(mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsMpsMenuNodeDisable WHERE $Col_mps = ? AND (TIMESTAMPDIFF(second, SYSDATE(), $Col_access_end_date) <= 0 OR $Col_access_end_date IS null);"
      log.debug(s"Values : $mps")
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table for mps : {$mps}, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsByMpsList(mpsList: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val mpses = DBUtils.scalaTosqlList(mpsList)
      val q = s"SELECT * FROM $KsUMS.$CFNClinsightsMpsMenuNodeDisable WHERE $Col_mps IN ($mpses);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table for mps : {$mpsList}, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(mps: String, menu_id: String, access_end_date: Option[Long]): Try[String] = {
    try {
      val ts = access_end_date match{
        case Some(t) => new java.sql.Timestamp(t)
        case _ => null
      }
      val q = s"INSERT INTO $KsUMS.$CFNClinsightsMpsMenuNodeDisable($Col_mps, $Col_menu_id, $Col_access_end_date) VALUES(?,?,$ts);"
      log.debug(s"Values: $mps, $menu_id")
      val res = DB.insertQueryResult(q,List(mps, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def updateRow(mps: String, menu_id: String, access_end_date: Option[Long]): Try[String] = {
    try{
      val ts = access_end_date match{
        case Some(t) => new java.sql.Timestamp(t)
        case _ => null
      }
      val q = s"UPDATE $KsUMS.$CFNClinsightsMpsMenuNodeDisable SET $Col_access_end_date = $ts WHERE $Col_mps = ? and $Col_menu_id = ?;"
      log.debug(s"Values: $mps, $menu_id")
      val res = DB.updateQueryResult(q,List(mps, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }

  def deleteRow(mps: String, menu_id: String): Try[String] = {
    try{
      val q = s"DELETE FROM $KsUMS.$CFNClinsightsMpsMenuNodeDisable WHERE $Col_mps = ? and $Col_menu_id = ?;"
      log.debug(s"Values: $mps, $menu_id")
      val res = DB.updateQueryResult(q,List(mps, menu_id))
      res match {
        case Some(x) => throw new RuntimeException(x)
        case _ => Success("success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry in {$KsUMS.$CFNClinsightsMpsMenuNodeDisable} table, ex: " + ex)
        Failure(ex)
      }
    }
  }
}
