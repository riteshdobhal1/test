package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._
import constants._
import models.DS._
import models.Org._
import models.{UserWithPasswd}
import models.Org
/**
 * Tests the Role module
 * 
 */

case class CustDomain(prod: String, sch: String, ec: String, realm: String, sso_login_url: String, sso_logout_url: String, sso_roles: String, sso_idp_id: String)

class OrgSpec extends Specification {
  var fake: FakeApplication = _
  object OrgAnalyst {  
    def init() {
      
      
      
      // initialize the org table
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES ('m1', 'm1', 'test1', 1) ;") 
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES ('m2', 'm2', 'test2', 1) ;") 
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES ('glassbeam', 'm1', 'test1', 10) ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES ('glassbeam', 'm2', 'test2', 10) ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrg (mfr, name, description, type) VALUES ('glassbeam', 'glassbeam', 'MDA', 100) ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm, sso_idp_id, sso_login_url, sso_logout_url) VALUES ('m1', 'p1', 'sch1', 'm1', 'dev', 't1', 't2', 't3') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNMpseSSO (mfr, prod, sch, ec, realm) VALUES ('m2', 'p2', 'sch2', 'm2', 'dev') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRealm (name) VALUES ('dev') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRealm (name) VALUES ('prod') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrgByType (type, mfr, name, description) VALUES (1, 'm1', 'm1', 'test1') ;") 
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrgByType (type, mfr, name, description) VALUES (1, 'm2', 'm2', 'test2') ;") 
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrgByType (type, mfr, name, description) VALUES (10, 'glassbeam', 'm1', 'test1') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrgByType (type, mfr, name, description) VALUES (10, 'glassbeam', 'm2', 'test2') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNOrgByType (type, mfr, name, description) VALUES (100, 'glassbeam', 'glassbeam', 'MDA') ;")
      cqlExecute(s"INSERT INTO $KsGB.$CFNDashboard (mfr, prod, sch, d_id, r_id, r_link) VALUES ('m1', 'p1', 'sch1', d349987b-db84-4393-bacd-98f0a4898f59, d349987b-db84-4393-bacd-98f0a4898f59, 'link1')")
    }
      
    def cleanup() {
      cqlExecute(s"TRUNCATE $KsUMS.$CFNMpseSSO")
      cqlExecute(s"TRUNCATE $KsUMS.$CFNRealm")
      cqlExecute(s"TRUNCATE $KsGB.$CFNDashboard")
      cqlExecute(s"CREATE TABLE $KsUMS.$CFNOrg (mfr text, name text, description text, type int, PRIMARY KEY (mfr, name));")
      cqlExecute(s"CREATE TABLE $KsUMS.$CFNOrgByType (type int, mfr text, name text, description text, PRIMARY KEY (type, mfr, name));")
    }  
  }
  
  "Org Spec".title
  
  textFragment("Initalizing org column family")  
  step {fake = FakeApplication()}
  step {Play.start(fake)}
  step {OrgAnalyst.init()}

  "OrgAnalyst" should { 
       
    "return set of manufatureres" in  {
        val response = mfrs()
        response must equalTo(Seq("m1","m2"))
    }
   
    "return all customers under glassbeam" in  {
        val response = customers("glassbeam")
        response must equalTo(Vector(("m2","p2","sch2","m2","dev"), ("m1","p1","sch1","m1","dev")))
    }
    
    "return all realms" in {
      val response = realms()
      response must equalTo(Vector("prod","dev"))
    }
    
    "return all end customers" in  {
        val response = customers("m1")
        response must equalTo(Vector(("m1","p1","sch1","m1","dev")))
    }
    
    "return all organizations" in  {
        val response = all()
        response must equalTo(Seq("m2","glassbeam","m1"))
    }
    
    "return all organization for glassbeam user" in  {
        val response = mfrAndCustomers("glassbeam")
        response must equalTo(Seq("m2","glassbeam","m1"))
    }
    
    "return all end customers for a organization" in  {
        val response = mfrAndCustomers("m1")
        response must equalTo(Seq("m1","m1"))
    }

    "insert a new entry for an organization in databas" in  {
      val custm3 = models.CustDomain("m3", "sch3", "m3", "dev", "", "", "", "")
        val response = createMfr(models.Org("m3", "m3", "test3", 1))
        response must beNone
    }
    
    "create new manufacturer" in  {
      val custm4 = models.CustDomain("m4", "sch4", "m4", "dev", "", "", "", "")
        val response = createMfr(models.Org("m4", "m4", "test4", 1))
        response must beNone
    }
    
    "create new customer" in  {
      val custm5 = models.CustDomain("m5", "sch5", "m5", "dev", "", "", "", "")
        val response = create(models.Cust("m5", "m5", "test5", 1, custm5))
        response must beNone
    }
    
    "delete a manufacturer" in  {
        val response = deleteMfr("m5")
        response must beNone
    }
    
    "delete a customer" in  {
        val response = deleteCustomer("m4", "p4", "sch4", "m4", "dev")
        deleteCustomer("m2", "p2", "sch2", "m2", "dev")
        response must beNone
    }
    
    "give details from mpse_sso" in {
      val response = getMpseInfo("m1", "p1", "sch1", "m1")
      deleteCustomer("m2", "p2", "sch2", "m2", "dev")
      response must be equalTo(Vector("t2", "t3", "t1"))
    }
    
    "return list of dashboard links" in {
      val response = getDashboardUrl("m1", "p1", "sch1", "d349987b-db84-4393-bacd-98f0a4898f59")
      response must be equalTo("link1")
    }
    
    "return empty set of manufatureres" in  {
        cqlExecute(s"DROP TABLE $KsUMS.$CFNOrg")
        cqlExecute(s"DROP TABLE $KsUMS.$CFNOrgByType")
        val response = mfrs()
        response must equalTo(Seq())
    }
    
     "return empty list of all organizations" in  {
        val response = all()
        response must equalTo(Seq())
    }
     
     "fail to insert a new entry for an organization in database" in  {
       val custm3 = models.CustDomain("m3", "sch3", "m3", "dev", "", "", "", "")
        val response = create(models.Cust("m3", "m3", "test3", 1, custm3))
        response must equalTo(Some("Failed to create new org"))
    }
     
    "fail to delete a manufacturer" in  {
        val response = deleteMfr("m5")
        response must equalTo(Some("Failed to delete manufacturer"))
    }

 }
  
  textFragment("Emptying org column family")                 
  
  step {
    OrgAnalyst.cleanup 
  }
  
  step{Play.stop}
  
}