package models

import scala.language.postfixOps
import scala.collection.JavaConversions._

import play.api.Logger

import com.datastax.driver.core.{ResultSet, Row, BoundStatement}
import com.datastax.driver.core.policies._

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.util.{Try, Success, Failure}
import constants._



case class Realm(name: String, apps_version: String, is_url: String, ui_url: String)

object Realm {
                      
  val log = Logger("Model_Realm")
  
 /** Returns realms
  *  
  */  

  /**
   * Returns a set of realms
   */
    def listall(): List[Realm] = {
    try {
      val result = DS.cqlExecute(s"SELECT name,apps_version,is_url,ui_url FROM $KsUMS.$CFNRealm;")
      val rows = result.asScala.toList
      (for { 
        row <- rows 
      } yield {
        val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
        val apps_version = models.Utils.getStringVal(row, "apps_version", CVDefaultStr)
        val is_url = models.Utils.getStringVal(row, "is_url", CVDefaultStr)
        val ui_url = models.Utils.getStringVal(row, "ui_url", CVDefaultStr)
        
        Realm(name,apps_version,is_url,ui_url)
      }).toList 
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
    }
  } 
  
  def listallDetail(mfr:String,prod:String,sch:String): List[RealmDetail] = {
    try {  
      
      val resultRealm = DS.cqlExecute(s"SELECT realm FROM $KsUMS.$CFNMpseSSO WHERE mfr='$mfr' and prod='$prod' and sch='$sch';")
      val realm = resultRealm.asScala.toList.head.getString("realm")
      val result = DS.cqlExecute(s"SELECT name,apps_version,is_url,ui_url,vertica_user,vertica_server,vertica_pwd,vertica_port FROM $KsUMS.$CFNRealm WHERE name='$realm';")
     
      val rows = result.asScala.toList
      (for {
        row <- rows
      } yield {


      val name = models.Utils.getStringVal(row, "name", CVDefaultStr)
      val apps_version = models.Utils.getStringVal(row, "apps_version", CVDefaultStr)
      val is_url = models.Utils.getStringVal(row, "is_url", CVDefaultStr)
      val ui_url = models.Utils.getStringVal(row, "ui_url", CVDefaultStr)
      val vertica_user = models.Utils.getStringVal(row, "vertica_user", CVDefaultStr)
      val vertica_server = models.Utils.getStringVal(row, "vertica_server", CVDefaultStr)
      val vertica_pwd = models.Utils.getStringVal(row, "vertica_pwd", CVDefaultStr)
      val vertica_port = models.Utils.getStringVal(row, "vertica_port", CVDefaultStr)
      
    
      RealmDetail(name,apps_version,is_url,ui_url,vertica_server,vertica_port,vertica_user,vertica_pwd)
      }).toList
      
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching all realms, exception:  " + ex)
        List()
      }
    }
  } 
  
  /**
   * Delete the Realm 
   */
  
  def delete(realm: String): Option[String] = {
    try {
      val ps = DS.createPreparedStatement(s"DELETE FROM $KsUMS.$CFNRealm WHERE name = ? ;")
      val bs = new BoundStatement(ps).bind(realm)
      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while removing a realm, realm: $realm, exception: " + ex)
        Some("Failed to delete a realm")
      }
    }
  }
  
  /**
   * Add/ Edit Realm 
   */
  def managerealm(r: Realm): Option[String] = {
    
    try {
      val realm_name = r.name.toLowerCase()
      val apps_version = r.apps_version
      val is_url = r.is_url
      val ui_url = r.ui_url
      
      val query = s"INSERT INTO $KsUMS.$CFNRealm (name, apps_version, is_url, ui_url) VALUES (?, ?, ?, ?);"
      val ps = DS.createPreparedStatement(query)
      val bs = new BoundStatement(ps).bind(realm_name,apps_version,is_url,ui_url)

      DS.cqlExecuteBoundStmnt(bs)
      None
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while creating new realm, realm: ${r.name}, exception: " + ex)
        Some("Failed to create new realm")
      }
    }
  }
 

}
