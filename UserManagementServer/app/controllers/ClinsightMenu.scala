package controllers

import models._
import org.joda.time.DateTime
import play.api.libs.json.{Json, Writes}
import play.api.mvc.{Action, Controller}
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation._

import java.util.TimeZone
import scala.util.{Failure, Success}

object ClinsightMenu extends Controller with Secured {
  val log = Logger("Controller_ClinsightMenu")

  implicit val clinsightMenuItemWrite = Json.writes[ClinsightMenuItem]
  implicit val clinsightMenuNodeOpWrite = Json.writes[ClinsightMenuNodeOp]

  implicit val clinsightFlatMenuWrite : Writes[ClinsightFlatMenu] = new Writes[ClinsightFlatMenu] {
    def writes(x: ClinsightFlatMenu) = {
      Json.obj(
        "id" -> x.id,
        "cat" -> x.cat,
        "cat_seq" -> x.cat_seq,
        "sub_cat1" -> x.sub_cat1,
        "sub_cat1_seq" -> x.sub_cat1_seq,
        "sub_cat2" -> x.sub_cat2,
        "sub_cat2_seq" -> x.sub_cat2_seq,
        "sub_cat3" -> x.sub_cat3,
        "sub_cat3_seq" -> x.sub_cat3_seq,
        "report_url" -> x.report_url,
        "disable" -> x.disable,
        "alert_msg" -> x.alert_msg,
        "clinsights_role_name" -> x.clinsights_role_name,
        "clinsights_role_id" -> x.clinsights_role_id)
    }
  }

  implicit val nodeWrite : Writes[TreeNode[ClinsightMenuItem]] = new Writes[TreeNode[ClinsightMenuItem]] {
    def writes(x: TreeNode[ClinsightMenuItem]) = {
      Json.obj(
        "id" -> x.data.id,
        "parent_node_id" -> x.data.parent_node_id,
        "seq" -> x.data.seq,
        "name" -> x.data.name,
        "report_url" -> x.data.report_url,
        "disable" -> x.data.disable,
        "children" -> x.children.map(n => writes(n)))
    }
  }

  implicit val menuJsonWrite : Writes[ClinsightMenuJson] = new Writes[ClinsightMenuJson] {
    def writes(x: ClinsightMenuJson) = {
      Json.obj(
        "user" -> x.user,
        "clinsights_role_id" -> x.clinsights_role_id,
        "clinsights_role_name" -> x.clinsights_role_name,
        "clinsights_alert_msg" -> x.clinsights_alert_msg,
        "clinsights_base_url" -> x.clinsights_base_url,
        "clinsights_landing_page_report_url" -> x.clinsights_landing_page_url,
        "clinsights_menu" -> x.menu)
    }
  }

  implicit val flatMenuJsonWrite : Writes[ClinsightFlatMenuJson] = new Writes[ClinsightFlatMenuJson] {
    def writes(x: ClinsightFlatMenuJson) = {
      Json.obj(
        "user" -> x.user,
        "clinsights_role_id" -> x.clinsights_role_id,
        "clinsights_role_name" -> x.clinsights_role_name,
        "clinsights_alert_msg" -> x.clinsights_alert_msg,
        "clinsights_base_url" -> x.clinsights_base_url,
        "clinsights_landing_page_report_url" -> x.clinsights_landing_page_url,
        "clinsights_menu" -> x.menu)
    }
  }

