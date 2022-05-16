package dao.vertica

import play.api.Logger
import constants._
import models.DB
import dao.DBUtils

object alert_filter_attributes {
  val log = Logger("Dao_ALERT_FILTER_ATTRIBUTES")

  /* start : columns of alert_filter_attributes table*/
  lazy val Col_filter_id = "filter_id"
  lazy val Col_mps = "mps"
  lazy val Col_rule_id = "rule_id"
  lazy val Col_email = "email"
  lazy val Col_group = "grp"
  lazy val Col_exc_sys_ids = "exc_sys_ids"
  /* end : columns of alert_filter_attributes table*/

  def selectAlertFiltersRows(mfr: String, prod: String, sch: String, queryString: String): List[Map[String, Option[Any]]] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val q = s"SELECT * FROM $KsUMS.$CFNAlertFilterAttributes WHERE $queryString ;"
      log.debug(s"select alerts filter query : $q")
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(mps: String, ruleId: Long, email: String, group: String, excSysIds: String): Option[String] = {
    try {
      val q = s"INSERT INTO $KsUMS.$CFNAlertFilterAttributes($Col_mps, $Col_rule_id, $Col_email, $Col_group, $Col_exc_sys_ids) VALUES('$mps', $ruleId, '$email', '$group', '$excSysIds');"
      val res = DB.insertQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to insert.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to insert.")
      }
    }
  }

  def updateRowExcSysIds(mps: String, ruleId: Long, email: String, group: String, excSysIds: String): Option[String] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNAlertFilterAttributes SET $Col_exc_sys_ids = '$excSysIds' WHERE $Col_mps = '$mps' AND $Col_rule_id = $ruleId AND $Col_email = '${email.toLowerCase()}' AND $Col_group = '$group';"
      val res = DB.updateQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to update.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to update.")
      }
    }
  }

  def deleteByRuleId(mps: String, ruleIdList: List[Long]): Option[String] = {
    try {
      val ruleIds = DBUtils.scalaTosqlLongList(ruleIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_rule_id IN ($ruleIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByRuleIdsEmailId(mps: String, ruleIdList: List[Long], emailId: String): Option[String] = {
    try {
      val ruleIds = DBUtils.scalaTosqlLongList(ruleIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' and $Col_email = '$emailId' and $Col_rule_id IN ($ruleIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByEmailIdsRuleId(mps: String, emailIdList: List[String], ruleId: Long): Option[String] = {
    try {
      val emailIds = DBUtils.scalaTosqlList(emailIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' and $Col_rule_id = '$ruleId' and $Col_email IN ($emailIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByEmailId(emailIdList: List[String]): Option[String] = {
    try {
      val emailIds = DBUtils.scalaTosqlList(emailIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_email IN ($emailIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByMPSEmailId(mps: String, emailIdList: List[String]): Option[String] = {
    try {
      val emailIds = DBUtils.scalaTosqlList(emailIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_email IN ($emailIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByRuleIdEmailIdGroup(mps: String, ruleId: Long, emailId: String, group: String): Option[String] = {
    try {
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_rule_id = $ruleId AND $Col_email = '$emailId' AND $Col_group = '$group';"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def selectRowCount(mps: String, ruleId: Long, email: String, group: String): Int = {
    try {
      val q = s"SELECT $Col_rule_id FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_rule_id = $ruleId AND $Col_email = '${email.toLowerCase()}' AND $Col_group = '$group' ;"
      val rows = DB.selectQueryResult(q,List())
      rows.size
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows count from {$KsUMS.$CFNAlertFilterAttributes} table : $email, ex: " + ex)
        0
      }
    }
  }

  def deleteByGroupsName(mps: String, groupList: List[String]): Option[String] = {
    try {
      val groups = DBUtils.scalaTosqlList(groupList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_group IN ($groups);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def deleteByFilterId(filterIdList: List[Long]): Option[String] = {
    try {
      val filterIds = DBUtils.scalaTosqlLongList(filterIdList)
      val q = s"DELETE FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_filter_id IN ($filterIds);"
      val res = DB.deleteQueryResult(q, List())
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting rows in {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        Some("Failed to delete.")
      }
    }
  }

  def selectRowsFilterGroup(mps: String, ruleId: Long, email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_filter_id, $Col_group FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_rule_id = $ruleId AND $Col_email = '$email';"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsRuleIds(mps: String, emailList: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val emailIds = DBUtils.scalaTosqlList(emailList)
      val q = s"SELECT $Col_mps, $Col_rule_id, $Col_email FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_mps = '$mps' AND $Col_email IN ($emailIds);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRowsFilterEmail(emailList: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val emails = DBUtils.scalaTosqlList(emailList)
      val q = s"SELECT $Col_filter_id, $Col_group FROM $KsUMS.$CFNAlertFilterAttributes WHERE $Col_email IN ($emails);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNAlertFilterAttributes} table, ex: " + ex)
        List()
      }
    }
  }
}
