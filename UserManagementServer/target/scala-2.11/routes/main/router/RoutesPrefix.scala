
// @GENERATOR:play-routes-compiler
// @SOURCE:/home/ritesh/development/UserManagementServer/conf/routes
// @DATE:Mon Apr 18 12:31:26 IST 2022


package router {
  object RoutesPrefix {
    private var _prefix: String = "/"
    def setPrefix(p: String): Unit = {
      _prefix = p
    }
    def prefix: String = _prefix
    val byNamePrefix: Function0[String] = { () => prefix }
  }
}
