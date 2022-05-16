package dao.vertica

import play.api.Logger
import constants._
import dao.DBUtils
import dao.DBUtils.log
import dao.vertica
import dao.vertica.user.mapUserState
import models.DB
import dao.vertica

object role {
  val log = Logger("Dao_ROLE")

  /* start : columns of role table*/
  lazy val Col_role_id = "role_id"
  lazy val Col_role_name = "role_name"
  lazy val Col_super = "super"
  lazy val Col_permission_ids = "permission_ids"
  lazy val Col_max_limit_proj = "max_limit_proj"
  lazy val Col_two_auth_support = "two_auth_support"
  lazy val Col_mfr_id = "mfr_id"
  lazy val Col_clinsights_role_id = "clinsights_role_id"
  /* end : columns of role table*/

  def selectRows(): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRole;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRow(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      val q = s"SELECT * FROM $KsUMS.$CFNRole where $Col_role_name=?;"
      val rows = DB.selectQueryResult(q,List(roleName))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRole} table : $role, ex: " + ex)
        List()
      }
    }
  }

  def selectRoleIds(roleNames: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val rolesList = roleNames.mkString(",").replace(",", "','")
      val q = s"SELECT role_id FROM $KsUMS.$CFNRole where $Col_role_name IN ('" + rolesList + "') ;"
      val rows = DB.selectQueryResult(q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRole} table : $roleNames, ex: " + ex)
        List()
      }
    }
  }

  def selectRoleId(roleName: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT $CFNRole.$Col_role_id FROM $KsUMS.$CFNRole where $Col_role_name=?;"
      val rows = DB.selectQueryResult(q,List(roleName))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRole} table : $roleName, ex: " + ex)
        List()
      }
    }
  }

  def getRoleId(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      val q = s"SELECT $Col_role_id FROM $KsUMS.$CFNRole where $Col_role_name=?;"
      val rows = DB.selectQueryResult(q,List(roleName))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRole} table : $role, ex: " + ex)
        List()
      }
    }
  }

  def selectRowId(roleId: Long): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRole where $Col_role_id=?;"
      val rows = DB.selectQueryResult(q,List(roleId))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNRole} table : $roleId, ex: " + ex)
        List()
      }
    }
  }

  def isRowAvailable(roleName: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRole WHERE $Col_role_name = ?;"
      val res = DB.selectQueryResult(q,List(roleName.toLowerCase))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table : $roleName, ex: " + ex)
        List()
      }
    }
  }

  def deleteRow(roleName: String): Option[String] = {
    try {
      val q = s"DELETE FROM $KsUMS.$CFNRole WHERE $Col_role_name= ?;"
      val res = DB.deleteQueryResult(q,List(roleName.toLowerCase))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRole} table : $roleName, ex: " + ex)
        None
      }
    }
  }

  def deleteRows(roleNames: List[String]): Option[String] = {
    try {
      val roleNamesStr = roleNames.mkString(",").replace(",","','")
      val q = s"DELETE FROM $KsUMS.$CFNRole WHERE $Col_role_name IN ('" + roleNamesStr + "');"
      val res = DB.deleteQueryResult(q,List())
      res match {
        case Some(SQL_ERROR) => Some(SQL_ERROR)
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRole} table : $roleNames, ex: " + ex)
        Some(SQL_ERROR)
      }
    }
  }

  def deleteRowId(roleId: Long): Option[String] = {
    try {
      val q = s"DELETE FROM $KsUMS.$CFNRole WHERE $Col_role_id=?;"
      val res = DB.deleteQueryResult(q,List(roleId))
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while deleting entry from {$KsUMS.$CFNRole} table : $roleId, ex: " + ex)
        None
      }
    }
  }

  def insertRow(role: String, isSuper: Boolean, twoAuthSupport: List[String], mfrId: Int): Option[String] = {
    try{
      val mfr_id = mfrId match{
        case 0 => null
        case _ => mfrId
      }
      val roleName = role.toLowerCase()
      val two_auth_support = twoAuthSupport.mkString(",")
      val q = s"INSERT INTO $KsUMS.$CFNRole ($Col_role_name, $Col_super, $Col_two_auth_support, $Col_mfr_id) VALUES(?, ?, ?, ?);"
      val res = DB.insertQueryResult(q,List(roleName, isSuper, two_auth_support, mfr_id))
      res match {
        case Some(SQL_ERROR) => Some("Failed to update products to the role")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while inserting entry in {$KsUMS.$CFNRole} table, ex: " + ex)
        None
      }
    }
  }

  def updateRow(role: String, isSuper: Boolean, twoAuthSupport: List[String]): Option[Any] = {
    try {
      val roleName = role.toLowerCase()
      val two_auth_support = twoAuthSupport.mkString(",")
      val q = s"UPDATE $KsUMS.$CFNRole SET $Col_super=?, $Col_two_auth_support=? WHERE $Col_role_name=?;"
      val res = DB.updateQueryResult(q,List(isSuper,two_auth_support,roleName))
      res match {
        case Some(SQL_ERROR) => Some("Failed to update products to the role")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNRole} table : $role, ex: " + ex)
        None
      }
    }
  }

  def updateRoleFields(role: String, isSuper: Boolean): Option[Any] = {
    try {
      val roleName = role.toLowerCase()
      val q = s"UPDATE $KsUMS.$CFNRole SET $Col_super=? WHERE $Col_role_name=?;"
      val res = DB.updateQueryResult(q,List(isSuper,roleName))
      res match {
        case Some(SQL_ERROR) => Some("Failed to update products to the role")
        case _ => None
      }
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while updating entry in {$KsUMS.$CFNRole} table : $role, ex: " + ex)
        None
      }
    }
  }

  def selectRoleInfo(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      val q = s"SELECT $KsUMS.$CFNRole.${vertica.role.Col_role_id}, $KsUMS.$CFNRole.${vertica.role.Col_super}, $KsUMS.$CFNRole.${vertica.role.Col_max_limit_proj}, $KsUMS.$CFNRole.${vertica.role.Col_two_auth_support}, ${vertica.role.Col_role_name}, ${vertica.features.Col_feature_name}, ${vertica.features.Col_feature_label}, $KsUMS.$CFNMps.${vertica.mps.Col_mps}, $KsUMS.$CFNMps.${vertica.mps.Col_mps_label}, $KsUMS.$CFNRealm.${vertica.realm.Col_realm} FROM $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNMps, $KsUMS.$CFNFeatures, $KsUMS.$CFNRealm, $KsUMS.$CFNRoleRealms WHERE role.role_id = role_mps_features.role_id and ums.role_mps_features.mps = ums.mps.mps and ums.role_mps_features.feature_id = ums.features.feature_id and ums.role_realms.realm_id = ums.realm.realm_id and ${vertica.role.Col_role_name}='$roleName';"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def getCustomerRoleRowsData(roleList: List[Long], featureList: List[String], IncExc: String): List[Map[String, Option[Any]]] = {
    try {
      val featuresName = DBUtils.scalaTosqlList(featureList)
      val roleIds = DBUtils.scalaTosqlLongList(roleList)
      val incExcVal = IncExc match{
        case INCLUDE_TEXT => s"IN ($featuresName)"
        case _ => s"NOT IN ($featuresName)"
      }
      var q = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $KsUMS.$CFNMps.mps from $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNFeatures, $KsUMS.$CFNMps WHERE $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id and $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps and $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id and $KsUMS.$CFNFeatures.feature_name $incExcVal and $KsUMS.$CFNRole.$Col_role_id NOT IN ($roleIds);"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def getMfrFeaturesRoleRowsData(mfr: String, featureList: List[String], IncExc: String): List[Map[String, Option[Any]]] = {
    try {
      val featuresName = DBUtils.scalaTosqlList(featureList)
      val incExcVal = IncExc match{
        case INCLUDE_TEXT => s"IN ($featuresName)"
        case _ => s"NOT IN ($featuresName)"
      }
      var q = s"SELECT $KsUMS.$CFNRole.$Col_role_id, $Col_role_name, $KsUMS.$CFNMps.mps from $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNFeatures, $KsUMS.$CFNMps, $KsUMS.$CFNOrg WHERE $KsUMS.$CFNOrg.name='$mfr' and $KsUMS.$CFNOrg.mfr_id = $KsUMS.$CFNRole.$Col_mfr_id and $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id and $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps and $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id and $KsUMS.$CFNFeatures.feature_name $incExcVal;"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def getMfrRoleRowsData(mfr: String): List[Map[String, Option[Any]]] = {
    try {
//      val prevQuery = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $Col_super, $Col_max_limit_proj, $Col_two_auth_support, $KsUMS.$CFNMps.mps, $KsUMS.$CFNMps.mps_label, $KsUMS.$CFNFeatures.feature_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm, $KsUMS.$CFNRealm.ui_url, $KsUMS.$CFNRealm.is_url, $KsUMS.$CFNRealm.apps_version from $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNFeatures, $KsUMS.$CFNMps, $KsUMS.$CFNRoleRealms, $KsUMS.$CFNRealm, $KsUMS.$CFNOrg, $KsUMS.$CFNSsoDetails WHERE $KsUMS.$CFNOrg.name='$mfr' and $KsUMS.$CFNOrg.mfr_id = $KsUMS.$CFNRole.$Col_mfr_id and $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id and $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps and $KsUMS.$CFNRoleMpsFeatures.mps=$KsUMS.$CFNSsoDetails.mps and $KsUMS.$CFNSsoDetails.realm=$KsUMS.$CFNRealm.realm and $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleRealms.role_id and $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id;"
      val q = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $Col_super, $Col_max_limit_proj, $Col_two_auth_support, $KsUMS.$CFNMps.mps, $KsUMS.$CFNMps.mps_label, $KsUMS.$CFNFeatures.feature_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm, $KsUMS.$CFNRealm.ui_url, $KsUMS.$CFNRealm.is_url, $KsUMS.$CFNRealm.apps_version, $KsUMS.$CFNRoleMpsFeatureAttributes.$Col_role_id, ${vertica.role_mps_feature_attributes.Col_explorer_date_range} FROM $KsUMS.$CFNRole INNER JOIN $KsUMS.$CFNOrg ON $KsUMS.$CFNRole.$Col_mfr_id = $KsUMS.$CFNOrg.mfr_id INNER JOIN $KsUMS.$CFNRoleMpsFeatures ON $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.role_id INNER JOIN $KsUMS.$CFNSsoDetails ON $KsUMS.$CFNRoleMpsFeatures.mps=$KsUMS.$CFNSsoDetails.mps INNER JOIN $KsUMS.$CFNFeatures ON $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id INNER JOIN $KsUMS.$CFNMps ON $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps INNER JOIN $KsUMS.$CFNRealm ON $KsUMS.$CFNSsoDetails.realm=$KsUMS.$CFNRealm.realm INNER JOIN $KsUMS.$CFNRoleRealms ON $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleRealms.role_id LEFT OUTER JOIN $KsUMS.$CFNRoleMpsFeatureAttributes ON $KsUMS.$CFNRoleMpsFeatures.role_id = $KsUMS.$CFNRoleMpsFeatureAttributes.role_id AND $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNRoleMpsFeatureAttributes.mps AND $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNRoleMpsFeatureAttributes.feature_id WHERE $KsUMS.$CFNOrg.name='$mfr';"
      val rows = DB.selectQueryResult(q,List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def getSingleRoleRowsRealmUrlData(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      var q = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $Col_super, $Col_max_limit_proj, $Col_two_auth_support, $KsUMS.$CFNMps.mps, $KsUMS.$CFNMps.mps_label, $KsUMS.$CFNFeatures.feature_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm, $KsUMS.$CFNRealm.ui_url, $KsUMS.$CFNRealm.is_url, $KsUMS.$CFNRealm.apps_version from $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNFeatures, $KsUMS.$CFNMps, $KsUMS.$CFNRoleRealms, $KsUMS.$CFNRealm WHERE $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id and $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps and $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id and $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleRealms.role_id and $KsUMS.$CFNRoleRealms.realm_id=$KsUMS.$CFNRealm.realm_id and $KsUMS.$CFNRole.$Col_role_name = '$roleName';"
      val rows = DB.selectQueryResult(q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def getSingleRoleRowsMpsUrlData(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
//      val prevQuery = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $Col_super, $Col_max_limit_proj, $Col_two_auth_support, $KsUMS.$CFNMps.mps, $KsUMS.$CFNMps.mps_label, $KsUMS.$CFNFeatures.feature_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm, $KsUMS.$CFNRealm.ui_url, $KsUMS.$CFNRealm.is_url, $KsUMS.$CFNRealm.apps_version from $KsUMS.$CFNRole, $KsUMS.$CFNRoleMpsFeatures, $KsUMS.$CFNFeatures, $KsUMS.$CFNMps, $KsUMS.$CFNRoleRealms, $KsUMS.$CFNRealm, $KsUMS.$CFNSsoDetails WHERE $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id and $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps and $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id and $KsUMS.$CFNRoleMpsFeatures.mps=$KsUMS.$CFNSsoDetails.mps and $KsUMS.$CFNSsoDetails.realm=$KsUMS.$CFNRealm.realm and $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleRealms.role_id and $KsUMS.$CFNRole.$Col_role_name = '$roleName';"
      val q = s"SELECT Distinct($KsUMS.$CFNRole.$Col_role_id), $Col_role_name, $Col_super, $Col_max_limit_proj, $Col_two_auth_support, $KsUMS.$CFNMps.mps, $KsUMS.$CFNMps.mps_label, $KsUMS.$CFNFeatures.feature_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm, $KsUMS.$CFNRealm.ui_url, $KsUMS.$CFNRealm.is_url, $KsUMS.$CFNRealm.apps_version, ${vertica.role_mps_feature_attributes.Col_explorer_date_range} from $KsUMS.$CFNRole INNER JOIN $KsUMS.$CFNRoleMpsFeatures ON $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleMpsFeatures.$Col_role_id INNER JOIN ums.sso_details ON $KsUMS.$CFNRoleMpsFeatures.mps=$KsUMS.$CFNSsoDetails.mps INNER JOIN $KsUMS.$CFNFeatures ON $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNFeatures.feature_id INNER JOIN $KsUMS.$CFNMps ON $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNMps.mps INNER JOIN $KsUMS.$CFNRealm ON $KsUMS.$CFNSsoDetails.realm=$KsUMS.$CFNRealm.realm INNER JOIN $KsUMS.$CFNRoleRealms ON $KsUMS.$CFNRole.$Col_role_id=$KsUMS.$CFNRoleRealms.role_id LEFT OUTER JOIN $KsUMS.$CFNRoleMpsFeatureAttributes ON $KsUMS.$CFNRoleMpsFeatures.role_id = $KsUMS.$CFNRoleMpsFeatureAttributes.role_id AND $KsUMS.$CFNRoleMpsFeatures.mps = $KsUMS.$CFNRoleMpsFeatureAttributes.mps AND $KsUMS.$CFNRoleMpsFeatures.feature_id = $KsUMS.$CFNRoleMpsFeatureAttributes.feature_id WHERE $KsUMS.$CFNRole.$Col_role_name = '$roleName';"
      val rows = DB.selectQueryResult(q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }

  def selectRoleRealms(role: String): List[Map[String, Option[Any]]] = {
    try {
      val roleName = role.toLowerCase()
      var q = s"SELECT $KsUMS.$CFNRole.$Col_role_id, $Col_role_name, $KsUMS.$CFNRoleRealms.realm_id, $KsUMS.$CFNRealm.realm from $KsUMS.$CFNRole, $KsUMS.$CFNRoleRealms, $KsUMS.$CFNRealm WHERE $KsUMS.$CFNRole.$Col_role_id = $KsUMS.$CFNRoleRealms.role_id and $KsUMS.$CFNRoleRealms.realm_id = $KsUMS.$CFNRealm.realm_id and $KsUMS.$CFNRole.$Col_role_name = '$roleName';"
      val rows = DB.selectQueryResult(q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNRole} table, ex: " + ex)
        List()
      }
    }
  }
}
