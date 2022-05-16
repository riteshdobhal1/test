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
import dao.DBUtils
import play.api.libs.json.{Json, Writes}
import play.api.mvc.Cookie

import scala.concurrent.Await
import scala.util.{Failure, Success, Try}

case class Role(name: String, is_super: Boolean, domain:String, mfr:String, prod:String, sch:String, realm: List[String], features: Set[String])

object Role {                                            
  val log = Logger("Model_Role")

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
      val domains = models.Role.roleDetails(role).get
      val realm_mps = models.Role.realmMps(domains.domains.values.toList).get
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
      val user = models.Role.userInfo(role, userid)
      val roleDetails = RoleDetails(domains.name, domains.is_super, domains.domains, domains.features, domains.realm_isdomain, domains.realm_uidomain, mps_uidomain, mps_isdomain, realm_appsversion,domains.realm,domains.studio_proj_limit)
      val (max_users, max_licensed_users, max_creator_licenses, max_viewer_licenses) = models.Org.usersLimit(mfr)
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
      val result = DS.cqlExecute(s"SELECT  first_name, end_customer, org, last_name, def_passwd, department, sso,wb_user_name, report_usage, created_on, active, city, state, country, is_external, mps_def, show_info,events_export_limit, dashboard_admin FROM $KsUMS.$CFNUser where email = '$lowerEmail' ;")
      val rows = result.asScala.toList
      (for {
        row <- rows
      } yield {
        val org = models.Utils.getStringVal(row, "org", CVDefaultStr)
        val mfrDetailsRows = DS.cqlExecute(s"SELECT type FROM $KsUMS.$CFNOrg WHERE mfr='$org' LIMIT 1;").asScala.toList
        val typ = if(mfrDetailsRows.size > 0) models.Utils.getIntVal(mfrDetailsRows.head, "type", OrgTypeMfr) else OrgTypeMfr
        UserDetails(email, models.Utils.getStringVal(row, "first_name", CVDefaultStr),models.Utils.getStringVal(row, "end_customer", CVDefaultStr), org, role,
          models.Utils.getStringVal(row, "last_name", CVDefaultStr), models.Utils.getBooleanVal(row, "def_passwd", CVDefaultBool), models.Utils.getStringVal(row, "department",
            CVDefaultStr), models.Utils.getBooleanVal(row, "sso", CVDefaultBool), models.Utils.getStringVal(row, "wb_user_name", CVDefaultStr), models.Utils.getBooleanVal(row, "report_usage", CVDefaultBool),
          models.Utils.getDateVal(row, "created_on", CVDefaultDate).toString(), models.Utils.getBooleanVal(row, "active", CVDefaultBool), models.Utils.getStringVal(row, "city", CVDefaultStr),
          models.Utils.getStringVal(row, "state", CVDefaultStr), models.Utils.getStringVal(row, "country", CVDefaultStr), models.Utils.getBooleanVal(row, "is_external", CVDefaultBool), models.Utils.getStringVal(row, "mps_def", CVDefaultStr), typ, models.Utils.getBooleanVal(row, "show_info", CVDefaultBool),models.Utils.getIntVal(row, "events_export_limit", CVDefaultInt),models.Utils.getBooleanVal(row, "dashboard_admin", CVDefaultBool))
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
      val result = DS.cqlExecute(s"SELECT name, super, domains, permissions, realm, max_limit_proj FROM $KsUMS.$CFNRole where name='$role';")
      val rows = result.asScala.toList
      if(rows.nonEmpty){
        val is_super = models.Utils.getBooleanVal(rows(0), "super", CVDefaultBool)
        val domains = rows(0).getMap("domains", classOf[String], classOf[String])
        val realm_mps = realmMps(domains.values.toList).get
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
        val permissions = rows(0).getMap("permissions", classOf[String], classOf[String])
        val realms = rows(0).getList("realm", classOf[String]).toList
        val realmIsMap = realms.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._1))
        val realmUiMap = realms.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._2))
        val maxProj = rows(0).getInt("max_limit_proj")
        Success(RoleDetails(role, is_super, domains.toMap, permissions.toMap, realmIsMap, realmUiMap, mps_uidomain, mps_isdomain, realm_appsversion, realms.toList,maxProj))
      } else {
        Success(RoleDetails("", false, Map(), Map(), Map(), Map(), Map(), Map(), Map(),List(),0))
      }
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
      val mpsIdx = m.split(":").toList
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='${mpsIdx(0)}' AND prod='${mpsIdx(1)}' AND sch='${mpsIdx(2)}';") 
      val rows = result.asScala.toList
      if(rows.nonEmpty) {
        val realm = rows(0).getString("realm") 
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
      val result = DS.cqlExecute(s"SELECT  ec, realm, sso_login_url, sso_logout_url, sso_roles, sso_idp_id FROM $KsUMS.$CFNMpseSSO where mfr='$mfr' AND prod='$prod' AND sch='$sch';")
      val rows = result.asScala.toList
      (for { 
        row <- rows 
      } yield {
        val ec = models.Utils.getStringVal(row, "ec", CVDefaultStr)
        val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)
        val sso_login_url = models.Utils.getStringVal(row, "sso_login_url", CVDefaultStr)
        val sso_logout_url = models.Utils.getStringVal(row, "sso_logout_url", CVDefaultStr)
        val sso_roles = row.getMap("sso_roles", classOf[String], classOf[String]).toMap
        val sso_idp_id = models.Utils.getStringVal(row, "sso_idp_id", CVDefaultStr)
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
      val result = DS.cqlExecute(s"SELECT name, permissions FROM $KsUMS.$CFNRole where name='$role';")
      val rows = result.asScala.toList
      if(rows.nonEmpty){
        val features = rows(0).getMap("permissions", classOf[String], classOf[String])
        features.toMap
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
      val mps = mfr +":" + prod + ":" + sch
      val result = DS.cqlExecute(s"SELECT name, permissions FROM $KsUMS.$CFNRole where name='$role';")
      val rows = result.asScala.toList
      if(rows.nonEmpty){
        val features = rows(0).getMap("permissions", classOf[String], classOf[String])
        features.getOrElse(mps, "").split(":").toList
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
      val result = DS.cqlExecute(s"SELECT name, domains, permissions, super, realm, max_limit_proj, two_auth_support FROM $KsUMS.$CFNRole;")
      val rows = result.asScala.toList
      (for { 
        row <- rows 
      } yield {
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val domain = row.getMap("domains", classOf[String],classOf[String])
        val realm_mps = models.Role.realmMps(domain.values.toList).get
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
        val permission = row.getMap("permissions", classOf[String],classOf[String])
        val user = models.Utils.getBooleanVal(row, "super", CVDefaultBool)
        val mps = domain.values.mkString(",")
        val realm = row.getList("realm", classOf[String]).toList
        val realmIsMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._1))
        val realmUiMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._2))
        val maxProj = row.getInt("max_limit_proj")
        val twoAuthSupportList = row.getList("two_auth_support", classOf[String]).toList
        RoleDetails(name,user, domain.toMap, permission.toMap, realmIsMap, realmUiMap, mps_uidomain, mps_isdomain, realm_appsversion,realm.toList,maxProj,twoAuthSupportList)
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


      val result = DS.cqlExecute(s"SELECT name, domains, permissions, super, realm, max_limit_proj, two_auth_support FROM $KsUMS.$CFNRole;")
      val rows = result.asScala.toList

      val resultGBRole = DS.cqlExecute(s"SELECT role FROM $KsUMS.$CFNUser WHERE org='$GBName' ALLOW FILTERING;")
      val rowsGBRole = resultGBRole.asScala.toList
      val gbRoles = (for {
        row <- rowsGBRole
      } yield {
        val role = models.Utils.getStringVal(row, "role", CVDefaultStr)
        role
      }).toList

      (for {
        row <- rows
        rolename = models.Utils.getStringVal(row, "name", CVDefaultStr)
        if(!(gbRoles.contains(rolename)))
      } yield {
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val domain = row.getMap("domains", classOf[String],classOf[String])
        val realm_mps = models.Role.realmMps(domain.values.toList).get
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
        val permission = row.getMap("permissions", classOf[String],classOf[String])
        val user = models.Utils.getBooleanVal(row, "super", CVDefaultBool)
        val realm = row.getList("realm", classOf[String]).toList
        val realmIsMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._1))
        val realmUiMap = realm.foldLeft(Map[String, String]())( (f, r) => f ++ Map(r -> getRealmUrl(r)._2))
        val maxProj = row.getInt("max_limit_proj")
        val twoAuthSupportList = row.getList("two_auth_support", classOf[String]).toList
        val mps = domain.values.toList
        val m = (for {mpsindex <- mps
                      }yield{
          mpsindex.split(":").head
        }).toList
        val munique = m.distinct.toList
        if(m.distinct.length == 1 && munique(0).equals(mfr))
          RoleDetails(name,user, domain.toMap, permission.toMap, realmIsMap, realmUiMap, mps_uidomain, mps_isdomain, realm_appsversion,realm.toList,maxProj,twoAuthSupportList)
        else
          RoleDetails("",false,Map(),Map(),Map(),Map(),Map(),Map(),Map(),List(),0,List())

      }).toList.filter(_.name != "")

    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }


  def getRoles(mfr:String,prod:String,sch:String):List[String] = {
    try {
      val result = DS.cqlExecute(s"SELECT name, domains, permissions FROM $KsUMS.$CFNRole;")
      val rows = result.asScala.toList
      
      val resultGBRole = DS.cqlExecute(s"SELECT role FROM $KsUMS.$CFNUser WHERE org='$GBName' ALLOW FILTERING;")
      val rowsGBRole = resultGBRole.asScala.toList
      val gbRoles = (for { 
        row <- rowsGBRole
        } yield {        
        val role = models.Utils.getStringVal(row, "role", CVDefaultStr)  
        role
      }).toList
      
      val mf = mfr+":"+prod+":"+sch
      (for { 
        row <- rows
        rolename = models.Utils.getStringVal(row, "name", CVDefaultStr)
        if(!(gbRoles.contains(rolename)))
      } yield {
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val domain = row.getMap("domains", classOf[String],classOf[String])   
        val permission = row.getMap("permissions", classOf[String],classOf[String])
        val mps = domain.values.toList
        val m = (for {mpsindex <- mps if !(permission(mpsindex).equals("healthcheck"))               
        }yield{
           mpsindex.split(":").head
        }).toList
        val munique = m.distinct.toList
        if(((m.distinct.length == 1 && munique(0).equals(mfr)) || (m.distinct.length ==2 && munique.contains("default"))) && mps.contains(mf))
          name
        else
          ""
      }).toList
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all roles, exception:  " + ex)
        List()
      }
    }
  }
  
  def getHealthCheckRoles(mfr:String,prod:String,sch:String,userId: String):List[String] = {
    try {

      val lowerEmail = userId.toLowerCase()
      val resultUser = DS.cqlExecute(s"SELECT is_external FROM $KsUMS.$CFNUser where email = '$lowerEmail' ;")
      val rowUser = resultUser.asScala.toList
      val isExternalUser = models.Utils.getBooleanVal(rowUser(0), "is_external", CVDefaultBool)
      val result = DS.cqlExecute(s"SELECT name, domains, permissions FROM $KsUMS.$CFNRole;")
      val rows = result.asScala.toList
      val mfps = mfr + ":" + prod + ":" + sch
      (for { 
        row <- rows 
      } yield {
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val domain = row.getMap("domains", classOf[String],classOf[String])   
        val permission = row.getMap("permissions", classOf[String],classOf[String])
        val mps = domain.values.toList
        if(isExternalUser) {
          val m = (for {mpsindex <- mps
                        } yield {
            permission(mpsindex)
          }).toList

          val mf = if (mps.length == 1) mps(0).split(":").toList else List()
          if (mps.length == 1 && mf(0).equals(mfr) && m.length == 1 && m(0).equals("healthcheck") && mps.contains(mfps))
            name
          else
            ""
        }else{
          val m = (for {mpsindex <- mps if (mpsindex.equals(mfps) && permission(mpsindex).contains("healthcheck"))
                        } yield {
            mpsindex
          }).toList
          if(m.length == 1) {
            name
          }else{
            ""
          }
        }
      }).toList
      
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
      val result = DS.cqlExecute(s"SELECT name FROM $KsUMS.$CFNRole;").asScala.toList
      (for {
        row <- result
      } yield {
        models.Utils.getStringVal(row, "name", CVDefaultStr)
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

  def create(r: Role): Option[String] = {
    try {
      val roleName = r.name.toLowerCase()
      val domains = r.domain
      val domainMap = Map(r.domain -> s"${r.mfr}:${r.prod}:${r.sch}")
      val permMap = Map(s"${r.mfr}:${r.prod}:${r.sch}" -> r.features.mkString(","))
      val isSuper = r.is_super
      val rows = try {
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='${r.mfr}' AND prod='${r.prod}' AND sch='${r.sch}';")
      result.asScala.toList
      }catch{
        
        case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
        }
      }  
      val row = rows(0)
      val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)
      val (is_existing, existingRealm) = exists(realm)
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

  def exists(name: String) : (Boolean, List[String]) = {
    val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNRole where name = ?")
    val bs = new BoundStatement(ps).bind(name)
    val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
    if(rows.size > 0) {
      (true, rows(0).getList("realm", classOf[String]).toList)
    } else {
      (false, List())
    }
  }
  
  def managerole(r: Role, mfr:String): Option[String] = {
    try {
      val roleName = r.mfr +  "_" + r.prod + "_" + r.sch + "_" + r.name.toLowerCase()
      val domains = r.domain
      val custDomainMap = Map(r.domain -> s"${r.mfr}:${r.prod}:${r.sch}")
      val custPermMap = Map(s"${r.mfr}:${r.prod}:${r.sch}" -> r.features.mkString(","))
      val isSuper = r.is_super
      val defPermMap = Map("default:default:default" -> DefPermMap) 
      val defDomainMap = Map("-" -> "default:default:default")
      val rows = try {
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='${r.mfr}' AND prod='${r.prod}' AND sch='${r.sch}';")
      result.asScala.toList
      }catch{
        
        case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
        }
      }  
      val row = rows(0)      
      val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)     
      
      val (is_existing, existingRealm) = exists(r.name.toLowerCase())
      val realms = (existingRealm :+ realm).distinct      
      val uniqueRealm = if(r.features contains FeatRnA) realms :+ r.mfr + "_stage" else realms
      
      val realmsList = if(! (r.features contains RealmStudioApp)) uniqueRealm else (uniqueRealm :+ RealmStudioApp).distinct
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

  def getMpseRealm(mfr: String, prod: String, sch: String): List[Row] = {
    try {
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='$mfr' AND prod='$prod' AND sch='$sch';")
      result.asScala.toList
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching realm for MPS, exception:  " + ex)
        List()
      }
    }
  }

  def bulkUpdateRoleProducts(rpf: BulkRoleProducts, mfr:String): Option[String] = {
    try {
      val roleName = rpf.roleName
      val isSuper = rpf.is_super
      val twoAuthEnabledAtMPSLevel = rpf.twoAuth.getOrElse(false)
      val twoAuthSupportList = rpf.two_auth_support.getOrElse(List())

      rpf.productFeatures.zipWithIndex foreach { case(pf, i) =>
        val domains = pf.product
        val mps = domains.split(":").toList
        val (mfr, prod, sch) = (mps(0), mps(1), mps(2))
        val custDomainMap = Map(pf.productName -> s"${pf.product}")
        val custPermMap = Map(s"${pf.product}" -> pf.features)
        val defDomainMap = Map("-" -> "default:default:default")
        val defPermMap = Map("default:default:default" -> DefPermMap)
        val rows = getMpseRealm(mfr, prod, sch)
        val row = rows(0)
        val realm = models.Utils.getStringVal(row, "realm", CVDefaultStr)
        val (is_existing, existingRealm) = exists(rpf.roleName.toLowerCase())
        val realms = (existingRealm :+ realm).distinct
        val uniqueRealm = if (pf.features contains FeatRnA) realms :+ mfr + "_stage" else realms
        val realmsList = if (!(pf.features contains RealmStudioApp)) uniqueRealm else (uniqueRealm :+ RealmStudioApp).distinct
        val permMap = if (pf.features.contains(RealmStudioApp)) custPermMap ++ defPermMap else custPermMap
        val domainMap = if (pf.features.contains(RealmStudioApp)) custDomainMap ++ defDomainMap else custDomainMap

        val query = if (is_existing) {
          val ps = DS.createPreparedStatement(s"SELECT email from $KsUMS.$CFNUserByOrg WHERE org = ? ;")
          val bs = new BoundStatement(ps).bind(mfr)
          val userRows = DS.cqlExecuteBoundStmnt(bs)
          val userEmail = for (row <- userRows) yield row.getString("email")
          val userSqlInQuery = userEmail.mkString("'", "','", "'")
          val ps1 = DS.createPreparedStatement(s"SELECT email,role from $KsUMS.$CFNUser WHERE email in (?);")
          val bs1 = new BoundStatement(ps1).bind(userSqlInQuery)
          val userRoles = DS.cqlExecuteBoundStmnt(bs1)
          val userFiltered = for (user <- userRoles if (user.getString("role") == roleName)) yield user.getString("email")
          for (email <- userFiltered) {
            if (pf.features.contains(FeatWorkBench)) {
              DS.cqlExecute(s"UPDATE $KsUMS.$CFNUser SET wb_user_name='${email.toLowerCase()}' WHERE email='${email.toLowerCase()}'")
            } else {
              DS.cqlExecute(s"UPDATE $KsUMS.$CFNUser SET wb_user_name='generic' WHERE email='${email.toLowerCase()}'")
            }
          }
          val roleQry = models.Utils.createRoleQry("UPDATE", i, twoAuthEnabledAtMPSLevel)
          roleQry
        } else {
          val roleQry = models.Utils.createRoleQry("INSERT", i, twoAuthEnabledAtMPSLevel)
          roleQry
        }
        val ps = DS.createPreparedStatement(query)
        val bs = if (is_existing){
          if(twoAuthEnabledAtMPSLevel)
            new BoundStatement(ps).bind(domainMap.asJava, permMap.asJava, realmsList.distinct.asJava, twoAuthSupportList.asJava, roleName.toLowerCase())
          else
            new BoundStatement(ps).bind(domainMap.asJava, permMap.asJava, realmsList.distinct.asJava, roleName.toLowerCase())
        }
        else{
          new BoundStatement(ps).bind(roleName.toLowerCase(), Boolean.box(isSuper), domainMap.asJava, permMap.asJava, realmsList.distinct.asJava, twoAuthSupportList.asJava)
        }
        DS.cqlExecuteBoundStmnt(bs)
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
      val ps = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNRole WHERE name = ? ;")
      val bs = new BoundStatement(ps).bind(roleName)
      DS.cqlExecuteBoundStmnt(bs)
      None
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
	  for(role <- roles){
      	val ps = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNRole WHERE name = ? ;")
      	val bs = new BoundStatement(ps).bind(role)
      	DS.cqlExecuteBoundStmnt(bs)
	  }
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a role, role: $roleName, exception: " + ex)
        Some("Failed to delete a role")
      }
    }
  }

  /**
    * deletes a product from a role
    * Only a GB admin can delete a role
    */
  def deleteRoleProduct(roleName: String, mfr: String, prod: String, sch: String): Option[String] = {
    try {
      val productName = s"$mfr:$prod:$sch"
      val roleRow = DS.cqlExecute(s"SELECT domains, permissions FROM $KsUMS.$CFNRole WHERE name = '$roleName' ;").asScala.toList
      if(roleRow.nonEmpty){
        val domains = roleRow(0).getMap("domains", classOf[String], classOf[String]).toMap
        val permissions = roleRow(0).getMap("permissions", classOf[String], classOf[String]).toMap
        val updatedDomains = domains.filterNot((k) => k._2 == productName)
        val updatedPermissions = permissions.filterNot((k) => k._1 == productName)
        val ps = DS.createPreparedStatement(s"Update $KsUMS.$CFNRole set domains = ?, permissions = ? where name = ?;")
        val bs =  new BoundStatement(ps).bind(updatedDomains.asJava, updatedPermissions.asJava, roleName)
        DS.cqlExecuteBoundStmnt(bs)
        None
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
    def addMps(m : Map[String, Set[String]], r: Row) = {
      val mfr = r.getString("mfr")
      val prod = r.getString("prod")
      val sch = r.getString("sch")
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
      val rows = DS.cqlExecute(s"SELECT mfr, prod, sch, ec from $KsUMS.$CFNMpseSSO ;").asScala.toList
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
      val realmRows = DS.cqlExecute(s"SELECT is_url, ui_url, apps_version FROM $KsUMS.$CFNRealm where name='$r';").asScala.toList
      if(realmRows.nonEmpty){
        (realmRows(0).getString("is_url"), realmRows(0).getString("ui_url"), realmRows(0).getString("apps_version"))
      } else {
        ("", "", "")
      }
    }

  def tableauUpdateRole(mfr: String, prod: String, sch: String, userRole: TableauUpdateRole, reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      val IS_Host = models.Utils.getISURLDomain(mfr, prod, sch)
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
      val IS_Host = models.Utils.getISURLDomain(mfr, prod, sch)
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
      val IS_Host = models.Utils.getISURLDomain(mfr, prod, sch)
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
      val result = DS.cqlExecute(s"SELECT two_auth_support FROM $KsUMS.$CFNRole where name='$role';")
      val rows = result.asScala.toList
      if(rows.size > 0){
        rows(0).getList("two_auth_support", classOf[String]).toList
      } else {
        List()
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching two_auth list from role table, exception:  " + ex)
        List()
      }
    }
  }

}

