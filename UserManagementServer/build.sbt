import ColorFormatting._
import sbtdocker.DockerKeys.dockerBuildAndPush

version := appVersion

lazy val cleanAll = taskKey[Unit]("Clean up")

lazy val gborg = "glassbeamorg"

cleanAll := {
  alertMsg("Executing clean tasks")()
  (clean in Compile).value
}

lazy val compileAll = taskKey[Unit]("Compiling")

compileAll := {
  alertMsg("Executing compile tasks")()
  (compile in Compile).value
}

lazy val gitCommitTask = taskKey[Unit]("Execute the Git Tasks")

gitCommitTask := {
  alertMsg("Executing GIT commitTask")()
  val changestxt = "CHANGES.txt"
  def executeGitJobs() {
    def getContent(str: String): String = {
      val line = scala.io.Source.stdin.getLines
      if (line.hasNext)
        getContent(str + "\n    " + line.next)
      else
        str + "\n\n"
    }
    
    println(s"Copying ${changestxt} to bin")
    val root: Project = Project(appName, file("."))
    val sourceRelFileLoc: File = root.base / "dist" / "bin" / changestxt
    alertMsg(s"Please Enter Valid Comments(Copy/Paste Git Comments/Write) Before Publishing A Build ${version.value}:: - Press Ctrl+D To Save It::")(15, 17)
    val content = getContent(s"${version.value}")
    val tmpFile = new File(s"/tmp/${version.value}.changes")
    IO.move(sourceRelFileLoc, tmpFile)
    println(s"File Moved from ${sourceRelFileLoc} => ${tmpFile}")
    IO.write(sourceRelFileLoc, content)
    IO.append(sourceRelFileLoc, IO.read(tmpFile))
    IO.delete(tmpFile)
  }
  
  

  executeGitJobs()
  val gitcmd = "git status -sb".!!
  val masterOrDefaultBranch = Option(gitcmd.split("\n").head.stripPrefix("## ").stripSuffix("...origin/master")).getOrElse("master")
  val root: Project = Project(appName, file("."))
  val filePath = root.base / "dist" / "bin" / changestxt
  val tmpFile = new File("/tmp/.__cmdlocal__.sh")
  println(s"Filepath = ${filePath}")
  val gitadd = s"git add ${filePath}\n"
  val gitcommit = s"git commit -m 'Automated Push From SBT, File: ${filePath}' -a \n"
  val gitpush = s"git push origin ${masterOrDefaultBranch} \n"
  val tagVal = "v" + version.value
  val gittag = s"git tag ${tagVal} \n"
  val gittagpush = s"git push origin ${tagVal} \n"
  IO.write(tmpFile, gitadd + gitcommit + gitpush + gittag + gittagpush)
  val chmodcmd = s"chmod +x ${tmpFile}"
  val execmd = s"sh -c ${tmpFile}"
  if ( (chmodcmd #&& execmd !) == 0 )
    alertMsg("Changes Committed Successfully to GIT")()
  else
    alertMsg("ERROR in Commit Task, Please Commit 'CHANGES.txt' Manually..")()
  IO.delete(tmpFile)
}

dockerfile in docker := {
  val appDir: File = stage.value
  val targetDir = "/app"
  new Dockerfile {
    from("glassbeamorg/centos6-java8")
    entryPoint(s"$targetDir/bin/$appName" , s"-Dconfig.file=$targetDir/conf/application-docker.conf", s"-Dlogger.resource=logger.xml", s"-Dlog.path=$targetDir", s"-Dhttp.port=9191")
    copy(appDir, targetDir)
  }
} 

imageNames in docker := Seq(
  ImageName(
    namespace = Some(gborg),
    repository = appName,
    tag = Some("v" + version.value)
  )
)

dockerExposedPorts in docker := Seq(9000, 9191)

lazy val buildAll = taskKey[Unit]("Build All")

buildAll := Def.sequential(cleanAll, compileAll, gitCommitTask, stage, dockerBuildAndPush).value

