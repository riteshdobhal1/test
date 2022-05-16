package models

import constants.{APP_TYPE_MOBILE, APP_TYPE_WEB, CASSANDRA_VERSION, CVDefaultInt, CVDefaultLong, VERTICA_VERSION, WSFailure, WSSuccess}
import dao.{DBUtils, vertica}
import models.Utils.httpPostClientBuilder
import play.api.Logger
import play.api.Play.current
import play.api.libs.json.{JsError, JsPath, JsSuccess, Json, Reads}
import play.api.libs.ws.WS
import play.api.mvc.Cookie

import scala.concurrent.Await
import scala.util.{Failure, Success, Try}
import scala.concurrent.ExecutionContext.Implicits.global

case class RulesAlertsFiltersList(mfr: String, prod: String, sch: String, ruleId: Long, email: String, group: String, excSysIds: List[String])
case class AlertFilterQueryData(mfr: String, prod: String, sch: String, ruleId: Option[Long], email: Option[String])
case class AddAlertFilters(mps: Option[String], ruleId: Long, email: String, group: String, excSysIds: Seq[String])
case class BulkRulesDeleteAlertFilters(mps: Option[String], ruleIdList: Seq[Long], email: Option[String])
case class BulkUsersDeleteAlertFilters(mps: Option[String], emailIdList: Seq[String], ruleId: Long)
case class DeleteByRuleIdsAlertFilters(mps: Option[String], ruleIdList: Seq[Long])
case class AERefreshPayload(mps: Option[String], emailId: Option[List[String]], ruleId: Option[List[Long]])
case class UserGroupInfo(user: String, old_group: String, new_group: String)
case class GroupUpdateNotification(mps: String, group: Option[String], send_notification: Option[Boolean], user_group_info: Option[Seq[UserGroupInfo]])
case class NotificationDetails(email: String, first_name: String, last_name: String, ec: String, org: String, old_group: String, new_group: String)
case class AlertEngineUmsRefreshPayloadUserDeviceInfo(emailId: String, web_token: Option[List[String]], mobile_token: Option[List[String]])
case class SubscriptionPayload(mps: String, ruleId: Option[Long], emailId: Option[String])

object RulesAlerts {
  val log = Logger("Model_RulesAlerts")

