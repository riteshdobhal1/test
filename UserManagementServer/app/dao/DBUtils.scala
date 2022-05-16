package dao

import play.api.Logger
import dao._
import constants._
import models.Settings.{VertClusterHost, mpsVertConfigMap, vClusterHostMap}
import models.{AlertFilterQueryData, ClinsightLogin, ClinsightMenuItem, ClinsightMenuNodeOp, ClinsightsRoleDetails, DB, EndCustomerMfr, MfrUsersRoles, NewUser, NotificationDetails, RoleDetails, RulesAlerts, SubscriptionPayload, UserDeviceInfo}
import org.joda.time.{DateTime, DateTimeZone}
import play.api.libs.json.{JsObject, Json}
import play.api.mvc.Cookie

import scala.collection.JavaConversions.mapAsScalaMap
import scala.util.{Failure, Success, Try}

case class ECSubGroup(ec: Long, ecName: String, subGroup: List[String])
case class ECSubGroupSerials(ec: Long, ecName: String, serial_number: List[String])

object DBUtils {
  val log = Logger("Dao_DBUtils")

  def featuresMapping(fIds: String): Map[String, String] = {
    val fIdsList = fIds.split(",")
    val res = fIdsList.foldLeft(Map[String, String]()){ (acc, item) =>
      val rows = vertica.features.selectRow(item)
      if(rows.size > 0){
        val row = rows.head
        val fLabel = models.Utils.getDBStringVal(row, vertica.features.Col_feature_label, "")
        val fName = models.Utils.getDBStringVal(row, vertica.features.Col_feature_name, "")
        acc ++ Map(item -> fName)
      } else{
        Map()
      }
    }
    res
  }

