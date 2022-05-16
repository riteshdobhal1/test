package models

import java.net.URLEncoder
import java.util.{ArrayList, Date}
import constants._
import org.apache.http.NameValuePair
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.{HttpGet, HttpPost}
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.message.BasicNameValuePair
import org.apache.http.util.EntityUtils
import org.joda.time.{DateTime, DateTimeZone}
import play.api.Logger
import play.api.libs.ws.WS
import play.api.Play.current
import Utils._
import controllers.Clinsight.{auth_email, auth_password, auth_user_key, log, resultWithCORSDisabled}
import org.mindrot.jbcrypt.BCrypt

import scala.collection.JavaConversions._
import scala.util.{Failure, Success, Try}
import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import dao._
import models.vUser.enable

case class ClinsightUserData(first_name: String, last_name: String, company_name: String, email: String)
case class EmailData(auth_email: String, auth_password: String, auth_user_key: String, first_name: String, last_name: String, company: String, email: String, api_key: String)
case class AuthCreds(auth_email: String, auth_password: String, auth_user_key: String)
case class ClinsightLogin(username: String, password: String, user_device_info: Option[UserDeviceInfo])
case class ClinsightEnvironment(label: String, key: String, value: String)
case class ClinsightUserInfo(first_name: String, last_name: String, email: String, is_external: Boolean, mps_def: String, org: String, realm_def: String, role: String, url_def: String, end_customer: Option[String])
case class ClinsightSetDefaultMPS(username: String, mps: String, token: String)
case class ClinsightAddProspectForm(first_name: String, last_name: String, username: String, password: String, company_name: String)
case class ClinsightUserDetails(username: String, token: String)
case class UserDeviceInfo(username: Option[String], token: Option[String], device_token: String, app_type: Int, app_id: String)
case class ClinsightsLoginResponse(username: Option[String], enc_username: Option[String], first_name: Option[String], last_name: Option[String], role: Option[String], token: String, mps_def: String, mps_list: List[Map[String, String]], clinsights_base_url: Option[String], clinsights_landing_page_report_url: Option[String])


object vClinsight {
  val log = Logger("Model_vClinsight")
  val BCryptLogRounds = 10

