package models

import akka.actor.{ActorRef, ActorSystem, Props, Actor, Inbox, Terminated, SupervisorStrategy, ReceiveTimeout }
import akka.event.Logging
import scala.collection.immutable.ListMap
import scala.concurrent.duration._
import scala.concurrent._ 
import constants._
import play.api.Play

object Controller {
  
  val ActorSystemName = "ParallelReads"
  val SupervisorName = "Supervisor"
  val TimeoutSecs = Play.current.configuration.getInt("pr.TimeoutSecs").getOrElse(60)
  val MaxRetries = Play.current.configuration.getInt("pr.MaxRetries").getOrElse(3)
  val WithinTimeSecs = Play.current.configuration.getInt("pr.WithinTimeSecs").getOrElse(2)
  val DelayBetweenRetriesMillis = Play.current.configuration.getInt("pr.DelayBetweenRetriesMillis").getOrElse(500)

  val actorSystem = ActorSystem(ActorSystemName)
  val log = Logging(actorSystem.eventStream, "Controller")
  val supervisor = actorSystem.actorOf(Props(classOf[Supervisor], MaxRetries, WithinTimeSecs, DelayBetweenRetriesMillis), SupervisorName)
  
  def init(): Unit = {
    
  }

  def parallelAggr(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String], aggrList: List[(String, String, Option[String])],
      gCol: String, sortResult: List[Array[Any]], orderByOpt: Option[String]) : List[Map[String, List[(Any, Any)]]] = {
    import Supervisor._
    
    val inbox = Inbox.create(actorSystem)
    inbox.send(supervisor, Aggr(mfr, prod, sch, ec, st, et, cols, aggrList, gCol, sortResult, orderByOpt))
    
    val AggrResult(data) = inbox.receive(TimeoutSecs.seconds)
    data
  }

  def parallelRead(mfr: String, prod: String, sch: String, ec: String, st: String, et: String, cols: List[String]): List[Array[Any]] = {  
    import Supervisor._
    
    val inbox = Inbox.create(actorSystem)
    inbox.send(supervisor, Read(mfr, prod, sch, ec, st, et, cols))
    val Result(data) = inbox.receive(TimeoutSecs.seconds)
    data
  }
  
  def shutdown() {
    log.info("Shutting down actor system for parallel reads ...")    
    actorSystem.shutdown()
  }

}
