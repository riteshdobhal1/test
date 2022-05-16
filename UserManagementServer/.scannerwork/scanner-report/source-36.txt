package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.mvc.Http.Request
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import play.api.i18n.{MessagesApi, I18nSupport}
import play.api.i18n.Messages.Implicits._
import models._
import views._
import constants._
import models.Auth
import play.api.libs.json._
import play.api.libs.Jsonp
import scala.util.{Try, Success, Failure}
import org.joda.time._
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.language.postfixOps
import java.util.Date
import org.joda.time.format._

case class ListUser(mfr: String)


object AdminUser extends Controller with Secured {
  val log = Logger("Controller_AdminUser")
  val module = ModAdmin
  class GroupMultipleAggrByResultWithHeader(val header: (String, List[String]), val result: Map[Any,List[Map[String,Any]]])
  class ResultWithHeader(val header: List[String], val result: List[Array[Any]])
  class MultipleAggrWithHeader(val header: List[String], val result: List[JsValue])
  /**
   * form for adding a new user
   *
   */
  implicit val userWrites = Json.writes[User]
  implicit val newUserWrites = Json.writes[NewUser]
  implicit val userListWrites = Json.writes[UserList]
  implicit val userListDetailsWrites = Json.writes[UserListDetails]
  implicit val userEncrptDcrptWrites = Json.writes[UserEncrptDcrpt]
  implicit val ruleCreatorWrites = Json.writes[RuleCreatorList]
  implicit val multiAggrWithHeaderWrites = new Writes[MultipleAggrWithHeader] {
    def writes(rwh: MultipleAggrWithHeader): JsValue = Json.toJson(rwh.header zip rwh.result toMap)
  }
  
  implicit val arrAnyWrites = new Writes[Array[Any]] {
    def writes(r: Array[Any]): JsValue = {
      JsArray { for (c <- r) yield {
                   c match {
                      case i: Int => JsNumber(i)
                      case l: Long => JsNumber(l)
                      case f: Float => JsNumber(f)
                      case d: Double => JsNumber(d)
                      case s: String => JsString(s)
                      case b: Boolean => JsBoolean(b)
                      case x if (x == null) => JsNull
                    }        
          }
      }
     }
  }
  
  implicit val mapAnyWrites = new Writes[Map[String, Any]] {
    def writes(m: Map[String, Any]) = {
      Json.toJson(m map {
        case (k, v) => k -> (v match {
          case i: Int => JsNumber(i)
          case l: Long => JsNumber(l)
          case f: Float => JsNumber(f)
          case d: Double => JsNumber(d)
          case s: String => JsString(s)
          case b: Boolean => JsBoolean(b)
          case arr: Array[Any] => JsArray {
            for (c <- arr) yield {
              c match {
                case i: Int => JsNumber(i)
                case l: Long => JsNumber(l)
                case f: Float => JsNumber(f)
                case d: Double => JsNumber(d)
                case s: String => JsString(s)
                case b: Boolean => JsBoolean(b)
                case m: Map[_, _] => writes(m.asInstanceOf[Map[String, Any]])
                case x if (x == null) => JsNull
              }
            }
          }
          case m: Map[_, _] => writes(m.asInstanceOf[Map[String, Any]])
          case ll: List[Any] => JsArray {
            for (c <- ll) yield {
              c match {
                case i: Int           => JsNumber(i)
                case l: Long          => JsNumber(l)
                case f: Float         => JsNumber(f)
                case d: Double        => JsNumber(d)
                case s: String        => JsString(s)
                case b: Boolean       => JsBoolean(b)
                case m: Map[_, _]     => writes(m.asInstanceOf[Map[String, Any]])
                case x if (x == null) => JsNull
              }
            }

          }
          case jd: Date         => JsString(models.Utils.dateFormat.print(new DateTime(jd, DateTimeZone.UTC)))
          case x if (x == null) => JsNull
        })
      })
    }
  }
  
  implicit val resultWithHeaderWrites = new Writes[ResultWithHeader] {
    def writes(rwh: ResultWithHeader): JsValue =
      if (rwh.header.indexOf("obs_ts") >= 0) {
        JsArray {
          val tsIdx = rwh.header.indexOf("obs_ts")
          rwh.result map { row =>
            val headerValMap = rwh.header zip row toMap
            val dtStr = Utils.dateFormat.print(new DateTime(row(tsIdx), DateTimeZone.UTC).getMillis())
            val addedFields = Map("obs_epoch" -> row(tsIdx)) ++ Map("obs_ts" -> dtStr)
            Json.toJson(headerValMap ++ addedFields)
          }
        }
      } else {
        JsArray { rwh.result map { row => Json.toJson(rwh.header zip row toMap) } }
      }
  }
  
  implicit val groupMultipleAggrByResultWithHeaderWrites = new Writes[GroupMultipleAggrByResultWithHeader] {
    def writes(rwh: GroupMultipleAggrByResultWithHeader): JsValue = {
      Json.toJson (rwh.result map { case (k, v) => 
        val keyVal = if(rwh.header._1.equals("obs_ts")) {
          val dateFormat = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ").withZoneUTC()
          dateFormat.print(k.asInstanceOf[Long])
        } else { k }
        Json.toJson (Map(rwh.header._1 -> keyVal) ++ v.foldLeft(Map[String, Any]())((f, t) => f ++ t))})}
  }
  
