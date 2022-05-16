package models

import play.api.Logger

import models.query.ResultSet
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import com.datastax.driver.core._

object Analytics {
  val log = Logger("Model_Analytics")
  def sql(sqlStatement: String): ResultSet  = {
    log.debug(sqlStatement)   
    val rs = SparkDriver.cc.sqlContext.sql(sqlStatement)
    new ResultSet(rs)
  }

  def hql(hqlStatement: String): ResultSet  = {
    log.debug(hqlStatement)   
    val rs = SparkDriver.sparkSession.sql(hqlStatement)
    new ResultSet(rs)
  }
  
  def extractColValues(rows: List[Row]): List[Array[Any]] = {
    DS.extractColValues(rows)
  }
  
}
