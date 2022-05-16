package dao.vertica

import play.api.Logger
import constants._
import models.DB

object mps {
  val log = Logger("Dao_MPS")

  /* start : columns of mps table*/
  lazy val Col_mps = "mps"
  lazy val Col_mfr_id = "mfr_id"
  lazy val Col_mps_label = "mps_label"
  /* end : columns of mps table*/

  def selectRow(mps: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRole where $Col_mps=?;"
      val rows = DB.selectQueryResult(q,List(mps))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNMps} table : $mps, ex: " + ex)
        List()
      }
    }
  }

}
