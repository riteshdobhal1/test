package dao.vertica
import constants.KsUMS
import dao.DBUtils
import play.api.Logger
import models.DB
import constants._

object bundle_columns {
  val log = Logger("Dao_BUNDLE_COLUMNS")

  /* start : columns of bundle table*/
  lazy val Col_col_name = "col_name"
  lazy val Col_col_label = "col_label"
  lazy val Col_mps = "mps"
  /* end : columns of bundle table*/
  val CFNBundleColumns = "bundle_columns"

  def selectSysColsInfoRows(mfr: String, prod: String, sch: String): List[Map[String, Option[Any]]] = {
    try {
      val mps = s"$mfr/$prod/$sch"
      val q = s"SELECT $Col_col_name, $Col_col_label, $Col_mps FROM $KsUMS.$CFNBundleColumns WHERE $Col_mps=? LIMIT $COL_BUNDLE_FIELDS_LMT;"
      val rows = DB.selectQueryResult(q, List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting rows from {$KsUMS.$CFNBundleColumns} table for mps: $mps, ex: " + ex)
        List()
      }
    }
  }
}
