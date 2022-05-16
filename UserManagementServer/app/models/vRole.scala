package models

import play.api.Play.current
import play.api.Logger
import com.datastax.driver.core.{BoundStatement, ResultSet, Row}
import com.datastax.driver.core.policies._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import constants._

import java.sql.Blob
import java.nio.ByteBuffer
import play.api.libs.ws.WS
import Utils._
import dao.DBUtils.getRuleIdsList
import play.api.libs.json.{Json, Writes}
import play.api.mvc.Cookie

import scala.concurrent.Await
import scala.util.{Failure, Success, Try}
import dao._
import models.RulesAlerts.refreshAECache


case class NewRole(name: String, is_super: Boolean, domain:String, mfr:String, prod:String, sch:String, realm: List[String], features: Set[String])
case class UserDetails(email: String, first_name: String,end_customer:String,org: String, role: String,last_name:String,def_passwd:Boolean,department:String,sso:Boolean, wb_user_name:String,report_usage:Boolean,created_on:String,active:Boolean,city:String,state:String,country:String, is_external: Boolean, mps_def: String, org_type: Int, show_info: Boolean,events_export_limit: Int,dashboard_admin:Boolean)
case class Domain(mfr: String, prod: String, sch: String, ec: String, realm: String, sso_login_url:String, sso_logout_url: String, sso_roles: Map[String, String], sso_idp_id: String)
case class RoleDetails(name:String, is_super: Boolean, domains:Map[String,String], features: Map[String, String], realm_isdomain: Map[String, String], realm_uidomain: Map[String, String], mps_uidomain: Map[String, String], mps_isdomain: Map[String, String], realm_appsversion: Map[String, String],realm:List[String],studio_proj_limit: Int,two_auth_support:List[String] = List(), explorer_date_range: Map[String, Int]= Map())
case class AllUserDetail(user:List[UserDetails], role_details: RoleDetails, max_users: Int, max_licensed_users: Int, max_creator_licenses: Int,max_viewer_licenses: Int)
case class MPS(mfr: List[String], prod: List[String], sch: List[String])
case class TableauUserRole(userName: String, roleType: String, mps: Option[String])
case class TableauUpdateRole(userName: Seq[String], roleType: String, mps: Option[String])
case class TableauDeleteUsers(users: Seq[String], mps: String)
case class ProductFeature(product: String, features: String, productName: String, explorer_date_range: Option[Int])
case class BulkRoleProducts(roleName: String, is_super: Boolean, twoAuth:Option[Boolean], two_auth_support:Option[Seq[String]], productFeatures: Seq[ProductFeature])

object vRole {
  val log = Logger("Model_vRole")

  implicit val TableauUserRoleWrites = new Writes[TableauUserRole] {
    def writes(c: TableauUserRole) = {
      Json.obj(
        "userName" -> Json.toJson(c.userName),
        "roleType" -> Json.toJson(c.roleType),
        "mps" -> Json.toJson(c.mps)
      )
    }
  }

  implicit val TableauUpdateRoleWrites = new Writes[TableauUpdateRole] {
    def writes(c: TableauUpdateRole) = {
      Json.obj(
        "userName" -> Json.toJson(c.userName),
        "roleType" -> Json.toJson(c.roleType),
        "mps" -> Json.toJson(c.mps)
      )
    }
  }

  implicit val TableauDeleteUsersWrites = new Writes[TableauDeleteUsers] {
    def writes(c: TableauDeleteUsers) = {
      Json.obj(
        "users" -> Json.toJson(c.users),
        "mps" -> Json.toJson(c.mps)
      )
    }
  }

