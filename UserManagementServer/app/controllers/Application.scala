package controllers

import dao.DBUtils
import models.Utils.{FailedLoginMaxLimit, TfaOTPExpiry}
import play.api.Logger
import play.api._
import play.api.mvc._
//import play.api.mvc.Session
import play.api.data._
import play.api.data.Forms._
import play.api.Logger
import play.api.libs.ws._
import play.api.libs.json._
import play.api.libs.Jsonp
import scala.concurrent._
//import scala.concurrent.duration._
//import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.Play.current
import java.net.{URL, URLDecoder, URLEncoder}
import play.api.i18n.{MessagesApi, I18nSupport}
import play.api.i18n.Messages.Implicits._
import org.joda.time._
import scala.util.{Try, Success, Failure}
import models._
import views._
import play.api.http.HeaderNames//._


import constants._

case class UserTrackingData(details: String, solr_query: String)
case class DomainUser(user_details: UserInfo, role_details: RoleDetails)

case class CorsAction[A](action: Action[A]) extends Action[A] {
  def apply(request: Request[A]): Future[Result] = {
    action(request).map(result => result.withHeaders(HeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN -> "*",
      HeaderNames.ALLOW -> "*" ,
      HeaderNames.ACCESS_CONTROL_ALLOW_METHODS -> "POST, GET, PUT, DELETE, OPTIONS",
      HeaderNames.ACCESS_CONTROL_ALLOW_HEADERS -> "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent"
    ))
  }
  
  lazy val parser = action.parser
}

object Application extends Controller with Secured {
  val log = Logger("Controller_Application")


  implicit val userInfoWrites = Json.writes[UserInfo]
  implicit val roleDetailsWrites = Json.writes[RoleDetails]
  implicit val domainUserWrites = Json.writes[DomainUser]
  implicit val logoWrites = Json.writes[Logo]
  implicit val twoAuthDevicesWrites = Json.writes[TwoAuthDevices]

  lazy val RecaptchaSecret = Play.current.configuration.getString("recaptcha.secret").getOrElse(
                            throw new RuntimeException("recaptcha.secret needs to be set in application.conf "))
  lazy val RecaptchaServerUrl = Play.current.configuration.getString("recaptcha.server_url").getOrElse(
                            throw new RuntimeException("recaptcha.server_url needs to be set in application.conf "))
  lazy val RecaptchaEnabled = Play.current.configuration.getBoolean("recaptcha.enabled").getOrElse(
                            throw new RuntimeException("recaptcha.enabled needs to be set in application.conf "))

  /**
    * login form definition. It handles automatically validation, submission, errors, redisplaying, ...
    */
  val loginForm = Form(
    tuple(
      "email" -> text,
      "password" -> text(minLength = 1, maxLength = FSPasswdMax),
      "captcha" -> optional(text),
      "mobile" -> boolean,
      "redirectURI" -> optional(text),
      "noRedirect" -> optional(text)) verifying ("Invalid Captcha",
        result => result match {
          case (email, passowrd, captcha, mobile,  _, _) => verifyCaptcha(email, passowrd, captcha, mobile)
        }
      )
    )

  val appLoginForm = Form(
    tuple(
      "email" -> email,
      "password" -> text(minLength = 1, maxLength = FSPasswdMax),
      "redirectURI" -> optional(text),
      "noRedirect" -> optional(text)) verifying ("Incorrect email or password.",
      result => result match {
        case (email, password, _, _) => models.vUser.emailPasswdMatch(email, password)._2
      }))

  val loginFormNew = Form(
    tuple(
      "email" -> text,
      "password" -> text(minLength = 1, maxLength = FSPasswdMax)
        ))

  val verifyOTPForm = Form(
    mapping(
      "email" -> email,
      "otp" -> nonEmptyText()
    )(VerifyOTPForm.apply)(VerifyOTPForm.unapply))

  val resendOTPForm = Form(
    mapping(
      "email" -> email
    )(ResendOTPForm.apply)(ResendOTPForm.unapply))

  val userAccessTokenForm = Form(
    mapping(
      "email" -> email,
      "access_token" -> optional(text)
    )(UserAccessTokenPayload.apply)(UserAccessTokenPayload.unapply))

  /**
   * Redirects a user to the correct home page 
   */
        
  val userData = Form(
    mapping(
      "details" -> nonEmptyText(),
      "solr_query" -> text
    )(UserTrackingData.apply)(UserTrackingData.unapply)
  )
  
  def options(path: String) = CorsAction {
    Action {request =>
      Ok.withHeaders(ACCESS_CONTROL_ALLOW_HEADERS -> Seq(AUTHORIZATION, CONTENT_TYPE, "Target-URL").mkString(", "))
    }
  }
  
  //def index = Action { implicit request =>
    //request.session.get(SKUserId).map { userid => Redirect(routes.Application.uHome(APIVersion)) } getOrElse (Redirect(routes.Application.vHome(APIVersion)))
    // request.session.get(SKUserId).map { userid => Redirect("/public/index.html") } getOrElse (Redirect("/public/index.html"))
     //request.session.get(SKUserId).map { userid => Redirect(routes.Application.index()) } getOrElse (Redirect(routes.Application.index()))
  //}


   //def index: Action[AnyContent] = assets.at("../../public/index.html")
   
   def index() = Action { implicit request =>
     request.session.get(SKUserId).map { userid => Redirect("/assets/index.html") } getOrElse(Redirect("/assets/index.html"))
  }

