package models

import play.api._
import play.api.mvc.Result._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.http.Writeable._
import com.datastax.driver.core.{BoundStatement, ResultSet, Row}
import com.datastax.driver.core.policies._

import scala.collection.JavaConverters._
import collection.JavaConversions._
import play.api.libs.json._
import play.api.libs.json.Reads._
import org.joda.time._
import org.joda.time.format._

import scala.collection.mutable.HashMap
import scala.collection.mutable.ListBuffer
import java.io.File
import java.io.FileOutputStream
import java.util.Date
import java.util.UUID
import scala.xml.XML
import scala.xml._
import org.apache.commons.mail._
import constants._

import java.net.{URL, URLDecoder, URLEncoder}
import play.api.libs.Crypto

import java.security.MessageDigest
import java.sql.{ResultSet, Timestamp}
import User._

import scala.util.{Failure, Success, Try}
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.{IvParameterSpec, SecretKeySpec}
import scala.util.Random
import com.twilio.Twilio
import com.twilio.`type`.PhoneNumber
import com.twilio.rest.api.v2010.account.Message
import dao._
import models.Settings._
import org.apache.http.client.methods.{HttpGet, HttpPost}
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.util.EntityUtils
import play.api.Play.current
import play.api.data.validation.{Constraint, Invalid, Valid, ValidationError}
import play.api.libs.ws.WS

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json.Json

object Utils {

  private val EncAlgorithm = "AES/CBC/PKCS5Padding"
  private val EncKey = new SecretKeySpec(Base64.getDecoder.decode("DxVnlUlQSu3E5acRu7HPwg=="), "AES")
  private val EncIvSpec = new IvParameterSpec(new Array[Byte](16))
  val AdminKey = "Dx$V!nl%Ul^QS&u3*E5@acR-u7HPwg=="

  private class XmlNode(name: String, children: Seq[Node]) extends Elem(null, name, xml.Null, TopScope, false, children :_*)
  private class XmlElem(name: String, value: String) extends Elem(null, name, xml.Null, TopScope, false, Text(value))
  
  val MillisInDay = 86400000L // 1000*60*60*24

  val DefXDomain = Play.current.configuration.getString("xdomain.name").getOrElse(
                         throw new RuntimeException("xdomain.name needs to be set in application.conf "))

  val DefAdminFromEmail =  Play.current.configuration.getString("admin.default.fromemail").getOrElse(
                         throw new RuntimeException("admin.default.fromemail needs to be set in application.conf "))   
  val DefEmailHost =  Play.current.configuration.getString("admin.default.emailhost").getOrElse(
                         throw new RuntimeException("admin.default.emailhost needs to be set in application.conf "))  
  val DefAuthEmail = Play.current.configuration.getString("admin.default.authemail").getOrElse(
                         throw new RuntimeException("admin.default.authemail needs to be set in application.conf ")) 
  val DefAuthPasswd = Play.current.configuration.getString("admin.default.authpasswd").getOrElse(
                         throw new RuntimeException("admin.default.authpasswd needs to be set in application.conf "))    
                         
  val DefEmailSubject = Play.current.configuration.getString("admin.default.emailsubject").getOrElse(
                         throw new RuntimeException("admin.default.emailsubject needs to be set in application.conf "))

  val DefEmailSubjectSSO = Play.current.configuration.getString("admin.default.emailsubjectsso").getOrElse(
                         throw new RuntimeException("admin.default.emailsubjectsso needs to be set in application.conf "))

  val DefClinsightEmailFooter = Play.current.configuration.getString("email.clinsight.emailfooter").getOrElse(
                          throw new RuntimeException("email.clinsight.emailfooter needs to be set in application.conf "))

  val DefClinsightEmailCreatePasswordLink = Play.current.configuration.getString("email.clinsight.create_password_link").getOrElse(
                          throw new RuntimeException("email.clinsight.create_password_link needs to be set in application.conf "))
  val DefClinsightEmailSubject = Play.current.configuration.getString("email.clinsight.emailsubject").getOrElse(
    throw new RuntimeException("email.clinsight.emailsubject needs to be set in application.conf "))

  val DefAccountBlockedEmailSubject = Play.current.configuration.getString("admin.default.accountblockedsubject").getOrElse(
                         throw new RuntimeException("admin.default.accountblockedsubject needs to be set in application.conf "))
  
  val EmailSub10Days = Play.current.configuration.getString("email.subject.trial.10days").getOrElse(
                         throw new RuntimeException("email.subject.trial.10days needs to be set in application.conf "))
  val EmailSub20Days = Play.current.configuration.getString("email.subject.trial.20days").getOrElse(
                         throw new RuntimeException("email.subject.trial.20days needs to be set in application.conf "))
  val EmailSub25Days = Play.current.configuration.getString("email.subject.trial.25days").getOrElse(
                         throw new RuntimeException("email.subject.trial.25days needs to be set in application.conf "))
  val EmailSub30Days = Play.current.configuration.getString("email.subject.trial.30days").getOrElse(
                         throw new RuntimeException("email.subject.trial.30days needs to be set in application.conf "))
                         
  val DefPassResetSubject = Play.current.configuration.getString("admin.default.pwdresetsubject").getOrElse(
                         throw new RuntimeException("admin.default.pwdresetsubject needs to be set in application.conf "))
                         
  val DefEmailLink = Play.current.configuration.getString("admin.default.emaillink").getOrElse(
                         throw new RuntimeException("admin.default.emaillink needs to be set in application.conf "))

  val DefEmailLinkRelativeEc = Play.current.configuration.getString("admin.default.email_relative_path_ec").getOrElse(
                         throw new RuntimeException("admin.default.email_relative_path_ec needs to be set in application.conf "))  
  val ProspectEmailLink = Play.current.configuration.getString("ums.domain.name").getOrElse(
                         throw new RuntimeException("ums.domain.name needs to be set in application.conf "))
                         
  val DefEmailPort = Play.current.configuration.getInt("admin.default.port").getOrElse(
                         throw new RuntimeException("admin.default.port needs to be set in application.conf "))

  val ClinsightLogo = Play.current.configuration.getString("clinsight.logo").getOrElse(
                          throw new RuntimeException("clinsight.logo needs to be set in application.conf "))

  val ClinsightRealm = Play.current.configuration.getString("clinsight.default_realm").getOrElse(
                          throw new RuntimeException("clinsight.default_realm needs to be set in application.conf "))

  val ClinsightRole = Play.current.configuration.getString("clinsight.default_role").getOrElse(
                          throw new RuntimeException("clinsight.default_role needs to be set in application.conf "))

