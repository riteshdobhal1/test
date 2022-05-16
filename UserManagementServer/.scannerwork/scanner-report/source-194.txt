package dao.vertica


import java.util.Date
import java.sql.Timestamp
import play.api.Logger
import constants._
import models.{Auth, DB}
import dao._
import play.api.mvc.Cookie

import scala.collection.mutable.ListBuffer
import scala.util.{Failure, Success, Try}
object user {
  val log = Logger("Dao_USER")

  /* start : columns of user table*/
  lazy val Col_email = "email"
  lazy val Col_first_name = "first_name"
  lazy val Col_last_name = "last_name"
  lazy val Col_passwd_hash = "passwd_hash"
  lazy val Col_def_passwd = "def_passwd"
  lazy val Col_realm_id = "realm_id"
  lazy val Col_url_def = "url_def"
  lazy val Col_mps_def = "mps_def"
  lazy val Col_type = "type"
  lazy val Col_campaigns = "campaigns"
  lazy val Col_validated = "validated"
  lazy val Col_is_prospect = "is_prospect"
  lazy val Col_mfr_id = "mfr_id"
  lazy val Col_department = "department"
  lazy val Col_phone = "phone"
  lazy val Col_city = "city"
  lazy val Col_state = "state"
  lazy val Col_country = "country"
  lazy val Col_sso = "sso"
  lazy val Col_role_id = "role_id"
  lazy val Col_wb_user_name = "wb_user_name"
  lazy val Col_is_external = "is_external"
  lazy val Col_report_usage = "report_usage"
  lazy val Col_created_on = "created_on"
  lazy val Col_active = "active"
  lazy val Col_token_id = "token_id"
  lazy val Col_dashboard_admin = "dashboard_admin"
  lazy val Col_region = "region"
  lazy val Col_show_info = "show_info"
  lazy val Col_expire_in_days = "expire_in_days"
  lazy val Col_end_customer = "end_customer"
  lazy val Col_events_export_limit = "events_export_limit"
  lazy val Col_failed_login = "failed_login"
  lazy val Col_last_failed_login_time = "last_failed_login_time"
  lazy val Col_last_login_otp = "last_login_otp"
  lazy val Col_modified_on = "modified_on"
  lazy val Col_org = "org"
  lazy val Col_remote_address = "remote_address"
  lazy val Col_realm_def = "realm_def"
  /* end : columns of user table*/
  lazy val prospectText = "Prospect"
  lazy val UserState = Map(0 -> UserInvited, 1 -> UserActive, 2 -> UserInactive)
  lazy val UserStateStringMapping = Map(UserInvited -> 0, UserActive -> 1, UserInactive -> 2)
  lazy val UserStateBooleanMapping = Map(true -> 1, false -> 2)
  lazy val UserStateStringToBooleanMapping = Map(UserInvited -> false, UserActive -> true, UserInactive -> false)
  lazy val UserStateIntToBooleanMapping = Map(0 -> false, 1 -> true, 2 -> false)

  def mapUserState(rows: List[Map[String, Option[Any]]], userActiveType: String = STR_STR): List[Map[String, Option[Any]]] = {
    val mappedRows = rows.foldLeft(List[Map[String, Option[Any]]]()){(acc, row) =>
      val updatedRow = if(row.contains(Col_active)){
        userActiveType match{
          case STR_BOOL => row + (Col_active -> Some(UserStateIntToBooleanMapping(models.Utils.getDBIntVal(row, Col_active))))
          case STR_STR => row + (Col_active -> Some(UserState(models.Utils.getDBIntVal(row, Col_active))))
          case STR_INT => row
          case _ => row
        }
      } else
        row
      acc ++ List(updatedRow)
    }
    mappedRows
  }

