package dao.vertica

import play.api.Logger
import constants._
import models.DB

object ui_config {
  val log = Logger("Dao_UI_CONFIG")

  /* start : columns of ui_config table*/
  lazy val Col_mps = "mps"
  lazy val Col_allowed_extension = "allowed_extension"
  lazy val Col_compound_rows = "compound_rows"
  lazy val Col_default_period_in_sec = "default_period_in_sec"
  lazy val Col_exp_display_fields = "exp_display_fields"
  lazy val Col_facet_limit = "facet_limit"
  lazy val Col_is_stage_domain = "is_stage_domain"
  lazy val Col_is_stage_keyspace = "is_stage_keyspace"
  lazy val Col_iv_display_fields = "iv_display_fields"
  lazy val Col_max_day_range = "max_day_range"
  lazy val Col_max_upload_size = "max_upload_size"
  lazy val Col_lv_to_exp = "lv_to_exp"
  lazy val Col_lv_to_iviewer = "lv_to_iviewer"
  lazy val Col_lv_to_apps = "lv_to_apps"
  lazy val Col_cluster_columns = "cluster_columns"
  lazy val Col_filter_columns = "filter_columns"
  lazy val Col_section_diff_keys = "section_diff_keys"
  lazy val Col_config_diff_keys = "config_diff_keys"
  /* end : columns of ui_config table*/

}
