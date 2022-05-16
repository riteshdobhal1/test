package dao.vertica

import play.api.Logger
import constants._
import models.DB

object file_upload_form {
  val log = Logger("Dao_FILE_UPLOAD_FORM")

  /* start : columns of file_upload_form table*/
  lazy val Col_mps = "mps"
  lazy val Col_field_id = "field_id"
  lazy val Col_field_name = "field_name"
  lazy val Col_field_label = "field_label"
  lazy val Col_field_type = "field_type"
  lazy val Col_field_data = "field_data"
  lazy val Col_is_required = "is_required"
  /* end : columns of file_upload_form table*/

}
