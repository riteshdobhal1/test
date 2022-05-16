package dao.vertica

import play.api.Logger
import constants._
import models.DB

object sso_details {
  val log = Logger("Dao_SSO_DETAILS")

  /* start : columns of sso_details table*/
  lazy val Col_mps = "mps"
  lazy val Col_realm = "realm"
  lazy val Col_sso_login_url = "sso_login_url"
  lazy val Col_sso_logout_url = "sso_logout_url"
  lazy val Col_sso_idp_id = "sso_idp_id"
  lazy val Col_active = "active"
  lazy val Col_logo = "logo"
  lazy val Col_logo_url = "logo_url"
  lazy val Col_default_feature_internal = "default_feature_internal"
  lazy val Col_default_feature_external = "default_feature_external"
  lazy val Col_nsr_enabled = "nsr_enabled"
  lazy val Col_logi_auth_url = "logi_auth_url"
  lazy val Col_email_signature = "email_signature"
  lazy val Col_signature_url = "signature_url"
  lazy val Col_contact_email = "contact_email"
  lazy val Col_feature_label = "feature_label"
  lazy val Col_logo_internal = "logo_internal"
  /* end : columns of sso_details table*/


  def selectRealm(mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_realm FROM $KsUMS.$CFNSsoDetails where $Col_mps=?;"
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting realm from {$KsUMS.$CFNSsoDetails} table : $mps, ex: " + ex)
        List()
      }
    }
  }

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNSsoDetails;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNSsoDetails} table , ex: " + ex)
        List()
      }
    }
  }

  def selectRows(mps: String): List[Map[String, Option[Any]]] = {
    try {

       val q = s"SELECT * FROM $KsUMS.$CFNSsoDetails where $Col_mps = ?;"
       val rows = DB.selectQueryResult(q,List(mps))
       rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNSsoDetails} table : $mps, ex: " + ex)
        List()
      }
    }
  }

}
