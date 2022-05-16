package models

import java.sql.{Connection, DriverManager, PreparedStatement, ResultSet, SQLInvalidAuthorizationSpecException, SQLTransientConnectionException, Timestamp}
import java.util.Properties
import java.sql.Types
import java.sql.SQLException
import java.sql.Statement

import constants._
import dao.DBUtils.getClusterConfigForMps
import dao.vertica
import models.Settings.{VertClusterHost, VertClusterHostDetailsMPS}
import models.vUser.log
import org.joda.time.{DateTime, DateTimeZone}
import play.api.Logger
import play.api._
import play.api.Play.current


object DB {

val database = current.configuration.getString("rdb.name").getOrElse(
                        throw new RuntimeException("driver needs to be set in application.conf "))  

val log = Logger("Model_" + database)

val driver = current.configuration.getString("rdb.driver").getOrElse(
                        throw new RuntimeException("driver needs to be set in application.conf "))
val port = current.configuration.getString("rdb.port").getOrElse(
                        throw new RuntimeException("port needs to be set in application.conf "))

val host = current.configuration.getString("rdb.host").getOrElse(
                        throw new RuntimeException("host needs to be set in application.conf "))

val dbname = current.configuration.getString("rdb.dbname").getOrElse(
                        throw new RuntimeException("dbname  needs to be set in application.conf "))
val user = current.configuration.getString("rdb.user").getOrElse(
                        throw new RuntimeException("user  needs to be set in application.conf "))
val pass = current.configuration.getString("rdb.pass").getOrElse(
                        throw new RuntimeException("password needs to be set in application.conf "))


val prop = new Properties()
  prop.put("user", user)
  prop.put("password", pass)
  prop.put("BackupServerNode", "${host},${host}") /// to be uncommented and used to handle failover with single host
  var conn: Connection = null
  var url = "jdbc:" + database + "://" + host + ":" + port + "/" + dbname
  try {
    Class.forName(driver)
    //conn = DriverManager.getConnection(url, prop)
    //conn.setAutoCommit(false)
  } catch {
    case ex: Exception => log.error(s"Exception: " + ex.printStackTrace())
  }
  def results[T](resultSet: java.sql.ResultSet)(f: java.sql.ResultSet => T) = {
    new Iterator[T] {
      def hasNext = resultSet.next()
      def next() = f(resultSet)
    }
  }

  /**
    * It formultes the precompiled sql statement by populating the placeholders with actual values to avoid sql injections
    *
    * @param placeHolder: list of values to be populated, stmt object: which will set the passed values
    * @return true or false
    * @Example :>PreparedStatement stmt = conn.prepareStatement("select role from user where email=?");
    *           stmt.setString("demo@glassbeam.com")
    *          >PreparedStatement stmt = conn.prepareStatement("update user set role=?, validate=? where email=?");
    *           stmt.setString("test")
    *           stmt.setBoolean(true)
    *           stmt.setString("demo@glassbeam.com")
    */


  def bindQuery(placeHolder: List[Any],stmt: PreparedStatement): Boolean = {
    try {
      for (i <- placeHolder.indices) {
        if (placeHolder(i).getClass.getSimpleName.equalsIgnoreCase("Integer")) stmt.setInt(i + 1, placeHolder(i).asInstanceOf[Int])
        else if (placeHolder(i).getClass.getSimpleName.equalsIgnoreCase("Long")) stmt.setLong(i + 1, placeHolder(i).asInstanceOf[Long])
        else if (placeHolder(i).getClass.getSimpleName.equalsIgnoreCase("String")) stmt.setString(i + 1, placeHolder(i).asInstanceOf[String])
        else if (placeHolder(i).getClass.getSimpleName.equalsIgnoreCase("Boolean")) stmt.setBoolean(i + 1, placeHolder(i).asInstanceOf[Boolean])
        else if (placeHolder(i).getClass.getSimpleName.equalsIgnoreCase("Timestamp")) stmt.setTimestamp(i + 1, placeHolder(i).asInstanceOf[Timestamp])
        else stmt.setNull(i + 1, Types.NULL)
      }
      true
    } catch {
      case ex: Exception => {
        log.error(s"Error in binding the values , ex: $ex")
        false
      }
    }
  }

