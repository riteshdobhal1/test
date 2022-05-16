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
import scala.collection.Seq
import org.joda.time.DateTime._
import org.joda.time._

/**
 * Tests the Authentication and Authorization module
 * 
 */
class AdminSpec extends Specification {
 
  var fake: FakeApplication = _
  
  object Admin {

    def init() {
      val ts = DateTime.now().getMillis()
      create(UserWithPasswd(models.User("support@m1", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "m1", "support", "test", "test", "m1:p1:sch1", false, false, true)))
      create(UserWithPasswd(models.User("support@ut2", "f", "l", "d", "c", "s", "coun", false, "w", false, "p1", "ut2", "support", "test", "test", "m1:p1:sch1", false, false, true)))
      cqlExecute(s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm) VALUES ('support', true, {'test' : 'm1:p1:sch1', 'poc' : 'm1:p2:sch1'}, {'m1:p1:sch1' : 'f1:f2:f3:f4', 'm1:p2:sch1' : 'f1:f2:f3:'}, ['test', 'poc']) ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1451606400000, 'support@m1', 'sess1', 'Explorer', '2016-01-01T01:00:00Z', '2016-01-01T02:00:00Z', 'search', 'solr1', 'act1') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1454284800000, 'support@m1', 'sess1', 'Explorer', '2016-02-01T01:00:00Z', '2016-02-01T02:00:00Z', 'search', 'solr2', 'act2') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1456790400000, 'support@m1', 'sess1', 'Log Vault', '2016-03-01T01:00:00Z', '2016-03-01T02:00:00Z', 'search', 'solr3', 'act3') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1459468800000, 'support@m1', 'sess1', 'Workbench', '2016-04-01T01:00:00Z', '2016-04-01T02:00:00Z', 'search', 'solr4', 'act4') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1462060800000, 'support@m1', 'sess1', 'Apps', '2016-05-01T01:00:00Z', '2016-05-01T02:00:00Z', 'search', 'solr5', 'act5') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1464739200000, 'support@m1', 'sess1', 'HealthCheck', '2016-06-01T01:00:00Z', '2016-06-01T02:00:00Z', 'search', 'solr6', 'act6') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts, end_ts, module, solr_qry, activity) VALUES ('m1', 'p1', 'sch1', 'm1', 1467331200000, 'support@m1', 'sess1', 'Explorer', '2016-07-01T01:00:00Z', '2016-07-01T02:00:00Z', 'search', 'solr7', 'act7') ;")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUser (email, created_on, token_id) VALUES ('email@email.com', $ts, '123456')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNProspect (email, veri_code) VALUES ('email222@email.com', '123456')")
    }

    def cleanup() {
      delete("support@m1")
      delete("support@ut2")
      cqlExecute(s"DELETE from $KsUMS.$CFNRole where name='support'")
      cqlExecute(s"DELETE from $KsUMS.$CFNOrg where mfr='glassbeam' AND name='ut2'")
      cqlExecute(s"DELETE from $KsUMS.$CFNOrgByType where type=10 AND mfr='glassbeam' AND name='ut2'")
      cqlExecute(s"DELETE from $KsUMS.$CFNOrg where mfr='ut2'")
      cqlExecute(s"DELETE from $KsUMS.$CFNOrgByType where type=1 AND mfr='ut2'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUserByOrg WHERE org='ut2'")
      cqlExecute(s"TRUNCATE $KsUMS.$CFNUserActivity")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser where email='email@email.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser where email='email222@email.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNProspect where email='email222@email.com'")
      cqlExecute(s"DELETE FROM $KsUMS.$CFNProspect where email='email@email123.com'")
    }

  }

  "Admin Spec".title

  textFragment("Adding test users to the user column family")
  step{fake = FakeApplication()}
  step{Play.start(fake)}
  
  step {Admin.init()}

  "Admin" should {
    
    /**
     * Manufatcurer Management
     */
     "present a form and redirects for adding a mfr" in {
        val response = route(FakeRequest(GET, """/v1/admin/mfr/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    "add a mfr" in {
        val response = route(FakeRequest(POST, """/v1/admin/mfr/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("mfr" , "ut2"), ("name" , "ut2"), ("desc" , "test"), ("type" ,"10"))).get
        status(response) must equalTo(303)
        contentType(response) must beNone
    }
    
    "return form error for adding mfr" in {
        val response = route(FakeRequest(POST, """/v1/admin/mfr/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("mfr" , "ut2"), ("name" , ""), ("desc" , "test"), ("type" ,"10"))).get
        status(response) must equalTo(400)
    }
    
    "return bad request to add a mfr" in {
        val response = route(FakeRequest(POST, """/v1/admin/mfr/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("name" , "ut2"), ("desc" , "test"), ("type" ,"10"))).get
        status(response) must equalTo(303)
    }
    
    "list all mfrs for glassbeam user" in {
        val response = route(FakeRequest(GET, """/v1/admin/mfr/list""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
        contentType(response) must beSome.which(_ == "text/html")
        contentAsString(response) must contain("""<td> ut2  </td>""")
    }
    
    "list all mfrs for glassbeam user with request true" in {
        val response = route(FakeRequest(GET, """/v1/admin/mfr/list?is_request=true""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
       contentType(response) must beSome.which(_ == "application/json")
       contentAsString(response) must contain("""["ut2"]""")
    }
    
    "list all mfrs for glassbeam user with request false" in {
        val response = route(FakeRequest(GET, """/v1/admin/mfr/list?is_request=false""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
       contentType(response) must beSome.which(_ == "text/html")
        contentAsString(response) must contain("""<td> ut2  </td>""")
    }
    
    
    
    /**
     * Customer Management
     */
    
    "present a form and redirects for adding a customer" in {
        val response = route(FakeRequest(GET, """/v1/admin/ec/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }

    "add a customer" in {
        val response = route(FakeRequest(POST, """/v1/admin/ec/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("mfr" , "ut2"), 
            ("name" , "ut2"), ("desc" , "test"), ("type" ,"10"), ("domain", "utesting"), ("domain.prod", "ut2"), ("domain.sch", "pod"), ("domain.ec", "ut2"), ("domain.realm", "test"), 
            ("domain.sso_login_url", "sso_login_url"), ("domain.sso_logout_url", "sso_logout_url"), ("domain.sso_roles", "sso_roles:roles"),
            ("domain.sso_idp_id", "sso_idp_id"))).get
        status(response) must equalTo(303)
        contentType(response) must beNone
    }
    
    "return bad request" in {
        val response = route(FakeRequest(POST, """/v1/admin/ec/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("name" , "ut"), ("desc" , "test"), ("type" ,"10"))).get
        status(response) must equalTo(400)
    }
    
    "list all customers for glassbeam user" in {
        val response = route(FakeRequest(GET, """/v1/admin/ec/list""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
        contentType(response) must beSome.which(_ == "text/html")
        contentAsString(response) must contain("""<td> ut2  </td>""")
    }
    
    "list all customers for glassbeam user with request true" in {
        val response = route(FakeRequest(GET, """/v1/admin/ec/list?is_request=true""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
        contentType(response) must beSome.which(_ == "application/json")
       contentAsString(response) must contain("""{"mfr":"ut2","prod":"ut2","sch":"pod","ec":"ut2","realm":"test"}]""")
    }
    
    "list all customers for glassbeam user with request false" in {
        val response = route(FakeRequest(GET, """/v1/admin/ec/list?is_request=false""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
        contentType(response) must beSome.which(_ == "text/html")
        contentAsString(response) must contain("""<td> ut2  </td>""")
    }
    
    
   /**
    * Role Management
    */
    
    "present a form and redirects for adding a role" in {
        val response = route(FakeRequest(GET, """/v1/admin/role/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    "list all roles for glassbeam user" in {
        val response = route(FakeRequest(GET, """/v1/admin/role/list""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
        contentType(response) must beSome.which(_ == "text/html")
        contentAsString(response) must contain("""/v1/admin/role/edit/support/test/f1:f2:f3:f4,f1:f2:f3:/m1:p1:sch1/test,poc""")
    }
    
 
    "add a role" in {
      val response = route(FakeRequest(POST, """/v1/admin/role/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("name" , "test"), 
            ("is_super" , "false"), ("domain" , "test"), ("mfr" ,"ut2"), ("prod", "ut2"), ("sch", "pod"), ("realm", "test"), 
            ("feature", "f1:f2:f3"))).get
      status(response) must equalTo(400)
    }
    
    "edit a role" in {
      val perm = List("admin")
        val response = route(FakeRequest(POST, """/v1/admin/role/edit/support/test/f1:f2:f3:f4,f1:f2:f3:/m1:p1:sch1/test,poc""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    "list all domains for a existing role" in {
      val response = route(FakeRequest(GET, """/v1/admin/role/domains/m1/support""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin", SKUserDomains -> "m1:p1:sch1", SKUserRealms -> "poc,test")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain(""""domains":{"poc":"m1:p2:sch1","test":"m1:p1:sch1"}""")
    }
    
    "list all domains for a non-existing role" in {
      val response = route(FakeRequest(GET, """/v1/admin/role/domains/m1/support123""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin", SKUserDomains -> "m1:p1:sch1", SKUserRealms -> "poc,test")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""No domains found for this role or role doesnt exist""")
    }
    
    "delete a role" in {
        val response = route(FakeRequest(POST, """/v1/admin/role/delete/support""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(303)
        contentType(response) must beNone
    }
    
    "add domain a role" in {
      val perm = List("admin")
        val response = route(FakeRequest(POST, """/v1/admin/role/add/support""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    /**
     * User Management
     */
 
    "present a form and redirects for adding a user" in {
        val response = route(FakeRequest(GET, """/v1/admin/user/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }
    
    "list all users" in {
      val response = route(FakeRequest(GET, """/v1/admin/user/list""").withSession(SKUserName-> "ss", SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "text/html")
      contentAsString(response) must contain("""<td> ut2  </td>""")
    }
    
    "list all users for a mfr" in {
      val response = route(FakeRequest(GET, """/v1/admin/user/list/m1""").withSession(SKUserName-> "ss", SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "text/html")
      contentAsString(response) must contain("""<td> support@m1 </td>""")
    }

    "add a user" in {
      val response = route(FakeRequest(POST, """/v1/admin/user/add""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("first_name" , "test"), 
            ("last_name" , "test"), ("department" , "test"), ("state" ,"test"), ("city", "test"), ("country", "test"), ("sso", "false"), ("wb_user_name", "test"),
            ("report_usage", "false"), ("phone", "111"), ("emails.main", "test@gb.com"), ("emails.confirm", "test@gb.com"), ("org", "m1"), ("role", "support"), ("realm_def", "test"), ("mps_def", "m1:p1:sch1"), ("url_def", "m1:p1:sch1"), ("is_prospect", "false"), ("dashboard_admin", "false"))).get
      status(response) must equalTo(303)
    }
    
    "remove a user" in {
      val response = route(FakeRequest(POST, """/v1/admin/user/remove/test@gb.com/m1""").withSession(SKUserId -> "admin@glassbeam.com", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(303)
      contentType(response) must beNone
    }
    
    "checks if user exists" in {
       val response = route(FakeRequest(GET, """/v1/user/exists/ut2/support@ut2""").withSession(SKUserName-> "ss", SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
       status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""User details for email""")
    }
    
    "checks if user exists" in {
       val response = route(FakeRequest(GET, """/v1/user/exists/ut2/support@ut3""").withSession(SKUserName-> "ss", SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
       status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""No user with this email""")
    }
    
    "updates defaults for a user" in {
      val response = route(FakeRequest(POST, """/v1/user/update/defaults/ut2""").withSession(SKUserRealms -> "", SKUserDomains -> "m1:p1:sch1,ut2:ut2:pod", SKUserId -> "support@ut2", SKUserOrg -> "ut2", SKUserRole -> "support").withFormUrlEncodedBody(("realm_def", "test"), ("mps_def", "m1:p1:sch1"), ("url_def", "m1:p1:sch1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Defaults updated for user""")
    }
    
    "creates password for a user" in {
      val response = route(FakeRequest(POST, """/v1/user/update/defaults/ut2""").withSession(SKUserRealms -> "", SKUserDomains -> "m1:p1:sch1,ut2:ut2:pod", SKUserId -> "support@ut2", SKUserOrg -> "ut2", SKUserRole -> "support").withFormUrlEncodedBody(("realm_def", "test"), ("mps_def", "m1:p1:sch1"), ("url_def", "m1:p1:sch1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Defaults updated for user""")
    }
    
    /**
     * Other Urls 
     */
    
    "return mpse info for" in {
      val response = route(FakeRequest(GET, """/v1/mpse/config/details/ut2/ut2/pod/ut2""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""["sso_login_url","sso_logout_url","sso_idp_id"]""")
    }
    
    "delete a mfr and its user" in {
        val response = route(FakeRequest(POST, """/v1/admin/mfr/delete/m1""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(303)
        contentType(response) must beNone
    }
    
    "delete a customer and its user" in {
        val response = route(FakeRequest(POST, """/v1/admin/ec/delete/ut2/ut2/pod/ut2/test""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(303)
        contentType(response) must beNone
    }
    
    "return response for monitoring" in {
      val response = route(FakeRequest(GET, """/v1/monitor""")).get
      status(response) must equalTo(200)
      contentAsString(response) must contain("""Infoserver running..""")
    }
    
    "track a user activity" in {
       val response = route(FakeRequest(POST, """/v1/user_tracking/m1/p1/sch1/Explorer/search/something""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("details", "somedetails"), ("solr_query", "somequery"))).get
       status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Success""")
    }
    
    "track a user activity with switched" in {
       val response = route(FakeRequest(POST, """/v1/user_tracking/m1/p1/sch1/Workbench/search/something?switched_feature=Explorer""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin").withFormUrlEncodedBody(("details", "somedetails"), ("solr_query", "somequery"))).get
       status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Success""")
    }
    
    "return user tracking data" in {
      val response = route(FakeRequest(GET, """/v1/user_tracking/m1/p1/sch1/m1/2016-01-01T00:00:00Z/2016-07-01T00:00:00Z?col=start_ts&col=solr_qry&col=app&col=module&col=month&aggr=count(app) AND sum(month) AND max(month) AND min(month) AND avg(month)&groupby=module&orderby=start_ts&limit=5""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""{"count(app)":7,"module":"search","max(month)":1467331200000""")
    }
    
    "return user tracking data without aggr" in {
      val response = route(FakeRequest(GET, """/v1/user_tracking/m1/p1/sch1/m1/2015-10-01T00:00:00Z/2016-07-01T00:00:00Z?col=start_ts&col=solr_qry&col=app&col=module&col=month&aggr=count(app) AND sum(month) AND max(month) AND min(month) AND avg(month)&orderby=start_ts&limit=5""").withSession(SKUserId -> "pm@m1", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""{"count(app)":7,"max(month)":[1467334800000,"solr7","Explorer","search",1467331200000],"sum(month)":1.02162816E+13,"avg(month)":1.4594688E+12,"min(month)":[1451610000000,"solr1","Explorer","search",1451606400000]}""")
    }
    
    "create password for a new user" in {
      val response = route(FakeRequest(POST, """/v1/user/create/passwd""").withSession(SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("email", "email@email.com"), ("token_id", "123456"), ("passwd", "passwd"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Password updated for user""")
    }
    
    "change password for a user" in {
      val response = route(FakeRequest(POST, """/v1/user/change/passwd/m1""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("email", "email@email.com"), ("token_id", "123456"), ("passwd", "passwd1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Password changed successfully for the user""")
    }
    
    "respond as user not found for forgot password link" in {
      val response = route(FakeRequest(POST, """/v1/user/forgot/passwd/email12@email.com""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("email", "email@email.com"), ("token_id", "123456"), ("passwd", "passwd1"))).get
      status(response) must equalTo(403)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""User not Found""")
    }
    
    "send a forgot password link to a user" in {
      val response = route(FakeRequest(POST, """/v1/user/forgot/passwd/email@email.com""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("email", "email@email.com"), ("token_id", "123456"), ("passwd", "passwd1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""Reset Password link sent to the user""")
    }
    
    "should respond that user already exist for registering a prospect" in {
      val response = route(FakeRequest(POST, """/v1/campaign/user/add""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""UserAlreadyExists""")
    }
    
    "register a prospect" in {
      val response = route(FakeRequest(POST, """/v1/campaign/user/add""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email123.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""RegistrationSuccess""")
    }
    
    "should return as prospect already exists" in {
      val response = route(FakeRequest(POST, """/v1/campaign/user/add""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email123.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""ProspectExists""")
    }
    
    "should verify a prospect" in {
      val response = route(FakeRequest(GET, """/v1/campaign/user/verification?email=email222@email.com&token_id=123456""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email123.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(303)
    }
    
    "should regenerate email verification" in {
      val response = route(FakeRequest(GET, """/v1/campaign/user/regenerate/verification/email@email123.com""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email123.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""RegeneratedEmail""")
    }
    
    "should not regenerate email verification" in {
      val response = route(FakeRequest(GET, """/v1/campaign/user/regenerate/verification/emai123l@email123.com""").withSession(SKUserDomains -> "m1:p1:sch1", SKUserId -> "email@email.com", SKUserOrg -> "m1", SKUserRole -> "test").withFormUrlEncodedBody(("f_name", "first"), ("l_name", "last"), ("email", "email@email123.com"), ("passwd", "passwd"), ("product_id", "1"))).get
      status(response) must equalTo(200)
      contentType(response) must beSome.which(_ == "application/json")
      contentAsString(response) must contain("""NoProspectAsSuch""")
    }
    
    "refresh the spark context" in {
      val response = route(FakeRequest(GET, """/v1/spark/refresh""").withSession(SKUserId -> "admin@glassbeam.com", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
      status(response) must equalTo(200)
      contentAsString(response) must contain ("Spark refreshed")
    }

  }

  textFragment("Removing test users from user column family")
  
  step {
    Admin.cleanup
  }

  step{Play.stop}
  
}