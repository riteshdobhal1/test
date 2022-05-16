package models

// Use H2Driver to connect to an H2 database
import play.api.Logger

import scala.slick.driver.H2Driver.simple._
import scala.slick.jdbc.JdbcBackend
//import models.Settings.{H2ConifDBUrl, H2Driver}

object OpsDb {
  val log = Logger("Model_OpsDB")

  def dbHandlerConfigDb(key: String) = {
//    val H2Host = H2ConifDBUrl
//    Database.forURL(H2Host, driver = H2Driver)
  }
}