  /**
    * It returns ResultSet of only SELECT query
    * @param sqlStmnt: String => SQL query to be executed
    * @return ResultSet of sqlStmnt
    * @Example :
    * >val rows = DB.selectQueryResult(s"SELECT email, active FROM $KsUMS.$CFNUser;")
    * >rows: List[Map[String, Any]] = List(Map(email -> Some(xyz@glassbeam.com), active -> Some(true)), Map(email -> Some(abc@glassbeam.com), active -> Some(false)))
    */

  def selectQueryResult(sqlStmnt: String, placeHolder: List[Any]): List[Map[String, Option[Any]]] = {
    try {
      val sConn = DriverManager.getConnection(url, prop)
      try {
        val startTime = DateTime.now
        sConn.setAutoCommit(false)
        val stmt = sConn.prepareStatement(sqlStmnt)
        val bindRes = if(placeHolder.length > 0) bindQuery(placeHolder, stmt) else true
        if(bindRes) {
          val rs: ResultSet = stmt.executeQuery()
          val endTime = DateTime.now
          log.info(s"Vertica Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + sqlStmnt)
          val columnCnt: Int = rs.getMetaData.getColumnCount
          val columns: IndexedSeq[String] = 1 to columnCnt map rs.getMetaData.getColumnName
          var colTypeMapping = Map[String, String]()
          columns.zipWithIndex.foreach {
            case (value, index) => colTypeMapping += (value -> rs.getMetaData.getColumnTypeName(index + 1).toLowerCase)
            case _ => colTypeMapping
          }
          var resultSet = List[Map[String, Option[Any]]]()
          while (rs.next()) {
            if(!rs.isClosed()) {
              var rowData = Map[String, Option[Any]]()
              columns.zipWithIndex.foreach {
                case (value, index) => rowData += (value -> models.Utils.getValueForDSRelationalColumn(rs, colTypeMapping, value))
                case _ => rowData
              }
              resultSet = resultSet ++ List(rowData)
            } else{
              log.error(s"ResultSet closed during loop")
            }
          }
          rs.close()
          stmt.close()
          resultSet
        } else {
           List()
        }

      } catch {
        case ex: Exception => {
          log.error(s"Error while fetching query: {$sqlStmnt} , ex: $ex")
          List()
        }
      } finally {
          try {
            if (sConn != null) sConn.close()
          }catch {
            case se: SQLException =>
              log.error(s"SQL Exception" + se.printStackTrace())
          }
        }
      }
      catch {
        case connException: SQLTransientConnectionException => {
          log.error(s"Network Connection Exception:" + connException.getMessage())
          List()
        }
        case authException: SQLInvalidAuthorizationSpecException => {
          log.error(s"Database Login Exception:" + authException.getMessage())
          List()
        }
      }
  }

  /**
    * It returns ResultSet of only INSERT query
    * @param sqlStmnt: String => SQL query to be executed
    * @return ResultSet of sqlStmnt
    * @Example :
    * >val res = DB.insertQueryResult(s"INSERT Query")
    * >res: Option[String] = Some("")/None
    */
  def insertQueryResult(sqlStmnt: String,placeHolder: List[Any]): Option[String] = {
    try {
      val sConn = DriverManager.getConnection(url, prop)
      try {
        val startTime = DateTime.now
        sConn.setAutoCommit(false)
        val stmt = sConn.prepareStatement(sqlStmnt)
        val bindRes = if (placeHolder.length > 0) bindQuery(placeHolder, stmt) else true
        if (bindRes) {
          stmt.executeUpdate()
          val endTime = DateTime.now
          log.info(s"Vertica Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + sqlStmnt)
          sConn.commit()
          stmt.close()
          Some("")
        } else {
          sConn.rollback()
          Some(SQL_ERROR)
        }
      } catch {
        case ex: Exception => {
          sConn.rollback()
          log.error(s"Error while insert query: {$sqlStmnt} , ex: $ex")
          Some(SQL_ERROR)
        }
      } finally {
        try {
          if (sConn != null) sConn.close()
        } catch {
          case se: SQLException =>
            log.error(s"SQL Exception" + se.printStackTrace())
        }
      }
    }
    catch {
      case connException: SQLTransientConnectionException => {
        log.error(s"Network Connection Exception:" + connException.getMessage())
        Some(SQL_ERROR)
      }
      case authException: SQLInvalidAuthorizationSpecException => {
        log.error(s"Database Login Exception:" + authException.getMessage())
        Some(SQL_ERROR)
      }
    }
  }

  /**
    * It returns ResultSet of only UPDATE query
    * @param sqlStmnt: String => SQL query to be executed
    * @return ResultSet of sqlStmnt
    * @Example :
    * >val res = DB.updateQueryResult(s"UPDATE Query")
    * >res: Option[String] = Some("")/None
    */
  def updateQueryResult(sqlStmnt: String,placeHolder: List[Any]): Option[String] = {
    try {
      val sConn = DriverManager.getConnection(url, prop)
      try{
        val startTime = DateTime.now
        sConn.setAutoCommit(false)
        val stmt = sConn.prepareStatement(sqlStmnt)
        val bindRes = if(placeHolder.length > 0) bindQuery(placeHolder, stmt) else true
        if(bindRes) {
          stmt.executeUpdate()
          val endTime = DateTime.now
          log.info(s"Vertica Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + sqlStmnt)
          sConn.commit()
          stmt.close()
          Some("")
        } else {
          sConn.rollback()
          Some(SQL_ERROR)
        }
      } catch {
        case ex: Exception => {
          sConn.rollback()
          log.error(s"Error while update query: {$sqlStmnt} , ex: $ex")
          Some(SQL_ERROR)
        }
      } finally {
        try {
          if (sConn != null) sConn.close()
        }catch {
          case se: SQLException =>
            log.error(s"SQL Exception:" + se.printStackTrace())
        }
      }
    }
    catch {
      case connException: SQLTransientConnectionException => {
        log.error(s"Network Connection Exception:" + connException.getMessage())
        Some(SQL_ERROR)
      }
      case authException: SQLInvalidAuthorizationSpecException => {
        log.error(s"Database Login Exception:" + authException.getMessage())
        Some(SQL_ERROR)
      }
    }
 }

  /**
    * It returns ResultSet of only DELETE query
    * @param sqlStmnt: String => SQL query to be executed
    * @return ResultSet of sqlStmnt
    * @Example :
    * >val res = DB.deleteQueryResult(s"DELETE Query")
    * >res: Option[String] = Some("")/None
    */
  def deleteQueryResult(sqlStmnt: String,placeHolder: List[Any]): Option[String] = {
    try {
      val sConn = DriverManager.getConnection(url, prop)
      try{
        val startTime = DateTime.now
        sConn.setAutoCommit(false)
        val stmt = sConn.prepareStatement(sqlStmnt)
        val bindRes = if(placeHolder.length > 0) bindQuery(placeHolder, stmt) else true
        if(bindRes) {
          stmt.executeUpdate()
          val endTime = DateTime.now
          log.info(s"Vertica Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + sqlStmnt)
          sConn.commit()
          stmt.close()
          Some("")
        }else{
          sConn.rollback()
          Some(SQL_ERROR)
        }
      } catch {
        case ex: Exception => {
          sConn.rollback()
          log.error(s"Error while delete query: {$sqlStmnt} , ex: $ex")
          Some(SQL_ERROR)
        }
      } finally {
        try {
          if (sConn != null) sConn.close()
        }catch {
          case se: SQLException =>
            log.error(s"SQL Exception" + se.printStackTrace())
        }
      }
    }
    catch {
      case connException: SQLTransientConnectionException => {
        log.error(s"Network Connection Exception:" + connException.getMessage())
        Some(SQL_ERROR)
      }
      case authException: SQLInvalidAuthorizationSpecException => {
        log.error(s"Database Login Exception:" + authException.getMessage())
        Some(SQL_ERROR)
      }
    }
 }
  def selectClusterQueryResult(clusterHostDetails: VertClusterHostDetailsMPS, sqlStmnt: String, placeHolder: List[Any]): List[Map[String, Option[Any]]] = {
    val cId = clusterHostDetails.clusterId
    val clusterConfig = VertClusterHost(clusterHostDetails.clusterId, clusterHostDetails.verticaHosts, clusterHostDetails.verticaPort, clusterHostDetails.verticaDb, clusterHostDetails.username, clusterHostDetails.password)
    val cprop = new Properties()
    val hosts = clusterConfig.verticaHosts
    val hostList = hosts.split(",").toList
    val hostsSize = hostList.size
    cprop.put("user", clusterConfig.username)
    cprop.put("password", clusterConfig.password)
    if(hostsSize == 2)
      cprop.put("BackupServerNode", s"${hostList(1)}")
    if(hostsSize == 3)
      cprop.put("BackupServerNode", s"${hostList(1)},${hostList(2)}")
    var url = "jdbc:" + database + "://" + hostList.head + ":" + clusterConfig.verticaPort + "/" + clusterConfig.verticaDb
    try {
      val sConn = DriverManager.getConnection(url, cprop)
      try {
        val startTime = DateTime.now
        sConn.setAutoCommit(false)
        val stmt = sConn.prepareStatement(sqlStmnt)
        val bindRes = if(placeHolder.length > 0) bindQuery(placeHolder, stmt) else true
        if(bindRes) {
          val rs: ResultSet = stmt.executeQuery()
          val endTime = DateTime.now
          log.info(s"Vertica Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + sqlStmnt)
          val columnCnt: Int = rs.getMetaData.getColumnCount
          val columns: IndexedSeq[String] = 1 to columnCnt map rs.getMetaData.getColumnName
          var colTypeMapping = Map[String, String]()
          columns.zipWithIndex.foreach {
            case (value, index) => colTypeMapping += (value -> rs.getMetaData.getColumnTypeName(index + 1).toLowerCase)
            case _ => colTypeMapping
          }
          var resultSet = List[Map[String, Option[Any]]]()
          while (rs.next()) {
            if(!rs.isClosed()) {
              var rowData = Map[String, Option[Any]]()
              columns.zipWithIndex.foreach {
                case (value, index) => rowData += (value -> models.Utils.getValueForDSRelationalColumn(rs, colTypeMapping, value))
                case _ => rowData
              }
              resultSet = resultSet ++ List(rowData)
            } else{
              log.error(s"ResultSet closed during loop")
            }
          }
          rs.close()
          stmt.close()
          resultSet
        } else {
          List()
        }

      } catch {
        case ex: Exception => {
          log.error(s"Error while fetching query: {$sqlStmnt} , ex: $ex")
          List()
        }
      } finally {
        try {
          if (sConn != null) sConn.close()
        }catch {
          case se: SQLException =>
            log.error(s"SQL Exception" + se.printStackTrace())
        }
      }
    }
    catch {
      case connException: SQLTransientConnectionException => {
        log.error(s"Network Connection Exception:" + connException.getMessage())
        List()
      }
      case authException: SQLInvalidAuthorizationSpecException => {
        log.error(s"Database Login Exception:" + authException.getMessage())
        List()
      }
    }
  }
}