  def alertFilterList(mfr: String, prod: String, sch: String, queryData: AlertFilterQueryData): Try[List[RulesAlertsFiltersList]] = {
    try {
      val queryString = DBUtils.alertFilterQuerySql(queryData)
      val alertsAttributesRows = vertica.alert_filter_attributes.selectAlertFiltersRows(mfr, prod, sch, queryString)
      val rulesAlertsFiltersList = (for {
        row <- alertsAttributesRows
        if models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_rule_id) != CVDefaultLong
      } yield {
        val ruleId = models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_rule_id)
        val email = models.Utils.getDBStringVal(row, vertica.alert_filter_attributes.Col_email, "")
        val group = models.Utils.getDBStringVal(row, vertica.alert_filter_attributes.Col_group, "")
        val excSysIds = models.Utils.getDBStringVal(row, vertica.alert_filter_attributes.Col_exc_sys_ids, "")
        val excSysIdsList = if(excSysIds.equals("")) List() else excSysIds.split(",").toList.distinct
        RulesAlertsFiltersList(mfr, prod, sch, ruleId, email, group, excSysIdsList)
      })
      Success(rulesAlertsFiltersList)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while fetching rules alerts filters for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def addUpdateAlertFiltersAtributes(mfr: String, prod: String, sch: String, alertFilterList: Seq[AddAlertFilters], reqSessionOpt: Option[Cookie]): Try[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      alertFilterList.foreach(alertFilter => {
        if(vertica.alert_filter_attributes.selectRowCount(mps, alertFilter.ruleId, alertFilter.email, alertFilter.group) == 0) {
          if(alertFilter.excSysIds.size != 0){
            val excSysIdsStr = alertFilter.excSysIds.distinct.mkString(",")
            val res = vertica.alert_filter_attributes.insertRow(mps, alertFilter.ruleId, alertFilter.email, alertFilter.group, excSysIdsStr)
            res match{
              case Some(x) => throw new RuntimeException(s"Failed to insert row : $mps, $alertFilter, $excSysIdsStr")
              case _ => log.info(s"Row inserted successfully : $mps, $alertFilter, $excSysIdsStr")
            }
          }
        } else {
          if(alertFilter.excSysIds.size != 0){
            val excSysIdsStr = alertFilter.excSysIds.distinct.mkString(",")
            val res = vertica.alert_filter_attributes.updateRowExcSysIds(mps, alertFilter.ruleId, alertFilter.email, alertFilter.group, excSysIdsStr)
            res match{
              case Some(x) => throw new RuntimeException(s"Failed to update row : $mps, $alertFilter, $excSysIdsStr")
              case _ => log.info(s"Row updated successfully : $mps, $alertFilter, $excSysIdsStr")
            }
          } else {
            log.debug(s"No sysid is excluded, so deleting row for mps = $mps, ruleId = ${alertFilter.ruleId}, email = ${alertFilter.email}, group = ${alertFilter.group}")
            val res = if(alertFilter.group.equals("")){
              val filterRows = vertica.alert_filter_attributes.selectRowsFilterGroup(mps, alertFilter.ruleId, alertFilter.email)
              val filterIdList = (for {
                row <- filterRows
                if models.Utils.getDBStringVal(row, vertica.alert_filter_attributes.Col_group, "").equals("")
              } yield {
                models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_filter_id)
              })
              vertica.alert_filter_attributes.deleteByFilterId(filterIdList)
            } else vertica.alert_filter_attributes.deleteByRuleIdEmailIdGroup(mps, alertFilter.ruleId, alertFilter.email, alertFilter.group)
            res match{
              case Some(x) => throw new RuntimeException(s"Failed to delete entries")
              case _ => log.info(s"Row deleted successfully : $mps, $alertFilter")
            }
          }
        }
      })
      val ruleList = alertFilterList.map(x => x.ruleId).toList
      refreshAECache(mfr, prod, sch, mps, None, Some(ruleList), reqSessionOpt)
      Success("Alerts filter added/updated successfully.")
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while adding rules alerts filters for mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def bulkRulesDeleteAlertFiltersAtributes(mfr: String, prod: String, sch: String, alertFilters: BulkRulesDeleteAlertFilters, reqSessionOpt: Option[Cookie]): Try[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val res = alertFilters.email match {
        case Some(email) => vertica.alert_filter_attributes.deleteByRuleIdsEmailId(mps, alertFilters.ruleIdList.toList, email)
        case _ => vertica.alert_filter_attributes.deleteByRuleId(mps, alertFilters.ruleIdList.toList)
      }
      res match{
        case Some(x) => throw new RuntimeException(s"Failed to delete entries")
        case _ => {
          refreshAECache(mfr, prod, sch, mps, None, Some(alertFilters.ruleIdList.toList), reqSessionOpt)
          Success("Alerts filter deleted successfully.")
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while deleting rules alerts filters for mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def bulkUsersDeleteAlertFiltersAtributes(mfr: String, prod: String, sch: String, alertFilters: BulkUsersDeleteAlertFilters, reqSessionOpt: Option[Cookie]): Try[String] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val res = vertica.alert_filter_attributes.deleteByEmailIdsRuleId(mps, alertFilters.emailIdList.toList, alertFilters.ruleId)
      res match{
        case Some(x) => throw new RuntimeException(s"Failed to delete entries")
        case _ => {
          val ruleList = DBUtils.getRuleIdsList(mps, alertFilters.emailIdList.toList)
          refreshAECache(mfr, prod, sch, mps, None, Some(ruleList), reqSessionOpt)
          Success("Alerts filter deleted successfully.")
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while deleting rules alerts filters for mps: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def refreshAECache(mfr: String, prod: String, sch: String, groupMPS: String, emailId: Option[List[String]], ruleId: Option[List[Long]], reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      log.debug(s"AE refresh API called.. ")
      log.debug(s"Cookies: $reqSessionOpt")
      val mps = models.Utils.getAuthMPSName(VERTICA_VERSION, mfr, prod, sch)
      val rows = vertica.sso_details.selectRealm(s"$mfr/$prod/$sch")
      val realm = if(rows.size > 0) models.Utils.getDBStringVal(rows.head, vertica.sso_details.Col_realm, "") else ""
      val realmRow = vRole.getRealmUrl(realm)
      val IS_API_Url = if(realmRow._1.equals("")){
        log.error(s"IS url is empty for realm : $realm")
        ""
      } else {
        emailId match {
          case Some(x) => s"${realmRow._1}/alertengine/refresh/sysids/$mfr"
          case _ => s"${realmRow._1}/alertengine/refresh/fa/$mfr"
        }
      }
      val reqSession = reqSessionOpt.get
      implicit val aeRefreshPayloadWrite = Json.writes[AERefreshPayload]
      val data = Json.toJson(AERefreshPayload(None, emailId, ruleId))
      log.debug(s"IS URL : $IS_API_Url and Payload : $data")
      val futureResponse = WS.url(IS_API_Url).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).post(data).map { response =>
        response.statusText match {
          case "OK" =>
//            val msg = (response.json \ "data" \ "message").get.as[String]
            log.info(s"IS API returns Success for AE cache API ")
            WSSuccess
          case _ =>
            log.error(s"IS API returns Failure for AE cache API")
            WSFailure
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      Some(wsResponse)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while calling AE refresh" + ex)
        Some(WSFailure)
      }
    }
  }

  def refreshAECacheUserDeviceInfo(mfr: String, prod: String, sch: String, emailId: String): Option[String] = {
    try {
      log.debug(s"AE refreshAECacheUserDeviceInfo API called.. ")
      val rows = vertica.sso_details.selectRealm(s"$mfr/$prod/$sch")
      val realm = if(rows.size > 0) models.Utils.getDBStringVal(rows.head, vertica.sso_details.Col_realm, "") else ""
      val realmRow = vRole.getRealmUrl(realm)
      val IS_API_Url = if(realmRow._1.equals("")){
        log.error(s"IS url is empty for realm : $realm")
        ""
      } else {
        s"${realmRow._1}/alertengine/update/token/$mfr"
      }
//      val reqSession = reqSessionOpt.get
      implicit val aeUmsRefreshPayloadUserDeviceInfoWrite = Json.writes[AlertEngineUmsRefreshPayloadUserDeviceInfo]
      val userDeviceRows = dao.vertica.user_device_info.selectRows(emailId)
      val webToken = if(userDeviceRows.size > 0){
        (for {
          row <- userDeviceRows
          if models.Utils.getDBIntVal(row, vertica.user_device_info.Col_app_type) == APP_TYPE_WEB
        } yield {
          models.Utils.getDBStringVal(row, vertica.user_device_info.Col_device_token, "")
        }).distinct
      } else List()
      val webTokenOpt = if(webToken.size > 0) Some(webToken) else None
      val mobileToken = if(userDeviceRows.size > 0){
        (for {
          row <- userDeviceRows
          if models.Utils.getDBIntVal(row, vertica.user_device_info.Col_app_type) == APP_TYPE_MOBILE
        } yield {
          models.Utils.getDBStringVal(row, vertica.user_device_info.Col_device_token, "")
        }).distinct
      } else List()
      val mobileTokenOpt = if(mobileToken.size > 0) Some(mobileToken) else None
      val data = Json.toJson(AlertEngineUmsRefreshPayloadUserDeviceInfo( emailId, webTokenOpt, mobileTokenOpt))
      log.debug(s"IS URL : $IS_API_Url and Payload : $data")
      val futureResponse = WS.url(IS_API_Url).post(data).map { response =>
        response.statusText match {
          case "OK" =>
//            val msg = (response.json \ "data" \ "message").get.as[String]
            log.info(s"IS API returns Success for AE user's devicce info cache API ")
            WSSuccess
          case _ =>
            log.error(s"IS API returns Failure for AE user's devicce info cache API")
            WSFailure
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      Some(wsResponse)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while calling AE refresh" + ex)
        Some(WSFailure)
      }
    }
  }

  def sendNotification(mfr: String, prod: String, sch: String, payload: GroupUpdateNotification): Try[String] = {
    try {
      def getUsersList(usersRow: List[Map[String, Option[Any]]], groupName: String, userGroupDetails: Map[String, UserGroupInfo]) = {
        (for {
          row <- usersRow
          if !models.Utils.getDBStringVal(row, vertica.user.Col_email, "").equals("")
          if !models.Utils.getDBStringVal(row, vertica.user.Col_org, "").equals("")
          if models.Utils.getDBStringVal(row, vertica.user.Col_org, "").equals(mfr)
        } yield {
          val email = models.Utils.getDBStringVal(row, vertica.user.Col_email, "")
          val fName = models.Utils.getDBStringVal(row, vertica.user.Col_first_name, "")
          val lName = models.Utils.getDBStringVal(row, vertica.user.Col_last_name, "")
          val oldGrp = if(userGroupDetails.contains(email)) userGroupDetails(email).old_group else ""
          val newGrp = if(userGroupDetails.contains(email)) userGroupDetails(email).new_group else ""
          NotificationDetails(email, fName, lName, groupName, mfr, oldGrp, newGrp)
        }).distinct
      }

      val mps = if(payload.mps.equals("")) s"$mfr/$prod/$sch" else payload.mps
      val groupName = payload.group match {
        case Some(x) => x
        case _ => ""
      }
      if(!payload.send_notification.getOrElse(false)){
        log.debug(s"Notification is disabled, hence not sending notification to any users")
        Success("Success")
      } else {
        log.debug(s"Notification is enabled : $groupName")
        if (groupName.equals("")) {
          val userGroupInfoList = payload.user_group_info match {
            case Some(x) => x.toList
            case _ => List()
          }
          if(userGroupInfoList.size == 0){
            log.debug(s"Group name is empty and user list is also empty, hence not sending notification to any users")
          } else {
            var userGroupInfoAcc = Map[String, UserGroupInfo]()
            userGroupInfoList.foreach({userGroupInfo =>
              if(!userGroupInfoAcc.contains(userGroupInfo.user)){
                userGroupInfoAcc = userGroupInfoAcc ++ Map(userGroupInfo.user -> UserGroupInfo(userGroupInfo.user, userGroupInfo.old_group, userGroupInfo.new_group))
              }
            })
            val users = userGroupInfoAcc.keys.toList
            val usersRow = vertica.user.selectGroupUsersInfo(None, None, Some(users))
            val userList = getUsersList(usersRow, groupName, userGroupInfoAcc)
            userList.foreach(user => {
              log.info(s"User details : $user")
              log.info(s"Sending notification to user ${user.email} about the group updates of group name ${user.ec} ")
              if(user.old_group.equals(user.new_group)){
                log.info(s"There is no association/dissociation of group, hence not sending mail to the user : $user")
              } else {
                log.info(s"association/dissociation of group, hence sending mail to the user : $user")
                models.Utils.sendUserGroupUpdateNotification(user)
              }
            })
          }
        } else {
          val usersRow = vertica.user.selectGroupUsersInfo(Some(groupName), Some(mfr), None)
          val userList = getUsersList(usersRow, groupName, Map())
          userList.foreach(user => {
            log.info(s"User details : $user")
            log.info(s"Sending notification to user ${user.email} about the group updates of group name ${user.ec} ")
            models.Utils.sendUserGroupUpdateNotification(user)
          })
        }
        Success("Success")
      }
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while send notifications to users, payload : $payload: $mfr/$prod/$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def removeSubscribers(mfr: String, prod: String, sch: String, subscribers: List[SubscriptionPayload], reqSessionOpt: Option[Cookie]): Option[String] = {
    try {
      log.debug(s"IS removeSubscribers called.. ")
      val mps = models.Utils.getAuthMPSName(VERTICA_VERSION, mfr, prod, sch)
      val rows = vertica.sso_details.selectRealm(s"$mfr/$prod/$sch")
      val realm = if(rows.size > 0) models.Utils.getDBStringVal(rows.head, vertica.sso_details.Col_realm, "") else ""
      val realmRow = vRole.getRealmUrl(realm)
      val IS_API_Url = if(realmRow._1.equals("")){
        log.error(s"IS url is empty for realm : $realm")
        ""
      } else {
        s"${realmRow._1}/rules/mps/subscription/unsubscribe/$mfr/$prod/$sch"
      }
      val reqSession = reqSessionOpt.get
      implicit val subscriptionPayloadWrite = Json.writes[SubscriptionPayload]
      val data = Json.toJson(subscribers)
      log.debug(s"IS URL : $IS_API_Url and Payload : $subscribers")
      val futureResponse = WS.url(IS_API_Url).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).post(data).map { response =>
        response.statusText match {
          case "OK" =>
            //            val msg = (response.json \ "data" \ "message").get.as[String]
            log.info(s"IS API returns Success for remove subscribers API")
            WSSuccess
          case _ =>
            log.error(s"IS API returns Failure for remove subscribers API ")
            WSFailure
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      Some(wsResponse)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while calling remove subscribers API" + ex)
        Some(WSFailure)
      }
    }
  }
}