  /**
    * Returns User,Domain and Feature details
    *
    */
  def userDetails(mfr: String, prod: String, sch: String, userid: String, role: String): Try[AllUserDetail] = {
    try {
      val rows = vertica.role.getSingleRoleRowsMpsUrlData(role)
      val roleDetails = DBUtils.roleRowAccData(rows)(role.toLowerCase())
      val user = models.vRole.userInfo(role, userid)
      val (max_users, max_licensed_users, max_creator_licenses,max_viewer_licenses) = models.vOrg.usersLimit(mfr)
      Success(AllUserDetail(user, roleDetails, max_users, max_licensed_users, max_creator_licenses,max_viewer_licenses))
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all info for User, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /**
    * Returns all user details for a role
    */
  def userInfo(role: String, email: String): List[UserDetails] = {
    try {
      val lowerEmail = email.toLowerCase()
      val rows = vertica.user.selectUserRoleRow(lowerEmail, STR_STR)
      (for {
        row <- rows
      } yield {
        val org = models.Utils.getDBStringVal(row, vertica.user.Col_org)
        val mfrDetailsRows = vertica.org.selectRows(org)
        val typ = if(mfrDetailsRows.size > 0) models.Utils.getDBIntVal(mfrDetailsRows.head, vertica.org.Col_type, OrgTypeMfr) else OrgTypeMfr
        UserDetails(email, models.Utils.getDBStringVal(row, vertica.user.Col_first_name),models.Utils.getDBStringVal(row, vertica.user.Col_end_customer), org, role,
          models.Utils.getDBStringVal(row, vertica.user.Col_last_name), models.Utils.getDBBooleanVal(row, vertica.user.Col_def_passwd), models.Utils.getDBStringVal(row, vertica.user.Col_department), models.Utils.getDBBooleanVal(row, vertica.user.Col_sso), models.Utils.getDBStringVal(row, vertica.user.Col_wb_user_name), models.Utils.getDBBooleanVal(row, vertica.user.Col_report_usage),
          models.Utils.getDBDateVal(row, vertica.user.Col_created_on, CVDefaultDate).toString(), vertica.user.UserStateStringToBooleanMapping(models.Utils.getDBStringVal(row, vertica.user.Col_active)), models.Utils.getDBStringVal(row, vertica.user.Col_city),
          models.Utils.getDBStringVal(row, vertica.user.Col_state), models.Utils.getDBStringVal(row, vertica.user.Col_country), models.Utils.getDBBooleanVal(row, vertica.user.Col_is_external), models.Utils.getDBStringVal(row, vertica.user.Col_mps_def), typ, models.Utils.getDBBooleanVal(row, vertica.user.Col_show_info),models.Utils.getDBIntVal(row, vertica.user.Col_events_export_limit), models.Utils.getDBBooleanVal(row, vertica.user.Col_dashboard_admin))
      }).toList

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all domains, exception:  " + ex)
        List()
      }
    }
  }


  /** Returns  domains list  for a role
    *
    */
  def roleDetails(role:String): Try[RoleDetails] = {
    try {
      val rows = vertica.role.getSingleRoleRowsMpsUrlData(role)
      val roleDetails = DBUtils.roleRowAccData(rows)(role.toLowerCase())
      Success(roleDetails)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all domains, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Forms a map of mps vs realms
    *
    */
  def realmMps(mps: List[String]): Try[Map[String, List[String]]] = {
    def getRealmMps(m: String): Map[String, List[String]] = {
      val mpsIdx = m.split("/").toList
      val rows = vertica.sso_details.selectRealm(m)
      if(rows.nonEmpty) {
        val realm = models.Utils.getDBStringVal(rows.head, vertica.sso_details.Col_realm)
        val realmUrl = getRealmUrl(realm)
        Map(m -> List(realmUrl._2, realmUrl._1, realmUrl._3))
      } else {
        Map()
      }
    }
    try {
      val realmMps = mps.foldLeft(Map[String, List[String]]())( (f, m) => f ++ getRealmMps(m))
      Success(realmMps)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all mps-realm map, exception:  " + ex)
        Failure(ex)
      }
    }
  }
  /** Returns all domains details for a role
    *
    */
  def domainInfo(mfr: String, prod: String, sch: String): List[Domain] = {
    try {
      val rows = vertica.sso_details.selectRows(s"$mfr/$prod/$sch")
      (for {
        row <- rows
      } yield {
        val ec = mfr
        val realm = models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm)
        val sso_login_url = models.Utils.getDBStringVal(row, vertica.sso_details.Col_sso_login_url)
        val sso_logout_url = models.Utils.getDBStringVal(row, vertica.sso_details.Col_sso_logout_url)
        val sso_roles = models.Utils.getDBStringVal(row, "sso_roles", CVDefaultStr).asInstanceOf[Map[String, String]]
        val sso_idp_id = models.Utils.getDBStringVal(row, vertica.sso_details.Col_sso_idp_id)
        Domain(mfr, prod, sch, ec, realm, sso_login_url, sso_logout_url, sso_roles, sso_idp_id)
      }).toList

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all domains, exception:  " + ex)
        List()
      }
    }
  }