  val clinsightMenuNodeOpForm = Form(
    seq(mapping(
      "mps" -> nonEmptyText,
      "id" -> optional(text),
      "clinsights_role_id" -> optional(longNumber),
      "access_end_date" -> optional(date("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone("UTC")))
    )(ClinsightMenuNodeOp.apply)(ClinsightMenuNodeOp.unapply)).verifying(models.Utils.nonEmptySeq))

  /** Get Clinsight master tree
   *
   * @return Success/Failure menu tree
   */
  def clinsightsMasterTree(version: String, mfr: String) = IsAuthorizedForOrg(mfr, version){ userid =>
    implicit request => {
      val startTime = DateTime.now
      val res = models.ClinsightMenu.clinsightsMasterTree()
      val endTime = DateTime.now
      log.info(s"[$mfr] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      res match {
        case Success(response) =>
          Ok(models.Utils.jsonResponse("Success", s"Clinsights Menu.", Json.toJson(response)))
        case Failure(exception) =>
          log.error(s"[$mfr] - Unable to fetch Clinsights Master Menu for $mfr")
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /** Get Clinsight mps tree
   *
   * @return Success/Failure menu tree
   */
  def clinsightsMpsTree(version: String, mfr: String, prod: String, sch: String, user: Option[String], roleOpt: Option[Long]) = IsAuthorizedForOrg(mfr, version){ userid =>
    implicit request => {
      val startTime = DateTime.now
      val res = models.ClinsightMenu.clinsightsMpsTree(mfr, prod, sch, user, roleOpt)
      val endTime = DateTime.now
      log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      res match {
        case Success(response) =>
          Ok(models.Utils.jsonResponse("Success", s"Clinsights Menu.", Json.toJson(response)))
        case Failure(exception) =>
          log.error(s"[$mfr/$prod/$sch] - Unable to fetch Clinsights Menu for $mfr, $prod, $sch")
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /** Get Clinsight mps tree
   *
   * @return Success/Failure menu tree
   */
  def clinsightsMpsFlatMenu(version: String, mfr: String, prod: String, sch: String, user: Option[String], roleOpt: Option[Long]) = IsAuthorizedForOrg(mfr, version){ userid =>
    implicit request => {
      val startTime = DateTime.now
      val res = models.ClinsightMenu.clinsightsMpsFlatMenu(mfr, prod, sch, user, roleOpt)
      val endTime = DateTime.now
      log.info(s"[$mfr/$prod/$sch] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
      res match {
        case Success(response) =>
          Ok(models.Utils.jsonResponse("Success", s"Clinsights Menu.", Json.toJson(response)))
        case Failure(exception) =>
          log.error(s"[$mfr/$prod/$sch] - Unable to fetch Clinsights Menu for $mfr, $prod, $sch")
          InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
      }
    }
  }

  /** CRUD Operations for menu's hide table at MPS level
   *
   * @return Success/Failure msg
   */
  def clinsightsMpsNodeHide(version: String, operation_type: String, mfr: String) = IsAuthorizedForOrg(mfr, version){ userid => implicit request =>
    clinsightMenuNodeOpForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"clinsightsMpsNodeHide payload : $c")
        val res = models.ClinsightMenu.clinsightsMpsNodeHide(operation_type, c.toList)
        val endTime = DateTime.now
        log.info(s"[$mfr] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Node updated successfully for request payload $c")
            Ok(models.Utils.jsonResponse("Success", s"Node updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr] - Unable to update node for payload: $c")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** CRUD Operations for menu's disable table at MPS level
   *
   * @return Success/Failure msg
   */
  def clinsightsMpsNodeDisable(version: String, operation_type: String, mfr: String) = IsAuthorizedForOrg(mfr, version){ userid => implicit request =>
    clinsightMenuNodeOpForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"clinsightsMpsNodeDisable payload : $c")
        val res = models.ClinsightMenu.clinsightsMpsNodeDisable(operation_type, c.toList)
        val endTime = DateTime.now
        log.info(s"[$mfr] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Node updated successfully for request payload $c")
            Ok(models.Utils.jsonResponse("Success", s"Node updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr] - Unable to update node for payload: $c")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** CRUD Operations for menu's hide table at Role level
   *
   * @return Success/Failure msg
   */
  def clinsightsRoleNodeHide(version: String, operation_type: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    clinsightMenuNodeOpForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"clinsightsMpsNodeHide payload : $c")
        val res = models.ClinsightMenu.clinsightsMpsNodeHide(operation_type, c.toList)
        val endTime = DateTime.now
        log.info(s"[$mfr] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Node updated successfully for request payload $c")
            Ok(models.Utils.jsonResponse("Success", s"Node updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr] - Unable to update node for payload: $c")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }

  /** CRUD Operations for menu's disable table at Role level
   *
   * @return Success/Failure msg
   */
  def clinsightsRoleNodeDisable(version: String, operation_type: String, mfr: String, prod: String, sch: String) = IsUserAuthorized(mfr, prod, sch, version){ userid => implicit request =>
    clinsightMenuNodeOpForm.bindFromRequest.fold(
      formWithErrors => BadRequest(models.Utils.jsonResponse("Failure", "Required Field(s) missing ..", Json.toJson(""))),
      c => {
        val startTime = DateTime.now
        log.debug(s"clinsightsMpsNodeDisable payload : $c")
        val res = models.ClinsightMenu.clinsightsMpsNodeDisable(operation_type, c.toList)
        val endTime = DateTime.now
        log.info(s"[$mfr] - [Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        res match {
          case Success(response) =>
            log.debug(s"Node updated successfully for request payload $c")
            Ok(models.Utils.jsonResponse("Success", s"Node updated successfully.", Json.toJson(response)))
          case Failure(exception) =>
            log.error(s"[$mfr] - Unable to update node for payload: $c")
            InternalServerError(models.Utils.jsonResponse("Failure", "Internal Server Error", Json.toJson("")))
        }
      }
    )
  }
}
