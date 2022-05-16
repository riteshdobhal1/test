package models

import play.api._
import play.api.mvc._
import constants._

import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

/**
 * Provides authorization features
 */
object Auth {
  
  val log = Logger("Model_Auth")

  lazy val authDisbaled = Play.current.configuration.getBoolean("aa.disabled").getOrElse(false)
  lazy val productMpsMap = Play.current.configuration.getObject("product.mps")
  lazy val urlDef = Play.current.configuration.getString("campaign.url_def").getOrElse("apps/dist/index.html")
  lazy val ReqProtocol = Play.current.configuration.getString("request.protocol").getOrElse("http")
  lazy val GBHomeRedirectUrl = Play.current.configuration.getString("gb.home.url").getOrElse("http://www.glassbeam.com")
  lazy val LoginPageUrl = Play.current.configuration.getString("login.redirect.url").getOrElse("http://login.glassbeam.com")
  lazy val RedirectErrorPage = Play.current.configuration.getString("redirect.error.page").getOrElse("http://www.glassbeam.com")
  lazy val ExpirationInDays = Play.current.configuration.getInt("trial.expiryDays").getOrElse(30)
  lazy val ssoMPS = Play.current.configuration.getConfig("sso.mps").getOrElse(
    throw new RuntimeException("sso.mps for sso customers needs to configured under application.conf"))

  lazy val ssoUserDetails = Play.current.configuration.getConfig("sso.user_details").getOrElse(
    throw new RuntimeException("sso.user_details for sso customers needs to configured under application.conf"))

  lazy val ssoOldDomain = Play.current.configuration.getConfig("sso.old_domain").getOrElse(
    throw new RuntimeException("sso.old_domain for sso customers to support old links needs configured under application.conf"))

  val prodMps: Map[String, Any] = productMpsMap match {
    case Some(ks) => ks.unwrapped().toMap
    case None => productMps
  }
  /** Returns true if the user is a glassbeam user and his role is either
   *  glassbeam_super or admin
   */
  def authorizedGBUser(userOrg: String, role: String): Boolean = {
    (userOrg == GBName) && (role == GBAdmin)
  }

  /** Returns true if the user has authority over a customer mfr
   *  
   */
  def hasAuthorityOver(userid: String, cname: String, version: String = constants.CASSANDRA_VERSION): Boolean = User.byEmail(userid) map { u =>
    version match {
      case constants.CASSANDRA_VERSION => (u.org == GBName && (u.role == GBSuper || u.role == URAdmin)) || (vOrg.mfrAndCustomers(u.org) contains (cname))
      case constants.VERTICA_VERSION => (u.org == GBName && (u.role == GBSuper || u.role == URAdmin)) || (Org.mfrAndCustomers(u.org) contains (cname))
    }
  } getOrElse(false)
  
  /** Returns true if the user is authorized to view mfr
   *  
   */
  def authorizedForOrg(version: String, mfr: String, userOrg: String, userRole: String, userRealms: String): Boolean = {
    version match {
      case constants.VERTICA_VERSION =>
        val row = models.vRole.roleDetails(userRole)
        val listMps = row.get.domains.values.toList
        var isAuthorizedForOrg = true
        for(mps <- listMps){
          val m = models.Utils.getAuthMPSTupple(version, mps).head
          if(m.equals(mfr) || isAuthorizedForOrg) {isAuthorizedForOrg = true} else {isAuthorizedForOrg = false}
        }
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || isAuthorizedForOrg

      case constants.CASSANDRA_VERSION =>
        val row = models.Role.roleDetails(userRole)
        val listMps = row.get.domains.values.toList
        var isAuthorizedForOrg = true
        for(mps <- listMps){
          val m = models.Utils.getAuthMPSTupple(version, mps).head
          if(m.equals(mfr) || isAuthorizedForOrg) {isAuthorizedForOrg = true} else {isAuthorizedForOrg = false}
        }
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || isAuthorizedForOrg
    }
  }
  /**
   * Returns true if the user is a glassbeam user or else if the user (role) is authorized 
   * for the mps and the realm
   */
  
