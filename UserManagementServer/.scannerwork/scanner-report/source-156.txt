package models

import akka.actor.{ActorRef, ActorSystem, Props, Actor, Inbox, Terminated, ReceiveTimeout }
import akka.actor.AllForOneStrategy
import akka.actor.OneForOneStrategy
import akka.actor.SupervisorStrategy._
import akka.routing.{FromConfig, GetRoutees, AddRoutee, RemoveRoutee, Routees, ActorRefRoutee, Broadcast}
import akka.event.Logging
import akka.util.Timeout
import akka.pattern.ask

import com.datastax.driver.core.exceptions._
import scala.collection.immutable.ListMap
import scala.concurrent.duration._
import scala.concurrent._
import ExecutionContext.Implicits.global
import scala.language.postfixOps
import constants._
import org.joda.time._
import Utils._
import play.api.Logger

object Supervisor {
  val log = Logger("Model_Supervisor")
  sealed abstract class Message
  case class Read(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String]) extends Message
  case class Result(result: List[Array[Any]]) extends Message
  case class Aggr(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String], aggrList: List[(String, String, Option[String])], gCol: String, sortResult: List[Array[Any]], orderByOpt: Option[String])
  case class AggrResult(result: List[Map[String, List[(Any, Any)]]]) extends Message
}

class Supervisor(maxRetries: Int,  withinTimeSecs: Int, delayBetweenRetriesMillis: Int) extends Actor {
  import Supervisor._
  import Reader._

  val sStrategy = OneForOneStrategy(maxNrOfRetries = maxRetries, withinTimeRange = withinTimeSecs seconds) {
      case rt: ReadTimeoutException =>
        log.error(s"Read Timeout Exception caught in Supervisor:" + rt.getMessage())
        Restart
      case se: SyntaxError => 
        log.error(s"Syntax error exception caught in Supervisor:" + se.getMessage())
        Restart
      case iq: InvalidQueryException => 
        log.error(s"Invalid query exception caught in Supervisor:" + iq.getMessage())
        Restart
      case nh: NoHostAvailableException => 
        log.error(s"No Host Available exception caught in Supervisor:" + nh.getMessage())
        Restart
      case ue: UnavailableException => 
        log.error(s"Unavailable Exception caught in Supervisor:" + ue.getMessage())
        Restart
      case de: DriverException => 
        log.error(s"Driver Exception caught in Supervisor:" + de.getMessage())
        Restart
      case ex: Exception => 
        log.error(s"Exception caught in Supervisor:" + ex.getMessage())
        Restart
    }
  
  val ReaderRouter = context.actorOf(FromConfig(supervisorStrategy=sStrategy).props(Props(classOf[Reader], delayBetweenRetriesMillis, self)), "ReaderRouter")

  val log = Logging(context.system.eventStream, "Supervisor")
  
  var reqCounter = 0L
  var subReqCounter = 0L 

  ReaderRouter ! GetRoutees
  
  def nextReqId(): Long = {
    val retVal = reqCounter
    reqCounter += 1
    subReqCounter = 0
    retVal
  }

  def nextSubReqId(): Long = {
    val retVal = subReqCounter
    subReqCounter += 1
    retVal
  }
  
  def monthList(st: String, et: String): List[Long] = {
    val sDate = new DateTime(st, DateTimeZone.UTC)
    val eDate = new DateTime(et, DateTimeZone.UTC)
    val stYr = sDate.getYear()
    val endYr = eDate.getYear()
    val stMon = sDate.getMonthOfYear()
    val endMon = eDate.getMonthOfYear()
    val monList = if(stYr == endYr) {
      (for{ mon <- endMon to stMon by -1 
        
      } yield {
        val dt = s"$stYr-$mon-01T00:00:00Z"
        new DateTime(dt, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis()
      }).toList
    } else {
      val endMonList = (for { mon <- endMon to 1 by -1 } yield {
        val dt = s"$endYr-$mon-01T00:00:00Z"
        new DateTime(dt, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis()
      }).toList
      
      val stMonList = (for { mon <- 12 to stMon by -1} yield {
        val dt = s"$stYr-$mon-01T00:00:00Z"
        new DateTime(dt, DateTimeZone.UTC).withDayOfMonth(1).withTimeAtStartOfDay().getMillis()
      }).toList
      endMonList ++ stMonList
    }
    monList
  }
  
  def receive = {

    case Routees(routees) =>
      routees foreach {_ match {
        case arr: ActorRefRoutee => context.watch(arr.ref)
      }}
      
    case Read(mfr, prod, sch, ec, st, et, cols) =>
      val dates = monthList(st, et)
      val reqId = nextReqId()
      val subRequests = dates.map { dt =>
             val subReqId = nextSubReqId()
             ReaderRouter ! ReadPart(reqId, subReqId, mfr, prod, sch, ec, dt, cols) 
             subReqId
           }     
      PendingRequests.add(reqId, subRequests, sender)
      // context.setReceiveTimeout(receiveTimeoutMillis milliseconds) // NEED TO FIX THIS
    case ReadPartCompleted(reqId, subReqId, result) =>
      val receivedAllResponses = PendingRequests.processPartialResult(reqId, subReqId, result) 
      if(receivedAllResponses) {
        val (sender, data) = PendingRequests.getResult(reqId)
        PendingRequests.remove(reqId)
        sender ! Result(data)
      }
      
    case Aggr(mfr, prod, sch, ec, st, et, cols, aggrList, gCol, sortResult, orderByOpt) =>
      val reqId = nextReqId()
      val subRequests = aggrList.map { aggr =>
             val subReqId = nextSubReqId()
             ReaderRouter ! AggrPart(reqId, subReqId, cols, aggr, gCol, sortResult, orderByOpt) 
             subReqId
           }     
      PendingRequests.addPrAggr(reqId, subRequests, sender)
    
    case AggrPartCompleted(reqId, subReqId, result) =>
      val receivedAllResponses = PendingRequests.processPartialAggr(reqId, subReqId, result) 
      if(receivedAllResponses) {
        val (sender, data) = PendingRequests.getAggrResult(reqId)
        PendingRequests.removeprAggr(reqId)
        sender ! AggrResult(data)
      }        
  }
          
  
}