  /** Returns all features for a role
    *
    */
  def featureList(role:String): Map[String, String] = {
    try {
      val rows = DBUtils.getRoleRowData(role)
      if(rows.nonEmpty){
        val features = rows.head("permissions").asInstanceOf[Map[String, String]]
        features
      } else {
        Map()
      }

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all domains, exception:  " + ex)
        Map()
      }
    }
  }

  def featureListByOrg(role: String, mfr: String, prod: String, sch: String): List[String] = {
    try {
      val mps = mfr +"/" + prod + "/" + sch
      val rows = DBUtils.getRoleRowData(role)
      if(rows.nonEmpty){
        val features = rows.head("permissions").asInstanceOf[Map[String, String]]
        features.getOrElse(mps, "").split("/").toList
      } else {
        List()
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all domains, exception:  " + ex)
        List()
      }
    }
  }
  /** Returns all roles
    *
    */

  def allRoles(): List[RoleDetails] = {
    try {
      val rows = DBUtils.getAllRowsData()
      (for {
        row <- rows
      } yield {
        val name = row("name").asInstanceOf[String]
        val domain = row("domains").asInstanceOf[Map[String, String]]
        val realm_mps = models.vRole.realmMps(domain.values.toList).get
        val mps_uidomain = (for {m <- realm_mps
        } yield {
          (m._1 -> m._2(0))
        }).toMap
        val mps_isdomain = (for {m <- realm_mps
        } yield {
          (m._1 -> m._2(1))
        }).toMap
        val realm_appsversion = (for {m <- realm_mps
        } yield {
          (m._1 -> m._2(2))
        }).toMap
        val permission = row("permissions").asInstanceOf[Map[String, String]]
        val user = row("super").asInstanceOf[Boolean]
        val mps = domain.values.mkString(",")
        val realm = row("realm").asInstanceOf[List[String]]
        val realmIsMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._1))
        val realmUiMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._2))
        val maxProj = row("max_limit_proj").asInstanceOf[Int]
        val twoAuthSupportList = row("two_auth_support").asInstanceOf[List[String]]
        RoleDetails(name,user, domain, permission, realmIsMap, realmUiMap, mps_uidomain, mps_isdomain, realm_appsversion,realm,maxProj,twoAuthSupportList)
      }).toList

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }

  def allRolesMfr(mfr:String): List[RoleDetails] = {
    try {
      val rows = vertica.role.getMfrRoleRowsData(mfr)
      val res = DBUtils.roleRowAccData(rows)
      res.values.toList
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }

  def getRoles(mfr:String,prod:String,sch:String):List[String] = {
    try {
      val rows = vertica.role.getMfrFeaturesRoleRowsData(mfr, List("healthcheck"), EXCLUDE_TEXT)
      (for {
        row <- rows
        name = models.Utils.getDBStringVal(row, vertica.role.Col_role_name,"")
        if(!name.equals(""))
      } yield {
        name
      }).distinct
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }

  def getHealthCheckRoles(mfr: String, prod: String, sch: String, userId: String): List[String] = {
    try {
      val rows = vertica.role.getMfrFeaturesRoleRowsData(mfr, List("healthcheck"), INCLUDE_TEXT)
      (for {
        row <- rows
        name = models.Utils.getDBStringVal(row, vertica.role.Col_role_name,"")
        if(!name.equals(""))
      } yield {
        name
      }).distinct
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }

  /** Returns only the role name
    *
    */

  def roles(): Set[String] = {
    try {
      val result = vertica.role.selectRows()
      (for {
        row <- result
      } yield {
        models.Utils.getDBStringVal(row, vertica.role.Col_role_name)
      }).toSet
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all role names, exception: " + ex)
        Set()
      }
    }
  }
  /** inserts a new entry for an organization in database
    *
    */

  def create(r: NewRole): Option[String] = {
    try {
      val roleName = r.name.toLowerCase()
      val domains = r.domain
      val domainMap = Map(r.domain -> s"${r.mfr}:${r.prod}:${r.sch}")
      val permMap = Map(s"${r.mfr}:${r.prod}:${r.sch}" -> r.features.mkString(","))
      val isSuper = r.is_super
      val rows = vertica.sso_details.selectRealm(s"${r.mfr}:${r.prod}:${r.sch}")
      val row = rows.head
      val realm = models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm)
      val (is_existing, existingRealm) = DBUtils.roleRealms(realm)
      val uniqueRealm = (existingRealm ++ realm).distinct
      val query = if (is_existing) {
        s"UPDATE $KsUMS.$CFNRole set domains = domains + ?, permissions = permissions + ?, realm = ? where name = ?;"
      } else {
        s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm) VALUES (?, ?, ?, ?, ?);"
      }
      val ps = DS.createPreparedStatement(query)
      val bs = if (is_existing)
        new BoundStatement(ps).bind(domainMap.asJava, permMap.asJava, uniqueRealm.asJava,roleName)
      else
        new BoundStatement(ps).bind(roleName, Boolean.box(isSuper), domainMap.asJava, permMap.asJava, realm.toList.asJava)

      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new role, role: ${r.name}, exception: " + ex)
        Some("Failed to create new role")
      }
    }
  }

  def managerole(r: NewRole, mfr:String): Option[String] = {
    try {
      val roleName = r.mfr +  "_" + r.prod + "_" + r.sch + "_" + r.name.toLowerCase()
      val domains = r.domain
      val custDomainMap = Map(r.domain -> s"${r.mfr}:${r.prod}:${r.sch}")
      val custPermMap = Map(s"${r.mfr}:${r.prod}:${r.sch}" -> r.features.mkString(","))
      val isSuper = r.is_super
      val defPermMap = Map("default:default:default" -> DefPermMap)
      val defDomainMap = Map("-" -> "default:default:default")
      val rows = vertica.sso_details.selectRealm(s"${r.mfr}:${r.prod}:${r.sch}")
      val row = rows.head
      val realm = models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm)

      val (is_existing, existingRealm) = DBUtils.roleRealms(r.name.toLowerCase())
      val realms = (existingRealm :+ realm).distinct
      //val uniqueRealm = if(r.features contains FeatRnA) realms :+ r.mfr + "_stage" else realms
       
      val realmsList = if(! (r.features contains RealmStudioApp)) realms else (realms :+ RealmStudioApp).distinct
      val permMap = if(r.features.contains(RealmStudioApp)) custPermMap ++ defPermMap else custPermMap
      val domainMap = if(r.features.contains(RealmStudioApp)) custDomainMap ++ defDomainMap else custDomainMap
      val query = if (is_existing) {
        val ps = DS.createPreparedStatement(s"SELECT email from $KsUMS.$CFNUserByOrg WHERE org = ? ;")
        val bs = new BoundStatement(ps).bind(mfr)
        val userRows = DS.cqlExecuteBoundStmnt(bs)
        val userEmail = for (row  <- userRows) yield row.getString("email")
        val userSqlInQuery = userEmail.mkString("'","','","'")
        val ps1 = DS.createPreparedStatement(s"SELECT email,role from $KsUMS.$CFNUser WHERE email in (?);")
        val bs1 = new BoundStatement(ps1).bind(userSqlInQuery)
        val userRoles = DS.cqlExecuteBoundStmnt(bs1)
        val userFiltered = for (user <- userRoles if(user.getString("role") == roleName)) yield user.getString("email")
        for(email <- userFiltered){
          if(r.features.contains(FeatWorkBench)){

            DS.cqlExecute(s"UPDATE $KsUMS.$CFNUser SET wb_user_name='${email.toLowerCase()}' WHERE email='${email.toLowerCase()}'")

          }else{

            DS.cqlExecute(s"UPDATE $KsUMS.$CFNUser SET wb_user_name='generic' WHERE email='${email.toLowerCase()}'")

          }
        }
        s"UPDATE $KsUMS.$CFNRole set domains = domains + ?, permissions = permissions + ?, realm = ? where name = ?;"

      } else {

        s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm) VALUES (?, ?, ?, ?, ?);"
      }
      val ps = DS.createPreparedStatement(query)
      val bs = if (is_existing)
        new BoundStatement(ps).bind(domainMap.asJava, permMap.asJava, realmsList.distinct.asJava,r.name.toLowerCase())
      else
        new BoundStatement(ps).bind(roleName, Boolean.box(isSuper), domainMap.asJava, permMap.asJava, realmsList.distinct.asJava)

      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new role, role: ${r.name}, exception: " + ex)
        Some("Failed to create new role")
      }
    }
  }

  def bulkUpdateRoleProducts(rpf: BulkRoleProducts, mfr:String, userId: String, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val roleName = rpf.roleName.toLowerCase()
      val isSuper = rpf.is_super
      val twoAuthEnabledAtMPSLevel = rpf.twoAuth.getOrElse(false)
      val twoAuthSupportList = rpf.two_auth_support.getOrElse(List())
      val orgMfrRows = vertica.org.selectOrgId(mfr)
      val mfr_id = if(orgMfrRows.size > 0) models.Utils.getDBIntVal(orgMfrRows.head, vertica.org.Col_mfr_id) else 0
      val payloadMPSes = rpf.productFeatures.toList.map(x => x.product)
      val is_existing = DBUtils.roleRealms(rpf.roleName)._1
      val (removedMPSes, dbMPSes) = if(is_existing) DBUtils.getRemovedRoleMpsList(roleName, payloadMPSes) else (List(), List())
      val usersList = DBUtils.getRoleUsersList(roleName)
      val retainedMPSes = (dbMPSes intersect payloadMPSes).distinct
      val roleRows = if(is_existing) DBUtils.getRoleRowData(roleName) else List()
      val retainedRulesMPSes = if(roleRows.nonEmpty){
        val row = roleRows.head
        val permissions = row("permissions").asInstanceOf[Map[String, String]]
        val rulesMPS = retainedMPSes.foldLeft(List[String]()){(acc, dbMPS) =>
          if(permissions.contains(dbMPS)){
            val features = permissions(dbMPS).split(",").toList
            if(features.contains(FeatRnA)){
              acc ++ List(dbMPS)
            } else acc
          } else acc
        }
        rulesMPS
      } else List()
      rpf.productFeatures.zipWithIndex foreach { case(pf, i) =>
        val domains = pf.product
        val mps = domains.split("/").toList
        val (mfr, prod, sch) = (mps(0), mps(1), mps(2))
        val custDomainMap = Map(pf.productName -> s"${pf.product}")
        val custPermMap = Map(s"${pf.product}" -> pf.features)
        val custExplorerMap: Map[String, Int] = if (pf.features.contains(FeatExplorer)) {
          pf.explorer_date_range match{
            case Some(x) => Map(s"${pf.product}" -> x)
            case _ => Map(s"${pf.product}" -> EXP_DEF_DATE_RANGE)
          }
        } else Map()
        val defDomainMap = Map("-" -> "default/default/default")
        val defPermMap = Map("default/default/default" -> DefPermMap)
        val rows = vertica.sso_details.selectRealm(s"${mps(0)}/${mps(1)}/${mps(2)}")
        val row = rows.head
        val realm = models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm)
        val (is_available_role_iter, existingRealm) = DBUtils.roleRealms(rpf.roleName)
        val realms = (existingRealm :+ realm).distinct
        //val uniqueRealm = if (pf.features contains FeatRnA) realms :+ mfr + "_stage" else realms
        val realmsList = if (!(pf.features contains RealmStudioApp)) realms else (realms :+ RealmStudioApp).distinct
        val permMap = if (pf.features.contains(RealmStudioApp)) custPermMap ++ defPermMap else custPermMap
        val domainMap = if (pf.features.contains(RealmStudioApp)) custDomainMap ++ defDomainMap else custDomainMap
        log.debug(s"realm name list: $realmsList")
        val realmsIds = vertica.realm.selectRealmNames(realmsList)
        log.debug(s"realm id list: $realmsIds")
        is_available_role_iter match {
          case true =>
            val userRoles = vertica.user.selectAllRows()
            val userFiltered = (for{
              user <- userRoles
              rId = models.Utils.getDBLongVal(user, vertica.user.Col_role_id)
              roleRows = vertica.role.selectRowId(rId)
              if roleRows.size > 0
              if models.Utils.getDBStringVal(roleRows.head, vertica.role.Col_role_name) == roleName
            } yield {
              models.Utils.getDBStringVal(user, vertica.user.Col_email)
            }).toList
            for (email <- userFiltered) {
              if (pf.features.contains(FeatWorkBench)) {
                vertica.user.updateUserFields(email, email.toLowerCase())
              } else {
                vertica.user.updateUserFields(email, "generic")
              }
            }
            if(i == 0) {
              twoAuthEnabledAtMPSLevel match {
                case true => vertica.role.updateRow(roleName, isSuper, twoAuthSupportList.toList)
                case _ => vertica.role.updateRoleFields(roleName, isSuper)
              }
              val roleRows = vertica.role.getRoleId(roleName)
              val role_id = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
              vertica.role_realms.deleteRows(List(role_id))
              realmsIds.foreach(realm_id => {
                if(!realm_id.equals(""))
                  vertica.role_realms.insertRow(realm_id.toLong, role_id)
              })
            }
            DBUtils.updateIncrementalRoleFeatures(None, roleName, domainMap, permMap, i, custExplorerMap)
          case _ =>
            vertica.role.insertRow(roleName, isSuper, twoAuthSupportList.toList, mfr_id)
            val roleRows = vertica.role.getRoleId(roleName)
            val role_id = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
            realmsIds.foreach(realm_id => {
              if(!realm_id.equals(""))
                vertica.role_realms.insertRow(realm_id.toLong, role_id)
            })
            log.debug(s"waiting for new role to be added in role table...")
            DBUtils.updatedRoleRowData(None, roleName, domainMap, permMap, custExplorerMap)
        }
      }
      if(is_existing){
        if(retainedRulesMPSes.size > 0){
          val pf = rpf.productFeatures.toList.filter(x => x.features.split(",").toList.contains(FeatRnA))
          val payloadRulesMPSes = pf.map(x => x.product)
          val rmRetainedRulesMPSes = (retainedRulesMPSes diff payloadRulesMPSes).distinct
          if(usersList.size > 0){
            rmRetainedRulesMPSes.foreach({mps =>
              DBUtils.deleteFARefreshCache(mps, usersList, reqSessionOpt)
            })
          }
        }
        if(usersList.size > 0){
          if(removedMPSes.size > 0){
            DBUtils.removeH2Subscribers(usersList, removedMPSes, reqSessionOpt)
          }
          removedMPSes.foreach({mps =>
            DBUtils.deleteFARefreshCache(mps, usersList, reqSessionOpt)
          })
        }
      }
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating product and features to a role: ${rpf.roleName}, exception: " + ex)
          Some(s"Failed to update products to the role : ${rpf.roleName}")
      }
    }
  }

  /**
    * deletes a Role from database
    * Only a GB admin can delete a role
    */
  def deleteRole(roleName: String): Option[String] = {
    try {
      val roleRows = vertica.role.selectRow(roleName)
      val roleId = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
      val roleIdAsList = List(roleId)
      vertica.role_realms.deleteRows(roleIdAsList)
      vertica.role_mps_feature_attributes.deleteRows(roleIdAsList, None)
      val res = vertica.role_mps_features.deleteRows(roleIdAsList)
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete product(s) for a role")
        case _ => {
          val resDel = vertica.role.deleteRowId(roleId)
          resDel match {
            case Some(SQL_ERROR) => Some("Failed to delete a role")
            case _ => None
          }
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a role, role: $roleName, exception: " + ex)
        Some("Failed to delete a role")
      }
    }
  }

  /**
    * deletes multiple roles from database
    * Only cutomer admin can delete roles from admin panel
    */
  def deleteRoles(roleName: String): Option[String] = {
    try {
      val roles = roleName.split(",").toList
      val roleRows = vertica.role.selectRoleIds(roles)
      val roleIds = (for{
        row <- roleRows
      } yield{
        models.Utils.getDBLongVal(row, "role_id")
      })
      vertica.role_realms.deleteRows(roleIds)
      val res = vertica.role_mps_features.deleteRows(roleIds)
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete product(s) for a role")
        case _ => {
          val resDel = vertica.role.deleteRows(roles)
          resDel match {
            case Some(SQL_ERROR) => Some("Failed to delete role(s)")
            case _ => None
          }
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a role, role: $roleName, exception: " + ex)
        Some("Failed to delete a role(s)")
      }
    }
  }

  /**
    * deletes a product from a role
    * Only a GB admin can delete a role
    */
  def deleteRoleProduct(roleName: String, mfr: String, prod: String, sch: String, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      log.debug(s"deleteRoleProduct called ...")
      val productName = s"$mfr/$prod/$sch"
      val roleRow = DBUtils.getRoleRowData(roleName)
      val usersList = DBUtils.getRoleUsersList(roleName)
      log.debug(s"role_users : $usersList")
      if(roleRow.nonEmpty){
        val domains = roleRow(0)("domains").asInstanceOf[Map[String, String]]
        val permissions = roleRow(0)("permissions").asInstanceOf[Map[String, String]]
        val updatedDomains = domains.filterNot((k) => k._2 == productName)
        val updatedPermissions = permissions.filterNot((k) => k._1 == productName)
        if(usersList.size > 0){
          val removedMPSes = List(productName)
          if(removedMPSes.size > 0){
            DBUtils.removeH2Subscribers(usersList, removedMPSes, reqSessionOpt)
          }
          removedMPSes.foreach({mps =>
            DBUtils.deleteFARefreshCache(mps, usersList, reqSessionOpt)
          })
        }
        DBUtils.updatedRoleRowData(Some(productName), roleName, updatedDomains, updatedPermissions, Map(s"$productName" -> EXP_DEF_DATE_RANGE))
      } else {
        Some(s"There is no entry for this role : $roleName")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a role, role: $roleName, exception: " + ex)
        Some("Failed to delete a role")
      }
    }
  }

  def getMPSFromDomain() : Map[String, Set[String]]= {
    def addMps(m : Map[String, Set[String]], r: Map[String, Option[Any]]) = {
      val mpsStr = models.Utils.getDBStringVal(r, vertica.sso_details.Col_mps)
      val mps = mpsStr.split("/").toList
      val mfr = mps(0)
      val prod = mps(1)
      val sch = mps(2)
      val mfrList = m.get("mfr") match {
        case None =>
          Map("mfr" -> Set(mfr))
        case Some(a) =>
          Map("mfr" -> (Set(mfr) ++ a))
      }

      val prodList = m.get("prod") match {
        case None =>
          Map("prod" -> Set(prod))
        case Some(a) =>
          Map("prod" -> (Set(prod) ++ a))
      }

      val schList = m.get("sch") match {
        case None =>
          Map("sch" -> Set(sch))
        case Some(a) =>
          Map("sch" -> (Set(sch) ++ a))
      }
      schList ++ prodList ++ mfrList
    }
    try {
      val rows = vertica.sso_details.selectAllRows()
      val mps = Map[String, Set[String]]()
      val mpsList = rows.foldLeft(mps)((m, r) => m ++ addMps(m, r))
      mpsList
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while getting list of mps from domain CF, exception: " + ex)
        Map()
      }
    }
  }

  def getRealmUrl(r: String): (String, String, String) = {
    vertica.realm.selectRealmUrl(r)
  }

  def tableauUpdateRole(mfr: String, prod: String, sch: String, userRole: TableauUpdateRole, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val IS_Host = models.Utils.vGetISURLDomain(mfr, prod, sch)
      val isUrl = s"$IS_Host/tableau/tableauUpdateRole/$mfr/$prod/$sch"
      val reqSession = reqSessionOpt.get
      val data = Json.toJson(userRole)
      val futureResponse = WS.url(isUrl).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).post(data).map { response =>
        response.statusText match {
          case "OK" =>
            log.debug(s"\n response success : $response")
            val msg = (response.json \ "Msg").get.as[String]
            ("Success", msg)
          case _ =>
            log.debug(s"\n response failure : $response")
            log.error(s"Failed to update site user in Tableau Server from IS")
            throw new RuntimeException(s"Exception while trying to update site user in Tableau Server from IS")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      if(wsResponse._1 == "Success") None else Some("Failed to update site user in Tableau Server from IS")
    } catch {
      case ex: Exception => {
        log.error(s"Exception while trying to update site user in Tableau Server: $ex")
        Some("Failed to update site user in Tableau Server")
      }
    }
  }

  def tableauAddUpdateUsers(mfr: String, prod: String, sch: String, userRole: Seq[TableauUserRole], reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val IS_Host = models.Utils.vGetISURLDomain(mfr, prod, sch)
      val isUrl = s"$IS_Host/tableau/tableauAddUpdateUsers/$mfr/$prod/$sch"
      val reqSession = reqSessionOpt.get
      val data = Json.toJson(userRole)
      val futureResponse = WS.url(isUrl).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).post(data).map { response =>
        response.statusText match {
          case "OK" =>
            log.debug(s"\n response success : $response")
            val msg = (response.json \ "Msg").get.as[String]
            ("Success", msg)
          case _ =>
            log.debug(s"\n response failure : $response")
            log.error(s"Exception while trying to add/update site user in Tableau Server from IS")
            throw new RuntimeException(s"Failed to add/update site user in Tableau Server from IS")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      if(wsResponse._1 == "Success") None else Some("Failed to add/update site user in Tableau Server from IS")
    } catch {
      case ex: Exception => {
        log.error(s"Exception while trying to add/update site user in Tableau Server")
        Some("Failed to add/update site user in Tableau Server")
      }
    }
  }

  def tableauDeleteUsers(mfr: String, prod: String, sch: String, userList: Seq[TableauDeleteUsers], reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val IS_Host = models.Utils.vGetISURLDomain(mfr, prod, sch)
      val isUrl = s"$IS_Host/tableau/tableauDeleteUsers/$mfr/$prod/$sch"
      val reqSession = reqSessionOpt.get
      val data = Json.toJson(userList)
      val futureResponse = WS.url(isUrl).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).post(data).map { response =>
        response.statusText match {
          case "OK" =>
            log.debug(s"\n response success : $response")
            val msg = (response.json \ "Msg").get.as[String]
            ("Success", msg)
          case _ =>
            log.debug(s"\n response failure : $response")
            log.error(s"Exception while trying to delete site user(s) in Tableau Server from IS")
            throw new RuntimeException(s"Failed to delete site user(s) in Tableau Server from IS")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      if(wsResponse._1 == "Success") None else Some("Failed to add/update site user in Tableau Server from IS")
    } catch {
      case ex: Exception => {
        log.error(s"Exception while trying to delete site user(s) in Tableau Server")
        Some("Failed to delete site user(s) in Tableau Server")
      }
    }
  }

  def twoAuthList(mfr: String, prod: String, sch: String, role: String): List[String] = {
    try {
      DBUtils.getTwoAuthSupportList(role)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching two_auth list from role table, exception:  " + ex)
        List()
      }
    }
  }

  def isTableauConfigured(version: String, mfr: String, prod: String, sch: String, reqSessionOpt: Option[Cookie]): Try[(Boolean, String)] = {
    try {
      val IS_Host = models.Utils.vGetISURLDomain(mfr, prod, sch)
      val isUrl = s"$IS_Host/tableau/configured/$mfr/$prod/$sch"
      val reqSession = reqSessionOpt.get
      val futureResponse = WS.url(isUrl).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).get().map { response =>
        response.statusText match {
          case "OK" =>
            log.debug(s"\n response success : $response")
            val isConfigured = (response.json \ "Data").get.as[Boolean]
            val msg = (response.json \ "Msg").get.as[String]
            ("Success", isConfigured, msg)
          case _ =>
            log.debug(s"\n response failure : $response")
            log.error(s"Exception while trying to fetch tableau config from IS")
            throw new RuntimeException(s"Failed to fetch tableau config from IS")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      if(wsResponse._1 == "Success") Success((wsResponse._2, wsResponse._3)) else throw new RuntimeException("Failed to fetch tableau config from IS")
    } catch {
      case ex: Exception => {
        log.error(s"Exception while trying to fetch tableau config")
        Failure(ex)
      }
    }
  }

}

