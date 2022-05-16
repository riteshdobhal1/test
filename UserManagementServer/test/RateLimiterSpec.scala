package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._

import constants._
import models.DS._

/**
 * Tests the version analytics module
 * 
 */

/*class RateLimiterSpec extends Specification {
  
  var fake: FakeApplication = _
  object RateLimiter {  
	def RATE_LIMIT = Play.current.configuration.getInt("request.limit").getOrElse(RequsetLimit)
  }
  
  "RateLimiter Spec".title
  
  textFragment("Initalizing system column families")   
  step {fake = FakeApplication(additionalConfiguration = Map(("request.limit" -> 1)))}
  step {Play.start(fake)}

   "RateLimiter" should { 
     
    "return ok for section view list" in  {
        val response = route(FakeRequest(GET, "/v1/sectionview/list/m1/p1/sch1").withSession(SKUserId -> "admin@glassbeam.com", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(200)
    }

    "return Request Limit exceeded error for section view request" in  {
        val response = route(FakeRequest(GET, "/v1/sectionview/list/m1/p1/sch1").withSession(SKUserId -> "admin@glassbeam.com", SKUserOrg -> "glassbeam", SKUserRole -> "admin")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for setdefault section view" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/setdefault/m1/p1/sch1/false/saved1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
        
    }
    
    "returns Request Limit Exceeded error for request to get the default view for a user" in  {
        val response = route(FakeRequest(GET, "/v1/sectionview/getdefault/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
     }
    
    "returns Request Limit Exceeded error for a request to unset default view" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/resetdefault/m1/p1/sch1/false/saved2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
        
    }
    
    "returns Request Limit Exceeded error for a request to delete a view" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/delete/m1/p1/sch1/true/saved1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to add a view with filters" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/add/m1/p1/sch1/false/saved10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("desc" , "unit testing"), ("transpose" , "{'ns1:true'}"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col'}"), ("filters" ,"{'filte1:attr'}"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to update a view" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/update/m1/p1/sch1/false/saved10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("desc" , "unit testing"), ("transpose" , "false"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col', 'attr2:col2'}"), ("filters" ,"{'filte1:attr'}"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
     }
    
    "returns Request Limit Exceeded error for a request for a meta of saved views" in  {
        val response = route(FakeRequest(GET, "/v1/sectionview/meta/m1/p1/sch1/false/saved2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request for setting a view as public" in  {
        val response = route(FakeRequest(POST, "/v1/sectionview/setpublic/m1/p1/sch1/true/saved2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    Thread.sleep(1000)
    
    "returns 200 for a request for a list of saved config diff views" in  {
        val response = route(FakeRequest(GET, "/v1/configview/list/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(OK)
    }
    
    "returns Request Limit Exceeded error for a request for a list of saved config diff views" in  {
        val response = route(FakeRequest(GET, "/v1/configview/list/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request for a meta of saved views" in  {
        val response = route(FakeRequest(GET, "/v1/configview/meta/m1/p1/sch1/true/config1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to set a view as default config diff" in  {
        val response = route(FakeRequest(POST, "/v1/configview/setdefault/m1/p1/sch1/false/config1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to get the config diff default view for a user" in  {
        val response = route(FakeRequest(GET, "/v1/configview/getdefault/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to unset a confdig diff view as default" in  {
        val response = route(FakeRequest(POST, "/v1/configview/resetdefault/m1/p1/sch1/false/config2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to add a config diff view" in  {
        val response = route(FakeRequest(POST, "/v1/configview/add/m1/p1/sch1/false/config10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("desc" , "unit testing"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col'}"), ("obs_ct" ,"{'ns1:10', 'ns2:7'}"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to delete a config diff view" in  {
        val response = route(FakeRequest(POST, "/v1/configview/delete/m1/p1/sch1/true/config1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to update a config diff view" in  {
        val response = route(FakeRequest(POST, "/v1/configview/update/m1/p1/sch1/false/config10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("desc" , "unit testing"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col', 'attr2:col2'}"), ("obs_ct" ,"{'ns4:9', 'ns5:3'}"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to set a config diff view as public" in  {
        val response = route(FakeRequest(POST, "/v1/configview/setpublic/m1/p1/sch1/false/config10").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("desc" , "unit testing"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col', 'attr2:col2'}"), ("obs_ct" ,"{'ns4:9', 'ns5:3'}"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    Thread.sleep(1000)
    
    "returns 200 for a request for a list of saved trends views" in  {
        val response = route(FakeRequest(GET, "/v1/trendsview/list/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(200)
    }
    
    "returns Request Limit Exceeded error for a request for a list of saved trends views" in  {
        val response = route(FakeRequest(GET, "/v1/trendsview/list/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request for a meta of saved trends views" in  {
        val response = route(FakeRequest(GET, "/v1/trendsview/meta/m1/p1/sch1/false/trends2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to set a view as default for trends view" in  {
        val response = route(FakeRequest(POST, "/v1/trendsview/setdefault/m1/p1/sch1/false/trends1/report1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to get the default trends view for a user" in  {
        val response = route(FakeRequest(GET, "/v1/trendsview/getdefault/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request request to add a trends view" in  {
        val response = route(FakeRequest(POST, "/v1/trendsview/add/m1/p1/sch1/false/trends10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("report" , "report10"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col'}"), ("start" ,"2013-10-12"),("end" ,"2013-11-10"),("intervals" ,"10"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to set a trends view as public" in  {
        val response = route(FakeRequest(POST, "/v1/trendsview/setpublic/m1/p1/sch1/true/trends2/report2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to delete a trends view" in  {
        val response = route(FakeRequest(POST, "/v1/trendsview/delete/m1/p1/sch1/trends1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "returns Request Limit Exceeded error for a request to update a  trends view" in  {
        val response = route(FakeRequest(POST, "/v1/trendsview/update/m1/p1/sch1/false/trends10/false").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm").withFormUrlEncodedBody(("report" , "report10"), ("kbase" , "http://unit.test.com"), ("cols" , "{'attr1:col'}"), ("start" ,"2013-10-11"),("end" ,"2013-11-10"),("intervals" ,"10"))).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }

    // Metadata Ratelimiter check
    
    "return 200 ok for request for all columns" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/all/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(OK)
        
    }
    
    "return Request Limit Exceeded error for a request for all columns" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/all/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    
    "return Request Limit Exceeded error for a request for all columns for a section type" in {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/section_type/m2/p2/sch2/EVENT").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for facet columns" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/facet/m3/p3/sch3").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for tables" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/table_name/m1/p1/sch1/tbl1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for numeric columns" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/numeric/m1/p1/sch1").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for solr columns for a section type" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/columns/solr/m3/p3/sch3/SECTION").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for section for a sectionType" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/sections/type/m1/p1/sch1/EVENT").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for all sections" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/sections/all/m2/p2/sch2").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for section for a Icon Type" in  {
        val response = route(FakeRequest(GET, s"/v1/meta/sections/icon/m1/p1/sch1/LIST_BASIC").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    Thread.sleep(1000)
    
    // Col 
    
    "return 200 ok to a request for all columns for  the most recent observation" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/mr/all/m1/p1/sch1/ec1/s1/tbl1""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(OK)
        
    }
    
    "return Request Limit Exceeded error for a request for all columns for  the most recent observation" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/mr/all/m1/p1/sch1/ec1/s1/tbl1""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for all columns for  the most recent observation" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/mr/named/m1/p1/sch1/ec1/s1/tbl1?col=c11""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request to get all rows and all column values for a namespace with the time range" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/ts/all/time_range/m1/p1/sch1/ec1/s1/tbl1/2013-01-03T01:35:00/2013-01-03T01:35:00""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request to get all column values for specific rows for a table on a specific time" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/ts/all/row_range/m1/p1/sch1/ec1/s1/tbl1/2013-01-03T01:35:00/1/2""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request to get column values for last N observation at specified date" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/ts/named/last_n/m1/p1/sch1/ec1/s1/tbl1/2013-01-04T01:35:00/2""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a to exports the csv file with all column values for last N observation" in  {
        val response = route(FakeRequest(GET, """/v1/base/export/system/ts/all/last_n/m1/p1/sch1/ec1/s1/tbl1/2013-01-04T01:35:00/2""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
    
    "return Request Limit Exceeded error for a request for named columns betweet st and et" in  {
        val response = route(FakeRequest(GET, """/v1/base/columns/system/ts/named/time_range/m1/p1/sch1/ec1/s1/tbl1/2013-01-03T01:35:00/2013-01-04T01:35:00?col=c11&col=c12""").withSession(SKUserId -> "pm@m1", SKCustName -> "m1", SKUserOrg -> "m1", SKUserRole -> "pm")).get
        status(response) must equalTo(400)
        contentType(response) must beSome.which(_ == "application/json")
        contentAsString(response) must contain("""Request limit exceeded""")
    }
  } 
  
  textFragment("Emptying system column families")                 
  
  step {Play.stop}
}*/