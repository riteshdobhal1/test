package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.libs.json._
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.i18n.Messages.Implicits._
import models._
import views._
import constants._
import models.Auth

object AdminMfr extends Controller with Secured {
  val log = Logger("Controller_AdminMfr")
  val module = ModAdmin
  implicit val defaultFeatureListWrites = Json.writes[MfrDefaultFeature]
  implicit val UiConfigListWrites = Json.writes[UIConf]
  implicit val RealmListWrites = Json.writes[MfrRealm]
  implicit val MfrListWrites = Json.writes[Org]
  /** form for adding a new manufacturer
   * 
   */
  val addMfrForm: Form[Org] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),        
      "name" -> nonEmptyText(maxLength = 128),
      "max_licensed_users" -> number,
      "max_users" -> number,
      "type" -> ignored(OrgTypeMfr),
      "email_template_header" -> text(maxLength = 512),
      "email_template_body" -> text(maxLength = 512),
      "email_template_footer" -> text(maxLength = 512),
      "email_template_subject" -> text(maxLength = 512),
      "email_template_link" -> text(maxLength = 512),
      "email_template_link_expiry" -> text(maxLength = 512), 
      "end_customer_domain" -> text(maxLength = 512)	
      
    )(Org.apply)(Org.unapply)
  )

  val addNewMfrForm: Form[NewOrg] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),
      "name" -> nonEmptyText(maxLength = 128),
      "max_licensed_users" -> number,
      "max_users" -> number,
      "type" -> ignored(OrgTypeMfr),
      "email_template_header" -> text(maxLength = 512),
      "email_template_body" -> text(maxLength = 512),
      "email_template_footer" -> text(maxLength = 512),
      "email_template_subject" -> text(maxLength = 512),
      "email_template_link" -> text(maxLength = 512),
      "email_template_link_expiry" -> text(maxLength = 512)
    )(NewOrg.apply)(NewOrg.unapply)
  )
  
  val addRealmForm: Form[MfrRealm] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),  
      "prod" -> nonEmptyText(maxLength = 512),
      "sch" -> nonEmptyText(maxLength = 512),
      "ec" -> nonEmptyText(maxLength = 512),
      "realm" -> nonEmptyText(maxLength = 512),
      "sso_login_url" -> text(maxLength = 512),
      "sso_logout_url" -> text(maxLength = 512),
      "sso_roles" -> text(maxLength = 512),
      "sso_idp_id" -> text(maxLength = 512)
    )(MfrRealm.apply)(MfrRealm.unapply))
    
  val defaultFeatureForm: Form[MfrDefaultFeature] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),  
      "prod" -> nonEmptyText(maxLength = 512),
      "sch" -> nonEmptyText(maxLength = 512),
      "ec" -> nonEmptyText(maxLength = 512),
      "active" -> boolean,
      "default_feature_internal" -> nonEmptyText(maxLength = 512),
      "default_feature_external" -> nonEmptyText(maxLength = 512),
      "nsr_enabled" -> boolean,
      "logo" -> text(maxLength = 512),
      "logo_url" -> text(maxLength = 512)  
      
    )(MfrDefaultFeature.apply)(MfrDefaultFeature.unapply)
    )
    
    val addUIConfigForm: Form[UIConf] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),
      "prod" -> nonEmptyText(maxLength = 128),
      "sch" -> nonEmptyText(maxLength = 128),
      "allowed_extension" -> text,
      "compound_rows" -> number,
      "core_delimiter" -> text,
      "default_days" -> number,
      "default_exp_view" -> text,
      "exp_display_fields" -> text,
      "iv_display_fields" -> text,
      "facet_limit" -> number,
      "is_stage_domain" -> text,
      "is_stage_keyspace" -> text,
      "json_form" -> text,
      "max_day_range" -> number,
      "max_upload_size" -> number,
      "lv_to_exp" -> boolean)
      (UIConf.apply)(UIConf.unapply)) 

  /**
   * lists all current manufacturers
   */
  def list(version: String, is_request: Option[Boolean]) = IsAuthorizedGBUser { userid =>
    implicit request => {
      val isReq = is_request.getOrElse(false)
      is_request match {
        case Some(q) =>
          if (q) {
            val mfrList = version match{
              case constants.VERTICA_VERSION => models.vOrg.mfrs
              case _ => models.Org.mfrs
            }
            Ok(models.Utils.jsonResponse("Success", "List of customers", Json.toJson(mfrList)))
          } else{
            version match{
              case constants.VERTICA_VERSION => Ok(views.html.mfr.list(models.vOrg.mfrs, userName(request), userOrg(request), userRole(request), version))
              case _ => Ok(views.html.mfr.list(models.Org.mfrs, userName(request), userOrg(request), userRole(request), version))
            }
          }
        case None =>
          version match{
            case constants.VERTICA_VERSION => Ok(views.html.mfr.list(models.vOrg.mfrs, userName(request), userOrg(request), userRole(request), version))
            case _ => Ok(views.html.mfr.list(models.Org.mfrs, userName(request), userOrg(request), userRole(request), version))
          }
      }
    }
  }
  
  def listall(version: String) = IsSuperAdmin() { userid => implicit request =>
    val mfrList = version match{
      case constants.VERTICA_VERSION => models.vOrg.mfrs
      case _ => models.Org.mfrs
    }
    Ok(models.Utils.jsonResponse("Success", "List of manufacturers", Json.toJson(mfrList)))
  }

  /**
   * presents a form for adding a new manufacturer
   */
  def addForm(version: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      Ok(views.html.mfr.add(addMfrForm, userName(request), userOrg(request), userRole(request), version))
    }
  }

  def add(version: String) = IsAuthorizedGBUser { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => addNewMfrForm.bindFromRequest.fold(
        formWithErrors => BadRequest(views.html.mfr.addNew(formWithErrors, userName(request), userOrg(request), userRole(request), version)),
        mfr => models.vOrg.createMfr(mfr) map { errorMsg =>
          InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
        } getOrElse(Redirect(routes.AdminMfr.list(version, None)).flashing(FKSuccess -> "Manufacturer saved"))
      )
      case _ => addMfrForm.bindFromRequest.fold(
        formWithErrors => BadRequest(views.html.mfr.add(formWithErrors, userName(request), userOrg(request), userRole(request), version)),
        mfr => models.Org.createMfr(mfr) map { errorMsg =>
          InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
        } getOrElse(Redirect(routes.AdminMfr.list(version, None)).flashing(FKSuccess -> "Manufacturer saved"))
      )
    }
  }
  
  /** saves new manufacturer 
   *  
   */
 def addmfr(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
   version match{
     case constants.VERTICA_VERSION => addNewMfrForm.bindFromRequest.fold(
       formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, mfr, max licenced users, max users is missing..", Json.toJson(""))),
       mfr => models.vOrg.createMfr(mfr) map { errorMsg =>
         InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
       } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Manufacturer added successfully", Json.toJson(""))))
     )
     case _ => addMfrForm.bindFromRequest.fold(
       formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, mfr, max licenced users, max users is missing..", Json.toJson(""))),
       mfr => models.Org.createMfr(mfr) map { errorMsg =>
         InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
       } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Manufacturer added successfully", Json.toJson(""))))
     )
   }
 }
  
  /** saves new manufacturer 
   *  
   */
  def manageRealm(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    addRealmForm.bindFromRequest.fold(
    formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of mfr, product, schema, realm and ec is missing..", Json.toJson(""))),
    mfr => version match{
      case constants.VERTICA_VERSION => models.vOrg.manageRealm(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm added successfully to manufacturer", Json.toJson(""))))
      case _ => models.Org.manageRealm(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm added successfully to manufacturer", Json.toJson(""))))
    })
  }
  
  def listRealm(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    val realmList = version match{
      case constants.VERTICA_VERSION => models.vOrg.listRealm(mfr)
      case _ => models.Org.listRealm(mfr)
    }
    Ok(models.Utils.jsonResponse("Success", "List of manufacturer realms", Json.toJson(realmList)))
  }
  
  def manageDefaultFeature(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    defaultFeatureForm.bindFromRequest.fold(
    formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of mfr, product, schema, default feature internal and ec is missing..", Json.toJson(""))),
    mfr => version match{
      case constants.VERTICA_VERSION => models.vOrg.manageDefaultFeature(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Default feature added/modified successfully to manufacturer", Json.toJson(""))))
      case _ => models.Org.manageDefaultFeature(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Default feature added/modified successfully to manufacturer", Json.toJson(""))))
    })
  }
  
  def listDefaultFeature(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    val defaultFeature = version match{
      case constants.VERTICA_VERSION => models.vOrg.listDefaultFeature(mfr)
      case _ => models.Org.listDefaultFeature(mfr)
    }
    Ok(models.Utils.jsonResponse("Success", "List of default features for mps's", Json.toJson(defaultFeature)))
  }
  
  def manageUiConfig(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    addUIConfigForm.bindFromRequest.fold(
    formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
    mfr => version match{
      case constants.VERTICA_VERSION => models.vOrg.manageUiConfig(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"UI Configuration added successfully", Json.toJson(""))))
      case _ => models.Org.manageUiConfig(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"UI Configuration added successfully", Json.toJson(""))))
    })
  }
  
  def listUiConfig(version: String,mfr: String) = IsSuperAdmin() { userid => implicit request =>
    val uiConfig = version match{
      case constants.VERTICA_VERSION => models.vOrg.listUiConfig(mfr)
      case _ => models.Org.listUiConfig(mfr)
    }
    Ok(models.Utils.jsonResponse("Success", "List of manufacturer UI Config", Json.toJson(uiConfig)))
  }
  
  /** remove a manufacturer from data store
   *  
   */
  def delete(version: String, mfr: String) = IsSuperAdmin() { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => models.vOrg.deleteMfr(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Manufacturer deleted successfully", Json.toJson(""))))
      case _ => models.Org.deleteMfr(mfr) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Manufacturer deleted successfully", Json.toJson(""))))
    }
  }

}
