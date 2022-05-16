package models

import scala.language.postfixOps
import scala.collection.JavaConversions._

import play.api.Logger

import com.datastax.driver.core.{ResultSet, Row, BoundStatement}
import com.datastax.driver.core.policies._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.util.{Try, Success, Failure}
import java.util.Date
import constants._
import org.joda.time._
import play.api.libs.json._

import models.Utils._

case class Org(mfr: String, name: String, max_licensed_users: Int, max_users: Int, t: Int,email_template_header: String,email_template_body: String,email_template_footer: String,email_template_subject: String,email_template_link: String,email_template_link_expiry: String,end_customer_domain: String)

object Org {
                      
  val log = Logger("Model_Org")  
  
  val ColEmail = "email"
  val ColEndcustomerName = "endcustomer_name"
  val ColDashEnabled = "dashboard_enabled"
  val ColCreatedBy = "created_by"
  val ColUpdatedOn = "updated_on"  
  val ColSerialNumber = "serial_number"  
  
 /** Returns a set of manufacturers
  *  
  */  
  def mfrs(): IndexedSeq[String] = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT name FROM $KsUMS.$CFNOrgByType WHERE type=?;")
      val bs = new BoundStatement(ps).bind(Int.box(OrgTypeMfr))
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toIndexedSeq
       for {
        row <- rows
      } yield {
          models.Utils.getStringVal(row, "name", CVDefaultStr)
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on all manufacturer lookup, ex: " + ex)
        IndexedSeq()
      }
    }    
  }
  /**
   * Returns a set of realms
   */
  def realms(): IndexedSeq[String] = {
    try {
      val rows = DS.cqlExecute(s"SELECT name FROM $KsUMS.$CFNRealm;").asScala.toIndexedSeq
       for {
        row <- rows
      } yield {
          models.Utils.getStringVal(row, "name", CVDefaultStr)
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on all realm lookup, ex: " + ex)
        IndexedSeq()
      }
    }    
  }
  
 /** Returns all the customers for a given manufacturer
  *  
  */  
  def customers(mfr: String): IndexedSeq[(String, String, String, String, String)] = {
    try {
      val rows = if(mfr == GBName) {
        DS.cqlExecute(s"SELECT mfr, prod, sch, ec, realm FROM $KsUMS.$CFNMpseSSO;").asScala.toIndexedSeq
      } else {
        val ps = DS.createPreparedStatement(s"SELECT mfr, prod, sch, ec, realm FROM $KsUMS.$CFNMpseSSO WHERE mfr=? order by prod;")
        val bs = new BoundStatement(ps).bind(mfr.toLowerCase())
       DS.cqlExecuteBoundStmnt(bs).asScala.toIndexedSeq
      }
      for {
        row <- rows
      } yield {
          (models.Utils.getStringVal(row, "mfr", CVDefaultStr), models.Utils.getStringVal(row, "prod", CVDefaultStr), models.Utils.getStringVal(row, "sch", CVDefaultStr), models.Utils.getStringVal(row, "ec", CVDefaultStr), models.Utils.getStringVal(row, "realm", CVDefaultStr))
      }      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on customers lookup for mfr: $mfr, ex: " + ex)
        IndexedSeq()
      }
    }    
  }

 /** Returns all organizations
  *  This returns entries for GB, manufacturers and customers 
  */    
  def all(): IndexedSeq[String] = {

    def removeDuplicates[A](xs: List[A]): List[A] = {
      if (xs.isEmpty) xs
      else
        xs.head :: removeDuplicates(xs.tail filter (_ != xs.head))
    }
        
    try {
      val rows = DS.cqlExecute(s"SELECT name FROM $KsUMS.$CFNOrg;").asScala.toIndexedSeq
      val orgs = for {
        row <- rows
      } yield {
        models.Utils.getStringVal(row, "name", CVDefaultStr)        
      }
      removeDuplicates(orgs.toList).toIndexedSeq
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on all customers lookup, ex: " + ex)
        IndexedSeq()
      }
    }    
  }
  
  def allmfr(): List[Org] = {

    try {
      val result = DS.cqlExecute(s"SELECT mfr,name,max_licensed_users,max_users,type,email_template_header,email_template_body,email_template_footer,email_template_subject,email_template_link,email_template_link_expiry,end_customer_domain FROM $KsUMS.$CFNOrg;")
      val rows = result.asScala.toList
      (for { 
        row <- rows 
      } yield {
        val mfr = models.Utils.getStringVal(row, "mfr", CVDefaultStr)
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val max_licensed_users = models.Utils.getIntVal(row, "max_licensed_users", CVDefaultInt)
        val max_users = models.Utils.getIntVal(row, "max_users", CVDefaultInt)
        val t = models.Utils.getIntVal(row, "type", CVDefaultInt)
        val email_template_header = models.Utils.getStringVal(row, "email_template_header", CVDefaultStr)
        val email_template_footer = models.Utils.getStringVal(row, "email_template_footer", CVDefaultStr)
        val email_template_body = models.Utils.getStringVal(row, "email_template_body", CVDefaultStr)
        val email_template_subject = models.Utils.getStringVal(row, "email_template_subject", CVDefaultStr)
        val email_template_link = models.Utils.getStringVal(row, "email_template_link", CVDefaultStr)
	val email_template_link_expiry = models.Utils.getStringVal(row, "email_template_link_expiry", CVDefaultStr)
	val end_customer_domain = models.Utils.getStringVal(row, "end_customer_domain", CVDefaultStr)
        
        Org(mfr, name, max_licensed_users, max_users, t,email_template_header,email_template_footer,email_template_body,email_template_subject,email_template_link,email_template_link_expiry,end_customer_domain)
      }).toList 
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all manufacturers exception:  " + ex)
        List()
      }
    }
  }
  
  /** Returns all details of an organization
  *  
  */   
  def getOrgDetails(org: String): List[Org] = {

    try {
      val result = DS.cqlExecute(s"SELECT mfr,name,max_licensed_users,max_users,type,email_template_header,email_template_body,email_template_footer,email_template_subject,email_template_link,email_template_link_expiry,end_customer_domain FROM $KsUMS.$CFNOrg where mfr='$org';")
      val rows = result.asScala.toList  
      (for {row <- rows}
        yield{
        
        val mfr = models.Utils.getStringVal(row, "mfr", CVDefaultStr)
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val max_licensed_users = models.Utils.getIntVal(row, "max_licensed_users", CVDefaultInt)
        val max_users = models.Utils.getIntVal(row, "max_users", CVDefaultInt)
        val t = models.Utils.getIntVal(row, "type", CVDefaultInt)
        val email_template_header = models.Utils.getStringVal(row, "email_template_header", CVDefaultStr)
        val email_template_footer = models.Utils.getStringVal(row, "email_template_footer", CVDefaultStr)
        val email_template_body = models.Utils.getStringVal(row, "email_template_body", CVDefaultStr)
        val email_template_subject = models.Utils.getStringVal(row, "email_template_subject", CVDefaultStr)
	val email_template_link = models.Utils.getStringVal(row, "email_template_link", CVDefaultStr)   
	val email_template_link_expiry = models.Utils.getStringVal(row, "email_template_link_expiry", CVDefaultStr)   
    
	val end_customer_domain = models.Utils.getStringVal(row, "end_customer_domain", CVDefaultStr)
          
        Org(mfr, name, max_licensed_users, max_users, t,email_template_header,email_template_body,email_template_footer,email_template_subject,email_template_link,email_template_link_expiry,end_customer_domain)
      }).toList
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all manufacturers exception:  " + ex)
        List()
      }
    }
  }
  
  /** Returns customer for a mfr, all if glassbeam or else respective customers
   *  
   */

  def mfrAndCustomers(org: String): IndexedSeq[String] = {
    if (org == GBName) {
      models.Org.all toIndexedSeq
    } else {
      val cust = models.Org.customers(org)
      val mfrList = cust map { c => c._1}
      org +: mfrList
    }
  }
  
   /** inserts a new entry for cutomer in an organization in database 
   *  
   */  
  def create(o: Cust): Option[String] = {
    def createMap(str: String) : Map[String, String] = {
      val kv = str.split(":").toList
      Map(kv(0) -> kv(1))
    }
    val mfrName = o.mfr.toLowerCase
    val orgName = o.domain.ec.toLowerCase()
    val ssoRoleMap = if(o.domain.sso_roles.isEmpty()){
      Map()
    } else {
      val ssoRoles = o.domain.sso_roles.split(",").toList
      ssoRoles.foldLeft(Map[String, String]())( (f, e) => f ++ createMap(e))
    }
    val orgType = if(o.mfr.equals(o.domain.ec)) OrgTypeMfr else OrgTypeEC
    val cqlStatement = s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES (?, ?, ?, ?);"
    val cqlStatement2 = s"INSERT INTO $KsUMS.$CFNOrgByType (mfr, name, description, type) VALUES (?, ?, ?, ?);"
    val cqlStatement3 = s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm, sso_login_url, sso_logout_url, sso_roles, sso_idp_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    
    val ps1 = DS.createPreparedStatement(cqlStatement)
    val ps2 = DS.createPreparedStatement(cqlStatement2)
    val ps3 = DS.createPreparedStatement(cqlStatement3)
    val bs1 = new BoundStatement(ps1).bind(mfrName, orgName, o.desc, Int.box(orgType))
    val bs2 = new BoundStatement(ps2).bind(mfrName, orgName, o.desc, Int.box(orgType))
    val bs3 = new BoundStatement(ps3).bind(mfrName, o.domain.prod, o.domain.sch, o.domain.ec, o.domain.realm, o.domain.sso_login_url, o.domain.sso_logout_url, ssoRoleMap.asJava, o.domain.sso_idp_id)
    try {
      if(orgType.equals(OrgTypeEC)){
        DS.cqlExecuteBoundStmnt(bs1)
        DS.cqlExecuteBoundStmnt(bs2) 
      }
      DS.cqlExecuteBoundStmnt(bs3)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new org, mfr: $mfrName, org: $orgName, exception: " + ex)
        Some("Failed to create new org")
      }
    }    
  }
  
   /** inserts a new entry for cutomer in an organization in database 
   *  
   */  
  def manageRealm(o: MfrRealm): Option[String] = {
    def createMap(str: String) : Map[String, String] = {
      val kv = str.split(":").toList
      Map(kv(0) -> kv(1))
    }
    val mfrName = o.mfr.toLowerCase
    val orgName = o.ec.toLowerCase()
    val ssoRoleMap = if(o.sso_roles.isEmpty()){
      Map()
    } else {
      val ssoRoles = o.sso_roles.split(",").toList
      ssoRoles.foldLeft(Map[String, String]())( (f, e) => f ++ createMap(e))
    }
    
    val cqlStatement = s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm, sso_login_url, sso_logout_url, sso_roles, sso_idp_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    val ps = DS.createPreparedStatement(cqlStatement)
    val bs = new BoundStatement(ps).bind(mfrName, o.prod, o.sch, o.ec, o.realm, o.sso_login_url, o.sso_logout_url, ssoRoleMap.asJava, o.sso_idp_id)
    try {
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while adding/modifying realm, mfr: $mfrName, org: $orgName, exception: " + ex)
        Some("Failed to create new org")
      }
    }    
  }
 

  def listRealm(mfr: String): List[MfrRealm] = {
    try {
     val query = s"SELECT * FROM $KsUMS.$CFNMpseSSO WHERE mfr=?;"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      (for { 
        row <- rows 
      } yield {
        val prod = models.Utils.getStringVal(row, "prod", CVDefaultStr)
        val sch = models.Utils.getStringVal(row, "sch", CVDefaultStr)
        val ec = models.Utils.getStringVal(row, "ec", CVDefaultStr)
        val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)
        val sso_login_url = models.Utils.getStringVal(row, "sso_login_url", CVDefaultStr)
        val sso_logout_url = models.Utils.getStringVal(row, "sso_logout_url", CVDefaultStr)
        val sso_roles = models.Utils.getStringVal(row, "sso_roles", CVDefaultStr)
        val sso_idp_id = models.Utils.getStringVal(row, "sso_idp_id", CVDefaultStr)
        
        
        MfrRealm(mfr,prod,sch,ec,realm,sso_login_url,sso_logout_url,sso_roles,sso_idp_id)
      }).toList 
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
        
    }
   }

  def manageDefaultFeature(o: MfrDefaultFeature): Option[String] = {
    
    val cqlStatement = s"INSERT INTO $KsUMS.$CFNMpseInfo (mfr, prod, sch, ec, active, default_feature_internal, default_feature_external, nsr_enabled, logo,logo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
    val ps = DS.createPreparedStatement(cqlStatement)
    val bs = new BoundStatement(ps).bind(o.mfr, o.prod, o.sch, o.ec, Boolean.box(o.active), o.default_feature_internal, o.default_feature_external, Boolean.box(o.nsr_enabled), o.logo, o.logo_url)
    try {
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while adding/modifying realm, mfr: $o.mfr, exception: " + ex)
        Some("Failed to add default feature")
      }
    }    
  }
  
  def listDefaultFeature(mfr: String): List[MfrDefaultFeature] = {
    try {
     val query = s"SELECT * FROM $KsUMS.$CFNMpseInfo WHERE mfr=?;"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      (for { 
        row <- rows 
      } yield {
        val prod = models.Utils.getStringVal(row, "prod", CVDefaultStr)
        val sch = models.Utils.getStringVal(row, "sch", CVDefaultStr)
        val ec = models.Utils.getStringVal(row, "ec", CVDefaultStr)
        val active = models.Utils.getBooleanVal(row, "active", CVDefaultBool)
        val default_feature_internal = models.Utils.getStringVal(row, "default_feature_internal", CVDefaultStr)
        val default_feature_external = models.Utils.getStringVal(row, "default_feature_external", CVDefaultStr)
        val nsr_enabled = models.Utils.getBooleanVal(row, "nsr_enabled", CVDefaultBool)
        val logo = models.Utils.getStringVal(row, "logo", CVDefaultStr)
        val logo_url = models.Utils.getStringVal(row, "logo_url", CVDefaultStr)
        
        MfrDefaultFeature(mfr,prod,sch,ec,active,default_feature_internal,default_feature_external,nsr_enabled,logo,logo_url)
      }).toList 
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
        
    }
   }
  
   
  def manageUiConfig(r: UIConf): Option[String] = {
    def createMap(str: String) : Map[String, String] = {
      val kv = str.split(":").toList
      if(kv.size == 2) Map(kv(0) -> kv(1))  else Map()
    }
    try {
      
      val expFlds = r.exp_display_fields.split(",").toList
      val ivFlds = r.iv_display_fields.split(",").toList
      val expMaps = if(expFlds.nonEmpty) expFlds.foldLeft(Map[String, String]())( (f, e) => f ++ createMap(e)) else Map()
      val ivMaps = if(ivFlds.nonEmpty) ivFlds.foldLeft(Map[String, String]())( (f, e) => f ++ createMap(e)) else Map()
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNUIConfig (mfr, prod, sch, allowed_extension, compound_rows, core_delimiter,  default_days, default_exp_view, exp_display_fields, iv_display_fields, facet_limit , is_stage_domain , is_stage_keyspace, json_form, max_day_range , max_upload_size, lv_to_exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs_u = new BoundStatement(ps_u).bind(r.mfr, r.prod, r.sch, r.allowed_extension, Int.box(r.compound_rows), r.core_delimiter, Int.box(r.default_days), r.default_exp_view, expMaps.asJava, ivMaps.asJava, Int.box(r.facet_limit), r.is_stage_domain, r.is_stage_keyspace, r.json_form, Int.box(r.max_day_range), Int.box(r.max_upload_size), Boolean.box(r.lv_to_exp))
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new ui configration for mfr prod sch: , exception: " + ex)
        Some("Failed to create new config")
      }
    }
  }
  
   def listUiConfig(mfr: String): List[UIConf] = {
    try {
      
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUIConfig where mfr = ?;")
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList

      (for {
        row <- rows
      } yield {
        val ivDisplayFldMap = row.getMap("iv_display_fields", classOf[String], classOf[String]).toMap
        val expDisplayFldMap = row.getMap("exp_display_fields", classOf[String], classOf[String]).toMap
        
        val ivDisplayFldList = (ivDisplayFldMap map { iv => 
          s"${iv._1}:${iv._1}"
        }).toList
        val ivDisplayFldStr = ivDisplayFldList.mkString(",")
        
        val expDisplayFldList = (expDisplayFldMap map { exp => 
          s"${exp._1}:${exp._1}"
        }).toList
        val expDisplayFldStr = expDisplayFldList.mkString(",")
        
        UIConf(row.getString("mfr"), row.getString("prod"), row.getString("sch"), row.getString("allowed_extension"), row.getInt("compound_rows"), row.getString("core_delimiter"), row.getInt("default_days"), row.getString("default_exp_view"),
          ivDisplayFldStr, expDisplayFldStr, row.getInt("facet_limit"), row.getString("is_stage_domain"), row.getString("is_stage_keyspace"),  row.getString("json_form"),
           row.getInt("max_day_range"), row.getInt("max_upload_size"), row.getBool("lv_to_exp"))
         
      }).toList
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all config  for user:, org:, ex: " + ex)
        List()
      }
    }
  } 

  /** creates a new manufacturer
   *  
   */  
  def createMfr(mfr: Org): Option[String] = {
    def create(o: Org): Option[String] = {
      val mfrName = o.mfr.toLowerCase
      val orgName = o.name.toLowerCase
      val cqlStatement = s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, max_licensed_users, max_users,type) VALUES (?, ?, ?, ?, ?);"
      val cqlStatement2 = s"INSERT INTO $KsUMS.$CFNOrgByType (mfr, name, type) VALUES (?, ?, ?);"
      val ps1 = DS.createPreparedStatement(cqlStatement)
      val ps2 = DS.createPreparedStatement(cqlStatement2)
      val bs1 = new BoundStatement(ps1).bind(orgName, orgName, Int.box(o.max_licensed_users), Int.box(o.max_users),Int.box(o.t))
      val bs2 = new BoundStatement(ps2).bind(orgName, orgName, Int.box(o.t))
      try {
        DS.cqlExecuteBoundStmnt(bs1)
        DS.cqlExecuteBoundStmnt(bs2)
        None
      } catch {
        case ex: Exception => {
          log.error(s"Exception thrown while creating new mfr, mfr: $mfrName, org: $orgName, exception: " + ex)
          Some("Failed to create new org")
        }
      }    
    }
    create(mfr)
  }
  
  /** creates a new customer 
   *  
   */  
  def createCustomer(cust: Cust): Option[String] = {
    create(cust) 
  }


 /**
  * deletes a manufacturer from database
  * Only a GB admin can delete a manufacturer
  */
  def deleteMfr(mfr: String): Option[String] = {
    val users = models.User.byOrg(mfr)
    val userOrg = users.foldLeft(List[String]())((f, u) => f ++ List(u.email))
    try {
      if(userOrg.nonEmpty) {
        DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email IN (${userOrg mkString("'", "', '",  "'")}) ;")
      }
      for (user <- users) {
        DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNUserByOrg WHERE org='${mfr.toLowerCase}' AND email='${user.email}' ;")
      }
      DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNOrg WHERE mfr='${mfr.toLowerCase}';")
      DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNOrg WHERE mfr='$GBName' AND name = '${mfr.toLowerCase}' ;")
      DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNMpseSSO WHERE mfr='${mfr.toLowerCase}';")
      DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNOrgByType WHERE type IN (1, 10) AND mfr='${mfr.toLowerCase}';")
      DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNOrgByType WHERE type IN (1, 10) AND mfr='$GBName' AND name = '${mfr.toLowerCase}' ;")
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a manufacturer, mfr: $mfr, exception: " + ex)
        Some("Failed to delete manufacturer")
      }
    }    
  }

  
 /**
  * deletes a customer from database
  * Only a GB admin or a manufacturer can delete its customer
  */
  def deleteCustomer(mfr: String, prod: String, sch: String, ec: String, realm: String): Option[String] = {
    val users = models.User.byOrg(mfr)
    val userOrg = users.foldLeft(List[String]())((f, u) => f ++ List(u.email))
    try {
      val query = s"DELETE FROM $KsUMS.$CFNMpseSSO WHERE mfr=? AND prod = ? AND sch = ? AND ec = ? AND realm = ?;"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(mfr, prod, sch, ec, realm)
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a customer, mfr: $mfr, exception: " + ex)
        Some("Failed to delete manufacturer")
      }
    }    
  }
  
  /** Get details of a customer info from mpse_sso column family
   *  
   */
  def getMpseInfo(mfr: String, prod: String, sch: String, ec: String): IndexedSeq[String] = {
    try {
     val query = s"SELECT * FROM $KsUMS.$CFNMpseSSO WHERE mfr=? AND prod = ? AND sch = ? AND ec = ?;"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(mfr, prod, sch, ec)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.nonEmpty) {
        val headRow = rows.head
        IndexedSeq(models.Utils.getStringVal(headRow, "sso_login_url", CVDefaultStr), models.Utils.getStringVal(headRow, "sso_logout_url", CVDefaultStr), 
             models.Utils.getStringVal(headRow, "sso_idp_id", CVDefaultStr))
      }  else 
        IndexedSeq()
    } catch {
      case ex: Exception => log.error(s"Exception thrown while reading mpse_sso for $mfr, exception " + ex)
      IndexedSeq()
        
    }
   }
  
  def getDashboardUrl(mfr: String, prod: String, sch: String, r_id: String): String = {
    try {
      val q = s"SELECT r_id, d_type, r_link FROM $KsGB.$CFNDashboard where mfr=? AND prod=? AND sch=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(mfr, prod, sch)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val dashboard_url = for{ 
        row <- rows
		if(row.getUUID("r_id").toString == r_id)} yield row.getString("r_link")
	  dashboard_url.head
      
    } catch {
      case ex: Exception =>
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while fetching list of all dashboards for $mfr, $prod, $sch. exception:  " + ex)
        ""
    }
  } 
  
  def usersLimit(mfr: String): (Int, Int, Int, Int) = {
    try {
      val q = s"SELECT max_users, max_licensed_users, max_creator_licenses,max_viewer_licenses FROM $KsUMS.$CFNOrg WHERE mfr=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size > 0){
        val row = rows.head
        (row.getInt("max_users"), row.getInt("max_licensed_users"), row.getInt("max_creator_licenses"),row.getInt("max_viewer_licenses"))
      } else {
        (0,0,0,0)
      }
      
    } catch {
      case ex: Exception =>
        log.error(s"Error while getting max users and max licensed users for $mfr, ex: $ex")
        (0, 0, 0, 0)
    }
  }
  
  def ecHealthCheck(mfr: String, prod: String, sch: String, user: Option[String]): List[EndCustomer] = {
    try{
      
      val query = s"SELECT * FROM $KsUMS.$CFNEndCustomer WHERE mfr=? AND prod=? AND sch=?;"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(mfr, prod, sch)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val ecId = user.getOrElse(CVDefaultStr)
      user match {
        case Some(u) =>
          val ecList = (for { 
            row <- rows 
            email = row.getString(ColEmail)
            if(u.equals(email))  
          } yield {
            val serial_number = row.getList(ColSerialNumber,classOf[String])
            val endcustomer_name = row.getString(ColEndcustomerName)
            val created_by = row.getString(ColCreatedBy)
            val updated_on = models.Utils.dateFormat.print(new DateTime(row.getTimestamp(ColUpdatedOn), DateTimeZone.UTC))
            EndCustomer(endcustomer_name, serial_number.toList, created_by, updated_on)
          }).toList
          ecList.distinct
        case None => 
          val ecList = (for { 
            row <- rows 
          } yield {
            val serial_number = row.getList(ColSerialNumber,classOf[String])
            val endcustomer_name = row.getString(ColEndcustomerName)
            val created_by = row.getString(ColCreatedBy)
            val updated_on = models.Utils.dateFormat.print(new DateTime(row.getTimestamp(ColUpdatedOn), DateTimeZone.UTC))
            EndCustomer(endcustomer_name,serial_number.toList, created_by, updated_on)
          }).toList
          ecList.distinct
      }
    } catch {
      case ex: Exception =>
        log.error(s"Exception during getting end customer details from end_customer cf for $mfr, $prod, $sch, ex: $ex")
        List()
        
    }
    
  }
  
  def ecHealthCheckMfr(mfr: String, user: Option[String]): List[EndCustomerMfr] = {
    try{
      
      val query = s"SELECT * FROM $KsUMS.$CFNEndCustomer;"
      //val ps = DS.createPreparedStatement(query)
      //val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecute(query).asScala.toList
      val ecId = user.getOrElse(CVDefaultStr)
      user match {
        case Some(u) =>
          val ecList = (for { 
            row <- rows 
            email = row.getString(ColEmail)
            if(u.equals(email))  
          } yield {
            val mfr = row.getString("mfr")
            val prod = row.getString("prod")
            val sch = row.getString("sch")
            val serial_number = row.getList(ColSerialNumber,classOf[String])
            val endcustomer_name = row.getString(ColEndcustomerName)
            val created_by = row.getString(ColCreatedBy)
            val updated_on = models.Utils.dateFormat.print(new DateTime(row.getTimestamp(ColUpdatedOn), DateTimeZone.UTC))
            EndCustomerMfr(mfr,prod,sch,endcustomer_name, serial_number.toList, created_by, updated_on, List())
          }).toList
          ecList.distinct
        case None => 
          val ecList = (for { 
            row <- rows if row.getString("mfr").equals(mfr)
          } yield {
            val mfr = row.getString("mfr")
            val prod = row.getString("prod")
            val sch = row.getString("sch")
            val serial_number = row.getList(ColSerialNumber,classOf[String])
            val endcustomer_name = row.getString(ColEndcustomerName)
            val created_by = row.getString(ColCreatedBy)
            val updated_on = models.Utils.dateFormat.print(new DateTime(row.getTimestamp(ColUpdatedOn), DateTimeZone.UTC))
            EndCustomerMfr(mfr,prod,sch,endcustomer_name,serial_number.toList, created_by, updated_on, List())
          }).toList
          ecList.distinct
      }
    } catch {
      case ex: Exception =>
        log.error(s"Exception during getting end customer details from end_customer cf for $mfr ex: $ex")
        List()
        
    }
    
  }
  
  
  def ecHealthCheckAdd(mfr: String, prod: String, sch: String, user:String, endcustomer:String, serial_number:String ): Option[String] = {
    try {
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val serial_number_list = serial_number.split(",").toList
      val ps_u = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNEndCustomer(mfr,prod,sch,endcustomer_name,serial_number,created_by,updated_on)VALUES(?,?,?,?,?,?,?); ")
      val bs_u = new BoundStatement(ps_u).bind(mfr,prod,sch,endcustomer,serial_number_list.asJava,user,new Date(ts))
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to add $CFNEndCustomer table for end customer: ${endcustomer}, ex: $ex")
        Some("Failed to update user account.")
      }
    }
    
  }
  
  def ecHealthCheckUpdate(mfr: String, prod: String, sch: String, user:String, endcustomer:String, serial_number:String  ): Option[String] = {
    try {
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val serial_number_list = serial_number.split(",").toList
      val ps_u = DS.createPreparedStatement(s"UPDATE $KsUMS.$CFNEndCustomer SET serial_number = ? , created_by = ?, updated_on = ? WHERE mfr = ? and prod = ? and sch = ? and endcustomer_name = ?;")
      val bs_u = new BoundStatement(ps_u).bind(serial_number_list.asJava,user,new Date(ts),mfr,prod,sch,endcustomer)
      DS.cqlExecuteBoundStmnt(bs_u)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNEndCustomer table for end customer: ${endcustomer}, ex: $ex")
        Some("Failed to update user account.")
      }
    }
    
  }
  
   def ecHealthCheckDelete(mfr: String, prod: String, sch: String, ec:String): String = {
    try {
     
      val query = s"SELECT * FROM $KsUMS.$CFNUser;"      
      val rows = DS.cqlExecute(query).asScala.toList
      val userEc = for{ row <- rows
		    if((row.getString("end_customer") != null || row.getString("end_customer") != "") && mfr == row.getString("org"))
		    } yield row.getString("end_customer")		    
		     
    
      if(!(userEc.contains(ec))){
        val ps_u = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNEndCustomer WHERE mfr = ? and prod = ? and sch = ? and endcustomer_name = ?;")
        val bs_u = new BoundStatement(ps_u).bind(mfr,prod,sch,ec)
        DS.cqlExecuteBoundStmnt(bs_u)   
        
        "End customer " + ec + " deleted successfully"
      }else{
        "End customer " + ec + " associated with user(s), so cannot be deleted"
      }
     
    } catch {
      case ex: Exception => {
        log.error(s"Failed to DELETE $CFNEndCustomer table for end customer: $ec, ex: $ex")
        ""
      }
    }
    
  }
  def ecHealthCheckDeleteMultiple(mfr: String, prod: String, sch: String, ec:Seq[String]): String = {
    try {
     
      val query = s"SELECT * FROM $KsUMS.$CFNUser;"      
      val rows = DS.cqlExecute(query).asScala.toList
      val userEc = for{ row <- rows
		    if((row.getString("end_customer") != null || row.getString("end_customer") != "") && mfr == row.getString("org"))
		    } yield row.getString("end_customer")
		    
		  val ecList = ec.toList
      val ecNoUser = ecList diff userEc   
      val ecCustomerReplace = for (ec <- ecNoUser ) yield ec.replaceAll("'","''") 
      val endCustomers = ecCustomerReplace.mkString("'", "', '", "'")
      if(ecNoUser.nonEmpty){
        val ps_u = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNEndCustomer WHERE mfr = ? and prod = ? and sch = ? and endcustomer_name IN (${endCustomers});")
	val bs_u = new BoundStatement(ps_u).bind(mfr,prod,sch)
        DS.cqlExecuteBoundStmnt(bs_u)   
        
        "End customer(s) " + ecNoUser.mkString(", ") + " deleted successfully"
      }else{
        "All End customer(s) associated with users, so cannot be deleted"
      }
     
    } catch {
      case ex: Exception => {
        log.error(s"Failed to DELETE $CFNEndCustomer table for end customer: $ec, ex: $ex")
        ""
      }
    }
    
  } 
   
  
  
   /** Returns false if a user exists with the given email address
   * 
   */
  def notExistsEndCustomer(mfr:String, prod:String, sch:String, end_customer: String): Boolean = {
    try {
      val ps = DS.createPreparedStatement(s"SELECT count(*) FROM $KsUMS.$CFNEndCustomer WHERE mfr=? AND prod=? AND sch=? AND endcustomer_name =? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(mfr,prod,sch,end_customer.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      val count = models.Utils.getLongVal(rows(0), "count", CVDefaultLong)
      count == 0      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on end_customer exists check, end_customer: $end_customer, ex: " + ex)
        false
      }
    }
  }
  
  def isTwoAuthAtOrgLevel(org: String): Boolean = {
    try {
      val q = s"SELECT two_auth_enabled FROM $KsUMS.$CFNOrg WHERE mfr=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(org)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size > 0){
        val row = rows.head
        models.Utils.getBooleanVal(row, "two_auth_enabled", CVDefaultBool)
      } else {
        false
      }

    } catch {
      case ex: Exception =>
        log.error(s"Error thrown while fetching two_auth_enabled from org table for $org, ex: $ex")
        false
    }
  }

  def twoAuthTriggerDuration(mfr: String, prod: String, sch: String): Int = {
    try {
      val q = s"SELECT two_auth_trigger_duration FROM $KsUMS.$CFNOrg WHERE mfr=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size > 0){
        val row = rows.head
        models.Utils.getIntVal(row, "two_auth_trigger_duration", TfaOTPClock)
      } else {
        TfaOTPClock
      }

    } catch {
      case ex: Exception =>
        log.error(s"Error thrown while fetching two_auth_trigger_duration from org table for $mfr, ex: $ex")
        TfaOTPClock
    }
  }

  def getOrgRealm(mfr: String): Option[String] = {
    try {
      val q = s"SELECT realm FROM $KsUMS.$CFNOrg WHERE mfr=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(mfr)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size > 0){
        val row = rows.head
        log.debug(s"Entry of realm found in Org table for $mfr")
        Some(models.Utils.getStringVal(row, "realm", ""))
      } else {
        log.debug(s"No entry of realm found in Org table for $mfr")
        None
      }

    } catch {
      case ex: Exception =>
        log.error(s"Error thrown while fetching realm from org table for $mfr, ex: $ex")
        None
    }
  }
  
}