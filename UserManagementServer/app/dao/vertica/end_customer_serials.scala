package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object end_customer_serials {
  val log = Logger("Dao_END_CUSTOMER_SERIALS")

  /* start : columns of end_customer_serials table*/
  lazy val Col_serial_number = "serial_number"
  lazy val Col_endcustomer_id = "endcustomer_id"
  /* end : columns of end_customer_serials table*/

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerSerials;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNEndCustomerSerials} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRows(endCustomerId: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerSerials WHERE $Col_endcustomer_id=?;"
      val rows = DB.selectQueryResult(q,List(endCustomerId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomerSerials} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEndCustomerSerialsRows(ecIds: List[Long]): List[Map[String, Option[Any]]] = {
    try {
      val ecList = DBUtils.scalaTosqlLongList(ecIds)
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomerSerials WHERE $Col_endcustomer_id IN ($ecList);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomerSerials} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEndCustomerSerialsNameRows(ecIds: List[Long]): List[Map[String, Option[Any]]] = {
    try {
      if(ecIds.size>0) {
        val ecList = DBUtils.scalaTosqlLongList(ecIds)
        val q = s"SELECT $Col_serial_number, $KsUMS.$CFNEndCustomerSerials.$Col_endcustomer_id, $KsUMS.$CFNEndCustomer.endcustomer_name FROM $KsUMS.$CFNEndCustomerSerials, $KsUMS.$CFNEndCustomer WHERE $KsUMS.$CFNEndCustomerSerials.$Col_endcustomer_id = $KsUMS.$CFNEndCustomer.$Col_endcustomer_id AND $KsUMS.$CFNEndCustomerSerials.$Col_endcustomer_id IN ($ecList);"
        val rows = DB.selectQueryResult(q, List())
        rows
      } else List()
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomerSerials} table, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(serial_number: String, endCustomerId: Long): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNEndCustomerSerials($Col_serial_number, $Col_endcustomer_id) VALUES(?, ?);"
      val res = DB.insertQueryResult(q,List(serial_number, endCustomerId))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNEndCustomerSerials} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteRows(endCustomerList: List[Long]): Option[String] = {
    try{
      val endCustomerIds = DBUtils.scalaTosqlLongList(endCustomerList)
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomerSerials WHERE $Col_endcustomer_id IN ($endCustomerIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomerSerials} table : {$endCustomerList}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteSerialNumberRows(serialNumbers: List[String], endCustomerList: List[Long]): Option[String] = {
    try{
      val serialNumberList = DBUtils.scalaTosqlList(serialNumbers)
      val endCustomerIds = DBUtils.scalaTosqlLongList(endCustomerList)
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomerSerials WHERE $Col_serial_number IN ($serialNumberList) AND $Col_endcustomer_id IN ($endCustomerIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomerSerials} table : {$serialNumbers}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }
}
