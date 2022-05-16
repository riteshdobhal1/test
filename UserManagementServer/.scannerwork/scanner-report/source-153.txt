package models

import dao.{DBUtils, vertica}
import play.api.Logger
import play.api.mvc.Cookie

import scala.util.{Failure, Success, Try}

case class SystemColsInfo(colName: String, colLabel: String)
case class SystemMpsCols(mfr: String, prod: String, sch: String, cols: List[SystemColsInfo])
case class MpsAvailableSystems(mfr: String, prod: String, sch: String, sysid_col_name: String, sysids: Seq[String])
case class PayloadData(data: Map[String, String])

object AdminCustomer {
  val log = Logger("Model_AdminCustomer")

  def ecSystemsListData(version: String, mfr: String, prod: String, sch: String, ec: String, st:Int, en:Int, queryData: Map[String, String], reqSessionOpt: Option[Cookie]): (Try[List[Map[String, String]]], Int) = {
    try {
      val sysColsInfoRows = vertica.bundle_columns.selectSysColsInfoRows(mfr, prod, sch)
      val columns = DBUtils.getBundleColumnsName(sysColsInfoRows)
      val sysInfoQueryParams = columns.foldLeft(Map[String, String]())((a, col_name) => if(queryData.contains(col_name)) a ++ Map(col_name -> queryData(col_name)) else a)
      val sysInfoRows = vertica.bundle.selectSysInfoRows(mfr, prod, sch, ec, st, en, sysInfoQueryParams, columns, reqSessionOpt)
      val systemInfoList = (for {
        row <- sysInfoRows
      } yield {
        columns.foldLeft(Map[String, String]())({(a, col_name) =>
          a ++ Map(col_name -> models.Utils.getDBStringVal(row, col_name, ""))
        })
      })
      val sysInfoRowsCount = vertica.bundle.getSearchSysInfoRowsCount(mfr, prod, sch, ec, st, en, sysInfoQueryParams, reqSessionOpt)
      (Success(systemInfoList), sysInfoRowsCount)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        (Failure(ex), 0)
      }
    }
  }

  def ecSystemsColsListData(version: String, mfr: String, prod: String, sch: String): Try[SystemMpsCols] = {
    try {
      val sysColsInfoRows = vertica.bundle_columns.selectSysColsInfoRows(mfr, prod, sch)
      val systemColsInfoList = (for {
        row <- sysColsInfoRows
        if !models.Utils.getDBStringVal(row, vertica.bundle_columns.Col_col_name, "").equals("")
      } yield {
        val colName = models.Utils.getDBStringVal(row, vertica.bundle_columns.Col_col_name, "")
        val colLabel = models.Utils.getDBStringVal(row, vertica.bundle_columns.Col_col_label, "")
        SystemColsInfo(colName, colLabel)
      })
      Success(SystemMpsCols(mfr, prod, sch, systemColsInfoList))
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def ecAvailableSystemsListData(version: String, mfr: String, prod: String, sch: String, mpsSysidsData: Seq[MpsAvailableSystems], reqSessionOpt: Option[Cookie]): Try[List[Map[String, String]]] = {
    try {
      val sytemInfoList = mpsSysidsData.foldLeft(List[Map[String, String]]())({ (a, mpsSysObj) =>
        val sysids = mpsSysObj.sysids
        val sysid_col_name = mpsSysObj.sysid_col_name
        val mps = s"${mpsSysObj.mfr}/${mpsSysObj.prod}/${mpsSysObj.sch}"
        val sysColsInfoRows = vertica.bundle_columns.selectSysColsInfoRows(mpsSysObj.mfr, mpsSysObj.prod, mpsSysObj.sch)
        val columns = DBUtils.getBundleColumnsName(sysColsInfoRows)
        val sysInfoRows = vertica.bundle.getSysInfoRows(mpsSysObj.mfr, mpsSysObj.prod, mpsSysObj.sch, sysid_col_name, sysids, columns, reqSessionOpt)
        val systemInfoList = (for {
          row <- sysInfoRows
        } yield {
          columns.foldLeft(Map[String, String]())({(acc, col_name) =>
            acc ++ Map(col_name -> models.Utils.getDBStringVal(row, col_name, ""))
          })
        })
        a ++ systemInfoList
      })
      Success(sytemInfoList)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def userECAvailableSystemsListData(mfr: String, prod: String, sch: String, email: String, reqSessionOpt: Option[Cookie]): Try[List[Map[String, String]]] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val sysRows = vertica.end_customer.selectUserGroupSysIds(email)
      val sysColsInfoRows = vertica.bundle_columns.selectSysColsInfoRows(mfr, prod, sch)
      val columns = DBUtils.getBundleColumnsName(sysColsInfoRows)
      val sysids = (for {
        row <- sysRows
        if !models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number, "").equals("")
      } yield {
        models.Utils.getDBStringVal(row, vertica.end_customer_serials.Col_serial_number, "")
      }).toSeq
      val sysInfoRows = vertica.bundle.getSysInfoRows(mfr, prod, sch, vertica.bundle.Col_sysid1, sysids, columns, reqSessionOpt)
      val systemInfoList = (for {
        row <- sysInfoRows
      } yield {
        columns.foldLeft(Map[String, String]())({(acc, col_name) =>
          acc ++ Map(col_name -> models.Utils.getDBStringVal(row, col_name, ""))
        })
      })
      Success(systemInfoList)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch email:$email, exception:  " + ex)
        Failure(ex)
      }
    }
  }

  def userEcSystemsListData(version: String, mfr: String, prod: String, sch: String, email: String, st:Int, en:Int, queryData: Map[String, String], reqSessionOpt: Option[Cookie]): (Try[List[Map[String, String]]], Int, String) = {
    try {
      val userGroupRows = vertica.user.selectUserGroupName(email)
      val userGroupName = if(userGroupRows.size > 0) models.Utils.getDBStringVal(userGroupRows.head, vertica.user.Col_end_customer, "") else ""
      if(userGroupName.equals("")){
        val res = ecSystemsListData(version, mfr, prod, sch, mfr, st, en, queryData, reqSessionOpt)
        (res._1, res._2, userGroupName)
      } else {
        val groupRows = vertica.end_customer.selectEndCustomerRows(mfr, prod, sch, userGroupName)
        val userGroupMps = if(groupRows.size > 0) models.Utils.getDBStringVal(groupRows.head, vertica.end_customer.Col_mps, "") else ""
        val grpList = models.vOrg.ecHealthCheck(mfr, prod, sch, None, None)
        if(grpList.size == 0 || userGroupMps.equals("") || !userGroupMps.equals(s"$mfr/$prod/$sch")){
          val res = ecSystemsListData(version, mfr, prod, sch, mfr, st, en, queryData, reqSessionOpt)
          (res._1, res._2, "")
        } else {
          val filterdGrpSysIdsList = grpList.filter(x => x.endcustomer_name.equals(userGroupName))
          val userGroupSysIdsList = if(filterdGrpSysIdsList.size > 0) filterdGrpSysIdsList.head.serial_number else List()
          val sysColsInfoRows = vertica.bundle_columns.selectSysColsInfoRows(mfr, prod, sch)
          val columns = DBUtils.getBundleColumnsName(sysColsInfoRows)
          val sysInfoQueryParams = columns.foldLeft(Map[String, String]())((a, col_name) => if (queryData.contains(col_name)) a ++ Map(col_name -> queryData(col_name)) else a)
          val bundleSysInfoRows = vertica.bundle.selectSysInfoRowsWithoutOffset(mfr, prod, sch, mfr, sysInfoQueryParams, columns, reqSessionOpt)
          val systemInfoList = (for {
            row <- bundleSysInfoRows
            sysId = models.Utils.getDBStringVal(row, vertica.bundle.Col_sysid1, "")
            if !sysId.equals("") && userGroupSysIdsList.contains(sysId)
          } yield {
            columns.foldLeft(Map[String, String]())({ (a, col_name) =>
              a ++ Map(col_name -> models.Utils.getDBStringVal(row, col_name, ""))
            })
          })
          (Success(systemInfoList.slice(st, en + 1)), systemInfoList.size, userGroupName)
        }
      }
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        (Failure(ex), 0, "")
      }
    }
  }
}