  def createpwd(token_id:String,email:String,domain:String) = Action { implicit request =>
     request.session.get(SKUserId).map { userid => Redirect("/assets/index.html") } getOrElse {

       val url_params = if(token_id !="" && email !="") "?token_id=" + token_id + "&email=" + URLEncoder.encode(email, "UTF-8") + "&domain=" + domain else ""
       Redirect("/assets/index.html" + url_params)
     }

  }


  /**
   * Display the home page for visitors.
   */
  def vHome(version: String) = Action { implicit request =>
    Ok(views.html.vhome(appLoginForm, version))
  }

  /**
   * Display the home page for signed-in users.
   */
  def uHome(version: String) = Action { implicit request =>
    //Ok(views.html.uhome(request.session.get(SKUserName), request.session.get(SKUserOrg), request.session.get(SKUserRole), version))
	Ok(views.html.index()) 
 }

  /**
   * monitors if UMS is running or not
   *
   */
  
  def monitor(version: String) = Action { implicit request =>
    val result = DBUtils.vMonitorUMS()
    result match {
      case Success(resultSet) =>
        Ok(s"UMS running..")
      case Failure(exception) =>
        val logMs = exception.getMessage()
        logMs match {
          case msg if (msg.contains("All host(s) tried for query failed")) => InternalServerError(s"Problem with UMS connecting to vertica. May need restart if not resolved!!")
          case _ => InternalServerError(s"Problem with UMS. May need restart if not resolved!!")
        }
    }
  }
  
  def xProxy(version: String) = Action { implicit request =>
    Ok(views.html.proxy())
  }



  /* def uiLoginNew(version: String) = Action(parse.form(loginFormNew)) { implicit request =>
  val email = request.body._1
  val password = request.body._2
  log.error(s"==="+ email)
  if (models.User.emailPasswdMatch(email, password)) {
  val currentTime = DateTime.now.getMillis().toString
            models.User.byEmail(email).map { user =>
              val domains = models.Role.roleDetails(user.role).get
              var isAdmin = false
              val features = domains.features
              val domainlist = domains.domains
              val mfr = user.mps_def.split(":")
              for ( (k,v) <- domainlist){
                        val mps = v.split(":")
                        if(mps(0).equals(mfr(0))){
                                if(features(v).contains("admin")){
                                isAdmin = true
                                }
                        }
              }
             if(!user.active){
                Forbidden(models.Utils.jsonResponse("Failure", "User Is Not Active", Json.toJson("User Is Not Active!!")))
              } else if (domains.name.isEmpty()) {
                Forbidden(models.Utils.jsonResponse("Failure", s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!", Json.toJson(s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!")))
              } else {
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

                val user_info = models.User.userDetails(email)
                val domain_user = DomainUser(user_info.get, domains)
                val realm_def = user_info.get.realm_def
                val url_def = user_info.get.url_def
                val mps_def = user_info.get.mps_def
                val sess = play.api.mvc.Session.encode(cookie)
                val session_id = sess.split("-")(0)
                val token = "PLAY_SESSION=" + "\"" + sess + "\""
                val mps = mps_def.split(":").toList
                if(mps.size == 3) {models.User.trackUserLoginActivity(mps(0), mps(1), mps(2), email, session_id)}
                Ok(models.Utils.jsonResponseWithSession("Success", "List of all domains + Authentication Token", Json.toJson(domain_user), Json.toJson(token))).withSession(
		  SKUserId -> user.email,
                  SKUserOrg -> user.org,
                  SKUserRole -> user.role,
                  SKDashboardAdmin -> user.dashboard_admin.toString,
                  SKRemoteAddress -> request.remoteAddress,
                  SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                  SKUserDomains -> domains.domains.values.mkString(","),
                  SKCurrentTime -> currentTime,
                  SKAdmin -> isAdmin.toString,
                  SKProjLimit -> domains.studio_proj_limit.toString,
                  SKSessionId -> session_id)

              }

            }.getOrElse(Forbidden(models.Utils.jsonResponse("Failure", "User not authenticated", Json.toJson(Auth.LoginPageUrl))))
          } else {
            Forbidden(models.Utils.jsonResponse("Failure", "Incorrect email or password.", Json.toJson("Incorrect email or password")))
		    }
  
   
  //log.debug(s"A user with ${userData} signed in")
  //Ok(models.Utils.jsonResponse("Success", "", Json.toJson("")))
  //val newUser = models.User(userData.name, userData.age)
  //val id = models.User.create(newUser)
  //Redirect(routes.Application.home(id))
}
 */
  /**
    * Verifies recaptcha
    *
    */
  def verifyCaptcha(email: String, password: String, captcha: Option[String], mobile: Boolean): Boolean = {
    val data = Json.obj(
      "secret" -> RecaptchaSecret,
      "response" -> captcha
    )
    val captchaStr = captcha.getOrElse("NA")
    var isVerified = false
    if(RecaptchaEnabled && !mobile && captchaStr != "NA") {
      val futureResult = WS.url(s"$RecaptchaServerUrl?secret=$RecaptchaSecret&response=$captchaStr").post(data).map { response =>
        response.statusText match {
          case IsSuccess =>
            val status = Json.parse(response.body)
            (status \ "success").as[Boolean] match {
              case true => isVerified = true
              case false => log.debug(s"${response.body}")
            }
          case _ =>
            log.debug(s"failed to verify captcha")
        }
      }
      val wsResponse = Await.result(futureResult, scala.concurrent.duration.Duration.Inf)
    }
    else isVerified = true
    isVerified
  }

  /**
   * Login from UI and send list of domains for User
   * TODO: remove this function and have just one function for login.
   */

