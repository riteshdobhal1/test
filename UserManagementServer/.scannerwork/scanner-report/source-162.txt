package models

import akka.actor.{ActorRef, ActorSystem, Props, Actor, ActorLogging, Inbox, Terminated, SupervisorStrategy, ReceiveTimeout }
import akka.event.Logging
import com.datastax.driver.core.exceptions._
import com.datastax.driver.core.{ResultSet, Row, BoundStatement, PreparedStatement}
import scala.collection.immutable.ListMap
import scala.concurrent.duration._
import scala.concurrent._
import scala.language.postfixOps
import org.joda.time._
import org.joda.time.format
import java.util.Date
import play.api.Logger
import constants._
import Utils._

object Reader {
  sealed abstract class Message
  case class ReadPart(reqId: Long, subReqId: Long, mfr: String, prod: String, sch: String, ec: String, dt: Long, cols: List[String]) extends Message
  case class ReadPartCompleted(reqId: Long, subReqId: Long, data: List[Array[Any]]) extends Message
  case class AggrPart(reqId: Long, subReqId: Long, 
      cols: List[String], aggr: (String, String, Option[String]), gCol: String, sortResult: List[Array[Any]], orderByOpt: Option[String])
  case class AggrPartCompleted(reqId: Long, subReqId: Long, data: Map[String, List[(Any, Any)]]) extends Message
}

class Reader(delayBetweenRetriesMillis: Int, supervisor: ActorRef) extends Actor {
  import Reader._
  val log = Logging(context.system.eventStream, "Model_Reader")
  def createSelectCql(mfr: String, prod: String, sch: String, ec: String, dt: Long, cols: Iterable[String]): BoundStatement = {
    val colNames = cols.mkString(",")
    val q = s"SELECT $colNames FROM $KsUMS.$CFNUserActivity WHERE mfr=? AND prod=? AND sch=? AND ec=? AND month=?;"
    val ps = DS.createPreparedStatement(q)
    new BoundStatement(ps).bind(mfr, prod, sch, ec, Long.box(dt))
  }
  
  def receive = {
      
    case ReadPart(reqId, subReqId, mfr, prod, sch, ec, dt, cols) =>
      val query = createSelectCql(mfr, prod, sch, ec, dt, cols)
      val data = DS.queryAndExtract(cols, query)
      supervisor ! ReadPartCompleted(reqId, subReqId, data)  
      
    case AggrPart(reqId, subReqId, cols, aggr, gCol, sortResult, orderByOpt) =>
      val data = aggr._1 match {
        case "sum" => UserTrackingTable.sumGroupBy(cols, aggr._2, gCol, sortResult) 
        case "avg" => UserTrackingTable.avgGroupBy(cols, aggr._2, gCol, sortResult)
        case "min" => UserTrackingTable.minGroupByMultipleAggr(cols, aggr._2, gCol, sortResult)
        case "max" => UserTrackingTable.maxGroupByMultipleAggr(cols, aggr._2, gCol, sortResult)
        case "count" => UserTrackingTable.countGroupBy(cols, aggr._2, gCol, sortResult)
      }
      val aggrFun = aggr._1 + "(" + aggr._2 + ")"
      val (sCol, asc) = orderByOpt match {
        case Some(s) =>
          SortbyParsers(s)
        case None =>
          ("", false)
      }
      val dataSort = data.sortWith((x, y) => {
        val result = x._1 match {
          case fs: String => fs < y._1.asInstanceOf[String]
          case fi: Int => fi < y._1.asInstanceOf[Int]
          case fl: Long => fl < y._1.asInstanceOf[Long]
          case ff: Float => ff < y._1.asInstanceOf[Float]
          case fd: Double => fd < y._1.asInstanceOf[Double]
        }
        if (asc) result else !result
      })
      val mappedData = Map(aggrFun -> dataSort)
      
      supervisor ! AggrPartCompleted(reqId, subReqId, mappedData)
    
  }
    
  override def preRestart(reason: Throwable, message: Option[Any]) {
  import context.dispatcher

    message match {
      case Some(ReadPart(reqId, subReqId, mfr, prod, sch, ec, dt, cols)) =>
        reason match {
         case _: NoHostAvailableException => 
            log.error(s"C* No Host available exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
         case _: UnavailableException => 
            log.error(s"C* Unavailable exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
         case _: ReadTimeoutException =>
            log.error(s"C* read timeout exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
         case _: SyntaxError =>
            log.error(s"C* syntax error exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
         case _: InvalidQueryException => 
            log.error(s"C* Invalid qQery exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
         case _: DriverException => 
            log.error(s"C* Driver exception, reqId: $reqId, subReqId: $subReqId, mfr: $mfr, prod: $prod, sch: $sch, ec: $ec, dt: $dt, cols: $cols")
        }
      case x =>
           log.error(s"Exception occurred while parallel read: " + reason.getMessage())
    }
    super.preRestart(reason, message)
  }
  
  
}

