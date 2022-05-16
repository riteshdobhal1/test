package controllers

import java.util.Date

import models.SqlQueryForm
import org.joda.time.{DateTime, DateTimeZone}
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import constants._

import scala.util.{Failure, Success}


object SqlHelper extends Controller with Secured {
  val log = Logger("Controller_SqlHelper")

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

  implicit val mapAnyWrites = new Writes[Map[String, Option[Any]]] {
    def writes(m: Map[String, Option[Any]]) = {
      Json.toJson(m map {
        case (k, v) => k -> (v.get match {
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
                case m: Map[_, _] => writes(m.asInstanceOf[Map[String, Option[Any]]])
                case x if (x == null) => JsNull
              }
            }
          }
          case m: Map[_, _] => writes(m.asInstanceOf[Map[String, Option[Any]]])
          case ll: List[Any] => JsArray {
            for (c <- ll) yield {
              c match {
                case i: Int           => JsNumber(i)
                case l: Long          => JsNumber(l)
                case f: Float         => JsNumber(f)
                case d: Double        => JsNumber(d)
                case s: String        => JsString(s)
                case b: Boolean       => JsBoolean(b)
                case m: Map[_, _]     => writes(m.asInstanceOf[Map[String, Option[Any]]])
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

  val sqlQueryForm = Form(
    mapping(
      "query" -> nonEmptyText,
      "action" -> nonEmptyText
    )(SqlQueryForm.apply)(SqlQueryForm.unapply)
  )

  def getQueryDB(version: String, query: String) = Action { implicit request =>
    val result = models.SqlHelper.getQueryDB(version, query)
    result match {
      case Success(resultSet) =>
        Ok(models.Utils.jsonResponse("Success", "Response", Json.toJson(resultSet)))
      case Failure(exception) =>
        val logMs = exception.getMessage()
        logMs match {
          case msg => InternalServerError(s"$msg")
          case _ => InternalServerError(s"There is some problem in processing your query...")
        }
    }
  }

  def queryDB(version: String) = Action { implicit request =>
    val sqlForm = sqlQueryForm.bindFromRequest.get
    val result = models.SqlHelper.queryDB(version, sqlForm)
    result match {
      case Success(resultSet) =>
        Ok(models.Utils.jsonResponse("Success", "Response", Json.toJson(resultSet)))
      case Failure(exception) =>
        val logMs = exception.getMessage()
        logMs match {
          case msg => InternalServerError(s"$msg")
          case _ => InternalServerError(s"There is some problem in processing your query...")
        }
    }
  }
}
