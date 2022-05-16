package models

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

import scala.util.{Failure, Success, Try}
import controllers.Secured
import scala.collection.immutable.{ListMap, Map}
import dao.vertica._

case class User(email: String, first_name: String, last_name:String, department:String, city:String, state:String, country:String, sso:Boolean, wb_user_name:String,
    report_usage:Boolean, phone: String, org: String, role: String, realm_def: String, url_def: String, mps_def: String, is_prospect: Boolean, dashboard_admin: Boolean, is_external: Boolean, end_customer:Option[String], active: Boolean, show_info: Boolean)
case class UserWithPasswd(u: User)

object User {
  val BCryptLogRounds = 10
                                            
  val log = Logger("Model_User")
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

      val defAdminAccount = UserWithPasswd(User(DefAdminEmail, DefAdminFName, DefAdminLName, "", "", "", "", false, "", false, "", DefAdminOrg, DefAdminRole, "", "", "", false, true, false,Option(""),true, true))
      val defGBAccount = Org(GBName, GBName,0,0, OrgTypeGB,"","","","","","","")
      Org.createMfr(defGBAccount )
      create(defAdminAccount)
      val qry = s"INSERT INTO $KsUMS.$CFNRole(name, realm) VALUES ('$URAdmin', ['$RealmProd', '$RealmPoc', '$RealmStudioSpl', '$RealmStudioApp']);"
      DS.cqlExecute(qry)
    }
  }
                      
  /** Returns the user with the given email address
   * 
   */
  def byEmail(email: String): Option[User] = {
    try {
      val username = email.toLowerCase
      val ps = DS.createPreparedStatement(s"SELECT email, first_name, last_name, department, city, state, country, sso, wb_user_name, report_usage, phone, org, role, realm_def, url_def, mps_def, type, is_prospect, dashboard_admin,is_external,end_customer,active, show_info FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (!rows.isEmpty()) {
        val row = rows(0)
        Some(User(username, models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr), models.Utils.getStringVal(row, "department", CVDefaultStr),  
              models.Utils.getStringVal(row, "city", CVDefaultStr), models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool), 
              models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool), models.Utils.getStringVal(row, "phone", CVDefaultStr),
              models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), models.Utils.getStringVal(row, "url_def", CVDefaultStr),
              models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "is_prospect", CVDefaultBool), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool),models.Utils.getBooleanVal(row, "is_external", CVDefaultBool),Option(models.Utils.getStringVal(row, "end_customer", CVDefaultStr)), models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getBooleanVal(row, "show_info", CVDefaultBool)))
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
      val username = email.toLowerCase;
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (!rows.isEmpty()) {
        val row = rows(0)
        Some(UserInfo(username, row.getBool("active"), row.getList("campaigns", classOf[String]).toList, row.getString("first_name"), row.getBool("is_external"), row.getBool("is_prospect"),
            row.getString("mps_def"), row.getString("org"), row.getString("realm_def"), row.getString("role"), row.getBool("sso"), row.getString("type"),
            row.getString("url_def"), row.getBool("validated"), row.getString("wb_user_name"),Option(row.getString("end_customer"))))
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
      val ps = DS.createPreparedStatement(s"SELECT count(*) FROM $KsUMS.$CFNUser WHERE email=? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val count = models.Utils.getLongVal(rows(0), "count", CVDefaultLong)
      count == 0      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on email exists check, email: $email, ex: " + ex)
        false
      }
    }
  }

  /* def notActiveSSO(email: String): (Boolean, Boolean) = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT active, sso FROM $KsUMS.$CFNUser WHERE email=? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val active = models.Utils.getBooleanVal(rows(0), "active", CVDefaultBool)
      val sso = models.Utils.getBooleanVal(rows(0), "sso", CVDefaultBool)
      (sso,active)
      //if(sso && active == (true || false)) 0 else 1
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on email exists check for SSO user email: $email, ex: " + ex)
        (false,false)
      }
    }
  } */

  def notActiveSSO(email: String): (String) = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT active FROM $KsUMS.$CFNUser WHERE email=? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList

      val active = models.Utils.getBooleanVal(rows(0), "active", CVDefaultBool)
      val status = if(rows.size > 0){ 
			if(rows.head.isNull("active")) "invited" else if(active == true) "active" else "inactive"
		   } else ""
      
      status
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
      val ps = DS.createPreparedStatement(s"SELECT role FROM $KsUMS.$CFNUser WHERE email=? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val role = models.Utils.getStringVal(rows(0), "role", CVDefaultStr)
      role      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on email exists check, email: $email, ex: " + ex)
        ""
      }
    }
  }
  
  
  /** Returns user belonging to the given org
   * 
   */
  def byOrg(orgid: String): List[User] = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
      val bs = new BoundStatement(ps).bind(orgid)
      val rowUser = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val emailList = (for {
        row <- rowUser 
        } yield {
          models.Utils.getStringVal(row, "email", CVDefaultStr)
      }) toList
      val ps_t = DS.createPreparedStatement(s"SELECT email, first_name, last_name, department, city, state, country, sso, wb_user_name, report_usage, phone, org, role, realm_def, url_def, mps_def, type, is_prospect, dashboard_admin, active, show_info FROM $KsUMS.$CFNUser WHERE email IN ? ;")
      val bs_t = new BoundStatement(ps_t).bind(emailList.asJava)
      val rows = DS.cqlExecuteBoundStmnt(bs_t).asScala.toList
      val totalRows = rows.size()
      (for {
        row <- rows
      } yield {
        User(models.Utils.getStringVal(row, "email", CVDefaultStr), models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr), models.Utils.getStringVal(row, "department", CVDefaultStr),  
              models.Utils.getStringVal(row, "city", CVDefaultStr), models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool), 
              models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool), models.Utils.getStringVal(row, "phone", CVDefaultStr),
              models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), models.Utils.getStringVal(row, "url_def", CVDefaultStr),
              models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "is_prospect", CVDefaultBool), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool),models.Utils.getBooleanVal(row, "is_external", CVDefaultBool), Option(models.Utils.getStringVal(row, "end_customer", CVDefaultStr)),models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getBooleanVal(row, "show_info", CVDefaultBool))
      }) toList    
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup by org: $orgid, ex: " + ex)
        List()
      }
    }
  }
  
  /** Returns all users belonging to a user's organization and all of its customers
   *  get all customers, for each customer get users
   */
  def allManagedBy(userid: String, userOrg: String): IndexedSeq[User] = {
    val orgs = if (userOrg == GBName) Org.all else  Vector(userOrg) 
    try {
      val xs:IndexedSeq[User] = for {
        orgName <- orgs
        ps_uo = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
        bs_uo = new BoundStatement(ps_uo).bind(orgName)
        emailRows = DS.cqlExecuteBoundStmnt(bs_uo).asScala.toList
        emailRow <- emailRows
        userEmail = models.Utils.getStringVal(emailRow, "email", CVDefaultStr)
        ps_u = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
        bs_u = new BoundStatement(ps_u).bind(userEmail)
        rows = DS.cqlExecuteBoundStmnt(bs_u).asScala.toList
        totalRows = rows.size()
        row <- rows
      } yield {        
            User(models.Utils.getStringVal(row, "email", CVDefaultStr), models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr), models.Utils.getStringVal(row, "department", CVDefaultStr),  
              models.Utils.getStringVal(row, "city", CVDefaultStr), models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool), 
              models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool), models.Utils.getStringVal(row, "phone", CVDefaultStr),
              models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), models.Utils.getStringVal(row, "url_def", CVDefaultStr),
              models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "is_prospect", CVDefaultBool), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool), models.Utils.getBooleanVal(row, "is_external", CVDefaultBool),Option(models.Utils.getStringVal(row, "end_customer", CVDefaultStr)),models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getBooleanVal(row, "show_info", CVDefaultBool))
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
  
  def listByMfr(userid: String, userOrg: String): List[User] = {
    val orgs = if (userOrg == GBName) Org.all else  Vector(userOrg) 
    try {
      val xs:List[User] = for {
        orgName <- orgs.toList
        ps_uo = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
        bs_uo = new BoundStatement(ps_uo).bind(orgName)
        emailRows = DS.cqlExecuteBoundStmnt(bs_uo).asScala.toList
        emailRow <- emailRows
        userEmail = models.Utils.getStringVal(emailRow, "email", CVDefaultStr)
        ps_u = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
        bs_u = new BoundStatement(ps_u).bind(userEmail)
        rows = DS.cqlExecuteBoundStmnt(bs_u).asScala.toList
        totalRows = rows.size()
        row <- rows
      } yield {        
            User(models.Utils.getStringVal(row, "email", CVDefaultStr), models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr), models.Utils.getStringVal(row, "department", CVDefaultStr),  
              models.Utils.getStringVal(row, "city", CVDefaultStr), models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool), 
              models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool), models.Utils.getStringVal(row, "phone", CVDefaultStr),
              models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), models.Utils.getStringVal(row, "url_def", CVDefaultStr),
              models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "is_prospect", CVDefaultBool), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool), models.Utils.getBooleanVal(row, "is_external", CVDefaultBool), Option(models.Utils.getStringVal(row, "end_customer", CVDefaultStr)), models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getBooleanVal(row, "show_info", CVDefaultBool))
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
    val orgs = if (userOrg == GBName) Org.all else Vector(userOrg)
    try {
      val xs: IndexedSeq[UserList] = for {
        orgName <- orgs
        ps_uo = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
        bs_uo = new BoundStatement(ps_uo).bind(orgName)
        emailRows = DS.cqlExecuteBoundStmnt(bs_uo).asScala.toList
        emailRow <- emailRows
        userEmail = models.Utils.getStringVal(emailRow, "email", CVDefaultStr)
        ps_u = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
        bs_u = new BoundStatement(ps_u).bind(userEmail)
        rows = DS.cqlExecuteBoundStmnt(bs_u).asScala.toList
        totalRows = rows.size()
        row <- rows
      } yield {
        UserList(models.Utils.getStringVal(row, "email", CVDefaultStr), models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr),
          models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool),
          models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), models.Utils.getStringVal(row, "url_def", CVDefaultStr),
          models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool), models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getStringVal(row, "token_id", CVDefaultStr),
          models.Utils.getStringVal(row, "phone", CVDefaultStr), models.Utils.getStringVal(row, "city", CVDefaultStr),
          models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr),models.Utils.getStringVal(row, "department", CVDefaultStr),models.Utils.getDateVal(row, "created_on", CVDefaultDate).toString(),models.Utils.getDateVal(row, "modified_on", CVDefaultDate).toString())
          
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
  
   def usersForOrg(userid: String, userOrg: String, mfr:String, sso:Boolean): Iterable[UserListDetails] = {
    val orgs = if (userOrg == GBName) Org.all else Vector(userOrg)
    
    if(orgs.size < 1) {
      throw new Exception("No organization found to select the user information from the Database.")
    }
    
    log.debug(s"Selecting the emails for the organization -- ${orgs.head.toString}")
    
    try {
      val emailWithLastLogin: Map[String, Date] = DS.cqlExecute(s"select * from $KsUMS.$CFNUserByMps;").asScala.toList
        .foldLeft[Map[String, java.util.Date]](Map.empty[String, java.util.Date])((emailDateMap, user) => {
          val ciEmail = models.Utils.getStringVal(user, "email", CVDefaultStr).toString()
          val ciTime = models.Utils.getDateVal(user, "last_login", CVDefaultDate)
          val ciEpochTime = new DateTime(ciTime, DateTimeZone.UTC).getMillis()
          if(emailDateMap.contains(ciEmail)){
            val oldTime = emailDateMap(ciEmail)
            val oldEpochTime = new DateTime(oldTime, DateTimeZone.UTC).getMillis()
            if(ciEpochTime < oldEpochTime){
              emailDateMap + (models.Utils.getStringVal(user, "email", CVDefaultStr).toString -> oldTime)
            }
            else emailDateMap + (models.Utils.getStringVal(user, "email", CVDefaultStr).toString ->  ciTime)
          }
          else emailDateMap + (models.Utils.getStringVal(user, "email", CVDefaultStr).toString ->  ciTime)
        })
        
      val emailWithOrgList: Iterable[String] = orgs.flatMap{ organizationName => val emailWithOrgPrepStmt = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
        val emailWithOrgBoundStmt = new BoundStatement(emailWithOrgPrepStmt).bind(organizationName)
        log.debug(s"Running Query for organization Name ${organizationName} - ${emailWithOrgBoundStmt.preparedStatement().getQueryString()}")
        DS.cqlExecuteBoundStmnt(emailWithOrgBoundStmt).asScala.map(emailWithOrg => (models.Utils.getStringVal(emailWithOrg, "email", CVDefaultStr)))
      }
      
      log.debug(s"Users emails selected from the Cassandra -- ${emailWithOrgList.toList}")
         
      val userDetails: Iterable[UserListDetails] = emailWithOrgList.flatMap( email => {
        val lastLogin = emailWithLastLogin.get(email).getOrElse("").toString
        
        log.debug(s"The last login for the email - $email is $lastLogin")
        
        val ps_u = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
        val bs_u = new BoundStatement(ps_u).bind(email)
        val userDetails = DS.cqlExecuteBoundStmnt(bs_u).asScala.toList
        //val end_customer_list = DS.cqlExecute(s"SELECT * FROM $KsUMS.$CFNEndCustomer;").asScala.toList
        if(userDetails.size == 1) {
          val row = userDetails.get(0)
	        val ts_co = models.Utils.getDateVal(row, "created_on", null)
	        val ts_mo = models.Utils.getDateVal(row, "modified_on", null)
	        val ts_ll = emailWithLastLogin.get(email).getOrElse(null)
	        val is_external = row.getBool("is_external")
	  
      	  /* val end_customer:List[String] = if(is_external){     	       
              
              val end_customer_user_detail = end_customer_list.filter{ x => x.getString("mfr").contains(mfr) && x.getString("email").contains(email) && x.getBool("dashboard_enabled") == true}.head  
      	      val end_customer_name = end_customer_user_detail.getList("end_customer_name",classOf[String])
      	       end_customer_name.toList
      	      
      	  }else{
      	    List()
      	  } */      	
	  
      	  val created_on = if(ts_co != null) models.Utils.dateFormat.print(new DateTime(ts_co, DateTimeZone.UTC).getMillis()) else null
      	  val modified_on = if(ts_mo != null) models.Utils.dateFormat.print(new DateTime(ts_mo, DateTimeZone.UTC).getMillis()) else null 
      	  val last_login = if(ts_ll != null) models.Utils.dateFormat.print(new DateTime(ts_ll, DateTimeZone.UTC).getMillis()) else null
          val user_state = if(row.isNull("active")){
            UserInvited
          }
          else{
            val st = models.Utils.getBooleanVal(row, "active", CVDefaultBool)
            if(st) UserActive else UserInactive
          }

          List(UserListDetails(models.Utils.getStringVal(row, "email", CVDefaultStr), models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getStringVal(row, "first_name", CVDefaultStr), models.Utils.getStringVal(row, "last_name", CVDefaultStr),
          models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool),
          models.Utils.getStringVal(row, "org", CVDefaultStr), models.Utils.getStringVal(row, "role", CVDefaultStr), models.Utils.getStringVal(row, "realm_def", CVDefaultStr), Option(models.Utils.getStringVal(row, "end_customer", CVDefaultStr)),
          models.Utils.getStringVal(row, "mps_def", CVDefaultStr), models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool),
          models.Utils.getStringVal(row, "phone", CVDefaultStr), models.Utils.getStringVal(row, "city", CVDefaultStr),
	        models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr),models.Utils.getStringVal(row, "department", CVDefaultStr),created_on,modified_on,last_login,models.Utils.getBooleanVal(row, "is_external", CVDefaultBool), user_state))
        } else {
          List()
        }
      })
      
      log.debug(s"All user $userDetails")
      userDetails.filter(x => x.sso.equals(sso))
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all users for user: $userid, org: $userOrg, ex: " + ex)
        IndexedSeq()
      }
    }
  }
   
  def ruleCreatorUsersForOrg(userOrg: String,prod: String,sch: String): IndexedSeq[RuleCreatorList] = {
    val orgs = if (userOrg == GBName) Org.all else Vector(userOrg)
    try {
      val mps = userOrg + ":" + prod + ":" + sch
      val xs: IndexedSeq[RuleCreatorList] = for {
        orgName <- orgs
        ps_uo = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
        bs_uo = new BoundStatement(ps_uo).bind(orgName)
        emailRows = DS.cqlExecuteBoundStmnt(bs_uo).asScala.toList
        emailRow <- emailRows
        userEmail = models.Utils.getStringVal(emailRow, "email", CVDefaultStr)
        ps_u = DS.createPreparedStatement(s"SELECT email,role,first_name,last_name FROM $KsUMS.$CFNUser WHERE email=?;")
        bs_u = new BoundStatement(ps_u).bind(userEmail)
        roleRow = DS.cqlExecuteBoundStmnt(bs_u).asScala.toList.head
        userRole = roleRow.getString("role")
        psr_u = DS.createPreparedStatement(s"SELECT name, permissions FROM $KsUMS.$CFNRole WHERE name=?;")
        bsr_u = new BoundStatement(psr_u).bind(userRole)
        emptyMap = Map[String, String]()
        rolePermissions = DS.cqlExecuteBoundStmnt(bsr_u).asScala.toList
        perm = if(rolePermissions.size > 0) rolePermissions.head.getMap("permissions", classOf[String], classOf[String]).asScala else emptyMap
        if(perm.contains(mps) && perm(mps).contains("rule_creator"))
      } yield {
         RuleCreatorList(userEmail)
      } 
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
      val ps = DS.createPreparedStatement(s"SELECT passwd_hash FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (!rows.isEmpty()) {             
        val encPasswd = models.Utils.getStringVal(rows(0), "passwd_hash", CVDefaultStr)
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
  def create(user: UserWithPasswd): Option[String] = {
    val org = user.u.org.toLowerCase
    val email = user.u.email.toLowerCase    
    val mps_def = user.u.mps_def.toLowerCase().replaceAll(":", "_")
    val dateTime = DateTime.now
    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()

    try {
      val tokenId = BCrypt.hashpw(email + ts, BCrypt.gensalt(BCryptLogRounds))
      val typ = if(org.equals(GBName)) GBType else MFRType
      val realm_def = if(email.equals(AdminEmail)) "" else Role.getRealmUrl(user.u.realm_def)._2
      val userRole = if(user.u.role.toLowerCase.equals("admin") || user.u.role.toLowerCase.equals("glassbeam_super") || user.u.role.toLowerCase.contains("glassbeam"))
        user.u.role.toLowerCase
        else if(user.u.role.toLowerCase.contains("admin"))
          mps_def + "_admin"
          else if(user.u.role.toLowerCase().contains("power"))
            mps_def + "_power"
            else 
              mps_def + "_support"
      val passwd_hash = if(email.equals(AdminEmail)) BCrypt.hashpw(AdminPasswd, BCrypt.gensalt(BCryptLogRounds)) else ""
      //val passwd_hash = if(email.equals(AdminEmail)) Utils.encryptPasswd(AdminPasswd) else ""
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUser (email, active, first_name ,last_name, department, city, state, country, sso,wb_user_name, report_usage, created_on, phone, org, role, token_id, passwd_hash, realm_def, url_def, mps_def, type, is_prospect, validated, dashboard_admin, expire_in_days, show_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs_u = new BoundStatement(ps_u).bind(email, Boolean.box(true), user.u.first_name, user.u.last_name, user.u.department,user.u.city, user.u.state, user.u.country, Boolean.box(user.u.sso), user.u.wb_user_name,Boolean.box( user.u.report_usage), new Date(ts), user.u.phone, org, userRole, tokenId, passwd_hash, realm_def, user.u.url_def, user.u.mps_def, typ, Boolean.box(user.u.is_prospect), Boolean.box(true), Boolean.box(user.u.dashboard_admin), Int.box(0), Boolean.box(true))
      DS.cqlExecuteBoundStmnt(bs_u)
      val ps_uo = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserByOrg (email, name, org) VALUES (?, ?, ?);")
      val bs_uo = new BoundStatement(ps_uo).bind(email, user.u.first_name, org)
      DS.cqlExecuteBoundStmnt(bs_uo)
      if(! email.equals(AdminEmail)) {
        models.Utils.sendEmail(email, tokenId, true, user.u.first_name, user.u.last_name)
      }
      None
    } catch {
        case ex: Exception => {
          log.error(s"Failed to create an entry in the $CFNUser table for user with email: $email, ex: $ex")
          Some("Failed to create a new user account.")           
        }
    }
  }
  
  def createUser(user: UserWithPasswd, version: String = "v1"): Option[String] = {
    val org = user.u.org.toLowerCase
    val email = user.u.email.toLowerCase    
    var userRole = user.u.role.toLowerCase
    val mps_def = user.u.mps_def.toLowerCase().replaceAll(":", "_")
    val mps = user.u.mps_def.split(":")    
    val dateTime = DateTime.now
    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
    val sso = user.u.sso 
    val rows = try {
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='${mps(0)}' AND prod='${mps(1)}' AND sch='${mps(2)}';")
      result.asScala.toList
      }catch{
        
        case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
        }
      }  
      val row = rows(0)
      val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)             
      
    try {
      val token = if(!sso) BCrypt.hashpw(email + ts, BCrypt.gensalt(BCryptLogRounds)) else ""
      val tokenId = token.replaceAll("/","")
      val typ = if(org.equals(GBName)) GBType else MFRType
      val realm_def = if(email.equals(AdminEmail)) "" else Role.getRealmUrl(realm)._2
     //val passwd_hash = if(email.equals(AdminEmail)) BCrypt.hashpw(AdminPasswd, BCrypt.gensalt(BCryptLogRounds)) else ""
      val passwd_hash = if(email.equals(AdminEmail)) Utils.encryptPasswd(AdminPasswd) else ""
      
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUser (email, active, first_name ,last_name, department, city, state, country, sso,wb_user_name, report_usage, created_on, phone, org, role, token_id, passwd_hash, realm_def, url_def, mps_def, type, is_prospect, validated, dashboard_admin, expire_in_days, show_info, is_external, end_customer, failed_login, last_failed_login_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs_u = if(version.equals("v1")) {
        new BoundStatement(ps_u).bind(email, Boolean.box(true), user.u.first_name, user.u.last_name, user.u.department, user.u.city, user.u.state, user.u.country, Boolean.box(user.u.sso), user.u.wb_user_name, Boolean.box(user.u.report_usage), new Date(ts), user.u.phone, org, userRole, tokenId, passwd_hash, realm_def, user.u.url_def, user.u.mps_def, typ, Boolean.box(user.u.is_prospect), Boolean.box(true), Boolean.box(user.u.dashboard_admin), Int.box(0), Boolean.box(true), Boolean.box(user.u.is_external), user.u.end_customer.getOrElse(""), Int.box(0), new Date(ts))
      } else {
        new BoundStatement(ps_u).bind(email, null, user.u.first_name, user.u.last_name, user.u.department, user.u.city, user.u.state, user.u.country, Boolean.box(user.u.sso), user.u.wb_user_name, Boolean.box(user.u.report_usage), new Date(ts), user.u.phone, org, userRole, tokenId, passwd_hash, realm_def, user.u.url_def, user.u.mps_def, typ, Boolean.box(user.u.is_prospect), Boolean.box(true), Boolean.box(user.u.dashboard_admin), Int.box(0), Boolean.box(true), Boolean.box(user.u.is_external), user.u.end_customer.getOrElse(""), Int.box(0), new Date(ts))
      }
      DS.cqlExecuteBoundStmnt(bs_u)
      val ps_uo = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserByOrg (email, name, org) VALUES (?, ?, ?);")
      val bs_uo = new BoundStatement(ps_uo).bind(email, user.u.first_name, org)
      DS.cqlExecuteBoundStmnt(bs_uo)
      if(! email.equals(AdminEmail)) {
        models.Utils.sendEmail(email, tokenId, true, user.u.first_name, user.u.last_name)
      }
      None
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
  
  def update(u: UserEdit, usrEmail: String, mfr: String): Option[String] = {
    try {
      val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET first_name = ?, last_name = ?, sso = ?, wb_user_name = ?, report_usage = ?, role = ?, realm_def = ?, url_def = ?, mps_def = ?, is_prospect = ?, dashboard_admin = ?, active = ?, show_info = ? WHERE email = ?; ")
      val bs_u = new BoundStatement(ps_u).bind(u.f_name, u.l_name, Boolean.box(u.sso), u.wb_user_name, Boolean.box(u.report_usage), u.role, u.realm_def, u.url_def, u.mps_def, Boolean.box(u.is_prospect), Boolean.box(u.dashboard_admin), Boolean.box(u.active), Boolean.box(u.show_info), usrEmail.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table for user with email: $usrEmail, ex: $ex")
        Some("Failed to update user account.")
      }
    }
  }
  
  def modify(u: UserModify): Option[String] = {
    try {
      
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET first_name = ?, last_name = ?,report_usage = ?, dashboard_admin = ?, department = ?, city = ?, state = ?, country= ?, role= ?, phone= ?, modified_on= ?, mps_def= ?, is_external= ?, end_customer= ? , wb_user_name = ? WHERE email = ?; ")
      val bs_u = new BoundStatement(ps_u).bind(u.f_name, u.l_name, Boolean.box(u.report_usage), Boolean.box(u.dashboard_admin),u.department,u.city,u.state,u.country,u.role, u.phone, new Date(ts), u.mps_def, Boolean.box(u.is_external),u.end_customer.getOrElse(""), u.wb_user_name, u.email)
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table for user with email: ${u.email}, ex: $ex")
        Some("Failed to update user account.")
      }
    }
  }
  
   def updateUser(u: UserEditCustomer, usrEmail: String, mfr: String): Option[String] = {
    try {
      val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET first_name = ?, last_name = ?, sso = ?, department = ?, city = ?, state = ?, country = ?, phone = ?, wb_user_name = ?, report_usage = ?, role = ?, mps_def = ?, dashboard_admin = ?, is_external = ?, end_customer = ? WHERE email = ?; ")
      val bs_u = new BoundStatement(ps_u).bind(u.f_name, u.l_name, Boolean.box(u.sso),u.department, u.city, u.state, u.country, u.phone, u.wb_user_name, Boolean.box(u.report_usage), u.role, u.mps_def, Boolean.box(u.dashboard_admin),Boolean.box(u.is_external), u.end_customer.getOrElse(""), usrEmail.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table for user with email: $usrEmail, ex: $ex")
        Some("Failed to update user account.")
      }
    }
  }
  
  def updateMulti(u: MultiUserEdit): Option[String] = {
    try {
      val emailList = u.usrEmails.split(",").toList
      for(email <- emailList){
        val ps = DS.createPreparedStatement(s"SELECT wb_user_name, role, realm_def, url_def, mps_def FROM $KsUMS.$CFNUser WHERE email=?;")
        val bs = new BoundStatement(ps).bind(email)
        val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
        if(rows.size > 0){
          val row = rows.head
          val wb_user_name = if(u.wb_user_name.equals("")) row.getString("wb_user_name") else u.wb_user_name
          val role = u.role
          val realm_def = if(u.realm_def.equals("")) row.getString("realm_def") else u.realm_def
          val url_def = if(u.url_def.equals("")) row.getString("url_def") else u.url_def
          val mps_def = if(u.mps_def.equals("")) row.getString("mps_def") else u.mps_def
          val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET wb_user_name = ?, role = ?, realm_def = ?, url_def = ?, mps_def = ? WHERE email = ?; ")
          val bs_u = new BoundStatement(ps_u).bind(wb_user_name, role, realm_def, url_def, mps_def, email.toLowerCase())
          DS.cqlExecuteBoundStmnt(bs_u)
        } 
      }
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table for users with emails: ${u.usrEmails.split(",").toList}, ex: $ex")
        Some("Failed to update user account.")
      }
    }
  }

  /** Deletes a user entry from the database
   */
  def delete(userid: String): Option[String] = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT org FROM $KsUMS.$CFNUser WHERE email = ? ;")
      val bs = new BoundStatement(ps).bind(userid.toLowerCase())
      val orgRows = DS.cqlExecuteBoundStmnt(bs).asScala.toIndexedSeq
      val orgList = (for { 
        orgRow <- orgRows 
        } yield {
          models.Utils.getStringVal(orgRow, "org", CVDefaultStr)
        })
      val allUsers = DS.cqlExecute(s"select * from $KsUMS.$CFNUserByMps;").asScala.toList
      val userMpsList = for { 
        userRow <- allUsers if userRow.getString("email") == userid.toLowerCase()
        } yield {          
          userRow
        }
       
      if (!userMpsList.isEmpty) {
        val userMpsRow = userMpsList.head
        val mfr = userMpsRow.getString("mfr")
        val prod = userMpsRow.getString("prod")
        val sch = userMpsRow.getString("sch")
        val ec = userMpsRow.getString("ec")
        
        val ps_umps = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNUserByMps WHERE mfr=? AND prod=? AND sch=? AND ec=? AND email = ? ;")
        val bs_upms = new BoundStatement(ps_umps).bind(mfr,prod,sch,ec,userid.toLowerCase())
        DS.cqlExecuteBoundStmnt(bs_upms)
        
      }
      val ps_uo = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNUserByOrg WHERE org IN ? AND email = ? ;")
      val bs_uo = new BoundStatement(ps_uo).bind(orgList.asJava, userid.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs_uo)
      val ps_u = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNUser WHERE email = ? ;")
      val bs_u = new BoundStatement(ps_u).bind(userid.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
        case ex: Exception => {
          log.error(s"Failed to delete user: '$userid', ex: $ex")
          Some("Failed to delete user.")           
        }
    }
  }
  
  def disable(userid: String): Option[String] = {
    try {
	  val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set modified_on =?, active = false  WHERE email = '${userid.toLowerCase()}'; ")
      val bs = new BoundStatement(ps).bind(new Date(ts))
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
          log.error(s"Failed to disable user: '$userid', ex: $ex")
          Some("Failed to disable user.")           
        }
    }
  }
  def enable(userid: String): Option[String] = {
    try {
	   val dateTime = DateTime.now
       val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
	   val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set modified_on =?, active = ?, failed_login = ? WHERE email = '${userid.toLowerCase()}'; ")
       val bs = new BoundStatement(ps).bind(new Date(ts), Boolean.box(true), Int.box(0))
       DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
          log.error(s"Failed to enable user: '$userid', ex: $ex")
          Some("Failed to enable user.")
        }
    }
  }


  def enableSSOUser(userid: String): Boolean = {
    try {

       val dateTime = DateTime.now
       val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
       val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set modified_on =?, active = ? WHERE email = '${userid.toLowerCase()}'; ")

       val bs = new BoundStatement(ps).bind(new Date(ts), Boolean.box(true))
       DS.cqlExecuteBoundStmnt(bs)
      true
    } catch {
      case ex: Exception => {
          log.error(s"Failed to enable SSO user: '$userid', ex: $ex")
          false
        }
    }
  }


  /** deletes all users from an org
   */
  def deleteByOrg(org: String): Option[String] = {
    try {
      // First selects all the users for an org and then delete them from user and user_by_org CF
      val ps = DS.createPreparedStatement(s"SELECT email from $KsUMS.$CFNUserByOrg WHERE org = ? ;")
      val bs = new BoundStatement(ps).bind(org)
      val userRows = DS.cqlExecuteBoundStmnt(bs)
      if (!userRows.isEmpty) {
        for (row <- userRows){
           val ps_uo = DS.createPreparedStatement(s"DELETE from $KsUMS.$CFNUserByOrg WHERE org = ? ;")
           val bs_uo = new BoundStatement(ps_uo).bind(org)
           DS.cqlExecuteBoundStmnt(bs_uo)
           val ps_u = DS.createPreparedStatement(s"DELETE from $KsUMS.$CFNUser WHERE email=?;")
           val bs_u = new BoundStatement(ps_u).bind(row.getString("email"))
           DS.cqlExecuteBoundStmnt(bs_u)
        }
        None
      } else {
        None
      }
    } catch {
        case ex: Exception => {
          log.error(s"Failed to delete users from org: '$org', ex: $ex")
          Some("Failed to delete users.")           
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
      val ps = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, module, activity, start_ts, details, solr_qry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs = new BoundStatement(ps).bind(mfr, prod, sch, mfr, Long.box(month), email.toLowerCase(), session_id, app, module, activity, new Date(ts), Set(detail).asJava, solr_qry)
      DS.cqlExecuteBoundStmnt(bs)
      val (qry, index) = switched_feature match {
        case Some(sf) => (s"SELECT mfr, prod, sch, ec, month, email, app, start_ts FROM $KsUMS.$CFNUserActivity WHERE mfr='$mfr' AND prod='$prod' AND sch='$sch' AND ec='$mfr' AND month=$month AND email='${email.toLowerCase()}' AND sess_id='$session_id' AND app='$sf' LIMIT 2;", 0)
        case None => (s"SELECT mfr, prod, sch, ec, month, email, app, start_ts FROM $KsUMS.$CFNUserActivity WHERE mfr='$mfr' AND prod='$prod' AND sch='$sch' AND ec='$mfr' AND month=$month AND email='${email.toLowerCase()}' AND sess_id='$session_id' AND app='$app' LIMIT 2;", 1)
      }
      val rows = DS.cqlExecute(qry).asScala.toList
      if(rows.size > 0){
        val row = rows(index)
        val mfr = row.getString("mfr")
        val prod = row.getString("prod")
        val sch = row.getString("sch")
        val ec = row.getString("ec")
        val month = row.getLong("month")
        val email = row.getString("email")
        val feature = row.getString("app")
        val startTs = row.getTimestamp("start_ts")
        val switchedFeat = if(feature.equals(app)) null else app
        val ps_ustmt = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUserActivity set end_ts=? , switched_feature= ? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND month=? AND email=? AND sess_id=? AND app=? AND start_ts=?;")
        val bs_ustmt = new BoundStatement(ps_ustmt).bind(new Date(ts), switchedFeat, mfr, prod, sch, ec, Long.box(month), email, session_id, feature, startTs)
        DS.cqlExecuteBoundStmnt(bs_ustmt)
      }
      trackUserAccessActivity(mfr, prod, sch, email, session_id, ts)
      None
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
      val ps = DS.createPreparedStatement(s"SELECT created_on, token_id, active FROM $KsUMS.$CFNUser where email = ? ;")
      val bs = new BoundStatement(ps).bind(user_id)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size < 1){
        throw new Exception (s"NoUser") 
      } else {
        val createdTime = models.Utils.getDateVal(rows.head, "created_on", CVDefaultDate).getTime()
        val tokenId = models.Utils.getStringVal(rows.head, "token_id", CVDefaultStr)
        if(currentTime - createdTime > linkExpiry * 1000){
          throw new Exception (s"Expired")
        } else if(tokenId.isEmpty()) {
          throw new Exception (s"PasswordAlreadySet")
        } else if (!tokenId.equals(token_id)) {
           throw new Exception (s"InValidToken")
        } else {
          val active: java.lang.Boolean = true
          val encPasswd = BCrypt.hashpw(passwd, BCrypt.gensalt(BCryptLogRounds))
          val user_state = if(rows(0).isNull("active")){
            UserInvited
          } else{
            val st = models.Utils.getBooleanVal(rows(0), "active", CVDefaultBool)
            if(st) UserActive else UserInactive
          }
          //val encPasswd = Utils.encryptPasswd(passwd)
          val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set created_on =?, token_id = ?, passwd_hash = ?, active = ?, failed_login = ?, last_login_otp = ?, remote_address = ? WHERE email = ?; ")
          val bs = user_state match {
            case UserInvited => new BoundStatement(ps).bind(new Date(currentTime), "", encPasswd, null, Int.box(0), null, null, user_id)
            case _ => new BoundStatement(ps).bind(new Date(currentTime), "", encPasswd, active, Int.box(0), null, null, user_id)
          }
          DS.cqlExecuteBoundStmnt(bs)
          Success(s"Password updated for user: $user_id")
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
      val user_state = getUserState(email)
      if(!user_state._1.get.equals(UserActive)){
        log.error(s"User is not active : $email")
        throw new RuntimeException(s"UserInactive")
      }
      val currentTime = DateTime.now
      val currTs = new DateTime(currentTime, DateTimeZone.UTC).getMillis()
      val token = BCrypt.hashpw(email + currTs, BCrypt.gensalt(BCryptLogRounds))
      val tokenId = token.replaceAll("/","")
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set created_on =?, token_id = ? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(new Date(currTs), tokenId, email.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val user = models.User.byEmail(email.toLowerCase()).get
      models.Utils.sendEmail(email, tokenId, false, user.first_name, user.last_name)
      Success(s"Reset Password link sent successfully..")
    } catch {
      case ex: Exception =>
        log.error(s" Error while sending reset password link to the user $email with exception ex: $ex")
        Failure(ex)
    }
  }
  
  def changePasswd(passwdForm : UserUpdatePasswd) : Try[Any] = {
    try {
      val encPasswd = BCrypt.hashpw(passwdForm.passwd, BCrypt.gensalt(BCryptLogRounds))
      //val encPasswd = Utils.encryptPasswd(passwdForm.passwd)
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set passwd_hash = ?, failed_login = ?, last_login_otp = ?, remote_address = ? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(encPasswd, Int.box(0), null, null, passwdForm.email.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs).asScala.toList
      Success(s"Password changed successfully..")
    } catch {
      case ex: Exception =>
        log.error(s" Error while changing the password for the user ${passwdForm.email} with exception ex: $ex")
        Failure(ex)
    }
  }
  
  def resetPasswd(passwdForm : UserResetPassword) : Try[Any] = {
    
    val encPasswd = BCrypt.hashpw(passwdForm.password, BCrypt.gensalt(BCryptLogRounds))
    //val encPasswd = Utils.encryptPasswd(passwdForm.password)
    try {
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set passwd_hash = ?, failed_login = ?, last_login_otp = ?, remote_address = ? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(encPasswd, Int.box(0), null, null, passwdForm.email.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs).asScala.toList
      Success(s"Password changed successfully..")
    } catch {
      case ex: Exception =>
        log.error(s" Error while changing the password for the user ${passwdForm.email} with exception ex: $ex")
        Failure(ex)
    }
    
   }
  
  
  def updateDefaults(userDefs: UserDefaults, userid: String): Try[Any] = {
    try {
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set realm_def = ?, url_def = ?, mps_def =? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(userDefs.realm_def, userDefs.url_def, userDefs.mps_def, userid.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs)
      Success(s"Defaults Updated successfully..")
    } catch {
      case ex: Exception =>
        log.error(s" Error while updating the defaults for user $userid with exception ex: $ex")
        Failure(ex)
    }
  }
  
  def disableInfo(userid: String): Try[Any] = {
    try {
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set show_info = false WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(userid.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs)
      Success(s"Disabled info successfully..")
    } catch {
      case ex: Exception =>
        log.error(s" Error while disabling info for user $userid with exception ex: $ex")
        Failure(ex)
    }
  }
  def exportLimit(userid: String, limit: Int): Try[Any] = {
    try {
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set events_export_limit = ? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(Int.box(limit),userid)
      DS.cqlExecuteBoundStmnt(bs)
      Success(s"Updated info successfully..")
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

    val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
    try {
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUser (email, active, sso, validated, is_prospect, is_external, report_usage, created_on, org, role, mps_def, url_def, realm_def, type, expire_in_days, show_info, failed_login, last_failed_login_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs_u = new BoundStatement(ps_u).bind(email, Boolean.box(true), Boolean.box(sso),Boolean.box(validated),Boolean.box(is_prospect),Boolean.box(is_external),Boolean.box(report_usage), new Date(ts), org, role, mps_def, url_def, realm_def, typ, Int.box(0), Boolean.box(true), Int.box(0), new Date(ts))
      DS.cqlExecuteBoundStmnt(bs_u)
      val ps_uo = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserByOrg (email, org) VALUES (?, ?);")
      val bs_uo = new BoundStatement(ps_uo).bind(email, org)
      DS.cqlExecuteBoundStmnt(bs_uo)
      true
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

    try {
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUser (email, active, sso, report_usage, created_on, org, role, first_name, last_name, mps_def,url_def, realm_def, type,validated, is_prospect, is_external, expire_in_days, show_info, failed_login, last_failed_login_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs_u = new BoundStatement(ps_u).bind(email_id, Boolean.box(true), Boolean.box(sso),Boolean.box(report_usage), new Date(ts), org, role, first_name, last_name, mps_def, url_def, realm_def, typ, Boolean.box(validated), Boolean.box(is_prospect),Boolean.box(is_external), Int.box(0), Boolean.box(true), Int.box(0), new Date(ts))
      DS.cqlExecuteBoundStmnt(bs_u)
      val ps_uo = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserByOrg (email, org) VALUES (?, ?);")
      val bs_uo = new BoundStatement(ps_uo).bind(email_id, org)
      DS.cqlExecuteBoundStmnt(bs_uo)
      true
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
      val qry = s"SELECT active, last_login_otp, remote_address FROM $KsUMS.$CFNUser WHERE email=?;"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(username)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size > 0){
        val row = rows.head
        val user_state = if(row.isNull("active")){
          UserInvited
        }
        else{
          val st = models.Utils.getBooleanVal(row, "active", CVDefaultBool)
          if(st) UserActive else UserInactive
        }
        val llOTP = models.Utils.getDateVal(row, "last_login_otp", null)
        val rAdrs = models.Utils.getStringVal(row, "remote_address", "")
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
        log.error(s"Failed get data from prospect CF for: $email, ex: $ex")
        (Some(UserInactive), "", "")
      }
    }
  }

  def trackUserLoginActivity(mfr: String, prod: String, sch: String, email: String, session_id: String) = {
    try {
      val user = byEmail(email).get
      val loginTs = DateTime.now()
      val ts = new DateTime(loginTs, DateTimeZone.UTC).getMillis()
      val ps = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUserByMps (mfr, prod, sch, ec, email, first_name, last_name, last_access, last_login, last_sess_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs = new BoundStatement(ps).bind(mfr, prod, sch, mfr, email.toLowerCase(), user.first_name, user.last_name, new Date(ts), new Date(ts), session_id)
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => log.error(s"Error: Exception caused while tracking login activity user for mps: $mfr, $prod, $sch, and user: $email ex: $ex")
      None
    }
    
  }

  def trackUserAccessActivity(mfr: String, prod: String, sch: String, email: String, session_id: String, ts: Long) = {
    try {
      val getUserPs = DS.createPreparedStatement(s"SELECT last_sess_id FROM $KsUMS.$CFNUserByMps where mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
      val getUserBs = new BoundStatement(getUserPs).bind(mfr, prod, sch, mfr, email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(getUserBs).asScala.toList
      if (rows.size > 0) {
        val sess_id = rows(0).getString("last_sess_id")
        if (sess_id.equals(session_id)) {
          val updateAccessPs = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUserByMps set last_access = ? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
          val updateAccessBs = new BoundStatement(updateAccessPs).bind(new Date(ts), mfr, prod, sch, mfr, email.toLowerCase())
          DS.cqlExecuteBoundStmnt(updateAccessBs)
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
      val getUserPs = DS.createPreparedStatement(s"SELECT last_sess_id FROM $KsUMS.$CFNUserByMps where mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
      val getUserBs = new BoundStatement(getUserPs).bind(mfr, prod, sch, mfr, email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(getUserBs).asScala.toList
      if (rows.size > 0) {
        val sess_id = rows(0).getString("last_sess_id")
        if (sess_id.equals(session_id)) {
          val updateLogoutPs = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUserByMps set last_logout = ? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
          val updateLogoutBs = new BoundStatement(updateLogoutPs).bind(new Date(ts), mfr, prod, sch, mfr, email.toLowerCase())
          DS.cqlExecuteBoundStmnt(updateLogoutBs)
        }
      }
      val qry = s"SELECT mfr, prod, sch, ec, month, email, app, start_ts FROM $KsUMS.$CFNUserActivity WHERE mfr='$mfr' AND prod='$prod' AND sch='$sch' AND ec='$mfr' AND month=$month AND email='${email.toLowerCase()}' AND sess_id='$session_id' AND app='$feature' LIMIT 1;"
      val rowsUserActivity = DS.cqlExecute(qry).asScala.toList
      if(rowsUserActivity.size > 0){
        val row = rowsUserActivity(0)
        val startTs = row.getTimestamp("start_ts")
        val ps_ustmt = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUserActivity set end_ts=? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND month=? AND email=? AND sess_id=? AND app=? AND start_ts=?;")
        val bs_ustmt = new BoundStatement(ps_ustmt).bind(new Date(ts), mfr, prod, sch, mfr, Long.box(month), email.toLowerCase(), session_id, feature, startTs)
        DS.cqlExecuteBoundStmnt(bs_ustmt)
      }
    } catch {
      case ex: Exception => log.error(s"Error: Exception caused while tracking logout activity user for mps: $mfr, $prod, $sch, and user: $email ex: $ex")
    }
  }

  def regenerateVerificationEmail(email: String): Option[String] = {
    try {
      val qry = s"SELECT token_id, first_name, last_name FROM $KsUMS.$CFNUser WHERE email=?;"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (rows.size == 1) {
        val row = rows(0)
        val tokenId = row.getString("token_id")
        val f_name = row.getString("first_name")
        val l_name = row.getString("last_name")
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
  
  def ifProspectExits(email: String): Boolean = {
    try {
      val qry = s"SELECT email FROM $KsUMS.$CFNProspect WHERE email=?;"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      (rows.size == 1)
    } catch {
      case ex: Exception => {
        log.error(s"Failed get data from prospect CF for: $email, ex: $ex")
        false           
      }
    }
  }
  
  def verifyProspect(email: String, token_id: String): Option[String] = {
    try {
      val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNProspect where email = ? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size < 1){
        val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser where email = ? LIMIT 1;")
        val bs = new BoundStatement(ps).bind(email.toLowerCase())
        val userRows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
        if(userRows.size < 1) 
          throw new Exception (s"NoUser")
        else 
          throw new Exception (s"UserVerifiedAlready")
      } else {
        val row = rows.head
        val createdTime = models.Utils.getDateVal(row, "created_on", CVDefaultDate).getTime()
        val tokenId = models.Utils.getStringVal(row, "veri_code", CVDefaultStr)
        /*if(currentTs - createdTime > linkExpiry * 1000){
          throw new Exception (s"Expired")
        } else */
        if (!tokenId.equals(token_id)) {
          throw new Exception (s"InValidToken")
        } else {
          val active: java.lang.Boolean = true
          val f_name = models.Utils.getStringVal(row, "first_name", CVDefaultStr)
          val l_name = models.Utils.getStringVal(row, "last_name", CVDefaultStr)
          val passwd_hash = models.Utils.getStringVal(row, "passwd_hash", CVDefaultStr)
          val org = models.Utils.getStringVal(row, "org", CVDefaultStr)
          val phone = models.Utils.getStringVal(row, "phone", CVDefaultStr)
          val city = models.Utils.getStringVal(row, "city", CVDefaultStr)
          val state = models.Utils.getStringVal(row, "state", CVDefaultStr)
          val country = models.Utils.getStringVal(row, "country", CVDefaultStr)
          val created_on = models.Utils.getDateVal(row, "created_on", CVDefaultDate)
          val role = models.Utils.getStringVal(row, "role", CVDefaultStr)
          val realm_def = models.Utils.getStringVal(row, "realm_def", CVDefaultStr)
          val url_def = models.Utils.getStringVal(row, "url_def", CVDefaultStr)
          val mps_def = models.Utils.getStringVal(row, "mps_def", CVDefaultStr)
          val typ = "Prospect"
          val report_usage: java.lang.Boolean = true
          val is_external : java.lang.Boolean = false
          val sso: java.lang.Boolean = false
          val def_passwd: java.lang.Boolean = false
          val is_prospect: java.lang.Boolean = true
          val validated: java.lang.Boolean = true
          val dashboard_admin: java.lang.Boolean = false
          val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
          val qry = s"INSERT INTO $KsUMS.$CFNUser" +
                   s" (email, active, first_name, last_name, passwd_hash, org, phone, city, state, country, created_on, token_id, role, realm_def, " +
                   s" url_def, mps_def, type, report_usage, is_external, sso, def_passwd, is_prospect, validated, dashboard_admin, expire_in_days, show_info, failed_login, last_failed_login_time)" +
                   s" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
          val ps = DS.createPreparedStatement(qry)
          val bs = new BoundStatement(ps).bind(email.toLowerCase(), Boolean.box(active), f_name, l_name, passwd_hash, org, phone, city, state, country, created_on, token_id,
              role, realm_def, url_def, mps_def, typ, Boolean.box(report_usage), Boolean.box(is_external), Boolean.box(sso), Boolean.box(def_passwd),
              Boolean.box(is_prospect), Boolean.box(validated), Boolean.box(dashboard_admin), Int.box(Auth.ExpirationInDays), Boolean.box(true), Int.box(0), new Date(ts))
          DS.cqlExecuteBoundStmnt(bs) 
          val orgStudio = Org(org, org,0,0,OrgTypeStudio,"","","","","","","")
          Org.createMfr(orgStudio)
          DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNProspect WHERE email='${email.toLowerCase()}';")
          models.Utils.sendWelcomeEmail(email.toLowerCase(), f_name, l_name, 0, "", true)
          None
        } 
       }
    } catch {
      case ex: Exception => {
          log.error(s"Failed to verify the user: $email, ex: $ex")
          Some(s"${ex.getMessage()}")           
      }
    }
  }
  
  def updateProspectsRole(email: String): Option[String] = {
    try {
      DS.cqlExecute(s"UPDATE $KsUMS.$CFNUser SET role='demo_and_studio' WHERE email='${email.toLowerCase()}'")
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to verify the user: $email, ex: $ex")
        Some(s"${ex.getMessage()}")
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
    val qry = s"SELECT created_on, expire_in_days, is_prospect, email, first_name, last_name, active FROM $KsUMS.$CFNUser;"
    val rows = DS.cqlExecute(qry).asScala.toList
    for (row <- rows) {
      val is_prospect = row.getBool("is_prospect")
      val is_active = row.getBool("active")
      if (is_prospect && is_active) {
        val created_on = new DateTime(row.getTimestamp("created_on"), DateTimeZone.UTC)
        val expiryDays = row.getInt("expire_in_days")
        val email = row.getString("email")
        val f_name = row.getString("first_name")
        val l_name = row.getString("last_name")
        val timeDiffInDays = Days.daysBetween(created_on, currentTs).getDays()
        val emailContent = getEmailContent(timeDiffInDays)
        if(timeDiffInDays >= expiryDays ) {
          disable(email)
          models.Utils.sendWelcomeEmail(email, f_name, l_name, timeDiffInDays, emailContent._3, false)
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
    def getAppStartMaxTs(iu: (String, String, String, String, String, String, Long)) : (String, Long) = {
      def getAppStartTs(a: String, q: String, p: com.datastax.driver.core.PreparedStatement) : Map[String, Long] = {
        val m = new DateTime(iu._7, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis
        val bs = new BoundStatement(p).bind(iu._1, iu._2, iu._3, iu._4, Long.box(m), iu._5, iu._6, a)
        val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
        if(rows.size == 0){
          Map(a -> 0L)
        } else {
          Map(a -> rows(0).getTimestamp("start_ts").getTime)
        }
      }
      val appVals = List("Explorer", "Apps", "Workbench", "Support Portal", "Health Check", "Dashboards", "Rules & Alerts", "Log Vault", "File Upload")
      val qry = s"SELECT start_ts, end_ts FROM $KsUMS.$CFNUserActivity WHERE mfr = ? AND prod = ? AND sch = ? AND ec = ? AND month = ? AND email = ? AND sess_id = ? AND app = ? LIMIT 1"
      val psQry = DS.createPreparedStatement(qry)
      val appStart = appVals.foldLeft(Map[String, Long]())((f, a) => f ++ getAppStartTs(a, qry, psQry))
      val appMapStartAll = ListMap(appStart.toSeq.sortWith(_._2 > _._2):_*)
      appMapStartAll.toSeq.head
    }
    
    val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
    val qry = s"SELECT mfr, prod, sch, ec, email, last_access, last_logout, last_login, last_sess_id FROM $KsUMS.$CFNUserByMps;"
    val rows = DS.cqlExecute(qry).asScala.toList
    val idleUsers = (for { row <- rows 
      last_acess = row.getTimestamp("last_access").getTime()
      last_logout = row.getTimestamp("last_logout")
      last_login = row.getTimestamp("last_login").getTime()
      if(currentTs - last_acess > sessionTimeoutInMillis && (last_logout == null || (last_logout.getTime() < last_login)))
    } yield {
        val m = row.getString("mfr")
        val p = row.getString("prod")
        val s = row.getString("sch")
        val ec = row.getString("ec")
        val email = row.getString("email")
        val lastSessId = row.getString("last_sess_id")
        (m, p, s, ec, email, lastSessId, last_acess)
    }).toList

    val updateQry = s"UPDATE $KsUMS.$CFNUserByMps SET last_logout = ? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND email=?;"
    val ps = DS.createPreparedStatement(updateQry) 
    
    val updateUsrActivityQry = s"UPDATE $KsUMS.$CFNUserActivity SET end_ts = ? WHERE mfr = ? AND prod = ? AND sch = ? AND ec = ? AND month = ? AND email = ? AND sess_id = ? AND app = ? AND start_ts = ?"
    val psUsrActivity = DS.createPreparedStatement(updateUsrActivityQry)
    for(idleUser <- idleUsers){
      val bs = new BoundStatement(ps).bind(new Date(currentTs), idleUser._1, idleUser._2, idleUser._3, idleUser._4, idleUser._5)
      DS.cqlExecuteBoundStmnt(bs)
      val appStart = getAppStartMaxTs(idleUser)
      val m = new DateTime(idleUser._7, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis
      val bsPs = new BoundStatement(psUsrActivity).bind(new Date(currentTs), idleUser._1, idleUser._2, idleUser._3, idleUser._4, Long.box(m), idleUser._5, idleUser._6, appStart._1, new Date(appStart._2))
      DS.cqlExecuteBoundStmnt(bsPs)
    }
  }

  /**
    * Update ums.user.failed_login value to 0
    */
  def updateSuccessLoginAttempt(usrEmail: String) : Option[String] = {
    try {
      val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set failed_login = ?, active = ? WHERE email = ?;")
      val bs = new BoundStatement(ps).bind(Int.box(0), Boolean.box(true), usrEmail.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs).asScala.toList
      None
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
      val ps = DS.createPreparedStatement(s"SELECT active, failed_login FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(usrEmail)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      var remainingAttempt = FailedLoginMaxLimit
      if(rows.size == 1){
        val dateTime = DateTime.now
        val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
        val failed_login_count = models.Utils.getIntVal(rows(0), "failed_login", CVDefaultInt) + 1
        var active = models.Utils.getBooleanVal(rows(0), "active", false)
        if(failed_login_count == FailedLoginMaxLimit && BlockUser){
          active = false
        }
        val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set last_failed_login_time = ?, active = $active, failed_login = $failed_login_count WHERE email = '${usrEmail.toLowerCase()}'; ")
        remainingAttempt = FailedLoginMaxLimit - failed_login_count
        val bs_u = new BoundStatement(ps_u).bind(new Date(ts))
        DS.cqlExecuteBoundStmnt(bs_u)
        if(failed_login_count == FailedLoginMaxLimit && BlockUser) {
          val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET last_login_otp = ?, remote_address = ? WHERE email = ?;")
          val bs_u = new BoundStatement(ps_u).bind(null, null, usrEmail.toLowerCase())
          DS.cqlExecuteBoundStmnt(bs_u)
          sendAccountBlockedEmailToUser(usrEmail)
        }
      }
      (None, remainingAttempt)
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
    val qry = s"SELECT last_failed_login_time, email, first_name, last_name, failed_login FROM $KsUMS.$CFNUser WHERE email = '${usrEmail.toLowerCase()}'; "
    val rows = DS.cqlExecute(qry).asScala.toList
    if(rows.size == 1){
      val email = rows.head.getString("email")
      val f_name = rows.head.getString("first_name")
      val l_name = rows.head.getString("last_name")
      val failed_login = models.Utils.getIntVal(rows.head, "failed_login", CVDefaultInt)
      val last_failed_login_time = new DateTime(rows.head.getTimestamp("last_failed_login_time"), DateTimeZone.UTC)
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
        val qry = s"SELECT last_failed_login_time, email, failed_login FROM $KsUMS.$CFNUser;"
        val rows = DS.cqlExecute(qry).asScala.toList
        for (row <- rows) {
          val email = row.getString("email")
          val failed_login = models.Utils.getIntVal(row, "failed_login", CVDefaultInt)
          val currentTime = DateTime.now.getMillis()
          val last_failed_login_time = models.Utils.getDateVal(row, "last_failed_login_time", CVDefaultDate).getTime()
          if (failed_login >= FailedLoginMaxLimit && (currentTime - last_failed_login_time > BlockUserTimePeriod * 1000)) {
            if (BlockUser) {
              val dateTime = DateTime.now
              val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
              val ps = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser set modified_on =?, active = ?, failed_login = ?  WHERE email = '${email.toLowerCase()}'; ")
              val bs = new BoundStatement(ps).bind(new Date(ts), Boolean.box(true), Int.box(0))
              DS.cqlExecuteBoundStmnt(bs)
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
      val ps = DS.createPreparedStatement(s"SELECT role FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username)
      val role = DS.cqlExecuteBoundStmnt(bs).head.getString("role")
      
      if(!role.isEmpty()){
        val ps1 = DS.createPreparedStatement(s"SELECT domains,permissions FROM $KsUMS.$CFNRole WHERE name=?;")
        val bs1 = new BoundStatement(ps1).bind(role)
        val row = DS.cqlExecuteBoundStmnt(bs1).asScala.toList
        if(row.size == 1){          
          val domain = row.head.getMap("domains", classOf[String],classOf[String])   
          val permission = row.head.getMap("permissions", classOf[String],classOf[String])
          val mps = domain.values.toList
          val mpsparam = mfr+":"+prod+":"+sch
          for (mpsindex <- mps if (mpsparam == mpsindex && permission(mpsindex).contains(FeatDashboardAdmin))){
            return true
          }         
        } 
        log.error(s"Either role does not exist or more than one role with same name")
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
      
      val ps = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
      val bs = new BoundStatement(ps).bind(mfr)
      val users = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val userRoles = for (i <- 0 until users.length) yield {
      val username = users(i)  
      val ps = DS.createPreparedStatement(s"SELECT role FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username.getString("email"))
      val role = DS.cqlExecuteBoundStmnt(bs).head.getString("role") 
      
      role      
      }    
      
      val mpsparam = mfr+":"+prod+":"+sch
      
      if(!userRoles.isEmpty()){
        
        val emailIds: List[JsObject] = (for { 
          i <- 0 until userRoles.length 
          ps1 = DS.createPreparedStatement(s"SELECT domains,permissions FROM $KsUMS.$CFNRole WHERE name=?;")
          bs1 = new BoundStatement(ps1).bind(userRoles(i))
          row = DS.cqlExecuteBoundStmnt(bs1).asScala.toList
          if(row.size > 0)
          domain = row.head.getMap("domains", classOf[String],classOf[String])
          permission = row.head.getMap("permissions", classOf[String],classOf[String])
          mps = domain.values.toList
          mpsindex <- mps
          if(mpsparam.equals(mpsindex) && permission(mpsindex).contains(FeatDashboardAdmin))
          
        } yield { 
          Json.obj("email" -> users(i).getString("email"),"role" -> userRoles(i))
        }).toList
        emailIds
      } else {
        List()
      }
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup ex: " + ex)
        List()
      }
    }
  }
  def getTableauAdminUsers(mfr: String, prod:String, sch:String): List[JsObject] = {
    try {
      
      val ps = DS.createPreparedStatement(s"SELECT email FROM $KsUMS.$CFNUserByOrg WHERE org=?;")
      val bs = new BoundStatement(ps).bind(mfr)
      val users = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val userRoles = for (i <- 0 until users.length) yield {
      val username = users(i)  
      val ps = DS.createPreparedStatement(s"SELECT role FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username.getString("email"))
      val role = DS.cqlExecuteBoundStmnt(bs).head.getString("role") 
      
      role      
      }    
      
      val mpsparam = mfr+":"+prod+":"+sch
      
      if(!userRoles.isEmpty()){
        
        val emailIds: List[JsObject] = (for { 
          i <- 0 until userRoles.length 
          ps1 = DS.createPreparedStatement(s"SELECT domains,permissions FROM $KsUMS.$CFNRole WHERE name=?;")
          bs1 = new BoundStatement(ps1).bind(userRoles(i))
          row = DS.cqlExecuteBoundStmnt(bs1).asScala.toList
          if(row.size > 0)
          domain = row.head.getMap("domains", classOf[String],classOf[String])
          permission = row.head.getMap("permissions", classOf[String],classOf[String])
          mps = domain.values.toList
          mpsindex <- mps
          if(mpsparam.equals(mpsindex) && permission(mpsindex).contains(FeatDashboardAdmin) && permission(mpsindex).contains(FeatWorkBench))
        } yield { 
          Json.obj("email" -> users(i).getString("email"),"role" -> userRoles(i))
        }).toList
        emailIds
      } else {
        List()
      }
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on lookup ex: " + ex)
        List()
      }
    }
  }

  def bulkUpdateCustomerUser(users: BulkUpdateUsers): Option[String] = {
    try {
      users.usrEmails.foreach(email => {
        val ps = DS.createPreparedStatement(s"SELECT role, mps_def, passwd_hash, active FROM $KsUMS.$CFNUser WHERE email=?;")
        val bs = new BoundStatement(ps).bind(email.toLowerCase())
        val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
        if(rows.size > 0){
          val row = rows.head
          val is_active = if(users.user_state.get.equals(UserActive)){
            Boolean.box(true)
          }
          else if(users.user_state.get.equals(UserInactive)){
            Boolean.box(false)
          }
          else{
            val actInact = models.Utils.getBooleanVal(row, "active", CVDefaultBool)
            if(actInact) Boolean.box(true) else Boolean.box(false)
          }
          val role = if(models.Utils.getStringData(users.role).isEmpty()) row.getString("role") else models.Utils.getStringData(users.role)
          val mps_def = if(models.Utils.getStringData(users.mps_def).isEmpty()) row.getString("mps_def") else models.Utils.getStringData(users.mps_def)
          val passwordStr = models.Utils.getStringData(users.password)
          val encPasswd = if(passwordStr.isEmpty()) row.getString("passwd_hash") else BCrypt.hashpw(passwordStr, BCrypt.gensalt(BCryptLogRounds))
          if(passwordStr.isEmpty()) {
            val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET role = ?, mps_def = ?, passwd_hash = ?, active = ? WHERE email = ?; ")
            val bs_u = new BoundStatement(ps_u).bind(role, mps_def, encPasswd, is_active, email.toLowerCase())
            DS.cqlExecuteBoundStmnt(bs_u)
          }
          else {
            val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET role = ?, mps_def = ?, passwd_hash = ?, active = ?, last_login_otp = ?, remote_address = ? WHERE email = ?; ")
            val bs_u = new BoundStatement(ps_u).bind(role, mps_def, encPasswd, is_active, null, null, email.toLowerCase())
            DS.cqlExecuteBoundStmnt(bs_u)
          }
        }
      })
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNUser table, ex: $ex")
        Some("Failed to update user(s)")
      }
    }
  }

  def bulkDeleteCustomerUser(users: BulkDeleteUsers): Option[String] = {
    try {
      users.usrEmails.foreach(email => {
        delete(email) map { errorMsg =>
          Some("Failed to delete user(s)")
        } getOrElse None
      })
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to delete users from $CFNUser table, ex: $ex")
        Some("Failed to delete user(s)")
      }
    }
  }

  def isUserAvailable(email: String): Boolean = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT count(*), active FROM $KsUMS.$CFNUser WHERE email=? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val isActive = models.Utils.getBooleanVal(rows.head, "active", CVDefaultBool)
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
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (rows.size > 0) {
        val row = rows.head
        val isTwoAuthEnabledAtMPSLevel = models.Org.isTwoAuthAtOrgLevel(org)
        if(isTwoAuthEnabledAtMPSLevel){
          log.debug(s"Two fact auth is enabled at MPS level : $mfr")
          val role = models.Utils.getStringVal(row, "role", CVDefaultStr)
          val twoAuthList = models.Role.twoAuthList(mfr, prod, sch, role)
          if(twoAuthList.size > 0 && twoAuthList.contains("phone")){
            val phone = models.Utils.getStringVal(row, "phone", CVDefaultStr)
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
      val getUserPs = DS.createPreparedStatement(s"SELECT last_sess_id, otp, otp_generation_time FROM $KsUMS.$CFNUserByMps where mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
      val getUserBs = new BoundStatement(getUserPs).bind(mfr, prod, sch, mfr, email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(getUserBs).asScala.toList
      if (rows.size > 0) {
        val row = rows.head
        val sess_id = models.Utils.getStringVal(row, "last_sess_id", CVDefaultStr)
        val otp_time = models.Utils.getDateVal(row, "otp_generation_time", CVDefaultDate).getTime()
        val otp = models.Utils.getStringVal(row, "otp", "")
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

  def generateOTPSendUser(mfr: String, prod: String, sch: String, user: User, twoAuthTargetList: List[TwoAuthDevices]): Try[String] = {
    try{
      val otp = models.Utils.generateRandomNumber()
      writeUserOTP(mfr, prod, sch, user.email, otp)
      models.Utils.sendOTPonEmail(user, otp)
      val devices = twoAuthTargetList.head
      devices.phone match {
        case Some(n) =>
          log.debug(s"Sending an OTP to user's email {${user.email.toLowerCase()}} and phone {${user.phone}} : $otp")
          models.Utils.sendOTPonPhone(user, otp)
        case None => log.debug(s"Sending an OTP to user's email {${user.email.toLowerCase()}} : $otp")
      }
      Success("SUCCESS")
    } catch {
      case ex: Exception => {
        log.error(s"Failed to generate otp for user with email id : $email, ex: $ex")
        throw new RuntimeException("ERROR")
      }
    }
  }

  def writeUserOTP(mfr: String, prod: String, sch: String, email: String, otp: String): Option[String] = {
    try {
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val updateUserPs = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUserByMps set otp = ?, otp_generation_time = ? WHERE mfr=? AND prod=? AND sch=? AND ec=? AND email=?;")
      val updateUserBs = new BoundStatement(updateUserPs).bind(otp, new Date(ts), mfr, prod, sch, mfr, email.toLowerCase())
      DS.cqlExecuteBoundStmnt(updateUserBs)
      log.debug(s"Updating otp : [$otp] in $CFNUserByMps table for user with email id : ${email.toLowerCase()}")
      Some("otp successfully updated")
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
      val mps = user.mps_def.split(":").toList
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
      val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNUser SET last_login_otp = ?, remote_address = ? WHERE email = ?; ")
      val bs_u = new BoundStatement(ps_u).bind(new Date(ts), remoteAddress, email.toLowerCase())
      DS.cqlExecuteBoundStmnt(bs_u)
      Some("SUCCESS")
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update last_login_otp and remote_address in User table for user with email id : $email, ex: $ex")
        Some("FAILURE")
      }
    }
  }
}