  def mpsMapping(mpsList: List[String]): Map[String, String] = {
    val res = mpsList.foldLeft(Map[String, String]()){ (acc, item) =>
      val rows = vertica.mps.selectRow(item)
      if(rows.size > 0){
        val row = rows.head
        val mpsLabel = models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label, "")
        acc ++ Map(item -> mpsLabel)
      } else{
        Map()
      }
    }
    res
  }

  def realmMapping(rIds: String): Map[String, String] = {
    val rIdsList = rIds.split(",").toList
    val res = rIdsList.foldLeft(Map[String, String]()){ (acc, item) =>
      if(!item.equals("")) {
        val rows = vertica.realm.selectRowId(item)
        if (rows.size > 0) {
          val row = rows.head
          val rName = models.Utils.getDBStringVal(row, vertica.realm.Col_realm, "")
          acc ++ Map(item -> rName)
        } else {
          acc
        }
      } else{
        acc
      }
    }
    res
  }

  def getAllRowsData(): List[Map[String, Any]] = {
    val roles = getAllRolesName()
    val rows = roles.foldLeft(List[Map[String, Any]]())((acc, item) => acc ++ getRoleRowData(item))
    rows
  }

  def getAllRolesName(): List[String] = {
    val rows = vertica.role.selectRows()
    var acc = List[String]()
    rows.foreach(row => acc = acc ++ List(models.Utils.getDBStringVal(row, vertica.role.Col_role_name)))
    acc
  }

  def getRoleRowData(roleName: String) : List[Map[String, Any]] = {
    try {
      val rows = vertica.role.selectRoleInfo(roleName)
      var domainsAcc = Map[String, String]()
      var featuresAcc = Map[String, String]()
      var realmAcc = List[String]()
      rows.foreach({ row =>
        if (domainsAcc.keys.toList.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label))) {
          val existingDomains = domainsAcc(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label))
          val newDomain = models.Utils.getDBStringVal(row, vertica.mps.Col_mps)
          val domains = existingDomains + "," + newDomain
          domainsAcc + (models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label) -> domains)
        } else {
          domainsAcc = domainsAcc ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label) -> models.Utils.getDBStringVal(row, vertica.mps.Col_mps))
        }
        if (featuresAcc.keys.toList.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))) {
          val existingFeatures = featuresAcc(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))
          val currFeatures = models.Utils.getDBStringVal(row, vertica.features.Col_feature_name)
          val newFeatures = if(!existingFeatures.equals("")){
            val existingFeaturesList = existingFeatures.split(",")
            if(!existingFeaturesList.contains(currFeatures)) existingFeatures + "," + currFeatures else existingFeatures
          } else {
            currFeatures
          }
          featuresAcc = featuresAcc ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> newFeatures)
        } else {
          featuresAcc = featuresAcc ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.features.Col_feature_name))
        }
        val realm = models.Utils.getDBStringVal(row, vertica.realm.Col_realm)
        if(!realm.equals("") && !realmAcc.contains(realm)){
          realmAcc = realmAcc ++ List(models.Utils.getDBStringVal(row, vertica.realm.Col_realm,""))
        }
      })
      if (rows.size > 0) {
        val row = rows.head
        val maxLimitProject = models.Utils.getDBIntVal(row, vertica.role.Col_max_limit_proj)
        val isSuper = models.Utils.getDBBooleanVal(row, vertica.role.Col_super)
        val twoAuthSupportStr = models.Utils.getDBStringVal(row, vertica.role.Col_two_auth_support, "")
        val twoAuthSupport = twoAuthSupportStr.split(",").toList
        val mappedRow = Map(
          "name" -> roleName,
          "domains" -> domainsAcc,
          "max_limit_proj" -> maxLimitProject,
          "permissions" -> featuresAcc,
          "realm" -> realmAcc,
          "super" -> isSuper,
          "two_auth_support" -> twoAuthSupport
        )
        List(mappedRow)
      } else {
        val res = Map(
          "name" -> roleName,
          "domains" -> Map(),
          "max_limit_proj" -> 0,
          "permissions" -> Map(),
          "realm" -> List(),
          "super" -> false,
          "two_auth_support" -> List()
        )
        List(res)
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting role data from multiple tables, ex: " + ex)
        List()
      }
    }
  }

  def roleRealms(name: String) : (Boolean, List[String]) = {
    val rows = vertica.role.selectRoleRealms(name)
    if(rows.size > 0) {
      val realms = for(row <- rows if !models.Utils.getDBStringVal(row, vertica.realm.Col_realm, "").equals("")) yield models.Utils.getDBStringVal(row, vertica.realm.Col_realm, "")
      (true, realms)
    } else {
      (false, List())
    }
  }

  def getTwoAuthSupportList(roleName: String): List[String] = {
    val rows = vertica.role.selectRow(roleName)
    if(rows.size > 0){
      val tws = models.Utils.getDBStringVal(rows.head, vertica.role.Col_two_auth_support, "")
      if(tws.equals("") || tws.equals(CVDefaultStr)) List() else tws.replaceAll(" ","").split(",").toList
    } else {
      List()
    }
  }

  def mapFeatureIdsRows(rows: List[Map[String, Option[Any]]]): List[Int] = {
    val fIdList = for(row <- rows) yield models.Utils.getDBIntVal(row, vertica.features.Col_feature_id)
    fIdList
  }

  def updatedRoleRowData(mpsOpt: Option[String], role: String, domains: Map[String, String], features: Map[String, String], explorerDateRangeMap: Map[String, Int]): Option[String] = {
    try {
      val roleName = role.toLowerCase()
      val domainList = features.keys.toList
      val roleRows = vertica.role.selectRow(roleName)
      val roleId = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
      val roleIdAsList = List(roleId)
      vertica.role_mps_feature_attributes.deleteRows(roleIdAsList, mpsOpt)
      val res = vertica.role_mps_features.deleteRows(roleIdAsList)
      res match {
        case Some(SQL_ERROR) => Some("Failed to delete product(s)")
        case _ =>  {
          domainList.foreach({ mps =>
          val fIds = features(mps).split(",").toList
          val fRows = vertica.features.selectFeatureIds(fIds)
          val fIdList = mapFeatureIdsRows(fRows)
          fIdList.foreach({ fId =>
            val res = vertica.role_mps_features.insertRow(mps, fId, roleId)
            res match {
              case Some(SQL_ERROR) => Some("Failed to update products to the role")
              case _ => None
            }
          })
        })
        updateExplorerDateRange(explorerDateRangeMap, roleId, mpsOpt)
        None
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating role data, ex: " + ex)
        Some("Failed to delete product(s)")
      }
    }
  }

  def updateIncrementalRoleFeatures(mpsOpt: Option[String], role: String, domains: Map[String, String], features: Map[String, String], i: Int, explorerDateRangeMap: Map[String, Int]): Option[String] = {
    try {
      val roleName = role.toLowerCase()
      val domainList = features.keys.toList
      val roleRows = vertica.role.selectRow(roleName)
      val roleId = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
      val roleIdAsList = List(roleId)
      val mpsRows = vertica.role_mps_features.selectMPSList(roleId)
      val dbMPSList = (for(
        row <- mpsRows
        if !models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps,"").equals(""))
      yield {
        models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps,"")
      }).distinct
      val deletedMPSes = (dbMPSList diff domainList).distinct
      i match {
        case 0 => {
          vertica.role_mps_features.deleteRows(roleIdAsList)
          vertica.role_mps_feature_attributes.deleteRows(roleIdAsList, mpsOpt)
        }
        case _ =>
      }
      domainList.foreach({ mps =>
        val fIds = features(mps).split(",").toList
        val fRows = vertica.features.selectFeatureIds(fIds)
        val fIdList = mapFeatureIdsRows(fRows)
        fIdList.foreach({ fId =>
          vertica.role_mps_features.insertRow(mps, fId, roleId)
        })
      })
      updateExplorerDateRange(explorerDateRangeMap, roleId, mpsOpt)
      Some("")
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating role incremetal data, ex: " + ex)
        None
      }
    }
  }

  def scalaTosqlLongList(items: List[Long]): String = items.foldLeft("")( (a, u) => if(a.isEmpty) a ++ s"$u" else a ++ s",$u")

  def scalaTosqlIntList(items: List[Int]): String = items.foldLeft("")( (a, u) => if(a.isEmpty) a ++ s"$u" else a ++ s",$u")

  def scalaTosqlList(items: List[String]): String = items.foldLeft("")( (a, u) => if(a.isEmpty) a ++ s"'$u'" else a ++ s",'$u'")

  def listToString(items: List[String]): String = items.foldLeft("")( (a, u) => if(a.isEmpty) a ++ s"$u" else a ++ s",$u")

  def getSqlQueryData(query: String): List[Map[String, Option[Any]]] = {
    try {
      val rows = DB.selectQueryResult(query, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while executing query : $query, ex: " + ex)
        List()
      }
    }
  }

  def roleRowAccData(rows: List[Map[String, Option[Any]]]) : Map[String, RoleDetails] = {
    try {
      var allRolesAcc = Map[String, RoleDetails]()
      rows.foreach({ row =>
        val roleName = models.Utils.getDBStringVal(row, vertica.role.Col_role_name,"")
        if(allRolesAcc.contains(roleName)){
          val roleDetails = allRolesAcc(roleName)
          val domains = if(roleDetails.domains.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label))){
            roleDetails.domains
          } else{
            roleDetails.domains ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label) -> models.Utils.getDBStringVal(row, vertica.mps.Col_mps))
          }
          val features = if(roleDetails.features.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))){
            val existingFeatures = roleDetails.features(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))
            val currFeatures = models.Utils.getDBStringVal(row, vertica.features.Col_feature_name)
            val newFeatures = if(!existingFeatures.equals("")){
              val existingFeaturesList = existingFeatures.split(",")
              if(!existingFeaturesList.contains(currFeatures)) existingFeatures + "," + currFeatures else existingFeatures
            } else {
              currFeatures
            }
            roleDetails.features ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps)-> newFeatures)
          } else{
            roleDetails.features ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.features.Col_feature_name))
          }
          val mps_uidomain = if(roleDetails.features.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))){
            roleDetails.mps_uidomain
          } else{
            roleDetails.mps_uidomain ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_ui_url))
          }
          val mps_isdomain = if(roleDetails.features.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))){
            roleDetails.mps_isdomain
          } else{
            roleDetails.mps_isdomain ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_is_url))
          }
          val realm = if(roleDetails.realm.contains(models.Utils.getDBStringVal(row, "realm",""))){
            roleDetails.realm
          } else{
            roleDetails.realm ++ List(models.Utils.getDBStringVal(row, "realm",""))
          }
          val realm_appsversion = if(roleDetails.realm_appsversion.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))){
            roleDetails.realm_appsversion
          } else{
            roleDetails.realm_appsversion ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_apps_version))
          }
          val exp_date_ranges = if(row.contains(s"${vertica.role_mps_feature_attributes.Col_explorer_date_range}")){
            val expDateRange = models.Utils.getDBIntVal(row, vertica.role_mps_feature_attributes.Col_explorer_date_range, CVDefaultInt)
            if(expDateRange!= CVDefaultInt && !roleDetails.explorer_date_range.contains(models.Utils.getDBStringVal(row, vertica.mps.Col_mps))){
              roleDetails.explorer_date_range ++ Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> expDateRange)
            } else roleDetails.explorer_date_range
          } else roleDetails.explorer_date_range
          allRolesAcc = allRolesAcc + (roleName -> RoleDetails(roleDetails.name, roleDetails.is_super, domains, features, Map(), Map(), mps_uidomain, mps_isdomain, realm_appsversion, realm, roleDetails.studio_proj_limit, roleDetails.two_auth_support, exp_date_ranges))
        } else{
          val maxLimitProject = models.Utils.getDBIntVal(row, vertica.role.Col_max_limit_proj)
          val isSuper = models.Utils.getDBBooleanVal(row, vertica.role.Col_super)
          val twoAuthSupportStr = models.Utils.getDBStringVal(row, vertica.role.Col_two_auth_support, "")
          val twoAuthSupport = twoAuthSupportStr.split(",").toList
          val domains = Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps_label) -> models.Utils.getDBStringVal(row, vertica.mps.Col_mps))
          val features = Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.features.Col_feature_name))
          val realm_isdomain = Map(models.Utils.getDBStringVal(row, vertica.realm.Col_realm) -> models.Utils.getDBStringVal(row, vertica.realm.Col_is_url))
          val realm_uidomain = Map(models.Utils.getDBStringVal(row, vertica.realm.Col_realm) -> models.Utils.getDBStringVal(row, vertica.realm.Col_ui_url))
          val mps_uidomain = Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_ui_url))
          val mps_isdomain = Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_is_url))
          val realm_appsversion = Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> models.Utils.getDBStringVal(row, vertica.realm.Col_apps_version))
          val realmValue = models.Utils.getDBStringVal(row, vertica.realm.Col_realm,"")
          val realm = if(realmValue.equals("")) List() else List(realmValue)
          val expDtRng = models.Utils.getDBIntVal(row, vertica.role_mps_feature_attributes.Col_explorer_date_range,CVDefaultInt)
          val exp_date_ranges: Map[String, Int] = if(expDtRng!= CVDefaultInt ) Map(models.Utils.getDBStringVal(row, vertica.mps.Col_mps) -> expDtRng) else Map()
          allRolesAcc = allRolesAcc ++ Map(roleName -> RoleDetails(roleName, isSuper, domains, features, realm_isdomain, realm_uidomain, mps_uidomain, mps_isdomain, realm_appsversion, realm, maxLimitProject , twoAuthSupport, exp_date_ranges))
        }
      })
      allRolesAcc
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting role data from multiple tables, ex: " + ex)
        Map()
      }
    }
  }

  def ecRowAccData(rows: List[Map[String, Option[Any]]], mfrStr: String, email: String, fnCallSrc: String, includeEmails: Boolean, includeMfr: Boolean = false) : Map[String, EndCustomerMfr] = {
    def mergeGroupSerials(ecList: Map[String, EndCustomerMfr], ecSubGroupsSerials: Map[Long, ECSubGroupSerials]): Map[String, EndCustomerMfr] = {
      def mergeSerials(srls: List[String], groups: List[String], ecSubGroupsSerials: Map[Long, ECSubGroupSerials]): List[String] = {
        if(groups.size > 0){
          val groupSrls = groups.foldLeft(List[String]()){(a, i) =>
            val eclistValues = ecSubGroupsSerials.values.toList
            val groupInfoList = eclistValues.filter(x => x.ecName == i)
            if(groupInfoList.size > 0) (a ++ groupInfoList.head.serial_number).distinct else a.distinct
          }
          (srls ++ groupSrls).distinct
        } else{
          srls.distinct
        }
      }
      var allEcAcc = Map[String, EndCustomerMfr]()
      for((k,v) <- ecList){
        if(!allEcAcc.contains(k)){
          val mergedSerials = mergeSerials(v.serial_number, v.group_name, ecSubGroupsSerials)
          allEcAcc = allEcAcc ++ Map(k -> EndCustomerMfr(v.mfr, v.prod, v.sch, v.endcustomer_name, mergedSerials, v.created_by, v.updated_on, v.group_name))
        }
      }
      allEcAcc
    }

    var allEcAcc = Map[String, EndCustomerMfr]()
    val groupRows = if(!email.equals("")) vertica.end_customer.getEcGroupRowsData(List(email), true) else vertica.end_customer.getEcGroupRowsData(List())
    val ecGroupIds = (for(
      row <- groupRows
    if !models.Utils.getDBLongVal(row, vertica.end_customer_group.Col_sub_group_id).equals(CVDefaultLong))
    yield {
      models.Utils.getDBLongVal(row, vertica.end_customer_group.Col_sub_group_id)
    }).distinct

    val ecGroupNameMap = if(ecGroupIds.size>0){
      val ecGroupRows = vertica.end_customer.selectEcIdsName(ecGroupIds)
      ecGroupRows.foldLeft(Map[Long, String]())({(a, i) =>
        a ++ Map(models.Utils.getDBLongVal(i, vertica.end_customer.Col_endcustomer_id) -> models.Utils.getDBStringVal(i, vertica.end_customer.Col_endcustomer_name))
      })
    } else{
      Map[Long, String]()
    }

    val groupSerialsRows = vertica.end_customer_serials.selectEndCustomerSerialsNameRows(ecGroupIds)
    var allEcSubGroupSerials = Map[Long, ECSubGroupSerials]()
    /* groupSerialsRows includes all rows of (end_customer JOIN end_customer_serials) */
    groupSerialsRows.foreach({ row =>
      val ecId = models.Utils.getDBLongVal(row, vertica.end_customer_serials.Col_endcustomer_id)
      val ecName = models.Utils.getDBStringVal(row, vertica.end_customer.Col_endcustomer_name, "")
      if (allEcSubGroupSerials.contains(ecId)) {
        val ecSubgroupSerialsDetails = allEcSubGroupSerials(ecId)
        val serial_numbers = if (ecSubgroupSerialsDetails.serial_number.contains(models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number))) {
          ecSubgroupSerialsDetails.serial_number
        } else {
          ecSubgroupSerialsDetails.serial_number ++ List(models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number))
        }
        allEcSubGroupSerials = allEcSubGroupSerials + (ecId -> ECSubGroupSerials(ecSubgroupSerialsDetails.ec, ecSubgroupSerialsDetails.ecName, serial_numbers))
      } else {
        val sn = models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number, "")
        val serial_numbers = if(sn.equals("")) List() else List(sn)
        allEcSubGroupSerials = allEcSubGroupSerials ++ Map(ecId -> ECSubGroupSerials(ecId, ecName, serial_numbers))
      }
    })
    var allEcSubGroups = Map[Long, ECSubGroup]()
    /* groupRows includes all rows of (end_customer JOIN end_customer_group JOIN end_customer_serials) */
    groupRows.foreach({ row =>
      val ecId = models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
      if (allEcSubGroups.contains(ecId)) {
        val ecSubgroupDetails = allEcSubGroups(ecId)
        val groupName = if(ecGroupNameMap.size > 0) ecGroupNameMap(models.Utils.getDBLongVal(row, vertica.end_customer_group.Col_sub_group_id)) else ""
        val groups = if (!groupName.equals("") && !ecSubgroupDetails.subGroup.contains(groupName)){
          ecSubgroupDetails.subGroup ++ List(groupName)
        } else {
          ecSubgroupDetails.subGroup
        }
        allEcSubGroups = allEcSubGroups + (ecId -> ECSubGroup(ecSubgroupDetails.ec, ecSubgroupDetails.ecName, groups))
      } else{
        val ecName = models.Utils.getDBStringVal(row, vertica.end_customer.Col_endcustomer_name, "")
        val subGroupId = models.Utils.getDBLongVal(row, vertica.end_customer_group.Col_sub_group_id)
        val subGroupName = if(ecGroupNameMap.contains(subGroupId)) List(ecGroupNameMap(subGroupId)) else List()
        allEcSubGroups = allEcSubGroups ++ Map(ecId -> ECSubGroup(ecId, ecName, subGroupName))
      }
    })

    /* rows includes all rows of (end_customer JOIN end_customer_serials) */
    rows.foreach({ row =>
      val ecName = models.Utils.getDBStringVal(row, vertica.end_customer.Col_endcustomer_name, "")
      if(allEcAcc.contains(ecName)) {
        val ecDetails = allEcAcc(ecName)
        val serial_numbers = if(ecDetails.serial_number.contains(models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number))){
          ecDetails.serial_number
        } else{
          ecDetails.serial_number ++ List(models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number))
        }
        allEcAcc = allEcAcc + (ecName -> EndCustomerMfr(ecDetails.mfr, ecDetails.prod, ecDetails.sch, ecDetails.endcustomer_name, serial_numbers, ecDetails.created_by, ecDetails.updated_on, ecDetails.group_name))
      } else{
        val mps = models.Utils.getDBStringVal(row, vertica.end_customer.Col_mps, "")
        val mpsArr = mps.split("/")
        if(mpsArr.size > 0){
          val mfr = mpsArr(0)
          val prod = mpsArr(1)
          val sch = mpsArr(2)
          val sn = models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number, "")
          val serial_numbers = if(sn.equals("")) List() else List(sn)
          val endcustomer_name = models.Utils.getDBStringVal(row, vertica.end_customer.Col_endcustomer_name, "")
          val created_by = models.Utils.getDBStringVal(row, vertica.end_customer.Col_created_by, "")
          val updated_on = models.Utils.dateFormat.print(new DateTime(models.Utils.getDBDateVal(row, vertica.end_customer.Col_updated_on, CVDefaultDate), DateTimeZone.UTC))
          val ecId = models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
          val groups = if(allEcSubGroups.contains(ecId)) allEcSubGroups(ecId).subGroup else List()
          if(includeMfr){
            if(mpsArr(0).equals(mfrStr))
              allEcAcc = allEcAcc ++ Map(ecName -> EndCustomerMfr(mfr,prod,sch,endcustomer_name, serial_numbers, created_by, updated_on, groups))
          } else{
            allEcAcc = allEcAcc ++ Map(ecName -> EndCustomerMfr(mfr,prod,sch,endcustomer_name, serial_numbers, created_by, updated_on, groups))
          }
        }
      }
    })
    val ecSerialMap = fnCallSrc match{
      case FN_CALL_SOURCE_DASHBOARD => mergeGroupSerials(allEcAcc, allEcSubGroupSerials)
      case _ => allEcAcc
    }

    /* onlyECRows includes all rows of end_customer table only */
    val onlyECRows = if(includeEmails) vertica.end_customer.getOnlyEcRowsData(List(email), true) else vertica.end_customer.getOnlyEcRowsData(List())

    val ecWithoutSerials = onlyECRows.foldLeft(Map[String, EndCustomerMfr]())({ (a, row) =>
      val ecName = models.Utils.getDBStringVal(row, vertica.end_customer.Col_endcustomer_name, "")
      if(!ecSerialMap.contains(ecName)){
        val mps = models.Utils.getDBStringVal(row, vertica.end_customer.Col_mps, "")
        val mpsArr = mps.split("/")
        if(mpsArr.size > 0){
          val mfr = mpsArr(0)
          val prod = mpsArr(1)
          val sch = mpsArr(2)
          val serial_numbers = List()
          val created_by = models.Utils.getDBStringVal(row, vertica.end_customer.Col_created_by, "")
          val updated_on = models.Utils.dateFormat.print(new DateTime(models.Utils.getDBDateVal(row, vertica.end_customer.Col_updated_on, CVDefaultDate), DateTimeZone.UTC))
          val ecId = models.Utils.getDBLongVal(row, vertica.end_customer.Col_endcustomer_id)
          val groups = if(allEcSubGroups.contains(ecId)) allEcSubGroups(ecId).subGroup else List()
          if(includeMfr){
            if(mpsArr(0).equals(mfrStr)) a ++ Map(ecName -> EndCustomerMfr(mfr, prod, sch, ecName, serial_numbers, created_by, updated_on, groups)) else a
          } else{
            a ++ Map(ecName -> EndCustomerMfr(mfr, prod, sch, ecName, serial_numbers, created_by, updated_on, groups))
          }
        } else a
      } else a
    })

    val ecWithoutSerialsMap = fnCallSrc match{
      case FN_CALL_SOURCE_DASHBOARD => mergeGroupSerials(ecWithoutSerials, allEcSubGroupSerials)
      case _ => ecWithoutSerials
    }

    ecSerialMap ++ ecWithoutSerialsMap
  }

  def addToSQLQuery(sysInfoQueryParams: Map[String, String]): String = {
    var query  = s""
    for((k, v) <- sysInfoQueryParams){
      if(!v.equals(""))
        query = if(query.equals("")) s"$k ILIKE '%$v%'" else query ++ s" AND $k ILIKE '%$v%'"
    }
    query
  }

  def getClusterIdAndSchemaForMps(mfr: String, prod: String, sch: String): (Int, String) = {
    val mps = mfr + "/" + prod + "/" + sch
    val ksMap = mpsVertConfigMap.get(mps)
    ksMap match {
      case Some(v) =>
        val cId = v("ClusterId").asInstanceOf[Int]
        val enabled = v("enabled").asInstanceOf[Boolean]
        val schemaAppend = v("schemaAppend").toString
        val separator = "_"
        val ks = s"$mfr$separator$prod$separator$sch$separator$schemaAppend"
        log.debug(s"Configuration found under vertica config H2 table..: $cId, $ks")
        (cId, ks)
      case None =>
        throw new Exception(s"No configuration found under VerticaMPSConfig in h2 for $mfr, $prod, $sch")
    }
  }

  def getClusterConfigForMps(cId: Int): VertClusterHost = {
    val cIdMap = vClusterHostMap.get(cId)
    cIdMap match {
      case Some(v) =>
        val verticaHosts = v("verticaHosts").toString
        val verticaPort = v("verticaPort").asInstanceOf[Int]
        val verticaDb = v("verticaDb").toString
        val username = v("username").toString
        val password = v("password").toString
        log.debug(s"Configuration found under vertica config H2 table..: $cId")
        VertClusterHost(cId, verticaHosts, verticaPort, verticaDb, username, password)
      case None =>
        throw new Exception(s"No configuration found under VerticaConfig in h2 for $cId")
    }
  }

  def getBundleColumnsName(sysColsInfoRows: List[Map[String, Option[Any]]]): List[String] = {
    if(sysColsInfoRows.size > 0){
      (for {
        row <- sysColsInfoRows
        if !models.Utils.getDBStringVal(row, vertica.bundle_columns.Col_col_name, "").equals("")
      } yield{
        models.Utils.getDBStringVal(row, vertica.bundle_columns.Col_col_name, "")
      })
    } else List()
  }

  def getMfrAdminUsers(mfr: String, features: List[String], incExc: String): List[JsObject] = {
    val rows = vertica.user.selectUsersOrg(mfr)
    val mfrUsersRoles = (for{
      row <- rows
      if !models.Utils.getDBStringVal(row, "role_name", "").equals("")
    } yield{
      MfrUsersRoles(mfr, models.Utils.getDBStringVal(row, "email"), models.Utils.getDBStringVal(row, "role_name"))
    }).toList

    val roleList = features.foldLeft(List[String]())((acc, feature) => {
      val roleRows = vertica.role.getMfrFeaturesRoleRowsData(mfr, List(feature), incExc)
      val roles = (for {
        row <- roleRows
        name = models.Utils.getDBStringVal(row, vertica.role.Col_role_name,"")
        if !name.equals("")
      } yield {
        name
      }).distinct

      if(acc.size == 0 && roles.size > 0) roles else acc.intersect(roles).distinct
    })

    val userRoleList = (for {
      row <- mfrUsersRoles
    } yield{
      row.role
    }).distinct

    val filteredRoles = userRoleList.intersect(roleList)
    val emailsRoles: List[JsObject] = (for {
      row <- mfrUsersRoles
      if filteredRoles.contains(row.role)
    } yield{
      Json.obj("email" -> row.user, "role" -> row.role)
    }).distinct
    emailsRoles
  }

  def alertFilterQuerySql(queryData: AlertFilterQueryData): String = {
    val mps = s"${queryData.mfr}/${queryData.prod}/${queryData.sch}"
    val query = s"${vertica.alert_filter_attributes.Col_mps} = '$mps'"
    val ruleStr = queryData.ruleId match {
      case Some(x) =>
        val tmp = if(query.equals("")) "" else query ++ " AND "
        tmp ++ s"${vertica.alert_filter_attributes.Col_rule_id} = $x"
      case None => query
    }
    val queryStr = queryData.email match {
      case Some(x) =>
        val tmp = if(ruleStr.equals("")) "" else ruleStr ++ " AND "
        tmp ++ s"${vertica.alert_filter_attributes.Col_email} = '$x'"
      case None => ruleStr
    }
    log.debug(s"SQL Query params : $queryStr")
    queryStr
  }

  def getRuleIdsList(groupMPS: String, emailIds: List[String]): List[Long] = {
    log.debug("getRuleIdsList called ...")
    val filterRows = vertica.alert_filter_attributes.selectRowsRuleIds(groupMPS, emailIds)
    log.debug(s"ruleIds rows : $filterRows")
    (for {
      row <- filterRows
      if !models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_rule_id).equals(CVDefaultLong)
    } yield {
      models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_rule_id)
    }).distinct
  }

  def deleteAlertFilterAttributesRows(mfr: String, prod: String, sch: String, groupMPS: String, groupListOpt: Option[List[String]], emailListOpt: Option[List[String]], grpName: Option[String], reqSessionOpt: Option[Cookie]) = {
    log.debug(s"Groups have been updated/deleted so deleting corresponding entries in $KsUMS.$CFNAlertFilterAttributes for mps = $groupMPS and groups name = $groupListOpt and emails = $emailListOpt")
    val mpsList = groupMPS.split("/").toList
    val groupMfr = if(mpsList.size > 0) mpsList(0) else ""
    val (emailList, ruleList) = groupListOpt match {
      case Some(grpList) => {
        val usersRow = vertica.user.selectGroupsUsers(grpList, groupMfr)
        val userList = (for {
          row <- usersRow
          if !models.Utils.getDBStringVal(row, vertica.user.Col_email, "").equals("")
        } yield {
          models.Utils.getDBStringVal(row, vertica.user.Col_email, "")
        })
        val rules = getRuleIdsList(groupMPS, userList)
        vertica.alert_filter_attributes.deleteByGroupsName(groupMPS, grpList)
        (userList, rules)
      }
      case _ => emailListOpt match {
        case Some(emails) => {
          if(emails.size > 0){
            val rules = DBUtils.getRuleIdsList(groupMPS, emails)
            log.debug(s"ruleIds : $rules")
            vertica.alert_filter_attributes.deleteByEmailId(emails)
            (emails, rules)
          } else (List(), List())
        }
        case _ => {
          log.debug(s"Both groupList and emailList are empty.")
          (List(), List())
        }
      }
    }
    if(emailList.size > 0){
      models.RulesAlerts.refreshAECache(mfr, prod, sch, groupMPS, Some(emailList), None, reqSessionOpt)
    }
    if(ruleList.size > 0){
      models.RulesAlerts.refreshAECache(mfr, prod, sch, groupMPS, None, Some(ruleList), reqSessionOpt)
    }
    log.debug(s"Handling updates for user having empty group name")
    if(grpName.getOrElse("NA").equals("")){
      emailListOpt match {
        case Some(x) =>
          if(x.size > 0){
            val filterRows = vertica.alert_filter_attributes.selectRowsFilterEmail(x)
            val filterIdList = (for {
              row <- filterRows
              if models.Utils.getDBStringVal(row, vertica.alert_filter_attributes.Col_group, "").equals("")
            } yield {
              models.Utils.getDBLongVal(row, vertica.alert_filter_attributes.Col_filter_id)
            })
            if(filterIdList.size > 0){
              vertica.alert_filter_attributes.deleteByFilterId(filterIdList)
            }
            val ruleList = getRuleIdsList(groupMPS, x)
            models.RulesAlerts.refreshAECache(mfr, prod, sch, groupMPS, Some(x), None, reqSessionOpt)
            if(ruleList.size > 0){
              models.RulesAlerts.refreshAECache(mfr, prod, sch, groupMPS, None, Some(ruleList), reqSessionOpt)
            }
          }
        case None => log.debug("Group is non-empty")
      }
    }
  }

  def vMonitorUMS(): Try[Any] = {
    try {
      val rows = vertica.user.monitorUser()
      if(rows.size > 0) Success("Ok") else throw new Exception(s"No user found in vertica")
    } catch {
      case ex: Exception => {
        log.error(s"Exception for UMS monitor API: $ex")
        Failure(ex)
      }
    }
  }

  def updateExplorerDateRange(explorerDateRangeMap: Map[String, Int], roleId: Long, mpsOpt: Option[String]) : Option[String] = {
    log.debug(s"explorerDateRangeMap : $explorerDateRangeMap, $mpsOpt")
    val explorerDateRangeList = explorerDateRangeMap.keys.toList
    if(explorerDateRangeList.size > 0) {
      val explorerFeatureIdRows = vertica.features.selectFeatureIds(List(FeatExplorer))
      val explorerFeatureId = if(explorerFeatureIdRows.size > 0){
        models.Utils.getDBIntVal(explorerFeatureIdRows.head, vertica.features.Col_feature_id, -1)
      } else -1
      explorerDateRangeList.foreach({ mps =>
        val dateRange = explorerDateRangeMap(mps)
        if(explorerFeatureId == -1){
          log.debug(s"Couldn't find feature_id of feature : {$FeatExplorer} from features table")
          Some(s"Couldn't find feature_id of feature : {$FeatExplorer} from features table")
        } else{
          if(dateRange == EXP_DEF_DATE_RANGE){
            val roleMpsFeatureAttributesRows = vertica.role_mps_feature_attributes.selectRows(roleId, Some(mps))
            if(roleMpsFeatureAttributesRows.size>0){
              val res = vertica.role_mps_feature_attributes.deleteRows(List(roleId), Some(mps))
              res match {
                case Some(SQL_ERROR) => Some(s"Failed to delete explorer date range for roleId : $roleId")
                case _ => None
              }
            }
          } else{
            val res = vertica.role_mps_feature_attributes.insertRow(mps, roleId, explorerFeatureId , dateRange)
            res match {
              case Some(SQL_ERROR) => Some(s"Failed to update explorer date range for $mps")
              case _ => None
            }
          }
        }
      })
    }
    None
  }

  def updateUserDeviceInfo(username: String, user_device_info: Option[UserDeviceInfo], user: NewUser): Try[String] = {
    try{
      user_device_info match{
        case Some(x) => {
          log.debug(s"user device info received : $x")
          if(x.device_token.equals("")){
            log.debug(s"device token is empty hence not updating anything in $CFNUserDeviceInfo table")
          } else{
            val mps_def = user.mps_def
            val mps = mps_def.split("/").toList
            val (mfr, prod, sch) = (mps(0), mps(1), mps(2))
            val tokenRows = vertica.user_device_info.selectTokenRows(x.device_token)
            if(tokenRows.size == 0){
              vertica.user_device_info.insertRow(username, x.app_type, x.device_token, x.app_id)
            } else{
              val tokenUserName = models.Utils.getDBStringVal(tokenRows.head, vertica.user_device_info.Col_email)
              if(tokenUserName.equalsIgnoreCase(username)){
                log.debug(s"same device token is already present in DB hence not updating anything in $CFNUserDeviceInfo table")
              } else{
                log.debug(s"same device token is already but with different username hence deleting old entry for user {$tokenUserName} and making new entry for user {$username} in $CFNUserDeviceInfo table")
                vertica.user_device_info.deleteUserDeviceRow(tokenUserName, x.device_token)
                vertica.user_device_info.insertRow(username, x.app_type, x.device_token, x.app_id)
                models.RulesAlerts.refreshAECacheUserDeviceInfo(mfr, prod, sch, tokenUserName)
              }

            }
            models.RulesAlerts.refreshAECacheUserDeviceInfo(mfr, prod, sch, username)
          }
        }
        case _ =>
          log.debug(s"No changes in device token : $user_device_info")
      }
      Success("Updated Successfully")
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to update user device info, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def getRemovedRoleMpsList(role: String, payloadMPSList: List[String]): (List[String], List[String]) = {
    val roleName = role.toLowerCase()
    val roleRows = vertica.role.selectRow(roleName)
    if(roleRows.size > 0){
      val roleId = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
      val mpsRows = vertica.role_mps_features.selectMPSList(roleId)
      val dbMPSList = (for(
        row <- mpsRows
        if !models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps,"").equals(""))
      yield {
        models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps,"")
      }).distinct
      val deletedMPSes = (dbMPSList diff payloadMPSList).distinct
      (deletedMPSes, dbMPSList)
    } else (List(), List())
  }

  def removeH2Subscribers(usersList: List[String], mpsList: List[String], reqSessionOpt: Option[Cookie]): Try[String] = {
    try {
      log.debug(s"removeH2Subscribers called...")
      val subscriptionList = usersList.foldLeft(List[SubscriptionPayload]()) { (f, r) =>
        val subsList = for(mps <- mpsList) yield SubscriptionPayload(mps, None, Some(r))
        f ++ subsList
      }
      log.debug(s"usersList: $usersList, mpsList: $mpsList")
      if(mpsList.size > 0){
        val singleMPSList = mpsList.head.split("/").toList
        val (m, p, s) = (singleMPSList(0), singleMPSList(1), singleMPSList(2))
        models.RulesAlerts.removeSubscribers(m, p, s, subscriptionList, reqSessionOpt)
      }
      Success("success")
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to remove FA and H2 subscribers, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def checkRemovedMPSFARefreshCache(usersList: List[String], payload_role_id: Long, reqSessionOpt: Option[Cookie]): Try[String] = {
    try {
      log.debug(s"checkRemovedMPSFARefreshCache called...")
      log.debug(s"usersList: $usersList, payload_role_id: $payload_role_id")
      def getRoleMPSList(role_id: Long): List[String] = {
        if(role_id > 0){
          val mpsRows = vertica.role_mps_features.selectMPSList(role_id)
          if(mpsRows.size > 0){
            for(row <- mpsRows) yield models.Utils.getDBStringVal(row, vertica.role_mps_features.Col_mps)
          } else List()
        } else List()
      }

      val payload_role_mps = getRoleMPSList(payload_role_id)
      log.debug(s"payload_role_mps : $payload_role_mps")
      usersList.foreach({ user =>
        val userRows = vertica.user.selectUserRoleId(user)
        val db_role_id = if(userRows.size > 0){
          models.Utils.getDBLongVal(userRows.head, vertica.user.Col_role_id)
        } else 0
        val db_role_mps = getRoleMPSList(db_role_id)
        log.debug(s"db_role_mps : $db_role_mps")
        val deleted_mps = db_role_mps diff payload_role_mps
        log.debug(s"deleted_mps: $deleted_mps")
        if(deleted_mps.size > 0){
          DBUtils.removeH2Subscribers(List(user), deleted_mps, reqSessionOpt)
        }
        deleted_mps.foreach({mps =>
          DBUtils.deleteFARefreshCache(mps, List(user), reqSessionOpt)
        })

      })
      Success("success")
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while trying to fetch removed MPS for users {${usersList.mkString(",")}}, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def deleteFARefreshCache(mps: String, usersList: List[String], reqSessionOpt: Option[Cookie]) = {
    val singleMPSList = mps.split("/").toList
    val (m, p, s) = (singleMPSList(0), singleMPSList(1), singleMPSList(2))
    val ruleList = getRuleIdsList(mps, usersList)
    log.debug(s"mps : $mps, usersList : $usersList, ruleList : $ruleList")
    if(usersList.size > 0){
      vertica.alert_filter_attributes.deleteByMPSEmailId(mps, usersList)
      models.RulesAlerts.refreshAECache(m, p, s, mps, Some(usersList), None, reqSessionOpt)
    }
    if(ruleList.size > 0){
      models.RulesAlerts.refreshAECache(m, p, s, mps, None, Some(ruleList), reqSessionOpt)
    }
  }

  def getRoleUsersList(role: String): List[String] = {
    val roleName = role.toLowerCase()
    val roleRows = vertica.role.selectRow(roleName)
    if(roleRows.size > 0){
      val roleId = models.Utils.getDBLongVal(roleRows.head, vertica.role.Col_role_id)
      val roleUsersRows = vertica.user.selectRoleUsersRows(roleId)
      val usersList = (for {
        row <- roleUsersRows
        if !models.Utils.getDBStringVal(row, vertica.user.Col_email, "").equals("")
      } yield {
        models.Utils.getDBStringVal(row, vertica.user.Col_email, "")
      }).distinct
      usersList
    } else List()
  }

  def getClinsightsMenuItems(): List[ClinsightMenuItem] = {
    val rows = vertica.clinsights_master_menu.selectRows()
    log.debug(s"clinsight_master_menu rows size : ${rows.size}")
    (for {
      row <- rows
    } yield {
      val menu_id = models.Utils.getDBStringVal(row, vertica.clinsights_master_menu.Col_menu_id, "")
      val parentNodeId = models.Utils.getDBStringVal(row, vertica.clinsights_master_menu.Col_parent_node_id, "")
      val sequence = models.Utils.getDBIntVal(row, vertica.clinsights_master_menu.Col_sequence)
      val name = models.Utils.getDBStringVal(row, vertica.clinsights_master_menu.Col_name, "")
      val reportUrl = models.Utils.getDBStringVal(row, vertica.clinsights_master_menu.Col_report_url, "")
      val parent_node_id = if(parentNodeId.equals("")) None else Some(parentNodeId)
      ClinsightMenuItem(menu_id, parent_node_id, sequence, name, reportUrl, false)
    })
  }

  def createNodeRow(node: ClinsightMenuNodeOp, tab_type: String, tab_op_type: String) = {
    val access_end_time = node.access_end_date match{
      case Some(t) => Some(t.getTime())
      case _ => None
    }
    tab_type match {
      case TAB_MPS =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.insertRow(node.mps, node.id.getOrElse(""), access_end_time)
          case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.insertRow(node.mps, node.id.getOrElse(""), access_end_time)
        }
      case TAB_ROLE =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_role_menu_node_hide.insertRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""), access_end_time)
          case TAB_OP_DISABLE => vertica.clinsights_role_menu_node_disable.insertRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""), access_end_time)
        }
    }
  }

  def readNodeRowsByTime(mpsOpt: Option[String], roleOpt: Option[Long], tab_type: String, tab_op_type: String) = {
    val mps = mpsOpt.getOrElse("")
    val role_id = roleOpt.getOrElse(CVDefaultLong)
    tab_type match {
      case TAB_MPS =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.selectRowsByTime(mps)
          case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.selectRowsByTime(mps)
          case _ => List()
        }
      case TAB_ROLE =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_role_menu_node_hide.selectRowsByTime(role_id)
          case TAB_OP_DISABLE => vertica.clinsights_role_menu_node_disable.selectRowsByTime(role_id)
          case _ => List()
        }
    }
  }

  def readNodeRows(mpsOpt: Option[String], roleOpt: Option[Long], tab_type: String, tab_op_type: String) = {
    val mps = mpsOpt.getOrElse("")
    val role_id = roleOpt.getOrElse(CVDefaultLong)
    tab_type match {
      case TAB_MPS =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.selectRows(mps)
          case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.selectRows(mps)
          case _ => List()
        }
      case TAB_ROLE =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_role_menu_node_hide.selectRows(role_id)
          case TAB_OP_DISABLE => vertica.clinsights_role_menu_node_disable.selectRows(role_id)
          case _ => List()
        }
    }
  }

  def updateNodeRow(node: ClinsightMenuNodeOp, tab_type: String, tab_op_type: String) = {
    val access_end_time = node.access_end_date match{
      case Some(t) => Some(t.getTime())
      case _ => None
    }
    tab_type match {
      case TAB_MPS =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.updateRow(node.mps, node.id.getOrElse(""), access_end_time)
          case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.updateRow(node.mps, node.id.getOrElse(""), access_end_time)
        }
      case TAB_ROLE =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_role_menu_node_hide.updateRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""), access_end_time)
          case TAB_OP_DISABLE => vertica.clinsights_role_menu_node_disable.updateRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""), access_end_time)
        }
    }
  }

  def deleteNodeRow(node: ClinsightMenuNodeOp, tab_type: String, tab_op_type: String) = {
    tab_type match {
      case TAB_MPS =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.deleteRow(node.mps, node.id.getOrElse(""))
          case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.deleteRow(node.mps, node.id.getOrElse(""))
        }
      case TAB_ROLE =>
        tab_op_type match {
          case TAB_OP_HIDE => vertica.clinsights_role_menu_node_hide.deleteRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""))
          case TAB_OP_DISABLE => vertica.clinsights_role_menu_node_disable.deleteRow(node.clinsights_role_id.getOrElse(CVDefaultLong), node.id.getOrElse(""))
        }
    }
  }

  def createMpsNodeHide(nodeList: List[ClinsightMenuNodeOp], tab_type: String, tab_op_type: String):List[ClinsightMenuNodeOp] = {
    nodeList.foreach({node =>
      val nodeRows = readNodeRows(Some(node.mps), None, tab_type, tab_op_type)
      if(nodeRows.size == 0){
        if(node.id.getOrElse("").equals("")) throw new RuntimeException("Node id can't be empty")
        createNodeRow(node, tab_type, tab_op_type)
      } else{
        log.error(s"Node already exists in DB: $node")
      }
    })
    nodeList
  }

  def readMpsNodeHide(nodeList: List[ClinsightMenuNodeOp], tab_type: String, tab_op_type: String):List[ClinsightMenuNodeOp] = {
    val col = tab_op_type match {
      case TAB_OP_HIDE => vertica.clinsights_mps_menu_node_hide.Col_menu_id
      case TAB_OP_DISABLE => vertica.clinsights_mps_menu_node_disable.Col_menu_id
    }
    nodeList.foreach({node =>
      val nodeRows = readNodeRows(Some(node.mps), None, tab_type, tab_op_type)
      for {
        row <- nodeRows
        if !models.Utils.getDBStringVal(row, col, "").equals("")
      } yield {
        val node_id = models.Utils.getDBStringVal(row, col, "")
        ClinsightMenuNodeOp(node.mps, Some(node_id), None, None)
      }
    })
    nodeList
  }

  def updateMpsNodeHide(nodeList: List[ClinsightMenuNodeOp], tab_type: String, tab_op_type: String):List[ClinsightMenuNodeOp] = {
    nodeList.foreach({node =>
      val nodeRows = readNodeRows(Some(node.mps), None, tab_type, tab_op_type)
      if(nodeRows.size == 0){
        log.error(s"Node doesn't exists in DB: $node")
      } else {
        if(node.id.getOrElse("").equals("")) throw new RuntimeException("Node id can't be empty")
        updateNodeRow(node, tab_type, tab_op_type)
      }
    })
    nodeList
  }

  def deleteMpsNodeHide(nodeList: List[ClinsightMenuNodeOp], tab_type: String, tab_op_type: String):List[ClinsightMenuNodeOp] = {
    nodeList.foreach({node =>
      val nodeRows = readNodeRows(Some(node.mps), None, tab_type, tab_op_type)
      if(nodeRows.size == 0){
        log.error(s"Node doesn't exists in DB: $node")
      } else {
        if(node.id.getOrElse("").equals("")) throw new RuntimeException("Node id can't be empty")
        deleteNodeRow(node, tab_type, tab_op_type)
      }
    })
    nodeList
  }

  def getDashboardReportUrl(mps: String): (String, String) = {
    val dashobardRows = vertica.clinsights_dashboard.selectRows(mps)
    val (base_url, landing_page_url_id) = if(dashobardRows.size > 0){
      (models.Utils.getDBStringVal(dashobardRows.head, vertica.clinsights_dashboard.Col_base_url, ""), models.Utils.getDBStringVal(dashobardRows.head, vertica.clinsights_dashboard.Col_landing_page_report_url_id, ""))
    } else ("", "")
    val landing_page_url = if(!landing_page_url_id.equals("")){
      val reportRows = vertica.clinsights_master_menu.selectRowsByMenuId(landing_page_url_id)
      models.Utils.getDBStringVal(reportRows.head, vertica.clinsights_master_menu.Col_report_url)
    } else ""
    (base_url, landing_page_url)
  }

  def getClinsightsDetails(mps: String, rows: List[Map[String, Option[Any]]]): ClinsightsRoleDetails = {
    val (base_url, dashboard_landing_page_url) = DBUtils.getDashboardReportUrl(mps)
    val id = models.Utils.getDBLongVal(rows.head, vertica.clinsights_role.Col_clinsights_role_id)
    val name = models.Utils.getDBStringVal(rows.head, vertica.clinsights_role.Col_clinsights_role_name, "")
    val msg = models.Utils.getDBStringVal(rows.head, vertica.clinsights_role.Col_inactive_dashboard_message, "")
    val landing_page_url_id = models.Utils.getDBStringVal(rows.head, vertica.clinsights_role.Col_landing_page_report_url_id, "")
    val landing_page_url = if(landing_page_url_id.equals("")){
      dashboard_landing_page_url
    } else {
      val reportRows = vertica.clinsights_master_menu.selectRowsByMenuId(landing_page_url_id)
      models.Utils.getDBStringVal(reportRows.head, vertica.clinsights_master_menu.Col_report_url, "")
    }
    ClinsightsRoleDetails(Some(id), Some(name), Some(msg), Some(landing_page_url))
  }

  def clinsightsRoleDetails(mps: String, uRows: List[Map[String, Option[Any]]], rRows: List[Map[String, Option[Any]]]): ClinsightsRoleDetails = {
    if(uRows.size > 0){
      getClinsightsDetails(mps, uRows)
    } else if(rRows.size > 0){
      getClinsightsDetails(mps, rRows)
    } else{
      ClinsightsRoleDetails(None, None, None, None)
    }
  }
}
