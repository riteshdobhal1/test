package models

import akka.actor.ActorRef
import scala.collection.immutable.ListMap

object PendingRequests {
  case class Request(subReqIds: List[Long], sender: ActorRef, partialResults: List[List[Array[Any]]])
  case class RequestAggr(subReqIds: List[Long], sender: ActorRef, partialResults: List[Map[String, List[(Any, Any)]]])
  
  var prs = Map[Long, Request]()
  
  var prsAggr = Map[Long, RequestAggr]()
  
  def add(reqId: Long, subRequests: List[Long], sender: ActorRef): Unit = {
    prs += (reqId -> Request(subRequests, sender, List()))
  }
  
  def addPrAggr(reqId: Long, subRequests: List[Long], sender: ActorRef): Unit = {
    prsAggr += (reqId -> RequestAggr(subRequests, sender, List()))
  }
  
 
  def processPartialResult(reqId: Long, subReqId: Long, result: List[Array[Any]]): Boolean = {
    val req = prs(reqId)
    val pendingSubRequests = req.subReqIds.filterNot(_ == subReqId) 
    val updatedRequest = req.copy(subReqIds = pendingSubRequests, partialResults = result::req.partialResults)
    prs += (reqId -> updatedRequest)
    pendingSubRequests.isEmpty
  } 
  
  def processPartialAggr(reqId: Long, subReqId: Long, result: Map[String, List[(Any, Any)]]): Boolean = {
    val req = prsAggr(reqId)
    val pendingSubRequests = req.subReqIds.filterNot(_ == subReqId) 
    val updatedRequest = req.copy(subReqIds = pendingSubRequests, partialResults = result::req.partialResults)
    prsAggr += (reqId -> updatedRequest)
    pendingSubRequests.isEmpty
  }
  
   
  def receivedAllResponses(reqId: Long): Boolean = {
     prs(reqId).subReqIds.isEmpty  
  }
  
  def getResult(reqId: Long): (ActorRef, List[Array[Any]]) = {
    (prs(reqId).sender, prs(reqId).partialResults.flatten)
  }
  
  def getAggrResult(reqId: Long): (ActorRef, List[Map[String, List[(Any, Any)]]]) = {
    (prsAggr(reqId).sender, prsAggr(reqId).partialResults)
  }
  
  def remove(reqId: Long): Unit = {
    prs = prs - reqId
  }
  
  def removeprAggr(reqId: Long): Unit = {
    prsAggr = prsAggr - reqId
  }

}