package dao.vertica

import play.api.Logger
import constants._
import models.DB
import dao.DBUtils

object features {
  val log = Logger("Dao_FEATURES")

  /* start : columns of features table*/
  lazy val Col_feature_id = "feature_id"
  lazy val Col_feature_name = "feature_name"
  lazy val Col_feature_label = "feature_label"
  lazy val Col_active = "active"
  /* end : columns of features table*/

  def selectRow(feature_id: String): List[Map[String, Option[Any]]] = {
    try {
      val q = s"SELECT * FROM $KsUMS.$CFNRole where $Col_feature_id=?;"
      val rows = DB.selectQueryResult(q,List(feature_id))
      rows
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting row from {$KsUMS.$CFNFeatures} table : $feature_id, ex: " + ex)
        List()
      }
    }
  }

  def selectFeatureIds(featureList: List[String]): List[Map[String, Option[Any]]] = {
    try {
      val features = DBUtils.scalaTosqlList(featureList)
      val q = s"SELECT $Col_feature_id from $KsUMS.$CFNFeatures WHERE $Col_feature_name IN ($features);"
      val res = DB.selectQueryResult(q,List())
      res
    } catch {
      case ex: Exception => {
        log.error(s"Exception thrown while selecting entry from {$KsUMS.$CFNFeatures} table : $featureList, ex: " + ex)
        List()
      }
    }
  }

}