  lazy val linkExpiry = Play.current.configuration.getInt("user.link.timeout").getOrElse(300)

  lazy val linkExpiryInDays = Play.current.configuration.getString("user.link.expireDays").getOrElse("5 Days")

  lazy val FailedLoginMaxLimit = Play.current.configuration.getInt("user.failed_login_max_limit").getOrElse(5)

  lazy val BlockUser = Play.current.configuration.getBoolean("user.block_user").getOrElse(true)

  lazy val ActivateBlockedUser = Play.current.configuration.getBoolean("user.activate_blocked_user").getOrElse(true)

  lazy val BlockUserTimePeriod = Play.current.configuration.getInt("user.block_user_time_period").getOrElse(86400)

  lazy val ClinsightLinkExpiry = Play.current.configuration.getInt("clinsight.link.timeout").getOrElse(300)

  lazy val EmailTrialContent = Play.current.configuration.getConfig("emailTrialContent").getOrElse(
                            throw new RuntimeException(s"emailTrialContent must be set in application.conf "))

  val EmailTrialContentObj = Play.current.configuration.getObject("emailTrialContent")

  lazy val TfaOTPExpiry = Play.current.configuration.getInt("tfa.otp.timeout").getOrElse(1800)

  lazy val TfaOTPClock = Play.current.configuration.getInt("tfa.otp.trigger_duration").getOrElse(14)

  val TfaEmailSubject =  Play.current.configuration.getString("tfa.email.subject").getOrElse(
    throw new RuntimeException("tfa.email.subject needs to be set in application.conf "))
  val TwilioAccountSid =  Play.current.configuration.getString("twilio.account_sid").getOrElse(
    throw new RuntimeException("twilio.account_sid needs to be set in application.conf "))
  val TwilioAuthToken =  Play.current.configuration.getString("twilio.auth_token").getOrElse(
    throw new RuntimeException("twilio.auth_token needs to be set in application.conf "))
  val TwilioFromNumber =  Play.current.configuration.getString("twilio.from_number").getOrElse(
    throw new RuntimeException("twilio.from_number needs to be set in application.conf "))

  val GrpUpdtNotificationSubject =  Play.current.configuration.getString("groupUpdateNotification.subject").getOrElse(
    throw new RuntimeException("groupUpdateNotification.subject needs to be set in application.conf "))
  val GrpUpdtNotificationHeader =  Play.current.configuration.getString("groupUpdateNotification.header").getOrElse(
    throw new RuntimeException("groupUpdateNotification.header needs to be set in application.conf "))
  val GrpUpdtNotificationBody =  Play.current.configuration.getString("groupUpdateNotification.body").getOrElse(
    throw new RuntimeException("groupUpdateNotification.header needs to be set in application.conf "))
  val GrpUpdtNotificationFooter =  Play.current.configuration.getString("groupUpdateNotification.footer").getOrElse(
    throw new RuntimeException("groupUpdateNotification.header needs to be set in application.conf "))

  lazy val TableauGenericUsername = Play.current.configuration.getString("tableau.generic_username").getOrElse("generic")

  val log = Logger("Model_Utils")

  val client = HttpClientBuilder.create().build()
  val dateFormat= DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZoneUTC()

  def init() = {
    Twilio.init(TwilioAccountSid, TwilioAuthToken)
  }
  
  def getValForCol (row: Row, colName: String) : Option[Any] = {
    if(row.getColumnDefinitions().contains(colName)){
      val colType = row.getColumnDefinitions().getType(colName).getName().toString()
      val colValue = colType.toLowerCase() match {
        case "bigint" =>  if(row.isNull(colName)) CVDefaultLong else row.getLong(colName)
        case "long" =>  if(row.isNull(colName)) CVDefaultLong else row.getLong(colName)
        case "float" => if(row.isNull(colName)) CVDefaultDouble else row.getFloat(colName)
        case "double" => if(row.isNull(colName)) CVDefaultDouble else row.getDouble(colName)
        case "int" => if(row.isNull(colName)) CVDefaultInt else row.getInt(colName)
        case "boolean" => if(row.isNull(colName)) CVDefaultBool else row.getBool(colName)
        case "timestamp" => if(row.isNull(colName)) "--" else new DateTime(row.getTimestamp(colName), DateTimeZone.UTC).getMillis()
        case "uuid" => if(row.isNull(colName)) CVDefaultUUID else row.getUUID(colName).toString()
        case "timeuuid" => if(row.isNull(colName)) CVDefaultUUID else row.getUUID(colName).toString()
        case "text" => if(row.isNull(colName)) CVDefaultStr else row.getString(colName)
        case "varchar" => if(row.isNull(colName)) CVDefaultStr else row.getString(colName)
        case _ => if(row.isNull(colName)) CVDefaultStr else row.getString(colName)
      }
      Some(colValue)
    } else None

  }

