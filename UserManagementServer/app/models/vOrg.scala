package models

import scala.language.postfixOps
import scala.collection.JavaConversions._
import play.api.Logger
import com.datastax.driver.core.{BoundStatement, ResultSet, Row}
import com.datastax.driver.core.policies._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}
import java.util.Date
import constants._
import org.joda.time._
import play.api.libs.json._
import models.Utils._
import dao._
import play.api.mvc.Cookie


case class CustDomain(prod: String, sch: String, ec: String, realm: String, sso_login_url: String, sso_logout_url: String, sso_roles: String, sso_idp_id: String)
case class Cust(mfr: String, desc: String, t: Int, domain:CustDomain)
case class NewOrg(mfr: String, name: String, max_licensed_users: Int, max_users: Int, t: Int,email_template_header: String,email_template_body: String,email_template_footer: String,email_template_subject: String,email_template_link: String,email_template_link_expiry: String)
case class Logo(logo: String, logo_url: String)
case class MfrRealm(mfr: String, prod: String, sch: String, ec: String, realm: String, sso_login_url: String, sso_logout_url: String, sso_roles: String, sso_idp_id: String)
case class MfrDefaultFeature(mfr: String,prod: String,sch: String,ec: String,active: Boolean,default_feature_internal: String,default_feature_external: String, nsr_enabled: Boolean, logo: String, logo_url: String)
case class UIConf(mfr: String, prod: String, sch: String, allowed_extension: String, compound_rows: Int, core_delimiter: String, default_days: Int,
                  default_exp_view: String, iv_display_fields: String, exp_display_fields: String, facet_limit: Int, is_stage_domain: String, is_stage_keyspace: String,
                  json_form: String, max_day_range: Int, max_upload_size: Int, lv_to_exp: Boolean)

case class MPSConf(mfr: String, prod: String, sch: String)
case class EndCustomer(endcustomer_name: String, serial_number: List[String], created_by: String, updated_on: String, group_name: List[String] = List())
case class EndCustomerMfr(mfr: String, prod: String, sch: String, endcustomer_name: String, serial_number: List[String], created_by: String, updated_on: String, group_name: List[String])
case class NewCustDomain(prod: String, sch: String, ec: String, active: Boolean, logo: String, logo_url: String, def_feature_internal: String, def_feature_external: String,
                      feature_label : List[String],nsr_enabled: Boolean, sso_login_url: String, sso_logout_url: String, sso_roles: String, sso_idp_id: String, logo_internal: String)

case class MultiEcMultiMPS(endcustomer_name: Seq[String], mps: String)

object vOrg {

