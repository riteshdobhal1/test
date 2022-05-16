package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import models.DB

object role_realms {
  val log = Logger("Dao_ROLE_REALMS")

  /* start : columns of role_realm table*/
  lazy val Col_realm_id = "realm_id"
  lazy val Col_role_id = "role_id"
  /* end : columns of role_realm table*/

  def selectRow(role_id: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRoleRealms where $Col_role_id=$role_id;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRoleRealms} table : $role_id, ex: " + ex)
        List()
      }
    }
  }

  def insertRow(realm_id: Long, role_id: Long): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNRoleRealms ($Col_realm_id, $Col_role_id) VALUES(?, ?);"
      val res = DB.insertQueryResult(q,List(realm_id, role_id))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNRoleRealms} table, ex: " + ex)
        None
      }
    }
  }

  def deleteRows(roleList: List[Long]): Option[String] = {
    try {
      val roleIds = DBUtils.scalaTosqlLongList(roleList)
      val q = s"DELETE FROM $KsUMS.$CFNRoleRealms WHERE $Col_role_id IN ($roleIds);"
      val res = DB.deleteQueryResult(q,List())
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRoleRealms} table : $roleList, ex: " + ex)
        None
      }
    }
  }

}
