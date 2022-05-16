package dao.vertica

import play.api.Logger
import constants._
import models.DB

object facet_order {
  val log = Logger("Dao_FEATURES")

  /* start : columns of facet_order table*/
  lazy val Col_mps = "mps"
  lazy val Col_facet_order = "facet_order"
  lazy val Col_facet_name = "facet_name"
  /* end : columns of facet_order table*/

}