  def uiLogin(version: String) = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "Input length exceeds the maximum limit.", Json.toJson(""))),
      epu => epu match {
        case (email, password, captcha, mobile, uriOption, noRedirectOption) =>
          version match {
            case constants.VERTICA_VERSION => verticaUILogin(email, password, captcha, mobile, uriOption, noRedirectOption, request)
            case _ => cassandraUILogin(email, password, captcha, mobile, uriOption, noRedirectOption, request)
          }
      })
  }

  def verticaUILogin(email: String, password: String, captcha: Option[String], mobile: Boolean, uriOption: Option[String], noRedirectOption: Option[String], request: Request[AnyContent]) = {
    val reqSession = request.cookies.get("PLAY_SESSION")
    val emailPasswdMatch = models.vUser.emailPasswdMatch(email, password)
    if (emailPasswdMatch._2) {
      log.debug(s"A user with email ${email} signed in")
      val currentTime = DateTime.now.getMillis().toString
      models.vUser.byEmail(email).map { user =>
        val domains = models.vRole.roleDetails(user.role).get
        var isAdmin = false
        val features = domains.features
        val domainlist = domains.domains
        val mfr = user.mps_def.split("/")
        val org = user.org
        for ( (k,v) <- domainlist){
          val mps = v.split("/")
          if(mps(0).equals(mfr(0))){
            if(features(v).contains("admin")){
              isAdmin = true
            }
          }
        }
        val loginFailedStatus = models.vUser.getUserLoginFailedStatus(email)
        val user_state = models.vUser.getUserState(email)
        val uStateStr = user_state._1.getOrElse("")
        if(uStateStr.equals(UserInactive)){
          Forbidden(models.Utils.loginFailedResponse("Failure", "User is not active.", Json.toJson("User is not active!!"), -1))
        } else if (domains.name.isEmpty()) {
          Forbidden(models.Utils.loginFailedResponse("Failure", s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!", Json.toJson(s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!"), -1))
        } else {
          val isTwoAuthEnabledAtMPSLevel = models.vOrg.isTwoAuthAtOrgLevel(org)
          val twoAuthList = models.vRole.twoAuthList(mfr(0), mfr(1), mfr(2), user.role)
          if(!isTwoAuthEnabledAtMPSLevel ||(isTwoAuthEnabledAtMPSLevel && twoAuthList.size==0)) {
            log.debug(s"Two fact auth disabled for user with email id  : ${email}")
            if(uStateStr.equals(UserInvited) || !loginFailedStatus){
              models.vUser.updateSuccessLoginAttempt(email, reqSession)
            }
            vSetCookieInResponse(email, domains, user, request, currentTime, isAdmin, uStateStr)
          } else{
            log.debug(s"Two fact auth enabled for user with email id  : ${email}")
            val isOTPClock = models.Utils.checkTwoFARequired(constants.VERTICA_VERSION, mfr(0), mfr(1), mfr(2), request, user_state)
            if(isOTPClock) {
              val twoAuthTargetList = models.vUser.twoAuthTargetList(mfr(0), mfr(1), mfr(2), org, email)._2
              models.vUser.generateOTPSendUser(mfr(0), mfr(1), mfr(2), user, twoAuthTargetList)
              val maskedList = models.Utils.maskTwoAuth(twoAuthTargetList)
              val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
              Ok(models.Utils.jsonResponseTwoAuth("Success", "User logged in successfully.", Json.toJson(maskedList), timeString, true))
            } else{
              models.vUser.updateSuccessLoginAttempt(email, reqSession)
              vSetCookieInResponse(email, domains, user, request, currentTime, isAdmin, uStateStr)
            }
          }
        }
      }.getOrElse(Forbidden(models.Utils.loginFailedResponse("Failure", "User not authenticated", Json.toJson(Auth.LoginPageUrl), -1)))
    } else {
      var failure_msg = "Incorrect email or password."
      var remainingAttempt = -1
      if (emailPasswdMatch._1) {
        models.vUser.byEmail(email).map { user =>
          log.debug(s"==" + user)
          if (user.active) {
            val res = models.vUser.updateFailedLoginAttempt(email)
            remainingAttempt = res._2
          }
          else {
            failure_msg = "User is not active."
            remainingAttempt = -1
          }
        }
      }
      Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), remainingAttempt))
    }
  }


  def cassandraUILogin(email: String, password: String, captcha: Option[String], mobile: Boolean, uriOption: Option[String], noRedirectOption: Option[String], request: Request[AnyContent]) = {
    val emailPasswdMatch = models.User.emailPasswdMatch(email, password)
    if (emailPasswdMatch._2) {
      log.debug(s"A user with email ${email} signed in")
      val currentTime = DateTime.now.getMillis().toString
      models.User.byEmail(email).map { user =>
        val domains = models.Role.roleDetails(user.role).get
        var isAdmin = false
        val features = domains.features
        val domainlist = domains.domains
        val mfr = user.mps_def.split(":|/")
        val org = user.org
        for ( (k,v) <- domainlist){
          val mps = v.split(":|/")
          if(mps(0).equals(mfr(0))){
            if(features(v).contains("admin")){
              isAdmin = true
            }
          }
        }
        val user_state = models.User.getUserState(email)
        log.error(s"=="+ user_state._1.get + "====" + UserInactive) 
        if(user_state._1.get.equals(UserInactive)){
	  log.error(s"==login failed")	
          Forbidden(models.Utils.loginFailedResponse("Failure", "User is not active.", Json.toJson("User is not active!!"), -1))
        } else if (domains.name.isEmpty()) {
          Forbidden(models.Utils.loginFailedResponse("Failure", s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!", Json.toJson(s"The role ${user.role}, which user is associated with is not valid or doesn't exist!!"), -1))
        } else {
          val isTwoAuthEnabledAtMPSLevel = models.Org.isTwoAuthAtOrgLevel(org)
          val twoAuthList = models.Role.twoAuthList(mfr(0), mfr(1), mfr(2), user.role)
          if(!isTwoAuthEnabledAtMPSLevel ||(isTwoAuthEnabledAtMPSLevel && twoAuthList.size==0)) {
            log.debug(s"Two fact auth disabled for user with email id  : ${email}")
            models.User.updateSuccessLoginAttempt(email)
            setCookieInResponse(email, domains, user, request, currentTime, isAdmin)
          }
          else{
            log.debug(s"Two fact auth enabled for user with email id  : ${email}")
            val isOTPClock = models.Utils.checkTwoFARequired(constants.CASSANDRA_VERSION, mfr(0), mfr(1), mfr(2), request, user_state)
            if(isOTPClock) {
              val twoAuthTargetList = models.User.twoAuthTargetList(mfr(0), mfr(1), mfr(2), org, email)._2
              models.User.generateOTPSendUser(mfr(0), mfr(1), mfr(2), user, twoAuthTargetList)
              val maskedList = models.Utils.maskTwoAuth(twoAuthTargetList)
              val timeString = models.Utils.calculateTimetoShowDays(TfaOTPExpiry)
              Ok(models.Utils.jsonResponseTwoAuth("Success", "User logged in successfully.", Json.toJson(maskedList), timeString, true))
            } else{
              models.User.updateSuccessLoginAttempt(email)
              setCookieInResponse(email, domains, user, request, currentTime, isAdmin)
            }
          }
        }
      }.getOrElse(Forbidden(models.Utils.loginFailedResponse("Failure", "User not authenticated", Json.toJson(Auth.LoginPageUrl), -1)))
    } else {
      var failure_msg = "Incorrect email or password."
      var remainingAttempt = -1
      if (emailPasswdMatch._1) {
        models.User.byEmail(email).map { user =>
          log.debug(s"==" + user)
          if (user.active) {
            val res = models.User.updateFailedLoginAttempt(email)
            remainingAttempt = res._2
          }
          else {
            failure_msg = "User is not active."
            remainingAttempt = -1
          }
        }
      }
      Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), remainingAttempt))
    }
  }

  /** Two fact auth : Resend OTP to the user
    *
    * @return Auth Success with OTP/Failure msg
    */
  def resendOTP(version: String) = Action { implicit request =>
    version match {
      case constants.VERTICA_VERSION =>
        resendOTPForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "email is required.", Json.toJson(""))),
          c => {
            models.vUser.byEmail(c.email).map { user =>
              val mfr = user.mps_def.split("/").toList
              val org = user.org
              val twoAuthTargetList = models.vUser.twoAuthTargetList(mfr(0), mfr(1), mfr(2), org, c.email)._2
              val result = models.vUser.generateOTPSendUser(mfr(0), mfr(1), mfr(2), user, twoAuthTargetList)
              result match {
                case Success(resultSet) =>
                  val maskedList = models.Utils.maskTwoAuth(twoAuthTargetList)
                  Ok(models.Utils.jsonResponse("Success", "OTP sent successfully.", Json.toJson(maskedList)))
                case Failure(exception) =>
                  Forbidden(models.Utils.loginFailedResponse("Failure", "Failed to generate OTP", Json.toJson(s"Failed to generate OTP"), -1))
              }
            }.getOrElse(Forbidden(models.Utils.loginFailedResponse("Failure", "Failed to generate OTP", Json.toJson(s"Failed to generate OTP"), -1)))
          }
        )
      case _ =>
        resendOTPForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "email is required.", Json.toJson(""))),
          c => {
            models.User.byEmail(c.email).map { user =>
              val mfr = user.mps_def.split(":|/").toList
              val org = user.org
              val twoAuthTargetList = models.User.twoAuthTargetList(mfr(0), mfr(1), mfr(2), org, c.email)._2
              val result = models.User.generateOTPSendUser(mfr(0), mfr(1), mfr(2), user, twoAuthTargetList)
              result match {
                case Success(resultSet) =>
                  val maskedList = models.Utils.maskTwoAuth(twoAuthTargetList)
                  Ok(models.Utils.jsonResponse("Success", "OTP sent successfully.", Json.toJson(maskedList)))
                case Failure(exception) =>
                  Forbidden(models.Utils.loginFailedResponse("Failure", "Failed to generate OTP", Json.toJson(s"Failed to generate OTP"), -1))
              }
            }.getOrElse(Forbidden(models.Utils.loginFailedResponse("Failure", "Failed to generate OTP", Json.toJson(s"Failed to generate OTP"), -1)))
          }
        )
    }
  }

  /** Two fact auth : Verifies OTP sent by User
    *
    * @return Auth Success/Failure
    */
  def verifyOTP(version: String) = Action { implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    version match {
      case constants.VERTICA_VERSION =>
        verifyOTPForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "OTP is required.", Json.toJson(""))),
          c => {
            val result = models.vUser.verifyOTP(c.email, c.otp)
            result match {
              case Success(resultSet) =>
                models.vUser.updateLastLoginOTP(c.email, request.remoteAddress)
                val currentTime = DateTime.now.getMillis().toString
                val user = models.vUser.byEmail(c.email).get
                val domains = models.vRole.roleDetails(user.role).get
                val isAdmin = models.Utils.vIsAdminBool(user, domains)
                val cookie: Map[String, String] = models.Utils.vCreateCookie(user, domains, isAdmin, currentTime, request)
                val user_info = models.vUser.userDetails(c.email)
                val domain_user = DomainUser(user_info.get, domains)
                val realm_def = user_info.get.realm_def
                val url_def = user_info.get.url_def
                val mps_def = user_info.get.mps_def
                val sess = play.api.mvc.Session.encode(cookie)
                val session_id = sess.split("-")(0)
                val token = "PLAY_SESSION=" + "\"" + sess + "\""
                val mps = mps_def.split("/").toList
                val user_state = models.vUser.getUserState(c.email)
                val uStateStr = user_state._1.getOrElse("")
                if(mps.size == 3) {
                  models.vUser.trackUserLoginActivity(mps(0), mps(1), mps(2), c.email, session_id)
                }
                models.vUser.updateSuccessLoginAttempt(c.email, reqSession)
                vSetCookieInResponse(c.email, domains, user, request, currentTime, isAdmin, uStateStr)
              case Failure(exception) =>
                val msg = exception.getMessage()
                msg match{
                  case "INVALID" => log.error(s"Two fact auth invalid OTP : ${c.otp}")
                    val failure_msg = "You have entered incorrect One-Time security code.  Enter correct code or click 'Resend OTP' to regenerate the code."
                    val res = models.vUser.updateFailedLoginAttempt(c.email)
                    val remainingAttempt = res._2
                    Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), remainingAttempt))
                  case "EXPIRED" => log.error(s"Two fact auth invalid OTP : ${c.otp}")
                    val failure_msg = "Your One-Time security code has expired.  Click 'Resend OTP' to regenerate the code."
                    Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), -1))
                  case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
                }
            }
          }
        )
      case _ =>
        verifyOTPForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "OTP is required.", Json.toJson(""))),
          c => {
            val result = models.User.verifyOTP(c.email, c.otp)
            result match {
              case Success(resultSet) =>
                models.User.updateLastLoginOTP(c.email, request.remoteAddress)
                val currentTime = DateTime.now.getMillis().toString
                val user = models.User.byEmail(c.email).get
                val domains = models.Role.roleDetails(user.role).get
                val isAdmin = models.Utils.isAdminBool(user, domains)
                val cookie: Map[String, String] = models.Utils.createCookie(user, domains, isAdmin, currentTime, request)
                val user_info = models.User.userDetails(c.email)
                val domain_user = DomainUser(user_info.get, domains)
                val realm_def = user_info.get.realm_def
                val url_def = user_info.get.url_def
                val mps_def = user_info.get.mps_def
                val sess = play.api.mvc.Session.encode(cookie)
                val session_id = sess.split("-")(0)
                val token = "PLAY_SESSION=" + "\"" + sess + "\""
                val mps = mps_def.split(":|/").toList
                if(mps.size == 3) {models.User.trackUserLoginActivity(mps(0), mps(1), mps(2), c.email, session_id)}
                models.User.updateSuccessLoginAttempt(c.email)
                Ok(models.Utils.jsonResponseWithSession("Success", "List of all domains + Authentication Token", Json.toJson(domain_user), Json.toJson(token), false)).withSession(
                  SKUserId -> user.email,
                  SKUserOrg -> user.org,
                  SKUserRole -> user.role,
                  SKDashboardAdmin -> user.dashboard_admin.toString,
                  SKRemoteAddress -> request.remoteAddress,
                  SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                  SKUserDomains -> domains.domains.values.mkString(","),
                  SKCurrentTime -> currentTime,
                  SKAdmin -> isAdmin.toString,
                  SKProjLimit -> domains.studio_proj_limit.toString,
                  SKSessionId -> session_id)
              case Failure(exception) =>
                val msg = exception.getMessage()
                msg match{
                  case "INVALID" => log.error(s"Two fact auth invalid OTP : ${c.otp}")
                    val failure_msg = "The entered One-Time security code is incorrect.  Enter correct code or click ‘Resend OTP’ to regenerate the code."
                    val res = models.User.updateFailedLoginAttempt(c.email)
                    val remainingAttempt = res._2
                    Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), remainingAttempt))
                  case "EXPIRED" => log.error(s"Two fact auth invalid OTP : ${c.otp}")
                    val failure_msg = "Your One-Time security code has expired.  Click ‘Resend OTP’ to regenerate the code."
                    Forbidden(models.Utils.loginFailedResponse("Failure", failure_msg, Json.toJson(failure_msg), -1))
                  case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
                }
            }
          }
        )
    }
  }

  def setCookieInResponse(email: String, domains: RoleDetails, user: User, request: Request[AnyContent], currentTime: String, isAdmin: Boolean): play.api.mvc.Result = {
    val cookie: Map[String, String] = models.Utils.createCookie(user, domains, isAdmin, currentTime, request)
    val user_info = models.User.userDetails(email)
    val domain_user = DomainUser(user_info.get, domains)
    val realm_def = user_info.get.realm_def
    val url_def = user_info.get.url_def
    val mps_def = user_info.get.mps_def
    val sess = play.api.mvc.Session.encode(cookie)
    val session_id = sess.split("-")(0)
    val token = "PLAY_SESSION=" + "\"" + sess + "\""
    val mps = mps_def.split(":|/").toList
    if (mps.size == 3) {
      models.User.trackUserLoginActivity(mps(0), mps(1), mps(2), email, session_id)
    }
    Ok(models.Utils.jsonResponseWithSession("Success", "List of all domains + Authentication Token", Json.toJson(domain_user), Json.toJson(token), false)).withSession(
      SKUserId -> user.email,
      SKUserOrg -> user.org,
      SKUserRole -> user.role,
      SKDashboardAdmin -> user.dashboard_admin.toString,
      SKRemoteAddress -> request.remoteAddress,
      SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
      SKUserDomains -> domains.domains.values.mkString(","),
      SKCurrentTime -> currentTime,
      SKAdmin -> isAdmin.toString,
      SKProjLimit -> domains.studio_proj_limit.toString,
      SKSessionId -> session_id)
  }

  def vSetCookieInResponse(email: String, domains: RoleDetails, user: NewUser, request: Request[AnyContent], currentTime: String, isAdmin: Boolean, uStateStr: String): play.api.mvc.Result = {
    val cookie: Map[String, String] = models.Utils.vCreateCookie(user, domains, isAdmin, currentTime, request)
    val user_info = models.vUser.userDetails(email)
    val domain_user = DomainUser(user_info.get, domains)
    val realm_def = user_info.get.realm_def
    val url_def = user_info.get.url_def
    val mps_def = user_info.get.mps_def
    val sess = play.api.mvc.Session.encode(cookie)
    val session_id = sess.split("-")(0)
    val token = "PLAY_SESSION=" + "\"" + sess + "\""
    val mps = mps_def.split(":|/").toList
    if (mps.size == 3) {
      val playSession = play.api.mvc.Session.apply(cookie)
      log.debug(s"playSession : $playSession")
      val playCookie = play.api.mvc.Session.encodeAsCookie(playSession)
      log.debug(s"playCookie : $playCookie")
      val playCookieOpt = Some(playCookie)
      models.Utils.refreshInvitedUserSysIds(mps(0), mps(1), mps(2), uStateStr, List(email), playCookieOpt)
      models.vUser.trackUserLoginActivity(mps(0), mps(1), mps(2), email, session_id)
    }
    val newMPSList = for(value <- domains.domains.values) yield value.split("/").mkString(":")
    Ok(models.Utils.jsonResponseWithSession("Success", "List of all domains + Authentication Token", Json.toJson(domain_user), Json.toJson(token), false)).withSession(
      SKUserId -> user.email,
      SKUserOrg -> user.org,
      SKUserRole -> user.role,
      SKDashboardAdmin -> user.dashboard_admin.toString,
      SKRemoteAddress -> request.remoteAddress,
      SKUserRealms -> domains.realm.mkString(","),
      SKUserDomains -> newMPSList.mkString(","),
      SKCurrentTime -> currentTime,
      SKAdmin -> isAdmin.toString,
      SKProjLimit -> domains.studio_proj_limit.toString,
      SKSessionId -> session_id)
  }

  /** Authenticates a user and sets the session cookies
   *  TODO: remove org and role from session cookie and store them in a server-side cache
   */
  def login(version: String) = Action { implicit request =>
    version match {
      case constants.VERTICA_VERSION =>
        appLoginForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "Incorrect email or password.", Json.toJson(""))),
          epu => epu match {
            case (email, password, uriOption, noRedirectOption) =>
              models.vUser.byEmail(email).map { user =>
                log.debug(s"A user with email ${user.email} signed in")
                uriOption.map { uri =>
                  Redirect(uri).withSession(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role)
                } getOrElse {
                  noRedirectOption.map { nr =>
                    nr match {
                      case "true" =>
                        Ok(s"${user.email} signed in").withSession(
                          SKUserId -> user.email,
                          SKUserName -> user.first_name,
                          SKUserOrg -> user.org,
                          SKUserRole -> user.role)
                      case "false" =>
                        Redirect(routes.Application.uHome(version)).withSession(
                          SKUserId -> user.email,
                          SKUserName -> user.first_name,
                          SKUserOrg -> user.org,
                          SKUserRole -> user.role)
                    }

                  } getOrElse {
                    if (user.role.equals(GBAdmin)) {
                      Ok(models.Utils.jsonResponse("Success", "Admin user is successfully logged in", Json.toJson(""))).withSession(
                        SKUserId -> user.email,
                        SKUserName -> user.first_name,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role)
                    } else {
                      val domains = models.vRole.roleDetails(user.role).get
                      val currentTime = DateTime.now.getMillis().toString
                      val cookie: Map[String, String] = Map(
                        SKUserFName -> user.first_name,
                        SKUserLName -> user.last_name,
                        SKUserId -> user.email,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role,
                        SKRemoteAddress -> request.remoteAddress,
                        SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                        SKUserDomains -> domains.domains.values.mkString(","),
                        SKCurrentTime -> currentTime)
                      val user_info = models.vUser.userDetails(email)
                      val domain_user = DomainUser(user_info.get, domains)
                      val realm_def = user_info.get.realm_def
                      val url_def = user_info.get.url_def
                      val mps_def = user_info.get.mps_def
                      val sess = play.api.mvc.Session.encode(cookie)
                      val session_id = sess.split("-")(0)
                      val redirectUrl = Auth.ReqProtocol + "://" + realm_def + "/" + url_def
                      Redirect(redirectUrl).withSession(
                        SKUserId -> user.email,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role,
                        SKRemoteAddress -> request.remoteAddress,
                        SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                        SKUserDomains -> domains.domains.values.mkString(","),
                        SKCurrentTime -> currentTime,
                        SKSessionId -> session_id)
                    }
                  }
                }
              }.getOrElse(InternalServerError(views.html.error(None, None, None, HttpStatus.Error, "Unexpected error. Please sign out and sign in again.")))
          })
      case _ =>
        appLoginForm.bindFromRequest.fold(
          formWithErrors => InternalServerError(models.Utils.jsonResponse("Failure", "Incorrect email or password.", Json.toJson(""))),
          epu => epu match {
            case (email, password, uriOption, noRedirectOption) =>
              models.User.byEmail(email).map { user =>
                log.debug(s"A user with email ${user.email} signed in")
                uriOption.map { uri =>
                  Redirect(uri).withSession(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role)
                } getOrElse {
                  noRedirectOption.map { nr =>
                    nr match {
                      case "true" =>
                        Ok(s"${user.email} signed in").withSession(
                          SKUserId -> user.email,
                          SKUserName -> user.first_name,
                          SKUserOrg -> user.org,
                          SKUserRole -> user.role)
                      case "false" =>
                        Redirect(routes.Application.uHome(version)).withSession(
                          SKUserId -> user.email,
                          SKUserName -> user.first_name,
                          SKUserOrg -> user.org,
                          SKUserRole -> user.role)
                    }

                  } getOrElse {
                    if (user.role.equals(GBAdmin)) {
                      Ok(models.Utils.jsonResponse("Success", "Admin user is successfully logged in", Json.toJson(""))).withSession(
                        SKUserId -> user.email,
                        SKUserName -> user.first_name,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role)
                    } else {
                      val domains = models.Role.roleDetails(user.role).get
                      val currentTime = DateTime.now.getMillis().toString
                      val cookie: Map[String, String] = Map(
                        SKUserFName -> user.first_name,
                        SKUserLName -> user.last_name,
                        SKUserId -> user.email,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role,
                        SKRemoteAddress -> request.remoteAddress,
                        SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                        SKUserDomains -> domains.domains.values.mkString(","),
                        SKCurrentTime -> currentTime)
                      val user_info = models.User.userDetails(email)
                      val domain_user = DomainUser(user_info.get, domains)
                      val realm_def = user_info.get.realm_def
                      val url_def = user_info.get.url_def
                      val mps_def = user_info.get.mps_def
                      val sess = play.api.mvc.Session.encode(cookie)
                      val session_id = sess.split("-")(0)
                      val redirectUrl = Auth.ReqProtocol + "://" + realm_def + "/" + url_def
                      Redirect(redirectUrl).withSession(
                        SKUserId -> user.email,
                        SKUserOrg -> user.org,
                        SKUserRole -> user.role,
                        SKRemoteAddress -> request.remoteAddress,
                        SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                        SKUserDomains -> domains.domains.values.mkString(","),
                        SKCurrentTime -> currentTime,
                        SKSessionId -> session_id)
                    }
                  }
                }
              }.getOrElse(InternalServerError(views.html.error(None, None, None, HttpStatus.Error, "Unexpected error. Please sign out and sign in again.")))
          })
    }
  }
  
  /** Authenticates a user which makes a call from server to the IS server and sets the cookies
   *  
   */

  
  def appLogin(version: String) = Action { implicit request =>
    version match {
      case constants.VERTICA_VERSION =>
        appLoginForm.bindFromRequest.fold(
          formWithErrors => BadRequest("Body has error"),
          epu => epu match {
            case (email, password, uriOption, noRedirectOption) =>
              if (models.vUser.emailPasswdMatch(email, password)._2) {
                log.debug(s"A user with email ${email} signed in")
                val currentTime = DateTime.now.getMillis().toString
                models.vUser.byEmail(email).map { user =>
                  var isAdmin = false
                  val domains = models.vRole.roleDetails(user.role).get
                  val features = domains.features
                  val domainlist = domains.domains
                  val mfr = user.mps_def.split("/")
                  for ((k, v) <- domainlist) {
                    val mps = v.split("/")
                    if (mps(0).equals(mfr)) {
                      if (features(v).contains("admin")) {
                        isAdmin = true
                      }
                    }
                  }
                  val newMPSList = for(value <- domains.domains.values) yield value.split("/").mkString(":")
                  val cookie: Map[String, String] = Map(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role,
                    SKRemoteAddress -> request.remoteAddress,
                    SKUserRealms -> domains.realm.mkString(","),
                    SKUserDomains -> newMPSList.mkString(","),
                    SKProjLimit -> domains.studio_proj_limit.toString,
                    SKCurrentTime -> currentTime,
                    SKAdmin -> isAdmin.toString
                  )

                  val sess = play.api.mvc.Session.encode(cookie)
                  val token = "PLAY_SESSION=" + "\"" + sess + "\""
                  Ok(models.Utils.jsonResponse("Success", "Authentication Token", Json.toJson(token))).withSession(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role,
                    SKRemoteAddress -> request.remoteAddress,
                    SKUserRealms -> domains.realm.mkString(","),
                    SKUserDomains -> newMPSList.mkString(","),
                    SKProjLimit -> domains.studio_proj_limit.toString,
                    SKCurrentTime -> currentTime,
                    SKAdmin -> isAdmin.toString
                  )
                }.getOrElse(InternalServerError(models.Utils.jsonResponse("Failure", "Unexpected error, Please try again.", Json.toJson("Unexpected error, Please try again"))))
              } else {
                Forbidden(models.Utils.jsonResponse("Failure", "Incorrect email or password.", Json.toJson("Incorrect email or password")))
              }
          })
      case _ =>
        appLoginForm.bindFromRequest.fold(
          formWithErrors => BadRequest("Body has error"),
          epu => epu match {
            case (email, password, uriOption, noRedirectOption) =>
              if (models.User.emailPasswdMatch(email, password)._2) {
                log.debug(s"A user with email ${email} signed in")
                val currentTime = DateTime.now.getMillis().toString
                models.User.byEmail(email).map { user =>
                  var isAdmin = false
                  val domains = models.Role.roleDetails(user.role).get
                  val features = domains.features
                  val domainlist = domains.domains
                  val mfr = user.mps_def.split(":")
                  for ((k, v) <- domainlist) {
                    val mps = v.split(":")
                    if (mps(0).equals(mfr)) {
                      if (features(v).contains("admin")) {
                        isAdmin = true
                      }
                    }
                  }
                  val cookie: Map[String, String] = Map(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role,
                    SKRemoteAddress -> request.remoteAddress,
                    SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                    SKUserDomains -> domains.domains.values.mkString(","),
                    SKProjLimit -> domains.studio_proj_limit.toString,
                    SKCurrentTime -> currentTime,
                    SKAdmin -> isAdmin.toString
                  )

                  val sess = play.api.mvc.Session.encode(cookie)
                  val token = "PLAY_SESSION=" + "\"" + sess + "\""
                  Ok(models.Utils.jsonResponse("Success", "Authentication Token", Json.toJson(token))).withSession(
                    SKUserId -> user.email,
                    SKUserName -> user.first_name,
                    SKUserOrg -> user.org,
                    SKUserRole -> user.role,
                    SKRemoteAddress -> request.remoteAddress,
                    SKUserRealms -> domains.realm_isdomain.keys.mkString(","),
                    SKUserDomains -> domains.domains.values.mkString(","),
                    SKProjLimit -> domains.studio_proj_limit.toString,
                    SKCurrentTime -> currentTime,
                    SKAdmin -> isAdmin.toString
                  )
                }.getOrElse(InternalServerError(models.Utils.jsonResponse("Failure", "Unexpected error, Please try again.", Json.toJson("Unexpected error, Please try again"))))
              } else {
                Forbidden(models.Utils.jsonResponse("Failure", "Incorrect email or password.", Json.toJson("Incorrect email or password")))
              }
          })
    }
  }
  

  /**
   * Logout and clean the session.
   */
  def logout(version: String, mpsOpt: Option[String], feature: Option[String]) = Action { implicit request =>
    val mps = mpsOpt.getOrElse("").split(":|/").toList
    val session_id = request.session.get(SKSessionId).getOrElse(CVDefaultStr)
    request.session.get(SKUserId).map {userid =>
      if(mps.size == 3 ){
        if(version == constants.CASSANDRA_VERSION )
          models.User.trackUserLogoutActivity(mps(0), mps(1), mps(2), userid, session_id, feature.getOrElse(CVDefaultStr))
        else
          models.vUser.trackUserLogoutActivity(mps(0), mps(1), mps(2), userid, session_id, feature.getOrElse(CVDefaultStr))
      }
      log.debug(s"A user with userid $userid signed out")
    }
    Ok(models.Utils.jsonResponse("Success", "User logged out", Json.toJson(Auth.GBHomeRedirectUrl))).withNewSession.flashing( FKSuccess -> FMLogout)
  }

  
  /** tracks the user activity on the glassbeam portal
   *  
   */
  def trackUser(version: String, mfr: String, prod: String, sch: String, app: String, module: String, activity: String, switched_feature: Option[String]) = IsAuthenticated { userid => 
    implicit request =>
    val startTime = DateTime.now
    val details = userData.bindFromRequest.get.details
    val solr_qry = userData.bindFromRequest.get.solr_query
    log.debug(s"Tracking User activity")
	val sessionId = request.session.get(SKSessionId).getOrElse("NA")
	if(!app.equals(AppName)){
		if(version == constants.CASSANDRA_VERSION) models.User.userTracking(mfr, prod, sch, userid, sessionId, app, module, activity, switched_feature, details, solr_qry) else models.vUser.userTracking(mfr, prod, sch, userid, sessionId, app, module, activity, switched_feature, details, solr_qry)
	}
	
	val endTime = DateTime.now
	val currentTime = endTime.getMillis().toString
	val sessionTimeoutInMillis = Play.current.configuration.getInt("user.session.timeout").getOrElse(1800)*1000
	val previousTime = request.session.get(SKCurrentTime).getOrElse(currentTime)
    if(currentTime.toLong - previousTime.toLong > sessionTimeoutInMillis){
       log.debug(s"Session Timed Out")
	   Results.Forbidden(models.Utils.jsonResponse("Failure", "User Session timeout", Json.toJson(Auth.GBHomeRedirectUrl)))
    } else {
   		 log.info(s"[$mfr/$prod/$sch][User : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
    	 Ok(models.Utils.jsonResponse("Success", "", Json.toJson(""))).withSession(request.session + (SKCurrentTime -> currentTime.toString))
    }
  }

  /** Validates JWT AuthToken
   *
   * @return msg Success/Failure
   */
  def validateAccessToken(version: String) = IsUserAccessTokenAuthenticated { userid => implicit request =>
    val gbToken = request.headers.get(JWT_HEADER_TOKEN).getOrElse(CVDefaultStr)
    userAccessTokenForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        val access_token = c.access_token.getOrElse(CVDefaultStr)
        val jwtToken = if(gbToken.equals(CVDefaultStr)) access_token else gbToken
        val res = models.JWTUtils.validateAccessToken(jwtToken, c.email)
        val endTime = DateTime.now
        log.info(s"[Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res.header.status match {
          case 200 =>
            log.debug(s"Access token is valid $jwtToken for user ${c.email}")
            Ok(models.Utils.jsonResponse("Success", s"Access token is valid.", Json.toJson("Access token is valid")))
          case 403 =>
            log.debug(s"Access token is invalid $jwtToken for user ${c.email}")
            Forbidden(models.Utils.jsonResponse("Failure", s"Access token is invalid.", Json.toJson("Access token is invalid")))
          case _ =>
            log.error(s"Unable to validate Access token $jwtToken for user $userid")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  def updateLoginSuccess(version: String) = IsAuthenticated { userid =>
    implicit request =>
         val reqSession = request.cookies.get("PLAY_SESSION")
         models.vUser.updateSuccessLoginAttempt(userid, reqSession)
         Ok(models.Utils.jsonResponse("Success", "User login success updated successfully", Json.toJson("")))

  }
}
