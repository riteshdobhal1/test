package models

import java.net.URLEncoder
import java.util.{ArrayList, Date}

import com.datastax.driver.core.{BoundStatement, Row}
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
import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}
import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global

object Clinsight {
  val log = Logger("Model_Clinsight")
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

  /** Autheticates user(GB UMS) and get user details
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def login(username: String, password: String, token: String): Try[scala.xml.Elem] = {
    try {
      val emailPasswdMatch = models.User.emailPasswdMatch(username, password)
      if(emailPasswdMatch._2){
        val user = models.User.byEmail(username).get
        if(user.active)
          getUserDetails(username, token)
        else{
          log.error(s"User is not active : $username")
          throw new RuntimeException(s"UserInactive")
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
      val mpsIdx = mps.split(":").toList
      val q = s"SELECT realm FROM $KsUMS.$CFNMpseSSO where mfr=? AND prod=? AND sch=?;"
      val ps = DS.createPreparedStatement(q)
      val bs = new BoundStatement(ps).bind(mpsIdx(0), mpsIdx(1), mpsIdx(2))
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(!rows.isEmpty) {
        val realm = rows(0).getString("realm")
        val realmUrl = models.Role.getRealmUrl(realm)
        val ps = DS.createPreparedStatement(s"Update $KsUMS.$CFNUser set realm_def = ?, mps_def = ? WHERE email = ?;")
        val bs =  new BoundStatement(ps).bind(realmUrl._2, mps, username)
        DS.cqlExecuteBoundStmnt(bs)
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
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser WHERE email=?;")
      val bs = new BoundStatement(ps).bind(username)
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (!rows.isEmpty()) {
        val row = rows(0)
        val user = ClinsightUserInfo(row.getString("first_name"), row.getString("last_name"), row.getString("email"), row.getBool("is_external"), row.getString("mps_def"), row.getString("org"), row.getString("realm_def"), row.getString("role"), row.getString("url_def"), Option(row.getString("end_customer")))
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
      val row = models.Role.roleDetails(userInfo.role)
      val domains = row.get.domains.values.toList
      val healthcheckDomains = getHealthcheckDomains(row.get)
      val envList = healthcheckDomains.foldLeft(List[ClinsightEnvironment]()){ (f, r) =>
        val mps = r.split(":").toList
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
        log.debug(s"userInfo : $userInfo, envList : $envList, token: $token")
        models.Utils.successStringToXML(userInfo, envList, "", token)
      } else {
        val filteredEnvList = envList.filter(x => x.key.equals(userInfo.mps_def))
        val def_url = if(filteredEnvList.isEmpty) envList(0).value else filteredEnvList(0).value
        log.debug(s"userInfo : $userInfo, envList : $envList, def_url: $def_url, token: $token")
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
    val realm = models.Org.getOrgRealm(mfr) match {
      case Some(r) => r
      case _ => ""
    }
    if(realm.isEmpty()){
      log.error(s"realm is empty for mfr: $mfr in org table")
      ""
    }
    else {
      val realmRow = Role.getRealmUrl(realm)
      val IS_API_Url = if (realmRow._1.equals("")) {
        log.error(s"IS url is empty for realm : $realm in realm table")
        ""
      }
      else {
        s"${realmRow._1}/dashboards/healthcheckreport/$mfr/$prod/$sch"
      }
      if (IS_API_Url.isEmpty())
        ""
      else {
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
        wsResponse._2
      }
    }
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
      val tokenId = BCrypt.hashpw(email + ts, BCrypt.gensalt(BCryptLogRounds))
      val emailFlds = (email.split("@").toList)(1).split("""\.""").toList
      val org = Auth.prodMps("4").toString().split(":").toList(0)
      val realm_def = Role.getRealmUrl(ClinsightRealm)._2
      val role = Auth.prodMps("4").toString().split(":").mkString("_") + "_" + ClinsightRole
      val url_def = Auth.urlDef
      val mps_def = Auth.prodMps("4").toString()
      val ps = DS.createPreparedStatement(s"INSERT INTO $KsUMS.$CFNProspect (email, first_name, last_name, passwd_hash, org, created_on, veri_code, role, realm_def, url_def, mps_def, company_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
      val bs = new BoundStatement(ps).bind(email, f_name, l_name, encPasswd, org, new Date(ts), tokenId, role, realm_def, url_def, mps_def, company_name)
      DS.cqlExecuteBoundStmnt(bs)
      models.Utils.sendEmailToProspect(email, tokenId, f_name, l_name)
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
      val qry = s"SELECT email FROM $KsUMS.$CFNProspect WHERE email=?;"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
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
      val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNProspect where email = ? LIMIT 1;")
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if(rows.size < 1){
        val ps = DS.createPreparedStatement(s"SELECT * FROM $KsUMS.$CFNUser where email = ? LIMIT 1;")
        val bs = new BoundStatement(ps).bind(email.toLowerCase())
        val userRows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
        if(userRows.size < 1)
          throw new Exception (s"NoUser")
        else
          throw new Exception (s"UserVerifiedAlready")
      } else {
        val row = rows.head
        val createdTime = models.Utils.getDateVal(row, "created_on", CVDefaultDate).getTime()
        val tokenId = models.Utils.getStringVal(row, "veri_code", CVDefaultStr)
        if(currentTs - createdTime > ClinsightLinkExpiry * 1000){
          throw new Exception (s"Expired")
        }
        if (!tokenId.equals(token_id)) {
          throw new Exception (s"InValidToken")
        } else {
          addUser(email: String, token_id, row)
          val org = models.Utils.getStringVal(row, "org", CVDefaultStr)
          val f_name = models.Utils.getStringVal(row, "first_name", CVDefaultStr)
          val l_name = models.Utils.getStringVal(row, "last_name", CVDefaultStr)
          val expiryDays = Auth.ExpirationInDays
          val company_name = models.Utils.getStringVal(row, "company_name", CVDefaultStr)
          val orgStudio = Org(org, org,0,0,OrgTypeMedDemo,"","","","","","","")
          Org.createMfr(orgStudio)
          DS.cqlExecute(s"DELETE FROM $KsUMS.$CFNProspect WHERE email='${email.toLowerCase()}';")
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
      val res = models.Clinsight.createMail(emailPayload)
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
  def addUser(email: String, token_id: String, row: Row) : Option[String] = {
    try{
      val active: java.lang.Boolean = true
      val f_name = models.Utils.getStringVal(row, "first_name", CVDefaultStr)
      val l_name = models.Utils.getStringVal(row, "last_name", CVDefaultStr)
      val passwd_hash = models.Utils.getStringVal(row, "passwd_hash", CVDefaultStr)
      val org = models.Utils.getStringVal(row, "org", CVDefaultStr)
      val phone = models.Utils.getStringVal(row, "phone", CVDefaultStr)
      val city = models.Utils.getStringVal(row, "city", CVDefaultStr)
      val state = models.Utils.getStringVal(row, "state", CVDefaultStr)
      val country = models.Utils.getStringVal(row, "country", CVDefaultStr)
      val created_on = models.Utils.getDateVal(row, "created_on", CVDefaultDate)
      val role = models.Utils.getStringVal(row, "role", CVDefaultStr)
      val realm_def = models.Utils.getStringVal(row, "realm_def", CVDefaultStr)
      val url_def = models.Utils.getStringVal(row, "url_def", CVDefaultStr)
      val mps_def = models.Utils.getStringVal(row, "mps_def", CVDefaultStr)
      val typ = "Prospect"
      val report_usage: java.lang.Boolean = true
      val is_external : java.lang.Boolean = false
      val sso: java.lang.Boolean = false
      val def_passwd: java.lang.Boolean = false
      val is_prospect: java.lang.Boolean = true
      val validated: java.lang.Boolean = true
      val dashboard_admin: java.lang.Boolean = false
      val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
      val qry = s"INSERT INTO $KsUMS.$CFNUser" +
        s" (email, active, first_name, last_name, passwd_hash, org, phone, city, state, country, created_on, token_id, role, realm_def, " +
        s" url_def, mps_def, type, report_usage, is_external, sso, def_passwd, is_prospect, validated, dashboard_admin, expire_in_days, show_info, failed_login, last_failed_login_time)" +
        s" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(email.toLowerCase(), Boolean.box(active), f_name, l_name, passwd_hash, org, phone, city, state, country, created_on, token_id,
        role, realm_def, url_def, mps_def, typ, Boolean.box(report_usage), Boolean.box(is_external), Boolean.box(sso), Boolean.box(def_passwd),
        Boolean.box(is_prospect), Boolean.box(validated), Boolean.box(dashboard_admin), Int.box(Auth.ExpirationInDays), Boolean.box(true), Int.box(0), new Date(ts))
      DS.cqlExecuteBoundStmnt(bs)
      log.debug(s"User created successfully in  user table")
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
      val qry = s"SELECT veri_code, first_name, last_name FROM $KsUMS.$CFNProspect WHERE email=?;"
      val ps = DS.createPreparedStatement(qry)
      val bs = new BoundStatement(ps).bind(email.toLowerCase())
      val rows = DS.cqlExecuteBoundStmnt(bs).asScala.toList
      if (rows.size == 1) {
        val row = rows(0)
        val ts = new DateTime(DateTime.now, DateTimeZone.UTC).getMillis()
        val ps = DS.createPreparedStatement(s"Update $KsUMS.$CFNProspect set created_on = ? WHERE email = ?;")
        val bs =  new BoundStatement(ps).bind(new Date(ts), email.toLowerCase())
        DS.cqlExecuteBoundStmnt(bs)
        val tokenId = row.getString("veri_code")
        val f_name = row.getString("first_name")
        val l_name = row.getString("last_name")
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
}
