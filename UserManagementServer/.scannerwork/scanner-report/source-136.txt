package models

import scala.util.{Try, Success, Failure}
import scala.util.control.ControlThrowable
import scala.util.control.Exception._

import play.api.Logger
import play.api._
import play.api.mvc._

import scala.language.postfixOps
import com.datastax.driver.core.{ResultSet, Row, BoundStatement}
import collection.JavaConversions._

import org.joda.time._
import org.joda.time.format._

import constants._
import Utils._


object UserTrackingTable {
  val log = Logger("Model_UserTrackingTable")

 /** Returns time-series values of named columns from a given name space in a table format
  *  cols list should not be empty
  */  
  val fmt = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZoneUTC()
  
  def getRawData(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String]) : List[Array[Any]] = {
    Controller.parallelRead(mfr, prod, sch, ec, st, et, cols)
  }
  
  def dataTable(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String]): Table  = {
    val rawData = getRawData(mfr, prod, sch, ec, st, et, cols)
    new models.Table(cols, rawData)
  }
  
  def where(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String],
    filterList:List[(String, String, String)]): List[Array[Any]]  = {
    val data= dataTable(mfr, prod, sch, ec, st, et, cols)
    data.where(data,filterList,cols)
  } 
  
  def sort(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String],
    colName: String, asc: Boolean, filterResult: List[Array[Any]]): List[Array[Any]]  = {
    if(filterResult.length == 0){
      dataTable(mfr, prod, sch, ec, st, et, cols).sortBy(colName, asc)
    } else {
      new models.Table(cols, filterResult).sortBy(colName, asc)
    }
  }
  
  def sumGroupBy(cols: List[String], colName: String, groupByCol: String, sortResult: List[Array[Any]]): List[(Any, Double)]  = {
      new models.Table(cols, sortResult).sumGroupBy(colName, groupByCol)
  }
  
  def avgGroupBy(cols: List[String], colName: String, groupByCol: String, sortResult: List[Array[Any]]): List[(Any, Double)]  = {
      new models.Table(cols, sortResult).avgGroupBy(colName, groupByCol)
  }
  
  def minGroupByMultipleAggr(cols: List[String], colName: String, groupByCol: String, sortResult: List[Array[Any]]): List[(Any, Any)]  = {
      new models.Table(cols, sortResult).minGroupByMultipleAggr(colName, groupByCol, cols)
  }
  
  def maxGroupByMultipleAggr(cols: List[String], colName: String, groupByCol: String, sortResult: List[Array[Any]]): List[(Any, Any)]  = {
      new models.Table(cols, sortResult).maxGroupByMultipleAggr(colName, groupByCol, cols)
  }
  
  def countGroupBy(cols: List[String], colName: String, groupByCol: String, sortResult: List[Array[Any]]): List[(Any, Int)]  = {
      new models.Table(cols, sortResult).countGroupBy(colName, groupByCol)
  }
  
  def sum(cols: List[String], colName: String, sortResult: List[Array[Any]]): Double  = {
      new models.Table(cols, sortResult).sum(colName)
  }
  
  def avg(cols: List[String], colName: String, sortResult: List[Array[Any]]): Double  = {
      new models.Table(cols, sortResult).avg(colName)
  }
  
  def min(cols: List[String], colName: String, sortResult: List[Array[Any]]): Array[Any]  = {
      new models.Table(cols, sortResult).min(colName)
  }
  
  def max(cols: List[String], colName: String, sortResult: List[Array[Any]]): Array[Any]  = {
      new models.Table(cols, sortResult).max(colName)
  }
  
  def count(cols: List[String], colName: String, sortResult: List[Array[Any]]): Int  = {
      new models.Table(cols, sortResult).count(colName)
  }
}


