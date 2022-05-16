package controllers

import play.api.{Logger, Play}
import play.api.data.Form
import play.api.data.Forms.{optional, text, tuple}
import play.api.mvc._
import play.api.data.Forms._
import constants._
import controllers.Application.Forbidden
import play.api.libs.json.{JsObject, Json, Writes}
import play.api.http.HeaderNames
import models._
import models.Utils._
import org.joda.time.DateTime
import play.api.cache.Cache
import play.api.Play.current

import scala.util.{Failure, Success, Try}


object Clinsight extends Controller with Secured {
  val log = Logger("Controller_Clinsight")

  val auth_email = Play.current.configuration.getString("pardot.email").getOrElse(
    throw new RuntimeException("pardot.email needs to be set in application.conf "))
  val auth_password = Play.current.configuration.getString("pardot.password").getOrElse(
    throw new RuntimeException("pardot.password needs to be set in application.conf "))
  val auth_user_key = Play.current.configuration.getString("pardot.user_key").getOrElse(
    throw new RuntimeException("pardot.user_key needs to be set in application.conf "))
  val ctoken = Play.current.configuration.getString("clinsight.auth-token").getOrElse(
    throw new RuntimeException("clinsight.auth-token needs to be set in application.conf "))

  implicit val clinsightUserDataWrites = new Writes[ClinsightUserData]{
    def writes(c: ClinsightUserData) = {
      Json.obj(
        "first_name"  -> c.first_name,
        "last_name" -> c.last_name,
        "company" -> c.company_name,
        "email"  -> c.email)
    }
  }
  implicit val clinsightsLoginResponseWrite = Json.writes[ClinsightsLoginResponse]

  val clinsightUserForm = Form(
    mapping(
      "first_name" -> text,
      "last_name" -> text,
      "company" -> text,
      "email" -> email
    )(ClinsightUserData.apply)(ClinsightUserData.unapply)
  )

  val clinsightLoginForm = Form(
    mapping(
      "username" -> email,
      "password" -> text,
      "user_device_info" -> optional(mapping(
        "username" -> optional(email),
        "token" -> optional(text),
        "device_token" -> text,
        "app_type" -> number,
        "app_id" -> text
      )(UserDeviceInfo.apply)(UserDeviceInfo.unapply))
    )(ClinsightLogin.apply)(ClinsightLogin.unapply)
  )

  val clinsightUserDetailsForm = Form(
    mapping(
      "username" -> email,
      "token" -> nonEmptyText
    )(ClinsightUserDetails.apply)(ClinsightUserDetails.unapply)
  )

  val clinsightSetDefaultMPSForm = Form(
    mapping(
      "username" -> email,
      "mps" -> text,
      "token" -> nonEmptyText
    )(ClinsightSetDefaultMPS.apply)(ClinsightSetDefaultMPS.unapply)
  )

  val clinsightAddPropectForm = Form(
    mapping(
      "first_name" -> nonEmptyText,
      "last_name" -> text,
      "username" -> email,
      "password" -> nonEmptyText(minLength=4, maxLength = FSPasswdMax),
      "company_name" -> text
    )(ClinsightAddProspectForm.apply)(ClinsightAddProspectForm.unapply)
  )

  val clinsightUserDeviceInfoForm = Form(
    mapping(
      "username" -> optional(email),
      "token" -> optional(text),
      "device_token" -> text,
      "app_type" -> number,
      "app_id" -> text
    )(UserDeviceInfo.apply)(UserDeviceInfo.unapply)
  )

  /** Clinsight sample html form for testing
    *
    * @return Renders HTML View
    */
  def clinsightView(version: String) = Action { implicit request =>
    Ok(views.html.clinsight(ctoken))
  }

  /** Clinsight Self Registration html View
    *
    * @return Renders Self Registration html View
    */
  def clinsightRegistrationView(version: String) = Action { implicit request =>
    Ok(views.html.clinsightRegistrationForm(ClinsightLogo))
  }

