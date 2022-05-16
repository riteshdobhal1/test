package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object role_mps_feature_attributes {
  val log = Logger("Dao_ROLE_MPS_FEATURE_ATTRIBUTES")

  /* start : columns of role_mps_feature_attributes table*/
  lazy val Col_mps = "mps"
  lazy val Col_role_id = "role_id"
  lazy val Col_feature_id = "feature_id"
  lazy val Col_explorer_date_range = "explorer_date_range"
  /* end : columns of role_mps_feature_attributes table*/

  def selectRows(roleId: Long, mpsOpt: Option[String]): List[Map[String, Option[Any]]] = {
    try {
      val mps = mpsOpt match {
        case Some(x) => x
        case _ => ""
      }
      val q = if(!mps.equals("")) {
        s"SELECT * FROM $KsUMS.$CFNRoleMpsFeatureAttributes WHERE $Col_mps = '$mps' AND $Col_role_id=$roleId;"
      } else{
        s"SELECT * FROM $KsUMS.$CFNRoleMpsFeatureAttributes WHERE $Col_role_id=$roleId;"
      }
      log.debug(s"query : $q")
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRoleMpsFeatureAttributes} table : $roleId, ex: " + ex)
        List()
      }
    }
  }

  def deleteRows(roleList: List[Long], mpsOpt: Option[String]): Option[String] = {
    try {
      val roleIds = DBUtils.scalaTosqlLongList(roleList)
      val mps = mpsOpt match{
        case Some(x) => x
        case _ => ""
      }
      val q = if(mps.equals("")) {
        s"DELETE FROM $KsUMS.$CFNRoleMpsFeatureAttributes WHERE $Col_role_id IN ($roleIds);"
      } else{
        s"DELETE FROM $KsUMS.$CFNRoleMpsFeatureAttributes WHERE $Col_mps = '$mps' AND $Col_role_id IN ($roleIds);"
      }
      log.debug(s"query : $q")
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRoleMpsFeatureAttributes} table : $roleList, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def insertRow(mps: String, rId: Long, fId: Int, dateRange: Int): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNRoleMpsFeatureAttributes($Col_mps, $Col_role_id, $Col_feature_id, $Col_explorer_date_range) VALUES(?,?,?,?);"
      log.debug(s"values : $mps, $rId, $fId, $dateRange")
      val res = DB.insertQueryResult(q,List(mps, rId, fId, dateRange))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNRoleMpsFeatureAttributes} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

}

