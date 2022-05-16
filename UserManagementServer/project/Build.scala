import sbt._
import Keys._
import AddSettings._
import play.sbt.PlayImport._
import scoverage.ScoverageSbtPlugin._
import com.typesafe.config._
//import scala.sys.process._

object ApplicationBuild extends Build {

  val conf            = ConfigFactory.parseFile(new File("conf/application.conf")).resolve()
  val appName         = conf.getString("application.name")
  val appVersion      = conf.getString("application.version")
  
  val testOptions = "-Dconfig.file=conf/" + Option(System.getProperty("test.config")).getOrElse("application") + ".conf"
  
  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    ws,
    cache, 
    filters,
    "org.mindrot" % "jbcrypt" % "0.3m",
    "org.apache.spark" %% "spark-core" % "2.4.5",
    "org.apache.spark" %% "spark-sql" % "2.4.5",
    "org.apache.spark" %% "spark-hive" % "2.4.5",
    "com.datastax.spark" %% "spark-cassandra-connector" % "2.4.2",
    "com.datastax.cassandra"  % "cassandra-driver-core"  % "3.0.2",
    "org.apache.cassandra"    % "cassandra-thrift"       % "3.0.2",
    "org.apache.cassandra"    % "cassandra-clientutil"   % "3.0.2",
    "com.typesafe.slick" %% "slick" % "2.1.0",
    "org.apache.commons" % "commons-email" % "1.4",
    "com.typesafe.akka"  %% "akka-actor" % "2.4.17",
    "com.typesafe.akka"  %% "akka-slf4j" % "2.4.17",
    "com.typesafe.akka"  %% "akka-remote" % "2.4.17",
    "com.typesafe"   % "config" % "1.3.2",
    "com.twilio.sdk" % "twilio" % "7.15.5" intransitive,
    "com.h2database" % "h2" % "1.4.196",
    "com.jason-goodwin" %% "authentikat-jwt" % "0.4.5",
    "org.glassfish" % "javax.json" % "1.0.4",
    "org.opensaml" %"opensaml" % "2.6.4",
    "org.json" %"json" % "20220320"
  )
  
  val main = Project(appName, file(".")).enablePlugins(play.PlayScala, sbtdocker.DockerPlugin).settings(
    version:= appVersion,
    scalaVersion := "2.11.8",
    libraryDependencies ++= appDependencies,
    
    resolvers += "Restlet Repository" at "http://maven.restlet.org",
    resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases",
    scalacOptions ++= Seq("deprecation","-unchecked","-feature"), 
    javaOptions in Test += testOptions,
    parallelExecution in Test := false,
    ScoverageKeys.coverageExcludedPackages := "<empty>;Reverse.*",
    publishArtifact in (Compile, packageDoc) := false,
    publishArtifact in packageDoc := false,
    sources in (Compile,doc) := Seq.empty
  )
}

object ColorFormatting {
  def textColor(color: Int) = {
    s"\033[38;5;${color}m"
  }

  def backgroundColor(color: Int) = {
    s"\033[48;5;${color}m"
  }

  def reset = {
    s"\033[0m"
  }

  def formatText(str: String)(txtColor: Int, backColor: Int) = {
    s"${textColor(txtColor)}${backgroundColor(backColor)}${str}${reset}"
  }

  def alertMsg(msg: String)(tColor: Int = 15, bColor: Int = 166) = println(formatText(msg)(tColor, bColor))

}
