package dao.vertica

import play.api.Logger
import constants._
import models.DB
import dao.DBUtils

object end_customer {
  val log = Logger("Dao_END_CUSTOMER")

  /* start : columns of end_customer table*/
  lazy val Col_endcustomer_id = "endcustomer_id"
  lazy val Col_mps = "mps"
  lazy val Col_endcustomer_name = "endcustomer_name"
  lazy val Col_dashboard_enabled = "dashboard_enabled"
  lazy val Col_created_by = "created_by"
  lazy val Col_updated_on = "updated_on"
  /* end : columns of end_customer table*/

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomer;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRows(mfr: String, prod: String, sch: String): List[Map[String, Option[Any]]] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomer WHERE $Col_mps=?;"
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEndCustomerRows(mfr: String, prod: String, sch: String, ec_name: String): List[Map[String, Option[Any]]] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomer WHERE $Col_mps=? AND $Col_endcustomer_name=?;"
      val rows = DB.selectQueryResult(q,List(mps, ec_name))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(mfr: String, prod: String, sch: String, endcustomer: String, user: String, ts: Long): Option[String] = {
    try{
      val mps = s"$mfr/$prod/$sch"
      val epoch = new java.sql.Timestamp(ts)
      val q = s"INSERT INTO $KsUMS.$CFNEndCustomer($Col_mps, $Col_endcustomer_name, $Col_created_by, $Col_updated_on) VALUES(?, ?, ?, ?);"
      val res = DB.insertQueryResult(q,List(mps, endcustomer, user, epoch))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def updateRow(mfr: String, prod: String, sch: String, endcustomer: String, user: String, ts: Long): Option[String] = {
    try{
      val mps = s"$mfr/$prod/$sch"
      val epoch = new java.sql.Timestamp(ts)
      val q = s"UPDATE $KsUMS.$CFNEndCustomer SET $Col_created_by = ?, $Col_updated_on = ? WHERE $Col_mps = ? and $Col_endcustomer_name = ?;"
      val res = DB.updateQueryResult(q,List(user, epoch, mps, endcustomer))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def getRowsCount(mfr:String, prod: String, sch: String, endcustomer_name: String): Int = {
    try{
      val mps = s"$mfr/$prod/$sch"
      val q = s"SELECT * FROM $KsUMS.$CFNEndCustomer WHERE $Col_mps = ? and $Col_endcustomer_name = ?;"
      val rows = DB.selectQueryResult(q,List(mps,endcustomer_name))
      rows.size
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching count of {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        0
      }
    }
  }

  def deleteRows(mfr: String, prod: String, sch: String, endCustomerList: List[String]): Option[String] = {
    try{
      val endCustomers = DBUtils.scalaTosqlList(endCustomerList)
      val mps = s"$mfr/$prod/$sch"
      val q = s"DELETE FROM $KsUMS.$CFNEndCustomer WHERE $Col_mps = ? and $Col_endcustomer_name IN ($endCustomers);"
      val res = DB.deleteQueryResult(q,List(mps))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows from {$KsUMS.$CFNEndCustomer} table : {$endCustomerList}, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def getEcRowsData(emailList: List[String], includeEmailIds: Boolean = false): List[Map[String, Option[Any]]] = {
    try {
      val q = if(includeEmailIds){
        val emailIds = DBUtils.scalaTosqlList(emailList)
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on, $KsUMS.$CFNEndCustomerSerials.serial_number FROM $KsUMS.$CFNEndCustomer, $KsUMS.$CFNEndCustomerSerials WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_id=$KsUMS.$CFNEndCustomerSerials.$Col_endcustomer_id AND $KsUMS.$CFNEndCustomer.$Col_created_by IN ($emailIds);"
      } else {
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on, $KsUMS.$CFNEndCustomerSerials.serial_number FROM $KsUMS.$CFNEndCustomer, $KsUMS.$CFNEndCustomerSerials WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_id=$KsUMS.$CFNEndCustomerSerials.$Col_endcustomer_id;"
      }
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def getEcGroupRowsData(emailList: List[String], includeEmailIds: Boolean = false): List[Map[String, Option[Any]]] = {
    try {
      val q = if(includeEmailIds){
        val emailIds = DBUtils.scalaTosqlList(emailList)
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on, $KsUMS.$CFNEndCustomerGroup.sub_group_id FROM $KsUMS.$CFNEndCustomer, $KsUMS.$CFNEndCustomerGroup WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_id=$KsUMS.$CFNEndCustomerGroup.group_id AND $KsUMS.$CFNEndCustomer.$Col_created_by IN ($emailIds);"
      } else {
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on, $KsUMS.$CFNEndCustomerGroup.sub_group_id FROM $KsUMS.$CFNEndCustomer, $KsUMS.$CFNEndCustomerGroup WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_id=$KsUMS.$CFNEndCustomerGroup.group_id;"
      }
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEcIds(ecNameList: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val ecNames = DBUtils.scalaTosqlList(ecNameList)
      val q = s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id) FROM $KsUMS.$CFNEndCustomer WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_name IN ($ecNames);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def selectEcIdsName(ecIdList: List[Long]): List[Map[String, Option[Any]]] = {
    try {
      val ecIds = DBUtils.scalaTosqlLongList(ecIdList)
      val q = s"SELECT $Col_endcustomer_id, $Col_endcustomer_name FROM $KsUMS.$CFNEndCustomer WHERE $KsUMS.$CFNEndCustomer.$Col_endcustomer_id IN ($ecIds);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def getOnlyEcRowsData(emailList: List[String], includeEmailIds: Boolean = false): List[Map[String, Option[Any]]] = {
    try {
      val q = if(includeEmailIds){
        val emailIds = DBUtils.scalaTosqlList(emailList)
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on FROM $KsUMS.$CFNEndCustomer WHERE $KsUMS.$CFNEndCustomer.$Col_created_by IN ($emailIds);"
      } else {
        s"SELECT Distinct($KsUMS.$CFNEndCustomer.$Col_endcustomer_id), $Col_endcustomer_name, $Col_mps, $Col_dashboard_enabled, $Col_created_by, $Col_updated_on FROM $KsUMS.$CFNEndCustomer;"
      }
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }

  def selectUserGroupSysIds(email: String): List[Map[String, Option[Any]]] = {
    try{
      val q = s"SELECT $KsUMS.$CFNEndCustomerSerials.serial_number, $KsUMS.$CFNUser.end_customer from $KsUMS.$CFNUser, $KsUMS.$CFNEndCustomer, $KsUMS.$CFNEndCustomerGroup, $KsUMS.$CFNEndCustomerSerials WHERE $KsUMS.$CFNUser.email='$email' AND $KsUMS.$CFNUser.end_customer= $KsUMS.$CFNEndCustomer.endcustomer_name AND $KsUMS.$CFNEndCustomer.endcustomer_id = $KsUMS.$CFNEndCustomerGroup.group_id AND $KsUMS.$CFNEndCustomerGroup.sub_group_id = $KsUMS.$CFNEndCustomerSerials.endcustomer_id;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNEndCustomer} table, ex: " + ex)
        List()
      }
    }
  }
}
