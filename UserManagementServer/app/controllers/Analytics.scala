package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._
import org.joda.time._
import play.api.Play.current
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.i18n.Messages.Implicits._
import com.datastax.driver.core.exceptions._

import scala.util.{Failure, Success, Try}
import models.Utils.jsonResponse
import models.Utils
import constants._
import dao.DBUtils
import controllers.SqlHelper._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._

object Analytics extends Controller with Secured {
  val log = Logger("Controller_Analytics")
  val module = "Analytics"
  
  def sql(version: String, sqlQuery: String) = IsAuthorizedGBUser { userid =>
    implicit request =>
      try {
        val startTime = DateTime.now
        version match {
          case constants.VERTICA_VERSION =>
            val result = models.SqlHelper.getQueryDB(version, sqlQuery)
            val endTime = DateTime.now
            result match {
              case Success(resultSet) =>
                log.info(s"[Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
                Ok(models.Utils.jsonResponse("Success", "Response", Json.toJson(resultSet)))
              case Failure(ex) =>
                log.error(s"Exception thrown during SQL query for SQL statement: $sqlQuery, ex: $ex")
                InternalServerError(jsonResponse("Failure", "Syntax or internal error", JsNull))
            }
          case _ =>
            val resultSet = models.Analytics.sql(sqlQuery)
            val endTime = DateTime.now
            log.info(s"[Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
            Ok(resultSet.toJson)
        }
      } catch {
        case ex: Exception =>
          log.error(s"Exception thrown during SQL query for SQL statement: $sqlQuery, ex: $ex")
          InternalServerError(jsonResponse("Failure", "Syntax or internal error", JsNull))
      }
  }

  def hql(version: String, hqlQuery: String) = IsAuthorizedGBUser { userid => implicit request =>
    try {
        val startTime = DateTime.now
        val resultSet = models.Analytics.hql(hqlQuery) 
        val endTime = DateTime.now
        log.info(s"[Userid : $userid] - API Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  URI: " + request.uri)
        Ok(resultSet.toJson)
    } catch {
        case ex: Exception =>
          log.error(s"Exception thrown for HiveSQL statement: $hqlQuery, ex: $ex")
          InternalServerError(jsonResponse("Failure", "Syntax or internal error", JsNull))
    }
  }
  
   
  def refreshSpark(version: String) = IsAuthorizedGBUser {userid => implicit request =>
    models.SparkDriver.refreshSpark()
    Ok("Spark refreshed..")
  }

}  
