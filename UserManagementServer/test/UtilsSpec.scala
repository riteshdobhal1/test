package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._

import constants._
import models.DS._
import models.Utils._
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import com.datastax.driver.core.Row
import play.api.libs.json._
import play.api.libs.json.Reads._
import scala.util.parsing.json._
import org.joda.time._
/**
 * Tests the Table module
 * 
 */
class UtilSpec extends Specification {
  
  var fake: FakeApplication = _
  
  object UtilAnalyst {  
    def init() {
      cqlExecute(s"INSERT INTO $KsGB.$CFNDashboard (mfr, prod, sch, d_id, r_id, r_link) VALUES ('m1', 'p1', 'sch1', d349987b-db84-4393-bacd-98f0a4898f59, d349987b-db84-4393-bacd-98f0a4898f59, 'link1')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUser (email, def_passwd, created_on) VALUES ('user@gb.com', true, '2016-01-01T00:00:00Z')")
      cqlExecute(s"INSERT INTO $KsUMS.$CFNUserActivity (mfr, prod, sch, ec, month, email, sess_id, app, start_ts) VALUES ('m1', 'p1', 'sch1', 'm1', 5, 'user@gb.com', 'sess', 'app', '2016-01-01T00:00:00Z')")
    }
      
    def cleanup() {
      cqlExecute(s"DELETE FROM $KsUMS.$CFNUser WHERE email='user@gb.com'")
      cqlExecute(s"TRUNCATE $KsGB.$CFNDashboard")
      cqlExecute(s"TRUNCATE $KsUMS.$CFNUserActivity")
    }  
  }
  
  "Util Spec".title
  
  textFragment("Initalizing col and metadata column family")
  step {fake = FakeApplication()}
  step {Play.start(fake)}
  step {UtilAnalyst.init()}

  "Util" should {   

    
    "encrypt the password" in  {
        val response = encryptPasswd("password")
        response must equalTo("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")
    }
    
    "send welcome email" in {
      val response = sendWelcomeEmail("sawan.verma@glassbeam.com", "sawan", "verma", 1, false)
      response must equalTo()
    }
    
    "send email to prospect" in {
      val response = sendEmailToProspect("sawan.verma@glassbeam.com", "sawan", "sawan", "verma")
      response must equalTo()
    }
    
    "send email to user" in {
      val response = sendEmail("sawan.verma@glassbeam.com", "sawan", true, "Sawan", "Verma")
      response must equalTo()
    }
    
    
    "convert json to xml" in {
      val text = s"""{"Msg":""}"""
      val tt = Json.parse(text)
      val response = jsonToXml(tt)
      response must be equalTo(<Response><Msg></Msg></Response>)
    }
    
    "return type of a value" in {
      val intval = 2
      val floatVal = 2.0
      val DoubelVal = 2.00
      val LongVal = 3L
      val respone1 = withType(intval)
      val respone2 = withType(floatVal)
      val respone3 = withType(DoubelVal)
      val respone4 = withType(LongVal)
      respone1 must be equalTo(2)
      respone2 must be equalTo(2.0)
      respone3 must be equalTo(2.00)
      respone4 must be equalTo(3L)
    }
    
    "return difference in milliseconds" in {
      val diff = responseTime(new DateTime("2016-01-01T00:00:00Z", DateTimeZone.UTC), new DateTime("2016-01-01T00:00:01Z", DateTimeZone.UTC))
      diff must be equalTo(1000L)
    }
    
    "return formatted json with Session" in {
      val jsData = Json.parse("""{"Data":""}""")
      val jsSess = Json.parse("""{"Sess":""}""")
      val response = jsonResponseWithSession("status", "msg", jsData, jsSess)
      val jsRes = Json.parse("""{"Status":"status","Msg":"msg","Data":{"Data":""},"Session":{"Sess":""}}""")
      response must equalTo(jsRes)
    }
    
    "return formatted json" in {
      val jsData = Json.parse("""{"Data":""}""")
      val response = jsonResponse("status", "msg", jsData)
      val jsRes = Json.parse("""{"Status":"status","Msg":"msg","Data":{"Data":""}}""")
      response must equalTo(jsRes)
    }
    
    "return row read" in {
      val rows1 = models.DS.cqlExecute(s"SELECT * FROM $KsUMS.$CFNUser").asScala.toList.head
      val rows2 = models.DS.cqlExecute(s"SELECT * FROM $KsGB.$CFNDashboard").asScala.toList.head
      val rows3 = models.DS.cqlExecute(s"SELECT * FROM $KsUMS.$CFNUserActivity").asScala.toList.head
      val row11 = getStringVal(rows1, "email", CVDefaultStr)
      val row12 = getBooleanVal(rows1, "def_passwd", CVDefaultBool)
      val row13 = getDateVal(rows1, "created_on", CVDefaultDate)
      val row21 = getUUIDVal(rows2, "d_id", CVDefaultUUID)
      val row33 = getLongVal(rows3, "month", CVDefaultLong)
      row11 must be equalTo("user@gb.com")
      row12 must be equalTo(true)
      row33 must be equalTo(5)
    }
    

  }
   step {UtilAnalyst.cleanup}            
  step {Play.stop}
}
