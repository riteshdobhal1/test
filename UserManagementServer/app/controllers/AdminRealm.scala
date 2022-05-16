package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.libs.json._
import play.api.Play.current
import play.api.i18n.{MessagesApi, I18nSupport}
import play.api.i18n.Messages.Implicits._
import models._
import views._
import constants._
import models.Auth


object AdminRealm extends Controller with Secured {
  val log = Logger("Controller_AdminRealm")
  val module = ModAdmin
  
  implicit val realmListWrites = Json.writes[Realm]
  implicit val realmListDetailWrites = Json.writes[RealmDetail]
  implicit val newRealmListWrites = Json.writes[NewRealm]
  
  /** form for adding a new realm
   * 
   */
  val addRealmForm: Form[Realm] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),        
      "apps_version" -> nonEmptyText(maxLength = 128),
      "is_url" -> nonEmptyText(maxLength = 512),
      "ui_url" -> nonEmptyText(maxLength = 128)
            
    )(Realm.apply)(Realm.unapply)
  )

  val addNewRealmForm: Form[NewRealm] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),
      "apps_version" -> nonEmptyText(maxLength = 128),
      "is_url" -> nonEmptyText(maxLength = 512),
      "ui_url" -> nonEmptyText(maxLength = 128)

    )(NewRealm.apply)(NewRealm.unapply)
  )

  def list(version: String) = IsSuperAdmin() { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => Ok(models.Utils.jsonResponse("Success", "List of realms", Json.toJson(models.Realm.listall())))
      case _ => Ok(models.Utils.jsonResponse("Success", "List of realms", Json.toJson(models.vRealm.listall())))
    }
  } 
  
  def realmInfo(version: String, mfr:String, prod:String, sch:String) = IsAuthorizedForOrg(mfr, version) { userid =>implicit request =>
    version match{
      case constants.VERTICA_VERSION => Ok(models.Utils.jsonResponse("Success", "List of realms", Json.toJson(models.vRealm.listallDetail(mfr,prod,sch))))
      case _ => Ok(models.Utils.jsonResponse("Success", "List of realms", Json.toJson(models.Realm.listallDetail(mfr,prod,sch))))
    }
  }

  def add(version: String) = IsSuperAdmin() { userid => implicit request =>    
    version match{
      case constants.VERTICA_VERSION => addNewRealmForm.bindFromRequest.fold(
        formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, apps_version, is_url, ui_url is missing..", Json.toJson(""))),
        rp => models.vRealm.managerealm(rp) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm added successfully", Json.toJson(""))))
      )
      case _ => addRealmForm.bindFromRequest.fold(
        formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, apps_version, is_url, ui_url is missing..", Json.toJson(""))),
        rp => models.Realm.managerealm(rp) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm added successfully", Json.toJson(""))))
      )
    }
  } 
  def edit(version: String) = IsSuperAdmin() { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => addNewRealmForm.bindFromRequest.fold(
        formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, apps_version, is_url, ui_url is missing..", Json.toJson(""))),
        rp => models.vRealm.managerealm(rp) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm updated successfully", Json.toJson(""))))
      )
      case _ => addRealmForm.bindFromRequest.fold(
        formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, apps_version, is_url, ui_url is missing..", Json.toJson(""))),
        rp => models.Realm.managerealm(rp) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm updated successfully", Json.toJson(""))))
      )
    }
  } 
  def delete(version: String, realmName: String) = IsSuperAdmin() { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => models.vRealm.delete(realmName) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm deleted successfully", Json.toJson(""))))
      case _ => models.Realm.delete(realmName) map { errorMsg =>
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
      } getOrElse(Ok(models.Utils.jsonResponse("Success", s"Realm deleted successfully", Json.toJson(""))))
    }
  }
  
}
