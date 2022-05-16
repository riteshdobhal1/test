package controllers

import play.api.Logger
import play.api._
import play.api.mvc._
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
import scala.util.{Failure, Success, Try}
import dao._
import controllers.SqlHelper._

object AdminCustomer extends Controller with Secured {
  val log = Logger("Controller_AdminCustomer")
  val module = ModAdmin

  
  case class CustomerList(mfr: String, prod: String, sch: String, ec: String, realm: String)
  implicit val custListWrites = Json.writes[CustomerList]
  implicit val endCustomer = Json.writes[EndCustomer]
  implicit val systemColsInfo = Json.writes[SystemColsInfo]
  implicit val systemMpsCols = Json.writes[SystemMpsCols]
  
  /** form for adding a new customer
   * 
   */

   val addCustDomainForm: Form[Cust] = Form(
    mapping(
      "mfr" -> nonEmptyText(maxLength = 128),
      "desc" -> nonEmptyText(maxLength = 512),
      "type" -> ignored(OrgTypeEC),
      "domain" -> mapping(
      "prod" -> nonEmptyText(maxLength = 512),
      "sch" -> nonEmptyText(maxLength = 512),
      "ec" -> nonEmptyText(maxLength = 512),
      "realm" -> nonEmptyText(maxLength = 512),
      "sso_login_url" -> text(maxLength = 512),
      "sso_logout_url" -> text(maxLength = 512),
      "sso_roles" -> text(maxLength = 512),
      "sso_idp_id" -> text(maxLength = 512)
    )(CustDomain.apply)(CustDomain.unapply))(Cust.apply)(Cust.unapply))
    
    val addHealthCheckForm = Form(
      tuple(      
      "endcustomer_name" -> nonEmptyText(maxLength = 512),
      "serial_number" -> text,
      "created_by" -> text,
      "updated_on" -> text,
        "group_name" -> optional(text)
    )
    )
    
    
    val deleteEndCustomer = Form(
     tuple(
        "endcustomer_name" -> text,
        "mps" -> text
        )      
    ) 
    
    val deleteEndCustomerMultiple = Form(
     tuple(
        "endcustomer_name" -> nonEmptyText,
        "mps" -> text
        )      
    )

  val deleteMultiEndCustomerMultiMps = Form(
    seq(mapping(
      "endcustomer_name" -> seq(text),
      "mps" -> nonEmptyText
    )(MultiEcMultiMPS.apply)(MultiEcMultiMPS.unapply)))

  val mpsSysidsForm: Form[Seq[MpsAvailableSystems]] = Form(
    seq(mapping(
      "mfr" -> nonEmptyText(),
      "prod" -> nonEmptyText(),
      "sch" -> nonEmptyText(),
      "sysid_col_name" -> nonEmptyText(),
      "sysids" -> seq(nonEmptyText())
    )(MpsAvailableSystems.apply)(MpsAvailableSystems.unapply)))
    
  /** lists all current customers of the signed in glassbeam user
   */
  def list(version: String, is_request: Option[Boolean]) = IsAuthorizedGBUser { userid => implicit request => {
      val org = userOrg(request).get
      val isReq = is_request.getOrElse(false)
      is_request match {
        case Some(q) =>
          if(q) {
            val custList = version match{
              case constants.VERTICA_VERSION => models.vOrg.customers(org) map { cust =>
                CustomerList(cust._1, cust._2, cust._3, cust._4, cust._5)
              }
              case _ => models.Org.customers(org) map { cust =>
                CustomerList(cust._1, cust._2, cust._3, cust._4, cust._5)
              }
            }
            Ok(models.Utils.jsonResponse("Success", "List of customers", Json.toJson(custList.toList)))
          } else {
            version match{
              case constants.VERTICA_VERSION => Ok(views.html.customer.listAll(models.vOrg.customers(org), userName(request), Some(org), userRole(request), version))
              case _ => Ok(views.html.customer.listAll(models.Org.customers(org), userName(request), Some(org), userRole(request), version))
            }
          }
        case None => version match{
          case constants.VERTICA_VERSION => Ok(views.html.customer.listAll(models.vOrg.customers(org), userName(request), Some(org), userRole(request), version))
          case _ => Ok(views.html.customer.listAll(models.Org.customers(org), userName(request), Some(org), userRole(request), version))
        }
      }
    }
  }

  /**
   * presents a form for adding a new customer
   */
  def addForm(version: String) = IsAuthorizedGBUser { userid => implicit request => {
      Ok(views.html.customer.add(addCustDomainForm, userName(request), userOrg(request), userRole(request), version))
    }
  }