  /** Creates an entry in Pardot server
    *
    * @return XML with user details
    */
  def createMailWrapper(version: String) = Action { implicit request =>
      clinsightUserForm.bindFromRequest.fold(
        formWithErrors => resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightValidationErrorCodeMsg, clinsightValidationErrorCode)),
        c => {
          var authCreds = AuthCreds(auth_email, auth_password, auth_user_key)
          val token = models.Clinsight.pardotLogin(authCreds)
          val emailPayload = EmailData(auth_email, auth_password, auth_user_key, c.first_name, c.last_name, c.company_name, c.email, token)
          val res = models.Clinsight.createMail(emailPayload)
          res match {
            case Success(resultSet) =>
              log.debug("Pardot : Email created successfully")
              resultWithCORSDisabled(resultSet)
            case Failure(exception) =>
              log.error(s"Pardot : Unable to create mail")
              resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightServerErrorCodeMsg, clinsightServerErrorCode))
          }
        }
      )
  }

  /**
    * Authenticates user, get user details
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def login(version: String) = Action { implicit request =>
    clinsightLoginForm.bindFromRequest.fold(
      formWithErrors => resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightValidationErrorCodeMsg, clinsightValidationErrorCode)),
      c => {
        val cacheValue = models.JWTUtils.createToken(UserAccessToken(c.username))
        Cache.set(c.username.toLowerCase(), cacheValue)
        log.debug(s"login payload : $c")
        val res = version match{
          case constants.VERTICA_VERSION => models.vClinsight.login(c, cacheValue)
          case _ => models.Clinsight.login(c.username, c.password, cacheValue)
        }
        res match {
          case Success(resultSet) =>
            val currentTime = DateTime.now.getMillis().toString
            version match {
              case constants.VERTICA_VERSION =>
                val user = models.vUser.byEmail(c.username).get
                val domains = models.vRole.roleDetails(user.role).get
                val isAdmin = models.Utils.vIsAdminBool(user, domains)
                val cookie: Map[String, String] = models.Utils.vCreateCookie(user, domains, isAdmin, currentTime, request)
                val sess = play.api.mvc.Session.encode(cookie)
                val session_id = sess.split("-")(0)
                log.debug(s"Clinsight : User ${c.username} logged in successfully")
                val env = resultSet \ "environments"
                if (env.size == 0) {
                  resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightNoDashboardErrorCodeMsg, clinsightNoDashboardErrorCode))
                } else {
                  val mps = user.mps_def.split("/").toList
                  resultWithCORSDisabled(resultSet).withSession(
                    SKUserMfr -> mps(0),
                    SKUserProd -> mps(1),
                    SKUserSch -> mps(2),
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
                    SKSessionId -> session_id
                  )
                }
              case _ =>
                val user = models.User.byEmail(c.username).get
                val domains = models.Role.roleDetails(user.role).get
                val isAdmin = models.Utils.isAdminBool(user, domains)
                val cookie: Map[String, String] = models.Utils.createCookie(user, domains, isAdmin, currentTime, request)
                val sess = play.api.mvc.Session.encode(cookie)
                val session_id = sess.split("-")(0)
                log.debug(s"Clinsight : User ${c.username} logged in successfully")
                val env = resultSet \ "environments"
                if (env.size == 0) {
                  resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightNoDashboardErrorCodeMsg, clinsightNoDashboardErrorCode))
                } else {
                  val mps = user.mps_def.split(":").toList
                  resultWithCORSDisabled(resultSet).withSession(
                    SKUserMfr -> mps(0),
                    SKUserProd -> mps(1),
                    SKUserSch -> mps(2),
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
                    SKSessionId -> session_id
                  )
                }
            }
          case Failure(exception) =>
            val ex = exception.getMessage()
            ex match{
              case "UserInactive" => log.error(s"Clinsight : User is not active : ${c.username}")
                resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightLoginInactiveErrorCodeMsg, clinsightLoginErrorCode))
              case "InvalidCredentials" => log.error(s"Clinsight : Invalid credentials for username : ${c.username}")
                resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightLoginCredErrorCodeMsg, clinsightLoginErrorCode))
              case _ => log.error(s"Clinsight : Unable to login for user : ${c.username}")
                resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightLoginErrorCodeMsg, clinsightLoginErrorCode))
            }
        }
      }
    )
  }

  /**
    * Get User details.
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def getUserDetails(version: String) = Action { implicit request =>
    clinsightUserDetailsForm.bindFromRequest.fold(
      formWithErrors => resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightValidationErrorCodeMsg, clinsightValidationErrorCode)),
      c => {
        val token = c.token
        val cacheKey = c.username.toLowerCase()
        val cacheToken: Option[String] = Cache.getAs[String](cacheKey)
        if(!cacheToken.getOrElse("").equals(token))
          resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightAuthErrorCodeMsg, clinsightAuthErrorCode))
        else {
          val res = version match{
            case constants.VERTICA_VERSION => models.vClinsight.getUserDetails(c.username, "")
            case _ => models.Clinsight.getUserDetails(c.username, "")
          }
          res match {
            case Success(resultSet) =>
	      val env = resultSet \ "environments"
              if (env.size == 0) {
                resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightNoDashboardErrorCodeMsg, clinsightNoDashboardErrorCode))
              }
              else {
                log.debug(s"Clinsight :  Information for user : ${c.username} fetched successfully")
                resultWithCORSDisabled(resultSet)
              }
            case Failure(exception) =>
              log.error(s"Clinsight : Unable to fetch information for user : ${c.username}")
              resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightLoginErrorCodeMsg, clinsightLoginErrorCode))
          }
        }
      }
    )
  }

  /**
    * Set default MPS of a user. Updates mps_def and realm_def of `user` CF
    *
    * @return XML with user details, product list and healthcheck report url
    */
  def setDefaultMPS(version: String) = Action { implicit request =>
    clinsightSetDefaultMPSForm.bindFromRequest.fold(
      formWithErrors => resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightValidationErrorCodeMsg, clinsightValidationErrorCode)),
      c => {
        val token = c.token
        val cacheKey = c.username.toLowerCase()
        val cacheToken: Option[String] = Cache.getAs[String](cacheKey)
        if(!cacheToken.getOrElse("").equals(token))
          resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightAuthErrorCodeMsg, clinsightAuthErrorCode))
        else {
          val res = version match{
            case constants.VERTICA_VERSION => models.vClinsight.setDefaultMPS(c.username, c.mps)
            case _ => models.Clinsight.setDefaultMPS(c.username, c.mps)
          }
          res match {
            case Success(resultSet) =>
              log.debug(s"Clinsight : Default MPS set as ${c.mps} for user : ${c.username} successfully")
              resultWithCORSDisabled(resultSet)
            case Failure(exception) =>
              log.error(s"Clinsight : Unable to set ${c.mps} as default MPS for user : ${c.username}")
              resultWithCORSDisabled(models.Utils.failureStringToXML(clinsightLoginErrorCodeMsg, clinsightLoginErrorCode))
          }
        }
      }
    )
  }

  /**
    * Adds a campaigning user as a prospect
    *
    * @return XML with Success or Failure msg.
    */
  def registerProspect(version: String) = Action { implicit request =>
    val prospectForm = clinsightAddPropectForm.bindFromRequest.get
    version match {
      case constants.VERTICA_VERSION =>
        models.vUser.byEmail(prospectForm.username).map { u =>
          Ok(models.Utils.jsonResponse("Info", clinsightRedirectAlreadyCreatedMsg, Json.toJson("")))
        } getOrElse {
          val prospectExists =  models.vClinsight.ifProspectExits(prospectForm.username)
          if (!prospectExists) {
            val result = models.vClinsight.addProspect(prospectForm)
            result map { msg =>
              InternalServerError(models.Utils.jsonResponse("Failure", clinsightRedirectInternalServerError, Json.toJson("")))
            } getOrElse { Ok(models.Utils.jsonResponse("Success", clinsightRedirectSuccessSignupMsg, Json.toJson(""))) }
          } else {
            models.vClinsight.regenerateVerificationEmail(prospectForm.username)
            Ok(models.Utils.jsonResponse("Info", clinsightRedirectAlreadyRegisteredMsg, Json.toJson("")))
          }
        }
      case _ =>
        models.User.byEmail(prospectForm.username).map { u =>
          Ok(models.Utils.jsonResponse("Info", clinsightRedirectAlreadyCreatedMsg, Json.toJson("")))
        } getOrElse {
          val prospectExists =  models.Clinsight.ifProspectExits(prospectForm.username)
          if (!prospectExists) {
            val result = models.Clinsight.addProspect(prospectForm)
            result map { msg =>
              InternalServerError(models.Utils.jsonResponse("Failure", clinsightRedirectInternalServerError, Json.toJson("")))
            } getOrElse { Ok(models.Utils.jsonResponse("Success", clinsightRedirectSuccessSignupMsg, Json.toJson(""))) }
          } else {
            models.Clinsight.regenerateVerificationEmail(prospectForm.username)
            Ok(models.Utils.jsonResponse("Info", clinsightRedirectAlreadyRegisteredMsg, Json.toJson("")))
          }
        }
    }

  }

  /**
    * Verifies the prospect user
    *
    * @return XML with Success or Failure msg.
    */
  def verifyProspect(version: String, email: String, token_id: String) = Action { implicit request =>
    val result = version match{
      case constants.VERTICA_VERSION => models.vClinsight.verifyProspect(email, token_id)
      case _ => models.Clinsight.verifyProspect(email, token_id)
    }
    val msg = result map { err =>
      s"$err"
    } getOrElse {"UserVerified"}
    val redirectMsg = msg match{
      case "UserVerified" => (clinsightSuccess, clinsightRedirectSuccessVerificationMsg)
      case "NoUser" => (clinsightInfo, clinsightRedirectNoUserMsg)
      case "UserVerifiedAlready" => (clinsightInfo, clinsightRedirectAlreadyVerifiedMsg)
      case "Expired" => (clinsightInfo, clinsightRedirectExpiredMsg)
      case "InValidToken" => (clinsightError, clinsightRedirectInvalidTokenMsg)
      case _ => (clinsightError, clinsightRedirectInternalServerError)
    }
    if(msg.equals("Expired")){
      version match{
        case constants.VERTICA_VERSION => models.vClinsight.regenerateVerificationEmail(email)
        case _ => models.Clinsight.regenerateVerificationEmail(email)
      }
    }
    Ok(views.html.clinsightMsgInfo(redirectMsg._1, redirectMsg._2, ClinsightLogo))
  }

  /**
    * Regenerates verficiation email and send it to the user
    *
    * @return XML with Success or Failure msg.
    */
  def regenerateVerificationEmail(version: String, email: String) = Action { implicit request =>
    val result = version match{
      case constants.VERTICA_VERSION => models.vClinsight.regenerateVerificationEmail(email)
      case _ => models.Clinsight.regenerateVerificationEmail(email)
    }
    result.map { err =>
      err match {
        case "NoUserAsSuch" => Ok(models.Utils.jsonResponse("Failure", s"$err", Json.toJson("")))
        case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
      }
    } getOrElse {
      Ok(models.Utils.jsonResponse("Success", s"Regenerated email successfully", Json.toJson("")))
    }
  }

  /**
   * Deletes user_device_token entry from `user_device_info` CF
   *
   * @return Success/Failure msg
   */
  def deleteUserDeviceInfo(version: String) = Action { implicit request =>
    clinsightUserDeviceInfoForm.bindFromRequest.fold(
      formWithErrors => resultWithCORSDisabledJSON(models.Utils.jsonResponse("Failure", clinsightValidationErrorCodeMsg, Json.toJson(""))),
      c => {
        val token = c.token.getOrElse("")
        val username = c.username.getOrElse("")
        val (cacheKey, cacheValue) = models.Utils.genClinsightCacheKeyValue(username, request.remoteAddress)
        val cacheToken: Option[String] = Cache.getAs[String](cacheKey)
          val res = models.vClinsight.deleteUserDeviceInfo(c)
          res match {
            case Success(resultSet) =>
              log.debug(s"Clinsight : user's device info has been deleted successfully for user : ${c}")
              resultWithCORSDisabledJSON(models.Utils.jsonResponse("Success", clinsightSuccess, Json.toJson(resultSet)))
            case Failure(exception) =>
              log.error(s"Clinsight : Unable to delete device info for user : ${c}")
              resultWithCORSDisabledJSON(models.Utils.jsonResponse("Failure", clinsightInternalServerErrorCodeMsg, Json.toJson("")))
          }
      }
    )
  }

  /**
   * Updated user_device_token entry in `user_device_info` CF
   *
   * @return Success/Failure msg
   */
  def updateUserDeviceInfo(version: String) = Action { implicit request =>
    clinsightUserDeviceInfoForm.bindFromRequest.fold(
      formWithErrors => resultWithCORSDisabledJSON(models.Utils.jsonResponse("Failure", clinsightValidationErrorCodeMsg, Json.toJson(""))),
      c => {
        val token = c.token.getOrElse("")
        val username = c.username.getOrElse("")
        val (cacheKey, cacheValue) = models.Utils.genClinsightCacheKeyValue(username, request.remoteAddress)
        val cacheToken: Option[String] = Cache.getAs[String](cacheKey)
        val user = models.vUser.byEmail(username).get
        val res = dao.DBUtils.updateUserDeviceInfo(username, Some(c), user)
        res match {
          case Success(resultSet) =>
            log.debug(s"Clinsight : user's device info has been updated successfully for user : ${c}")
            resultWithCORSDisabledJSON(models.Utils.jsonResponse("Success", clinsightSuccess, Json.toJson(resultSet)))
          case Failure(exception) =>
            log.error(s"Clinsight : Unable to update device info for user : ${c}")
            resultWithCORSDisabledJSON(models.Utils.jsonResponse("Failure", clinsightInternalServerErrorCodeMsg, Json.toJson("")))
        }
      }
    )
  }

  /**
   * Authenticates user, get user's mps_def and clinsights MPSes
   *
   * @return JSON with user's mps_def and clinsights MPSes
   */
  def mobileLogin(version: String) = Action { implicit request =>
    clinsightLoginForm.bindFromRequest.fold(
      formWithErrors => Forbidden(models.Utils.loginFailedResponse("Failure", clinsightValidationErrorCodeMsg, Json.toJson(clinsightValidationErrorCodeMsg), 0)),
      c => {
        val jstToken = models.JWTUtils.createToken(UserAccessToken(c.username))
        log.debug(s"login payload : $c")
        val startTime = DateTime.now
        val res = models.vClinsight.mobileLogin(c, jstToken)
        val endTime = DateTime.now
        log.info(s"[Userid : ${c.username}] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(resultSet) =>
            Ok(models.Utils.jsonResponse("Success", "List of all domains + Authentication Token", Json.toJson(resultSet)))
          case Failure(exception) =>
            val ex = exception.getMessage()
            ex match{
              case "ClinsightsNotConfigured" =>
                log.error(s"Clinsight : Not configured : ${c.username}")
                Forbidden(models.Utils.loginFailedResponse("Failure", clinsightNoDashboardErrorCodeMsg, Json.toJson(clinsightNoDashboardErrorCodeMsg), 0))
              case "UserInactive" =>
                log.error(s"Clinsight : User is not active : ${c.username}")
                Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginInactiveErrorCodeMsg, Json.toJson(clinsightLoginInactiveErrorCodeMsg), 0))
              case "InvalidCredentials" =>
                log.error(s"Clinsight : Invalid credentials for username : ${c.username}")
                Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginCredErrorCodeMsg, Json.toJson(clinsightLoginErrorCode), 0))
              case _ =>
                log.error(s"Clinsight : Unable to login for user : ${c.username}")
                Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginErrorCodeMsg, Json.toJson(clinsightLoginErrorCode), 0))
            }
        }
      }
    )
  }

  /**
   * Get User's MPS details.
   *
   * @return Json with user's MPS details, healthcheck product list
   */
  def getUserMpsDetails(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid =>
    implicit request => {
      clinsightUserDetailsForm.bindFromRequest.fold(
        formWithErrors => Forbidden(models.Utils.loginFailedResponse("Failure", clinsightValidationErrorCodeMsg, Json.toJson(clinsightValidationErrorCodeMsg), 0)),
        c => {
          val token = c.token
          log.debug(s"getUserMpsDetails payload : $c")
          val startTime = DateTime.now
          val clinsightLogin = ClinsightLogin(c.username, "", None)
          val res = models.vClinsight.mobileLogin(clinsightLogin, token, true)
          val endTime = DateTime.now
          log.info(s"[Userid : ${c.username}] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
          res match {
            case Success(resultSet) =>
              Ok(models.Utils.jsonResponse("Success", "List of all domains + Authentication Token", Json.toJson(resultSet)))
            case Failure(exception) =>
              val ex = exception.getMessage()
              ex match{
                case "ClinsightsNotConfigured" =>
                  log.error(s"Clinsight : Not configured : ${c.username}")
                  Forbidden(models.Utils.loginFailedResponse("Failure", clinsightNoDashboardErrorCodeMsg, Json.toJson(clinsightNoDashboardErrorCodeMsg), 0))
                case "UserInactive" =>
                  log.error(s"Clinsight : User is not active : ${c.username}")
                  Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginInactiveErrorCodeMsg, Json.toJson(clinsightLoginInactiveErrorCodeMsg), 0))
                case "InvalidCredentials" =>
                  log.error(s"Clinsight : Invalid credentials for username : ${c.username}")
                  Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginCredErrorCodeMsg, Json.toJson(clinsightLoginErrorCode), 0))
                case _ =>
                  log.error(s"Clinsight : Unable to login for user : ${c.username}")
                  Forbidden(models.Utils.loginFailedResponse("Failure", clinsightLoginErrorCodeMsg, Json.toJson(clinsightLoginErrorCode), 0))
              }
          }
        }
      )
    }
  }

  /**
    * Disables CORS and prevents browser from showing CORS error
    *
    * @return Response with ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_METHODS, ACCESS_CONTROL_ALLOW_HEADERS
    */
  def resultWithCORSDisabled(resultSet: scala.xml.Elem) : play.api.mvc.Result = {
    Ok(resultSet).withHeaders(HeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN -> "*",
      HeaderNames.ALLOW -> "*",
      HeaderNames.ACCESS_CONTROL_ALLOW_METHODS -> "POST, GET, PUT, DELETE, OPTIONS",
      HeaderNames.ACCESS_CONTROL_ALLOW_HEADERS -> "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent"
    )
  }

  /**
   * Disables CORS and prevents browser from showing CORS error
   *
   * @return Response with ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_METHODS, ACCESS_CONTROL_ALLOW_HEADERS
   */
  def resultWithCORSDisabledJSON(resultSet: JsObject) : play.api.mvc.Result = {
    Ok(resultSet).withHeaders(HeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN -> "*",
      HeaderNames.ALLOW -> "*",
      HeaderNames.ACCESS_CONTROL_ALLOW_METHODS -> "POST, GET, PUT, DELETE, OPTIONS",
      HeaderNames.ACCESS_CONTROL_ALLOW_HEADERS -> "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent"
    )
  }
}

