package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object role_mps_features {
  val log = Logger("Dao_ROLE_MPS_FEATURES")

  /* start : columns of role_mps_features table*/
  lazy val Col_mps = "mps"
  lazy val Col_feature_id = "feature_id"
  lazy val Col_role_id = "role_id"
  /* end : columns of role_mps_features table*/

  def deleteRows(roleList: List[Long]): Option[String] = {
    try {
      val roleIds = DBUtils.scalaTosqlLongList(roleList)
      val q = s"DELETE FROM $KsUMS.$CFNRoleMpsFeatures WHERE $Col_role_id IN ($roleIds);"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRoleMpsFeatures} table : $roleList, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def insertRow(mps: String, fId: Int, rId: Long): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNRoleMpsFeatures($Col_mps, $Col_feature_id, $Col_role_id) VALUES(?,?,?);"
      val res = DB.insertQueryResult(q,List(mps, fId, rId))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNRoleMpsFeatures} table, ex: " + ex)
        None
      }
    }
  }

  def selectMPSList(roleId: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT DISTINCT($Col_mps) FROM $KsUMS.$CFNRoleMpsFeatures where $Col_role_id=?;"
      log.debug(s"Values : $roleId")
      val rows = DB.selectQueryResult(q,List(roleId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRoleMpsFeatures} table : $roleId, ex: " + ex)
        List()
      }
    }
  }

}