  val log = Logger("Model_vOrg")

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
      val res = vertica.org.selectOrgName(OrgTypeMfr)
      val rows = res.toIndexedSeq
      for {
        row <- rows
      } yield {
        models.Utils.getDBStringVal(row, vertica.org.Col_name)
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
      val res = vertica.org.selectAllOrgName()
      val rows = res.toIndexedSeq
      for {
        row <- rows
      } yield {
        models.Utils.getDBStringVal(row, vertica.org.Col_name)
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
        vertica.sso_details.selectAllRows().toIndexedSeq
      } else {
        vertica.sso_details.selectRows(mfr.toLowerCase()).toIndexedSeq
      }
      for {
        row <- rows
      } yield {
        (models.Utils.getDBStringVal(row, vertica.sso_details.Col_mps), models.Utils.getDBStringVal(row, "prod"), models.Utils.getDBStringVal(row, "sch", CVDefaultStr), models.Utils.getDBStringVal(row, "ec", CVDefaultStr), models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm))
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
      val rows = vertica.org.selectAllRows().toIndexedSeq
      val orgs = for {
        row <- rows
      } yield {
        models.Utils.getDBStringVal(row, vertica.org.Col_name)
      }
      removeDuplicates(orgs.toList).toIndexedSeq
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown on all customers lookup, ex: " + ex)
        IndexedSeq()
      }
    }
  }

  def allmfr(): List[NewOrg] = {

    try {
      val result = DS.cqlExecute(s"SELECT mfr,name,max_licensed_users,max_users,type,email_template_header,email_template_body,email_template_footer,email_template_subject,email_template_link,email_template_link_expiry FROM $KsUMS.$CFNOrg;")
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
        NewOrg(mfr, name, max_licensed_users, max_users, t,email_template_header,email_template_footer,email_template_body,email_template_subject,email_template_link,email_template_link_expiry)
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
  def getOrgDetails(org: String): List[NewOrg] = {

    try {
      val rows = vertica.org.selectRows(org)
      (for {row <- rows}
        yield{
          val mfr = models.Utils.getDBStringVal(row, vertica.org.Col_name, CVDefaultStr)
          val name = models.Utils.getDBStringVal(row, vertica.org.Col_name, CVDefaultStr)
          val max_licensed_users = models.Utils.getDBIntVal(row, vertica.org.Col_max_licensed_users)
          val max_users = models.Utils.getDBIntVal(row, vertica.org.Col_max_users)
          val t = models.Utils.getDBIntVal(row, vertica.org.Col_type)
          val email_template_header = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_header, CVDefaultStr)
          val email_template_footer = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_footer, CVDefaultStr)
          val email_template_body = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_body, CVDefaultStr)
          val email_template_subject = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_subject, CVDefaultStr)
          val email_template_link = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_link, CVDefaultStr)
          val email_template_link_expiry = models.Utils.getDBStringVal(row, vertica.org.Col_email_template_link_expiry, CVDefaultStr)

          NewOrg(mfr, name, max_licensed_users, max_users, t,email_template_header,email_template_body,email_template_footer,email_template_subject,email_template_link,email_template_link_expiry)
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
      models.vOrg.all toIndexedSeq
    } else {
      val cust = models.vOrg.customers(org)
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
  def createMfr(mfr: NewOrg): Option[String] = {
    def create(o: NewOrg): Option[String] = {
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
  def getMpseInfo(mfr: String, prod: String, sch: String, ec: String): NewCustDomain = {
    try {
      val rows = vertica.sso_details.selectRows(s"$mfr/$prod/$sch")
      if(rows.nonEmpty) {
        val mpseInf = rows.head
        val loginUrl = models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_sso_login_url)
        val logoutUrl = models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_sso_logout_url)
        val idpId = models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_sso_idp_id)
        val feature_label = models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_feature_label, "").split(",").toList
        NewCustDomain(prod, sch, ec, models.Utils.getDBBooleanVal(mpseInf, vertica.sso_details.Col_active), models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_logo), models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_logo_url), models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_default_feature_internal),
          models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_default_feature_external),feature_label, models.Utils.getDBBooleanVal(mpseInf, vertica.sso_details.Col_nsr_enabled), loginUrl, logoutUrl, "", idpId, models.Utils.getDBStringVal(mpseInf, vertica.sso_details.Col_logo_internal))
      }  else
        NewCustDomain("", "", "", false, "", "", "", "", List(), false, "", "", "", "", "")
    } catch {
      case ex: Exception => log.error(s"Exception thrown while reading mpse_sso for $mfr, exception " + ex)
        NewCustDomain("", "", "", false, "", "", "", "", List(), false, "", "", "", "", "")
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
      val rows = vertica.org.selectRows(mfr)
      if(rows.size > 0){
        val row = rows.head
        (models.Utils.getDBIntVal(row, vertica.org.Col_max_users), models.Utils.getDBIntVal(row, vertica.org.Col_max_licensed_users), models.Utils.getDBIntVal(row, vertica.org.Col_max_creator_licenses),models.Utils.getDBIntVal(row, vertica.org.Col_max_viewer_licenses))
      } else {
        (0,0,0,0)
      }

    } catch {
      case ex: Exception =>
        log.error(s"Error while getting max users and max licensed users for $mfr, ex: $ex")
        (0, 0, 0, 0)
    }
  }

  def ecHealthCheck(mfr: String, prod: String, sch: String, user: Option[String], fnCallSrcOpt: Option[String]): List[EndCustomer] = {
    try{
      val ecMfrList = ecHealthCheckMfr(mfr, user, fnCallSrcOpt)
      (for {
        ecMfr <- ecMfrList
        if ecMfr.mfr.equals(mfr) && ecMfr.prod.equals(prod) && ecMfr.sch.equals(sch)
      } yield {
        EndCustomer(ecMfr.endcustomer_name, ecMfr.serial_number, ecMfr.created_by, ecMfr.updated_on, ecMfr.group_name)
      })
    } catch {
      case ex: Exception =>
        log.error(s"Exception during getting end customer details from end_customer cf for $mfr, $prod, $sch, ex: $ex")
        List()

    }

  }

  def ecHealthCheckMfr(mfr: String, user: Option[String], fnCallSrcOpt: Option[String]): List[EndCustomerMfr] = {
    try{
      val fnCallSrc = fnCallSrcOpt match {
        case Some(s) => FN_CALL_SOURCE_ADMIN_CONSOLE
        case None => FN_CALL_SOURCE_DASHBOARD
      }
      user match {
        case Some(u) =>
          val rows = vertica.end_customer.getEcRowsData(List(u), true)
          val res = DBUtils.ecRowAccData(rows, mfr, u, fnCallSrc, true, false)
          res.values.toList
        case None =>
          val rows = vertica.end_customer.getEcRowsData(List())
          val res = DBUtils.ecRowAccData(rows, mfr, "", fnCallSrc,false, true)
          res.values.toList
      }
    } catch {
      case ex: Exception =>
        log.error(s"Exception during getting end customer details from end_customer cf for $mfr ex: $ex")
        List()
    }
  }


  def ecHealthCheckAdd(mfr: String, prod: String, sch: String, user:String, endcustomer:String, serial_number:String, group_name_opt: Option[String]): Option[String] = {
    try {
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val serial_number_list = serial_number.split(",").toList
      val group_name = group_name_opt.getOrElse("")
      val group_name_list = group_name.split(",").toList
      val res = vertica.end_customer.insertRow(mfr, prod, sch, endcustomer, user, ts)
      res match {
        case Some(SQL_ERROR) => Some("Failed to add Group")
        case _ =>
          val ec_rows = vertica.end_customer.selectEndCustomerRows(mfr, prod, sch, endcustomer)
          if(ec_rows.size > 0) {
            val ec_id = models.Utils.getDBLongVal(ec_rows.head, vertica.end_customer.Col_endcustomer_id)
            val payload_ec_srls_name = serial_number_list.distinct
            payload_ec_srls_name.foreach(sr_number => {
              if(!sr_number.equals(""))
                vertica.end_customer_serials.insertRow(sr_number, ec_id)
            })
            val ec_ids_rows = vertica.end_customer.selectEcIds(group_name_list)
            val ecIdList = for(row <- ec_ids_rows) yield models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
            ecIdList.foreach(grp_id => {
              if(!grp_id.equals(CVDefaultLong))
                vertica.end_customer_group.insertRow(grp_id, ec_id)
            })
          }
          None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to add $CFNEndCustomer table for end customer: ${endcustomer}, ex: $ex")
        Some("Failed to add end customer")
      }
    }

  }

  def ecHealthCheckUpdate(mfr: String, prod: String, sch: String, user:String, endcustomer:String, serial_number:String, group_name_opt: Option[String], reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      log.debug(s"Payload data : user: {$user}, endcustomer: {$endcustomer}, serial_numbers: {$serial_number}, group_name: {$group_name_opt}")
      val dateTime = DateTime.now
      val ts = new DateTime(dateTime, DateTimeZone.UTC).getMillis()
      val serial_number_list = serial_number.split(",").toList
      val group_name = group_name_opt.getOrElse("")
      val group_name_list = group_name.split(",").toList
      val res = vertica.end_customer.updateRow(mfr, prod, sch, endcustomer, user, ts)
      res match {
        case Some(SQL_ERROR) => Some("Failed to update end customer.")
        case _ =>
          val ec_rows = vertica.end_customer.selectEndCustomerRows(mfr, prod, sch, endcustomer)
          if(ec_rows.size > 0) {
            val ec_id = models.Utils.getDBLongVal(ec_rows.head, vertica.end_customer.Col_endcustomer_id)
            if(serial_number_list.size > 0) {
              val payload_ec_srls_name = serial_number_list.distinct
              val db_ec_srls_rows = vertica.end_customer_serials.selectEndCustomerSerialsRows(List(ec_id))
              val db_ec_srls_name = for (row <- db_ec_srls_rows) yield models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number, "")
              val delete_ec_srls_name = (db_ec_srls_name diff payload_ec_srls_name).distinct
              val add_ec_srls_name = (payload_ec_srls_name diff db_ec_srls_name).distinct
              if(delete_ec_srls_name.size > 0) {
                log.debug(s"Serial numbers to be deleted : {$delete_ec_srls_name}")
                vertica.end_customer_serials.deleteSerialNumberRows(delete_ec_srls_name, List(ec_id))
              }
              log.debug(s"Serial numbers to be added : {$add_ec_srls_name}")
              add_ec_srls_name.foreach(sr_number => {
                if (!sr_number.equals(""))
                  vertica.end_customer_serials.insertRow(sr_number, ec_id)
              })
            }
            if(group_name_list.size > 0) {
              val db_ec_grps_rows = vertica.end_customer_group.selectEndCustomerSubGroupsRows(List(ec_id))
              val db_ec_grps_ids = for (row <- db_ec_grps_rows) yield models.Utils.getDBLongVal(row, vertica.end_customer_group.Col_sub_group_id)
              val payload_ec_grps_rows = vertica.end_customer.selectEcIds(group_name_list)
              val payload_ec_grps_ids = for (row <- payload_ec_grps_rows) yield models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
              val delete_ec_grps_ids = (db_ec_grps_ids diff payload_ec_grps_ids).distinct
              val add_ec_grps_ids = (payload_ec_grps_ids diff db_ec_grps_ids).distinct
              if(delete_ec_grps_ids.size > 0){
                log.debug(s"Groups to be deleted : {$delete_ec_grps_ids}")
                vertica.end_customer_group.deleteGroupSubGroupRows(delete_ec_grps_ids, ec_id)
              }
              log.debug(s"Groups to be added : {$add_ec_grps_ids}")
              add_ec_grps_ids.foreach(grp_id => {
                if (!grp_id.equals(CVDefaultLong))
                  vertica.end_customer_group.insertRow(grp_id, ec_id)
              })
            }
            DBUtils.deleteAlertFilterAttributesRows(mfr, prod, sch, s"$mfr/$prod/$sch", Some(List(endcustomer)), None, None, reqSessionOpt)
          }
          None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to update $CFNEndCustomer table for end customer: ${endcustomer}, ex: $ex")
        Some("Failed to update end customer.")
      }
    }
  }

  def ecHealthCheckDeleteMultiple(mfr: String, prod: String, sch: String, ec:Seq[String], reqSessionOpt: Option[Cookie]): String = {
    try {
      val rows = vertica.user.selectMfrUsersECs(mfr)
      val userEc = for {
        row <- rows
        if models.Utils.getDBStringVal(row, vertica.user.Col_end_customer, "") != ""
      } yield models.Utils.getDBStringVal(row, vertica.user.Col_end_customer)

      val ecList = ec.toList
      val ecNoUser = ecList diff userEc
      if(ecNoUser.nonEmpty){
        val ec_ids_rows = vertica.end_customer.selectEcIds(ecNoUser)
        val ecIdList = for(row <- ec_ids_rows) yield models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
        val res = vertica.end_customer.deleteRows(mfr, prod, sch, ecNoUser)
        res match {
          case Some(SQL_ERROR) => ""
          case _ =>
            if(ecIdList.size > 0) {
              vertica.end_customer_serials.deleteRows(ecIdList)
              vertica.end_customer_group.deleteRows(ecIdList)
              vertica.end_customer_group.deleteSubGroupRows(ecIdList)
            }
            DBUtils.deleteAlertFilterAttributesRows(mfr, prod, sch, s"$mfr/$prod/$sch", Some(ecNoUser), None, None, reqSessionOpt)
            "Group(s) " + ecNoUser.mkString(", ") + " deleted successfully"
        }
      }else{
        "Group(s) associated with users, so cannot be deleted"
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to DELETE $CFNEndCustomer table for end customer: $ec, ex: $ex")
        ""
      }
    }
  }

  def ecHealthCheckDeleteMFr(multiEcMultiMPSes: Seq[MultiEcMultiMPS], reqSessionOpt: Option[Cookie]): String = {
    try {
      var ecListMsg = List[String]()
      var ecAssociatedUsersMsg = List[MultiEcMultiMPS]()
      multiEcMultiMPSes.foreach(multiEcMultiMPS => {
        val mpsList = multiEcMultiMPS.mps.split("/").toList
        val mfr = mpsList(0)
        val prod = mpsList(1)
        val sch = mpsList(2)
        val ec = multiEcMultiMPS.endcustomer_name
        val rows = vertica.user.selectMfrUsersECs(mfr)
        val userEc = for {
          row <- rows
          if models.Utils.getDBStringVal(row, vertica.user.Col_end_customer, "") != ""
        } yield models.Utils.getDBStringVal(row, vertica.user.Col_end_customer)

        val ecList = ec.toList
        val ecNoUser = ecList diff userEc
        if(ecNoUser.nonEmpty){
          val ec_ids_rows = vertica.end_customer.selectEcIds(ecNoUser)
          val ecIdList = for(row <- ec_ids_rows) yield models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
          val res = vertica.end_customer.deleteRows(mfr, prod, sch, ecNoUser)
          res match {
            case Some(SQL_ERROR) => ""
            case _ =>
              if(ecIdList.size > 0) {
                vertica.end_customer_serials.deleteRows(ecIdList)
                vertica.end_customer_group.deleteRows(ecIdList)
                vertica.end_customer_group.deleteSubGroupRows(ecIdList)
              }
              DBUtils.deleteAlertFilterAttributesRows(mfr, prod, sch, s"$mfr/$prod/$sch", Some(ecNoUser), None, None, reqSessionOpt)
              ecListMsg = ecListMsg ++ ecNoUser
          }
        }else{
          ecAssociatedUsersMsg = ecAssociatedUsersMsg ++ List(MultiEcMultiMPS(ec, multiEcMultiMPS.mps))
        }
      })
      if(ecListMsg.size > 0) "Group(s) " + ecListMsg.mkString(", ") + " deleted successfully"
      else "Group(s) associated with users, so cannot be deleted"
    } catch {
      case ex: Exception => {
        log.error(s"Failed to DELETE $CFNEndCustomer table for end customers : ex: $ex")
        ""
      }
    }
  }



  /** Returns false if a user exists with the given email address
    *
    */
  def notExistsEndCustomer(mfr:String, prod:String, sch:String, end_customer: String): Boolean = {
    try {
      val count = vertica.end_customer.getRowsCount(mfr, prod, sch, end_customer)
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
      val rows = vertica.org.selectRows(org)
      if(rows.size > 0){
        val row = rows.head
        models.Utils.getDBBooleanVal(row, vertica.org.Col_Two_Auth_Enabled)
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
      val rows = vertica.org.selectRows(mfr)
      if(rows.size > 0){
        val row = rows.head
        models.Utils.getDBIntVal(row, vertica.org.Col_Two_Auth_Trigger_Duration, TfaOTPClock)
      } else {
        TfaOTPClock
      }
    } catch {
      case ex: Exception =>
        log.error(s"Error thrown while fetching two_auth_trigger_duration from org table for $mfr, ex: $ex")
        TfaOTPClock
    }
  }

}
