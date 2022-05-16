package dao.vertica

import play.api.Logger
import constants._
import models.DB
import dao.DBUtils

object realm {
  val log = Logger("Dao_REALM")

  /* start : columns of realm table*/
  lazy val Col_realm_id = "realm_id"
  lazy val Col_realm = "realm"
  lazy val Col_is_url = "is_url"
  lazy val Col_ui_url = "ui_url"
  lazy val Col_apps_version = "apps_version"
  lazy val Col_vertica_port = "vertica_port"
  lazy val Col_vertica_pwd = "vertica_pwd"
  lazy val Col_vertica_server = "vertica_server"
  lazy val Col_vertica_user = "vertica_user"
  /* end : columns of realm table*/

  def selectRow(realm: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRealm where $Col_realm=?;"
      val rows = DB.selectQueryResult(q,List(realm))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm rows from {$KsUMS.$CFNRealm} table : $realm, ex: " + ex)
        List()
      }
    }
  }

  def selectRowId(realmId: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRealm where $Col_realm_id=?;"
      val rows = DB.selectQueryResult(q,List(realmId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm rows from {$KsUMS.$CFNRealm} table : $realmId, ex: " + ex)
        List()
      }
    }
  }
  def selectRowByName(realm: String): List[Map[String, Option[Any]]] = {
    try {

      val q = s"SELECT * FROM $KsUMS.$CFNRealm where $Col_realm=?;"
      val rows = DB.selectQueryResult(q,List(realm))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm urls from {$KsUMS.$CFNRealm} table : $realm, ex: " + ex)
        List()
      }
    }
  }

  def selectRealmUrlByName(realm: String): (String, String, String) = {
    val rows = selectRow(realm)
    if(rows.nonEmpty){
      val row  = rows.head
      (models.Utils.getDBStringVal(row, Col_is_url, ""), models.Utils.getDBStringVal(row, Col_ui_url, ""), models.Utils.getDBStringVal(row, Col_apps_version, ""))
    } else {
      ("", "", "")
    }
  }

  def selectRealmUrl(realm: String): (String, String, String) = {
    val rows = selectRow(realm)
    if(rows.nonEmpty){
      val row  = rows.head
      (models.Utils.getDBStringVal(row, Col_is_url, ""), models.Utils.getDBStringVal(row, Col_ui_url, ""), models.Utils.getDBStringVal(row, Col_apps_version, ""))
    } else {
      ("", "", "")
    }
  }

  def selectRealmIdByUiUrl(url: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_realm_id FROM $KsUMS.$CFNRealm where $Col_ui_url=?;"
      val rows = DB.selectQueryResult(q, List(url))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm Id from {$KsUMS.$CFNRealm} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRealm;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm rows from {$KsUMS.$CFNRealm} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRealmNames(realmList: List[String]): List[String] = {
    try {
      val realms = DBUtils.scalaTosqlList(realmList)
      val q = s"SELECT $Col_realm_id from $KsUMS.$CFNRealm where $Col_realm IN ($realms);"
      val rows = DB.selectQueryResult(q,List())
      val realmIds =  if(rows.size > 0){
        val rList = for(row <- rows) yield models.Utils.getDBLongVal(row, Col_realm_id, CVDefaultLong).toString
        rList.filter(p => !p.equals(CVDefaultLong.toString))
      } else List()
      realmIds
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm rows from {$KsUMS.$CFNRealm} table, ex: " + ex)
        List()
      }
    }
  }

  def deleteRow(realmName: String): Option[String] = {
    try {
      val q = s"DELETE FROM $KsUMS.$CFNRealm WHERE $Col_realm=?;"
      val res = DB.deleteQueryResult(q,List(realmName))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRealm} table : $realmName, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def insertRow(realm: String, appsVersion: String, ISUrl: String, UIUrl: String): Option[String] = {
    try{
      val q = s"INSERT INTO $KsUMS.$CFNRealm ($Col_realm, $Col_apps_version, $Col_is_url, $Col_ui_url) VALUES (?, ?, ?, ?);"
      val res = DB.insertQueryResult(q,List(realm,appsVersion,ISUrl,UIUrl))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNRealm} table, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

}
