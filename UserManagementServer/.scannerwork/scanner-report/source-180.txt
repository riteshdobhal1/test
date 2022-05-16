package dao.vertica

import play.api.Logger
import constants._
import dao.vertica.user.mapUserState
import dao.vertica.user_by_mps.{Col_email, Col_last_logout, Col_last_sess_id, Col_mps, log}
import models.DB
import java.util.Date
import java.sql.Timestamp
import java.text.SimpleDateFormat


object user_activity {
  val log = Logger("Dao_USER_ACTIVITY")

  /* start : columns of user_activity table*/
  lazy val Col_mps = "mps"
  lazy val Col_email = "email"
  lazy val Col_sess_id = "sess_id"
  lazy val Col_app = "app"
  lazy val Col_module = "module"
  lazy val Col_switched_feature = "switched_feature"
  lazy val Col_start_ts = "start_ts"
  lazy val Col_end_ts = "end_ts"
  lazy val Col_solr_qry = "solr_qry"
  lazy val Col_details = "details"
  lazy val Col_activity = "activity"
  lazy val Col_month = "month"
  /* end : columns of user_activity table*/

  def getSingleRow(mps:String, email: String,session_id:String,feature:String,month:Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_mps,  $Col_month, $Col_email, $Col_app, $Col_start_ts FROM $KsUMS.$CFNUserActivity WHERE $Col_mps=? AND $Col_month=? AND $Col_email=? AND $Col_sess_id=? AND $Col_app=? LIMIT 1;"
      val rows = DB.selectQueryResult(q,List(mps,month,email.toLowerCase(),session_id,feature))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        List()
      }
    }
  }
  def getTwoRows(mps:String, email: String,session_id:String,feature:String,month:Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $Col_mps,  $Col_month, $Col_email, $Col_app, $Col_start_ts FROM $KsUMS.$CFNUserActivity WHERE $Col_mps=? AND $Col_month=? AND $Col_email=? AND $Col_sess_id=? AND $Col_app=? LIMIT 2;"
      val rows = DB.selectQueryResult(q,List(mps,month,email.toLowerCase(),session_id,feature)) 

      /* val q = s"SELECT $Col_mps,  $Col_month, $Col_email, $Col_app, $Col_start_ts FROM $KsUMS.$CFNUserActivity WHERE $Col_mps='$mps' AND $Col_month='$month' AND $Col_email='$email' AND $Col_sess_id='$session_id' AND $Col_app='$feature' LIMIT 2;"

       log.error("QUERY SELECT:"+ q);
      val rows = DB.selectQueryResult(q,List()) */	 
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        List()
      }
    }
  }

  def updateFeature(switched_feature : String,mps:String, month:Long, email:String, session_id: String,feature: String, start_ts:Date): Option[String] = {
    try {

      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val ts=new Timestamp(start_ts.getTime());
      val q = s"UPDATE $KsUMS.$CFNUserActivity set $Col_end_ts=?, $Col_switched_feature = ? WHERE $Col_mps = ? and $Col_month=? AND $Col_email=? AND $Col_sess_id=? AND $Col_app=? AND $Col_start_ts=?;"
      val res = DB.updateQueryResult(q, List(currTime,switched_feature,mps,month,email.toLowerCase(),session_id,feature,ts))
	
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating user activity in {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        None
      }
    }
  }
  def updateEndTime(mps:String, month:Long, email:String, session_id: String,feature: String, start_ts:Date): Option[String] = {
    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val ts=new Timestamp(start_ts.getTime());
      val formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      val q = s"UPDATE $KsUMS.$CFNUserActivity set $Col_end_ts=? WHERE $Col_mps = ? and $Col_month=? AND $Col_email=? AND $Col_sess_id=? AND $Col_app=? AND $Col_start_ts=?;"
      val res = DB.updateQueryResult(q, List(currTime, mps,month,email.toLowerCase(),session_id,feature,ts))
      res match {
        case Some(SQL_ERROR) => {
          log.error(s"Failed to update end time in $KsUMS.$CFNUserActivity")
          None
        }
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating realm in {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        None
      }
    }
  }
  def addUserTracking(mps:String,month:Long,email: String,session_id: String,app: String,module: String,activity: String,detail: String,solr_query: String): Option[String] = {

    try {
      val currTime = new java.sql.Timestamp(System.currentTimeMillis())
      val q = s"INSERT INTO $KsUMS.$CFNUserActivity ($Col_mps, $Col_month, $Col_email, $Col_sess_id, $Col_app, $Col_module, $Col_activity, $Col_start_ts, $Col_details, $Col_solr_qry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
      val res = DB.insertQueryResult(q, List(mps,month,email.toLowerCase(),session_id,app,module,activity,currTime,detail,solr_query))
      
	/* val q = s"INSERT INTO $KsUMS.$CFNUserActivity ($Col_mps, $Col_month, $Col_email, $Col_sess_id, $Col_app, $Col_module, $Col_activity, $Col_start_ts, $Col_details, $Col_solr_qry) VALUES ('$mps','$month','$email','$session_id','$app','$module','$activity','$currTime','$detail','$solr_query');" */


      //log.error("QUERY:" + q)
      //val res = DB.insertQueryResult(q, List())
	res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting user tracking details in {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        None
      }
    }

  }
  def selectStartEndTime(mps:String,month:Long,email: String,session_id: String,app:String): List[Map[String, Option[Any]]] ={
    try {
      val q = s"SELECT start_ts, end_ts FROM $KsUMS.$CFNUserActivity WHERE mps = ? AND month = ? AND email = ? AND sess_id = ? AND app = ? LIMIT 1;"
      val rows = DB.selectQueryResult(q,List(mps,month,email.toLowerCase(),session_id,app))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNUserActivity} table : $email, ex: " + ex)
        List()
      }
    }

  }

}