  /** saves new customer information submitted via form to data store
   *  
   */
  def add(version: String) = IsAuthorizedGBUser { userid => implicit request =>
    addCustDomainForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.customer.add(formWithErrors, userName(request), userOrg(request), userRole(request), version)),
      c => version match{
        case constants.VERTICA_VERSION => models.vOrg.createCustomer(c) map { errorMsg =>
          InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
        } getOrElse(Redirect(routes.AdminCustomer.list(version, None)).flashing(FKSuccess -> "Customer saved"))
        case _ => models.Org.createCustomer(c) map { errorMsg =>
          InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
        } getOrElse(Redirect(routes.AdminCustomer.list(version, None)).flashing(FKSuccess -> "Customer saved"))
      }
    )                                                                                                                                        
  }
   
  /** remove a customer from data store
   *  
   */
  def delete(version: String, mfr: String, prod: String, sch: String, ec: String, realm: String) = IsAuthorizedGBUser { userid => implicit request =>
    version match{
      case constants.VERTICA_VERSION => models.vOrg.deleteCustomer(mfr, prod, sch, ec, realm) map { errorMsg =>
        InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
      } getOrElse {
        Redirect(routes.AdminCustomer.list(version, None)).flashing(FKSuccess -> "Customer deleted")
      }
      case _ => models.Org.deleteCustomer(mfr, prod, sch, ec, realm) map { errorMsg =>
        InternalServerError(views.html.error(userName(request), userOrg(request), userRole(request), HttpStatus.Error, errorMsg))
      } getOrElse {
        Redirect(routes.AdminCustomer.list(version, None)).flashing(FKSuccess -> "Customer deleted")
      }
    }
  }
  
  /**
   *  Get mpse details from the mpse_sso table 
   */
  
  def getMpseInfo(version: String, mfr: String, prod: String, sch: String, ec: String) = IsUserAuthorized(mfr, prod, sch, version){userid => implicit request =>
      version match{
      case constants.VERTICA_VERSION =>
        val result = models.vOrg.getMpseInfo(mfr, prod, sch, ec)
        implicit val newCustDomain = Json.writes[NewCustDomain]
        Ok(models.Utils.jsonResponse("Success", "MPSE Details", Json.toJson(result)))
      case _ =>
        val result = models.Org.getMpseInfo(mfr, prod, sch, ec)
        Ok(models.Utils.jsonResponse("Success", "MPSE Details", Json.toJson(result)))
    }
  }
  
  def ecHealthCheck(version: String, mfr: String, prod: String, sch: String, user: Option[String], fnCallSrcOpt: Option[String]) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    val result = version match{
      case constants.VERTICA_VERSION => models.vOrg.ecHealthCheck(mfr, prod, sch, user, fnCallSrcOpt)
      case _ => models.Org.ecHealthCheck(mfr, prod, sch, user)
    }
    Ok(models.Utils.jsonResponse("Success", s"Count of all ecs for $mfr, $prod, $sch", Json.toJson(result)))
  }

  def ecHealthCheckMfr(version: String, mfr: String, user: Option[String], fnCallSrcOpt: Option[String]) = IsAdminForOrg(mfr, version) { userid => implicit request =>
    val result = version match{
      case constants.VERTICA_VERSION => models.vOrg.ecHealthCheckMfr(mfr, user, fnCallSrcOpt)
      case _ => models.Org.ecHealthCheckMfr(mfr, user)
    }
    implicit val endCustomerMfr = Json.writes[EndCustomerMfr]
    Ok(models.Utils.jsonResponse("Success", s"Count of all ecs for $mfr", Json.toJson(result)))
  }
  
  def ecHealthCheckAdd(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid => implicit request =>
    val(endcustomer_name,serial_number,created_by,updated_on, group_name) = addHealthCheckForm.bindFromRequest.get
    version match{
      case constants.VERTICA_VERSION => if(!models.vOrg.notExistsEndCustomer(mfr,prod,sch,endcustomer_name.toLowerCase)){
        BadRequest(models.Utils.jsonResponse("Failure", s"Group $endcustomer_name already exists!!", Json.toJson("")))
      } else if (endcustomer_name.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
      } else {
        models.vOrg.ecHealthCheckAdd(mfr,prod,sch,userid,endcustomer_name,serial_number,group_name) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name added successfully", Json.toJson("")))
        }
      }
      case _ => if(!models.Org.notExistsEndCustomer(mfr,prod,sch,endcustomer_name.toLowerCase)){
        BadRequest(models.Utils.jsonResponse("Failure", s"Group $endcustomer_name already exists!!", Json.toJson("")))
      } else if (endcustomer_name.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
      } else {
        models.Org.ecHealthCheckAdd(mfr,prod,sch,userid,endcustomer_name,serial_number) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name added successfully", Json.toJson("")))
        }
      }
    }
  } 
 
  def ecHealthCheckUpdate(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val(endcustomer_name,serial_number,created_by,updated_on,group_name) = addHealthCheckForm.bindFromRequest.get

    if (endcustomer_name.equals("")) {
      BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
    } else {
      version match{
        case constants.VERTICA_VERSION => models.vOrg.ecHealthCheckUpdate(mfr,prod,sch,userid,endcustomer_name,serial_number,group_name,reqSession) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name updated successfully", Json.toJson("")))
        }
        case _ => models.Org.ecHealthCheckUpdate(mfr,prod,sch,userid,endcustomer_name,serial_number) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name updated successfully", Json.toJson("")))
        }
      }
    }
  }

  /** API will be called from Logi side
    * Refer TK-57428
    */
  def ecHealthCheckAddUser(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid => implicit request =>
    val(endcustomer_name,serial_number,created_by,updated_on,group_name) = addHealthCheckForm.bindFromRequest.get
    version match{
      case constants.VERTICA_VERSION => if(!models.vOrg.notExistsEndCustomer(mfr,prod,sch,endcustomer_name.toLowerCase)){
        BadRequest(models.Utils.jsonResponse("Failure", s"Group $endcustomer_name already exists!!", Json.toJson("")))
      } else if (endcustomer_name.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
      } else {
        models.vOrg.ecHealthCheckAdd(mfr,prod,sch,created_by,endcustomer_name,serial_number,group_name) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name added successfully", Json.toJson("")))
        }
      }
      case _ => if(!models.Org.notExistsEndCustomer(mfr,prod,sch,endcustomer_name.toLowerCase)){
        BadRequest(models.Utils.jsonResponse("Failure", s"Group $endcustomer_name already exists!!", Json.toJson("")))
      } else if (endcustomer_name.equals("")) {
        BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
      } else {
        models.Org.ecHealthCheckAdd(mfr,prod,sch,created_by,endcustomer_name,serial_number) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name added successfully", Json.toJson("")))
        }
      }
    }
  }

  /** API will be called from Logi side
    * Refer TK-57428
    */
  def ecHealthCheckUpdateUser(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version)  { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val(endcustomer_name,serial_number,created_by,updated_on,group_name) = addHealthCheckForm.bindFromRequest.get
    if (endcustomer_name.equals("")) {
      BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
    } else {
      version match{
        case constants.VERTICA_VERSION => models.vOrg.ecHealthCheckUpdate(mfr,prod,sch,created_by,endcustomer_name,serial_number,group_name,reqSession) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name updated successfully", Json.toJson("")))
        }
        case _ => models.Org.ecHealthCheckUpdate(mfr,prod,sch,created_by,endcustomer_name,serial_number) map { errorMsg =>
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson(errorMsg)))
        } getOrElse {
          Ok(models.Utils.jsonResponse("Success", s"Group $endcustomer_name updated successfully", Json.toJson("")))
        }
      }
    }
  }

  def ecHealthCheckDelete(version: String, mfr: String, prod: String, sch: String) = IsAdminForOrg(mfr, version) { userid =>
    implicit request => {
      val reqSession = request.cookies.get("PLAY_SESSION")
      val status = version match {
        case constants.VERTICA_VERSION =>
          val (endcustomers, mps) = deleteEndCustomerMultiple.bindFromRequest.get
          val endcustomer_name = endcustomers.split(",").toList.distinct
          models.vOrg.ecHealthCheckDeleteMultiple(mfr, prod, sch, endcustomer_name, reqSession)
        case _ =>
          val (endcustomers, mps) = deleteEndCustomerMultiple.bindFromRequest.get
          val endcustomer_name = endcustomers.split(",").toList.distinct
          models.Org.ecHealthCheckDeleteMultiple(mfr, prod, sch, endcustomer_name)
      }
      if (status == "") {
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      } else {
        Ok(models.Utils.jsonResponse("Success", status, Json.toJson("")))
      }
    }
  }

  def ecHealthCheckDeleteMFr(version: String, mfr: String) = IsAdminForOrg(mfr, version) { userid =>
    implicit request => {
      val reqSession = request.cookies.get("PLAY_SESSION")
      val status = version match {
        case constants.VERTICA_VERSION =>
          val multiECMultiMPSFormData = deleteMultiEndCustomerMultiMps.bindFromRequest.get
          models.vOrg.ecHealthCheckDeleteMFr(multiECMultiMPSFormData, reqSession)
        case _ =>
          val multiECMultiMPSFormData = deleteMultiEndCustomerMultiMps.bindFromRequest.get
          models.vOrg.ecHealthCheckDeleteMFr(multiECMultiMPSFormData, reqSession)
      }
      if (status == "") {
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      } else {
        Ok(models.Utils.jsonResponse("Success", status, Json.toJson("")))
      }
    }
  }

  /** Get list of sysids for given offset
    *
    * @return Success/Failure list of sysids
    */
  def ecSystemsListFiltered(version: String, mfr: String, prod: String, sch: String, ec: String, st:Int, en:Int, pattern: Option[String], rt: Option[String]) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val result = models.SystemAnalyst.ecSystemsListFiltered(version, mfr, prod, sch, ec, st, en, pattern, rt, reqSession)
    result._1 match {
      case "SUCCESS" =>
        val sysidsList = result._2
        Ok(models.Utils.jsonResponse("Success", s"List of Systems for $mfr, $prod, $sch and $ec", Json.toJson(sysidsList)))
      case _ =>
        log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids for $mfr, $prod, $sch")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  /** Get list of sysids info for given offset
   *
   * @return Success/Failure list of sysIdInfo
   */
  def ecSystemsListData(version: String, mfr: String, prod: String, sch: String, ec: String, st:Int, en:Int) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val body: AnyContent = request.body
    val jsonBody: Option[JsValue] = body.asJson
    jsonBody
      .map { json =>
        val payloadData = (json \ "search").as[Map[String, String]]
        log.debug(s"search payload data : $payloadData")
        val result = models.AdminCustomer.ecSystemsListData(version, mfr, prod, sch, ec, st, en, payloadData, reqSession)
        result._1 match {
          case Success(response) =>
            Ok(models.Utils.jsonResponseSysinfo("Success", s"List of Systems for $mfr, $prod, $sch and $ec", Json.toJson(response), result._2))
          case _ =>
            log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
      .getOrElse {
        BadRequest(models.Utils.jsonResponse("Failure", "Bad request", Json.toJson("")))
      }
  }

  /** Get list of sysid cols info for a given mps
   *
   * @return Success/Failure list of SystemMpsCols
   */
  def ecSystemsColsListData(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val result = models.AdminCustomer.ecSystemsColsListData(version, mfr, prod, sch)
    result match {
      case Success(response) =>
        Ok(models.Utils.jsonResponse("Success", s"List of Systems cols for $mfr, $prod, $sch", Json.toJson(response)))
      case _ =>
        log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids cols for $mfr, $prod, $sch")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  /** Get list of available sysids info for a given mps
   *
   * @return Success/Failure list of sysIdInfo
   */
  def ecAvailableSystemsListData(version: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val mpsSysidsData = mpsSysidsForm.bindFromRequest.get
    if (mpsSysidsData.size < 1) {
      BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) of Group is missing ..", Json.toJson("")))
    } else {
      val result = models.AdminCustomer.ecAvailableSystemsListData(version, mfr, prod, sch, mpsSysidsData, reqSession)
      result match {
        case Success(response) =>
          Ok(models.Utils.jsonResponse("Success", s"List of Systems cols for $mfr, $prod, $sch", Json.toJson(response)))
        case _ =>
          log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids cols for $mfr, $prod, $sch")
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /** Get list of available sysids info for a user's group
   *
   * @return Success/Failure list of sysIdInfo
   */
  def userECAvailableSystemsListData(version: String, mfr: String, prod: String, sch: String, email: String) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val result = models.AdminCustomer.userECAvailableSystemsListData(mfr, prod, sch, email, reqSession)
    result match {
      case Success(response) =>
        Ok(models.Utils.jsonResponse("Success", s"List of Systems cols for $email", Json.toJson(response)))
      case _ =>
        log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids cols for $email")
        InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
    }
  }

  /** Get user group's sysids list info for given offset
   *
   * @return Success/Failure list of sysIdInfo
   */
  def userEcSystemsListData(version: String, mfr: String, prod: String, sch: String, email: String, st:Int, en:Int) = IsUserAuthorized(mfr, prod, sch, version) { userid => implicit request =>
    val reqSession = request.cookies.get("PLAY_SESSION")
    val body: AnyContent = request.body
    val jsonBody: Option[JsValue] = body.asJson
    jsonBody
      .map { json =>
        val payloadData = (json \ "search").as[Map[String, String]]
        log.debug(s"search payload data : $payloadData")
        val result = models.AdminCustomer.userEcSystemsListData(version, mfr, prod, sch, email, st, en, payloadData, reqSession)
        result._1 match {
          case Success(response) =>
            Ok(models.Utils.jsonResponseSysinfo("Success", s"List of Systems for $mfr, $prod, $sch and $mfr", Json.toJson(response), result._2, result._3))
          case _ =>
            log.error(s"[$mfr/$prod/$sch] - Unable to fetch sysids for $mfr, $prod, $sch")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
      .getOrElse {
        BadRequest(models.Utils.jsonResponse("Failure", "Bad request", Json.toJson("")))
      }
  }
}
