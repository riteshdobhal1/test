package models

import com.datastax.driver.core._
import com.datastax.driver.core.policies._
import com.datastax.driver.core.exceptions._

import play.api.Logger
import play.api.Play
import org.joda.time._
import org.joda.time.format._
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import constants._
import Utils._
import play.api.Play.current
import scala.collection.concurrent.TrieMap
import scala.util.{Try, Success, Failure}
import com.google.common.util.concurrent.{FutureCallback, Futures, ListenableFuture}
import scala.concurrent.{Await, Future, Promise}
import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.ActorSystem
import scala.util.control.NonFatal
import scala.concurrent.duration._

trait CassandraHandleError  {
  val log = Logger("Model_DS")
  def error(ex: Throwable, error: String): Unit = {
    ex match {
      case nhae: NoHostAvailableException =>
        nhae.getErrors.asScala.foreach { case (inetSocketAddress, throwable) =>
          log.error(s"Exception: NoHostAvailableException with host ${inetSocketAddress.getAddress.getHostAddress} ex: ${throwable.getLocalizedMessage}")
          
        }
      case rte:  ReadTimeoutException => 
        log.error(s"Exception: ReadTimeOutException, data present = ${rte.wasDataRetrieved()} ex: ${rte.getLocalizedMessage}")
      case wte:  WriteTimeoutException =>
        log.error(s"Exception: WriteTimeoutException, write type = ${wte.getWriteType} ex: ${wte.getLocalizedMessage}")
      case ue:   UnavailableException =>
        log.error(s"Exception: UnavailableException, required replicas = ${ue.getRequiredReplicas}, alive replicas = ${ue.getAliveReplicas} with consistency ${ue.getConsistencyLevel} ex: ${ue.getLocalizedMessage}")
      case otoe: OperationTimedOutException => 
        log.error(s"Exception: OperationTimedOutException, ex: ${otoe.getLocalizedMessage}")
      case other => 
        log.error(s"Exeception ex: " + other.getLocalizedMessage)
    }
  }
}

object DS extends CassandraHandleError {
  val cSeeds = Play.configuration.getStringList("dx.cassandraSeeds").get.asScala
  val cDriverReadTimeoutMs = Play.current.configuration.getInt("dx.driverReadTimeOutMs").getOrElse(10000)
  val cDriverConnectTimeoutMs = Play.current.configuration.getInt("dx.driverConnectTimeOutMs").getOrElse(5000)
  val cDriverReconnectBaseDelayMs = Play.current.configuration.getInt("dx.driverReconnectBaseDelaySecs").getOrElse(1000)
  val cDriverReconnectMaxDelayMs = Play.current.configuration.getInt("dx.driverReconnectMaxDelayMs").getOrElse(60000)
  val cReadConsistencyLevel = Play.current.configuration.getString("dx.readConsistencyLevel").getOrElse("ONE").toUpperCase()
  val cDriverTcpNoDelay = Play.current.configuration.getBoolean("dx.driverTcpNoDelay").getOrElse(true)
  val cDriverProtocolVersion = Play.current.configuration.getInt("dx.driverProtocolVersion").getOrElse(3)
  val cFetchSize = Play.current.configuration.getInt("dx.fetchSize").getOrElse(500)
  val cCoreConnectionsPerHostLocal = Play.current.configuration.getInt("dx.coreConnectionsPerHostLocal").getOrElse(2)
  val cCoreConnectionsPerHostRemote = Play.current.configuration.getInt("dx.coreConnectionsPerHostRemote").getOrElse(2)
  val cMaxConnectionsPerHostLocal = Play.current.configuration.getInt("dx.maxConnectionsPerHostLocal").getOrElse(8)
  val cMaxConnectionsPerHostRemote = Play.current.configuration.getInt("dx.maxConnectionsPerHostRemote").getOrElse(8)
  val cMaxRequestsPerConnectionLocal = Play.current.configuration.getInt("dx.maxRequestsPerConnectionLocal").getOrElse(1)
  val cMaxRequestsPerConnectionRemote = Play.current.configuration.getInt("dx.maxRequestsPerConnectionRemote").getOrElse(1)
  val cNewConnectionThresholdLocal = Play.current.configuration.getInt("dx.newConnectionThresholdLocal").getOrElse(800)
  val cNewConnectionThresholdRemote = Play.current.configuration.getInt("dx.newConnectionThresholdRemote").getOrElse(200)
  