  def authorized_user(version: String, mfr: String, prod: String, sch: String, userOrg: String, userRole: String, userRealms: String): Boolean = {
    version match {
      case constants.VERTICA_VERSION =>
        val mps = models.Utils.getAuthMPSName(version, mfr, prod, sch)
        val row = models.vRole.roleDetails(userRole)
        val listMPS = row.get.domains.values.toList
        val listRealms = userRealms.split(",").toList
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || listMPS.contains(mps)

      case constants.CASSANDRA_VERSION =>
        val mps = models.Utils.getAuthMPSName(version, mfr, prod, sch)
        val row = models.Role.roleDetails(userRole)
        val listMPS = row.get.domains.values.toList
        val listRealms = userRealms.split(",").toList
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || listMPS.contains(mps)
    }
  }

  def authorizedAdminForOrg(version: String, mfr: String, userOrg: String, userRole: String, userRealms: String): Boolean = {
    version match {
      case constants.VERTICA_VERSION =>
        val row = models.vRole.roleDetails(userRole)
        val listMps = row.get.domains.values.toList
        var isAuthorizedForOrg = false
        for (mps <- listMps) {
          val mpsList = models.Utils.getAuthMPSTupple(version, mps)
          val adminRole = mpsList(0) + "_" + mpsList(1) + "_" + mpsList(2)+ "_admin"
          if ((mpsList(0).equals(mfr) && userRole.equals(adminRole)) || isAuthorizedForOrg) { isAuthorizedForOrg = true } else { isAuthorizedForOrg = false }
        }
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || isAuthorizedForOrg

      case constants.CASSANDRA_VERSION =>
        val row = models.Role.roleDetails(userRole)
        val listMps = row.get.domains.values.toList
        var isAuthorizedForOrg = false
        for (mps <- listMps) {
          val mpsList = models.Utils.getAuthMPSTupple(version, mps)
          val adminRole = mpsList(0) + "_" + mpsList(1) + "_" + mpsList(2)+ "_admin"
          if ((mpsList(0).equals(mfr) && userRole.equals(adminRole)) || isAuthorizedForOrg) { isAuthorizedForOrg = true } else { isAuthorizedForOrg = false }
        }
        ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || isAuthorizedForOrg
    }
  }
  
  def adminForOrg(version: String, mfr: String, userOrg: String, userRole: String, userRealms: String): Boolean = {
    
    val row = version match {
      case constants.VERTICA_VERSION => models.vRole.roleDetails(userRole)
      case constants.CASSANDRA_VERSION => models.Role.roleDetails(userRole)
    }

    val domains = row.get.domains
    val features = row.get.features    
    var isAuthorizedForOrg = false
    for ( (k,v) <- domains){
      val mps = models.Utils.getAuthMPSTupple(version, v)
         if(mps(0).equals(mfr)){
            if(features(v).contains("admin")){
              isAuthorizedForOrg = true
            }
         }
     }
    ((userRole == GBSuper || userRole == URAdmin) && userOrg == GBName) || isAuthorizedForOrg
  }
  def adminSuper(usr: String, userOrg: String, userRole: String): Boolean = {
    
    (usr== GBUser && userRole == GBAdmin && userOrg == GBName)    
      
  }  
    /** Returns all the permissions we support
   *
   */
  def feature: Map[String,String] = Map (FeatExplorer -> "Explorer", FeatApps -> "Apps", FeatWorkBench -> "Workbench", FeatHealthCheck -> "Health Check", 
      FeatDashboards -> "Dashboards", FeatRnA -> "Rules & Alerts", FeatLogVault -> "Log Vault", FeatFileUpload -> "File Upload")
  /** Returns all the realms
   *  
   */
  def realm: List[String] = List(RealmProd, RealmPoc, RealmDemo, RealmStudioSpl, RealmStudioApp, RealmDev)   
  
  def productMps: Map[String, String] = Map(DemoStor -> "histor:histor:pod", DemoWireless -> "hiwi:hiwi:pod", DemoMedical -> "himed:himed:pod")
}



