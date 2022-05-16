package models

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.cassandra.CassandraSQLContextFunctions
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql._

import scala.collection.JavaConverters._

import play.api.Play.current
import play.api.{Logger, Play}

import scala.collection.JavaConverters._

case class C2H(sqlTable: String, cKeyspace: String, cTable: String)

object SparkDriver {
  val log = Logger("Model_SparkDriver")
    
  val sparkConfObjects = current.configuration.getConfigList("spark-conf").getOrElse(
                     throw new RuntimeException("spark.conf must be set in application.conf "))
  val sparkConfs = sparkConfObjects.asScala.toList.map{ sparkConfigObject => 
                   (sparkConfigObject.getString("name").get, sparkConfigObject.getString("value").get)
               }                   
  val sparkJars = current.configuration.getStringList("spark.jars").getOrElse(
                     throw new RuntimeException("spark.jars must be set in application.conf ")).asScala.toList
  val hiveMsConfig = current.configuration.getConfig("hive-metastore").getOrElse(
                     throw new RuntimeException("hive-metastore must be set in application.conf "))
                     
  val KsTblSep = hiveMsConfig.getString("keyspace_table_separator").get

  val doNotRegisterConf = hiveMsConfig.getConfig("do-not-register").getOrElse(
                     throw new RuntimeException("do-not-register must be set in application.conf "))
                                          
  val systemKeyspaces = doNotRegisterConf.getStringList("system_keyspaces").get.asScala.toList
  val userKeyspacesDoNotRegister = doNotRegisterConf.getStringList("user_keyspaces").get.asScala.toList
  val tablesDoNotRegister = doNotRegisterConf.getStringList("tables").get.asScala.toList
   
  log.info(s"SparkContext will be initialized with these Spark configuation properties: $sparkConfs")                     
  log.info(s"SparkContext will be initialized with these jars: $sparkJars")
  val sparkConfsMap = sparkConfs.toMap
  val sparkConf = new SparkConf(true).setAll(sparkConfs).setJars(sparkJars)
  val appName = sparkConfsMap.getOrElse("spark.app.name", "ums")
  val sparkMaster = sparkConfsMap.getOrElse("spark.master", "local[*]")
  
  val sparkSession = SparkSession.builder
                     .appName(appName)
                     .master(sparkMaster)
                     .enableHiveSupport
                     .config(sparkConf)
                     .getOrCreate
                     
  import sparkSession.implicits._
  val sparkContext = sparkSession.sparkContext
  val sqlContext = sparkSession.sqlContext
  var cc = new CassandraSQLContextFunctions(sqlContext)

  def init() = {
    log.info(s"Initializing SparkDriver")
    getCassTables(sparkContext).foreach { t =>
      val df = sqlContext.read
                          .format("org.apache.spark.sql.cassandra")
                          .options(Map( "table" -> t.cTable, "keyspace" -> t.cKeyspace))
                          .load()
      df.createOrReplaceTempView(t.sqlTable)
    }
  }

  def getCassTables(sparkContext: SparkContext): List[C2H] = {
    val cc = CassandraConnector(sparkContext.getConf)
    val keyspaces = cc.withSessionDo { session => session.getCluster.getMetadata.getKeyspaces()}
    val usefulKeyspaces = keyspaces.asScala.toList.filter { ks => !ignoreKeyspace(ks.getName())}
    usefulKeyspaces.flatMap { ks =>
      val cKeyspace = ks.getName()
      val tbls = ks.getTables.asScala.toList
      val usefulTbls = tbls.filter {tbl => !ignoreTable(tbl.getName())}
      usefulTbls.map{ tbl =>
        val cTable = tbl.getName()
        val sqlTable = cKeyspace + KsTblSep + cTable
        C2H(sqlTable, cKeyspace, cTable)                             
      }
    }
  }
  
  def ignoreKeyspace(name: String): Boolean = {
       systemKeyspaces.contains(name) || userKeyspacesDoNotRegister.contains(name)
  }

  def ignoreTable(name: String): Boolean = {
       tablesDoNotRegister.contains(name) 
  }
     
  def shutdown(): Unit = {
    sparkSession.stop
  }
  
  def refreshSpark(): Unit = {
    cc = new CassandraSQLContextFunctions(sqlContext)
  }
          
}