  def selectAllRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser;"
      val rows = DB.selectQueryResult(q, List())
      mapUserState(rows)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNUser} table, ex: " + ex)
        List()
      }
    }
  }

  def selectAllRowsCass(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser;"
      val rows = DB.selectQueryResult(q, List())
      mapUserState(rows, STR_BOOL)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows cass from {$KsUMS.$CFNUser} table, ex: " + ex)
        List()
      }
    }
  }
  
  def selectRoleMfrRealmId(mps: String,role:String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT distinct($CFNRole.$Col_mfr_id),$Col_realm_id,$KsUMS.$CFNRealm.ui_url,$KsUMS.$CFNRole.$Col_role_id as $Col_role_id FROM $KsUMS.$CFNRealm,$KsUMS.$CFNSsoDetails,$KsUMS.$CFNMps,$KsUMS.$CFNRole,$KsUMS.$CFNRoleMpsFeatures" +
              s" WHERE mps.mps=$CFNSsoDetails.mps AND $CFNSsoDetails.realm=$CFNRealm.realm and $CFNMps.mps=$CFNRoleMpsFeatures.mps and $CFNRoleMpsFeatures.role_id=$CFNRole.role_id and $CFNMps.mps=? and $CFNRole.role_name=?;"
      log.debug(s"Values : $mps, $role")
      val rows = DB.selectQueryResult(q, List(mps,role))
      mapUserState(rows)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNUser} table, ex: " + ex)
        List()
      }
    }
  }
  def updateBulkUsers(userList: List[String], emailList: String, active:Any , mpsDef: String,role: Long,password:String,end_customer: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q_prefix = s"Update $KsUMS.$CFNUser set"
      val q_suffix = s" WHERE $Col_email IN ('" + emailList + "')"
      var q = ""
      val placeholder = new ListBuffer[Any]() 
      if(!mpsDef.isEmpty){
        if(q == ""){
          q =  q + s" $Col_mps_def =?"
        } else {
          q =  q + s" ,$Col_mps_def =?"
        }
        placeholder += mpsDef
      }
      if(role > 0L){
        if(q == ""){
          q =  q + s" $Col_role_id =?"
        } else {
          q =  q + s" ,$Col_role_id =?"
        }
        placeholder += role
      }
      if(!password.isEmpty){
        if(q == ""){
          q =  q + s" $Col_passwd_hash =?"
        } else {
          q =  q + s" ,$Col_passwd_hash =?"
        }
        placeholder += password
      }
      if(active != null) {
        if(q == ""){
          q =  q + s" $Col_active =?"
        } else {
          q =  q + s" ,$Col_active =?"
        }
        placeholder += active
      }
      if(currTime != null) {
        if(q == ""){
          q =  q + s" $Col_modified_on =?"
        } else {
          q =  q + s" ,$Col_modified_on =?"
        }
        placeholder += currTime
      }
      if(!end_customer.equals("NA")){
        if(q == ""){
          q =  q + s" $Col_end_customer =?"
        } else {
          q =  q + s" ,$Col_end_customer =?"
        }
        placeholder += end_customer
      }
      val q_final = q_prefix + q + q_suffix
      val res = DB.updateQueryResult(q_final,placeholder.toList)
      res match {
        case Some(SQL_ERROR) => Some("Failed to update user(s)")
        case _ => {
          active match{
            case x: Int => if(x == UserStateStringMapping(UserInactive)){
              models.vClinsight.deleteUsersDeviceInfo(userList)
            }
            case _ =>
          }
          None
        }
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating Bulk users in {$KsUMS.$CFNUser} table : $emailList, ex: " + ex)
        None
      }
    }
  }

  def selectAllUsersOrg(sso:Boolean,org: String): List[Map[String, Option[Any]]] = {
      try {
        val q = s"SELECT * FROM $KsUMS.$CFNRole,$KsUMS.$CFNRealm,$KsUMS.$CFNUser LEFT OUTER JOIN $KsUMS.$CFNUserByMps ON $KsUMS.$CFNUser.$Col_email=$KsUMS.$CFNUserByMps.$Col_email AND $KsUMS.$CFNUser.$Col_mps_def=$KsUMS.$CFNUserByMps.mps WHERE $KsUMS.$CFNUser.$Col_role_id = $KsUMS.$CFNRole.$Col_role_id AND $KsUMS.$CFNUser.$Col_realm_id = $KsUMS.$CFNRealm.$Col_realm_id AND $KsUMS.$CFNUser.$Col_sso = ? AND $KsUMS.$CFNUser.$Col_org = ? AND (($KsUMS.$CFNUserByMps.mps = $KsUMS.$CFNUser.$Col_mps_def) OR ($KsUMS.$CFNUserByMps.mps is NULL));"
        val rows = DB.selectQueryResult(q,List(sso,org))
        mapUserState(rows)
      } catch {
        case ex: Exception => {
          log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNOrg} table, ex: " + ex)
          List()
        }
      }
  }

  def selectAllActiveUsersOrg(org: String): List[Map[String, Option[Any]]] = {
      try {
        
        val q = s"SELECT * FROM $KsUMS.$CFNUser WHERE $Col_org=? AND $Col_active=?;"
        val rows = DB.selectQueryResult(q,List(org,UserStateStringMapping("ACTIVE")))
        mapUserState(rows)
      } catch {
        case ex: Exception => {
          log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNOrg} table, ex: " + ex)
          List()
        }
      }
  }
  def selectRow(email: String, userActiveType: String = STR_STR): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      mapUserState(rows, userActiveType)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def selectUserMfrId(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_mfr_id FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q, List(email))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNUser} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRowCount(email: String): Int = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows.size
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        0
      }
    }
  }

  def selectUserRoleRow(email: String, userActiveType: String = STR_BOOL): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser, $KsUMS.$CFNRole WHERE $Col_email=? AND $KsUMS.$CFNUser.${vertica.user.Col_role_id} = $KsUMS.$CFNRole.${vertica.role.Col_role_id};"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      mapUserState(rows, userActiveType)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def selectUserRoleRealmRow(email: String, userActiveType: String = STR_BOOL): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser, $KsUMS.$CFNRole, $KsUMS.$CFNRealm WHERE $Col_email=? AND $KsUMS.$CFNUser.${vertica.user.Col_role_id} = $KsUMS.$CFNRole.${vertica.role.Col_role_id} AND $KsUMS.$CFNUser.$Col_realm_id = $KsUMS.$CFNRealm.$Col_realm_id;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      mapUserState(rows, userActiveType)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def getFirstLastName(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_first_name,$Col_last_name FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        List()
      }
    }
  }
  def getUserState(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_active,$Col_created_on,$Col_token_id FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      mapUserState(rows)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        List()
      }
    }
  }