  val cReadRetries = Play.current.configuration.getInt("dx.readRetries").getOrElse(5)
  val cReadRetriesWithinTimeMin = Play.current.configuration.getInt("dx.readRetriesWithinTimeMin").getOrElse(1)
  val cReadDelayWithinBetweenRetriesSecs = Play.current.configuration.getInt("dx.readDelayBetweenRetriesSecs").getOrElse(15)
  
  val consistencyLevel = cReadConsistencyLevel match {
    case "ONE" => ConsistencyLevel.ONE
    case "TWO" => ConsistencyLevel.TWO
    case "THREE" => ConsistencyLevel.THREE
    case "ALL" => ConsistencyLevel.ALL
    case _ => ConsistencyLevel.QUORUM
  }
  
  val protocolVersion = cDriverProtocolVersion match {
    case 2 => ProtocolVersion.V2
    case 3 => ProtocolVersion.V3
  }
  
  val socketOptions = new SocketOptions()
                        .setConnectTimeoutMillis(cDriverConnectTimeoutMs)
                        .setReadTimeoutMillis(cDriverReadTimeoutMs)
  
  val poolingOptions = new PoolingOptions()
                         .setCoreConnectionsPerHost(HostDistance.LOCAL, cCoreConnectionsPerHostLocal)
                         .setCoreConnectionsPerHost(HostDistance.REMOTE, cCoreConnectionsPerHostRemote)
                         .setMaxConnectionsPerHost(HostDistance.LOCAL, cMaxConnectionsPerHostLocal)
                         .setMaxConnectionsPerHost(HostDistance.REMOTE, cMaxConnectionsPerHostRemote)
                         .setMaxRequestsPerConnection(HostDistance.LOCAL, cMaxRequestsPerConnectionLocal)
                         .setMaxRequestsPerConnection(HostDistance.REMOTE, cMaxRequestsPerConnectionRemote)
                         .setNewConnectionThreshold(HostDistance.LOCAL, cNewConnectionThresholdLocal)
                         .setNewConnectionThreshold(HostDistance.REMOTE, cNewConnectionThresholdRemote)

  val queryOptions = new QueryOptions()
                       .setConsistencyLevel(consistencyLevel)
                       .setFetchSize(cFetchSize)
                       
  val cluster = Cluster.builder()
                                 .addContactPoints(cSeeds: _*)
                  .withProtocolVersion(protocolVersion)
                  .withQueryOptions(queryOptions)
                                 .withLoadBalancingPolicy(new TokenAwarePolicy(new RoundRobinPolicy()))
                                 .withRetryPolicy(new LoggingRetryPolicy(DefaultRetryPolicy.INSTANCE))
                  .withReconnectionPolicy(new ExponentialReconnectionPolicy(cDriverReconnectBaseDelayMs, cDriverReconnectMaxDelayMs))
                  .withSocketOptions(socketOptions)
                  .withPoolingOptions(poolingOptions)
                                 .build()
                               
  val session: com.datastax.driver.core.Session = cluster.connect()
  
  private lazy val factor: Float = 2.0f 
  private lazy val initCur: Int = 1
  //val log = Logger("Model_DS")
  val AddnlCols = 0
  log.info("Initializing Cassandra Client..")

  private val clusterCache = TrieMap[Cluster, TrieMap[String, PreparedStatement]]()
  
  private def get(cluster: Cluster, query: String): Option[PreparedStatement] =
    for (statementCache <- clusterCache.get(cluster);
         statement <- statementCache.get(query)) yield statement

  private def put(cluster: Cluster, query: String, statement: PreparedStatement): PreparedStatement = {
    clusterCache.get(cluster) match {
      case Some(statementCache) => statementCache.put(query, statement)
      case None => clusterCache.put(cluster, TrieMap(query -> statement))
    }
    statement
  }
  
  def init() = {
    
  }
  
