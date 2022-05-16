package models

import scala.language.postfixOps
import play.api.Logger
import constants._
import dao._



case class NewRealm(name: String, apps_version: String, is_url: String, ui_url: String)
case class RealmDetail(name: String, apps_version: String, is_url: String, ui_url: String,vertica_server: String,vertica_port: String, vertica_user: String, vertica_pwd: String)

object vRealm {

  val log = Logger("Model_vRealm")

  /**
    * Returns a set of realms
    */
  def listall(): List[NewRealm] = {
    try {
      val rows = vertica.realm.selectRows()
      (for {
        row <- rows
      } yield {
        val name = models.Utils.getDBStringVal(row, vertica.realm.Col_realm)
        val apps_version = models.Utils.getDBStringVal(row, vertica.realm.Col_apps_version)
        val is_url = models.Utils.getDBStringVal(row, vertica.realm.Col_is_url)
        val ui_url = models.Utils.getDBStringVal(row, vertica.realm.Col_ui_url)

        NewRealm(name,apps_version,is_url,ui_url)
      }).toList

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
    }
  }

  def listallDetail(mfr:String,prod:String,sch:String): List[RealmDetail] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val resultRealm = vertica.sso_details.selectRealm(mps)
      val realm = models.Utils.getDBStringVal(resultRealm.head, vertica.sso_details.Col_realm)
      val result = vertica.realm.selectRow(realm)
      val rows = result
      (for {
        row <- rows
      } yield {
        val name = models.Utils.getDBStringVal(row, vertica.realm.Col_realm)
        val apps_version = models.Utils.getDBStringVal(row, vertica.realm.Col_apps_version)
        val is_url = models.Utils.getDBStringVal(row, vertica.realm.Col_is_url)
        val ui_url = models.Utils.getDBStringVal(row, vertica.realm.Col_ui_url)
        val vertica_user = models.Utils.getDBStringVal(row, vertica.realm.Col_vertica_user, CVDefaultStr)
        val vertica_server = models.Utils.getDBStringVal(row, vertica.realm.Col_vertica_server, CVDefaultStr)
        val vertica_pwd = models.Utils.getDBStringVal(row, vertica.realm.Col_vertica_pwd, CVDefaultStr)
        val vertica_port = models.Utils.getDBStringVal(row, vertica.realm.Col_vertica_port, CVDefaultStr)
        RealmDetail(name,apps_version,is_url,ui_url,vertica_server,vertica_port,vertica_user,vertica_pwd)
      }).toList

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
    }
  }

  /**
    * Delete the Realm
    */

  def delete(realm: String): Option[String] = {
    try {
      val res = vertica.realm.deleteRow(realm)
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete a realm")
        case _=> None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a realm, realm: $realm, exception: " + ex)
        Some("Failed to delete a realm")
      }
    }
  }

  /**
    * Add/ Edit Realm
    */
  def managerealm(r: NewRealm): Option[String] = {
    try {
      val realm_name = r.name.toLowerCase()
      val apps_version = r.apps_version
      val is_url = r.is_url
      val ui_url = r.ui_url
      val res = vertica.realm.insertRow(realm_name, apps_version, is_url, ui_url)
      res match {
        case Some(SQL_ERROR) => Some("Failed to create new realm")
        case _=> None
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new realm, realm: ${r.name}, exception: " + ex)
        Some("Failed to create new realm")
      }
    }
  }
}