  /** Authenticates user(Pardot server)
    *
    * @return auth-token
    */
  def pardotLogin(authData : AuthCreds): String = {
    try {
      val startTime = DateTime.now
      val loginUrl = pardotLoginUrl
      log.debug(s"Pardot Login URI: $loginUrl")
      val post = new HttpPost(loginUrl)
      post.addHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      val client = HttpClientBuilder.create().build()
      val nameValuePairs = new ArrayList[NameValuePair](1)
      nameValuePairs.add(new BasicNameValuePair("email", authData.auth_email))
      nameValuePairs.add(new BasicNameValuePair("password", authData.auth_password))
      nameValuePairs.add(new BasicNameValuePair("user_key", authData.auth_user_key))
      post.setEntity(new UrlEncodedFormEntity(nameValuePairs))
      log.debug(s"Request body: $nameValuePairs")
      val response = client.execute(post)
      val responseEntity = response.getEntity()
      val content = EntityUtils.toString(responseEntity)
      log.debug(s"Pardot login API response: $content")
      val token = (scala.xml.XML.loadString(content) \\ "rsp" \\ "api_key").text
      log.debug(s"Token received: $token")
      token
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login Pardot server, exception:  " + ex)
        s""
      }
    }
  }

  /** Creates an entry in Pardot server
    *
    * @return XML with user details
    */
  def createMail(mailData : EmailData): Try[scala.xml.Elem] = {
    try {
      val startTime = DateTime.now
      val url = s"$pardotMailUrl/${mailData.email}"
      val fn = URLEncoder.encode(mailData.first_name, "UTF-8")
      val ln = URLEncoder.encode(mailData.last_name, "UTF-8")
      val cmp = URLEncoder.encode(mailData.company, "UTF-8")
      val qp = s"first_name=$fn&last_name=$ln&api_key=${mailData.api_key}&user_key=${mailData.auth_user_key}&company=$cmp"
      val encodedUrl = s"$url?$qp"
      log.debug(s"Pardot Mail URI: $encodedUrl")
      val get = new HttpGet(encodedUrl)
      val client = HttpClientBuilder.create().build()
      val response = client.execute(get)
      val responseEntity = response.getEntity()
      val content = EntityUtils.toString(responseEntity)
      log.debug(s"Pardot mail response: $content")
      Success(scala.xml.XML.loadString(content))
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login Pardot server, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Authenticates user(GB UMS) and get user details
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def login(userPayload: ClinsightLogin, token: String): Try[scala.xml.Elem] = {
    try {
      val username = userPayload.username
      val password = userPayload.password
      val emailPasswdMatch = models.vUser.emailPasswdMatch(username, password)
      if(emailPasswdMatch._2){
        val user = models.vUser.byEmail(username).get
        val user_state = models.vUser.getUserState(username)
        val uStateStr = user_state._1.getOrElse("")
        if(uStateStr.equals(UserInactive)){
          log.error(s"User is not active : $username")
          throw new RuntimeException(s"UserInactive")
        } else if(uStateStr.equals(UserInvited)) {
          enable(username, None)
          val singleMPSList = user.mps_def.split("/").toList
          val gMPS = s"${singleMPSList(0)}/${singleMPSList(1)}/${singleMPSList(2)}"
//          models.RulesAlerts.refreshAECache(singleMPSList(0), singleMPSList(1), singleMPSList(2), gMPS, Some(List(user.email)), None, None)
          dao.DBUtils.updateUserDeviceInfo(username, userPayload.user_device_info, user)
          getUserDetails(username, token)
        } else{
          dao.DBUtils.updateUserDeviceInfo(username, userPayload.user_device_info, user)
          getUserDetails(username, token)
        }
      }
      else {
        log.error(s"Failed to login for username : $username")
        throw new RuntimeException(s"InvalidCredentials")
      }
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Set default MPS of a user. Updates mps_def and realm_def of `user` CF
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def setDefaultMPS(username: String, mps: String): Try[scala.xml.Elem] = {
    try {
      val rows = vertica.sso_details.selectRealm(mps)
      if(!rows.isEmpty) {
        val row = rows.head
        val realm = models.Utils.getDBStringVal(row, vertica.sso_details.Col_realm, "")
        val realmUrl = vertica.realm.selectRealmUrl(realm)
        vertica.user.updateRealmMps(username, realmUrl._2, mps)
        getUserDetails(username, "")
      }
      else {
        log.error(s"Couldn't find entry in mpse_sso table of $mps")
        throw new RuntimeException(s"Couldn't find entry in mpse_sso table of $mps")
      }
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Get user details
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def getUserDetails(username: String, token: String): Try[scala.xml.Elem] = {
    try {
      val rows = vertica.user.selectUserRoleRealmRow(username)
      if (!rows.isEmpty()) {
        val row = rows.head
        val user = ClinsightUserInfo(models.Utils.getDBStringVal(row, vertica.user.Col_first_name, ""), models.Utils.getDBStringVal(row, vertica.user.Col_last_name, ""), models.Utils.getDBStringVal(row, vertica.user.Col_email, ""), models.Utils.getDBBooleanVal(row, vertica.user.Col_is_external), models.Utils.getDBStringVal(row, vertica.user.Col_mps_def,""), models.Utils.getDBStringVal(row, vertica.user.Col_org, ""), models.Utils.getDBStringVal(row, vertica.realm.Col_realm), models.Utils.getDBStringVal(row, vertica.role.Col_role_name), models.Utils.getDBStringVal(row, vertica.user.Col_url_def, ""), Option(models.Utils.getDBStringVal(row, vertica.user.Col_end_customer, "")))
        getUserResponse(user, token)
      } else {
        log.error(s"Could not find any user with username : $username")
        throw new RuntimeException(s"Could not find any user with username : $username")
      }
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to get user details, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** User details in XML format
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def getUserResponse(userInfo: ClinsightUserInfo, token: String): Try[scala.xml.Elem] = {
    try {
      def getEnvLabel(domains: Map[String, String], r_link: String): String = {
        domains.toList.filter(k => k._2.equals(r_link))(0)._1
      }
      val row = models.vRole.roleDetails(userInfo.role)
      val domains = row.get.domains.values.toList
      val healthcheckDomains = getHealthcheckDomains(row.get)
      log.debug(s"healthcheck domains : $healthcheckDomains")
      val envList = healthcheckDomains.foldLeft(List[ClinsightEnvironment]()){ (f, r) =>
        val mps = r.split("/").toList
        val r_link_res = getHealthcheckSummaryUrl(mps(0), mps(1), mps(2))
        val encryptedUsernameOpt = models.Utils.encryptString(userInfo.email)
        val encryptedUsername = encryptedUsernameOpt match{
          case Some(s) => s
          case None => ""
        }
        log.debug(s"r_link from IS : $r_link_res")
        val r_link_without_amp = r_link_res.replaceAll("&amp;", "&")
        val r_link = r_link_without_amp.replaceAll("&", "&amp;")
        val r_link_user = if(r_link.contains("?")) s"${r_link}&amp;username=$encryptedUsername" else s"${r_link}?&amp;username=$encryptedUsername"
        val label = getEnvLabel(row.get.domains, r)
        if(r_link.isEmpty()) f else f ++ List(ClinsightEnvironment(label, r, r_link_user))
      }

      val res = if(envList.isEmpty) {
        models.Utils.successStringToXML(userInfo, envList, "", token)
      }
      else {
        val filteredEnvList = envList.filter(x => x.key.equals(userInfo.mps_def))
        val def_url = if(filteredEnvList.isEmpty) envList(0).value else filteredEnvList(0).value
        models.Utils.successStringToXML(userInfo, envList, def_url, token)
      }
      Success(res)
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to fetch dashboard url, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Filters domains based on healthcheck feature
    *
    * @return List of healthcheck enabled domains of a role
    */
  def getHealthcheckDomains(row: RoleDetails): List[String] = {
    val domains = row.domains.values.toList
    val features = row.features
    val healthcheckDomains = domains.foldLeft(List[String]()){(f, r) =>
      if(features(r).contains("healthcheck")) f ++ List(r) else f
    }
    healthcheckDomains
  }

  /** Filters dashboards table based on d_type=`HealthCheckSummary`
    *
    * @return Healthcheck report url of a dashboard
    */
  def getHealthcheckSummaryUrl(mfr: String, prod: String, sch: String): String = {
    val rows = vertica.sso_details.selectRealm(s"$mfr/$prod/$sch")
    val realm = if(rows.size > 0) models.Utils.getDBStringVal(rows.head, vertica.sso_details.Col_realm, "") else ""
    val realmRow = vRole.getRealmUrl(realm)
    val IS_API_Url = if(realmRow._1.equals("")){
      log.error(s"IS url is empty for realm : $realm")
      ""
    }
    else{
      s"${realmRow._1}/dashboards/healthcheckreport/$mfr/$prod/$sch"
    }
    val futureResponse = WS.url(IS_API_Url).get.map { response =>
      response.statusText match {
        case "OK" =>
          val url = (response.json \ "Data").get.as[String]
          ("Success", url)
        case _ =>
          ("Failure", "")
      }
    }
    val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
//    s"https://gbreports.glassbeam.com/BSWHTableau/rdPage.aspx?rdReport=Clinical_Engineering.1Home"
    wsResponse._2
  }

  /** Adds an entry in prospect table
    *
    * @return None if successfully created, else error msg.
    */
  def addProspect(prospectForm : ClinsightAddProspectForm) : Option[String]= {
    try {
      val email = prospectForm.username.toLowerCase()
      val encPasswd = BCrypt.hashpw(prospectForm.password, BCrypt.gensalt(BCryptLogRounds))
      val f_name = prospectForm.first_name
      val l_name = prospectForm.last_name
      val company_name = prospectForm.company_name
      val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
      val token = BCrypt.hashpw(email + ts, BCrypt.gensalt(BCryptLogRounds))
      val tokenId = token.replaceAll("/","")
      val emailFlds = (email.split("@").toList)(1).split("""\.""").toList
      val org = Auth.prodMps("4").toString().split("/").toList(0)
      val realm_def = vertica.realm.selectRealmUrl(ClinsightRealm)._2
      val role = Auth.prodMps("4").toString().split("/").mkString("_") + "_" + ClinsightRole
      val url_def = Auth.urlDef
      val mps_def = Auth.prodMps("4").toString()
      val currTime = new java.sql.Timestamp(ts)
      val res = vertica.prospect.insertRow(email, f_name, l_name, encPasswd, org, currTime, tokenId, role, realm_def, url_def, mps_def, company_name)
      res match {
        case Some(x) => models.Utils.sendEmailToProspect(email, tokenId, f_name, l_name)
        case None => throw new Exception (s"Failure")
      }
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to create an entry in the $CFNProspect table for user with email: ${prospectForm.username}, ex: $ex")
        Some("Failed to create a new user account.")
      }
    }

  }

  /** Checks if prospect already exists
    *
    * @return Boolean True if prospect exists else false
    */
  def ifProspectExits(email: String): Boolean = {
    try {
      val rows = vertica.prospect.isRowAvailable(email)
      (rows.size == 1)
    } catch {
      case ex: Exception => {
        log.error(s"Failed get data from prospect CF for: $email, ex: $ex")
        false
      }
    }
  }

  /** Verifies the prospect user
    *
    * @return None if it verifies successfully, else error msg.
    */
  def verifyProspect(email: String, token_id: String): Option[String] = {
    try {
      val currentTs = new DateTime(DateTime.now(), DateTimeZone.UTC).getMillis()
      val rows = vertica.prospect.selectRow(email.toLowerCase())
      if(rows.size < 1){
        val userRows = vertica.user.selectRow(email.toLowerCase())
        if(userRows.size < 1)
          throw new Exception (s"NoUser")
        else
          throw new Exception (s"UserVerifiedAlready")
      } else {
        val row = rows.head

        val createdTime = models.Utils.getDBDateVal(row, vertica.prospect.Col_created_on, CVDefaultDate).getTime()
        val tokenId = models.Utils.getDBStringVal(row, vertica.prospect.Col_veri_code)
        if(currentTs - createdTime > ClinsightLinkExpiry * 1000){
          throw new Exception (s"Expired")
        }
        if (!tokenId.equals(token_id)) {
          throw new Exception (s"InValidToken")
        } else {
          addUser(email: String, token_id, row)
          val org = models.Utils.getDBStringVal(row, vertica.prospect.Col_org)
          val f_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_first_name)
          val l_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_last_name)
          val expiryDays = Auth.ExpirationInDays
          val company_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_company_name)
//          val orgStudio = Org(org, org,0,0,OrgTypeMedDemo,"","","","","","")
//          vOrg.createMfr(orgStudio)
          val res = vertica.prospect.deleteRow(email.toLowerCase())
          val cp = ClinsightUserData(f_name, l_name, company_name, email)
          addPardot(cp)
          models.Utils.sendWelcomeProspectEmail(email.toLowerCase(), f_name, l_name, expiryDays)
          None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to verify the user: $email, ex: $ex")
        Some(s"${ex.getMessage()}")
      }
    }
  }

  /** Creates an entry in Pardot server
    *
    * @return None if successfully created, else error msg.
    */
  def addPardot(c: ClinsightUserData): Option[String] = {
    try {
      var authCreds = AuthCreds(auth_email, auth_password, auth_user_key)
      val token = pardotLogin(authCreds)
      val emailPayload = EmailData(auth_email, auth_password, auth_user_key, c.first_name, c.last_name, c.company_name, c.email, token)
      val res = models.vClinsight.createMail(emailPayload)
      res match {
        case Success(resultSet) =>
          log.debug("Pardot : Email created successfully")
          None
        case Failure(exception) =>
          log.error(s"Pardot : Unable to create mail")
          Some(s"Unable to create a lead in Pardot server")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to add entry in Pardot server : ex : $ex")
        Some(s"${ex.getMessage()}")
      }
    }
  }

  /** Add an entry into user table after deleting entry from prospect table
    *
    * @return None if created successfully, else error msg.
    */
  def addUser(email: String, token_id: String, row: Map[String, Option[Any]]) : Option[String] = {
    try{
      val active = vertica.user.UserStateBooleanMapping(true)
      val f_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_first_name)
      val l_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_last_name)
      val passwd_hash = models.Utils.getDBStringVal(row, vertica.prospect.Col_passwd_hash)
      val org = models.Utils.getDBStringVal(row, vertica.prospect.Col_org)
      val phone = models.Utils.getDBStringVal(row, vertica.prospect.Col_phone)
      val city = models.Utils.getDBStringVal(row, vertica.prospect.Col_city)
      val state = models.Utils.getDBStringVal(row, vertica.prospect.Col_state)
      val country = models.Utils.getDBStringVal(row, vertica.prospect.Col_country)
      val created_on = models.Utils.getDBDateVal(row, vertica.prospect.Col_created_on, CVDefaultDate)
      val role = models.Utils.getDBStringVal(row, vertica.prospect.Col_role)
      val realm_def = models.Utils.getDBStringVal(row, vertica.prospect.Col_realm_def)
      val url_def = models.Utils.getDBStringVal(row, vertica.prospect.Col_url_def)
      val mps_def = models.Utils.getDBStringVal(row, vertica.prospect.Col_mps_def)
      val typ = vertica.user.prospectText
      val report_usage: java.lang.Boolean = true
      val is_external : java.lang.Boolean = false
      val sso: java.lang.Boolean = false
      val def_passwd: java.lang.Boolean = false
      val is_prospect: java.lang.Boolean = true
      val validated: java.lang.Boolean = true
      val dashboard_admin: java.lang.Boolean = false
      val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
      val created_on_ts = new DateTime(created_on, DateTimeZone.UTC).getMillis()
      val realmRows = vertica.user.selectRoleMfrRealmId(mps_def,role)
      val realmRow = realmRows.head
      val mfr_id = models.Utils.getDBIntVal(realmRow,vertica.org.Col_mfr_id)
      val realm_id = models.Utils.getDBLongVal(realmRow,vertica.realm.Col_realm_id)
      val role_id = models.Utils.getDBLongVal(realmRow,vertica.role.Col_role_id)
      val ui_url = models.Utils.getDBStringVal(realmRow,vertica.realm.Col_ui_url)
      val res = vertica.user.insertProspectUser(email.toLowerCase(), active, f_name, l_name, passwd_hash, org, phone, city, state, country, new java.sql.Timestamp(created_on_ts), token_id,
        role_id, realm_id, url_def, mps_def, typ, Boolean.box(report_usage), Boolean.box(is_external), Boolean.box(sso), Boolean.box(def_passwd),
        Boolean.box(is_prospect), Boolean.box(validated), Boolean.box(dashboard_admin), Int.box(Auth.ExpirationInDays), Boolean.box(true), Int.box(0), new java.sql.Timestamp(ts), mfr_id, realm_def)
      res match {
        case Some(x) =>
          log.debug(s"User created successfully in user table")
        case None =>
          log.debug(s"failed to create propect user in User table")
          throw new Exception (s"Failure")
      }
      None
    } catch {
      case ex: Exception => {
        log.error(s"Failed to insert in user table : ex : $ex")
        Some(s"${ex.getMessage()}")
      }
    }
  }

  /** Regenrates verification mail and sends mail to user
    *
    * @return None if regenrates successfully, else error msg.
    */
  def regenerateVerificationEmail(email: String): Option[String] = {
    try {

      val rows = vertica.prospect.selectProspect(email.toLowerCase())
      if (rows.size == 1) {
        val row = rows(0)
        val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
        val tsDate = new Date(ts)
        val res = vertica.prospect.updateCreatedOn(email, tsDate)
        val tokenId = models.Utils.getDBStringVal(row, vertica.prospect.Col_veri_code)
        val f_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_first_name)
        val l_name = models.Utils.getDBStringVal(row, vertica.prospect.Col_last_name)
        models.Utils.sendEmailToProspect(email.toLowerCase(), tokenId, f_name, l_name)
        None
      } else {
        Some("NoUserAsSuch")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Failed to regenerate verification email and send to user: $email, ex: $ex")
        Some("RegenerationFailed")
      }
    }
  }

  /** Deletes user_device_token entry from `user_device_info` CF
   *
   * @return Success/Failure msg
   */
  def deleteUserDeviceInfo(userPayload: UserDeviceInfo): Try[String] = {
    try {
      userPayload match {
        case x: UserDeviceInfo => {
          log.debug(s"user device details received : $x")
          if(x.device_token.equals("")){
            log.debug(s"device token is empty hence not updating anything in $CFNUserDeviceInfo table")
            throw new RuntimeException("DEVICE_TOKEN_ERROR")
          } else{
            val res = vertica.user_device_info.deleteRow(x.username.getOrElse(""), x.app_type, x.device_token)
            res match{
              case Some(x) => throw new RuntimeException("UPDATE_FAILED")
              case _ => {
                val user = models.vUser.byEmail(x.username.getOrElse("")).get
                val mps_def = user.mps_def
                val mps = mps_def.split("/").toList
                val (mfr, prod, sch) = (mps(0), mps(1), mps(2))
                models.RulesAlerts.refreshAECacheUserDeviceInfo(mfr, prod, sch, x.username.getOrElse(""))
                Success("Deleted successfully")
              }
            }
          }
        }
        case _ =>
          throw new RuntimeException("PAYLOAD_ERROR")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Deletes user_device_token entry from `user_device_info` CF
   *
   * @return Success/Failure msg
   */
  def deleteUsersDeviceInfo(users: List[String]): Try[String] = {
    try {
      users.foreach(username =>{
        val res = vertica.user_device_info.deleteUsersRows(username)
        res match{
          case Some(x) => throw new RuntimeException("UPDATE_FAILED")
          case _ => {
            val user = models.vUser.byEmail(username).get
            val mps_def = user.mps_def
            val mps = mps_def.split("/").toList
            val (mfr, prod, sch) = (mps(0), mps(1), mps(2))
            models.RulesAlerts.refreshAECacheUserDeviceInfo(mfr, prod, sch, username)
          }
        }
      })
      Success("Deleted successfully")
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to delete user's device info, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Authenticates user(GB UMS) and get user mps_def and clinsights MPSes
   *
   * @return JSON : user mps_def and clinsights MPSes
   */
  def mobileLogin(userPayload: ClinsightLogin, token: String, skipCredCheck: Boolean = false): Try[ClinsightsLoginResponse] = {
    try {
      val username = userPayload.username
      val password = userPayload.password
      val emailPasswdMatch = if(skipCredCheck) (true, true) else models.vUser.emailPasswdMatch(username, password)
      if(emailPasswdMatch._2){
        val user = models.vUser.byEmail(username).get
        val user_state = models.vUser.getUserState(username)
        val uStateStr = user_state._1.getOrElse("")
        if(uStateStr.equals(UserInactive)){
          log.error(s"User is not active : $username")
          throw new RuntimeException(s"UserInactive")
        } else if(uStateStr.equals(UserInvited)) {
          enable(username, None)
          val singleMPSList = user.mps_def.split("/").toList
          dao.DBUtils.updateUserDeviceInfo(username, userPayload.user_device_info, user)
          getUserMpsDetails(username, token)
        } else{
          dao.DBUtils.updateUserDeviceInfo(username, userPayload.user_device_info, user)
          getUserMpsDetails(username, token)
        }
      } else {
        log.error(s"Failed to login for username : $username")
        throw new RuntimeException(s"InvalidCredentials")
      }
    }
    catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to login, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** Get user details
   *
   * @return JSON with user details, product list and healthcheck report url
   */
  def getUserMpsDetails(username: String, token: String): Try[ClinsightsLoginResponse] = {
    try {
      val rows = vertica.user.selectUserRoleRealmRow(username)
      if (!rows.isEmpty()) {
        val row = rows.head
        val user = ClinsightUserInfo(models.Utils.getDBStringVal(row, vertica.user.Col_first_name, ""), models.Utils.getDBStringVal(row, vertica.user.Col_last_name, ""), models.Utils.getDBStringVal(row, vertica.user.Col_email, ""), models.Utils.getDBBooleanVal(row, vertica.user.Col_is_external), models.Utils.getDBStringVal(row, vertica.user.Col_mps_def,""), models.Utils.getDBStringVal(row, vertica.user.Col_org, ""), models.Utils.getDBStringVal(row, vertica.realm.Col_realm), models.Utils.getDBStringVal(row, vertica.role.Col_role_name), models.Utils.getDBStringVal(row, vertica.user.Col_url_def, ""), Option(models.Utils.getDBStringVal(row, vertica.user.Col_end_customer, "")))
        getUserMpsResponse(user, token)
      } else {
        log.error(s"Could not find any user with username : $username")
        throw new RuntimeException(s"Could not find any user with username : $username")
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to get user details, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  /** User details in XML format
   *
   * @return Json with user MPS details, healthcheck product list
   */
  def getUserMpsResponse(userInfo: ClinsightUserInfo, token: String): Try[ClinsightsLoginResponse] = {
    try {
      def getLabel(mps: String, domains: Map[String, String]): String = {
        domains.toList.filter(k => k._2.equals(mps))(0)._1
      }
      val row = models.vRole.roleDetails(userInfo.role)
      val healthcheckDomains = getHealthcheckDomains(row.get)
      log.debug(s"healthcheck domains : $healthcheckDomains")
      val clinsightsMpses = healthcheckDomains.foldLeft(List[Map[String, String]]()){ (f, mps) =>
        val mpsList = mps.split("/").toList
        val r_link_res = getHealthcheckSummaryUrl(mpsList(0), mpsList(1), mpsList(2))
        log.debug(s"r_link from IS : $r_link_res")
        if(r_link_res.isEmpty()) f else f ++ List(Map(mps -> getLabel(mps, row.get.domains)))
      }

      val encryptedUsernameOpt = models.Utils.encryptString(userInfo.email)
      val encryptedUsername = encryptedUsernameOpt match{
        case Some(s) => s
        case None => ""
      }

      val res = if(clinsightsMpses.isEmpty) {
        log.error(s"Clinsights is not configured for user : ${userInfo.email}")
        throw new RuntimeException(s"ClinsightsNotConfigured")
      } else {
        val (base_url, landing_page_url) = DBUtils.getDashboardReportUrl(userInfo.mps_def)
        ClinsightsLoginResponse(Some(userInfo.email), Some(encryptedUsername), Some(userInfo.first_name), Some(userInfo.last_name), Some(userInfo.role), token, userInfo.mps_def, clinsightsMpses, Some(base_url), Some(landing_page_url))
      }
      Success(res)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to fetch dashboard url, exception:  " + ex)
        Failure(ex)
      }
    }
  }
}
