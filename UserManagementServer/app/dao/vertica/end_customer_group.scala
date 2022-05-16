package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object end_customer_group {
  val log = Logger("Dao_END_CUSTOMER_GROUP")

  /* start : columns of end_customer_group table*/
  lazy val Col_sub_group_id = "sub_group_id"
  lazy val Col_group_id = "group_id"
  /* end : columns of end_customer_group table*/

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerGroup;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNEndCustomerGroup} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRows(groupId: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerGroup WHERE $Col_group_id=?;"
      val rows = DB.selectQueryResult(q,List(groupId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomerGroup} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEndCustomerSubGroupsRows(groupIds: List[Long]): List[Map[String, Option[Any]]] = {
    try {
      val groupList = DBUtils.scalaTosqlLongList(groupIds)
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerGroup WHERE $Col_group_id IN ($groupList);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomerGroup} table, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(subGroupId: Long, groupId: Long): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNEndCustomerGroup($Col_sub_group_id, $Col_group_id) VALUES(?, ?);"
      val res = DB.insertQueryResult(q,List(subGroupId, groupId))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNEndCustomerGroup} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteRows(groupList: List[Long]): Option[String] = {
    try{
      val groupIds = DBUtils.scalaTosqlLongList(groupList)
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomerGroup WHERE $Col_group_id IN ($groupIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomerGroup} table : {$groupList}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteSubGroupRows(groupList: List[Long]): Option[String] = {
    try{
      val groupIds = DBUtils.scalaTosqlLongList(groupList)
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomerGroup WHERE $Col_sub_group_id IN ($groupIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomerGroup} table : {$groupList}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteGroupSubGroupRows(subGroupList: List[Long], groupId: Long): Option[String] = {
    try{
      val groupIds = DBUtils.scalaTosqlLongList(subGroupList)
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomerGroup WHERE $Col_group_id=$groupId AND $Col_sub_group_id IN ($groupIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomerGroup} table : {$subGroupList}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }
}
