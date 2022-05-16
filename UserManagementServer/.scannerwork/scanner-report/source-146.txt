package models

import play.api.Logger
import play.api.libs.ws.WS
import play.api.mvc.Cookie
import play.api.Play.current

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global

object SystemAnalyst {
  val log = Logger("Model_SystemAnalyst")

  def ecSystemsListFiltered(version: String, mfr: String, prod: String, sch: String, ec: String, st:Int, en:Int, pattern:Option[String], rt:Option[String], reqSessionOpt: Option[Cookie]): (String, List[String], String) = {
    try {
      val IS_Host = version match{
        case constants.VERTICA_VERSION => models.Utils.vGetISURLDomain(mfr, prod, sch)
        case _ => models.Utils.getISURLDomain(mfr, prod, sch)
      }
      val queryPattern = pattern match {
        case Some(s) => s
        case _ => ""
      }
      val queryRt = rt match {
        case Some(s) => s
        case _ => ""
      }
      val IS_Url = s"$IS_Host/analytics/system/ec/list/$mfr/$prod/$sch/$ec/$st/$en"
      val IS_URL_pattern = if(!queryPattern.equals("")) s"$IS_Url?pattern=$queryPattern" else IS_Url
      val IS_URL_rt = if(!queryRt.equals("")) s"$IS_URL_pattern?rt=$queryRt" else IS_URL_pattern
      val reqSession = reqSessionOpt.get
      val futureResponse = WS.url(IS_URL_rt).withHeaders(("Cookie", reqSession.name + "=" + reqSession.value)).get.map { response =>
        response.statusText match {
          case "OK" =>
            val sysidsList = (response.json \ "Data").get.as[List[String]]
            val msg = (response.json \ "Msg").get.as[String]
            ("SUCCESS", sysidsList, msg)
          case _ =>
            log.debug(s"Failed to fetch sysids list from IS [$mfr:$prod:$sch]")
            ("FAILURE", List(), "")
        }
      }
      val wsResponse = Await.result(futureResponse, scala.concurrent.duration.Duration.Inf)
      (wsResponse._1, wsResponse._2, wsResponse._3)
    } catch {
      case ex: Exception => {
        log.error(s"[$mfr/$prod/$sch] - UMS : Exception thrown while fetching system list for mfr:$mfr prod:$prod sch:$sch, exception:  " + ex)
        ("FAILURE", List(), "")
      }
    }
  }
}
