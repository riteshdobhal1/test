import java.io.File

import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import play.api.Play.current
import play.api.http.HeaderNames
import play.api.Logger

import scala.util._
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import models._
import constants._
import play.libs.Akka
import play.api.libs.concurrent.Execution.Implicits._
import akka.actor.{Actor, Props}

case object UserExpires
case object LogoutMonitor
case object ChecknActivateUser

object Global extends WithFilters(CorsFilter) with GlobalSettings {
  
  def NoCache(action: EssentialAction): EssentialAction = EssentialAction { request =>
    action(request).map(x => x.withHeaders(HeaderNames.CACHE_CONTROL -> "max-age=0", HeaderNames.PRAGMA -> "no-cache"))
  }

  override def onStart(app: Application) {
    Logger.info("Application started...")
    //DS.init()
    //SparkDriver.init()
    //User.init()
    Utils.init()
//    Settings.init()
    val umsActor = Akka.system().actorOf(Props[UMSActor], name = "myactor")
    Akka.system().scheduler.scheduleOnce(0.seconds, umsActor, UserExpires)
    Akka.system().scheduler.scheduleOnce(0.seconds, umsActor, LogoutMonitor)
    Akka.system().scheduler.scheduleOnce(0.seconds, umsActor, ChecknActivateUser)
    Akka.system().scheduler.schedule(0.seconds, 24.hours, umsActor, UserExpires)
    Akka.system().scheduler.schedule(0.seconds, 5.minutes, umsActor, LogoutMonitor)
    Akka.system().scheduler.schedule(0.seconds, 5.minutes, umsActor, ChecknActivateUser)
  }

  override def onStop(app: Application) {
    //SparkDriver.shutdown()
    
    Logger.info("Application shutdown...")
  }

  override def onRouteRequest(request: RequestHeader): Option[Handler] = {
    Logger.info("Request URI: " + request.method + " " + request.uri)

    super.onRouteRequest(request).map { handler =>
      handler match {
        case a: EssentialAction => NoCache(a)
        case other => other
      }
    }
  }

  override def onHandlerNotFound(request: RequestHeader): Future[Result] = {
    Logger.info("Handler not found for request: " + request.method + " " + request.uri + ", userid: ".stripMargin + request.session.get(SKSessionId).getOrElse(SKUserId))

    Future.successful(NotFound(views.html.notFound(request.headers.get(SKUserId), request.headers.get(SKUserOrg), request.headers.get(SKUserRole), HttpStatus.NotFound, "Sorry, That wasn't found:   " + request.path)))
  }

}

object CorsFilter extends Filter {
  def apply (nextFilter: (RequestHeader) => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    nextFilter(requestHeader).map {result =>
      result.withHeaders(HeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN -> "*",
      HeaderNames.ALLOW -> "*" ,
      HeaderNames.ACCESS_CONTROL_ALLOW_METHODS -> "POST, GET, PUT, DELETE, OPTIONS",
      HeaderNames.ACCESS_CONTROL_ALLOW_HEADERS -> "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent")
      
    }
  }
}


class UMSActor extends Actor {
  private val log = Logger(classOf[UMSActor])
  lazy val schedulerFN = "SCHEDULER"
  lazy val schedulerFilePath: String = "bin/" + schedulerFN
  def receive = {
    case UserExpires =>
      val schedulerFile = new File(schedulerFilePath)
      if(!schedulerFile.exists()){
        models.vUser.checkExpiration
      }
    case LogoutMonitor => models.vUser.logoutIdle
    case ChecknActivateUser => models.vUser.checknActivateUser
  }
}