  def createPreparedStatement(cqlStatement: String) : PreparedStatement = {
    val cluster = session.getCluster()
    get(cluster, cqlStatement) match {
      case Some(stmt) => stmt
      case None =>
        synchronized {
          get(cluster, cqlStatement) match {
            case Some(stmt) => stmt
            case None =>
              val stmt = session.prepare(cqlStatement)
              put(cluster, cqlStatement, stmt)
          }
        }
    }
  }
  
  def execute(statement: Statement, cqlStmt: Option[String] = None, retryCounter: Int = 0, cur: Int = 0): Future[ResultSet] = {
    lazy val msg = s"cql statement: ${cqlStmt.getOrElse(s"its a prepared stmt reading from keyspace = ${statement.getKeyspace}")}"
    val resultSetFuture = session.executeAsync(statement)
    try {
      log.debug(msg)
      val resultSet = resultSetFuture.get(cDriverReadTimeoutMs, java.util.concurrent.TimeUnit.MILLISECONDS)
      Future(resultSet)
    } catch {
      case NonFatal(ex) => 
        if(retryCounter < cReadRetries) {
          val next: Int = if (cur == 0 ) initCur else Math.ceil(cur * factor).toInt
          akka.pattern.after(next.milliseconds, Controller.actorSystem.scheduler)(Future.successful(1)).flatMap {
            _ =>
              log.info(s"retrying after $next millisec. retry counter = $retryCounter. $msg. exception = ${ex.getLocalizedMessage}")
              execute(statement, cqlStmt, retryCounter + 1, next)
          }
        } else {
          val err = s"Giving up after ${cReadRetries} retries and ${Math.ceil(cur * factor).toInt} millisec. $msg"
          ex.printStackTrace()
          error(ex, err)
          Future.failed(new Exception(err))
        }
    }
  }
 
  def cqlExecuteBoundStmnt(statement: BoundStatement): ResultSet = {
    log.debug(s"Going to execute statement : " + statement.preparedStatement().getQueryString())
    val future = execute(statement, None)
    Await.result(future, scala.concurrent.duration.Duration.Inf)
  }
  
  def cqlExecute(cqlStatement: String): ResultSet = {
      log.debug(s"cql statement: $cqlStatement")
      val startTime = DateTime.now
      //val result = session.execute(new SimpleStatement(cqlStatement))
      val future = execute(new SimpleStatement(cqlStatement), Some(cqlStatement))
      val result = Await.result(future, scala.concurrent.duration.Duration.Inf)
      val endTime = DateTime.now
      log.info(s"Cassandra Response Time in milliseconds: " + Utils.responseTime(startTime, endTime) + "  Query: " + cqlStatement)
      result
  }
  
  def monitorUMS(): Try[Any] = {
    val cql = s"SELECT * FROM $KsUMS.$CFNUser limit 1;"
    try {
      val rows = cqlExecute(cql).asScala.toList
      Success("Ok")
    } catch {
      case ex: Exception => {
        log.error(s"Exception for UMS monitor API: $ex")
        Failure(ex)
      }
    }
  }
  
  def extractColValues(rows: List[Row]): List[Array[Any]]= {
    val firstRow = rows.head
    val colDefns = firstRow.getColumnDefinitions()
    val cols = colDefns map { colDef => colDef.getName()}
    val numColumns = cols.size
    var acc = List[Array[Any]]()
    for(row <- rows) {
      val rowData = Array.ofDim[Any](numColumns+AddnlCols)
      var index = 0
      for ( colName <- cols ) {
        rowData(index) = models.Utils.getValForCol(row, colName) getOrElse(null)
        index += 1
      }
      acc = rowData :: acc
    }
    acc
  }
  
  def queryAndExtract(cols: List[String], query: BoundStatement): List[Array[Any]] = {  
    val numColumns = cols.size
    val rows = cqlExecuteBoundStmnt(query).asScala.toList
    var acc = List[Array[Any]]()
    for(row <- rows) {
      val rowData = Array.ofDim[Any](numColumns+AddnlCols)
      var index = 0
      for ( colName <- cols ) {
        rowData(index) = models.Utils.getValForCol(row, colName) getOrElse(null)
        index += 1
      }
      acc = rowData :: acc
    }
    acc
  }

}
