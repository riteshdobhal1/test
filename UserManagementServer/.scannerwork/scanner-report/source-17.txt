package test

import org.specs2.mutable._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._
import constants._

/**
 * Tests the URLs implemented in the Application controller
 * 
 */
class ApplicationSpec extends Specification {
  var fake: FakeApplication = _
  step {fake = FakeApplication()}
  step (Play.start(fake))
  
  "Application" should {
    
    "send 404 on a bad request" in {
        route(FakeRequest(GET, "/v1/password")) must beNone        
    }
    
    "respond to the vhome page" in {
        val result = route(FakeRequest(GET, "/v1/home/visitor")).get
        status(result) must equalTo(OK)
        contentType(result) must beSome.which(_ == "text/html")
        contentAsString(result) must contain ("Glass Beam")
    }
    
    "respond to the xproxy" in {
        val result = route(FakeRequest(GET, "/v1/xproxy")).get
        status(result) must equalTo(OK)
        contentType(result) must beSome.which(_ == "text/html")
        contentAsString(result) must contain ("http://*.glassbeam.com")
    }
    
    "respond to the uhome page" in {
        val result = route(FakeRequest(GET, """/v1/home/user""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(result) must equalTo(OK)
        contentType(result) must beSome.which(_ == "text/html")
        contentAsString(result) must contain ("Glass Beam")
    }
    
    "login  the user " in {
        val result = route(FakeRequest(POST, """/v1/aa/login""").withFormUrlEncodedBody(("email" , "admin@glassbeam.com"), ("password" , "gla55beam"), ("redirectURI" ,"http://localhost:9000"))).get
        status(result) must equalTo(303)
        contentType(result) must beNone
    }
    
    "login  the ui user " in {
        val result = route(FakeRequest(POST, """/v1/aa/uilogin""").withFormUrlEncodedBody(("email" , "admin@glassbeam.com"), ("password" , "gla55beam"), ("redirectURI" ,"http://localhost:9000"))).get
        status(result) must equalTo(200)
        contentType(result) must beSome.which(_ == "application/json")
      contentAsString(result) must contain("""Authentication Token""")
    }
    
    "login  the 3rd party user " in {
        val result = route(FakeRequest(POST, """/v1/aa/app_login""").withFormUrlEncodedBody(("email" , "admin@glassbeam.com"), ("password" , "gla55beam"), ("redirectURI" ,"http://localhost:9000"))).get
        status(result) must equalTo(200)
        contentType(result) must beSome.which(_ == "application/json")
        contentAsString(result) must contain("""Authentication Token""")
    }
    
    "return bad request for the login page" in {
        val result = route(FakeRequest(POST, """/v1/aa/login""").withFormUrlEncodedBody(("password" , "gla55beam"), ("redirectURI" ,"http://localhost:9000"))).get
        status(result) must equalTo(400)
        contentType(result) must beSome.which(_ == "text/html")
        contentAsString(result) must contain ("Glass Beam")
    }
    
    "logout a user" in {
        val result = route(FakeRequest(GET, """/v1/aa/logout""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(result) must equalTo(303)
        contentType(result) must beNone
    }
    
     

  }
  step{Play.stop}
}
