package models


import constants._
import controllers.SqlHelper.{Forbidden, log}
import dao.DBUtils
import play.api.Logger
import play.api.libs.json.Json

import scala.util.{Failure, Success, Try}

case class SqlQueryForm(query: String, action: String)

object SqlHelper {
  val log = Logger("Model_SqlHelper")

  def getQueryDB(version: String, query: String): Try[List[Map[String, Option[Any]]]] = {
    log.debug(s"Query : $query")
    try {
      val isSelectQry = List(SELECT_QRY).exists(initStmt => query.toUpperCase.startsWith(initStmt))
      if(!isSelectQry) throw new Exception("Only select query allowed!!!")
      val res = version match {
        case constants.VERTICA_VERSION => DBUtils.getSqlQueryData(query)
        case _ => DBUtils.getSqlQueryData(query)
      }
      Success(res)
    } catch {
      case ex: Exception =>
        log.error(s"Failed to query : $query : $ex")
        Failure(ex)
    }
  }

  def queryDB(version: String, sqlForm: SqlQueryForm): Try[List[Map[String, Option[Any]]]] = {
    try {
      val query = s"""${sqlForm.query}"""
      log.debug(s"Query : $query")
      sqlForm.action.toUpperCase() match {
        case SELECT_QRY => log.debug(s"Its a select query")
        case _ =>
          log.debug(s"Its a non-select query")
          throw new Exception("Only select query allowed!!!")
      }
      val isSelectQry = List(SELECT_QRY).exists(initStmt => sqlForm.query.toUpperCase.startsWith(initStmt))
      if(!isSelectQry) throw new Exception("Only select query allowed!!!")
      val res = version match {
        case constants.VERTICA_VERSION => DBUtils.getSqlQueryData(query)
        case _ => DBUtils.getSqlQueryData(query)
      }
      Success(res)
    } catch {
      case ex: Exception =>
        log.error(s"Failed to query : ${sqlForm.query} : $ex")
        Failure(ex)
    }
  }
}
