package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._

import constants._
import models.User._
import models.{UserWithPasswd}
import models.DS._

/**
 * Tests the Authentication and Authorization module
 * 
 */
class AASpec extends Specification {

  val urlRequiresAA = "/v1/admin/role/user/details/m1/p1/sch1"
  val urlRequiresOnlyAuthnetication = "/v1/admin/user/list"
  var fake: FakeApplication = _
  
  object AA {
    
    def init() {
      create(UserWithPasswd(models.User("support@m1", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m1", "support", "test", "test", "m1:p1:sch1", false, false, true)))
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm) VALUES ('support', true, {'test' : 'm1:p1:sch1', 'poc' : 'm1:p2:sch1'}, {'m1:p1:sch1' : 'f1:f2:f3:f4', 'm1:p2:sch1' : 'f1:f2:f3:'}, ['test', 'poc']) ;")
    }

    def cleanup() {
      delete("support@m1")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNRole WHERE name='support';")
    }

  }

  "AA Spec".title

  textFragment("Adding test users to the user column family")
  step{fake = FakeApplication()}
  step{Play.start(fake)}
  
  step {AA.init()}

  "AA" should {

    "redirect an unauthenticated user to login page" in {
        val response = route(FakeRequest(GET, urlRequiresOnlyAuthnetication)).get
        status(response) must equalTo(303)
    }

    "return a forbidden message to an authenticated but unauthorized user from the same mfr" in {
        val response = route(FakeRequest(GET, urlRequiresAA).withSession(SKUserId -> "joe@m1", SKUserOrg -> "m1", SKUserRole -> "unauth")).get
        status(response) must equalTo(403)
    }

    "return a forbidden message to an authenticated but unauthorized user from a different mfr" in {
        val response = route(FakeRequest(GET, urlRequiresAA).withSession(SKUserId -> "support@m1",SKUserOrg -> "m2",SKUserRole -> "support",SKUserDomains->"m2:p1:sch1",SKUserRealms->"test")).get
        status(response) must equalTo(403)
    }

    "return an OK message to an authenticated and authorized user" in {
        val response = route(FakeRequest(GET, urlRequiresAA).withSession(SKUserId -> "support@m1",SKUserOrg -> "m1",SKUserRole -> "support",SKUserDomains->"m1:p1:sch1",SKUserRealms->"test")).get
        status(response) must equalTo(200)
     } 

    "return an OK message to an admin from glassbeam" in {
        val response = route(FakeRequest(GET, urlRequiresAA).withSession(SKUserId -> "admin@glassbeam.com", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    "return the list of permissions we support" in {
      val permissions = models.Auth.feature
      permissions must equalTo(Map("dashboards" -> "Dashboards", "explorer" -> "Explorer", "rules_and_alerts" -> "Rules & Alerts", "workbench" -> "Workbench", "logvault" -> "Log Vault", "file_upload" -> "File Upload", "healthcheck" -> "Health Check", "apps" -> "Apps"))
      
    }
    
    "return the list of realms we support" in {
      val realms = models.Auth.realm
      realms must be equalTo(List("prod", "poc", "demo", "gbstudio_spl", "gbstudio_app", "dev"))
    }
    
    "return the productMps map" in {
      val prodMps = models.Auth.productMps
      prodMps must be equalTo(Map("1" -> "histor:histor:pod", "2" -> "hiwi:hiwi:pod", "3" -> "himed:himed:pod"))
    }
    
     "return true if the given user of glassbeam is authorized" in {
      val response = models.Auth.authorizedGBUser("glassbeam", "admin")
      response must equalTo(true)
    }
     
    "return false if the given user has no admin rights for the given customer" in {
      val response = models.Auth.hasAuthorityOver("support@m2", "m1")
      response must equalTo(false)
      
    }
    
    "return true if the given user of glassbeam is authorized" in {
      val response = models.Auth.authorizedForOrg("m1", "m1", "test", "test", "m1:p1:sch1")
      response must be equalTo(true)
    }
    
    "return prodMps from config " in {
      val res = models.Auth.prodMps
      res should be equalTo(Map("1" -> "histor:histor:pod", "2" -> "hiwi:hiwi:podui", "3" -> "himed:himed:pod"))
    }
    
  }

  textFragment("Removing test users from user column family")
  
  step {
    AA.cleanup
  }

  step{Play.stop}
  
}