//////// Realm id to be inserted below instead of realm def
  def updateRealmMps(email: String, realmDef:String, mpsDef: String): Option[String] = {
    try {
      val q = s"Update $KsUMS.$CFNUser set $Col_realm_def = ?, $Col_mps_def = ? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(realmDef,mpsDef,email.toLowerCase()))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating realm in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateUserToken(token_id: String, email: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_created_on = ? ,$Col_token_id = ? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(currTime,token_id,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
      log.error(s"Exception thrown while updating user token in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        throw new Exception(s"Failed to update Token")
      }
    }
  }

  def createPassword(token_id: String, password: String, active: Int,failed_login: Int,last_login_otp: String,remote_address: String,email: String): Try[Any] = {
    try {
        val currTime = new java.sql.Timestamp(System.currentTimeMillis())
        val q = s"UPDATE $KsUMS.$CFNUser set $Col_created_on =?, $Col_token_id = ?, $Col_passwd_hash = ?, $Col_active = ?, $Col_failed_login = ?, $Col_remote_address = ? WHERE $Col_email = ?;"
        val res = DB.updateQueryResult(q,List(currTime,token_id,password,active,failed_login,remote_address,email.toLowerCase()))
        res match {
          case Some(SQL_ERROR) => throw new Exception(s"Failed to create password")
          case _ => Success(s"Password updated for user: $email")
        }
    } catch {
        case ex: Exception => {
        log.error(s"Exception thrown while creating new password in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
          throw new Exception(ex)
      }
    }
  }
  def resetPassword(password: String,failed_login: Int,remote_address: String,email: String): Try[Any] = {
    try {
        val currTime = new java.sql.Timestamp(System.currentTimeMillis())
        val q = s"UPDATE $KsUMS.$CFNUser set $Col_passwd_hash = ?, $Col_failed_login = ?, $Col_remote_address = ?, $Col_modified_on = ? WHERE $Col_email = ?;"
        val res = DB.updateQueryResult(q,List(password,failed_login,remote_address,currTime,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to reset password")
        case _ => Success(s"Password changed successfully..")
      }
    } catch {
        case ex: Exception => {
        log.error(s"Exception thrown while reseting password {$KsUMS.$CFNUser} table : $email, ex: " + ex)
          throw new Exception(s"Failed to reset password")
      }
    }
  }
  def changePassword(password: String,failed_login: Int,last_failed_login_time: String,remote_address: String,email: String): Try[Any] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_passwd_hash = ?, $Col_modified_on = ? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(password,currTime,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to change password")
        case _ => Success(s"Password updated for user: $email")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating password {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        throw new Exception(s"Failed to change password")
      }
    }
  }
  def disable(email: String): Option[String] = {
    try {
        val currTime = new java.sql.Timestamp(System.currentTimeMillis())
        val q = s"UPDATE $KsUMS.$CFNUser set $Col_modified_on =?, $Col_active = ? WHERE $Col_email = ? ;"
        val res = DB.updateQueryResult(q,List(currTime,UserStateStringMapping("INACTIVE"),email.toLowerCase()))
        res match {
          case Some(SQL_ERROR) => Some(SQL_ERROR)
          case _ => None
        }
    } catch {
        case ex: Exception => {
        log.error(s"Exception thrown while disabling user in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }
  def enable(email: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_modified_on =?, $Col_active = ?, $Col_failed_login = ? WHERE $Col_email = ? ;"
      val res = DB.updateQueryResult(q, List(currTime, UserStateStringMapping("ACTIVE"), 0, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while enabling user in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateSSOToken(email: String,token: String): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_modified_on =?, $Col_token_id =? WHERE $Col_email = ? ;"
      val res = DB.updateQueryResult(q, List(currTime,token,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating SSO token in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }



  def insertProspectUser(email:String, active: Int, f_name: String, l_name: String, passwd_hash: String, org: String, phone: String, city: String, state: String, country: String, created_on: java.sql.Timestamp, token_id: String,
  role_id: Long, realm_id: Long, url_def: String, mps_def: String, typ: String, report_usage: Boolean, is_external: Boolean, sso: Boolean, def_passwd: Boolean,
  is_prospect: Boolean, validated: Boolean, dashboard_admin: Boolean, expiryDay : Int, showInfo: Boolean, failedLogin: Int, lastFailedLoginTime: java.sql.Timestamp, mfr_id: Int, realm_def: String): Option[String] = {
    try {
      val qry = s"INSERT INTO $KsUMS.$CFNUser" +
        s" ($Col_email, $Col_active, $Col_first_name, $Col_last_name, $Col_passwd_hash, $Col_org, $Col_phone, $Col_city, $Col_state, $Col_country, $Col_created_on, $Col_token_id, $Col_role_id, $Col_realm_id, " +
        s" $Col_url_def, $Col_mps_def, $Col_type, $Col_report_usage, $Col_is_external, $Col_sso, $Col_def_passwd, $Col_is_prospect, $Col_validated, $Col_dashboard_admin, $Col_expire_in_days, $Col_show_info, $Col_failed_login, $Col_last_failed_login_time, $Col_mfr_id, $Col_realm_def)" +
        s" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(qry,List(email.toLowerCase(), active, f_name, l_name, passwd_hash, org, phone, city, state, country, created_on, token_id, role_id, realm_id, url_def, mps_def, typ, report_usage, is_external, sso, def_passwd, is_prospect, validated, dashboard_admin, expiryDay, showInfo, failedLogin, lastFailedLoginTime, mfr_id, realm_def))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }


  def insertUser(email:String, active: Int, f_name: String, l_name: String, passwd_hash: String, org: String, phone: String, city: String, state: String, country: String, token_id: String,
                         role_id: Long, realm_def_id: Long, url_def: String, mps_def: String, typ: String, report_usage: Boolean, is_external: Boolean, sso: Boolean,is_prospect: Boolean, validated: Boolean, dashboard_admin: Boolean, expiryDay : Int, showInfo: Boolean, failedLogin: Int, department: String, end_customer: String,mfr_id: Int, realm_def: String): Option[String] = {
    val currTime = new java.sql.Timestamp(System.currentTimeMillis())
    try {
      val qry = s"INSERT INTO $KsUMS.$CFNUser" +
        s" ($Col_email, $Col_active, $Col_first_name, $Col_last_name, $Col_passwd_hash, $Col_org, $Col_phone, $Col_city, $Col_state, $Col_country, $Col_created_on, $Col_token_id, $Col_role_id, $Col_realm_id, " +
        s" $Col_url_def, $Col_mps_def, $Col_type, $Col_report_usage, $Col_is_external, $Col_sso, $Col_is_prospect, $Col_validated, $Col_dashboard_admin, $Col_expire_in_days, $Col_show_info, $Col_failed_login, $Col_last_failed_login_time,$Col_department,$Col_end_customer,$Col_mfr_id,$Col_realm_def)" +
        s" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(qry,List(email.toLowerCase(),active,f_name,l_name,passwd_hash,org, phone, city, state, country, currTime, token_id,role_id, realm_def_id, url_def, mps_def, typ, report_usage, is_external, sso,is_prospect, validated, dashboard_admin, expiryDay, showInfo, failedLogin, currTime, department, end_customer, mfr_id, realm_def))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        Some("Failed to create a new user account.")
      }
    }
  }

  def createUserSSOPing(email:String, active: Boolean, sso: Boolean, validated: Boolean, is_prospect: Boolean, is_external: Boolean, report_usage: Boolean, org: String, role_id: Long, mps_def: String, url_def: String, realm_def_id: Long, typ: String, expire_in_days: Int, show_info: Boolean, failed_login:Int,mfr_id: Int): Boolean = {
    val currTime = new java.sql.Timestamp(System.currentTimeMillis())
    try {
      val qry = s"INSERT INTO $KsUMS.$CFNUser (email, active, sso, validated, is_prospect, is_external, report_usage, created_on, org, role, mps_def, url_def, realm_def, type, expire_in_days, show_info, failed_login, last_failed_login_time,mfr_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(qry,List(email.toLowerCase(), active, sso, validated, is_prospect, is_external, report_usage, currTime, org, role_id, mps_def, url_def, realm_def_id, typ, expire_in_days, show_info, failed_login, currTime,mfr_id))
      res match {
        case Some(SQL_ERROR) =>
        { log.error("Unable to create SSO Ping User")
          false }
        case _ => true
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        false
      }
    }
  }

  def createUserSSOSalesforce(email: String, active: Boolean, sso: Boolean, report_usage: Boolean, org: String, role_id: Long, first_name: String, last_name: String, mps_def: String, url_def: String, realm_def_id: Long, typ: String,validated: Boolean, is_prospect: Boolean, is_external: Boolean, expire_in_days: Int, show_info: Boolean, failed_login: Int,mfr_id: Int): Boolean = {
    val currTime = new java.sql.Timestamp(System.currentTimeMillis())
    try {
      val qry = s"INSERT INTO $KsUMS.$CFNUser (email, active, sso, report_usage, created_on, org, role_id, first_name, last_name, mps_def,url_def, realm_def_id, type,validated, is_prospect, is_external, expire_in_days, show_info, failed_login, last_failed_login_time,mfr_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(qry,List(email.toLowerCase(), active, sso, report_usage, currTime, org, role_id, first_name, last_name, mps_def,url_def, realm_def_id, typ,validated, is_prospect, is_external, expire_in_days, show_info, failed_login, currTime,mfr_id))
      res match {
        case Some(SQL_ERROR) =>
        { log.error("Unable to Create SSO User Salesforce")
          false
        }
        case _ => true
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        false
      }
    }
  }

  def updateUser(firstname: String,lastname: String,report_usage: Boolean,dashboard_admin: Boolean,department: String,city: String, state: String,country:String,role: Long,phone: String,mps_def: String,is_external: Boolean,end_customer: String,wb_user_name:String,email:String): Option[String] = {
    val currTime = new java.sql.Timestamp(System.currentTimeMillis())
    try {
      val qry = s"UPDATE $KsUMS.$CFNUser SET $Col_first_name = ?, $Col_last_name = ?,$Col_report_usage = ?, $Col_dashboard_admin = ?, $Col_department = ?, $Col_city = ?, $Col_state = ?, $Col_country= ?, $Col_role_id= ?, $Col_phone= ?, $Col_modified_on= ?, $Col_mps_def= ?, $Col_is_external= ?, $Col_end_customer= ? , $Col_wb_user_name = ? WHERE $Col_email = ?; "
      val res = DB.updateQueryResult(qry, List(firstname, lastname, report_usage, dashboard_admin, department, city, state, country, role, phone, currTime, mps_def, is_external,end_customer, wb_user_name, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }
  def selectUsersRole(org: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_role_id FROM $KsUMS.$CFNUser WHERE $Col_org=?;"
      val rows = DB.selectQueryResult(q,List(org))
      mapUserState(rows)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org ex: " + ex)
        List()

      }
    }
  }
  def selectUserRole(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $CFNRole.role_name as role_name FROM $KsUMS.$CFNUser,$KsUMS.$CFNRole WHERE $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNUser.$Col_role_id AND $Col_email = ?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org ex: " + ex)
        List()

      }
    }
  }

  def updateEventExportLimit(email: String,limit:Int): Try[Any] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser set events_export_limit = ? WHERE email = ?;"
      val res = DB.updateQueryResult(q,List(limit,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update event export limit")
        case _ => Success(s"Updated info successfully..")
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating event export limit for user : $email ex: " + ex)
        throw new Exception(s"Failed to update event export limit")
      }
    }
  }

  def disable_user_show_help_info(email: String): Try[Any] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_show_info = ? WHERE email = ?;"
      val res = DB.updateQueryResult(q,List(false,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to disable show help user info")
        case _ => Success(s"Disabled info successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating show help info for user : $email ex: " + ex)
        throw new Exception(s"Failed to disable show help user info")
      }
    }
  }

  def updateDefaults(realm_def_id: Long,realm_def: String, url_def: String , mps_def: String, email: String): Try[Any] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser set $Col_realm_id = ?, $Col_realm_def = ?, $Col_url_def = ?, $Col_mps_def =? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(realm_def_id,realm_def,url_def,mps_def,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update defaults")
        case _ => Success(s"Defaults Updated successfully..")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating default settings for user : $email ex: " + ex)
        throw new Exception(s"Failed to update defaults")
      }
    }
  }
  def deleteBulkUser(userList:String, emailList: List[String]) : Option[String] = {

      val delRes = archiveDeletedUser(userList)
      delRes match {
        case Some(SQL_ERROR) => Some("Failed to archive User(s)")
        case _ => {
          val qry = s"DELETE FROM $KsUMS.$CFNUser where $Col_email IN ($userList);"
          val res = DB.deleteQueryResult(qry, List())
          res match {
            case Some(SQL_ERROR) => Some("Failed to delete User")
            case _ => None
          }
        }
      }
  }
  def archiveDeletedUser(userList:String) : Option[String] = {

    val qryDel = s"DELETE FROM $KsUMS.$CFNUserArchive where $Col_email IN ($userList);"
    DB.deleteQueryResult(qryDel, List())
    val qry = s"INSERT INTO $KsUMS.$CFNUserArchive SELECT * FROM $KsUMS.$CFNUser where $Col_email IN ($userList);"
    val res = DB.insertQueryResult(qry, List())
    res match {
      case Some(SQL_ERROR) => Some(SQL_ERROR)
      case _ => None
    }
  }

  def updateUserFields(email: String, wbName: String): Option[String] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser SET $Col_wb_user_name=? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(wbName,email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some("Failed to update products to the role")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def selectUsersOrg(org: String, userActiveType: String = STR_STR): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser,$KsUMS.$CFNRole,$KsUMS.$CFNRealm WHERE $KsUMS.$CFNUser.$Col_role_id = $KsUMS.$CFNRole.$Col_role_id AND $KsUMS.$CFNUser.$Col_realm_id = $KsUMS.$CFNRealm.$Col_realm_id AND $KsUMS.$CFNUser.$Col_org = ?;"
      val rows = DB.selectQueryResult(q,List(org))
      mapUserState(rows, userActiveType)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNOrg} table, ex: " + ex)
        List()
      }
    }
  }

  def updateFailedLoginAttempt(email: String, active: Boolean, lastFailedLoginTime: Timestamp, failedLoginCount: Int): Option[String] = {
    try {
      val active_state = UserStateBooleanMapping(active)
      val q = s"UPDATE $KsUMS.$CFNUser SET $Col_last_failed_login_time = ?, $Col_active = ?, $Col_failed_login = ? WHERE $Col_email = ?;"
      val res = DB.updateQueryResult(q,List(lastFailedLoginTime, active_state, failedLoginCount, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateLastLogin(email: String, lastLoginOtp: Any, remoteAddress: Any): Option[String]= {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser SET last_login_otp = $lastLoginOtp, remote_address = $remoteAddress WHERE email = '${email.toLowerCase()}';"
      val res = DB.updateQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateFailedLoginTime(email: String, modifiedOn: Long, active: Boolean, failedLoginCount: Int): Option[String] = {
    try {
      val active_state = UserStateBooleanMapping(active)
      val modified_on_ts = new Timestamp(modifiedOn)
      val q = s"UPDATE $KsUMS.$CFNUser set modified_on =?, active = ?, failed_login = ?  WHERE email = ?;"
      val res = DB.updateQueryResult(q,List(modified_on_ts, active_state, failedLoginCount, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some("Failed to activate user.")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateLastLoginOtp(email: String, lastLoginOtp: Long, remoteAddress: String): Option[String] = {
    try {
      val lastLoginOtp_ts = new Timestamp(lastLoginOtp)
      val q = s"UPDATE $KsUMS.$CFNUser SET last_login_otp = ?, remote_address = ? WHERE email = ?; "
      val res = DB.updateQueryResult(q,List(lastLoginOtp_ts, remoteAddress, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some("SUCCESS")
        case _ => Some("FAILURE")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def updateSuccessLogin(email: String, active: Boolean, failedLogin: Int): Option[String] = {
    try {
      val active_state = UserStateBooleanMapping(active)
      val q = s"UPDATE $KsUMS.$CFNUser SET $Col_active = ?, $Col_failed_login = ?  WHERE email = ?;"
      val res = DB.updateQueryResult(q,List(active_state, failedLogin, email.toLowerCase()))
      res match {
        case Some(SQL_ERROR) => Some("Failed to update failed_login count of user to 0.")
        case _ => None
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNUser} table : $email, ex: " + ex)
        None
      }
    }
  }

  def selectRuleCreatorsOrg(org: String,mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT DISTINCT($Col_email) AS $Col_email from $KsUMS.$CFNUser, $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures WHERE $KsUMS.$CFNUser.$Col_role_id=$KsUMS.$CFNRole.$Col_role_id AND $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleMpsFeatures.$Col_role_id AND $Col_org=? AND $KsUMS.$CFNRoleMpsFeatures.feature_id= ? AND $KsUMS.$CFNRoleMpsFeatures.mps=?;"
      val rows = DB.selectQueryResult(q,List(org,RULE_CREATOR_FEATURE_ID,mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting Rule creators from {$KsUMS.$CFNUser} table, $org ex: " + ex)
        List()
      }
    }
  }

  def selectMfrUsersECs(org: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_end_customer FROM $KsUMS.$CFNUser WHERE $Col_org=?;"
      val rows = DB.selectQueryResult(q,List(org))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org, ex: " + ex)
        List()
      }
    }
  }

  def selectUserGroupName(email: String): List[Map[String, Option[Any]]] = {
    try {
      val emailId = email.toLowerCase()
      val q = s"SELECT $Col_end_customer FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(emailId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org, ex: " + ex)
        List()
      }
    }
  }

  def selectGroupUsersInfo(groupOpt: Option[String], orgOpt: Option[String], userOpt: Option[List[String]]): List[Map[String, Option[Any]]] = {
    try {
      val rows = userOpt match {
        case Some(x) =>
          val userList = DBUtils.scalaTosqlList(x)
          val q = s"SELECT $KsUMS.$CFNUser.$Col_email, $KsUMS.$CFNUser.$Col_first_name, $KsUMS.$CFNUser.$Col_last_name, $KsUMS.$CFNUser.$Col_org, $KsUMS.$CFNUser.$Col_mps_def, $KsUMS.$CFNEndCustomer.${vertica.end_customer.Col_mps}, $KsUMS.$CFNUser.${vertica.user.Col_end_customer} FROM $KsUMS.$CFNUser LEFT OUTER JOIN $KsUMS.$CFNEndCustomer ON $KsUMS.$CFNUser.$Col_end_customer = $KsUMS.$CFNEndCustomer.${vertica.end_customer.Col_endcustomer_name} WHERE $KsUMS.$CFNUser.$Col_email IN ($userList);"
          log.debug(s"Query : $q")
          DB.selectQueryResult(q,List())
        case _ =>
          val q = s"SELECT $KsUMS.$CFNUser.$Col_email, $KsUMS.$CFNUser.$Col_first_name, $KsUMS.$CFNUser.$Col_last_name, $KsUMS.$CFNUser.$Col_org, $KsUMS.$CFNUser.$Col_mps_def, $KsUMS.$CFNEndCustomer.${vertica.end_customer.Col_mps}, $KsUMS.$CFNUser.${vertica.user.Col_end_customer} FROM $KsUMS.$CFNUser LEFT OUTER JOIN $KsUMS.$CFNEndCustomer ON $KsUMS.$CFNUser.$Col_end_customer = $KsUMS.$CFNEndCustomer.${vertica.end_customer.Col_endcustomer_name} WHERE $Col_end_customer=? AND $Col_org=?;"
          val group = groupOpt.getOrElse("")
          val org = orgOpt.getOrElse("")
          log.debug(s"Query : $q, $group, $org")
          DB.selectQueryResult(q,List(group, org))
      }
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org, ex: " + ex)
        List()
      }
    }
  }

  def selectGroupsUsers(groupList: List[String], org: String): List[Map[String, Option[Any]]] = {
    try {
      val groups = DBUtils.scalaTosqlList(groupList)
      val q = s"SELECT $Col_email, $Col_first_name, $Col_last_name, $Col_org FROM $KsUMS.$CFNUser WHERE $Col_end_customer IN ($groups) AND $Col_org='$org';"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org, ex: " + ex)
        List()
      }
    }
  }

  def selectUsersDefMPS(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_mps_def FROM $KsUMS.$CFNUser WHERE $Col_email=?;"
      val rows = DB.selectQueryResult(q,List(email))
      mapUserState(rows)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $org ex: " + ex)
        List()
      }
    }
  }

  def monitorUser(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser LIMIT 1;"
      DB.selectQueryResult(q, List())
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting all rows from {$KsUMS.$CFNUser} table, ex: " + ex)
        List()
      }
    }
  }

  def getUserMpsList(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT DISTINCT(${vertica.role_mps_features.Col_mps}) from $KsUMS.$CFNUser, $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures WHERE $KsUMS.$CFNUser.$Col_role_id=$KsUMS.$CFNRole.$Col_role_id AND $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleMpsFeatures.$Col_role_id AND $KsUMS.$CFNUser.$Col_email= ?;"
      val rows = DB.selectQueryResult(q,List(email))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting Rule creators from {$KsUMS.$CFNUser} table, $org ex: " + ex)
        List()
      }
    }
  }

  def selectUserMfrName(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $KsUMS.$CFNUser.${vertica.user.Col_mfr_id}, $KsUMS.$CFNOrg.${vertica.org.Col_name} FROM $KsUMS.$CFNUser, $KsUMS.$CFNOrg WHERE $Col_email= '${email.toLowerCase()}' AND $KsUMS.$CFNUser.$Col_mfr_id = $KsUMS.$CFNOrg.${vertica.org.Col_mfr_id};"
      log.debug(s"query : $q")
      val rows = DB.selectQueryResult(q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting user's mfr_name from {$KsUMS.$CFNUser and $KsUMS.$CFNOrg} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRoleUsersRows(roleId: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT DISTINCT($Col_email) from $KsUMS.$CFNUser, $KsUMS.$CFNRole WHERE $KsUMS.$CFNUser.$Col_role_id=$KsUMS.$CFNRole.$Col_role_id AND $KsUMS.$CFNRole.$Col_role_id= ? ;"
      val rows = DB.selectQueryResult(q,List(roleId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting role users from {$KsUMS.$CFNUser, $KsUMS.$CFNRole} table, $roleId ex: " + ex)
        List()
      }
    }
  }

  def selectUserRoleId(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_role_id FROM $KsUMS.$CFNUser WHERE $Col_email = ?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email ex: " + ex)
        List()
      }
    }
  }

  def selectAccessTokenDetails(email: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_email, $Col_active FROM $KsUMS.$CFNUser WHERE $Col_email = ?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase()))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email ex: " + ex)
        List()
      }
    }
  }

  def selectClinsightsRoleRows(user: String): List[Map[String, Option[Any]]] = {
    try {
      val email = user.toLowerCase()
      val q = s"SELECT $KsUMS.$CFNRole.$Col_role_id, $KsUMS.$CFNRole.${vertica.role.Col_role_name}, $KsUMS.$CFNClinsightsRole.${vertica.clinsights_role.Col_clinsights_role_id}, $KsUMS.$CFNClinsightsRole.${vertica.clinsights_role.Col_clinsights_role_name}, $KsUMS.$CFNClinsightsRole.${vertica.clinsights_role.Col_landing_page_report_url_id}, $KsUMS.$CFNClinsightsRole.${vertica.clinsights_role.Col_inactive_dashboard_message} FROM $KsUMS.$CFNUser, $KsUMS.$CFNRole, $KsUMS.$CFNClinsightsRole WHERE $KsUMS.$CFNUser.$Col_role_id = $KsUMS.$CFNRole.${vertica.role.Col_role_id} AND $KsUMS.$CFNRole.${vertica.role.Col_clinsights_role_id} = $KsUMS.$CFNClinsightsRole.${vertica.clinsights_role.Col_clinsights_role_id} AND $Col_email = ?;"
      val rows = DB.selectQueryResult(q, List(email))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser}, {$KsUMS.$CFNRole} & {$KsUMS.$CFNClinsightsRole} tables for user : $user, ex: " + ex)
        List()
      }
    }
  }

  def updateUserRole(email: String, role_id: Long): Try[String] = {
    try {
      val q = s"UPDATE $KsUMS.$CFNUser SET $Col_role_id = ? WHERE $Col_email = ?;"
      log.debug(s"Values : $role_id, $email")
      val res = DB.updateQueryResult(q,List(role_id,email.toLowerCase()))
      Success(s"Updated user's role successfully..")
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating user's role : $email, $role_id ex: " + ex)
        Failure(ex)
      }
    }
  }

  def selectUserFailedLoginStatus(email: String): Int = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNUser WHERE $Col_email = ? AND $Col_failed_login=?;"
      val rows = DB.selectQueryResult(q,List(email.toLowerCase(),0))
      rows.size
    } catch {
      case ex: Exception =>
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUser} table : $email ex: " + ex)
       0
    }
  }

}
