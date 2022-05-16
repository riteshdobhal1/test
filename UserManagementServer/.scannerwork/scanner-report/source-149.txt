package models

import constants.{CVDefaultBool, CVDefaultDate, CVDefaultInt, CVDefaultLong}
import dao.{DBUtils, vertica}
import play.api.Logger
import constants._
import dao.DBUtils._

import java.util.Date
import scala.util.{Failure, Success, Try}

case class ClinsightMenuItem(id: String, parent_node_id: Option[String], seq: Int, name: String, report_url: String, disable: Boolean)
case class ClinsightMenuJson(user: Option[String], clinsights_role_name: Option[String], clinsights_role_id: Option[Long], clinsights_alert_msg: Option[String], clinsights_base_url: Option[String], clinsights_landing_page_url: Option[String], menu: Seq[TreeNode[ClinsightMenuItem]])
case class ClinsightMenuNodeOp(mps: String, id: Option[String], clinsights_role_id: Option[Long], access_end_date: Option[Date])
case class ClinsightFlatMenu(id: String, cat: String, cat_seq: Int, sub_cat1: Option[String], sub_cat1_seq: Option[Int], sub_cat2: Option[String], sub_cat2_seq: Option[Int], sub_cat3: Option[String], sub_cat3_seq: Option[Int], report_url: Option[String], disable: Option[Boolean], alert_msg: Option[String], clinsights_role_name: Option[String], clinsights_role_id: Option[Long])
case class ClinsightFlatMenuJson(user: Option[String], clinsights_role_name: Option[String], clinsights_role_id: Option[Long], clinsights_alert_msg: Option[String], clinsights_base_url: Option[String], clinsights_landing_page_url: Option[String], menu: Seq[ClinsightFlatMenu])
case class ClinsightsRoleDetails(clinsights_role_id: Option[Long], clinsights_role_name: Option[String], inactive_dashboard_message: Option[String], landing_page_url: Option[String])

object ClinsightMenu {
  val log = Logger("Model_ClinsightMenu")

