package dao.vertica

import play.api.Logger
import constants._
import models.DB

object mps_feature {
  val log = Logger("Dao_MPS_FEATURE")

  /* start : columns of mps_feature table*/
  lazy val Col_feature_id = "feature_id"
  lazy val Col_mfr_id = "mfr_id"
  lazy val Col_active = "active"
  /* end : columns of mps_feature table*/

}
