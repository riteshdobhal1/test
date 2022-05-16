package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.i18n.Messages.Implicits._
import models._
import views._
import constants._
import dao.vertica
import models.Auth
import org.joda.time.DateTime
import play.api.libs.json._
import play.api.libs.functional.syntax._

import scala.util.{Failure, Success, Try}

object AdminRole extends Controller with Secured {
  val log = Logger("Controller_AdminRole")
  val module = ModAdmin
  
  implicit val roleNewWrites = Json.writes[Role]
  implicit val roleNewRoleWrites = Json.writes[NewRole]
  implicit val domainWrites = Json.writes[Domain] 
  implicit val UserWrites = Json.writes[UserDetails]
  implicit val roleDetailWrites = Json.writes[RoleDetails]
  implicit val allWrites = Json.writes[AllUserDetail]
 
 /** form for adding a new role
  * 
  */

   val addRoleForm: Form[Role] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),
      "is_super" -> boolean,
      "domain" -> nonEmptyText(maxLength = 128),
      "mfr" -> nonEmptyText(maxLength = 128),
      "prod" -> nonEmptyText(maxLength = 128),
      "sch" -> nonEmptyText(maxLength = 128),
      "realm" -> seq(text),
      "features" -> seq(text).verifying("Select at least one features", features => (!(features.isEmpty)))
    )
    {
      (name, is_super, domain, mfr, prod, sch,realm, features) => Role(name, is_super, domain, mfr, prod, sch,realm.toList,features.toSet)
    }
    {
      rp => Some(rp.name, rp.is_super, rp.domain, rp.mfr, rp.prod, rp.sch, rp.realm.toList, rp.features.toSeq)
    } 
   )

  val addNewRoleForm: Form[NewRole] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),
      "is_super" -> boolean,
      "domain" -> nonEmptyText(maxLength = 128),
      "mfr" -> nonEmptyText(maxLength = 128),
      "prod" -> nonEmptyText(maxLength = 128),
      "sch" -> nonEmptyText(maxLength = 128),
      "realm" -> seq(text),
      "features" -> seq(text).verifying("Select at least one features", features => (!(features.isEmpty)))
    )
    {
      (name, is_super, domain, mfr, prod, sch,realm, features) => NewRole(name, is_super, domain, mfr, prod, sch,realm.toList,features.toSet)
    }
    {
      rp => Some(rp.name, rp.is_super, rp.domain, rp.mfr, rp.prod, rp.sch, rp.realm.toList, rp.features.toSeq)
    }
  )
   
   val adminAddRoleForm: Form[Role] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),
      "is_super" -> boolean,
      "domain" -> nonEmptyText(maxLength = 128),
      "mfr" -> nonEmptyText(maxLength = 128),
      "prod" -> nonEmptyText(maxLength = 128),
      "sch" -> nonEmptyText(maxLength = 128),
      "realm" -> seq(text),
      "features" -> seq(text).verifying(features => (!(features.isEmpty)))
    )
    {
      (name, is_super, domain, mfr, prod, sch, realm, features) => Role(name, is_super, domain, mfr, prod, sch, realm.toList, features.toSet)
    }
    {
      rp => Some(rp.name, rp.is_super, rp.domain, rp.mfr, rp.prod, rp.sch,rp.realm.toList, rp.features.toSeq)
    }
   )

  val adminAddNewRoleForm: Form[NewRole] = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 128),
      "is_super" -> boolean,
      "domain" -> nonEmptyText(maxLength = 128),
      "mfr" -> nonEmptyText(maxLength = 128),
      "prod" -> nonEmptyText(maxLength = 128),
      "sch" -> nonEmptyText(maxLength = 128),
      "realm" -> seq(text),
      "features" -> seq(text).verifying(features => (!(features.isEmpty)))
    )
    {
      (name, is_super, domain, mfr, prod, sch, realm, features) => NewRole(name, is_super, domain, mfr, prod, sch, realm.toList, features.toSet)
    }
    {
      rp => Some(rp.name, rp.is_super, rp.domain, rp.mfr, rp.prod, rp.sch,rp.realm.toList, rp.features.toSeq)
    }
  )

    val tableauAddUsersForm: Form[Seq[TableauUserRole]] = Form(
      seq(mapping(
          "userName" -> nonEmptyText(),
          "roleType" -> nonEmptyText(),
          "mps" -> optional(text)
        )(TableauUserRole.apply)(TableauUserRole.unapply)))

    val tableauUpdateRoleForm: Form[TableauUpdateRole] = Form(
      mapping(
        "userName" -> seq(text),
        "roleType" -> nonEmptyText(),
        "mps" -> optional(text)
      )(TableauUpdateRole.apply)(TableauUpdateRole.unapply))

    val tableauDeleteUsersForm: Form[Seq[TableauDeleteUsers]] = Form(
      seq(mapping(
        "users" -> seq(text),
        "mps" -> nonEmptyText()
      )(TableauDeleteUsers.apply)(TableauDeleteUsers.unapply)))

    val bulkUpdateRoleProductsForm: Form[BulkRoleProducts] = Form(
      mapping(
        "roleName" -> nonEmptyText(),
        "is_super" -> boolean,
        "twoAuth" -> optional(boolean),
        "two_auth_support" -> optional(seq(text)),
        "productFeatures" -> seq(mapping(
          "product" -> nonEmptyText(),
          "features" -> nonEmptyText(),
          "productName" -> nonEmptyText(),
          "explorer_date_range" -> optional(number))
        (ProductFeature.apply)(ProductFeature.unapply))
      )(BulkRoleProducts.apply)(BulkRoleProducts.unapply))


   /** lists all domains for a role
   *  
   */
  def domainsList(version: String, mfr: String, role:String) = IsAuthorizedForOrg(mfr, version) { userid =>
    implicit request => {
      val result = version match {
        case constants.VERTICA_VERSION => models.vRole.roleDetails(role)
        case _ => models.Role.roleDetails(role)
      }
      result match {
        case Success(resultSet) =>
          if (resultSet.name.nonEmpty)
            Ok(models.Utils.jsonResponse("Success", "List of all domains", Json.toJson(resultSet)))
          else
            Ok(models.Utils.jsonResponse("Success", "No domains found for this role or role doesnt exist", Json.toJson("")))
        case Failure(ex) =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /**
   * lists domain,feature and user details for a role for an mps
   *
   */
  def userDetails(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version) { userid =>
    implicit request => {
      val role = request.session.get(SKUserRole).getOrElse("NA")
      val result = version match {
        case constants.VERTICA_VERSION => models.vRole.userDetails(mfr, prod, sch, userid, role)
        case _ => models.Role.userDetails(mfr, prod, sch, userid, role)
      }
      result match {
        case Success(resultSet) =>
          Ok(models.Utils.jsonResponse("Success", "List all information for a user", Json.toJson(resultSet)))
        case Failure(ex) =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /**
   * lists domain,feature and user details for a role for an mps for mobile app
   *
   */
  def userRoleDetails(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version) { userid =>
    implicit request => {
      val row = vertica.user.selectUserRole(userid.toLowerCase())
      val role = if(row.size == 1 ) models.Utils.getDBStringVal(row.head, vertica.role.Col_role_name) else ""
      val result = version match {
        case constants.VERTICA_VERSION => models.vRole.userDetails(mfr, prod, sch, userid, role)
        case _ => models.Role.userDetails(mfr, prod, sch, userid, role)
      }
      result match {
        case Success(resultSet) =>
          Ok(models.Utils.jsonResponse("Success", "List all information for a user", Json.toJson(resultSet)))
        case Failure(ex) =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }
  
 /** lists all roles and permissions
  *  
  */
  def list(version: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      val orgOpt = userOrg(request)
      version match {
        case constants.VERTICA_VERSION => Ok(views.html.role.list(models.vRole.allRoles(), userName(request), orgOpt, userRole(request), version))
        case _ => Ok(views.html.role.list(models.Role.allRoles(), userName(request), orgOpt, userRole(request), version))
      }
    }
  }
  
  def listall(version: String, mfr: String) = Action {
    implicit request => {
      val orgOpt = userOrg(request)
      version match {
        case constants.VERTICA_VERSION =>
          val twoAuth = models.vOrg.isTwoAuthAtOrgLevel(mfr)
          Ok(models.Utils.jsonResponseRoleTwoAuth("Success", "list of all Users", Json.toJson(models.vRole.allRolesMfr(mfr)), twoAuth))
        case _ =>
          val twoAuth = models.vOrg.isTwoAuthAtOrgLevel(mfr)
          Ok(models.Utils.jsonResponseRoleTwoAuth("Success", "list of all Users", Json.toJson(models.Role.allRolesMfr(mfr)), twoAuth))
      }
    }
   }
   
  /** saves new role information submitted via form to data store
  *
  */
  //asda
  
  def add(version: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          addNewRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(views.html.role.addNew(formWithErrors, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
              , userName(request), userOrg(request), userRole(request), version)),
            rp => models.vRole.create(rp) map { errorMsg =>
              InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
            } getOrElse (Redirect(routes.AdminRole.add(version)).flashing(FKSuccess -> "Role saved"))
          )
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          addRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(views.html.role.add(formWithErrors, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
              , userName(request), userOrg(request), userRole(request), version)),
            rp => models.Role.create(rp) map { errorMsg =>
              InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
            } getOrElse (Redirect(routes.AdminRole.add(version)).flashing(FKSuccess -> "Role saved"))
          )
      }
    }
  } 
  
  def addrole(version: String, mfr :String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          adminAddNewRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, domain, mfr, product, schema, features is missing..", Json.toJson(""))),
            rp => models.vRole.managerole(rp, mfr) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role ${rp.name} added successfully", Json.toJson(""))))
          )
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          adminAddRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, domain, mfr, product, schema, features is missing..", Json.toJson(""))),
            rp => models.Role.managerole(rp, mfr) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role ${rp.name} added successfully", Json.toJson(""))))
          )
      }
    }
  }

  def modifyRole(version: String, mfr :String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          adminAddNewRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, domain, mfr, product, schema, features is missing..", Json.toJson(""))),
            rp => models.vRole.managerole(rp, mfr) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role ${rp.name.split("_").slice(3, rp.name.length - 1).mkString("_")} updated successfully", Json.toJson(""))))
          )
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          adminAddRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) out of name, domain, mfr, product, schema, features is missing..", Json.toJson(""))),
            rp => models.Role.managerole(rp, mfr) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role ${rp.name.split("_").slice(3, rp.name.length - 1).mkString("_")} updated successfully", Json.toJson(""))))
          )
      }
    }
  }

  def bulkUpdateRoleProducts(version: String, mfr :String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      val reqSession = request.cookies.get("PLAY_SESSION")
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          bulkUpdateRoleProductsForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required field(s) missing..", Json.toJson(""))),
            rp => models.vRole.bulkUpdateRoleProducts(rp, mfr, userid, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Products updated successfully", Json.toJson(""))))
          )
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          bulkUpdateRoleProductsForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required field(s) missing..", Json.toJson(""))),
            rp => models.Role.bulkUpdateRoleProducts(rp, mfr) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Products updated successfully", Json.toJson(""))))
          )
      }
    }
  }

  /** presents a form for adding a new role
   */ 
  
  def addForm(version: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          Ok(views.html.role.addNew(addNewRoleForm, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          Ok(views.html.role.add(addRoleForm, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
      }
    }
  }
  
   /** Enables to edit a role with permissions
   */ 
  def addDomain(version: String, roleName: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val mps = models.vRole.getMPSFromDomain()
          val editRoleForm = addNewRoleForm.fill(new NewRole(roleName, false, "", "", "", "", List(), Set()))
          Ok(views.html.role.addNew(editRoleForm, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
        case _ =>
          val mps = models.Role.getMPSFromDomain()
          val editRoleForm = addRoleForm.fill(new Role(roleName, false, "", "", "", "", List(), Set()))
          Ok(views.html.role.add(editRoleForm, mps.getOrElse("mfr", List()).toSeq, mps.getOrElse("prod", List()).toSeq, mps.getOrElse("sch", List()).toSeq, Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
      }
    }
  }
  
  /** Enables to edit a role with permissions
   */ 
 def edit(version: String, roleName: String, domain: String, permissions: String, mps: String, realm: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      val mpsList = mps.split(":").toList
      val features = permissions.split(",").toSet
      val realms = realm.split(",").toList
      version match {
        case constants.VERTICA_VERSION =>
          val editRoleForm = addNewRoleForm.fill(new NewRole(roleName, false, domain, "", "", "", realms, features))
          Ok(views.html.role.addNew(editRoleForm, Seq(mpsList(0)), Seq(mpsList(1)), Seq(mpsList(2)), Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
        case _ =>
          val editRoleForm = addRoleForm.fill(new Role(roleName, false, domain, "", "", "", realms, features))
          Ok(views.html.role.add(editRoleForm, Seq(mpsList(0)), Seq(mpsList(1)), Seq(mpsList(2)), Auth.feature.toSeq
            , userName(request), userOrg(request), userRole(request), version))
      }
    }
  }
  /** remove a role from data store
   *
   */
  def delete(version: String, roleName: String) = IsAuthorizedGBUser { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          models.vRole.deleteRole(roleName) map { errorMsg =>
            InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
          } getOrElse {
            Redirect(routes.AdminRole.list(version)).flashing(FKSuccess -> "Role deleted")
          }
        case _ =>
          models.Role.deleteRole(roleName) map { errorMsg =>
            InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
          } getOrElse {
            Redirect(routes.AdminRole.list(version)).flashing(FKSuccess -> "Role deleted")
          }
      }
    }
  }

  def roleNameMsg(roleName: String) : String = {
    val cRoles = roleName.split(",")
    val res = cRoles.foldLeft("")((f,e) => e.split("_").slice(3, e.length -1).mkString("_") ++ "," ++ f)
    val fRoles = if(res(res.length -1).equals(',')) res.slice(0, res.length-1) else res
    fRoles
  }
  
  def deleterole(version: String, roleName: String, mfr: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val roles = roleNameMsg(roleName)
          models.vRole.deleteRoles(roleName) map { errorMsg =>
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
          } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role $roles deleted successfully", Json.toJson(""))))
        case _ =>
          val roles = roleNameMsg(roleName)
          models.Role.deleteRoles(roleName) map { errorMsg =>
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
          } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Role $roles deleted successfully", Json.toJson(""))))
      }
    }
  }

  def deleteRoleProduct(version: String, roleName: String, mfr: String, prod:String, sch:String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      val reqSession = request.cookies.get("PLAY_SESSION")
      version match {
        case constants.VERTICA_VERSION =>
          models.vRole.deleteRoleProduct(roleName, mfr, prod, sch, reqSession) map { errorMsg =>
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
          } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Product deleted successfully", Json.toJson(""))))
        case _ =>
          models.Role.deleteRoleProduct(roleName, mfr, prod, sch) map { errorMsg =>
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
          } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Product deleted successfully", Json.toJson(""))))
      }
    }
  }
  
  def listRoles(version: String,mfr:String,prod:String,sch:String) = Action {
    implicit request => {
      val orgOpt = userOrg(request)
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        version match {
          case constants.VERTICA_VERSION =>
            Ok(models.Utils.jsonResponse("Success", "List of roles", Json.toJson(models.vRole.getRoles(mfr, prod, sch))))
          case _ =>
            Ok(models.Utils.jsonResponse("Success", "List of roles", Json.toJson(models.Role.getRoles(mfr, prod, sch))))
        }
      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }
    }
  }

  def listHealthCheckRoles(version: String,mfr:String, prod:String, sch:String) = Action {
    implicit request => {
      val orgOpt = userOrg(request)
      val userId = request.session.get(SKUserId).getOrElse("NA")
      if (orgOpt.get.equals(mfr) || orgOpt.get.equals(GBName)) {
        version match {
          case constants.VERTICA_VERSION =>
            Ok(models.Utils.jsonResponse("Success", "List of healthcheck roles", Json.toJson(models.vRole.getHealthCheckRoles(mfr, prod, sch, userId))))
          case _ =>
            Ok(models.Utils.jsonResponse("Success", "List of healthcheck roles", Json.toJson(models.Role.getHealthCheckRoles(mfr, prod, sch,userId))))
        }
      } else {
        BadRequest(models.Utils.jsonResponse("Failure", "You are not authorized to view users for other organization", Json.toJson("")))
      }
    }
  }

  def tableauUpdateRole(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauUpdateRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.vRole.tableauUpdateRole(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Site-Role updated successfully", Json.toJson(""))))
          )
        case _ =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauUpdateRoleForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.Role.tableauUpdateRole(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Site-Role updated successfully", Json.toJson(""))))
          )
      }
    }
  }

  def tableauAddUpdateUsers(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauAddUsersForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.vRole.tableauAddUpdateUsers(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"User(s) updated to Site successfully.", Json.toJson(""))))
          )
        case _ =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauAddUsersForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.Role.tableauAddUpdateUsers(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"User(s) updated to Site successfully.", Json.toJson(""))))
          )
      }
    }
  }

  def tableauDeleteUsers(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      version match {
        case constants.VERTICA_VERSION =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauDeleteUsersForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.vRole.tableauDeleteUsers(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Site user(s) deleted successfully.", Json.toJson(""))))
          )
        case _ =>
          val reqSession = request.cookies.get("PLAY_SESSION")
          tableauDeleteUsersForm.bindFromRequest.fold(
            formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing..", Json.toJson(""))),
            rp => models.Role.tableauDeleteUsers(mfr, prod, sch, rp, reqSession) map { errorMsg =>
              InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
            } getOrElse (Ok(models.Utils.jsonResponse("Success", s"Site user(s) deleted successfully.", Json.toJson(""))))
          )
      }
    }
  }

  def isTableauConfigured(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid =>
    implicit request => {
      val reqSession = request.cookies.get("PLAY_SESSION")
      val startTime = DateTime.now
      val res = models.vRole.isTableauConfigured(version, mfr, prod, sch, reqSession)
      val endTime = DateTime.now
      log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      res match {
        case Success(response) =>
          log.debug(s"${response._2}")
          Ok(models.Utils.jsonResponse("Success", s"${response._2}", Json.toJson(response._1)))
        case _ =>
          log.error(s"[$mfr/$prod/$sch] - Failed to check tableau configuration")
          //to handle backward compatibility for ddau , we have to return 200 for this API even if IS respond with failure
          Ok(models.Utils.jsonResponse("Success", s"", Json.toJson(false)))
//          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }
}
