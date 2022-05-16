package models

import play.api.Play
import constants._
import play.api.libs.json.Json

import scala.slick.jdbc.{GetResult, StaticQuery => Q}

object Settings {
  case class VertClusterHost(clusterId: Int, verticaHosts: String, verticaPort: Int, verticaDb: String, username: String, password: String)
  case class MPSVertConfig(mps: String, clusterId: Int, enabled: Boolean, schemaAppend: String)
  case class VertClusterHostDetailsMPS(mfr: String, prod: String, sch: String, ks: String, clusterId: Int, verticaHosts: String, verticaPort: Int, verticaDb: String, username: String, password: String)

//  val H2Config = Play.current.configuration.getConfig("h2").getOrElse(
//    throw new RuntimeException("h2 needs to be set in application conf for h2 database"))
//
//  val H2ConifDBUrl = H2Config.getString("config_db").getOrElse(
//    throw new RuntimeException("config_db needs to be set in application conf"))
//  val H2Driver = H2Config.getString("h2-driver").getOrElse(
//    throw new RuntimeException("h2-driver needs to be set in application conf"))

  implicit val vClusters = GetResult(r => VertClusterHost(r.<<, r.<<, r.<<, r.<<, r.<<, r.<<))
  implicit val vMPSConfig = GetResult(r => MPSVertConfig(r.<<, r.<<, r.<<, r.<<))
  implicit val vVertClusterHostDetails = GetResult(r => VertClusterHostDetailsMPS(r.<<, r.<<, r.<<, r.<<, r.<<, r.<<, r.<<, r.<<, r.<<, r.<<))

  implicit val VertClusterHostFormat = Json.format[VertClusterHostDetailsMPS]

  var vClusterList = List[VertClusterHost]()
  var vClusterHostMap = Map[Int, Map[String, Any]]()
  var mpsVertConfigList = List[MPSVertConfig]()
  var mpsVertConfigMap = Map[String, Map[String, Any]]()

  private def buildCidHostmap(m: VertClusterHost) = {
    def isNullOrEmpty(v: String) = v == null || v.isEmpty() ||  v.equals("") || v.equals(" ")

    val vId = m.clusterId
    val vHost = m.verticaHosts
    val vPort = m.verticaPort
    val vDB = m.verticaDb
    val username = m.username
    val password = m.password
    Map(vId -> Map("verticaHosts" -> vHost, "verticaPort" -> vPort, "verticaDb" -> vDB, "username" -> username, "password" -> password))
  }

  private def buildMpsVert(m: MPSVertConfig) = {
    def isNullOrEmpty(v: String) = v == null || v.isEmpty() ||  v.equals("") || v.equals(" ")
    def isNullOrFalse(v: Boolean) = v.equals(false)

    val mps = m.mps
    val clusterId = m.clusterId
    val enabled = if(isNullOrFalse(m.enabled)) false else true
    val schemaAppend = if(isNullOrEmpty(m.schemaAppend)) "_bc2r" else m.schemaAppend
    Map(mps -> Map("ClusterId" -> clusterId, "enabled" -> enabled, "schemaAppend" -> schemaAppend))
  }

  def init() = {
//    OpsDb.dbHandlerConfigDb("default").withSession { implicit session =>
//      vClusterList = Q.queryNA[VertClusterHost](s"""SELECT "$H2Col_ClusterId", "$H2Col_IPs", "$H2Col_VerticaPort", "$H2Col_VerticaDb", "$H2Col_Username", "$H2Col_Password" FROM $H2VertClusterConfig""").list
//    }
//
//    OpsDb.dbHandlerConfigDb("default").withSession { implicit session =>
//      mpsVertConfigList = Q.queryNA[MPSVertConfig](s"""SELECT "$H2Col_MPS", "$H2Col_ClusterId", "$H2Col_Enabled", "$H2Col_SchemaAppend" FROM $H2MPSVertConfig""").list
//    }

    mpsVertConfigMap = mpsVertConfigList.foldLeft(Map[String, Map[String, Any]]())((f, m) => f ++ buildMpsVert(m))
    vClusterHostMap = vClusterList.foldLeft(Map[Int, Map[String, Any]]())((f, m) => f ++ buildCidHostmap(m))
  }
}
