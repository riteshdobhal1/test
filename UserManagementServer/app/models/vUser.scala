package models

import java.sql.Timestamp
import scala.language.postfixOps
import scala.collection.JavaConversions._
import play.api._
import play.api.Play.current
import play.api.Logger
import org.joda.time._
import org.joda.time.format._

import scala.concurrent.Future
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.concurrent.Execution.Implicits._

import java.util.concurrent.TimeoutException
import com.datastax.driver.core.{BoundStatement, ResultSet, Row}
import com.datastax.driver.core.policies._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import org.mindrot.jbcrypt.BCrypt
import constants._
import Utils._

import java.util.Date
import controllers.AdminUser.{InternalServerError, Ok}

import scala.util.{Failure, Success, Try}
import controllers.Secured

import scala.collection.immutable.{ListMap, Map}
import dao._
import models.User.{BCryptLogRounds, delete, log, trackUserAccessActivity}
import models.vUser.log
import org.joda.time
import play.api.mvc.Cookie

case class UserListData(email: String, first_name: String, last_name: String, wb_user_name: String, sso: Boolean, org: String, role: String, realm_def: String, end_customer: String, mps_def: String, dashboard_admin: Boolean, phone:String, city:String, state:String, country:String, department:String,created_on:String, modified_on:String,last_login:String,is_external: Boolean, user_state: String, report_usage:Boolean)
case class Address(address: String, city: String, State: String, Country: String)
case class NewUser(email: String, first_name: String, last_name:String, department:String, city:String, state:String, country:String, sso:Boolean, wb_user_name:String,
                   report_usage:Boolean, phone: String, org: String, role: String, realm_def: String, url_def: String, mps_def: String, is_prospect: Boolean, dashboard_admin: Boolean, is_external: Boolean, end_customer:Option[String], active: Boolean, show_info: Boolean)
case class NewUserWithPasswd(u: NewUser)
case class UserUpdatePasswd(email: String, token_id: String, passwd: String)
case class UserInfo(email: String, active: Boolean, campaigns: List[String], first_name: String, is_external: Boolean, is_prospect: Boolean, mps_def: String, org: String,
                    realm_def: String, role: String, sso: Boolean, typ: String, url_def: String, validated: Boolean, wb_user_name: String,end_customer: Option[String])
case class UserList(email: String, first_name: String, last_name: String, wb_user_name: String, report_usage: Boolean, org: String, role: String,
                    realm_def: String, url_def: String, mps_def: String, dashboard_admin: Boolean, active: Boolean, token_id: String, phone:String, city:String, state:String, country:String, department:String,created_on:String, modified_on:String)
case class UserListDetails(email: String, active: Boolean, first_name: String, last_name: String, wb_user_name: String, sso: Boolean, org: String, role: String, realm_def: String, end_customer: Option[String], mps_def: String, dashboard_admin: Boolean, phone:String, city:String, state:String, country:String, department:String,created_on:String, modified_on:String, last_login:String, is_external: Boolean, user_state: String)
case class UserDefaults(realm_def: String, url_def: String, mps_def: String)
case class Prospect(f_name: String, l_name: String, email: String, passwd: String, product_id: String)
case class UserEdit(f_name: String, l_name: String, sso: Boolean, wb_user_name: String, report_usage: Boolean, org: String, role: String, realm_def: String, url_def: String, mps_def: String, is_prospect: Boolean, dashboard_admin: Boolean, active: Boolean, show_info: Boolean)
case class UserEditCustomer(f_name: String, l_name: String, department:String, city:String, state:String, country:String, phone: String, sso: Boolean, wb_user_name: String, report_usage: Boolean, org: String, role: String, realm_def: String, url_def: String, mps_def: String, is_prospect: Boolean, dashboard_admin: Boolean, active: Boolean, show_info: Boolean,is_external: Boolean,end_customer: Option[String])
case class MultiUserEdit(wb_user_name: String, role: String, realm_def: String, url_def: String, mps_def: String, usrEmails: String)
case class UserModify(email: String, f_name: String, l_name: String, report_usage: Boolean, dashboard_admin: Boolean, department:String, city:String, state:String, country:String,phone:String,wb_user_name:String,role: String,mps_def: String,is_external: Boolean,end_customer: Option[String])
case class RuleCreatorList(email: String)
case class Users(email: String)
case class UserResetPassword(email: String,password: String)
case class BulkUpdateUsers(usrEmails: Seq[String], role: Option[String], mps_def: Option[String], user_state: Option[String], password: Option[String], cpassword: Option[String], end_customer: Option[String])
case class BulkDeleteUsers(usrEmails: Seq[String])
case class UserEncrptDcrpt(username: String, isAvailable: Boolean)
case class DecryptUserForm(username: String)
case class TwoAuthDevices(email: String, phone: Option[String] = None)
case class VerifyOTPForm(email: String, otp: String)
case class ResendOTPForm(email: String)
case class MfrUsersRoles(mfr: String, user: String, role: String)
case class UserGroupMpsInfo(user: String, old_group: String, new_group: String, mps: String)

object vUser {
  val BCryptLogRounds = 10

  val log = Logger("Model_vUser")
  val formatter = DateTimeFormat.forPattern("yyyy")
  lazy val linkExpiry = Play.current.configuration.getInt("user.link.timeout").getOrElse(300)
  lazy val AdminEmail = current.configuration.getString("admin.default.email").getOrElse(
    throw new RuntimeException("admin.default.email needs to be set in application.conf "))
  lazy val AdminPasswd = current.configuration.getString("admin.default.passwd").getOrElse(
    throw new RuntimeException("admin.default.passwd needs to be set in application.conf "))
  lazy val sessionTimeoutInMillis = Play.current.configuration.getInt("user.session.timeout").getOrElse(1800)*1000
  /** Initializes the User module
    *  We create the admin account here since the password is hashed using BCrypt
    */
  def init() {
    val CreateDefAdmin = current.configuration.getBoolean("admin.default.create").getOrElse(false)
    if (CreateDefAdmin) {
      val DefAdminEmail = current.configuration.getString("admin.default.email").getOrElse(
        throw new RuntimeException("admin.default.email needs to be set in application.conf "))

      val DefAdminPasswd = current.configuration.getString("admin.default.passwd").getOrElse(
        throw new RuntimeException("admin.default.passwd needs to be set in application.conf "))
      val DefAdminFName = current.configuration.getString("admin.default.fname").getOrElse(
        throw new RuntimeException("admin.default.fname needs to be set in application.conf "))
      val DefAdminLName = current.configuration.getString("admin.default.lname").getOrElse(
        throw new RuntimeException("admin.default.lname needs to be set in application.conf "))

      val DefAdminOrg = GBName
      val DefCompanyName = GBName
      val DefCompanyDesc = GBDesc
      val DefAdminType = GBType
      val DefAdminRole = URAdmin

      /* val defAdminAccount = NewUserWithPasswd(NewUser(DefAdminEmail, DefAdminFName, DefAdminLName, "", "", "", "", false, "", false, "", DefAdminOrg, DefAdminRole, "", "", "", false, true, false,Option(""),true, true))
      val defGBAccount = Org(GBName, GBName,0,0, OrgTypeGB,"","","","","","")
      Org.createMfr(defGBAccount )
      create(defAdminAccount)
      val qry = s"INSERT INTO $KsUMS.$CFNRole(name, realm) VALUES ('$URAdmin', ['$RealmProd', '$RealmPoc', '$RealmStudioSpl', '$RealmStudioApp']);"
      DS.cqlExecute(qry) */
    }
  }

  /** Returns the user with the given email address
    *
    */
  def byEmail(email: String): Option[NewUser] = {
    try {
      val username = email.toLowerCase
      val rows = vertica.user.selectUserRoleRow(username)
      if (!rows.isEmpty()) {
        val row = rows(0)
        Some(NewUser(username, models.Utils.getDBStringVal(row, "first_name"), models.Utils.getDBStringVal(row, "last_name"), models.Utils.getDBStringVal(row, "department"),
          models.Utils.getDBStringVal(row, "city"), models.Utils.getDBStringVal(row, "state"), models.Utils.getDBStringVal(row, "country"), models.Utils.getDBBooleanVal(row, "sso"),
          models.Utils.getDBStringVal(row, "wb_user_name"), models.Utils.getDBBooleanVal(row, "report_usage"), models.Utils.getDBStringVal(row, "phone"),
          models.Utils.getDBStringVal(row, "org"), models.Utils.getDBStringVal(row, "role_name"), models.Utils.getDBStringVal(row, "realm_def"), models.Utils.getDBStringVal(row, "url_def"),
          models.Utils.getDBStringVal(row, "mps_def"), models.Utils.getDBBooleanVal(row, "is_prospect"), models.Utils.getDBBooleanVal(row, "dashboard_admin"),models.Utils.getDBBooleanVal(row, "is_external"),Option(models.Utils.getDBStringVal(row, "end_customer")), models.Utils.getDBBooleanVal(row, "active"), models.Utils.getDBBooleanVal(row, "show_info")))
      } else {
        None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup by email: $email, ex: " + ex)
        None
      }
    }
  }