  def loginFailedResponse(status: String, msg: String, data: JsValue, remainingAttempt: Int) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "RemainingAttempt" -> Json.toJson(remainingAttempt))

  def jsonResponse(status: String, msg: String, data: JsValue) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data)

  def jsonResponseRoleTwoAuth(status: String, msg: String, data: JsValue, twoAuth: Boolean) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "TwoAuth" -> twoAuth)

  def jsonResponseWithSession(status: String, msg: String, data: JsValue, session: JsValue, twoAuth: Boolean) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "Session" -> session,
    "TwoAuth" -> twoAuth)

  def jsonResponseTwoAuth(status: String, msg: String, data: JsValue, timeout: String, twoAuth: Boolean) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "Timeout" -> Json.toJson(timeout),
    "TwoAuth" -> twoAuth)

  def jsonResponseSysinfo(status: String, msg: String, data: JsValue, count: Int, group: String = "") = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "Count" -> count,
    "Group" -> group)

  def jsonResponseNotificationInfo(status: String, msg: String, data: JsValue, count: Int) = Json.obj(
    "Status" -> Json.toJson(status),
    "Msg" -> Json.toJson(msg),
    "Data" -> data,
    "Count" -> count)

  def getStringVal(row: Row, colName: String, defaultVal: String): String = {
    if (row.isNull(colName)) defaultVal else row.getString(colName)
  }
  
  def getIntVal (row: Row, colName: String, defaultVal: Int) : Int = {
    if(row.isNull(colName)) defaultVal else row.getInt(colName)
  }
  
  def getLongVal (row: Row, colName: String, defaultVal: Long) : Long = {
    if(row.isNull(colName)) defaultVal else row.getLong(colName)
  }
  
  def getFloatVal (row: Row, colName: String, defaultVal: Float) : Float = {
    if(row.isNull(colName)) defaultVal else row.getFloat(colName)
  }
  
  def getDoubleVal (row: Row, colName: String, defaultVal: Double) : Double = {
    if(row.isNull(colName)) defaultVal else row.getDouble(colName)
  }
  
  def getBooleanVal (row: Row, colName: String, defaultVal: Boolean) : Boolean = {
    if(row.isNull(colName)) defaultVal else row.getBool(colName)
  }
  
  def getDateVal (row: Row, colName: String, defaultVal: Date) : Date = {
    if(row.isNull(colName)) defaultVal else row.getTimestamp(colName)
  }
  
  def getUUIDVal (row: Row, colName: String, defaultVal: UUID) : UUID = {
    if(row.isNull(colName)) defaultVal else row.getUUID(colName)
  }

  def responseTime(startTime: DateTime, endTime: DateTime): Long = {
    val st = startTime.getMillis()
    val et = endTime.getMillis()
    et - st
  }
   
  def withType(x: Any) = x match {
          case i: Int => i
          case l: Long => l
          case f: Float => f
          case d: Double => d
    }
  
 def jsonToXml(json: JsValue) : NodeSeq = {
    def toXml (name: String, json: JsValue): NodeSeq = json match {
      case JsArray(xs) => xs flatMap {v => toXml(name, v)}
      case JsNumber(x) => new XmlElem(name, x.toString)
      case JsString(x) => new XmlElem(name, x)
      case JsBoolean(x) => new XmlElem(name, x.toString)
      case JsNull => new XmlElem(name, "null")
      case JsObject(fields) => new XmlNode(name, (fields flatMap {f => toXml(f._1 , f._2)}).toSeq)
      case _ => Text("")
    }
    
    json match {
      case JsObject(fields) => new XmlNode("Response", (fields flatMap {f => toXml(f._1, f._2)}).toSeq)
      case JsArray(xs) => new XmlNode("DataSet" , xs flatMap {v => jsonToXml(v)})
      case x => toXml("NaN" , x)
    }
  }

  def sendOTPonEmail(user: User, otp: String) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(TfaEmailSubject)
      htmlEmail.addTo(user.email)
      val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
      val f_name = user.first_name
      val l_name = user.last_name
      htmlEmail.setMsg(views.html.otpVerification.render(f_name, l_name, otp, timeString, DefClinsightEmailFooter).body)
      htmlEmail.send()
      log.info(s"Sent an OTP {$otp} to user's email : ${user.email} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the OTP email to the following server failed with exception: $e")
    }
  }

  def vSendOTPonEmail(user: NewUser, otp: String) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(TfaEmailSubject)
      htmlEmail.addTo(user.email)
      val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
      val f_name = user.first_name
      val l_name = user.last_name
      htmlEmail.setMsg(views.html.otpVerification.render(f_name, l_name, otp, timeString, DefClinsightEmailFooter).body)
      htmlEmail.send()
      log.info(s"Sent an OTP {$otp} to user's email : ${user.email} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the OTP email to the following server failed with exception: $e")
    }
  }

  def sendEmail(userEmail: String, tokenId: String, is_create: Boolean, f_name: String, l_name: String) = {
    try {
      val emailSubject = if(is_create && tokenId != "")  DefEmailSubject else if(is_create && tokenId == "") DefEmailSubjectSSO else DefPassResetSubject

      val userDetails = models.User.byEmail(userEmail)
      val user_org = userDetails.get.org
      val urlLink =  DefEmailLink + "/" + tokenId + "/" + userEmail
      val is_external = userDetails.get.is_external
	
	
      val templateDetails = models.Org.getOrgDetails(user_org)
      val template_body = templateDetails.head.email_template_body
      val template_header = templateDetails.head.email_template_header
      val template_footer = templateDetails.head.email_template_footer
      val template_subject = if(templateDetails.head.email_template_subject.equals("NA")) emailSubject else templateDetails.head.email_template_subject
      val template_link = if(templateDetails.head.email_template_link.equals("NA")) urlLink else templateDetails.head.email_template_link
      val template_link_expiry = if(templateDetails.head.email_template_link_expiry.equals("NA")) linkExpiryInDays else templateDetails.head.email_template_link_expiry 

      val end_customer_domain =  if(is_external) templateDetails.head.end_customer_domain else "NA"
      
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(template_subject)
      htmlEmail.addTo(userEmail)
      val url = new URL(urlLink)

      val end_customer_link = if(is_create && tokenId != "" && end_customer_domain !="NA") "https://" + end_customer_domain + DefEmailLinkRelativeEc + "?email=" + userEmail + "&token_id=" + tokenId else "https://" + end_customer_domain + DefEmailLinkRelativeEc + "?email=" + userEmail + "&token_id=" + tokenId + "&forgot_passwd=yes"
      if(is_create && tokenId != ""){
          if(end_customer_domain != "NA"){
          htmlEmail.setMsg(views.html.createPasswordEmail.render(f_name, l_name, end_customer_link , linkExpiryInDays,template_body,template_header,template_footer).body)
          } else {
                  htmlEmail.setMsg(views.html.createPasswordEmail.render(f_name, l_name, template_link, template_link_expiry,template_body,template_header,template_footer).body)
          }
      } else if(is_create && tokenId == "") {
        htmlEmail.setMsg(views.html.createSSOEmail.render(f_name, l_name,templateDetails.head.email_template_link,template_body,template_header,template_footer).body)
      }else {
            if(end_customer_domain != "NA"){
             htmlEmail.setMsg(views.html.forgotPasswordEmail.render(f_name, l_name, end_customer_link, linkExpiryInDays).body)
            } else {
              htmlEmail.setMsg(views.html.forgotPasswordEmail.render(f_name, l_name, urlLink, linkExpiryInDays).body)
            }
      }
      htmlEmail.send()
      log.info(s"Sent mail to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the email to the following server failed with exception: $e")
    }
  }
  def vSendEmail(userEmail: String, tokenId: String, is_create: Boolean, f_name: String, l_name: String) = {
    try {
      val emailSubject = if(is_create && tokenId != "")  DefEmailSubject else if(is_create && tokenId == "") DefEmailSubjectSSO else DefPassResetSubject

      val userDetails = vertica.user.selectRow(userEmail).head
      val is_external = models.Utils.getDBBooleanVal(userDetails,"is_external",CVDefaultBool)
      val user_org = models.Utils.getDBStringDefaultNA(userDetails,"org",CVDefaultStr)
      val prospect_user = models.Utils.getDBBooleanVal(userDetails,"is_prospect",CVDefaultBool)
      log.error(s"===" + userEmail)
      val urlLink =  DefEmailLink + "/" + tokenId + "/" + URLEncoder.encode(userEmail, "UTF-8") + "/" + DefXDomain
      val templateDetails = vertica.org.selectRows(user_org).head
      val template_body = models.Utils.getDBStringDefaultNA(templateDetails,"email_template_body",CVDefaultStr)
      val template_header = models.Utils.getDBStringDefaultNA(templateDetails,"email_template_header",CVDefaultStr)
      val template_footer = models.Utils.getDBStringDefaultNA(templateDetails,"email_template_footer",CVDefaultStr)
      val template_subject = if(models.Utils.getDBStringDefaultNA(templateDetails,"email_template_subject",CVDefaultStr).equals("NA")) emailSubject else models.Utils.getDBStringDefaultNA(templateDetails,"email_template_subject",CVDefaultStr)
      val template_link = if(models.Utils.getDBStringDefaultNA(templateDetails,"email_template_link",CVDefaultStr).equals("NA")) urlLink else models.Utils.getDBStringDefaultNA(templateDetails,"email_template_link",CVDefaultStr)
      val template_link_expiry = if(models.Utils.getDBStringDefaultNA(templateDetails,"email_template_link_expiry",CVDefaultStr).equals("NA")) linkExpiryInDays else models.Utils.getDBStringDefaultNA(templateDetails,"email_template_link_expiry",CVDefaultStr)
      val end_customer_domain =  if(is_external) models.Utils.getDBStringDefaultNA(templateDetails,"end_customer_domain",CVDefaultStr) else "NA"

      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(template_subject)
      htmlEmail.addTo(userEmail)
      val url = new URL(urlLink)
      val end_customer_link = if(is_create && tokenId != "" && end_customer_domain !="NA") "https://" + end_customer_domain + DefEmailLinkRelativeEc + "?email=" + URLEncoder.encode(userEmail, "UTF-8") + "&token_id=" + tokenId + "&cookie_domain="+ DefXDomain else "https://" + end_customer_domain + DefEmailLinkRelativeEc + "?email=" + URLEncoder.encode(userEmail, "UTF-8") + "&token_id=" + tokenId + "&forgot_passwd=yes&cookie_domain="+ DefXDomain

      val prospect_user_create_password_link = DefClinsightEmailCreatePasswordLink + "?email=" + URLEncoder.encode(userEmail, "UTF-8") + "&token_id=" + tokenId + "&cookie_domain="+ DefXDomain 

      if(is_create && tokenId != ""){
        if(end_customer_domain != "NA"){
          htmlEmail.setMsg(views.html.createPasswordEmail.render(f_name, l_name, end_customer_link , linkExpiryInDays,template_body,template_header,template_footer).body)
        } else {
          htmlEmail.setMsg(views.html.createPasswordEmail.render(f_name, l_name, template_link, template_link_expiry,template_body,template_header,template_footer).body)
        }
      } else if(is_create && tokenId == "") {
        htmlEmail.setMsg(views.html.createSSOEmail.render(f_name, l_name,models.Utils.getDBStringDefaultNA(templateDetails,"email_template_link",CVDefaultStr),template_body,template_header,template_footer).body)
      }else {
        if(end_customer_domain != "NA"){
          htmlEmail.setMsg(views.html.forgotPasswordEmail.render(f_name, l_name, end_customer_link, linkExpiryInDays).body)
        } else {
          if(prospect_user){
           htmlEmail.setMsg(views.html.forgotPasswordEmail.render(f_name, l_name, prospect_user_create_password_link, linkExpiryInDays).body)
          }else{  
            htmlEmail.setMsg(views.html.forgotPasswordEmail.render(f_name, l_name, urlLink, linkExpiryInDays).body)
            }
          }
      }
      htmlEmail.send()
      log.info(s"Sent mail to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the email to the following server failed with exception: $e")
    }
  }
  
  def sendEmailToProspect(userEmail: String, tokenId: String, f_name: String, l_name: String) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(DefClinsightEmailSubject)
      htmlEmail.addTo(userEmail)
      val urlLink = ProspectEmailLink + "/cs/campaign/user/verification" + "?email=" + URLEncoder.encode(userEmail, "UTF-8") + "&token_id=" + tokenId
      val url = new URL(urlLink)
      val timeString = models.Utils.calculateTimetoShowDays(ClinsightLinkExpiry)
      htmlEmail.setMsg(views.html.verificationEmail.render(f_name, l_name, urlLink, timeString, DefClinsightEmailFooter).body)
      htmlEmail.send()

      log.info(s"Sent mail to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the email to the following server failed with exception: $e")
    }
  }

  def sendWelcomeProspectEmail(userEmail: String, f_name: String, l_name: String, expiryDays: Int) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(DefClinsightEmailSubject)
      val linkExpiry = models.Utils.calculateTimetoShowDays(ClinsightLinkExpiry)
      htmlEmail.addTo(userEmail)
      htmlEmail.setMsg(views.html.sendWelcomeProspectEmail.render(userEmail, f_name, l_name, Auth.LoginPageUrl, expiryDays, "", DefClinsightEmailFooter).body)
      htmlEmail.send()
      log.info(s"Sent Welcome Email to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the Welcome email to the user $userEmail failed with exception: $e")
    }
  }
  
  def sendWelcomeEmail(userEmail: String, f_name: String, l_name: String, expiryDays: Int, emailSubject: String, isCreated: Boolean) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      if(isCreated) {
        htmlEmail.setSubject(DefEmailSubject)
      } else {
        htmlEmail.setSubject(emailSubject)
      }
      htmlEmail.addTo(userEmail)
      htmlEmail.setMsg(views.html.mailBody.render(userEmail, f_name, l_name, Auth.LoginPageUrl, expiryDays, isCreated, DefClinsightEmailFooter).body)
      htmlEmail.send()
      log.info(s"Sent Welcome Email to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending the Welcome email to the user $userEmail failed with exception: $e")
    }
  }

  def sendAccountBlockedEmail(userEmail: String, f_name: String, l_name: String, last_failed_login_time: DateTime, timeString: String) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(DefAccountBlockedEmailSubject)
      htmlEmail.addTo(userEmail)
      htmlEmail.setMsg(views.html.accountBlockedEmail.render(f_name, l_name, timeString).body)
      htmlEmail.send()
      log.info(s"Sent Alert Email to user ${userEmail} ")
    } catch {
      case e: Exception =>
        log.error(s"Sending alert email to the user $userEmail failed with exception: $e")
    }
  }

  def getHexString(messageDigest: Array[Byte]): String = {
    val hexString: StringBuffer = new StringBuffer
    messageDigest foreach { digest =>
      val hex = Integer.toHexString(0xFF & digest)
      if (hex.length == 1) hexString.append('0' + hex) else hexString.append(hex)
    }
    hexString.toString
  }
  
  def encryptPasswd(passwd: String) : String = {
    val algorithm: MessageDigest = MessageDigest.getInstance("SHA-256")
    val defaultBytes: Array[Byte] = passwd.getBytes
    algorithm.reset
    algorithm.update(defaultBytes)
    val messageDigest: Array[Byte] = algorithm.digest
    getHexString(messageDigest)
  }

  def calculateTimetoShow(input: Int): String = {
    val timeString = input match {
      case x if(x<60) => if (x == 1) "%s second".format(x) else "%s seconds".format(x)
      case x if(x>= 60 && x < 3600) => {var timeMin = x/60
        val timeSec = x%60
        timeMin = if (timeSec > 0) {timeMin + 1} else timeMin
        if(timeMin == 1) "%s minute".format(timeMin) else "%s minutes".format(timeMin)
      }
      case x if(x>=3600) => {var timeHrs = x/3600
        val timeSec = x%3600
        timeHrs = if (timeSec > 0) {timeHrs + 1} else timeHrs
        if(timeHrs == 1) "%s hour".format(timeHrs) else "%s hours".format(timeHrs)
      }
    }
    timeString
  }

  def calculateTimetoShowDays(input: Int): String = {
    val timeString = input match {
      case x if(x<60) => if (x == 1) "%s second".format(x) else "%s seconds".format(x)
      case x if(x>= 60 && x < 3600) => {var timeMin = x/60
        val timeSec = x%60
        timeMin = if (timeSec > 0) {timeMin + 1} else timeMin
        if(timeMin == 1) "%s minute".format(timeMin) else "%s minutes".format(timeMin)
      }
      case x if(x>=3600 && x < 86400) => {var timeHrs = x/3600
        val timeSec = x%3600
        timeHrs = if (timeSec > 0) {timeHrs + 1} else timeHrs
        if(timeHrs == 1) "%s hour".format(timeHrs) else "%s hours".format(timeHrs)
      }
      case x if(x>=86400) => {var timeDays = x/86400
        val timeHrs = x%86400
        timeDays = if (timeHrs > 0) {timeDays + 1} else timeDays
        if(timeDays == 1) "%s day".format(timeDays) else "%s days".format(timeDays)
      }
    }
    timeString
  }
  
  def Desc[T : Ordering] = implicitly[Ordering[T]].reverse

  def failureStringToXML(msg: String, code: Int) : scala.xml.Elem = {
    val xmlString = "<rsp stat=\"fail\" version=\"1.0\"><err code=\""+code+"\">" + msg + "</err></rsp>"
    val res = scala.xml.XML.loadString(xmlString)
    res
  }

  def successStringToXML(user: ClinsightUserInfo, envs: List[ClinsightEnvironment], defUrl: String, token: String) : scala.xml.Elem = {
    def userXML(u: ClinsightUserInfo) : String = {
      val userInfo = "<user><first_name>"+ u.first_name +"</first_name><last_name>"+ u.last_name +"</last_name><username>"+ u.email +"</username></user>"
      userInfo
    }

    def envXML(envs: List[ClinsightEnvironment]): String = {
      if(envs.isEmpty) {
        ""
      }
      else {
        val envInfo = envs.foldLeft("") { (z, f) =>
          "<environment><label>"+ f.label +"</label><key>"+ f.key +"</key><value>"+ f.value +"</value></environment>" ++ z
        }
        val envsInfo = "<environments>" +envInfo+ "</environments>"
        envsInfo
      }
    }

    def defaultXML(url: String): String = {
      if(url.isEmpty()) {
        ""
      }
      else {
        "<default><url>"+ url +"</url></default>"
      }
    }

    def tokenXML(token: String): String = {
      if(token.isEmpty()) {
        ""
      }
      else {
        "<token>"+ token +"</token>"
      }
    }

    val userInfo = userXML(user)
    val envsInfo = envXML(envs)
    val urlInfo = defaultXML(defUrl)
    val tokenInfo = tokenXML(token)
    val xmlString = "<rsp stat=\"ok\" version=\"1.0\">"+ userInfo + envsInfo + urlInfo + tokenInfo + "</rsp>"
    log.debug(s"xmlString : $xmlString")
    val res = scala.xml.XML.loadString(xmlString)
    res
  }

  def isAdminBool(user: User, domains: RoleDetails): Boolean = {
    var isAdmin = false
    val features = domains.features
    val domainlist = domains.domains
    val mfr = user.mps_def.split(":")
    log.debug(s"MFR===${mfr}")
    for ((k, v) <- domainlist) {
      val mps = v.split(":")
      if (mps(0).equals(mfr(0))) {
        log.debug(s"MPS====${mps}")
        if (features(v).contains("admin")) {
          isAdmin = true
        }
      }
    }
    isAdmin
  }

  def vIsAdminBool(user: NewUser, domains: RoleDetails): Boolean = {
    var isAdmin = false
    val features = domains.features
    val domainlist = domains.domains
    val mfr = user.mps_def.split(":|/")
    log.debug(s"MFR===${mfr}")
    for ((k, v) <- domainlist) {
      val mps = v.split(":|/")
      if (mps(0).equals(mfr(0))) {
        log.debug(s"MPS====${mps}")
        if (features(v).contains("admin")) {
          isAdmin = true
        }
      }
    }
    isAdmin
  }

  def createCookie(user: User, domains: RoleDetails, isAdmin: Boolean, currentTime: String, request: Request[AnyContent]): Map[String, String] = {
    val cookie: Map[String, String] = Map(
      SKUserFName -> user.first_name,
      SKUserLName -> user.last_name,
      SKUserId -> user.email,
      SKUserOrg -> user.org,
      SKUserRole -> user.role,
      SKDashboardAdmin -> user.dashboard_admin.toString,
      SKRemoteAddress -> request.remoteAddress,
      SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
      SKUserDomains -> domains.domains.values.mkString(","),
      SKProjLimit -> domains.studio_proj_limit.toString,
      SKAdmin -> isAdmin.toString,
      SKCurrentTime -> currentTime)
    cookie
  }

  def vCreateCookie(user: NewUser, domains: RoleDetails, isAdmin: Boolean, currentTime: String, request: Request[AnyContent]): Map[String, String] = {
    val cookie: Map[String, String] = Map(
      SKUserFName -> user.first_name,
      SKUserLName -> user.last_name,
      SKUserId -> user.email,
      SKUserOrg -> user.org,
      SKUserRole -> user.role,
      SKDashboardAdmin -> user.dashboard_admin.toString,
      SKRemoteAddress -> request.remoteAddress,
      SKUserRealms -> domains.realm.mkString(","),
      SKUserDomains -> domains.domains.values.mkString(","),
      SKProjLimit -> domains.studio_proj_limit.toString,
      SKAdmin -> isAdmin.toString,
      SKCurrentTime -> currentTime)
    cookie
  }

  def genClinsightCacheKeyValue(username: String, clientIP: String): (String, String) = {
    (s"clinsight:$username", scala.util.hashing.MurmurHash3.stringHash("ctoken" + username + clientIP).toString())
  }

  def encryptString(text: String): Option[String] = {
    try {
      val cipher = Cipher.getInstance(EncAlgorithm)
      cipher.init(Cipher.ENCRYPT_MODE, EncKey, EncIvSpec)
      val enc = new String(Base64.getEncoder.encode(cipher.doFinal(text.getBytes("utf-8"))), "utf-8")
      val encodedEnc = URLEncoder.encode(enc, "UTF-8")
      log.debug(s"Encrypted value of $text : $encodedEnc")
      Some(encodedEnc)
    }catch {
      case e: Exception =>
        log.error(s"Failed to encrypt $text, failed with exception: $e")
        None
    }
  }

  def decryptString(username: String): Option[String] = {
    try {
      val text = URLDecoder.decode(username, "UTF-8")
      val cipher = Cipher.getInstance(EncAlgorithm)
      cipher.init(Cipher.DECRYPT_MODE, EncKey, EncIvSpec)
      val dcrpt = new String(cipher.doFinal(Base64.getDecoder.decode(text.getBytes("utf-8"))), "utf-8")
      log.debug(s"Decrypted value of $text : $dcrpt")
      Some(dcrpt)
    }catch {
      case e: Exception =>
        log.error(s"Failed to decrypt $username, failed with exception: $e")
        None
    }
  }

  def getStringData(x: Option[String]) = x match {
    case Some(s) => s
    case None => ""
  }

  def generateRandomNumber(): String = {
    val r = new Random()
    (1 to 6).map { _ => r.nextInt(10).toString }.mkString
  }

  def sendOTPonPhone(user: User, otp: String):String = {
    val from = new PhoneNumber(TwilioFromNumber)
    val phoneNumber = user.phone.split("-").mkString("")
    val to = new PhoneNumber(phoneNumber)
    val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
    val body = s"Your one time security code to login to Glassbeam is $otp. This code is valid for $timeString. If you did not request this code, please contact $SupportEmail"
    Try(Message.creator(to, from, body).create()) match {
      case Success(message) =>
        log.debug(s"OTP {$otp} sent to ${user.phone}")
        log.debug(s"Twilio message : ${message}")
        s"OTP {$otp} sent to ${user.phone}"
      case Failure(error) =>
        log.debug(s"Failed to sent an OTP {$otp} to ${user.phone}. Encountered an exception: ${error.getMessage}")
        s"Encountered an exception: n${error.getMessage}"
    }
  }

  def vSendOTPonPhone(user: NewUser, otp: String):String = {
    val from = new PhoneNumber(TwilioFromNumber)
    val phoneNumber = user.phone.split("-").mkString("")
    val to = new PhoneNumber(phoneNumber)
    val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
    val body = s"Your one time security code to login to Glassbeam is $otp. This code is valid for $timeString. If you did not request this code, please contact $SupportEmail"
    Try(Message.creator(to, from, body).create()) match {
      case Success(message) =>
        log.debug(s"OTP {$otp} sent to ${user.phone}")
        log.debug(s"Twilio message : ${message}")
        s"OTP {$otp} sent to ${user.phone}"
      case Failure(error) =>
        log.debug(s"Failed to sent an OTP {$otp} to ${user.phone}. Encountered an exception: ${error.getMessage}")
        s"Encountered an exception: n${error.getMessage}"
    }
  }

  def createRoleQry(qryType: String, i: Int, twoAuthEnabledAtMPSLevel: Boolean): String = {
    qryType match {
      case "INSERT" => {
        s"INSERT INTO $KsUMS.$CFNRole (name, super, domains, permissions, realm, two_auth_support) VALUES (?, ?, ?, ?, ?, ?);"
      }

      case _ => {
        if(twoAuthEnabledAtMPSLevel){
          if(i == 0)
            s"UPDATE $KsUMS.$CFNRole set domains = ?, permissions = ?, realm = ?, two_auth_support = ? where name = ?;"
          else
            s"UPDATE $KsUMS.$CFNRole set domains = domains + ?, permissions = permissions + ?, realm = ?, two_auth_support = ? where name = ?;"
        }
        else{
          if(i == 0)
            s"UPDATE $KsUMS.$CFNRole set domains = ?, permissions = ?, realm = ? where name = ?;"
          else
            s"UPDATE $KsUMS.$CFNRole set domains = domains + ?, permissions = permissions + ?, realm = ? where name = ?;"
        }
      }
    }
  }

  def getISURLDomain(mfr: String, prod: String, sch: String): String = {
    try {
      val result = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr='$mfr' AND prod='$prod' AND sch='$sch';")
      val rows = result.asScala.toList
      if (rows.nonEmpty) {
        var realmName = rows(0).getString("realm")
        val realmUrl = Role.getRealmUrl(realmName)
        log.debug(s"IS host for {$mfr:$prod:$sch} : ${realmUrl._1}")
        realmUrl._1
      } else {
        log.error(s"Failed to fetch realm from $CFNMpseSSO table for mps : {$mfr:$prod:$sch}")
        ""
      }
    } catch {
      case e: Exception =>
        log.error(s"Failed to fetch realm from $CFNMpseSSO table {$mfr:$prod:$sch}, failed with exception: $e")
        ""
    }
  }

  def vGetISURLDomain(mfr: String, prod: String, sch: String): String = {
    try {
      val rows = vertica.sso_details.selectRealm(s"$mfr/$prod/$sch")
      if (rows.nonEmpty) {
        var realmName = getDBStringVal(rows.head, vertica.sso_details.Col_realm)
        val realmUrl = vertica.realm.selectRealmUrl(realmName)
        log.debug(s"IS host for {$mfr/$prod/$sch} : ${realmUrl._1}")
        realmUrl._1
      } else {
        log.error(s"Failed to fetch realm from $CFNMpseSSO table for mps : {$mfr:$prod:$sch}")
        ""
      }
    } catch {
      case e: Exception =>
        log.error(s"Failed to fetch realm from $CFNMpseSSO table {$mfr:$prod:$sch}, failed with exception: $e")
        ""
    }
  }

  def maskTwoAuth(twoAuthList: List[TwoAuthDevices]): List[TwoAuthDevices] = {
    val twoAuth = twoAuthList.head
    val maskedEmail = maskEmail(twoAuth.email)
    val maskedNumber = twoAuth.phone match {
      case Some(n) => Some(maskNumber(n))
      case _ => None
    }
    val maskedTwoAuthList = maskedNumber match {
      case Some(n) => List(TwoAuthDevices(maskedEmail, maskedNumber))
      case _ => List(TwoAuthDevices(maskedEmail))
    }
    maskedTwoAuthList
  }

  def maskNumber(nmbr: String): String = {
    val numberPhone = nmbr.replace("-","")
    numberPhone.replaceAll("[^\\d\\+]", "").replaceAll("\\d(?=\\d{3})", "*")
  }

  def maskEmail(email: String): String = {
    email.replaceAll("(?<=.{2}).(?=[^@]*?.@)", "*")
  }

  def checkTwoFARequired(version: String, mfr: String, prod: String, sch: String, request: Request[AnyContent], userState: (Option[String], String, String)): Boolean = {
    val tfaTriggerDuration = version match{
      case constants.VERTICA_VERSION => models.vOrg.twoAuthTriggerDuration(mfr, prod, sch)
      case _ => models.Org.twoAuthTriggerDuration(mfr, prod, sch)
    }
    val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
    if(tfaTriggerDuration == 0 || (tfaTriggerDuration > 0 && (userState._1.get.equals(UserInvited) || userState._2.isEmpty() || userState._3.isEmpty() || ((currentTs - userState._2.toLong) >= (tfaTriggerDuration * 24 * 60 * 60 * 1000)) || !userState._3.equals(request.remoteAddress)))) true else false
  }

  def getValueForDSRelationalColumn(rs: java.sql.ResultSet, colNameTypeMap: Map[String, String], colName: String) : Option[Any] = {
    if(colNameTypeMap.contains(colName)){
      val colType = colNameTypeMap(colName)
      if(colName.equals(vertica.alert_filter_attributes.Col_rule_id) ||
          colName.equals(vertica.alert_filter_attributes.Col_filter_id) ||
          colName.equals(vertica.notification.Col_notification_id) ||
          colName.equals(vertica.notification.Col_rule_id) ||
          colName.equals(vertica.role.Col_role_id) ||
          colName.equals(vertica.role_realms.Col_role_id) ||
          colName.equals(vertica.role_realms.Col_realm_id) ||
          colName.equals(vertica.realm.Col_realm_id) ||
          colName.equals(vertica.user.Col_role_id) ||
          colName.equals(vertica.user.Col_realm_id) ||
          colName.equals(vertica.user_activity.Col_month) ||
          colName.equals(vertica.end_customer.Col_endcustomer_id) ||
          colName.equals(vertica.end_customer_group.Col_group_id) ||
          colName.equals(vertica.end_customer_group.Col_sub_group_id) ||
          colName.equals(vertica.end_customer_serials.Col_endcustomer_id) ||
          colName.equals(vertica.clinsights_role.Col_clinsights_role_id) ||
          colName.equals(vertica.clinsights_dashboard.Col_dashboard_id)){
        if(rs.getLong(colName) == 0L) Some(CVDefaultLong) else Some(rs.getLong(colName))
      } else {
        val colValue = colType.toLowerCase match {
          case "bigint" => if (rs.getLong(colName) == 0L) CVDefaultLong else rs.getLong(colName)
          case "long" => if (rs.getLong(colName) == 0L) CVDefaultLong else rs.getLong(colName)
          case "float" => if (rs.getFloat(colName) == 0.0) CVDefaultDouble else rs.getFloat(colName)
          case "double" => if (rs.getDouble(colName) == 0.0) CVDefaultDouble else rs.getDouble(colName)
          case "integer" => if (rs.getInt(colName) == 0) CVDefaultInt else rs.getInt(colName)
          case "boolean" => if (rs.getBoolean(colName) == false) CVDefaultBool else rs.getBoolean(colName)
          case "timestamp" => if (rs.getTimestamp(colName) == null) "--" else new Date(rs.getTimestamp(colName).getTime())
          case "uuid" => if (rs.getString(colName) == null) CVDefaultUUID else rs.getString(colName)
          case "timeuuid" => if (rs.getString(colName) == null) CVDefaultUUID else rs.getString(colName)
          case "text" => if (rs.getString(colName) == null) CVDefaultStr else rs.getString(colName)
          case "varchar" => if (rs.getString(colName) == null) CVDefaultStr else rs.getString(colName)
          case _ => {
            log.debug(s"colName: $colName, $colType")
            if (rs.getString(colName) == null) CVDefaultStr else rs.getString(colName)
          }
        }
        Some(colValue)
      }
    } else None
  }

  def getDBStringVal(row: Map[String, Option[Any]], colName: String, defaultVal: String = CVDefaultStr): String = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultStr)) defaultVal else s.toString
      case None => defaultVal
    }
  }
  def getDBStringDefaultNA(row: Map[String, Option[Any]], colName: String, defaultVal: String = CVDefaultStr): String = {
    row(colName) match {
      case Some(s) => if(s.equals("")) defaultVal else s.toString
      case None => defaultVal
    }
  }

  def getDBIntVal (row: Map[String, Option[Any]], colName: String, defaultVal: Int = CVDefaultInt) : Int = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultInt)) defaultVal else s.asInstanceOf[Int]
      case None => defaultVal
    }
  }

  def getDBLongVal (row: Map[String, Option[Any]], colName: String, defaultVal: Long = CVDefaultLong) : Long = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultLong)) defaultVal else s.asInstanceOf[Long]
      case None => defaultVal
    }
  }

  def getDBFloatVal (row: Map[String, Option[Any]], colName: String, defaultVal: Float = CVDefaultDouble.toFloat) : Float = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultDouble)) defaultVal else s.asInstanceOf[Float]
      case None => defaultVal
    }
  }

  def getDBDoubleVal (row: Map[String, Option[Any]], colName: String, defaultVal: Double) : Double = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultDouble)) defaultVal else s.asInstanceOf[Double]
      case None => defaultVal
    }
  }

  def getDBBooleanVal (row: Map[String, Option[Any]], colName: String, defaultVal: Boolean = CVDefaultBool) : Boolean = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultBool)) defaultVal else s.asInstanceOf[Boolean]
      case None => defaultVal
    }
  }

  def getDBDateVal (row: Map[String, Option[Any]], colName: String, defaultVal: Date) : java.util.Date = {
    row(colName) match {
      case Some(s) => if(s.equals("--")) defaultVal else s.asInstanceOf[java.util.Date]
      case None => defaultVal
    }
  }

  def getDBTimestampVal (row: Map[String, Option[Any]], colName: String, defaultVal: Timestamp) : Timestamp= {
    row(colName) match {
      case Some(s) => if(s.equals("--")) defaultVal else s.asInstanceOf[Timestamp]
      case None => defaultVal
    }
  }

  def getDBDateTimeVal (row: Map[String, Option[Any]], colName: String, defaultVal: DateTime) : DateTime= {
    row(colName) match {
      case Some(s) => if(s.equals("--"))  defaultVal else s.asInstanceOf[DateTime]
      case None => defaultVal
    }
  }
  def getDBUUIDVal (row: Map[String, Option[Any]], colName: String, defaultVal: UUID = CVDefaultUUID) : UUID = {
    row(colName) match {
      case Some(s) => if(s.equals(CVDefaultUUID)) defaultVal else s.asInstanceOf[UUID]
      case None => defaultVal
    }
  }

  def getAuthMPSName(version: String, mfr: String, prod: String, sch: String): String = {
    version match{
      case constants.VERTICA_VERSION => s"$mfr/$prod/$sch"
      case constants.CASSANDRA_VERSION => s"$mfr:$prod:$sch"
    }
  }

  def getAuthMPSTupple(version: String, mps: String): List[String] = {
    version match{
      case constants.VERTICA_VERSION => mps.split("/").toList
      case constants.CASSANDRA_VERSION => mps.split(":").toList
    }
  }

  def getVerticaCusterDetailsForMps(mfr: String, prod: String, sch: String, reqSessionOpt: Option[Cookie]): (String, VertClusterHostDetailsMPS, String) = {
    try {
      val IS_Host = models.Utils.vGetISURLDomain(mfr, prod, sch)
      val isUrl = s"$IS_Host/vertica/cluster/details/$mfr/$prod/$sch"
      val reqSession = reqSessionOpt.get
      val futureResponse = WS.url(isUrl).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).get.map { response =>
        response.statusText match {
          case "OK" =>
            val ks = (response.json \ "Data" \ "ks").as[String]
            val clusterId = (response.json \ "Data" \ "clusterId").as[Int]
            val verticaHosts = (response.json \ "Data" \ "verticaHosts").as[String]
            val verticaPort = (response.json \ "Data" \ "verticaPort").as[Int]
            val verticaDb = (response.json \ "Data" \ "verticaDb").as[String]
            val username = (response.json \ "Data" \ "username").as[String]
            val password = (response.json \ "Data"\ "password").as[String]
            val clusterDetails = VertClusterHostDetailsMPS(mfr, prod, sch, ks, clusterId, verticaHosts, verticaPort, verticaDb, username, password)
            val msg = (response.json \ "Msg").get.as[String]
            (FKSuccess, clusterDetails, msg)
          case _ =>
            log.debug(s"Failed to fetch vertica cluster info from IS-H2 [$mfr:$prod:$sch]")
            (FKError , VertClusterHostDetailsMPS("", "", "", "", 0, "", 0, "", "", ""), "")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      (wsResponse._1, wsResponse._2, wsResponse._3)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        (FKError, VertClusterHostDetailsMPS("", "", "", "", 0, "", 0, "", "", ""), "")
      }
    }
  }

  def httpPostClientBuilder(url: String, template: JsValue): JsValue = {
    log.debug(s"Url called with Post Method : $url and payload $template")
    val post = new HttpPost(url)
    post.setEntity(new StringEntity(template.toString()))
    post.addHeader("Content-Type", "application/json")
    val response = client.execute(post)
    val entity = response.getEntity()
    val content = EntityUtils.toString(entity)
    Json.parse(content)
  }

  def httpGetClientBuilder[T](url: String): JsValue = {
    log.debug(s"Url called with Get Method : $url")
    val get = new HttpGet(url)
    val response = client.execute(get)
    val entity = response.getEntity()
    val content = EntityUtils.toString(entity)
    Json.parse(content)
  }

  def sendUserGroupUpdateNotification(user: NotificationDetails) = {
    try {
      val htmlEmail = new HtmlEmail()
      htmlEmail.setDebug(false)
      htmlEmail.setHostName(DefEmailHost)
      htmlEmail.setSmtpPort(DefEmailPort)
      htmlEmail.setAuthenticator(new DefaultAuthenticator(DefAuthEmail, DefAuthPasswd))
      htmlEmail.setFrom(DefAdminFromEmail)
      htmlEmail.setSocketConnectionTimeout(600000)
      htmlEmail.setSocketTimeout(600000)
      htmlEmail.setStartTLSEnabled(true)
      htmlEmail.setSSLOnConnect(false)
      htmlEmail.setSubject(GrpUpdtNotificationSubject)
      htmlEmail.addTo(user.email)
      val f_name = user.first_name
      val l_name = user.last_name
      val group = user.ec
//      val templateDetails = models.vOrg.getOrgDetails(user.org)
      val header = GrpUpdtNotificationHeader
      val body = GrpUpdtNotificationBody
      val footer = GrpUpdtNotificationFooter
      htmlEmail.setMsg(views.html.groupUpdateNotification.render(f_name, l_name, group, header, body, footer).body)
      htmlEmail.send()
      log.info(s"Sent notification to user ${user.email} about the group updates of group name ${user.ec} ")
    } catch {
      case e: Exception =>
        log.error(s"Exception caused while sending notification to the ${user.email}, server failed with exception: $e")
    }
  }

  def refreshInvitedUserSysIds(m: String, p: String, s: String, uState: String, users: List[String], cSess: Option[Cookie]) = {
    if(uState.equals(UserInvited)){
      val gMPS = s"$m/$p/$s"
      models.RulesAlerts.refreshAECache(m, p, s, gMPS, Some(users), None, cSess)
    }
  }

  def nonEmptySeq[T]: Constraint[Seq[T]] = Constraint[Seq[T]]("constraint.required") { o =>
    if (o.nonEmpty) Valid else Invalid(ValidationError("error.required"))
  }
}