  val addUserForm: Form[UserWithPasswd] = Form(
    mapping(
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> text(maxLength = 128),
      "department" -> text(maxLength = 128),
      "state" -> text(maxLength = 128),
      "city" -> text(maxLength = 128),
      "country" -> text(maxLength = 128),
      "sso" -> boolean,
      "wb_user_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "emails" -> tuple(
        "main" -> email,
        "confirm" -> email).verifying(
          "Email addresses don't match", emails => (emails._1 == emails._2)).verifying(
            "This email address belongs to another user", emails => models.User.notExists(emails._1)),
      "phone" -> text(maxLength = 20),
      "org" -> nonEmptyText(maxLength = 64),
      "role" -> nonEmptyText(maxLength = 64),
      "realm_def" -> nonEmptyText(maxLength = 128),
      "url_def" -> nonEmptyText(maxLength = 128),
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_prospect" -> boolean,
      "dashboard_admin" -> boolean,
      "is_external" -> boolean,
      "end_customer" -> optional(text)) {
        (first_name, last_name, department, state, city, country, sso, wb_user_name, report_usage, emails, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external,end_customer) =>
          UserWithPasswd(models.User(emails._1, first_name, last_name, department, city, state, country, sso, wb_user_name, report_usage, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external,end_customer,true, true))
      } {
        up => Some(up.u.first_name, up.u.last_name, up.u.department, up.u.state, up.u.city, up.u.country, up.u.sso, up.u.wb_user_name, up.u.report_usage, (up.u.email, up.u.email), up.u.phone, up.u.org, up.u.role, up.u.realm_def, up.u.url_def, up.u.mps_def, up.u.is_prospect, up.u.dashboard_admin,up.u.is_external,up.u.end_customer)
      })

  val addCustomerUserForm: Form[UserWithPasswd] = Form(
    mapping(
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> text(maxLength = 128),
      "department" -> text(maxLength = 128),
      "state" -> text,
      "city" -> text,
      "country" -> text,
      "sso" -> boolean,
      "wb_user_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "email" -> nonEmptyText,
      "phone" -> text,
      "org" -> nonEmptyText(maxLength = 64),
      "role" -> nonEmptyText(maxLength = 128),
      "realm_def" -> text,
      "url_def" -> nonEmptyText(maxLength = 128),
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_prospect" -> boolean,
      "dashboard_admin" -> boolean,
      "is_external" -> boolean,
      "end_customer" -> optional(text)) {
        (first_name, last_name, department, state, city, country, sso, wb_user_name, report_usage, email, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external,end_customer) =>
          UserWithPasswd(models.User(email, first_name, last_name, department, city, state, country, sso, wb_user_name, report_usage, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external, end_customer, true, true))
      } {
        up => Some(up.u.first_name, up.u.last_name, up.u.department, up.u.state, up.u.city, up.u.country, up.u.sso, up.u.wb_user_name, up.u.report_usage, up.u.email, up.u.phone, up.u.org, up.u.role, up.u.realm_def, up.u.url_def, up.u.mps_def, up.u.is_prospect, up.u.dashboard_admin,up.u.is_external,up.u.end_customer)
      })

  val addNewCustomerUserForm: Form[NewUserWithPasswd] = Form(
    mapping(
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> text(maxLength = 128),
      "department" -> text(maxLength = 128),
      "state" -> text,
      "city" -> text,
      "country" -> text,
      "sso" -> boolean,
      "wb_user_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "email" -> nonEmptyText,
      "phone" -> text,
      "org" -> nonEmptyText(maxLength = 64),
      "role" -> nonEmptyText(maxLength = 128),
      "realm_def" -> text,
      "url_def" -> nonEmptyText(maxLength = 128),
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_prospect" -> boolean,
      "dashboard_admin" -> boolean,
      "is_external" -> boolean,
      "end_customer" -> optional(text)) {
      (first_name, last_name, department, state, city, country, sso, wb_user_name, report_usage, email, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external,end_customer) =>
        NewUserWithPasswd(models.NewUser(email, first_name, last_name, department, city, state, country, sso, wb_user_name, report_usage, phone, org, role, realm_def, url_def, mps_def, is_prospect, dashboard_admin,is_external, end_customer, true, true))
    } {
      up => Some(up.u.first_name, up.u.last_name, up.u.department, up.u.state, up.u.city, up.u.country, up.u.sso, up.u.wb_user_name, up.u.report_usage, up.u.email, up.u.phone, up.u.org, up.u.role, up.u.realm_def, up.u.url_def, up.u.mps_def, up.u.is_prospect, up.u.dashboard_admin,up.u.is_external,up.u.end_customer)
    })
      
   val editCustomerUserForm: Form[UserEditCustomer] = Form(
    mapping(
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> nonEmptyText(maxLength = 128),
      "department" -> text(maxLength = 128),
      "city" -> text,
      "state" -> text,
      "country" -> text,
      "phone" -> text,
      "sso" -> boolean,
      "wb_user_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "org" -> nonEmptyText(maxLength = 64),
      "role" -> nonEmptyText(maxLength = 128),
      "realm_def" -> nonEmptyText(maxLength = 128),
      "url_def" -> nonEmptyText(maxLength = 128),
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_prospect" -> boolean,
      "dashboard_admin" -> boolean,
      "active" -> boolean,
      "show_info" -> boolean,
      "is_external" -> boolean,
      "end_customer" -> optional(text)
      )(UserEditCustomer.apply)(UserEditCustomer.unapply)
    )
    
    val modifyUserForm: Form[UserModify] = Form(
    mapping(
      "email" ->   nonEmptyText(maxLength = 128),
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "dashboard_admin" -> boolean,
      "department" -> text(maxLength = 128),
      "city" -> text,
      "state" -> text,
      "country" -> text,
      "phone" -> text,
	  "wb_user_name" -> text(maxLength = 128),      
      "role" -> nonEmptyText(maxLength = 128) ,
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_external" -> boolean,
      "end_customer" -> optional(text)
      )(UserModify.apply)(UserModify.unapply)
    )
    
    val editUserForm: Form[UserEdit] = Form(
    mapping(
      "first_name" -> nonEmptyText(maxLength = 128),
      "last_name" -> nonEmptyText(maxLength = 128),
      "sso" -> boolean,
      "wb_user_name" -> text(maxLength = 128),
      "report_usage" -> boolean,
      "org" -> nonEmptyText(maxLength = 64),
      "role" -> nonEmptyText(maxLength = 128),
      "realm_def" -> nonEmptyText(maxLength = 128),
      "url_def" -> nonEmptyText(maxLength = 128),
      "mps_def" -> nonEmptyText(maxLength = 128),
      "is_prospect" -> boolean,
      "dashboard_admin" -> boolean,
      "active" -> boolean,
      "show_info" -> boolean
      )(UserEdit.apply)(UserEdit.unapply)
    )
    
    
    
    val editMultiUserForm: Form[MultiUserEdit] = Form(
    mapping(
      "wb_user_name" -> text,
      "role" -> nonEmptyText,
      "realm_def" -> nonEmptyText,
      "url_def" -> text,
      "mps_def" -> text,
      "usrEmails" -> text
      )(MultiUserEdit.apply)(MultiUserEdit.unapply)
    )

    val bulkUpdateUserForm: Form[BulkUpdateUsers] = Form(
      mapping(
        "usrEmails" -> seq(email),
        "role" -> optional(text),
        "mps_def" -> optional(text),
        "user_state" -> optional(text),
        "password" -> optional(text),
        "cpassword" -> optional(text),
        "end_customer" -> optional(text)
      )(BulkUpdateUsers.apply)(BulkUpdateUsers.unapply)
    )

    val bulkDeleteUserForm: Form[BulkDeleteUsers] = Form(
      mapping(
        "usrEmails" -> seq(email)
      )(BulkDeleteUsers.apply)(BulkDeleteUsers.unapply)
    )
      
  
  /** Form for adding a prospect
   * 
   */
  
  val addPropectForm: Form[Prospect] = Form(
    mapping(
      "f_name" -> nonEmptyText,    
      "l_name" -> text,
      "email" -> email,
      "passwd" -> nonEmptyText(minLength=4, maxLength = FSPasswdMax),
      "product_id" -> text
    )(Prospect.apply)(Prospect.unapply)
  )
  
  /**
   * Form for updating user password
   */
  val updatePasswdForm: Form[UserUpdatePasswd] = Form(
    mapping(
      "email" -> nonEmptyText,        
      "token_id" -> text,
      "passwd" -> nonEmptyText(minLength=FSPasswdMin, maxLength = FSPasswdMax)
    )(UserUpdatePasswd.apply)(UserUpdatePasswd.unapply)
  )
  
  /**
   * Form for updating user defaults
   */
  val userDefaultForm: Form[UserDefaults] = Form (
    mapping(
     "realm_def" -> nonEmptyText,
     "url_def" -> nonEmptyText,
     "mps_def" -> nonEmptyText
    )(UserDefaults.apply)(UserDefaults.unapply)    
  )
  
  val resetPassword = Form(
    mapping(
      "email" -> nonEmptyText,
      "password" -> nonEmptyText
    )(UserResetPassword.apply)(UserResetPassword.unapply)
  )
  val decryptUserForm = Form(
    mapping(
      "username" -> text
    )(DecryptUserForm.apply)(DecryptUserForm.unapply))

  /** lists all users of the signed in glassbeam user
   *  
   */
  def list(version: String) = IsAuthorizedGBUser { userid => implicit request => 
    val orgOpt = userOrg(request)
    Ok(views.html.user.list(models.User.allManagedBy(userid, orgOpt.get), userName(request), orgOpt, userRole(request), version))
  }
  
  /** lists users of a specific mfr
   * 
   */
  def listByOrg(version: String, mfr: String) = IsAuthorizedGBUser { userid => implicit request => 
    val orgOpt = userOrg(request)
    val superMfr = if(mfr.equals("all")) GBName else mfr
    Ok(views.html.user.list(models.User.allManagedBy(userid, superMfr), userName(request), orgOpt, userRole(request), version))
  }
 
  def listByMfr(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version)  { userid => implicit request =>
    val orgOpt = userOrg(request)
    val superMfr = if(mfr.equals("all")) GBName else mfr
    version match {
      case constants.VERTICA_VERSION =>
        Ok(models.Utils.jsonResponse("Success", "list of all Users", Json.toJson(models.vUser.listByMfr(userid, superMfr))))
      case _ =>
        Ok(models.Utils.jsonResponse("Success", "list of all Users", Json.toJson(models.User.listByMfr(userid, superMfr))))
    }
  }

 
  /** presents a form for adding a new user
   *  
   */
  def addForm(version: String) = IsAuthorizedGBUser { userid => implicit request => {
    val orgOpt = userOrg(request)
    Ok(views.html.user.add(addUserForm, models.Org.mfrAndCustomers(orgOpt.get), models.Role.roles(), userName(request), orgOpt, userRole(request), version))
  }
  }

  /** saves new user information submitted via form 
   *  
   */
  def add(version: String) = IsAuthorizedGBUser { userid => implicit request =>
   
    addUserForm.bindFromRequest.fold(
      formWithErrors => {
        val orgOpt = userOrg(request)
        BadRequest(views.html.user.add(formWithErrors, models.Org.mfrAndCustomers(orgOpt.get), models.Role.roles(), userName(request), orgOpt, userRole(request), version))
      },
      u => models.User.create(u) map { errorMsg =>
         InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
      } getOrElse({
            Redirect(routes.AdminUser.list(version)).flashing(FKSuccess -> "User saved")}) 
    )                                                                                                                                        
  }

  /**
   * removes an user from data store
   *
   */
  def remove(version: String, uTBR: String, cname: String) = IsAuthorizedGBUser { userid =>  implicit request =>
      if (Auth.hasAuthorityOver(userid, cname)) {
        models.User.delete(uTBR) map { errorMsg =>
          InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
        } getOrElse (Redirect(routes.AdminUser.list(version)).flashing(FKSuccess -> "User removed"))
      } else {
        log.error(s"User with id $userid tried to illegally remove an user: $uTBR from org: $cname")
        Forbidden(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Forbidden, "You are not authorized to remove this user."))
      }
  }
  
  /**
   * edit an user 
   *
   */
  def editForm(version: String, usr: String, mfr: String) = IsAuthorizedGBUser { userid =>  implicit request =>
   val userDetails = models.User.byEmail(usr)
   userDetails match {
     case Some(u) => 
       val editForm = editUserForm.fill(new UserEdit(u.first_name, u.last_name, u.sso, u.wb_user_name, u.report_usage, u.org, u.role, u.realm_def, u.url_def, u.mps_def, u.is_prospect, u.dashboard_admin, u.active, u.show_info))
       Ok(views.html.user.edit(editForm, models.Org.all, models.Role.roles, userName(request), userOrg(request), userRole(request), usr, mfr, version))
     case None => Ok
   }
   
  }
  
 
  /** saves new user information submitted via form 
   *  
   */
  def edit(version: String, usr: String, mfr: String) = IsAuthorizedGBUser { userid => implicit request =>
   
    editUserForm.bindFromRequest.fold(
      formWithErrors => {
        val orgOpt = userOrg(request)
        BadRequest(views.html.user.edit(formWithErrors, models.Org.all, models.Role.roles, userName(request), userOrg(request), userRole(request), usr, mfr, version))
      },
      u => models.User.update(u, usr, mfr) map { errorMsg =>
         InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
      } getOrElse({
            Redirect(routes.AdminUser.list(version)).flashing(FKSuccess -> "User saved")}) 
    )                                                                                                                                        
  }
  
  def editMultiForm(version: String, mfr: String, emails: String) = IsAuthorizedGBUser { userid =>  implicit request =>
    Ok(views.html.user.editMulti(editMultiUserForm, models.Role.roles, userName(request), userOrg(request), userRole(request), emails, mfr, version))
  }
  
  def editMulti(version: String, mfr: String) = IsAuthorizedGBUser { userid => implicit request =>
    
    editMultiUserForm.bindFromRequest.fold(
      formWithErrors => {
        val orgOpt = userOrg(request)
        val allEmails = formWithErrors.data.get("usrEmails").get
        BadRequest(views.html.user.editMulti(formWithErrors, models.Role.roles, userName(request), userOrg(request), userRole(request), allEmails, mfr, version))
      },
      u => models.User.updateMulti(u) map { errorMsg =>
         InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
      } getOrElse({
            Redirect(routes.AdminUser.listByOrg(version, mfr)).flashing(FKSuccess -> "User saved")}) 
    )                                                                                                                                        
  }
  /**
   * Creates password for a user
   */
  def createPasswd(version: String) = Action { implicit request =>
    val passwdForm = updatePasswdForm.bindFromRequest.get
    val result = if(version == CASSANDRA_VERSION) models.User.createPasswd(passwdForm) else models.vUser.createPasswd(passwdForm)
    result match {
      case Success(r) => Ok(models.Utils.jsonResponse("Success", s"Password updated for user: ${passwdForm.email}", Json.toJson("")))
      case Failure(ex) => 
        val exMsg = ex.getMessage()
        exMsg match {
          case "Expired" => Forbidden(models.Utils.jsonResponse("Failure", "Password reset link is invalid or expired.", Json.toJson("")))
          case "InValidToken" => Forbidden(models.Utils.jsonResponse("Failure", "Password reset link is invalid or expired.", Json.toJson("")))
          case "NoUser" => Forbidden(models.Utils.jsonResponse("Failure", "User not Found", Json.toJson("")))
          case "PasswordAlreadySet" => Forbidden(models.Utils.jsonResponse("Failure", "Password reset link is invalid or expired.", Json.toJson("")))
          case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
    }
  }
  
  /**
   * Reset password for a users
   */
  def resetPasswd(version: String, mfr:String) = IsAuthorizedForOrg(mfr, version)  {userid =>  implicit request =>
    val passwdForm = resetPassword.bindFromRequest.get
    val email = passwdForm.email
    val result = if(version == CASSANDRA_VERSION) models.User.resetPasswd(passwdForm) else models.vUser.resetPasswd(passwdForm)
    result match {
      case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Password is reset successfully for the user $email", Json.toJson("")))
      case Failure(ex) => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
    }
  }
  
  /**
   * Sends password reset link to user who clicks on forgot passwd
   */
  
  def forgotPasswd(version: String, email: String) = Action { implicit request =>
    
    val user_status  = if(version == CASSANDRA_VERSION) models.User.notExists(email) else models.vUser.notExists(email)
    if(user_status){
      Forbidden(models.Utils.jsonResponse("Failure", "This user does not exist.", Json.toJson("")))
    } else {
      val result = if(version == CASSANDRA_VERSION) models.User.forgotPasswd(email) else models.vUser.forgotPasswd(email)
      //val result = models.User.forgotPasswd(email)

      result match {
        case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Reset Password link sent to the user: $email", Json.toJson("")))
        case Failure(exception) =>
          val ex = exception.getMessage()
          ex match {
            case "UserInactive" => log.error(s"User is not active : ${email}")
              InternalServerError(models.Utils.jsonResponse("Failure", "You are not an active user. Hence you cannot reset password. Contact your administrator for further assistance.", Json.toJson("")))
            case _ =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
          }
      }
    }
  }
  
  /**
   * Change password for a user
   */
  def changePasswd(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version)  {userid =>  implicit request =>
    val passwdForm = updatePasswdForm.bindFromRequest.get
    val result = if(version == CASSANDRA_VERSION) models.User.changePasswd(passwdForm) else models.vUser.changePasswd(passwdForm)
    result match {
      case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Password changed successfully for the user: $email", Json.toJson("")))
      case Failure(ex) => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
    }
  }
  
  /** updated defaults for a user
   *  
   */
  def updateDefaults(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version)  {userid => implicit request =>
    val userDefaults = userDefaultForm.bindFromRequest.get
    val result = if(version == CASSANDRA_VERSION) models.User.updateDefaults(userDefaults, userid) else models.vUser.updateDefaults(userDefaults, userid)
    result match {
      case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Defaults updated for user: $userid", Json.toJson("")))
      case Failure(ex) => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
    }
  }
  
  def byEmail(version: String, mfr: String, email: String) = IsAuthorizedForOrg(mfr, version)  {userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION =>
        val result = models.vUser.byEmail(email)
        result map { u =>
          Ok(models.Utils.jsonResponse("Success", s"User details for email: $email", Json.toJson(u)))
        } getOrElse {Ok(models.Utils.jsonResponse("Failure", s"No user with this email: $email", Json.toJson("")))}
      case _ =>
        val result = models.User.byEmail(email)
        result map { u =>
          Ok(models.Utils.jsonResponse("Success", s"User details for email: $email", Json.toJson(u)))
        } getOrElse {Ok(models.Utils.jsonResponse("Failure", s"No user with this email: $email", Json.toJson("")))}
    }
  }
  
  def disableInfo(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version) {userid => implicit request =>
    val result = if(version ==  CASSANDRA_VERSION) models.User.disableInfo(userid) else models.vUser.disableInfo(userid)
    result match {
      case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Disabled info for user: $userid", Json.toJson("")))
      case Failure(ex) => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
    }
  }

  def exportLimit(version: String, limit:Int , mfr: String) = IsAuthorizedForOrg(mfr, version) {userid => implicit request =>
    val result = if(version ==  CASSANDRA_VERSION) models.User.exportLimit(userid,limit) else models.vUser.exportLimit(userid,limit)
    result match {
      case Success(s) => Ok(models.Utils.jsonResponse("Success", s"Export limit for user: $userid-$limit", Json.toJson("")))
      case Failure(ex) => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
    }
  }


  def tsUserTracking(version: String, mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String], filter: Option[String],
    aggr: Option[String], groupby: Option[String], orderby: Option[String], limit: Option[Integer]) = IsUserAuthorized(mfr, prod, sch, version) {
    userid =>
      implicit Action =>

        def getFinal(li: List[Map[String, List[(Any, Any)]]]) = {

          var mapResult = Map[Any, List[Map[String, Any]]]()
          for {
            outerIdx <- 0 to li.size - 1
            eachList = li(outerIdx)
            k = eachList.keys.head
            v = eachList.values.head
            eachIdx <- 0 to v.size - 1
          } {
            val mapKey = v(eachIdx)._1
            val ret = mapResult.get(mapKey) match {
              case Some(a) =>
                mapResult += mapKey -> (a ++ List(Map(k -> v(eachIdx)._2)))
              case None =>
                mapResult += mapKey -> List(Map(k -> v(eachIdx)._2))
            }
          }
          mapResult
        }
        if (cols.isEmpty) {
          log.info(s"API called without cols parameterer. mfr: $mfr, prod: $prod, sch: $sch, ec: $ec")
          BadRequest(models.Utils.jsonResponse("Failure", "Column names missing", Json.toJson("")))
        } else {
          try {
            val sortList = List(orderby)
            val filterList = List(filter)
            val limitList = List(limit)
            val filteredData = models.User.filterResult(mfr, prod, sch, ec, st, et, cols, filter)
            val sortedData = models.User.sortResult(mfr, prod, sch, ec, st, et, cols, orderby, filteredData)
            val limitedData = models.User.limitResult(limit, sortedData)
            aggr match {
              case Some(a) =>
                val aggrList = a.trim.split(" AND ").toList map { x => x.trim() }
                val aggrnew = aggrList map { x => AggrParsers(x.toString) }
                val aggCols = aggrnew map { a => a._2 }
                val status = aggCols map { x => if (cols.contains(x)) true else false }
                if (status.contains(false)) {
                  val msg = s"Bad aggr columns: Aggregate columns must be selected first"
                  BadRequest(models.Utils.jsonResponse("Failure", msg, Json.toJson("")))
                } else {
                  groupby map { gCol =>
                    if (cols.contains(gCol)) {
                      val aggrVal = Controller.parallelAggr(mfr, prod, sch, ec, st, et, cols, aggrnew, gCol, sortedData, orderby)
                      log.info(s"Going to format the result..")
                      val formattedResult = getFinal(aggrVal)
                      log.info(s"Format result complete..")
                      val jsData = models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new GroupMultipleAggrByResultWithHeader((gCol, aggrList), formattedResult)))
                      Ok(jsData)
                    } else {
                      val msg = s"Bad group by column: $gCol"
                      BadRequest(models.Utils.jsonResponse("Failure", msg, Json.toJson("")))
                    }
                  } getOrElse {
                    val aggrVal = aggrnew map { a =>
                      a._1 match {
                        case "sum" => Json.toJson(UserTrackingTable.sum(cols, a._2, sortedData))
                        case "avg" => Json.toJson(UserTrackingTable.avg(cols, a._2, sortedData))
                        case "min" => Json.toJson(UserTrackingTable.min(cols, a._2, sortedData))
                        case "max" => Json.toJson(UserTrackingTable.max(cols, a._2, sortedData))
                        case "count" => Json.toJson(UserTrackingTable.count(cols, a._2, sortedData))
                      }
                    }
                    val jsData = models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new MultipleAggrWithHeader(aggrList, aggrVal)))
                    Ok(jsData)
                  }
                }
              case None =>
                val jsData = if (limitList.flatten.size > 0) {
                  models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new ResultWithHeader(cols, limitedData)))
                } else if (sortList.flatten.size > 0) {
                  models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new ResultWithHeader(cols, sortedData)))
                } else if (filterList.flatten.size > 0) {
                  models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new ResultWithHeader(cols, filteredData)))
                } else {
                  models.Utils.jsonResponse("Success", "Values for requested column", Json.toJson(new ResultWithHeader(cols, models.UserTrackingTable.getRawData(mfr, prod, sch, ec, st, et, cols))))
                }
                Ok(jsData)
            }
          } catch {
            case ex: Exception =>
              log.error(s"[$mfr/$prod/$sch] - Exception thrown on named columns lookup from user_tracking for mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, st: $st, et: $et, filter: $filter, orderBy: $orderby, aggr: $aggr, ex: $ex ")
              BadRequest(models.Utils.jsonResponse("Failure", "Bad request", Json.toJson("")))
          }
        }
  }

  def addCustomerUser(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val custFormData = addCustomerUserForm.bindFromRequest.get
      val userDetails = custFormData.u
      val fname = userDetails.first_name
      val lname = userDetails.last_name
      val email = userDetails.email
      val org = userDetails.org
      val role = userDetails.role
      val realm_def = userDetails.realm_def
      val url_def = userDetails.url_def
      val mps_def = userDetails.mps_def
      if (fname.equals("") || email.equals("") || org.equals("") || role.equals("") || realm_def.equals("") || mps_def.equals("") || url_def.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of first_name, last_name, org, role, realm_def, url_def, mps_def is missing..", Json.toJson("")))
      } else if (!models.User.notExists(email.toLowerCase)) {
        BadRequest(models.Utils.jsonResponse("Failure", "This email address belongs to another user", Json.toJson("")))
      } else {
        models.User.create(custFormData) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"User $email added successfully", Json.toJson("")))
        }
      }

  }
  
  def modifyCustomerUser(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val reqSession = request.cookies.get("PLAY_SESSION")
      val custFormData = modifyUserForm.bindFromRequest.get
      val email = custFormData.email
      val fname = custFormData.f_name
      val lname = custFormData.l_name
      val report_usage = custFormData.report_usage
      val dashboard_admin = custFormData.dashboard_admin
      val role = custFormData.role
      val department = custFormData.department
      val city = custFormData.city
      val state = custFormData.state
      val country = custFormData.country
      val wb_user_name = custFormData.wb_user_name
	  
      if (fname.equals("") || email.equals("") ) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of first_name, email is missing..", Json.toJson("")))
      } else {
        val result = if(version==CASSANDRA_VERSION) models.User.modify(custFormData) else models.vUser.modify(custFormData, reqSession)
        result map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"User $email updated successfully", Json.toJson("")))
        }
      }

  }

  def bulkUpdateCustomerUser(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val reqSession = request.cookies.get("PLAY_SESSION")
      val custFormData = bulkUpdateUserForm.bindFromRequest.get
      val userEmails = custFormData.usrEmails
      val active = custFormData.user_state
      val mps_def = custFormData.mps_def
      val role = custFormData.role
      val password = custFormData.password
      val end_customer = custFormData.end_customer
      if (userEmails.equals("") && active.equals("") && role.equals("") && mps_def.equals("") && password.equals("") && end_customer.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "At least one of the fields must be set..", Json.toJson("")))
      } else {
        val result = if(version==CASSANDRA_VERSION) models.User.bulkUpdateCustomerUser(custFormData) else models.vUser.bulkUpdateCustomerUser(custFormData, reqSession)
        result map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Selected User(s) updated successfully", Json.toJson("")))
        }
      }
  }

  def bulkDeleteCustomerUser(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val reqSession = request.cookies.get("PLAY_SESSION")
      val custFormData = bulkDeleteUserForm.bindFromRequest.get
      val userEmails = custFormData.usrEmails
      if (userEmails eq "") {
        BadRequest(models.Utils.jsonResponse("Failure", "Required EmailIds missing..", Json.toJson("")))
      } else {
        val result = if(version==CASSANDRA_VERSION) models.User.bulkDeleteCustomerUser(custFormData) else models.vUser.bulkDeleteCustomerUser(mfr, custFormData, reqSession)
        result map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Selected User(s) deleted successfully", Json.toJson("")))
        }
      }

  }
  
  def addCustomerUserAdmin(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      version match {
        case constants.VERTICA_VERSION =>
          val custFormData = addNewCustomerUserForm.bindFromRequest.get
          val userDetails = custFormData.u
          val fname = userDetails.first_name
          val lname = userDetails.last_name
          val email = userDetails.email
          val org = userDetails.org
          val role = userDetails.role
          val realm_def = userDetails.realm_def
          val url_def = userDetails.url_def
          val mps_def = userDetails.mps_def

          if(!models.vUser.notExists(email.toLowerCase)){
            BadRequest(models.Utils.jsonResponse("Failure", s"User with email $email already exists!!", Json.toJson("")))
          } else if (fname.equals("") || email.equals("") || org.equals("") || role.equals("") || mps_def.equals("") || url_def.equals("")) {
            BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of first_name, email, org, role, url_def, mps_def is missing..", Json.toJson("")))
          } else {
            val result = models.vUser.createUser(custFormData)
            result map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse {
              Ok(models.Utils.jsonResponse("Success", s"User $email added successfully", Json.toJson("")))
            }
          }
        case _ =>
          val custFormData = addCustomerUserForm.bindFromRequest.get
          val userDetails = custFormData.u
          val fname = userDetails.first_name
          val lname = userDetails.last_name
          val email = userDetails.email
          val org = userDetails.org
          val role = userDetails.role
          val realm_def = userDetails.realm_def
          val url_def = userDetails.url_def
          val mps_def = userDetails.mps_def

          if(!models.User.notExists(email.toLowerCase)){
            BadRequest(models.Utils.jsonResponse("Failure", s"User with email $email already exists!!", Json.toJson("")))
          } else if (fname.equals("") || email.equals("") || org.equals("") || role.equals("") || mps_def.equals("") || url_def.equals("")) {
            BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of first_name, email, org, role, url_def, mps_def is missing..", Json.toJson("")))
          } else {
            val result = models.User.createUser(custFormData,version)
            result map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse {
              Ok(models.Utils.jsonResponse("Success", s"User $email added successfully", Json.toJson("")))
            }
          }
      }
  }
  
  def editCustomerUserAdmin(version: String, usr: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val userDetails = editCustomerUserForm.bindFromRequest.get
      val fname = userDetails.f_name
      val lname = userDetails.l_name
      val org = userDetails.org
      val role = userDetails.role
      val realm_def = userDetails.realm_def
      val url_def = userDetails.url_def
      val mps_def = userDetails.mps_def
      if (fname.equals("") || lname.equals("") || org.equals("") || role.equals("") || realm_def.equals("") || mps_def.equals("") || url_def.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of first_name, last_name, org, role, realm_def, url_def, mps_def is missing..", Json.toJson("")))
      } else {
        models.User.updateUser(userDetails,usr,mfr) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"User $email updated successfully", Json.toJson("")))
        }
      }

  }

  def listCustomerUsers(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version)  { userid =>
    implicit request =>
      val orgOpt = userOrg(request)
      implicit val userWrites = Json.writes[Users]
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.vUser.activeUsersForOrg(userid, mfr))))
      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }

  }
  def listCustomerUsersNonSso(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val orgOpt = userOrg(request)
      val sso = false
      implicit val userListDetailsWrites = Json.writes[UserListDetails]
      implicit val userListDataWrites = Json.writes[UserListData]
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        if(version ==CASSANDRA_VERSION)
          Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.User.usersForOrg(userid, orgOpt.get,mfr,sso))))
        else
          Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.vUser.usersForOrg(userid, orgOpt.get,mfr,sso))))

      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }

  }
 
  def listCustomerUsersSso(version: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val orgOpt = userOrg(request)
      val sso = true
      implicit val userListDetailsWrites = Json.writes[UserListDetails]
      implicit val userListDataWrites = Json.writes[UserListData]
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        if(version ==CASSANDRA_VERSION)
        Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.User.usersForOrg(userid, orgOpt.get,mfr,sso))))
        else
          Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.vUser.usersForOrg(userid, orgOpt.get,mfr,sso))))
      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }

  }
  def listCustomerUsersRuleCreator(version: String, mfr: String,prod: String,sch: String) = IsAuthorizedForOrg(mfr, version)  { userid =>
    implicit request =>
      val orgOpt = userOrg(request)
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        if(version ==CASSANDRA_VERSION)
          Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.User.ruleCreatorUsersForOrg(mfr,prod,sch))))
        else
          Ok(models.Utils.jsonResponse("Success", "List of users", Json.toJson(models.vUser.ruleCreatorUsersForOrg(mfr,prod,sch))))
      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }

  }

  def removeCustomerUsers(version: String, user: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      models.User.delete(user) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", s"Internal Server Error while removing the user $user. Please contact Glassbeam Support", Json.toJson("")))
      } getOrElse (Ok(models.Utils.jsonResponse("Success", s"User $user removed successfully", Json.toJson(""))))
  }

  /**
   * Regenerate verficiation email and send it to the user
   */
  def regenerateVerificationEmail(version: String, email: String) = Action { implicit request =>
    val result = models.User.regenerateVerificationEmail(email)
    result.map { err =>
      err match {
        case "NoUserAsSuch" => Ok(models.Utils.jsonResponse("Failure", s"$err", Json.toJson("")))
        case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error. Please contact Glassbeam Support!!", Json.toJson("")))
      }
    } getOrElse {
      Ok(models.Utils.jsonResponse("Success", s"RegeneratedEmail", Json.toJson("")))
    }
  }

  def disableCustomerUsers(version: String, user: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val reqSession = request.cookies.get("PLAY_SESSION")
     val res = if(version==CASSANDRA_VERSION) models.User.disable(user) else models.vUser.disable(user, reqSession)
      res map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", s"Internal Server Error while disabling the user $user. Please contact Glassbeam Support", Json.toJson("")))
      } getOrElse (Ok(models.Utils.jsonResponse("Success", s"$user inactivated successfully.", Json.toJson(""))))
  }
  def enableCustomerUsers(version: String, user: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request =>
      val reqSession = request.cookies.get("PLAY_SESSION")
      val res = if(version==CASSANDRA_VERSION) models.User.enable(user) else models.vUser.enable(user, reqSession)
      res map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", s"Internal Server Error while enabling the user $user. Please contact Glassbeam Support", Json.toJson("")))
      } getOrElse (Ok(models.Utils.jsonResponse("Success", s"$user activated successfully.", Json.toJson(""))))
  }
  
  def isDashboardAdmin(version: String, mfr: String, prod: String, sch: String, email: String) = IsAuthorizedForOrg(mfr, version)  {userid => implicit request =>
    version match {
      case constants.VERTICA_VERSION =>
        val result = models.vUser.isDashboardAdmin(email, mfr, prod, sch)
        Ok(models.Utils.jsonResponse("Success", s"Dashboard admin status for $email", Json.toJson(result)))
      case _ =>
        val result = models.User.isDashboardAdmin(email, mfr, prod, sch)
        Ok(models.Utils.jsonResponse("Success", s"Dashboard admin status for $email", Json.toJson(result)))
    }
  }

   def getDashboardAdminUsers(version: String, mfr: String, prod: String, sch: String) = IsAuthorizedForOrg(mfr, version)  {userid => implicit request =>
     version match {
       case constants.VERTICA_VERSION =>
         val result = models.vUser.getDashboardAdminUsers(mfr,prod,sch)
         Ok(models.Utils.jsonResponse("Success", s"Dashboard admin users for $mfr:$prod:$sch", Json.toJson(result)))
       case _ =>
         val result = models.User.getDashboardAdminUsers(mfr,prod,sch)
         Ok(models.Utils.jsonResponse("Success", s"Dashboard admin users for $mfr:$prod:$sch", Json.toJson(result)))
     }
  }

  def getTableauAdminUsers(version: String, mfr: String, prod: String, sch: String) = IsAuthorizedForOrg(mfr, version)  {userid => implicit request =>
    version match {
      case constants.VERTICA_VERSION =>
        val result = models.vUser.getTableauAdminUsers(mfr,prod,sch)
        Ok(models.Utils.jsonResponse("Success", s"Tableau admin users for $mfr:$prod:$sch", Json.toJson(result)))
      case _ =>
        val result = models.User.getTableauAdminUsers(mfr,prod,sch)
        Ok(models.Utils.jsonResponse("Success", s"Tableau admin users for $mfr:$prod:$sch", Json.toJson(result)))
    }
  }  

  def decryptUser(version: String) = IsAuthorizedGBUser { userid =>
    implicit request =>
    val c = decryptUserForm.bindFromRequest.get
    val emailOpt = models.Utils.decryptString(c.username)
    val email = emailOpt match {
      case Some(s) => s
      case None => ""
    }
    val isAvailable = version match {
      case constants.VERTICA_VERSION => models.vUser.isUserAvailable(email)
      case _ => models.User.isUserAvailable(email)
    }
    val result = UserEncrptDcrpt(email, isAvailable)
    emailOpt match {
      case Some(email) =>
        Ok(models.Utils.jsonResponse("Success", "User information", Json.toJson(result)))
      case None =>
        log.error(s"Exception thrown while decrypting username : ${c.username}")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  def getTableauUsername(version: String, mfr: String, prod: String, sch: String, email: String) = IsAuthorizedGBUser { userid =>
    implicit request =>
      val startTime = DateTime.now
      val result = models.vUser.getTableauUsername(version, mfr, prod, sch, email)
      val endTime = DateTime.now
      log.info(s"[$email] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      result match {
        case Success(username) =>
          Ok(models.Utils.jsonResponse("Success", "Tableau Username", Json.toJson(username)))
        case Failure(ex) =>
          val exMsg = ex.getMessage()
          exMsg match {
            case "UNAVAILABLE" => Forbidden(models.Utils.jsonResponse("Failure", "User is not present in the database.", Json.toJson("")))
            case _ => InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
          }
      }
  }
}
