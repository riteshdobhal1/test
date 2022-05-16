package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._

import constants._
import models.DS._
import models.Domain
import models.Role._
/**
 * Tests the Role module
 * 
 */

class RoleSpec extends Specification {

  var fake: FakeApplication = _
  
  object RoleAnalyst {  
    def init() {
      // initialize the role table
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm) VALUES ('admin', true, {'prod' : 'm1:p1:sch1', 'poc' : 'm1:p2:sch1'}, {'m1:p1:sch1' : 'f1:f2:f3:f4', 'm1:p2:sch1' : 'f1:f2:f3:'}, ['prod', 'poc']) ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUser (email, role, created_on) VALUES ('role@gb.com', 'admin', '2016-01-01T00:00:00Z')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRealm (name, is_url, ui_url) VALUES ('prod', 'prodis', 'produi')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRealm (name, is_url, ui_url) VALUES ('poc', 'pocis', 'pocui')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm, sso_idp_id, sso_login_url, sso_logout_url) VALUES ('m1', 'p1', 'sch1', 'm1', 'prod', 't1', 't2', 't3') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm, sso_idp_id, sso_login_url, sso_logout_url) VALUES ('m1', 'p2', 'sch1', 'm1', 'poc', 't1', 't2', 't3') ;")
 
    }
      
    def cleanup() {
      cqlExecute(s"TRUNCATE $KsUMS.$CFNMpseSSO")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='role@gb.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNRole WHERE name='admin'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNRealm WHERE name='poc'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNRealm WHERE name='prod'")
    }  
  }
  
  "Role Spec".title
  
  textFragment("Initalizing Role column family") 
  step {fake = FakeApplication()}
  step {Play.start(fake)}
  step {RoleAnalyst.init()}

  "RoleAnalyst" should { 
    
    "return user details" in  {
        val response = userDetails("m1", "p1", "sch1", "role@gb.com", "admin")
        val res = response.get
        res must be equalTo(models.AllUserDetail(List(models.UserDetails("role@gb.com","NA","NA","NA","admin","NA",false,"NA",false,"NA",false,"Fri Jan 01 05:30:00 IST 2016",false,"NA","NA","NA",false,"NA")),models.RoleDetails("admin",true,Map("poc" -> "m1:p2:sch1", "prod" -> "m1:p1:sch1"),Map("m1:p1:sch1" -> "f1:f2:f3:f4", "m1:p2:sch1" -> "f1:f2:f3:"),Map("prod" -> "prodis", "poc" -> "pocis"),Map("prod" -> "produi", "poc" -> "pocui"),Map("m1:p2:sch1" -> "pocui", "m1:p1:sch1" -> "produi"),Map("m1:p2:sch1" -> "pocis", "m1:p1:sch1" -> "prodis"))))
    }
    
    "return domain info" in {
      val response = domainInfo("m1", "p1", "sch1")
      response must be equalTo(List(models.Domain("m1", "p1", "sch1", "m1", "prod", "t2", "t3", Map(), "t1")))
    }
    
    "return feature list for a role" in {
      val response = featureList("admin")
      response must be equalTo(Map("m1:p1:sch1" -> "f1:f2:f3:f4", "m1:p2:sch1" -> "f1:f2:f3:"))
    }
    
    "return feature list for a org" in {
      val response = featureListByOrg("admin", "m1", "p1", "sch1")
      response must be equalTo(List("f1","f2","f3","f4"))
    }
    
    "return all roles" in {
      val response = allRoles()
      response must be equalTo(List(models.RoleDetails("admin",true,Map("poc" -> "m1:p2:sch1", "prod" -> "m1:p1:sch1"),Map("m1:p1:sch1" -> "f1:f2:f3:f4", "m1:p2:sch1" -> "f1:f2:f3:"),Map("prod" -> "prodis", "poc" -> "pocis"),Map("prod" -> "produi", "poc" -> "pocui"),Map("m1:p2:sch1" -> "pocui", "m1:p1:sch1" -> "produi"),Map("m1:p2:sch1" -> "pocis", "m1:p1:sch1" -> "prodis"))))
    }
    
    "return role names only" in {
      val response = roles()
      response must be equalTo(Set("admin"))
    }
    
    "return mps from domain" in {
      val response = getMPSFromDomain()
      response must be equalTo(Map("mfr" -> Set("m1"), "prod" -> Set("p1", "p2"), "sch" -> Set("sch1")))
    }

    "create a role" in  {
        val response = create(models.Role("support", false, "dev", "m2", "p2", "sch1", List("dev"), Set("f2", "f3")))
        response must beNone
    }
    
    "delete a role" in  {
        val response = deleteRole("support")
        response must beNone
    }
    
  }
  
  textFragment("Emptying role column family")                 
  
  step {
    RoleAnalyst.cleanup 
  }
  
  step {Play.stop}
  
}