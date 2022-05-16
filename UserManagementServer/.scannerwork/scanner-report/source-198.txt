package dao.vertica
import dao.DBUtils
import play.api.Logger
import models.DB
import play.api.mvc.Cookie

object bundle {
  val log = Logger("Dao_BUNDLE")

  /* start : columns of bundle table*/
  lazy val Col_obs_ts = "obs_ts"
  lazy val Col_sysid1 = "sysid1"
  /* end : columns of bundle table*/
  val CFNBundle = "bundle"

  def selectSysInfoRows(mfr: String, prod: String, sch: String, ec: String, st: Int, en: Int, sysInfoQueryParams: Map[String, String], columns: List[String], reqSessionOpt: Option[Cookie]): List[Map[String, Option[Any]]] = {
    val clusterRes = models.Utils.getVerticaCusterDetailsForMps(mfr, prod, sch, reqSessionOpt)
    val ks = clusterRes._2.ks
    try {
      val lr = if(en > st) en-st else en
      val paramQuery = DBUtils.addToSQLQuery(sysInfoQueryParams)
      val columnsName = if(columns.size > 0) DBUtils.listToString(columns) else "*"
      val q = if(paramQuery.equals(""))
        s"SELECT $columnsName FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1) OFFSET $st LIMIT $lr;"
      else
        s"SELECT $columnsName FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1) AND $paramQuery OFFSET 0 LIMIT $en;"
      val rows = DB.selectClusterQueryResult(clusterRes._2, q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$ks.$CFNBundle} table, ex: " + ex)
        List()
      }
    }
  }

  def getSearchSysInfoRowsCount(mfr: String, prod: String, sch: String, ec: String, st: Int, en: Int, sysInfoQueryParams: Map[String, String], reqSessionOpt: Option[Cookie]): Int = {
    val clusterRes = models.Utils.getVerticaCusterDetailsForMps(mfr, prod, sch, reqSessionOpt)
    val ks = clusterRes._2.ks
    try {
      val paramQuery = DBUtils.addToSQLQuery(sysInfoQueryParams)
      val q = if(paramQuery.equals("")){
        s"SELECT COUNT(*) FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1);"
      } else {
        s"SELECT COUNT(*) FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1) AND $paramQuery;"
      }
      val rows = DB.selectClusterQueryResult(clusterRes._2, q, List())
      if(rows.size > 0) models.Utils.getDBIntVal(rows.head, "COUNT") else 0
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$ks.$CFNBundle} table, ex: " + ex)
        0
      }
    }
  }

  def getSysInfoRows(mfr: String, prod: String, sch: String, sysid_col_name: String, sysids: Seq[String], columns: List[String], reqSessionOpt: Option[Cookie]): List[Map[String, Option[Any]]] = {
    val clusterRes = models.Utils.getVerticaCusterDetailsForMps(mfr, prod, sch, reqSessionOpt)
    val ks = clusterRes._2.ks
    try {
      val sysidList = DBUtils.scalaTosqlList(sysids.toList)
      val columnsName = if(columns.size > 0) DBUtils.listToString(columns) else "*"
      val q = s"SELECT $columnsName FROM $ks.$CFNBundle WHERE ($sysid_col_name,$Col_obs_ts) IN (SELECT $sysid_col_name,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $sysid_col_name HAVING $sysid_col_name IN ($sysidList));"
      val rows = DB.selectClusterQueryResult(clusterRes._2, q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$ks.$CFNBundle} table, ex: " + ex)
        List()
      }
    }
  }

  def selectSysInfoRowsWithoutOffset(mfr: String, prod: String, sch: String, ec: String, sysInfoQueryParams: Map[String, String], columns: List[String], reqSessionOpt: Option[Cookie]): List[Map[String, Option[Any]]] = {
    val clusterRes = models.Utils.getVerticaCusterDetailsForMps(mfr, prod, sch, reqSessionOpt)
    val ks = clusterRes._2.ks
    try {
      val paramQuery = DBUtils.addToSQLQuery(sysInfoQueryParams)
      val columnsName = if(columns.size > 0) DBUtils.listToString(columns) else "*"
      val q = if(paramQuery.equals(""))
        s"SELECT $columnsName FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1);"
      else
        s"SELECT $columnsName FROM $ks.$CFNBundle WHERE ($Col_sysid1,$Col_obs_ts) IN (SELECT $Col_sysid1,MAX($Col_obs_ts) FROM $ks.$CFNBundle GROUP BY $Col_sysid1) AND $paramQuery;"
      val rows = DB.selectClusterQueryResult(clusterRes._2, q, List())
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows without offset from {$ks.$CFNBundle} table, ex: " + ex)
        List()
      }
    }
  }
}
