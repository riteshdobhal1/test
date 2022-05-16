package dao.vertica

import play.api.Logger
import constants._
import models.DB

object datasources {
  val log = Logger("Dao_DATASOURCES")

  /* start : columns of datasources table*/
  lazy val Col_permission_id = "permission_id"
  lazy val Col_mps = "mps"
  lazy val Col_feature_ids = "feature_ids"
  /* end : columns of datasources table*/

}