  def clinsightsMasterTree(): Try[ClinsightMenuJson] = {
    try {
      val menuItems = DBUtils.getClinsightsMenuItems()
      val constructor = new TreeConstructor()
      val menuTree = constructor.construct[ClinsightMenuItem](menuItems, _.id, _.parent_node_id)
      val sortedMenuTree = menuTree.sortBy(r => (r.data.seq))
      log.debug(s"Clinsights master menu tree : $sortedMenuTree")
      val clinsightsObj = ClinsightMenuJson(None, None, None, None, None, None, sortedMenuTree)
      Success(clinsightsObj)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while fetching clinsights mater menu, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsMpsTree(mfr: String, prod: String, sch: String, userOpt: Option[String], roleOpt: Option[Long]): Try[ClinsightMenuJson] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val (base_url, dashboard_landing_page_url) = DBUtils.getDashboardReportUrl(mps)
      val masterMenuItems = DBUtils.getClinsightsMenuItems()
      val mpsHideNodeRows = DBUtils.readNodeRowsByTime(Some(mps), None, TAB_MPS, TAB_OP_HIDE)
      val mpsHideNodeList = for(row <- mpsHideNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_mps_menu_node_hide.Col_menu_id, "")

      val userClinsightRoleRows = userOpt match{
        case Some(userName) => vertica.user.selectClinsightsRoleRows(userName)
        case _ => List()
      }

      val roleRows = roleOpt match{
        case Some(clinsights_role_id) => vertica.clinsights_role.selectRowsById(mps, clinsights_role_id)
        case _ => List()
      }

      val clinsightsRoleDetails = DBUtils.clinsightsRoleDetails(mps, userClinsightRoleRows, roleRows)

      val roleHideNodeList = userOpt match {
        case Some(userName) =>
          val clinsights_role_id = if(userClinsightRoleRows.size > 0) models.Utils.getDBLongVal(userClinsightRoleRows.head, vertica.clinsights_role.Col_clinsights_role_id) else CVDefaultLong
          val roleHideNodeRows = if(clinsights_role_id != CVDefaultLong) DBUtils.readNodeRowsByTime(None, Some(clinsights_role_id), TAB_ROLE, TAB_OP_HIDE) else List()
          for (row <- roleHideNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_role_menu_node_hide.Col_menu_id, "")
        case _ => roleOpt match {
          case Some(role_id) =>
            if(roleRows.size > 0){
              val clinsights_role_id = models.Utils.getDBLongVal(roleRows.head, vertica.clinsights_role.Col_clinsights_role_id)
              val roleHideNodeRows = DBUtils.readNodeRowsByTime(None, Some(clinsights_role_id), TAB_ROLE, TAB_OP_HIDE)
              for (row <- roleHideNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_role_menu_node_hide.Col_menu_id, "")
            } else{
              log.error(s"Hide : Role not found: $roleOpt")
              throw new RuntimeException(s"Hide : Role not found: $roleOpt")
            }
          case _ => List()
        }
      }

      val aggrHideNodeList = (mpsHideNodeList ++ roleHideNodeList).distinct

      val mpsDisableNodeRows = DBUtils.readNodeRowsByTime(Some(mps), None, TAB_MPS, TAB_OP_DISABLE)
      val mpsDisableNodeList = for(row <- mpsDisableNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_mps_menu_node_disable.Col_menu_id, "")

      val roleDisableNodeList = userOpt match {
        case Some(userName) =>
          val clinsights_role_id = if(userClinsightRoleRows.size > 0) models.Utils.getDBLongVal(userClinsightRoleRows.head, vertica.clinsights_role.Col_clinsights_role_id) else CVDefaultLong
          val roleDisableNodeRows = if(clinsights_role_id != CVDefaultLong) DBUtils.readNodeRowsByTime(None, Some(clinsights_role_id), TAB_ROLE, TAB_OP_DISABLE) else List()
          for (row <- roleDisableNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_role_menu_node_hide.Col_menu_id, "")
        case _ => roleOpt match {
          case Some(role_id) =>
            if(roleRows.size > 0){
              val clinsights_role_id = models.Utils.getDBLongVal(roleRows.head, vertica.clinsights_role.Col_clinsights_role_id)
              val roleDisableNodeRows = DBUtils.readNodeRowsByTime(None, Some(clinsights_role_id), TAB_ROLE, TAB_OP_DISABLE)
              for (row <- roleDisableNodeRows) yield models.Utils.getDBStringVal(row, vertica.clinsights_role_menu_node_disable.Col_menu_id, "")
            } else{
              log.error(s"Disable : Role not found: $roleOpt")
              throw new RuntimeException(s"Disable : Role not found: $roleOpt")
            }
          case _ => List()
        }
      }

      val aggrDisableNodeList = (mpsDisableNodeList ++ roleDisableNodeList).distinct

      val filteredMpsItems = masterMenuItems.filterNot(x => aggrHideNodeList.contains(x.id))
      val finalMenuItems = filteredMpsItems.foldLeft(List[ClinsightMenuItem]()){(acc, itr) =>
        if(aggrDisableNodeList.contains(itr.id)){
          acc ++ List(ClinsightMenuItem(itr.id, itr.parent_node_id, itr.seq, itr.name, itr.report_url, true))
        } else acc ++ List(itr)
      }

      val constructor = new TreeConstructor()
      val menuTree = constructor.construct[ClinsightMenuItem](finalMenuItems, _.id, _.parent_node_id)
      val sortedMenuTree = menuTree.sortBy(r => (r.data.seq))
      log.debug(s"Clinsights mps menu tree : $sortedMenuTree")
      val landing_page_report_url = clinsightsRoleDetails.landing_page_url match{
        case Some(x) => Some(x)
        case None => Some(dashboard_landing_page_url)
      }
      val clinsightsObj = ClinsightMenuJson(userOpt, clinsightsRoleDetails.clinsights_role_name, clinsightsRoleDetails.clinsights_role_id, clinsightsRoleDetails.inactive_dashboard_message, Some(base_url), landing_page_report_url, sortedMenuTree)
      Success(clinsightsObj)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while fetching clinsight menu items for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsMpsFlatMenu(mfr: String, prod: String, sch: String, user: Option[String], roleOpt: Option[Long]): Try[ClinsightFlatMenuJson] = {
    try {
      val treeMenuRes = clinsightsMpsTree(mfr, prod, sch, user, roleOpt)
      treeMenuRes match {
        case Success(treeMenu) =>
          var id = 0
          val flatTree = treeMenu.menu.toList.foldLeft(List[ClinsightFlatMenu]()) { (f, cat) =>
            id = id + 1
            if (cat.children.size > 0) {
              val res = f ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, None, None, None, None, None, None, None, Some(cat.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id))
              res ++ cat.children.toList.foldLeft(List[ClinsightFlatMenu]()) { (f1, sub_cat1) =>
                id = id + 1
                if (sub_cat1.children.size > 0) {
                  f1 ++ sub_cat1.children.toList.foldLeft(List[ClinsightFlatMenu]()) { (f2, sub_cat2) =>
                    id = id + 1
                    if (sub_cat2.children.size > 0) {
                      f2 ++ sub_cat2.children.toList.foldLeft(List[ClinsightFlatMenu]()) { (f3, sub_cat3) =>
                        id = id + 1
                        if (sub_cat3.children.size > 0) {
                          f3 ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, Some(sub_cat1.data.name), Some(sub_cat1.data.seq), Some(sub_cat2.data.name), Some(sub_cat2.data.seq), Some(sub_cat3.data.name), Some(sub_cat3.data.seq), None, Some(sub_cat3.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id));
                        } else {
                          f3 ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, Some(sub_cat1.data.name), Some(sub_cat1.data.seq), Some(sub_cat2.data.name), Some(sub_cat2.data.seq), Some(sub_cat3.data.name), Some(sub_cat3.data.seq), Some(sub_cat3.data.report_url), Some(sub_cat3.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id))
                        }
                      }
                    } else {
                      f2 ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, Some(sub_cat1.data.name), Some(sub_cat1.data.seq), Some(sub_cat2.data.name), Some(sub_cat2.data.seq), None, None, Some(sub_cat2.data.report_url), Some(sub_cat2.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id))
                    }
                  }
                } else {
                  f1 ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, Some(sub_cat1.data.name), Some(sub_cat1.data.seq), None, None, None, None, Some(sub_cat1.data.report_url), Some(sub_cat1.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id))
                }
              }
            } else {
              f ++ List(ClinsightFlatMenu(id.toString, cat.data.name, cat.data.seq, None, None, None, None, None, None, Some(cat.data.report_url), Some(cat.data.disable), treeMenu.clinsights_alert_msg, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id))
            }
          }
          Success(ClinsightFlatMenuJson(treeMenu.user, treeMenu.clinsights_role_name, treeMenu.clinsights_role_id, treeMenu.clinsights_alert_msg, treeMenu.clinsights_base_url, treeMenu.clinsights_landing_page_url, flatTree))
        case Failure(ex) =>
          throw new RuntimeException(s"Failed to get menu tree")
      }
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - Exception thrown while fetching clinsight menu items for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsMpsNodeHide(operation_type: String, payload: List[ClinsightMenuNodeOp]): Try[List[ClinsightMenuNodeOp]] = {
    try {
      val res = operation_type match {
        case CRUD_CREATE => createMpsNodeHide(payload, TAB_MPS, TAB_OP_HIDE)
        case CRUD_READ => readMpsNodeHide(payload, TAB_MPS, TAB_OP_HIDE)
        case CRUD_UPDATE => updateMpsNodeHide(payload, TAB_MPS, TAB_OP_HIDE)
        case CRUD_DELETE => deleteMpsNodeHide(payload, TAB_MPS, TAB_OP_HIDE)
      }
      Success(res)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while doing node hide operations of clinsights menu node(s): $payload, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsMpsNodeDisable(operation_type: String, payload: List[ClinsightMenuNodeOp]): Try[List[ClinsightMenuNodeOp]] = {
    try {
      val res = operation_type match {
        case CRUD_CREATE => createMpsNodeHide(payload, TAB_MPS, TAB_OP_DISABLE)
        case CRUD_READ => readMpsNodeHide(payload, TAB_MPS, TAB_OP_DISABLE)
        case CRUD_UPDATE => updateMpsNodeHide(payload, TAB_MPS, TAB_OP_DISABLE)
        case CRUD_DELETE => deleteMpsNodeHide(payload, TAB_MPS, TAB_OP_DISABLE)
      }
      Success(res)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while doing node disable operations of clinsights menu node(s): $payload, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsRoleNodeHide(operation_type: String, payload: List[ClinsightMenuNodeOp]): Try[List[ClinsightMenuNodeOp]] = {
    try {
      val res = operation_type match {
        case CRUD_CREATE => createMpsNodeHide(payload, TAB_ROLE, TAB_OP_HIDE)
        case CRUD_READ => readMpsNodeHide(payload, TAB_ROLE, TAB_OP_HIDE)
        case CRUD_UPDATE => updateMpsNodeHide(payload, TAB_ROLE, TAB_OP_HIDE)
        case CRUD_DELETE => deleteMpsNodeHide(payload, TAB_ROLE, TAB_OP_HIDE)
      }
      Success(res)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while doing node hide operations of clinsights menu node(s): $payload, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def clinsightsRoleNodeDisable(operation_type: String, payload: List[ClinsightMenuNodeOp]): Try[List[ClinsightMenuNodeOp]] = {
    try {
      val res = operation_type match {
        case CRUD_CREATE => createMpsNodeHide(payload, TAB_ROLE, TAB_OP_DISABLE)
        case CRUD_READ => readMpsNodeHide(payload, TAB_ROLE, TAB_OP_DISABLE)
        case CRUD_UPDATE => updateMpsNodeHide(payload, TAB_ROLE, TAB_OP_DISABLE)
        case CRUD_DELETE => deleteMpsNodeHide(payload, TAB_ROLE, TAB_OP_DISABLE)
      }
      Success(res)
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while doing node disable operations of clinsights menu node(s): $payload, exception:  " + ex)
        Failure(ex)
      }
    }
  }
}