  def userDetails(email: String): Option[UserInfo] = {
    try {
      val username = email.toLowerCase
      val rows = vertica.user.selectUserRoleRow(username)
      if (!rows.isEmpty()) {
        val row = rows(0)
        Some(UserInfo(username, models.Utils.getDBBooleanVal(row, "active"), models.Utils.getDBStringVal(row, "campaigns", "").split(",").toList, models.Utils.getDBStringVal(row, "first_name"), models.Utils.getDBBooleanVal(row, "is_external"), models.Utils.getDBBooleanVal(row, "is_prospect"),
          models.Utils.getDBStringVal(row, "mps_def"), models.Utils.getDBStringVal(row, "org"), models.Utils.getDBStringVal(row, "realm_def"), models.Utils.getDBStringVal(row, "role_name"), models.Utils.getDBBooleanVal(row, "sso"), models.Utils.getDBStringVal(row, "type"),
          models.Utils.getDBStringVal(row, "url_def"), models.Utils.getDBBooleanVal(row, "validated"), models.Utils.getDBStringVal(row, "wb_user_name"),Option(models.Utils.getDBStringVal(row, "end_customer"))))
      } else {
        None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup by email: $email, ex: " + ex)
        None
      }
    }
  }
  /** Returns false if a user exists with the given email address
    *
    */
  def notExists(email: String): Boolean = {
    try {
      val count = vertica.user.selectRowCount(email.toLowerCase())
      count == 0
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on email exists check, email: $email, ex: " + ex)
        false
      }
    }
  }


  def notActiveSSO(email: String): (String) = {
    try {
      val rows = vertica.user.selectRow(email.toLowerCase())
      if(rows.size > 0) models.Utils.getDBStringVal(rows.head, "active") else ""
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on email exists check for SSO user email: $email, ex: " + ex)
        ""
      }
    }
  }


  /** Returns role name if a user exists with the given email address
    *
    */
  def userRole(email: String): String = {
    try {
      val row = vertica.user.selectUserRole(email.toLowerCase())
      val role = if(row.size == 1 ) models.Utils.getDBStringVal(row.head, "role_name") else ""
      log.debug(s"user role : " + role)
      role
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on fetching role, email: $email, ex: " + ex)
        ""
      }
    }
  }

  /** Returns all users belonging to a user's organization and all of its customers
    *  get all customers, for each customer get users
    */
  def allManagedBy(userid: String, userOrg: String): IndexedSeq[NewUser] = {
    val orgs = if (userOrg == GBName) vOrg.all else  Vector(userOrg)
    try {
      val xs:IndexedSeq[NewUser] = for {
        orgName <- orgs
        rows = vertica.user.selectUsersOrg(orgName, STR_BOOL)
        row <- rows
      } yield {
        NewUser(models.Utils.getDBStringVal(row, "email"), models.Utils.getDBStringVal(row, "first_name"), models.Utils.getDBStringVal(row, "last_name"), models.Utils.getDBStringVal(row, "department"),
          models.Utils.getDBStringVal(row, "city"), models.Utils.getDBStringVal(row, "state"), models.Utils.getDBStringVal(row, "country"), models.Utils.getDBBooleanVal(row, "sso"),
          models.Utils.getDBStringVal(row, "wb_user_name"), models.Utils.getDBBooleanVal(row, "report_usage"), models.Utils.getDBStringVal(row, "phone"),
          models.Utils.getDBStringVal(row, "org"), models.Utils.getDBStringVal(row, "role_name"), models.Utils.getDBStringVal(row, "realm_def"), models.Utils.getDBStringVal(row, "url_def"),
          models.Utils.getDBStringVal(row, "mps_def"), models.Utils.getDBBooleanVal(row, "is_prospect"), models.Utils.getDBBooleanVal(row, "dashboard_admin"), models.Utils.getDBBooleanVal(row, "is_external"), Option(models.Utils.getDBStringVal(row, "end_customer")), models.Utils.getDBBooleanVal(row, "active"), models.Utils.getDBBooleanVal(row, "show_info"))
      }
      log.debug(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for user: $userid, org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }

  def listByMfr(userid: String, userOrg: String): List[NewUser] = {
    val orgs = if (userOrg == GBName) vOrg.all else  Vector(userOrg)
    try {
      val xs:List[NewUser] = for {
        orgName <- orgs.toList
        rows = vertica.user.selectUsersOrg(orgName, STR_BOOL)
        totalRows = rows.size()
        row <- rows
      } yield {
        NewUser(models.Utils.getDBStringVal(row, "email"), models.Utils.getDBStringVal(row, "first_name"), models.Utils.getDBStringVal(row, "last_name"), models.Utils.getDBStringVal(row, "department"),
          models.Utils.getDBStringVal(row, "city"), models.Utils.getDBStringVal(row, "state"), models.Utils.getDBStringVal(row, "country"), models.Utils.getDBBooleanVal(row, "sso"),
          models.Utils.getDBStringVal(row, "wb_user_name"), models.Utils.getDBBooleanVal(row, "report_usage"), models.Utils.getDBStringVal(row, "phone"),
          models.Utils.getDBStringVal(row, "org"), models.Utils.getDBStringVal(row, "role_name"), models.Utils.getDBStringVal(row, "realm_def"), models.Utils.getDBStringVal(row, "url_def"),
          models.Utils.getDBStringVal(row, "mps_def"), models.Utils.getDBBooleanVal(row, "is_prospect"), models.Utils.getDBBooleanVal(row, "dashboard_admin"), models.Utils.getDBBooleanVal(row, "is_external"), Option(models.Utils.getDBStringVal(row, "end_customer")), models.Utils.getDBBooleanVal(row, "active"), models.Utils.getDBBooleanVal(row, "show_info"))
      }
      log.debug(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for user: $userid, org: $userOrg, ex: " + ex)
        List()
      }
    }
  }

  def allUsersForOrg(userid: String, userOrg: String): IndexedSeq[UserList] = {
    val orgs = if (userOrg == GBName) vOrg.all else Vector(userOrg)
    try {
      val xs: IndexedSeq[UserList] = for {
        orgName <- orgs
        rows = vertica.user.selectUsersOrg(orgName, STR_BOOL)
        totalRows = rows.size()
        row <- rows
      } yield {
        UserList(models.Utils.getDBStringVal(row, "email"), models.Utils.getDBStringVal(row, "first_name"), models.Utils.getDBStringVal(row, "last_name"),
          models.Utils.getDBStringVal(row, "wb_user_name"), models.Utils.getDBBooleanVal(row, "report_usage"),
          models.Utils.getDBStringVal(row, "org"), models.Utils.getDBStringVal(row, "role_name"), models.Utils.getDBStringVal(row, "realm_def"), models.Utils.getDBStringVal(row, "url_def"),
          models.Utils.getDBStringVal(row, "mps_def"), models.Utils.getDBBooleanVal(row, "dashboard_admin"), models.Utils.getDBBooleanVal(row, "active"), models.Utils.getDBStringVal(row, "token_id"),
          models.Utils.getDBStringVal(row, "phone"), models.Utils.getDBStringVal(row, "city"),
          models.Utils.getDBStringVal(row, "state"), models.Utils.getDBStringVal(row, "country"),models.Utils.getDBStringVal(row, "department"),models.Utils.getDBDateVal(row, "created_on", CVDefaultDate).toString(),models.Utils.getDBDateVal(row, "modified_on", CVDefaultDate).toString())
      }
      log.debug(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for user: $userid, org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }

  def activeUsersForOrg(userid: String, userOrg: String): IndexedSeq[Users] = {
    try {
      val rows = vertica.user.selectAllActiveUsersOrg(userOrg)
      val xs: IndexedSeq[Users] = (for {
        row <- rows
      } yield {
        Users(models.Utils.getDBStringVal(row, "email", CVDefaultStr))
      }).toIndexedSeq
      log.debug(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }

  def usersForOrg(userid: String, userOrg: String, mfr:String, sso:Boolean): IndexedSeq[UserListData] = {
    try {
      val rows = vertica.user.selectAllUsersOrg(sso,mfr)
      val xs: IndexedSeq[UserListData] = (for {
        row <- rows
      } yield {
        
        val created_on = if(models.Utils.getDBDateVal(row, "created_on", CVDefaultDateAsNull) != null) models.Utils.dateFormat.print(new DateTime(models.Utils.getDBDateVal(row, "created_on", CVDefaultDateAsNull), DateTimeZone.UTC).getMillis()) else CVDefaultStr
        val modified_on = if(models.Utils.getDBDateVal(row, "modified_on", CVDefaultDateAsNull) != null) models.Utils.dateFormat.print(new DateTime(models.Utils.getDBDateVal(row, "modified_on", CVDefaultDateAsNull), DateTimeZone.UTC).getMillis()) else CVDefaultStr
        val last_login = if(models.Utils.getDBDateVal(row, "last_login", CVDefaultDateAsNull) != null) models.Utils.dateFormat.print(new DateTime(models.Utils.getDBDateVal(row, "last_login", CVDefaultDateAsNull), DateTimeZone.UTC).getMillis()) else CVDefaultStr
        UserListData(models.Utils.getDBStringVal(row, "email", CVDefaultStr), models.Utils.getDBStringDefaultNA(row, "first_name", CVDefaultStr), models.Utils.getDBStringDefaultNA(row, "last_name", CVDefaultStr),
          models.Utils.getDBStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getDBBooleanVal(row, "sso", CVDefaultBool),
          models.Utils.getDBStringVal(row, "org", CVDefaultStr), models.Utils.getDBStringVal(row, "role_name", CVDefaultStr), models.Utils.getDBStringVal(row, "ui_url", CVDefaultStr), models.Utils.getDBStringDefaultNA(row, "end_customer", CVDefaultStr),
          models.Utils.getDBStringVal(row, "mps_def", CVDefaultStr), models.Utils.getDBBooleanVal(row, "dashboard_admin", CVDefaultBool),
          models.Utils.getDBStringDefaultNA(row, "phone", CVDefaultStr), models.Utils.getDBStringDefaultNA(row, "city", CVDefaultStr),
          models.Utils.getDBStringDefaultNA(row, "state", CVDefaultStr), models.Utils.getDBStringDefaultNA(row, "country", CVDefaultStr),
          models.Utils.getDBStringDefaultNA(row, "department", CVDefaultStr),
          created_on,modified_on,last_login, 
	        models.Utils.getDBBooleanVal(row, "is_external", CVDefaultBool), models.Utils.getDBStringVal(row, "active", CVDefaultStr), models.Utils.getDBBooleanVal(row, vertica.user.Col_report_usage))

      }).toIndexedSeq
      log.debug(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for user: $userid, org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }

  def ruleCreatorUsersForOrg(userOrg: String,prod: String,sch: String): IndexedSeq[RuleCreatorList] = {
    try {
      val mps = userOrg + "/" + prod + "/" + sch
      val rows = vertica.user.selectRuleCreatorsOrg(userOrg,mps)
      val xs: IndexedSeq[RuleCreatorList] = (for {
        row <- rows
        } yield {
        RuleCreatorList(models.Utils.getDBStringVal(row, "email", CVDefaultStr))
      }).toIndexedSeq
      log.info(s"All user $xs")
      xs
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while rule creator org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }




  /** Check whether the email and password combination match an entry in the database
    *
    */
  def emailPasswdMatch(email: String, passwd: String): (Boolean, Boolean) = {
    try {
      val rows = vertica.user.selectRow(email)
      if (!rows.isEmpty()) {
        val encPasswd = models.Utils.getDBStringVal(rows(0), "passwd_hash")
        //val bpass = BCrypt.hashpw(passwd,encPasswd)
        if(encPasswd.startsWith("$"))
          if(BCrypt.hashpw(passwd,encPasswd).equals(encPasswd))
            (true,true) else
            (true,false)
        else
          (true,Utils.encryptPasswd(passwd).equals(encPasswd))
      } else {
        (false, false)
      }
    } catch {
      case ex: Exception => {
        log.info("Exception thrown on passwd_hash lookup:  " + ex)
        (false, false)
      }
    }

  }

  /** Creates a user entry in the database
    */

  def createUser(user: NewUserWithPasswd): Option[String] = {
    val org = user.u.org.toLowerCase
    val email = user.u.email.toLowerCase
    val userRole = user.u.role.toLowerCase
    val mps_def = user.u.mps_def.toLowerCase().replaceAll(":", "/")
    val dateTime = DateTime.now
    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
    val sso = user.u.sso

    val rows = try {
      vertica.user.selectRoleMfrRealmId(mps_def,userRole)
    }catch{
      case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
      }
    }
    val mfr_id = models.Utils.getDBIntVal(rows.head,vertica.org.Col_mfr_id,CVDefaultInt)
    val realm_id = models.Utils.getDBLongVal(rows.head,vertica.realm.Col_realm_id)
    val role_id = models.Utils.getDBLongVal(rows.head,vertica.role.Col_role_id)
    val ui_url = models.Utils.getDBStringVal(rows.head,vertica.realm.Col_ui_url,CVDefaultStr)
    try {
      val token = if(!sso) BCrypt.hashpw(email + ts, BCrypt.gensalt(BCryptLogRounds)) else ""
      val tokenId = token.replaceAll("/","")
      val typ = if(org.equals(GBName)) GBType else MFRType
      val realm_def_id = if(email.equals(AdminEmail)) 0L else realm_id
      val realm_def = if(email.equals(AdminEmail)) "" else ui_url
      val passwd_hash = if(email.equals(AdminEmail)) Utils.encryptPasswd(AdminPasswd) else ""
      val res = vertica.user.insertUser(email,0,user.u.first_name,user.u.last_name,passwd_hash,org,user.u.phone,user.u.city,user.u.state,user.u.country,tokenId,role_id,realm_def_id,user.u.url_def,user.u.mps_def,typ,user.u.report_usage,user.u.is_external,user.u.sso,user.u.is_prospect,true,user.u.dashboard_admin,0,true,0,user.u.department,user.u.end_customer.getOrElse(""),mfr_id,realm_def)
      res match {
        case Some(SQL_ERROR) => Some("Failed to create a new user account.")
        case _ => {
          if(! email.equals(AdminEmail)) {
            vertica.user_by_mps.addUser(user.u.mps_def,email,user.u.first_name, user.u.last_name)
            models.Utils.vSendEmail(email, tokenId, true, user.u.first_name, user.u.last_name)
          }
          None
        }
      }
     } catch {
      case ex: Exception => {
        log.error(s"Failed to create an entry in the $CFNUser table for user with email: $email, ex: $ex")
        Some("Failed to create a new user account.")
      }
    }
  }

  /**
    * Updates a user entry in the database
    */

   def modify(u: UserModify, reqSessionOpt: Option[Cookie]): Option[String] = {

    val rowsRole = try {
      vertica.role.selectRow(u.role)
    }catch{
      case ex: Exception => {
        log.error(s"Exception thrown while fetching role id from role table, exception:  " + ex)
        List()
      }
    }
    val role_id = models.Utils.getDBLongVal(rowsRole.head,vertica.role.Col_role_id)

    try {
      log.debug(s"payload : $u")
      val userGroupRows = vertica.user.selectUserGroupName(u.email)
      val existingGroupName = if(userGroupRows.size > 0) models.Utils.getDBStringVal(userGroupRows.head, vertica.user.Col_end_customer, "") else ""
      val payloadGroupName = u.end_customer.getOrElse("")
      val userGroupName = payloadGroupName
      val db_role_id = if(!u.role.equals("")) models.Utils.getDBLongVal(vertica.role.selectRoleId(u.role).head,vertica.role.Col_role_id) else 0L
      val userMPSRows = vertica.user.selectUsersDefMPS(u.email)
      val mpsDef = if(userMPSRows.size > 0) models.Utils.getDBStringVal(userMPSRows.head, vertica.user.Col_mps_def, "") else ""
      if(!mpsDef.equalsIgnoreCase(s"${u.mps_def}")){
        val mpsList = if(mpsDef.isEmpty) List() else mpsDef.split("/").toList
        val (m, p, s) = if(mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
        DBUtils.deleteAlertFilterAttributesRows(m, p, s, mpsDef, None, Some(List(u.email)), None, reqSessionOpt)
      }
      if(db_role_id > 0L){
        DBUtils.checkRemovedMPSFARefreshCache(List(u.email), role_id, reqSessionOpt)
      }
      val res = vertica.user.updateUser(u.f_name,u.l_name,u.report_usage,u.dashboard_admin,u.department,u.city,u.state,u.country,role_id,u.phone,u.mps_def,u.is_external,userGroupName,u.wb_user_name,u.email)
      res match {
        case Some(SQL_ERROR) => Some("Failed to update user account.")
        case _ => {
          if(!userGroupName.equals(existingGroupName)){
            log.debug(s"Group changed from $existingGroupName to $userGroupName")
            val mpsList = if(u.mps_def.isEmpty) List() else u.mps_def.split("/").toList
            val (m, p, s) = if(mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
            val userMpsList = if(userGroupName.equals("")){
              log.debug(s"User group name is empty so calling for role mps to get mps list: email : ${u.email}")
              val userMpsRows = vertica.user.getUserMpsList(u.email.toLowerCase())
              for(row <- userMpsRows) yield models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps,"")
            } else {
              val usersGroupRows = vertica.user.selectGroupUsersInfo(None, None, Some(List(u.email)))
              val groupMps = if(usersGroupRows.size > 0){
                val exs_mps = models.Utils.getDBStringVal(usersGroupRows.head, vertica.end_customer.Col_mps, "")
                val mps_def = models.Utils.getDBStringVal(usersGroupRows.head, vertica.user.Col_mps_def, "")
                if(exs_mps.equals("")) mps_def else exs_mps
              } else ""
              List(groupMps)
            }
            userMpsList.foreach({ userMps =>
              if(!userMps.equals("")){
                val userGrpEmailFld = if(userGroupName.equals("")) Some("") else None
                DBUtils.deleteAlertFilterAttributesRows(m, p, s, userMps, None, Some(List(u.email.toLowerCase())), userGrpEmailFld, reqSessionOpt)
              }
            })
          } else{
            log.debug(s"No changes in assigned group $existingGroupName to the user : ${u.email}, hence not calling deleteAlertFilterAttributesRows method...")
          }
          None
        }
      }
   } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table for user with email: ${u.email}, ex: $ex")
        Some("Failed to update user account.")
      }
    }
  }


  def disable(userid: String, reqSessionOpt: Option[Cookie] = None): Option[String] = {
    try {
      val res = vertica.user.disable(userid)
      res match {
        case Some(SQL_ERROR) => Some("Failed to disable user.")
        case _ => {
          models.vClinsight.deleteUsersDeviceInfo(List(userid))
          deleteRefreshCacheForUsers(List(userid.toLowerCase()), reqSessionOpt)
          None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to disable user: '$userid', ex: $ex")
        Some("Failed to disable user.")
      }
    }
  }

  def enable(userid: String, reqSessionOpt: Option[Cookie] = None): Option[String] = {
    try {
      val res = vertica.user.enable(userid)
      res match {
        case Some(SQL_ERROR) => Some("Failed to enable user.")
        case _ => {
          deleteRefreshCacheForUsers(List(userid.toLowerCase()), reqSessionOpt)
          None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to enable user: '$userid', ex: $ex")
        Some("Failed to enable user.")
      }
    }
  }

  def updateSSOToken(userid: String, tokenId: String): Boolean = {
    try {
      val res = vertica.user.updateSSOToken(userid, tokenId);
      res match {
        case Some(SQL_ERROR) => false
        case _ => true
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update SSO Token for : '$userid', ex: $ex")
        false
      }
    }
  }
  def enableSSOUser(userid: String): Boolean = {
    try {
      val res = vertica.user.enable(userid)
      res match {
        case Some(SQL_ERROR) => false
        case _ => true
      }

    } catch {
      case ex: Exception => {
        log.error(s"Failed to enable SSO user: '$userid', ex: $ex")
        false
      }
    }
  }

  /** Track the User activity and insert entry in user_activity column family
    *
    */
  def userTracking(mfr: String, prod: String, sch: String, email: String, session_id: String, app: String, module: String, activity: String, switched_feature: Option[String], detail: String, solr_qry: String): Option[String]= {
    val dateTime = new DateTime(DateTime.now, DateTimeZone.UTC)
    val month =  dateTime.withDayOfMonth(1).withTimeAtStartOfDay().getMillis()
    val ts = dateTime.getMillis()
    try {
      val mps = mfr + "/" + prod + "/" + sch
      val res = vertica.user_activity.addUserTracking(mps,month,email.toLowerCase(),session_id,app,module,activity,detail,solr_qry)
      res match {
        case Some(SQL_ERROR) => Some("Failed to track user.")
        case _ => {
          val (rows, index) = switched_feature match {
            case Some(sf) => (vertica.user_activity.getTwoRows(mps,email.toLowerCase(),session_id,sf,month),0)
            case None => (vertica.user_activity.getTwoRows(mps,email.toLowerCase(),session_id,app,month),1)
          }
          if(rows.size > 1){
            val row = rows(index)
            val mps = models.Utils.getDBStringVal(row,vertica.user_activity.Col_mps, CVDefaultStr)
            val month = models.Utils.getDBLongVal(row,vertica.user_activity.Col_month, CVDefaultLong)
            val email = models.Utils.getDBStringVal(row,vertica.user_activity.Col_email, CVDefaultStr)
            val feature = models.Utils.getDBStringVal(row,vertica.user_activity.Col_app, CVDefaultStr)
            val startTs = models.Utils.getDBDateVal(row,vertica.user_activity.Col_start_ts, CVDefaultDate)
            val switchedFeat = if(feature.equals(app)) "" else app
            vertica.user_activity.updateFeature(switchedFeat,mps,month,email,session_id,feature,startTs)
          }
	
          trackUserAccessActivity(mfr, prod, sch, email, session_id, ts)
          None
        }
      }

    } catch {
      case ex: Exception => {
        log.error(s"Failed to create an entry in the $CFNUserActivity table :" + ex)
        Some("Failed to track user.")
      }
    }

  }

  /** creates a password for the first time logging user
    *
    */
  def createPasswd(passwdForm : UserUpdatePasswd) : Try[Any]= {
    try {
      val user_id = passwdForm.email.toLowerCase()
      val passwd = passwdForm.passwd
      val token_id = passwdForm.token_id
      val currentTime = DateTime.now.getMillis()
      val userData = vertica.user.getUserState(user_id)
      if (userData.size < 1) {
        throw new Exception(s"NoUser")
      } else {
        val row = userData.head
        val createdTime = models.Utils.getDBDateVal(row, "created_on", CVDefaultDate).getTime()
        val tokenId = models.Utils.getDBStringVal(row, vertica.user.Col_token_id, CVDefaultStr)
        val active = models.Utils.getDBStringVal(row, vertica.user.Col_active, CVDefaultStr)
        if (currentTime - createdTime > linkExpiry * 1000) {
          throw new Exception(s"Expired")
        } else if (tokenId.isEmpty()) {
          throw new Exception(s"PasswordAlreadySet")
        } else if (!tokenId.equals(token_id)) {
          throw new Exception(s"InValidToken")
        } else {
          val encPasswd = BCrypt.hashpw(passwd, BCrypt.gensalt(BCryptLogRounds))
          val user_state = vertica.user.UserStateStringMapping(active)
          active match {
            case UserInvited => vertica.user.createPassword("", encPasswd, 0, 0, "", "", user_id)
            case _ => vertica.user.createPassword("", encPasswd, user_state, 0, "", "", user_id)
          }

        }
      }
    } catch {
      case ex: Exception =>
        log.error(s" Error while updating password for user_id ${passwdForm.email} ex: $ex")
        Failure(ex)
    }
  }

  /** updates password if a user has forgotten passwd
    *
    */
  def forgotPasswd(email : String) : Try[Any] = {
    try {
      val user_state = vertica.user.getUserState(email)
      val row = user_state.head
      val active = models.Utils.getDBStringVal(row, vertica.user.Col_active, CVDefaultStr)
      if(active != UserActive){
        log.error(s"User is not active : $email")
        throw new RuntimeException(s"UserInactive")
      }
      val currentTime = DateTime.now
      val currTs = new DateTime(currentTime, DateTimeZone.UTC).getMillis()
      val token = BCrypt.hashpw(email + currTs, BCrypt.gensalt(BCryptLogRounds))
      val tokenId = token.replaceAll("/","")
      val res = vertica.user.updateUserToken(tokenId,email.toLowerCase())
      res match {
        case Some(SQL_ERROR) => throw new Exception(s"Failed to update Token")
        case _ => {
          val userName = vertica.user.getFirstLastName(email.toLowerCase()).head
          models.Utils.vSendEmail(email, tokenId, false, models.Utils.getDBStringVal(userName, vertica.user.Col_first_name,""), models.Utils.getDBStringVal(userName, vertica.user.Col_last_name,""))
          Success(s"Reset Password link sent successfully..")
       }
      }

    } catch {
      case ex: Exception =>
        log.error(s" Error while sending reset password link to the user $email with exception ex: $ex")
        Failure(ex)
    }
  }

  def changePasswd(passwdForm : UserUpdatePasswd) : Try[Any] = {
    try {
      val encPasswd = BCrypt.hashpw(passwdForm.passwd, BCrypt.gensalt(BCryptLogRounds))
      vertica.user.changePassword(encPasswd,Int.box(0),"","",passwdForm.email.toLowerCase())
    } catch {
      case ex: Exception =>
        log.error(s" Error while changing the password for the user ${passwdForm.email} with exception ex: $ex")
        Failure(ex)
    }
  }

  def resetPasswd(passwdForm : UserResetPassword) : Try[Any] = {

    val encPasswd = BCrypt.hashpw(passwdForm.password, BCrypt.gensalt(BCryptLogRounds))
    try {
      vertica.user.resetPassword(encPasswd,0,"",passwdForm.email.toLowerCase())
    } catch {
      case ex: Exception =>
        log.error(s" Error while changing the password for the user ${passwdForm.email} with exception ex: $ex")
        Failure(ex)
    }
  }

  def updateDefaults(userDefs: UserDefaults, userid: String): Try[Any] = {

    val rows = try {
      vertica.realm.selectRealmIdByUiUrl(userDefs.realm_def)
    }catch{
      case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
      }
    }
    val realm_id = if(rows.size > 0) models.Utils.getDBLongVal(rows.head, vertica.realm.Col_realm_id) else 0L
    try {
      vertica.user.updateDefaults(realm_id,userDefs.realm_def,userDefs.url_def, userDefs.mps_def, userid.toLowerCase())

    } catch {
      case ex: Exception =>
        log.error(s" Error while updating the defaults for user $userid with exception ex: $ex")
        Failure(ex)
    }
  }

  def disableInfo(userid: String): Try[Any] = {
    try {
      vertica.user.disable_user_show_help_info(userid.toLowerCase())
      } catch {
      case ex: Exception =>
        log.error(s" Error while disabling info for user $userid with exception ex: $ex")
        Failure(ex)
    }
  }
  def exportLimit(userid: String, limit: Int): Try[Any] = {
    try {
      vertica.user.updateEventExportLimit(userid.toLowerCase(),limit)
    } catch {
      case ex: Exception =>
        log.error(s" Error while updating event export limit for user $userid with exception ex: $ex")
        Failure(ex)
    }
  }
  /** Creates a user entry in the database
    */
  def createSsoUserPing(user: String,org: String,mps: String,user_role: String,url: String): Boolean = {
    val email = user.toLowerCase()
    val sso = true
    val report_usage = true
    val role = user_role
    val dateTime = DateTime.now
    val mps_def = mps
    val realm_def = url
    val typ = "MFR"
    val validated = true
    val is_prospect = false
    val is_external = false
    val url_def = Play.current.configuration.getString("sso.redirect_def_url").getOrElse("")

    val rows = try {
      vertica.user.selectRoleMfrRealmId(mps_def,role)
    }catch{
      case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
      }
    }
    val mfr_id = models.Utils.getDBIntVal(rows.head,vertica.org.Col_mfr_id,CVDefaultInt)
    val realm_id = models.Utils.getDBLongVal(rows.head,vertica.realm.Col_realm_id)
    val role_id = models.Utils.getDBLongVal(rows.head,vertica.role.Col_role_id)
    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
    try {
      vertica.user.createUserSSOPing(email, Boolean.box(true), Boolean.box(sso),Boolean.box(validated),Boolean.box(is_prospect),Boolean.box(is_external),Boolean.box(report_usage), org, role_id, mps_def, url_def, realm_id, typ, Int.box(0), Boolean.box(true), Int.box(0), mfr_id)
    } catch {
      case ex: Exception => {
        log.error(s"Failed to create SSO User entry in the $CFNUser table for user with email: $email, ex: $ex")
        false
      }
    }
  }
  def createSsoUserSalesforce(user: String,org: String,user_role: String,firstname: String,lastname: String,email: String,mps: String,domain: String): Boolean = {
    val email_id = email.toLowerCase()
    val sso = true
    val report_usage = true
    val role = user_role
    val first_name = firstname
    val last_name = lastname
    val mps_def = mps
    val realm_def = domain
    val typ = "MFR"
    val validated = true
    val is_prospect = false
    val is_external = false
    val url_def = Play.current.configuration.getString("sso.redirect_def_url").getOrElse("")
    val dateTime = DateTime.now
    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()

    val rows = try {
      vertica.user.selectRoleMfrRealmId(mps_def,role)
    }catch{
      case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
      }
    }
    val mfr_id = models.Utils.getDBIntVal(rows.head,vertica.org.Col_mfr_id,CVDefaultInt)
    val realm_id = models.Utils.getDBLongVal(rows.head,vertica.realm.Col_realm_id)
    val role_id = models.Utils.getDBLongVal(rows.head,vertica.role.Col_role_id)

    try {
      vertica.user.createUserSSOSalesforce(email_id, Boolean.box(true), Boolean.box(sso),Boolean.box(report_usage), org, role_id, first_name, last_name, mps_def, url_def, realm_id, typ, Boolean.box(validated), Boolean.box(is_prospect),Boolean.box(is_external), Int.box(0), Boolean.box(true), Int.box(0),mfr_id)

    } catch {
      case ex: Exception => {
        log.error(s"Failed to create SSO User entry in the $CFNUser table for user with email: $email, ex: $ex")
        false
      }
    }
  }

  def getUserState(email: String): (Option[String], String, String) = {
    try {
      val username = email.toLowerCase()
      val rows = vertica.user.selectRow(username)
      if(rows.size > 0){
        val row = rows.head
        val user_state = models.Utils.getDBStringVal(row, "active", UserInactive)
        val llOTP = models.Utils.getDBDateVal(row, "last_login_otp", CVDefaultDate)
        val rAdrs = models.Utils.getDBStringVal(row, "remote_address", "")
        val lastLoginOTP = llOTP match {
          case x: Date => x.getTime().toString()
          case _ => ""
        }
        val remoteAddress = if(rAdrs.isEmpty()) "" else rAdrs
        (Some(user_state), lastLoginOTP, remoteAddress)
      }
      else{
        (Some(UserInactive), "", "")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed get data from user CF for: $email, ex: $ex")
        (Some(UserInactive), "", "")
      }
    }
  }
  def getUserLoginFailedStatus(email: String): Boolean = {
    try {
      val username = email.toLowerCase()
      val rows = vertica.user.selectUserFailedLoginStatus(username)
      if(rows > 0){
       true
      }
      else{
        false
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed get data from user CF for: $email, ex: $ex")
        false
      }
    }
  }

  def trackUserLoginActivity(mfr: String, prod: String, sch: String, email: String, session_id: String) = {
    val userName = vertica.user.getFirstLastName(email.toLowerCase()).head
    val mps = mfr + "/" + prod + "/" + sch
    try {
      vertica.user_by_mps.userLoginActivity(mps,email.toLowerCase(),models.Utils.getDBStringVal(userName, vertica.user.Col_first_name,""),models.Utils.getDBStringVal(userName, vertica.user.Col_last_name,""),session_id)
    } catch {
      case ex: Exception => log.error(s"Error: Exception caused while tracking login activity user for mps: $mfr, $prod, $sch, and user: $email ex: $ex")
      None
    }

  }

  def trackUserAccessActivity(mfr: String, prod: String, sch: String, email: String, session_id: String, ts: Long) = {
    try {
      val mps = mfr + "/" + prod + "/" + sch
      val rows = vertica.user_by_mps.getLastSessionId(mps,email)
      if (rows.size > 0) {
        val row = rows.head
        val sess_id = models.Utils.getDBStringVal(row,vertica.user_by_mps.Col_last_sess_id, CVDefaultStr)
        if (sess_id.equals(session_id)) {
           vertica.user_by_mps.updateLastAccess(mps,email.toLowerCase())
        }
      }
    } catch {
      case ex: Exception => log.error(s"Error: Exception caused while tracking access activity user for mps: $mfr, $prod, $sch, and user: $email ex: $ex")

    }
  }

  def trackUserLogoutActivity(mfr: String, prod: String, sch: String, email: String, session_id: String, feature: String) = {
    try {
      val logoutTs = new DateTime(DateTime.now, DateTimeZone.UTC)
      val month =  logoutTs.withDayOfMonth(1).withTimeAtStartOfDay().getMillis()
      val ts = logoutTs.getMillis()
      val mps = mfr+"/"+prod+"/"+sch
      val rows = vertica.user_by_mps.getLastSessionId(mps,email)

      if (rows.size > 0) {
        val row = rows.head
        val sess_id = models.Utils.getDBStringVal(row,vertica.user_by_mps.Col_last_sess_id, CVDefaultStr)
        if (sess_id.equals(session_id)) {
          vertica.user_by_mps.updateLastLogout(mps,email)
        }
      }
      val rowsUserActivity = vertica.user_activity.getSingleRow(mps,email,session_id,feature,month)
      if(rowsUserActivity.size > 0){
        val row = rowsUserActivity.head
        val startTs = models.Utils.getDBDateVal(row,vertica.user_activity.Col_start_ts, CVDefaultDate)
        vertica.user_activity.updateEndTime(mps, month, email.toLowerCase(), session_id, feature, startTs)
      }
    } catch {
      case ex: Exception => log.error(s"Error: Exception caused while tracking logout activity user for mps: $mfr, $prod, $sch, and user: $email ex: $ex")
    }
  }

  def regenerateVerificationEmail(email: String): Option[String] = {
    try {
      val rows = vertica.user.selectRow(email.toLowerCase())
      if (rows.size == 1) {
        val row = rows.head
        val tokenId = models.Utils.getDBStringVal(row,"token_id",CVDefaultStr)
        val f_name = models.Utils.getDBStringVal(row,"first_name",CVDefaultStr)
        val l_name = models.Utils.getDBStringVal(row,"last_name",CVDefaultStr)
        models.Utils.sendEmail(email.toLowerCase(), tokenId, true, f_name, l_name)
        None
      } else {
        Some("NoUserAsSuch")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to regenerate verification email and send to user: $email, ex: $ex")
        Some("RegenerationFailed")
      }
    }
  }

  def filterResult(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String],
                   filterOpt: Option[String]) : List[Array[Any]] = {
    filterOpt match {
      case Some(f) =>
        val fList = f.trim.split(" AND ").toList
        val fnew = fList map {x => FilterParsers(x.toString)}
        UserTrackingTable.where(mfr, prod, sch, ec, st, et, cols, fnew)
      case None =>
        UserTrackingTable.getRawData(mfr, prod, sch, ec, st, et, cols)
    }
  }

  def sortResult(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String],
                 orderbyOpt: Option[String], filteredData: List[Array[Any]]) : List[Array[Any]] = {
    orderbyOpt match {
      case Some(s) =>
        val (sCol, asc) = SortbyParsers(s)
        if (cols.contains(sCol)) {
          UserTrackingTable.sort(mfr, prod, sch, ec, st, et, cols, sCol, asc, filteredData)
        } else {
          filteredData
        }
      case None =>
        filteredData
    }
  }

  def limitResult(limitOpt: Option[Integer], sortedData: List[Array[Any]]): List[Array[Any]] = {
    limitOpt match {
      case Some(s) =>
        sortedData.slice(0, s)
      case None => sortedData
    }
  }

  def checkExpiration = {
    val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC)
    val rows = vertica.user.selectAllRowsCass()
    for (row <- rows) {
      val is_prospect = models.Utils.getDBBooleanVal(row, "is_prospect")
      val is_active = models.Utils.getDBBooleanVal(row, "active")
      if (is_prospect && is_active) {
        val ts = new DateTime(models.Utils.getDBDateVal(row, "created_on", CVDefaultDate), DateTimeZone.UTC).getMillis()
        val created_on = new DateTime(ts, DateTimeZone.UTC)
        val expiryDays = models.Utils.getDBIntVal(row, "expire_in_days")
        val email = models.Utils.getDBStringVal(row, "email")
        val f_name = models.Utils.getDBStringVal(row, "first_name")
        val l_name = models.Utils.getDBStringVal(row, "last_name")
        val timeDiffInDays = Days.daysBetween(created_on, currentTs).getDays()
        val emailContent = getEmailContent(timeDiffInDays)
        if(timeDiffInDays >= expiryDays ) {
          val res = disable(email)
          res map { errorMsg =>
            log.error(s"$errorMsg : $email")
          } getOrElse (models.Utils.sendWelcomeEmail(email, f_name, l_name, timeDiffInDays, emailContent._3, false))
        }
        else{
          if(emailContent._2){
            models.Utils.sendWelcomeEmail(email, f_name, l_name, timeDiffInDays, emailContent._3, false)
          }
        }
      }
    }
  }

  def getEmailContent(timeDiffInDays: Int) : (Int, Boolean, String, String) = {
    val emailTrialContentObj = EmailTrialContentObj.get.unwrapped.toMap
    val emailDayContentList = emailTrialContentObj.keys.toList
    if(emailDayContentList.contains(timeDiffInDays.toString())){
      val dayContent = EmailTrialContent.getConfig(timeDiffInDays.toString())
      val enabled = dayContent.get.getBoolean("enabled").getOrElse(true)
      val subject = dayContent.get.getString("subject").getOrElse("")
      val body = dayContent.get.getString("body").getOrElse("")
      (timeDiffInDays, enabled, subject, body)
    }
    else{
      (timeDiffInDays, false, "", "")
    }
  }

  def logoutIdle = {
    def getAppStartMaxTs(iu: (String, String, String, Long)) : (String, Long) = {
      def getAppStartTs(a: String) : Map[String, Long] = {
        val m = new DateTime(iu._4, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis
        val mps = iu._1
        val rows = vertica.user_activity.selectStartEndTime(mps,Long.box(m),iu._2,iu._3,a)
        if(rows.head.size == 0){
          Map(a -> 0L)
        } else {
          val start_ts = new DateTime(models.Utils.getDBDateVal(rows.head, "start_ts", CVDefaultDate)).toDate.getTime
          Map(a -> start_ts)
        }
      }
      val appVals = List("Explorer", "Apps", "Workbench", "Support Portal", "Health Check", "Dashboards", "Rules & Alerts", "Log Vault", "File Upload")
      val appStart = appVals.foldLeft(Map[String, Long]())((f, a) => f ++ getAppStartTs(a))
      val appMapStartAll = ListMap(appStart.toSeq.sortWith(_._2 > _._2):_*)
      appMapStartAll.toSeq.head
    }

    val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
    val rows = vertica.user_by_mps.selectAllRows()
    val idleUsers = (for { row <- rows
                           last_acess = new DateTime(models.Utils.getDBDateVal(row,"last_access",CVDefaultDate)).toDate.getTime
                           last_logout = new DateTime(models.Utils.getDBDateVal(row,"last_logout",CVDefaultDate)).toDate
                           last_login = new DateTime(models.Utils.getDBDateVal(row,"last_login",CVDefaultDate)).toDate.getTime
                           if(currentTs - last_acess > sessionTimeoutInMillis && (last_logout == null || (last_logout.getTime < last_login)))
    } yield {
      val mps = models.Utils.getDBStringVal(row,"mps",CVDefaultStr)
      val email = models.Utils.getDBStringVal(row,"email",CVDefaultStr)
      val lastSessId = models.Utils.getDBStringVal(row,"last_sess_id",CVDefaultStr)
      (mps, email, lastSessId, last_acess)
    }).toList

    for(idleUser <- idleUsers){
      vertica.user_by_mps.updateLastLogout(idleUser._1,idleUser._2)
      val appStart = getAppStartMaxTs(idleUser)
      val m = new DateTime(idleUser._4, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis
      vertica.user_activity.updateEndTime(idleUser._1, Long.box(m), idleUser._2, idleUser._3, appStart._1, new Date(appStart._2))
      }
  }

  /**
    * Update ums.user.failed_login value to 0
    */
  def updateSuccessLoginAttempt(usrEmail: String, reqSessionOpt: Option[Cookie] = None) : Option[String] = {
    try {
      enable(usrEmail, reqSessionOpt)
//      vertica.user.updateSuccessLogin(usrEmail, true, 0)
    } catch {
      case ex: Exception =>
        log.error(s"Failed to update failed_login count of user to 0: '$usrEmail', ex: $ex")
        Some("Failed to update failed_login count of user to 0.")
    }
  }


  /**
    * Increments ums.user.failed_login value by 1
    */
  def updateFailedLoginAttempt(usrEmail: String) : (Option[String], Int) = {
    try {
      val rows = vertica.user.selectUserRoleRow(usrEmail.toLowerCase())
      var remainingAttempt = FailedLoginMaxLimit
      if(rows.size == 1){
        val dateTime = DateTime.now
        val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
        val failed_login_count = models.Utils.getDBIntVal(rows(0), "failed_login") + 1
        var active = models.Utils.getDBBooleanVal(rows(0), "active")
        if(failed_login_count == FailedLoginMaxLimit && BlockUser){
          active = false
        }
        val attempt_ts = new Timestamp(ts)
        val res = vertica.user.updateFailedLoginAttempt(usrEmail, active, attempt_ts, failed_login_count)
        res match {
          case Some(SQL_ERROR) => (Some("Failed to increment failed_login count of user."), -1)
          case _ => {
            remainingAttempt = FailedLoginMaxLimit - failed_login_count
            if(failed_login_count == FailedLoginMaxLimit && BlockUser) {
            val resLastLogin = vertica.user.updateLastLogin(usrEmail.toLowerCase(), null, null)
              resLastLogin match {
                case Some(SQL_ERROR) => (Some("Failed to update last login otp."), -1)
                case _ => {
                  sendAccountBlockedEmailToUser(usrEmail)
                  (None, remainingAttempt)
                }
              }
            } else {
              (None, remainingAttempt)
            }
          }
        }
    } else {
        (None, remainingAttempt)
      }

    } catch {
      case ex: Exception => {
        log.error(s"Failed to increment failed_login count of user: '$usrEmail', ex: $ex")
        (Some("Failed to increment failed_login count of user."), -1)
      }
    }
  }

  /**
    * Sends an Alert(Account Blocked) email to user
    */
  def sendAccountBlockedEmailToUser(usrEmail: String) = {
    val rows = vertica.user.selectRow(usrEmail.toLowerCase())
    if(rows.size == 1){
      val row =rows.head
      val email = models.Utils.getDBStringVal(row, "email")
      val f_name = models.Utils.getDBStringVal(row, "first_name")
      val l_name = models.Utils.getDBStringVal(row, "last_name")
      val failed_login = models.Utils.getDBIntVal(row, "failed_login")
      val last_failed_login_time_date = models.Utils.getDBDateVal(row, "last_failed_login_time", CVDefaultDate)
      val last_failed_login_time = new DateTime(last_failed_login_time_date, DateTimeZone.UTC)
      val timeString = models.Utils.calculateTimetoShow(BlockUserTimePeriod)
      models.Utils.sendAccountBlockedEmail(email, f_name, l_name, last_failed_login_time, timeString)
    }
  }


  /**
    * Activate user if user is blocked for more than 'block_user_time_period'
    */
  def checknActivateUser = {
    try {
      if(ActivateBlockedUser) {
        val rows = vertica.user.selectAllRowsCass()
        for (row <- rows) {
          val email = models.Utils.getDBStringVal(row, "email")
          val failed_login = models.Utils.getDBIntVal(row, "failed_login")
          val currentTime = DateTime.now.getMillis()
          val last_failed_login_time = models.Utils.getDBDateVal(row, "last_failed_login_time", CVDefaultDate).getTime()
//          log.debug(s"last_failed_login_time :$last_failed_login_time, email :$email, currentTime: $currentTime")
          if (failed_login >= FailedLoginMaxLimit && (currentTime - last_failed_login_time > BlockUserTimePeriod * 1000)) {
            if (BlockUser) {
              val dateTime = DateTime.now
              val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
              vertica.user.updateFailedLoginTime(email.toLowerCase(), ts, true, 0)
            }
          }
        }
      }
    }catch {
      case ex: Exception => {
        log.error(s"Failed to activate user, ex: $ex")
        Some("Failed to activate user.")
      }
    }
  }

  def isDashboardAdmin(email: String, mfr: String, prod:String, sch:String): Boolean = {
    try {
      val username = email.toLowerCase
      val rows = vertica.user.selectUserRoleRow(username)
      if(rows.size > 0){
        val role = models.Utils.getDBStringVal(rows.head, vertica.role.Col_role_name, "")
        if(!role.isEmpty()){
          val roleRows = DBUtils.getRoleRowData(role)
          if(roleRows.size == 1){
            val row = roleRows.head
            val permissions = row("permissions").asInstanceOf[Map[String, String]]
            val domains = row("domains").asInstanceOf[Map[String, String]]
            val mps = domains.values.toList
            val mpsparam = s"$mfr/$prod/$sch"
            for (mpsindex <- mps if (mpsparam == mpsindex && permissions(mpsindex).contains(FeatDashboardAdmin))){
              return true
            }
          }
          log.error(s"Either role does not exist or more than one role with same name")
        }

      }
      log.error(s"User $email is not associated to any role")
      false

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup by email: $email, ex: " + ex)
        false
      }
    }
  }

  def getDashboardAdminUsers(mfr: String, prod:String, sch:String): List[JsObject] = {
    try {
      DBUtils.getMfrAdminUsers(mfr: String, List(FeatDashboardAdmin), INCLUDE_TEXT)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup ex: " + ex)
        List()
      }
    }
  }

  def getTableauAdminUsers(mfr: String, prod:String, sch:String): List[JsObject] = {
    try {
      DBUtils.getMfrAdminUsers(mfr: String, List(FeatDashboardAdmin, FeatWorkBench), INCLUDE_TEXT)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup ex: " + ex)
        List()
      }
    }
  }

  def bulkUpdateCustomerUser(users: BulkUpdateUsers, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val usersRows = vertica.user.selectGroupUsersInfo(None, None, Some(users.usrEmails.toList))
      var userGroupMpsInfoAcc = Map[String, UserGroupMpsInfo]()
      val new_group = users.end_customer.getOrElse("NA")
      usersRows.foreach(user => {
        val email = models.Utils.getDBStringVal(user, vertica.user.Col_email)
        val old_group = models.Utils.getDBStringVal(user, vertica.user.Col_end_customer, "")
        val exs_mps = models.Utils.getDBStringVal(user, vertica.end_customer.Col_mps, "")
        val mps_def = models.Utils.getDBStringVal(user, vertica.user.Col_mps_def, "")
        val grpMps = if(exs_mps.equals("")) mps_def else exs_mps
        val assingnedGroup = if(new_group.equals("NA")) old_group else new_group
        if(!userGroupMpsInfoAcc.contains(email)) {
          userGroupMpsInfoAcc = userGroupMpsInfoAcc ++ Map(email -> UserGroupMpsInfo(email, old_group, assingnedGroup, grpMps))
        }
      })
      val role_id = if(!users.role.getOrElse("").equals("")) models.Utils.getDBLongVal(vertica.role.selectRoleId(users.role.get).head,vertica.role.Col_role_id) else 0L
      val password = if(!users.password.getOrElse("").equals("")) BCrypt.hashpw(users.password.get, BCrypt.gensalt(BCryptLogRounds)) else ""
      val is_active = if(!users.user_state.getOrElse("").equals("")) vertica.user.UserStateStringMapping(users.user_state.get) else null
      if(role_id > 0){
        DBUtils.checkRemovedMPSFARefreshCache(users.usrEmails.toList, role_id, reqSessionOpt)
      }
      users.usrEmails.toList.foreach(usr => {
        val userMPSRows = vertica.user.selectUsersDefMPS(usr)
        val mpsDef = if(userMPSRows.size > 0) models.Utils.getDBStringVal(userMPSRows.head, vertica.user.Col_mps_def, "") else ""
        if(!mpsDef.equalsIgnoreCase(s"${users.mps_def}")){
          val mpsList = if(mpsDef.isEmpty) List() else mpsDef.split("/").toList
          val (m, p, s) = if(mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
          DBUtils.deleteAlertFilterAttributesRows(m, p, s, mpsDef, None, Some(List(usr)), None, reqSessionOpt)
        }
      })
      val res = vertica.user.updateBulkUsers(users.usrEmails.toList, users.usrEmails.mkString("','"),is_active,users.mps_def.getOrElse(""),role_id,password,users.end_customer.getOrElse("NA"))
      res match{
        case Some(x) => Some(x)
        case None => {
          users.usrEmails.toList.foreach(user => {
            if(userGroupMpsInfoAcc.contains(user)){
              val userInfo = userGroupMpsInfoAcc(user)
              val mpsList = if(userInfo.mps.isEmpty) List() else userInfo.mps.split("/").toList
              val (m, p, s) = if(mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
              if(!userInfo.old_group.equals(userInfo.new_group)) {
                val userMpsList = if (userInfo.new_group.equals("")) {
                  val userMpsRows = vertica.user.getUserMpsList(userInfo.user.toLowerCase())
                  for (row <- userMpsRows) yield models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps, "")
                } else List(userInfo.mps)
                userMpsList.foreach({ userMps =>
                  if (!userMps.equals("")) {
                    log.debug(s"User group name is empty so calling for role mps : $userMps and email : ${userInfo.user}")
                    val userGrpEmailFld = if(userInfo.new_group.equals("")) Some("") else None
                    DBUtils.deleteAlertFilterAttributesRows(m, p, s, userMps, None, Some(List(userInfo.user.toLowerCase())), userGrpEmailFld, reqSessionOpt)
                  }
                })
              } else {
                log.debug(s"Old group and new group name bot are same so just calling refresh AE cache API : user : ${userInfo.user} and group : ${userInfo.new_group}")
                models.RulesAlerts.refreshAECache(m, p, s, userInfo.mps, Some(users.usrEmails.toList), None, reqSessionOpt)
              }
            }
          })
          None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table, ex: $ex")
        Some("Failed to update user(s)")
      }
    }
  }

  def bulkDeleteCustomerUser(mfr: String, users: BulkDeleteUsers, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      var deleteUserList = ""
      users.usrEmails.foreach(email => {
        if(deleteUserList == ""){
          deleteUserList = "'" + email + "'"
        } else {
          deleteUserList += "," + "'" + email + "'"
        }
      })
      models.vClinsight.deleteUsersDeviceInfo(users.usrEmails.toList)
      val emailId = if(users.usrEmails.toList.size > 0) users.usrEmails.toList(0).toLowerCase else ""
      val userRows = vertica.user.selectUsersDefMPS(emailId)
      val mpsDef = if(userRows.size > 0) models.Utils.getDBStringVal(userRows.head, vertica.user.Col_mps_def, "") else ""
      val mpsList = if(mpsDef.isEmpty) List() else mpsDef.split("/").toList
      val (m, p, s) = if(mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
      DBUtils.checkRemovedMPSFARefreshCache(users.usrEmails.toList, 0, reqSessionOpt)
      val res = vertica.user.deleteBulkUser(deleteUserList, users.usrEmails.toList)
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete user(s)")
        case _ => {
          None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to delete users from $CFNUser table, ex: $ex")
        Some("Failed to delete user(s)")
      }
    }
  }

  def isUserAvailable(email: String): Boolean = {
    try {
      val rows = vertica.user.selectRow(email.toLowerCase(), STR_BOOL)
      val isActive = models.Utils.getDBBooleanVal(rows.head, "active")
      val isAvailable = if (rows.size > 0 && isActive) true else false
      isAvailable
    }catch {
      case e: Exception =>
        log.error(s"Failed to fetch $email from user table, failed with exception: $e")
        false
    }
  }

  def twoAuthTargetList(mfr: String, prod: String, sch: String, org: String, email: String): (Boolean, List[TwoAuthDevices]) = {
    try {
      val username = email.toLowerCase();
      val rows = vertica.user.selectUserRoleRow(username)
      if (rows.size > 0) {
        val row = rows.head
        val isTwoAuthEnabledAtMPSLevel = models.vOrg.isTwoAuthAtOrgLevel(org)
        if(isTwoAuthEnabledAtMPSLevel){
          log.debug(s"Two fact auth is enabled at MPS level : $mfr")
          val role = models.Utils.getDBStringVal(row, "role_name")
          val twoAuthList = models.vRole.twoAuthList(mfr, prod, sch, role)
          if(twoAuthList.size > 0 && twoAuthList.contains("phone")){
            val phone = models.Utils.getDBStringVal(row, "phone")
            val twoAuthTarget = if (phone.equals(CVDefaultStr)) {
              List(TwoAuthDevices(email))
            } else {
              List(TwoAuthDevices(email, Some(phone)))
            }
            (true, twoAuthTarget)
          }
          else {
            val twoAuthTarget = List(TwoAuthDevices(email))
            (true, twoAuthTarget)
          }
        }
        else {
          log.debug(s"Two fact auth is disabled at MPS level : $mfr")
          (false, List())
        }
      } else {
        log.debug(s"There is no such user with email id : $username")
        (false, List())
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to fetch user with email id : $email from $CFNUser table, ex: $ex")
        (false, List())
      }
    }
  }

  def readUserOTP(mfr: String, prod: String, sch: String, email: String): (Option[String], Long) = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val rows = vertica.user_by_mps.selectRow(mps, email)
      if (rows.size > 0) {
        val row = rows.head
        val sess_id = models.Utils.getDBStringVal(row, "last_sess_id")
        val otp_time = models.Utils.getDBDateVal(row, "otp_generation_time", CVDefaultDate).getTime()
        val otp = models.Utils.getDBStringVal(row, "otp", "")
        log.debug(s"Fetching otp : [$otp] from $CFNUserByMps table for user with email id : ${email.toLowerCase()}")
        (Some(otp), otp_time)
      }
      else (None, 0L)
    } catch {
      case ex: Exception => {
        log.error(s"Failed to fetch user otp with email id : $email from $CFNUserByMps table, ex: $ex")
        (None, 0L)
      }
    }
  }

  def generateOTPSendUser(mfr: String, prod: String, sch: String, user: NewUser, twoAuthTargetList: List[TwoAuthDevices]): Try[String] = {
    try{
      val otp = models.Utils.generateRandomNumber()
      val res = writeUserOTP(mfr, prod, sch, user.email, otp, user.first_name, user.last_name)
      res match {
        case Some(p) => {
          models.Utils.vSendOTPonEmail(user, otp)
          val devices = twoAuthTargetList.head
          devices.phone match {
            case Some(n) =>
              log.debug(s"Sending an OTP to user's email {${user.email.toLowerCase()}} and phone {${user.phone}} : $otp")
              models.Utils.vSendOTPonPhone(user, otp)
            case None => log.debug(s"Sending an OTP to user's email {${user.email.toLowerCase()}} : $otp")
          }
          Success("SUCCESS")
        }
        case None => throw new RuntimeException("ERROR")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to generate otp for user with email id : $email, ex: $ex")
        throw new RuntimeException("ERROR")
      }
    }
  }

  def writeUserOTP(mfr: String, prod: String, sch: String, email: String, otp: String, first_name: String, last_name: String): Option[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val otp_ts = new Timestamp(ts)
      vertica.user_by_mps.upsertOTPTime(mps, otp, otp_ts, email.toLowerCase(), first_name, last_name)
      } catch {
      case ex: Exception => {
        log.error(s"Failed to fetch user otp with email id : $email from $CFNUserByMps table, ex: $ex")
        None
      }
    }
  }

  def verifyOTP(email: String, otp: String): Try[String] = {
    try{
      val user = byEmail(email).get
      val mps = user.mps_def.split("/").toList
      if(mps.size == 3){
        val (generatedOTP, otpCreatedTime) = readUserOTP(mps(0), mps(1), mps(2), email)
        val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
        if(currentTs - otpCreatedTime > TfaOTPExpiry * 1000){
          throw new Exception (s"EXPIRED")
        }
        else {
          if(generatedOTP.get.equals(otp)) Success("VALID") else throw new RuntimeException(s"INVALID")
        }
      }
      else throw new RuntimeException(s"INVALID")
    } catch {
      case ex: Exception => {
        log.error(s"Failed to verify user otp with email id : $email, ex: $ex")
        Failure(ex)
      }
    }
  }

  def updateLastLoginOTP(email: String, remoteAddress: String): Option[String] = {
    try {
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      vertica.user.updateLastLoginOtp(email, ts, remoteAddress)
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update last_login_otp and remote_address in User table for user with email id : $email, ex: $ex")
        Some("FAILURE")
      }
    }
  }

  def deleteRefreshCacheForUsers(userEmails: List[String], reqSessionOpt: Option[Cookie]) = {
    val usersRows = vertica.user.selectGroupUsersInfo(None, None, Some(userEmails))
    userEmails.foreach(userid => {
      var userGroupMpsInfoAcc = Map[String, UserGroupMpsInfo]()
      usersRows.foreach(user => {
        val email = models.Utils.getDBStringVal(user, vertica.user.Col_email)
        val old_group = models.Utils.getDBStringVal(user, vertica.user.Col_end_customer, "")
        val exs_mps = models.Utils.getDBStringVal(user, vertica.end_customer.Col_mps, "")
        val mps_def = models.Utils.getDBStringVal(user, vertica.user.Col_mps_def, "")
        val grpMps = if (exs_mps.equals("")) mps_def else exs_mps
        val assingnedGroup = old_group
        if (!userGroupMpsInfoAcc.contains(email)) {
          userGroupMpsInfoAcc = userGroupMpsInfoAcc ++ Map(email -> UserGroupMpsInfo(email, old_group, assingnedGroup, grpMps))
        }
      })
      if (userGroupMpsInfoAcc.contains(userid)) {
        val userInfo = userGroupMpsInfoAcc(userid)
        val mpsList = if (userInfo.mps.isEmpty) List() else userInfo.mps.split("/").toList
        val (m, p, s) = if (mpsList.size > 0) (mpsList(0), mpsList(1), mpsList(2)) else ("", "", "")
//         if (userInfo.new_group.equals("")) {
        val userMpsRows = vertica.user.getUserMpsList(userid.toLowerCase())
        val userMpsList =for (row <- userMpsRows) yield models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps, "")
//        } else List(userInfo.mps)
        userMpsList.foreach({ userMps =>
          if (!userMps.equals("")) {
            log.debug(s"User group name is empty so calling for role mps : $userMps and email : ${userid}")
            reqSessionOpt match {
              case Some(x) => models.RulesAlerts.refreshAECache(m, p, s, userMps, Some(List(userid.toLowerCase())), None, reqSessionOpt)
              case _ => log.debug(s"Cookie is empty so not calling refresh AE cache API")
            }
          }
        })
      }
    })
  }

  def getTableauUsername(version: String, mfr: String, prod: String, sch: String, email: String): Try[String] = {
    try{
      val mps = s"$mfr/$prod/$sch"
      val userOpt = byEmail(email)
      userOpt match{
        case Some(user) => {
          val userMfrRows = vertica.user.selectUserMfrName(email)
          val userMfrName = if (userMfrRows.size > 0) models.Utils.getDBStringVal(userMfrRows.head, vertica.org.Col_name, "") else ""
          val roleDetails = models.vRole.roleDetails(user.role).get
          val features = roleDetails.features
          log.debug(s"userMfrName: $userMfrName, userOrg: ${user.org}")
          if (user.org.equalsIgnoreCase(GBName)) {
            Success(GBName)
          } else if(user.org.equals("") || userMfrName.equals("")){
            Success(TableauGenericUsername)
          } else {
            val isWorkbench = if(features.contains(mps)) features(mps).split(",").toList.contains(FeatWorkBench) else false
            val isViewer = if(features.contains(mps)) features(mps).split(",").toList.contains(FeatViewer) else false
            log.debug(s"isWorkbench: $isWorkbench , isViewer: $isViewer")
            if (isWorkbench == true || isViewer == true) {
              Success(email.toLowerCase())
            } else {
              Success(TableauGenericUsername)
            }
          }
        }
        case _ => throw new RuntimeException(s"UNAVAILABLE")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to fetch tableau username : $email, ex: $ex")
        Failure(ex)
      }
    }
  }
}
