package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._
import constants._
import models.DS._
import models.User._
import models.{UserWithPasswd}
import models.User
import org.joda.time._
import scala.util.{Try, Success, Failure}

/**
 * Tests the Table module
 * 
 */
class UserSpec extends Specification {
  
  var fake: FakeApplication = _
  object User {  
   def init() {
      // initialize the col_timeline Column Family
      val ts = DateTime.now().getMillis()
      create(UserWithPasswd(models.User("support@m1", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m1", "support", "r_def", "u_def", "m_def", true, false, false)))
      create(UserWithPasswd(models.User("pm@m2", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m2", "pm", "r_def", "u_def", "m_def", false, false, false)))
      create(UserWithPasswd(models.User("pm@m1", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "glassbeam", "admin", "r_def", "u_def", "m_def", false, false, false)))
      create(UserWithPasswd(models.User("support@m2", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m2", "support", "r_def", "u_def", "m_def", false, false, false)))
      create(UserWithPasswd(models.User("test@gb.com", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "glassbeam", "admin", "r_def", "u_def", "m_def", false, false, false)))
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUser (email, token_id, created_on) VALUES ('user@gb.com', '123', $ts)")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNProspect (email, veri_code, created_on) VALUES ('prospect2@gb.com', '123', $ts)")
   }

    def cleanup() {
      delete("pm@m1")
      delete("support@m1")
      delete("pm@m2")
      delete("pm@m3")
      delete("support@m2")
      delete("test@gb.com") 
      delete("email@email.com")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='user@gb.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='userpo@gb.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='usersf@gb.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='prospect2@gb.com'")
      cqlExecute(s"TRUNCATE $KsUMS.$CFNUserActivity")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUserByOrg WHERE org='sf'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUserByOrg WHERE org='test'")
    }
   }
  
  "User Spec".title
  
  textFragment("Initalizing col and metadata column family") 
  step {fake = FakeApplication()}
  step {Play.start(fake)}
  step {User.init()}
  
  "User" should {   
    "delete user by org" in  {
        val response = deleteByOrg("m2")
        response must beNone
    }

    "delete a user" in  {
        val response = delete("test@gb.com")
        response must beNone
    }
    
    "create a user" in  {
        val response = create(UserWithPasswd(models.User("pm@m3", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m2", "pm", "r_def", "u_def", "m_def", false, false, false)))
        response must beNone
    }
      
     "return none for non-existing user" in  {
        val response = byEmail("testing")
        response must beNone
    }
   
    "return false if a user exists with the given email address" in  {
        val response = notExists("support@m1")
        response must equalTo(false)
    }
    
    "returns list of user belonging to the given org" in  {
        val response = byOrg("m1")
        response must equalTo(List(models.User("support@m1","f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m1","support","" , "u_def", "m_def", true, false, true)))
    }
   
    "returns empty list of non-existing org" in  {
        val response = byOrg("glassbeam1")
        response must equalTo(List())
    }

    "returns all users belonging to a user's organization and all of its customers" in  {
        val response = allManagedBy("support@m1", "m1")
        response must equalTo(Vector(models.User("support@m1","f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m1","support", "", "u_def", "m_def", true, false, true)))
    }
    
    "returns true if the email and password combination match an entry in the database" in {
        val response = emailPasswdMatch("support@m1", "")._2
        response must equalTo(false)
    }
    
    "returns false if the email and password combination dont match an entry in the database" in {
        val response = emailPasswdMatch("support@m1", "g")._2
        response must equalTo(false)
    }

    "track user activity and insert a record in user_activity table" in {
        val response = userTracking("m1", "p1", "sch1", "test@gb.com", "sess_id", "app1", "mod1", "act1", Some("switch1"), "deatils", "solr_qry")
        response must beNone
    }
    
    "update the role for the user" in {
      val response = updateProspectsRole("support@m1")
      response must beNone
    }
    
    "create password for a user" in {
      val response = createPasswd(models.UserUpdatePasswd("user@gb.com", "123", "password"))
      val res = response.get.toString
      res must be equalTo("Password updated for user: user@gb.com")
    }
    
     "change password for the user" in {
      val response = changePasswd(models.UserUpdatePasswd("user@gb.com", "123", "password2"))
      val res = response.get.toString
      res must be equalTo("Password changed successfully..")
    }
    
     "send link for forgot password" in {
      val response = forgotPasswd("user@gb.com")
      val res = response.get.toString
      res must be equalTo("Reset Password link sent successfully..")
      
    }
     
     "update defaults for the user" in {
       val respone = updateDefaults(models.UserDefaults("realm_def", "url_def", "mps_def"), "user@gb.com")
       val res = respone.get.toString
       res must be equalTo("Defaults Updated successfully..")
     }
     
     "create sso ping user" in {
       val response = createSsoUserPing("userpo@gb.com", "test", "m:p:s", "role", "url")
       response must be equalTo(true)
     }
     
     "create sso salesforce user" in {
       val response = createSsoUserSalesforce("usersf@gb.com", "sf", "role", "fname", "lname", "email@email.com", "m:p:s", "domain")
       response must be equalTo(true)
     }
     
     "insert login activity " in {
       val response= trackUserLoginActivity("m1", "p1", "sch1", "user@gb.com", "sess_id")
       response must beNone
     }
     
     "insert logout activity " in {
       val response= trackUserLogoutActivity("m1", "p1", "sch1", "user@gb.com", "sess_id", "feature")
       response must be equalTo()
     }
    
     "add a prospect" in {
       val response = addProspect(models.Prospect("fname", "lname", "prospect@gb.com", "password", "1"))
       response must beNone
     }
     
     "regenerate email verification" in {
       val response = regenerateVerification("prospect@gb.com")
       response must beNone
     }
     
     "check if prospect exist" in {
       val response = ifProspectExits("prospect@gb.com")
       response must be equalTo(true)
     }

     "return the details of a user" in {
       val response = userDetails("support@m1")
       response must be equalTo(Some(models.UserInfo("support@m1", true, List(), "f", false, true, "m_def", "m1", "", "demo_and_studio", false, "MFR", "u_def", true, "w")))
     }
     
     "verify the prospect user" in {
       val response = verifyProspect("prospect2@gb.com", "123")
       response must beNone
     }
  }
  
  textFragment("Cleaning up col, metadata column family")                 
  
  step {
    User.cleanup 
  }
  
  step {Play.stop}

}
