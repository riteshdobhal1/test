
// @GENERATOR:play-routes-compiler
// @SOURCE:/home/ritesh/development/UserManagementServer/conf/routes
// @DATE:Mon Apr 18 12:31:26 IST 2022

package router

import play.core.routing._
import play.core.routing.HandlerInvokerFactory._
import play.core.j._

import play.api.mvc._

import _root_.controllers.Assets.Asset

object Routes extends Routes

class Routes extends GeneratedRouter {

  import ReverseRouteContext.empty

  override val errorHandler: play.api.http.HttpErrorHandler = play.api.http.LazyHttpErrorHandler

  private var _prefix = "/"

  def withPrefix(prefix: String): Routes = {
    _prefix = prefix
    router.RoutesPrefix.setPrefix(prefix)
    
    this
  }

  def prefix: String = _prefix

  lazy val defaultPrefix: String = {
    if (this.prefix.endsWith("/")) "" else "/"
  }

  def documentation: Seq[(String, String, String)] = List(
    ("""OPTIONS""", prefix, """controllers.Application.options(path:String = "")"""),
    ("""OPTIONS""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$path<.+>""", """controllers.Application.options(path:String)"""),
    ("""GET""", prefix, """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """login/index.html""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/users""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/roles""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/endcustomers""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/login""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/null""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/create-password""", """controllers.Application.index()"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/create-password/$token_id<[^/]+>/$email<[^/]+>/$domain<[^/]+>""", """controllers.Application.createpwd(token_id:String, email:String, domain:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/home/visitor""", """controllers.Application.vHome(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/home/user""", """controllers.Application.uHome(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/monitor""", """controllers.Application.monitor(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """gb/ui/prod/sso/testsso.cgi""", """controllers.CGIHandler.forward(serialNumber:Option[String], cust_name:Option[String], db:Option[String], sessionId:Option[String], serverUrl:Option[String], dashboardId:Option[String])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/startsso/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>""", """controllers.Callback.callback(version:String, mfr:String, prod:String, domain:String, code:Option[String])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/login""", """controllers.Application.login(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/uilogin""", """controllers.Application.uiLogin(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/logout""", """controllers.Application.logout(version:String, mps:Option[String], feature:Option[String])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/app_login""", """controllers.Application.appLogin(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/verifyOTP""", """controllers.Application.verifyOTP(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/resendOTP""", """controllers.Application.resendOTP(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/validate/access_token""", """controllers.Application.validateAccessToken(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/aa/updateloginsuccess""", """controllers.Application.updateLoginSuccess(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/xproxy""", """controllers.Application.xProxy(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/ec/list""", """controllers.AdminCustomer.list(version:String, is_request:Option[Boolean])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/ec/add""", """controllers.AdminCustomer.addForm(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/ec/add""", """controllers.AdminCustomer.add(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/ec/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$realm<[^/]+>""", """controllers.AdminCustomer.delete(version:String, mfr:String, prod:String, sch:String, ec:String, realm:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/mpse/config/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>""", """controllers.AdminCustomer.getMpseInfo(version:String, mfr:String, prod:String, sch:String, ec:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheck(version:String, mfr:String, prod:String, sch:String, user:Option[String], fnCallSrcOpt:Option[String])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/details/$mfr<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckMfr(version:String, mfr:String, user:Option[String], fnCallSrcOpt:Option[String])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/add/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckAdd(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/update/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckUpdate(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/addUser/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckAddUser(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/updateUser/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckUpdateUser(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckDelete(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/healthcheck/ec/delete/$mfr<[^/]+>""", """controllers.AdminCustomer.ecHealthCheckDeleteMFr(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/analytics/system/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$en<[^/]+>""", """controllers.AdminCustomer.ecSystemsListFiltered(version:String, mfr:String, prod:String, sch:String, ec:String, st:Int, en:Int, pattern:Option[String], rt:Option[String])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/list""", """controllers.AdminMfr.list(version:String, is_request:Option[Boolean])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/listall""", """controllers.AdminMfr.listall(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/add""", """controllers.AdminMfr.addForm(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/add""", """controllers.AdminMfr.add(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/addmfr/$mfr<[^/]+>""", """controllers.AdminMfr.addmfr(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/delete/$mfr<[^/]+>""", """controllers.AdminMfr.delete(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/realm/add/$mfr<[^/]+>""", """controllers.AdminMfr.manageRealm(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/realm/edit/$mfr<[^/]+>""", """controllers.AdminMfr.manageRealm(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/realm/list/$mfr<[^/]+>""", """controllers.AdminMfr.listRealm(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/defaultfeature/add/$mfr<[^/]+>""", """controllers.AdminMfr.manageDefaultFeature(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/defaultfeature/edit/$mfr<[^/]+>""", """controllers.AdminMfr.manageDefaultFeature(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/defaultfeature/list/$mfr<[^/]+>""", """controllers.AdminMfr.listDefaultFeature(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/uiconfig/add/$mfr<[^/]+>""", """controllers.AdminMfr.manageUiConfig(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/uiconfig/edit/$mfr<[^/]+>""", """controllers.AdminMfr.manageUiConfig(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/mfr/uiconfig/list/$mfr<[^/]+>""", """controllers.AdminMfr.listUiConfig(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/realm/add""", """controllers.AdminRealm.add(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/realm/edit""", """controllers.AdminRealm.edit(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/realm/list""", """controllers.AdminRealm.list(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/realm/delete/$realm<[^/]+>""", """controllers.AdminRealm.delete(version:String, realm:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/list""", """controllers.AdminUser.list(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/list/$mfr<[^/]+>""", """controllers.AdminUser.listByOrg(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/list/$mfr<[^/]+>""", """controllers.AdminUser.listByMfr(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/add""", """controllers.AdminUser.addForm(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/add""", """controllers.AdminUser.add(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/customer/user/add/$mfr<[^/]+>""", """controllers.AdminUser.addCustomerUserAdmin(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/customer/user/edit/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.editCustomerUserAdmin(version:String, usr:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/edit/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.editForm(version:String, usr:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/edit/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.edit(version:String, usr:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/user/remove/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.remove(version:String, usr:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/users/edit/$mfr<[^/]+>/$emails<[^/]+>""", """controllers.AdminUser.editMultiForm(version:String, mfr:String, emails:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/users/edit/$mfr<[^/]+>""", """controllers.AdminUser.editMulti(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/create/passwd""", """controllers.AdminUser.createPasswd(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/forgot/passwd/$usr<[^/]+>""", """controllers.AdminUser.forgotPasswd(version:String, usr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/change/passwd/$mfr<[^/]+>""", """controllers.AdminUser.changePasswd(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/update/defaults/$mfr<[^/]+>""", """controllers.AdminUser.updateDefaults(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/exists/$mfr<[^/]+>/$userid<[^/]+>""", """controllers.AdminUser.byEmail(version:String, mfr:String, userid:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/disable/info/$mfr<[^/]+>""", """controllers.AdminUser.disableInfo(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/eventexport/$limit<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.exportLimit(version:String, limit:Int, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/reset/passwd/$mfr<[^/]+>""", """controllers.AdminUser.resetPasswd(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/dashboardadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$userid<[^/]+>""", """controllers.AdminUser.isDashboardAdmin(version:String, mfr:String, prod:String, sch:String, userid:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/dashboardadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminUser.getDashboardAdminUsers(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/tableauadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminUser.getTableauAdminUsers(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/add/$mfr<[^/]+>""", """controllers.AdminUser.addCustomerUser(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/list/$mfr<[^/]+>""", """controllers.AdminUser.listCustomerUsers(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/listnonsso/$mfr<[^/]+>""", """controllers.AdminUser.listCustomerUsersNonSso(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/listsso/$mfr<[^/]+>""", """controllers.AdminUser.listCustomerUsersSso(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/listrulecreator/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminUser.listCustomerUsersRuleCreator(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/remove/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.removeCustomerUsers(version:String, usr:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/regenerate/verification/$email<[^/]+>""", """controllers.AdminUser.regenerateVerificationEmail(version:String, email:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/disable/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.disableCustomerUsers(version:String, usr:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/enable/$usr<[^/]+>/$mfr<[^/]+>""", """controllers.AdminUser.enableCustomerUsers(version:String, usr:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/modify/$mfr<[^/]+>""", """controllers.AdminUser.modifyCustomerUser(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/bulk_update/$mfr<[^/]+>""", """controllers.AdminUser.bulkUpdateCustomerUser(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/customer/user/bulk_delete/$mfr<[^/]+>""", """controllers.AdminUser.bulkDeleteCustomerUser(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/add""", """controllers.AdminRole.addForm(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/add/$roleName<[^/]+>""", """controllers.AdminRole.addDomain(version:String, roleName:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/edit/$roleName<[^/]+>/$domain<[^/]+>/$permissions<[^/]+>/$mps<[^/]+>/$realm<[^/]+>""", """controllers.AdminRole.edit(version:String, roleName:String, domain:String, permissions:String, mps:String, realm:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/add""", """controllers.AdminRole.add(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/add/$mfr<[^/]+>""", """controllers.AdminRole.addrole(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/modify/$mfr<[^/]+>""", """controllers.AdminRole.modifyRole(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/bulk_update/$mfr<[^/]+>""", """controllers.AdminRole.bulkUpdateRoleProducts(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/list""", """controllers.AdminRole.list(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/list/$mfr<[^/]+>""", """controllers.AdminRole.listall(version:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/delete/$roleName<[^/]+>""", """controllers.AdminRole.delete(version:String, roleName:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/delete/$roleName<[^/]+>/$mfr<[^/]+>""", """controllers.AdminRole.deleterole(version:String, roleName:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/usermanagement/role/product/delete/$roleName<[^/]+>/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.deleteRoleProduct(version:String, roleName:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/domains/$mfr<[^/]+>/$roleName<[^/]+>""", """controllers.AdminRole.domainsList(version:String, mfr:String, roleName:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/user/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.userDetails(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/names/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.listRoles(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/role/healthcheck/names/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.listHealthCheckRoles(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/tableau/tableauUpdateRole/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.tableauUpdateRole(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/tableau/tableauAddUpdateUsers/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.tableauAddUpdateUsers(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/tableau/tableauDeleteUsers/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.tableauDeleteUsers(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/admin/tableau/configured/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.isTableauConfigured(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/sso/soap/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>""", """controllers.SSOSoap.getUserInfo(version:String, mfr:String, prod:String, domain:String, sessionId:String, serverUrl:String, additional_params:String ?= null)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/sso/ping/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>""", """controllers.SSOPingone.getUserInfo(version:String, mfr:String, prod:String, domain:String, tokenid:String, agentid:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/sso/ping/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>/$dashboardId<[^/]+>""", """controllers.SSOPingoneEmbedded.getUserInfo(version:String, mfr:String, prod:String, domain:String, dashboardId:String, tokenid:String, agentid:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user_tracking/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$app<[^/]+>/$module<[^/]+>/$activity<[^/]+>""", """controllers.Application.trackUser(version:String, mfr:String, prod:String, sch:String, app:String, module:String, activity:String, switched_feature:Option[String])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user_tracking/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$et<[^/]+>""", """controllers.AdminUser.tsUserTracking(version:String, mfr:String, prod:String, sch:String, ec:String, st:String, et:String, col:List[String], filter:Option[String], aggr:Option[String], groupby:Option[String], orderby:Option[String], limit:Option[Integer])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/analytics/$sqlQuery<[^/]+>""", """controllers.Analytics.sql(version:String, sqlQuery:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/spark/refresh""", """controllers.Analytics.refreshSpark(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/analytics/hql/$hqlQuery<[^/]+>""", """controllers.Analytics.hql(version:String, hqlQuery:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/realm/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRealm.realmInfo(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """assets/$file<.+>""", """controllers.Assets.at(path:String = "/public", file:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/create/email""", """controllers.Clinsight.createMailWrapper(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/clinsight""", """controllers.Clinsight.clinsightView(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/login""", """controllers.Clinsight.login(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/userdetails""", """controllers.Clinsight.getUserDetails(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/setdefaultmps""", """controllers.Clinsight.setDefaultMPS(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/campaign/user/add""", """controllers.Clinsight.registerProspect(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/campaign/user/verification""", """controllers.Clinsight.verifyProspect(version:String, email:String, token_id:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/campaign/user/regenerate/verification/$email<[^/]+>""", """controllers.Clinsight.regenerateVerificationEmail(version:String, email:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/registration""", """controllers.Clinsight.clinsightRegistrationView(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user_info/delete/device_info""", """controllers.Clinsight.deleteUserDeviceInfo(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user_info/update/device_info""", """controllers.Clinsight.updateUserDeviceInfo(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/decrypt""", """controllers.AdminUser.decryptUser(version:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/tableau/user/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>""", """controllers.AdminUser.getTableauUsername(version:String, mfr:String, prod:String, sch:String, email:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/role/user/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminRole.userRoleDetails(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/master/menu/tree/$mfr<[^/]+>""", """controllers.ClinsightMenu.clinsightsMasterTree(version:String, mfr:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/mps/menu/tree/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.ClinsightMenu.clinsightsMpsTree(version:String, mfr:String, prod:String, sch:String, user:Option[String], clinsights_role_id:Option[Long])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/mps/menu/flat_json/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.ClinsightMenu.clinsightsMpsFlatMenu(version:String, mfr:String, prod:String, sch:String, user:Option[String], clinsights_role_id:Option[Long])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/$operation_type<[^/]+>/mps/menu/node/hide/$mfr<[^/]+>""", """controllers.ClinsightMenu.clinsightsMpsNodeHide(version:String, operation_type:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/$operation_type<[^/]+>/mps/menu/node/disable/$mfr<[^/]+>""", """controllers.ClinsightMenu.clinsightsMpsNodeDisable(version:String, operation_type:String, mfr:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/$operation_type<[^/]+>/role/menu/node/hide/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.ClinsightMenu.clinsightsRoleNodeHide(version:String, operation_type:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/$operation_type<[^/]+>/role/menu/node/disable/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.ClinsightMenu.clinsightsRoleNodeDisable(version:String, operation_type:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/mobile/login""", """controllers.Clinsight.mobileLogin(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/cs/mobile/userdetails/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.Clinsight.getUserMpsDetails(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/db/$sqlQuery<[^/]+>""", """controllers.SqlHelper.getQueryDB(version:String, sqlQuery:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/db""", """controllers.SqlHelper.queryDB(version:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/bundle/system_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$en<[^/]+>""", """controllers.AdminCustomer.ecSystemsListData(version:String, mfr:String, prod:String, sch:String, ec:String, st:Int, en:Int)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/bundle/system_cols_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecSystemsColsListData(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/bundle/available_system_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.AdminCustomer.ecAvailableSystemsListData(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/ec/available_system_info/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>""", """controllers.AdminCustomer.userECAvailableSystemsListData(version:String, mfr:String, prod:String, sch:String, email:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/user/ec/system_info/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$st<[^/]+>/$en<[^/]+>""", """controllers.AdminCustomer.userEcSystemsListData(version:String, mfr:String, prod:String, sch:String, email:String, st:Int, en:Int)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/rules/alerts/filters/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.RulesAlerts.alertFilterList(version:String, mfr:String, prod:String, sch:String, ruleId:Option[Long], user:Option[String])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/rules/alerts/filters/add_update/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.RulesAlerts.addUpdateAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/rules/alerts/filters/bulk_rules_delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.RulesAlerts.bulkRulesDeleteAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/rules/alerts/filters/bulk_users_delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.RulesAlerts.bulkUsersDeleteAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/rules/alerts/filters/group/users/notification/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>""", """controllers.RulesAlerts.sendNotification(version:String, mfr:String, prod:String, sch:String)"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>""", """controllers.Notification.notificationList(version:String, mfr:String, prod:String, sch:String, email:String, deleted:Option[Boolean], read:Option[Boolean])"""),
    ("""GET""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$st<[^/]+>/$en<[^/]+>""", """controllers.Notification.notificationPaginationList(version:String, mfr:String, prod:String, sch:String, email:String, st:Int, en:Int, deleted:Option[Boolean], read:Option[Boolean])"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/bulk_update/read/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$read<[^/]+>""", """controllers.Notification.updateNotificationsReadTime(version:String, mfr:String, prod:String, sch:String, email:String, read:Boolean)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/bulk_update/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$delete<[^/]+>""", """controllers.Notification.updateNotificationsDeletedTime(version:String, mfr:String, prod:String, sch:String, email:String, delete:Boolean)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/mark_all/read/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$read<[^/]+>""", """controllers.Notification.markAllNotificationsReadTime(version:String, mfr:String, prod:String, sch:String, email:String, read:Boolean)"""),
    ("""POST""", prefix + (if(prefix.endsWith("/")) "" else "/") + """$version<[^/]+>/notification/mark_all/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$delete<[^/]+>""", """controllers.Notification.markAllNotificationsDeletedTime(version:String, mfr:String, prod:String, sch:String, email:String, delete:Boolean)"""),
    Nil
  ).foldLeft(List.empty[(String,String,String)]) { (s,e) => e.asInstanceOf[Any] match {
    case r @ (_,_,_) => s :+ r.asInstanceOf[(String,String,String)]
    case l => s ++ l.asInstanceOf[List[(String,String,String)]]
  }}


  // @LINE:6
  private[this] lazy val controllers_Application_options0_route: Route.ParamsExtractor = Route("OPTIONS",
    PathPattern(List(StaticPart(this.prefix)))
  )
  private[this] lazy val controllers_Application_options0_invoker = createInvoker(
    controllers.Application.options(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "options",
      Seq(classOf[String]),
      "OPTIONS",
      """ INTERNAL: home page""",
      this.prefix + """"""
    )
  )

  // @LINE:7
  private[this] lazy val controllers_Application_options1_route: Route.ParamsExtractor = Route("OPTIONS",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("path", """.+""",false)))
  )
  private[this] lazy val controllers_Application_options1_invoker = createInvoker(
    controllers.Application.options(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "options",
      Seq(classOf[String]),
      "OPTIONS",
      """""",
      this.prefix + """$path<.+>"""
    )
  )

  // @LINE:9
  private[this] lazy val controllers_Application_index2_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix)))
  )
  private[this] lazy val controllers_Application_index2_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """"""
    )
  )

  // @LINE:10
  private[this] lazy val controllers_Application_index3_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("login/index.html")))
  )
  private[this] lazy val controllers_Application_index3_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """login/index.html"""
    )
  )

  // @LINE:11
  private[this] lazy val controllers_Application_index4_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/users")))
  )
  private[this] lazy val controllers_Application_index4_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/users"""
    )
  )

  // @LINE:12
  private[this] lazy val controllers_Application_index5_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/roles")))
  )
  private[this] lazy val controllers_Application_index5_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/roles"""
    )
  )

  // @LINE:13
  private[this] lazy val controllers_Application_index6_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/endcustomers")))
  )
  private[this] lazy val controllers_Application_index6_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/endcustomers"""
    )
  )

  // @LINE:14
  private[this] lazy val controllers_Application_index7_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/login")))
  )
  private[this] lazy val controllers_Application_index7_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/login"""
    )
  )

  // @LINE:15
  private[this] lazy val controllers_Application_index8_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/null")))
  )
  private[this] lazy val controllers_Application_index8_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/null"""
    )
  )

  // @LINE:16
  private[this] lazy val controllers_Application_index9_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/create-password")))
  )
  private[this] lazy val controllers_Application_index9_invoker = createInvoker(
    controllers.Application.index(),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "index",
      Nil,
      "GET",
      """""",
      this.prefix + """assets/create-password"""
    )
  )

  // @LINE:17
  private[this] lazy val controllers_Application_createpwd10_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/create-password/"), DynamicPart("token_id", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Application_createpwd10_invoker = createInvoker(
    controllers.Application.createpwd(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "createpwd",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """assets/create-password/$token_id<[^/]+>/$email<[^/]+>/$domain<[^/]+>"""
    )
  )

  // @LINE:22
  private[this] lazy val controllers_Application_vHome11_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/home/visitor")))
  )
  private[this] lazy val controllers_Application_vHome11_invoker = createInvoker(
    controllers.Application.vHome(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "vHome",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/home/visitor"""
    )
  )

  // @LINE:23
  private[this] lazy val controllers_Application_uHome12_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/home/user")))
  )
  private[this] lazy val controllers_Application_uHome12_invoker = createInvoker(
    controllers.Application.uHome(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "uHome",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/home/user"""
    )
  )

  // @LINE:24
  private[this] lazy val controllers_Application_monitor13_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/monitor")))
  )
  private[this] lazy val controllers_Application_monitor13_invoker = createInvoker(
    controllers.Application.monitor(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "monitor",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/monitor"""
    )
  )

  // @LINE:28
  private[this] lazy val controllers_CGIHandler_forward14_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("gb/ui/prod/sso/testsso.cgi")))
  )
  private[this] lazy val controllers_CGIHandler_forward14_invoker = createInvoker(
    controllers.CGIHandler.forward(fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.CGIHandler",
      "forward",
      Seq(classOf[Option[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[String]]),
      "GET",
      """""",
      this.prefix + """gb/ui/prod/sso/testsso.cgi"""
    )
  )

  // @LINE:30
  private[this] lazy val controllers_Callback_callback15_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/startsso/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Callback_callback15_invoker = createInvoker(
    controllers.Callback.callback(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Callback",
      "callback",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[String]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/startsso/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>"""
    )
  )

  // @LINE:33
  private[this] lazy val controllers_Application_login16_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/login")))
  )
  private[this] lazy val controllers_Application_login16_invoker = createInvoker(
    controllers.Application.login(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "login",
      Seq(classOf[String]),
      "POST",
      """ Authentication""",
      this.prefix + """$version<[^/]+>/aa/login"""
    )
  )

  // @LINE:34
  private[this] lazy val controllers_Application_uiLogin17_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/uilogin")))
  )
  private[this] lazy val controllers_Application_uiLogin17_invoker = createInvoker(
    controllers.Application.uiLogin(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "uiLogin",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/aa/uilogin"""
    )
  )

  // @LINE:36
  private[this] lazy val controllers_Application_logout18_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/logout")))
  )
  private[this] lazy val controllers_Application_logout18_invoker = createInvoker(
    controllers.Application.logout(fakeValue[String], fakeValue[Option[String]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "logout",
      Seq(classOf[String], classOf[Option[String]], classOf[Option[String]]),
      "GET",
      """ POST    /:version/aa/uiloginnew                                                            controllers.Application.uiLoginNew(version: String)""",
      this.prefix + """$version<[^/]+>/aa/logout"""
    )
  )

  // @LINE:38
  private[this] lazy val controllers_Application_appLogin19_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/app_login")))
  )
  private[this] lazy val controllers_Application_appLogin19_invoker = createInvoker(
    controllers.Application.appLogin(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "appLogin",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/aa/app_login"""
    )
  )

  // @LINE:40
  private[this] lazy val controllers_Application_verifyOTP20_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/verifyOTP")))
  )
  private[this] lazy val controllers_Application_verifyOTP20_invoker = createInvoker(
    controllers.Application.verifyOTP(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "verifyOTP",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/aa/verifyOTP"""
    )
  )

  // @LINE:41
  private[this] lazy val controllers_Application_resendOTP21_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/resendOTP")))
  )
  private[this] lazy val controllers_Application_resendOTP21_invoker = createInvoker(
    controllers.Application.resendOTP(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "resendOTP",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/aa/resendOTP"""
    )
  )

  // @LINE:44
  private[this] lazy val controllers_Application_validateAccessToken22_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/validate/access_token")))
  )
  private[this] lazy val controllers_Application_validateAccessToken22_invoker = createInvoker(
    controllers.Application.validateAccessToken(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "validateAccessToken",
      Seq(classOf[String]),
      "POST",
      """ mobile user token validation""",
      this.prefix + """$version<[^/]+>/aa/validate/access_token"""
    )
  )

  // @LINE:47
  private[this] lazy val controllers_Application_updateLoginSuccess23_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/aa/updateloginsuccess")))
  )
  private[this] lazy val controllers_Application_updateLoginSuccess23_invoker = createInvoker(
    controllers.Application.updateLoginSuccess(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "updateLoginSuccess",
      Seq(classOf[String]),
      "POST",
      """ update user if login is successfull""",
      this.prefix + """$version<[^/]+>/aa/updateloginsuccess"""
    )
  )

  // @LINE:50
  private[this] lazy val controllers_Application_xProxy24_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/xproxy")))
  )
  private[this] lazy val controllers_Application_xProxy24_invoker = createInvoker(
    controllers.Application.xProxy(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "xProxy",
      Seq(classOf[String]),
      "GET",
      """ INTERNAL-ONLY: XDomain""",
      this.prefix + """$version<[^/]+>/xproxy"""
    )
  )

  // @LINE:53
  private[this] lazy val controllers_AdminCustomer_list25_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/ec/list")))
  )
  private[this] lazy val controllers_AdminCustomer_list25_invoker = createInvoker(
    controllers.AdminCustomer.list(fakeValue[String], fakeValue[Option[Boolean]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "list",
      Seq(classOf[String], classOf[Option[Boolean]]),
      "GET",
      """ INTERNAL: end-customer management""",
      this.prefix + """$version<[^/]+>/admin/ec/list"""
    )
  )

  // @LINE:54
  private[this] lazy val controllers_AdminCustomer_addForm26_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/ec/add")))
  )
  private[this] lazy val controllers_AdminCustomer_addForm26_invoker = createInvoker(
    controllers.AdminCustomer.addForm(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "addForm",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/ec/add"""
    )
  )

  // @LINE:55
  private[this] lazy val controllers_AdminCustomer_add27_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/ec/add")))
  )
  private[this] lazy val controllers_AdminCustomer_add27_invoker = createInvoker(
    controllers.AdminCustomer.add(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "add",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/ec/add"""
    )
  )

  // @LINE:56
  private[this] lazy val controllers_AdminCustomer_delete28_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/ec/delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("ec", """[^/]+""",true), StaticPart("/"), DynamicPart("realm", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_delete28_invoker = createInvoker(
    controllers.AdminCustomer.delete(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "delete",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/ec/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$realm<[^/]+>"""
    )
  )

  // @LINE:57
  private[this] lazy val controllers_AdminCustomer_getMpseInfo29_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/mpse/config/details/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("ec", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_getMpseInfo29_invoker = createInvoker(
    controllers.AdminCustomer.getMpseInfo(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "getMpseInfo",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/mpse/config/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>"""
    )
  )

  // @LINE:58
  private[this] lazy val controllers_AdminCustomer_ecHealthCheck30_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/details/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheck30_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheck(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[String]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheck",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[String]], classOf[Option[String]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:59
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckMfr31_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/details/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckMfr31_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckMfr(fakeValue[String], fakeValue[String], fakeValue[Option[String]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckMfr",
      Seq(classOf[String], classOf[String], classOf[Option[String]], classOf[Option[String]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/details/$mfr<[^/]+>"""
    )
  )

  // @LINE:60
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckAdd32_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/add/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckAdd32_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckAdd(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckAdd",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/add/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:61
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckUpdate33_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/update/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckUpdate33_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckUpdate(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckUpdate",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/update/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:62
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckAddUser34_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/addUser/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckAddUser34_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckAddUser(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckAddUser",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/addUser/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:63
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckUpdateUser35_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/updateUser/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckUpdateUser35_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckUpdateUser(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckUpdateUser",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/updateUser/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:64
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckDelete36_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckDelete36_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckDelete(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckDelete",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:65
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckDeleteMFr37_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/healthcheck/ec/delete/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecHealthCheckDeleteMFr37_invoker = createInvoker(
    controllers.AdminCustomer.ecHealthCheckDeleteMFr(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecHealthCheckDeleteMFr",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/healthcheck/ec/delete/$mfr<[^/]+>"""
    )
  )

  // @LINE:66
  private[this] lazy val controllers_AdminCustomer_ecSystemsListFiltered38_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/analytics/system/ec/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("ec", """[^/]+""",true), StaticPart("/"), DynamicPart("st", """[^/]+""",true), StaticPart("/"), DynamicPart("en", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecSystemsListFiltered38_invoker = createInvoker(
    controllers.AdminCustomer.ecSystemsListFiltered(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Int], fakeValue[Int], fakeValue[Option[String]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecSystemsListFiltered",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Int], classOf[Int], classOf[Option[String]], classOf[Option[String]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/analytics/system/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$en<[^/]+>"""
    )
  )

  // @LINE:69
  private[this] lazy val controllers_AdminMfr_list39_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/list")))
  )
  private[this] lazy val controllers_AdminMfr_list39_invoker = createInvoker(
    controllers.AdminMfr.list(fakeValue[String], fakeValue[Option[Boolean]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "list",
      Seq(classOf[String], classOf[Option[Boolean]]),
      "GET",
      """ INTERNAL: manufacturer management""",
      this.prefix + """$version<[^/]+>/admin/mfr/list"""
    )
  )

  // @LINE:70
  private[this] lazy val controllers_AdminMfr_listall40_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/listall")))
  )
  private[this] lazy val controllers_AdminMfr_listall40_invoker = createInvoker(
    controllers.AdminMfr.listall(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "listall",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/listall"""
    )
  )

  // @LINE:71
  private[this] lazy val controllers_AdminMfr_addForm41_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/add")))
  )
  private[this] lazy val controllers_AdminMfr_addForm41_invoker = createInvoker(
    controllers.AdminMfr.addForm(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "addForm",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/add"""
    )
  )

  // @LINE:72
  private[this] lazy val controllers_AdminMfr_add42_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/add")))
  )
  private[this] lazy val controllers_AdminMfr_add42_invoker = createInvoker(
    controllers.AdminMfr.add(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "add",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/add"""
    )
  )

  // @LINE:73
  private[this] lazy val controllers_AdminMfr_addmfr43_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/addmfr/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_addmfr43_invoker = createInvoker(
    controllers.AdminMfr.addmfr(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "addmfr",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/addmfr/$mfr<[^/]+>"""
    )
  )

  // @LINE:74
  private[this] lazy val controllers_AdminMfr_delete44_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/delete/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_delete44_invoker = createInvoker(
    controllers.AdminMfr.delete(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "delete",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/delete/$mfr<[^/]+>"""
    )
  )

  // @LINE:75
  private[this] lazy val controllers_AdminMfr_manageRealm45_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/realm/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageRealm45_invoker = createInvoker(
    controllers.AdminMfr.manageRealm(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageRealm",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/realm/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:76
  private[this] lazy val controllers_AdminMfr_manageRealm46_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/realm/edit/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageRealm46_invoker = createInvoker(
    controllers.AdminMfr.manageRealm(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageRealm",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/realm/edit/$mfr<[^/]+>"""
    )
  )

  // @LINE:77
  private[this] lazy val controllers_AdminMfr_listRealm47_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/realm/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_listRealm47_invoker = createInvoker(
    controllers.AdminMfr.listRealm(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "listRealm",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/realm/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:78
  private[this] lazy val controllers_AdminMfr_manageDefaultFeature48_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/defaultfeature/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageDefaultFeature48_invoker = createInvoker(
    controllers.AdminMfr.manageDefaultFeature(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageDefaultFeature",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/defaultfeature/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:79
  private[this] lazy val controllers_AdminMfr_manageDefaultFeature49_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/defaultfeature/edit/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageDefaultFeature49_invoker = createInvoker(
    controllers.AdminMfr.manageDefaultFeature(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageDefaultFeature",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/defaultfeature/edit/$mfr<[^/]+>"""
    )
  )

  // @LINE:80
  private[this] lazy val controllers_AdminMfr_listDefaultFeature50_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/defaultfeature/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_listDefaultFeature50_invoker = createInvoker(
    controllers.AdminMfr.listDefaultFeature(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "listDefaultFeature",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/defaultfeature/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:81
  private[this] lazy val controllers_AdminMfr_manageUiConfig51_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/uiconfig/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageUiConfig51_invoker = createInvoker(
    controllers.AdminMfr.manageUiConfig(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageUiConfig",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/uiconfig/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:82
  private[this] lazy val controllers_AdminMfr_manageUiConfig52_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/uiconfig/edit/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_manageUiConfig52_invoker = createInvoker(
    controllers.AdminMfr.manageUiConfig(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "manageUiConfig",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/uiconfig/edit/$mfr<[^/]+>"""
    )
  )

  // @LINE:83
  private[this] lazy val controllers_AdminMfr_listUiConfig53_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/mfr/uiconfig/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminMfr_listUiConfig53_invoker = createInvoker(
    controllers.AdminMfr.listUiConfig(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminMfr",
      "listUiConfig",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/mfr/uiconfig/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:88
  private[this] lazy val controllers_AdminRealm_add54_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/realm/add")))
  )
  private[this] lazy val controllers_AdminRealm_add54_invoker = createInvoker(
    controllers.AdminRealm.add(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRealm",
      "add",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/realm/add"""
    )
  )

  // @LINE:89
  private[this] lazy val controllers_AdminRealm_edit55_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/realm/edit")))
  )
  private[this] lazy val controllers_AdminRealm_edit55_invoker = createInvoker(
    controllers.AdminRealm.edit(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRealm",
      "edit",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/realm/edit"""
    )
  )

  // @LINE:90
  private[this] lazy val controllers_AdminRealm_list56_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/realm/list")))
  )
  private[this] lazy val controllers_AdminRealm_list56_invoker = createInvoker(
    controllers.AdminRealm.list(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRealm",
      "list",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/realm/list"""
    )
  )

  // @LINE:91
  private[this] lazy val controllers_AdminRealm_delete57_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/realm/delete/"), DynamicPart("realm", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRealm_delete57_invoker = createInvoker(
    controllers.AdminRealm.delete(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRealm",
      "delete",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/realm/delete/$realm<[^/]+>"""
    )
  )

  // @LINE:95
  private[this] lazy val controllers_AdminUser_list58_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/list")))
  )
  private[this] lazy val controllers_AdminUser_list58_invoker = createInvoker(
    controllers.AdminUser.list(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "list",
      Seq(classOf[String]),
      "GET",
      """ INTERNAL: user management""",
      this.prefix + """$version<[^/]+>/admin/user/list"""
    )
  )

  // @LINE:96
  private[this] lazy val controllers_AdminUser_listByOrg59_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listByOrg59_invoker = createInvoker(
    controllers.AdminUser.listByOrg(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listByOrg",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:98
  private[this] lazy val controllers_AdminUser_listByMfr60_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listByMfr60_invoker = createInvoker(
    controllers.AdminUser.listByMfr(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listByMfr",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:101
  private[this] lazy val controllers_AdminUser_addForm61_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/add")))
  )
  private[this] lazy val controllers_AdminUser_addForm61_invoker = createInvoker(
    controllers.AdminUser.addForm(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "addForm",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/add"""
    )
  )

  // @LINE:102
  private[this] lazy val controllers_AdminUser_add62_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/add")))
  )
  private[this] lazy val controllers_AdminUser_add62_invoker = createInvoker(
    controllers.AdminUser.add(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "add",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/add"""
    )
  )

  // @LINE:103
  private[this] lazy val controllers_AdminUser_addCustomerUserAdmin63_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/customer/user/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_addCustomerUserAdmin63_invoker = createInvoker(
    controllers.AdminUser.addCustomerUserAdmin(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "addCustomerUserAdmin",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/customer/user/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:104
  private[this] lazy val controllers_AdminUser_editCustomerUserAdmin64_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/customer/user/edit/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_editCustomerUserAdmin64_invoker = createInvoker(
    controllers.AdminUser.editCustomerUserAdmin(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "editCustomerUserAdmin",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/customer/user/edit/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:105
  private[this] lazy val controllers_AdminUser_editForm65_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/edit/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_editForm65_invoker = createInvoker(
    controllers.AdminUser.editForm(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "editForm",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/edit/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:106
  private[this] lazy val controllers_AdminUser_edit66_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/edit/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_edit66_invoker = createInvoker(
    controllers.AdminUser.edit(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "edit",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/edit/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:107
  private[this] lazy val controllers_AdminUser_remove67_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/user/remove/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_remove67_invoker = createInvoker(
    controllers.AdminUser.remove(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "remove",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/user/remove/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:108
  private[this] lazy val controllers_AdminUser_editMultiForm68_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/users/edit/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("emails", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_editMultiForm68_invoker = createInvoker(
    controllers.AdminUser.editMultiForm(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "editMultiForm",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/users/edit/$mfr<[^/]+>/$emails<[^/]+>"""
    )
  )

  // @LINE:109
  private[this] lazy val controllers_AdminUser_editMulti69_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/users/edit/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_editMulti69_invoker = createInvoker(
    controllers.AdminUser.editMulti(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "editMulti",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/users/edit/$mfr<[^/]+>"""
    )
  )

  // @LINE:111
  private[this] lazy val controllers_AdminUser_createPasswd70_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/create/passwd")))
  )
  private[this] lazy val controllers_AdminUser_createPasswd70_invoker = createInvoker(
    controllers.AdminUser.createPasswd(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "createPasswd",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/create/passwd"""
    )
  )

  // @LINE:112
  private[this] lazy val controllers_AdminUser_forgotPasswd71_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/forgot/passwd/"), DynamicPart("usr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_forgotPasswd71_invoker = createInvoker(
    controllers.AdminUser.forgotPasswd(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "forgotPasswd",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/forgot/passwd/$usr<[^/]+>"""
    )
  )

  // @LINE:113
  private[this] lazy val controllers_AdminUser_changePasswd72_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/change/passwd/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_changePasswd72_invoker = createInvoker(
    controllers.AdminUser.changePasswd(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "changePasswd",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/change/passwd/$mfr<[^/]+>"""
    )
  )

  // @LINE:114
  private[this] lazy val controllers_AdminUser_updateDefaults73_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/update/defaults/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_updateDefaults73_invoker = createInvoker(
    controllers.AdminUser.updateDefaults(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "updateDefaults",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/update/defaults/$mfr<[^/]+>"""
    )
  )

  // @LINE:115
  private[this] lazy val controllers_AdminUser_byEmail74_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/exists/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("userid", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_byEmail74_invoker = createInvoker(
    controllers.AdminUser.byEmail(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "byEmail",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user/exists/$mfr<[^/]+>/$userid<[^/]+>"""
    )
  )

  // @LINE:116
  private[this] lazy val controllers_AdminUser_disableInfo75_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/disable/info/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_disableInfo75_invoker = createInvoker(
    controllers.AdminUser.disableInfo(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "disableInfo",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/disable/info/$mfr<[^/]+>"""
    )
  )

  // @LINE:117
  private[this] lazy val controllers_AdminUser_exportLimit76_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/eventexport/"), DynamicPart("limit", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_exportLimit76_invoker = createInvoker(
    controllers.AdminUser.exportLimit(fakeValue[String], fakeValue[Int], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "exportLimit",
      Seq(classOf[String], classOf[Int], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/eventexport/$limit<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:118
  private[this] lazy val controllers_AdminUser_resetPasswd77_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/reset/passwd/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_resetPasswd77_invoker = createInvoker(
    controllers.AdminUser.resetPasswd(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "resetPasswd",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/reset/passwd/$mfr<[^/]+>"""
    )
  )

  // @LINE:119
  private[this] lazy val controllers_AdminUser_isDashboardAdmin78_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/dashboardadmin/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("userid", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_isDashboardAdmin78_invoker = createInvoker(
    controllers.AdminUser.isDashboardAdmin(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "isDashboardAdmin",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user/dashboardadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$userid<[^/]+>"""
    )
  )

  // @LINE:120
  private[this] lazy val controllers_AdminUser_getDashboardAdminUsers79_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/dashboardadmin/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_getDashboardAdminUsers79_invoker = createInvoker(
    controllers.AdminUser.getDashboardAdminUsers(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "getDashboardAdminUsers",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user/dashboardadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:121
  private[this] lazy val controllers_AdminUser_getTableauAdminUsers80_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/tableauadmin/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_getTableauAdminUsers80_invoker = createInvoker(
    controllers.AdminUser.getTableauAdminUsers(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "getTableauAdminUsers",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user/tableauadmin/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:124
  private[this] lazy val controllers_AdminUser_addCustomerUser81_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_addCustomerUser81_invoker = createInvoker(
    controllers.AdminUser.addCustomerUser(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "addCustomerUser",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:125
  private[this] lazy val controllers_AdminUser_listCustomerUsers82_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listCustomerUsers82_invoker = createInvoker(
    controllers.AdminUser.listCustomerUsers(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listCustomerUsers",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:126
  private[this] lazy val controllers_AdminUser_listCustomerUsersNonSso83_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/listnonsso/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listCustomerUsersNonSso83_invoker = createInvoker(
    controllers.AdminUser.listCustomerUsersNonSso(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listCustomerUsersNonSso",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/listnonsso/$mfr<[^/]+>"""
    )
  )

  // @LINE:127
  private[this] lazy val controllers_AdminUser_listCustomerUsersSso84_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/listsso/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listCustomerUsersSso84_invoker = createInvoker(
    controllers.AdminUser.listCustomerUsersSso(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listCustomerUsersSso",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/listsso/$mfr<[^/]+>"""
    )
  )

  // @LINE:128
  private[this] lazy val controllers_AdminUser_listCustomerUsersRuleCreator85_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/listrulecreator/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_listCustomerUsersRuleCreator85_invoker = createInvoker(
    controllers.AdminUser.listCustomerUsersRuleCreator(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "listCustomerUsersRuleCreator",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/listrulecreator/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:129
  private[this] lazy val controllers_AdminUser_removeCustomerUsers86_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/remove/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_removeCustomerUsers86_invoker = createInvoker(
    controllers.AdminUser.removeCustomerUsers(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "removeCustomerUsers",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/remove/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:130
  private[this] lazy val controllers_AdminUser_regenerateVerificationEmail87_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/regenerate/verification/"), DynamicPart("email", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_regenerateVerificationEmail87_invoker = createInvoker(
    controllers.AdminUser.regenerateVerificationEmail(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "regenerateVerificationEmail",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/regenerate/verification/$email<[^/]+>"""
    )
  )

  // @LINE:131
  private[this] lazy val controllers_AdminUser_disableCustomerUsers88_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/disable/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_disableCustomerUsers88_invoker = createInvoker(
    controllers.AdminUser.disableCustomerUsers(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "disableCustomerUsers",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/disable/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:132
  private[this] lazy val controllers_AdminUser_enableCustomerUsers89_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/enable/"), DynamicPart("usr", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_enableCustomerUsers89_invoker = createInvoker(
    controllers.AdminUser.enableCustomerUsers(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "enableCustomerUsers",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/enable/$usr<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:133
  private[this] lazy val controllers_AdminUser_modifyCustomerUser90_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/modify/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_modifyCustomerUser90_invoker = createInvoker(
    controllers.AdminUser.modifyCustomerUser(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "modifyCustomerUser",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/modify/$mfr<[^/]+>"""
    )
  )

  // @LINE:134
  private[this] lazy val controllers_AdminUser_bulkUpdateCustomerUser91_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/bulk_update/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_bulkUpdateCustomerUser91_invoker = createInvoker(
    controllers.AdminUser.bulkUpdateCustomerUser(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "bulkUpdateCustomerUser",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/bulk_update/$mfr<[^/]+>"""
    )
  )

  // @LINE:135
  private[this] lazy val controllers_AdminUser_bulkDeleteCustomerUser92_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/customer/user/bulk_delete/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_bulkDeleteCustomerUser92_invoker = createInvoker(
    controllers.AdminUser.bulkDeleteCustomerUser(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "bulkDeleteCustomerUser",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/customer/user/bulk_delete/$mfr<[^/]+>"""
    )
  )

  // @LINE:139
  private[this] lazy val controllers_AdminRole_addForm93_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/add")))
  )
  private[this] lazy val controllers_AdminRole_addForm93_invoker = createInvoker(
    controllers.AdminRole.addForm(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "addForm",
      Seq(classOf[String]),
      "GET",
      """ INTERNAL: role management""",
      this.prefix + """$version<[^/]+>/admin/role/add"""
    )
  )

  // @LINE:140
  private[this] lazy val controllers_AdminRole_addDomain94_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/add/"), DynamicPart("roleName", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_addDomain94_invoker = createInvoker(
    controllers.AdminRole.addDomain(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "addDomain",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/add/$roleName<[^/]+>"""
    )
  )

  // @LINE:141
  private[this] lazy val controllers_AdminRole_edit95_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/edit/"), DynamicPart("roleName", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true), StaticPart("/"), DynamicPart("permissions", """[^/]+""",true), StaticPart("/"), DynamicPart("mps", """[^/]+""",true), StaticPart("/"), DynamicPart("realm", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_edit95_invoker = createInvoker(
    controllers.AdminRole.edit(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "edit",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/edit/$roleName<[^/]+>/$domain<[^/]+>/$permissions<[^/]+>/$mps<[^/]+>/$realm<[^/]+>"""
    )
  )

  // @LINE:142
  private[this] lazy val controllers_AdminRole_add96_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/add")))
  )
  private[this] lazy val controllers_AdminRole_add96_invoker = createInvoker(
    controllers.AdminRole.add(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "add",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/add"""
    )
  )

  // @LINE:143
  private[this] lazy val controllers_AdminRole_addrole97_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/add/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_addrole97_invoker = createInvoker(
    controllers.AdminRole.addrole(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "addrole",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/add/$mfr<[^/]+>"""
    )
  )

  // @LINE:144
  private[this] lazy val controllers_AdminRole_modifyRole98_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/modify/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_modifyRole98_invoker = createInvoker(
    controllers.AdminRole.modifyRole(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "modifyRole",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/modify/$mfr<[^/]+>"""
    )
  )

  // @LINE:145
  private[this] lazy val controllers_AdminRole_bulkUpdateRoleProducts99_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/bulk_update/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_bulkUpdateRoleProducts99_invoker = createInvoker(
    controllers.AdminRole.bulkUpdateRoleProducts(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "bulkUpdateRoleProducts",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/bulk_update/$mfr<[^/]+>"""
    )
  )

  // @LINE:146
  private[this] lazy val controllers_AdminRole_list100_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/list")))
  )
  private[this] lazy val controllers_AdminRole_list100_invoker = createInvoker(
    controllers.AdminRole.list(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "list",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/list"""
    )
  )

  // @LINE:147
  private[this] lazy val controllers_AdminRole_listall101_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/list/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_listall101_invoker = createInvoker(
    controllers.AdminRole.listall(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "listall",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/list/$mfr<[^/]+>"""
    )
  )

  // @LINE:148
  private[this] lazy val controllers_AdminRole_delete102_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/delete/"), DynamicPart("roleName", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_delete102_invoker = createInvoker(
    controllers.AdminRole.delete(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "delete",
      Seq(classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/delete/$roleName<[^/]+>"""
    )
  )

  // @LINE:149
  private[this] lazy val controllers_AdminRole_deleterole103_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/delete/"), DynamicPart("roleName", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_deleterole103_invoker = createInvoker(
    controllers.AdminRole.deleterole(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "deleterole",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/delete/$roleName<[^/]+>/$mfr<[^/]+>"""
    )
  )

  // @LINE:150
  private[this] lazy val controllers_AdminRole_deleteRoleProduct104_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/usermanagement/role/product/delete/"), DynamicPart("roleName", """[^/]+""",true), StaticPart("/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_deleteRoleProduct104_invoker = createInvoker(
    controllers.AdminRole.deleteRoleProduct(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "deleteRoleProduct",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/usermanagement/role/product/delete/$roleName<[^/]+>/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:151
  private[this] lazy val controllers_AdminRole_domainsList105_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/domains/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("roleName", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_domainsList105_invoker = createInvoker(
    controllers.AdminRole.domainsList(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "domainsList",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/domains/$mfr<[^/]+>/$roleName<[^/]+>"""
    )
  )

  // @LINE:152
  private[this] lazy val controllers_AdminRole_userDetails106_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/user/details/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_userDetails106_invoker = createInvoker(
    controllers.AdminRole.userDetails(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "userDetails",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/user/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:153
  private[this] lazy val controllers_AdminRole_listRoles107_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/names/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_listRoles107_invoker = createInvoker(
    controllers.AdminRole.listRoles(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "listRoles",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/names/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:154
  private[this] lazy val controllers_AdminRole_listHealthCheckRoles108_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/role/healthcheck/names/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_listHealthCheckRoles108_invoker = createInvoker(
    controllers.AdminRole.listHealthCheckRoles(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "listHealthCheckRoles",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/role/healthcheck/names/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:155
  private[this] lazy val controllers_AdminRole_tableauUpdateRole109_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/tableau/tableauUpdateRole/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_tableauUpdateRole109_invoker = createInvoker(
    controllers.AdminRole.tableauUpdateRole(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "tableauUpdateRole",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/tableau/tableauUpdateRole/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:156
  private[this] lazy val controllers_AdminRole_tableauAddUpdateUsers110_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/tableau/tableauAddUpdateUsers/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_tableauAddUpdateUsers110_invoker = createInvoker(
    controllers.AdminRole.tableauAddUpdateUsers(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "tableauAddUpdateUsers",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/tableau/tableauAddUpdateUsers/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:157
  private[this] lazy val controllers_AdminRole_tableauDeleteUsers111_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/tableau/tableauDeleteUsers/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_tableauDeleteUsers111_invoker = createInvoker(
    controllers.AdminRole.tableauDeleteUsers(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "tableauDeleteUsers",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/admin/tableau/tableauDeleteUsers/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:158
  private[this] lazy val controllers_AdminRole_isTableauConfigured112_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/admin/tableau/configured/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_isTableauConfigured112_invoker = createInvoker(
    controllers.AdminRole.isTableauConfigured(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "isTableauConfigured",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/admin/tableau/configured/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:161
  private[this] lazy val controllers_SSOSoap_getUserInfo113_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/sso/soap/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true)))
  )
  private[this] lazy val controllers_SSOSoap_getUserInfo113_invoker = createInvoker(
    controllers.SSOSoap.getUserInfo(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SSOSoap",
      "getUserInfo",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """ INTERNAL: SSO""",
      this.prefix + """$version<[^/]+>/sso/soap/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>"""
    )
  )

  // @LINE:162
  private[this] lazy val controllers_SSOPingone_getUserInfo114_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/sso/ping/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true)))
  )
  private[this] lazy val controllers_SSOPingone_getUserInfo114_invoker = createInvoker(
    controllers.SSOPingone.getUserInfo(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SSOPingone",
      "getUserInfo",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/sso/ping/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>"""
    )
  )

  // @LINE:164
  private[this] lazy val controllers_SSOPingoneEmbedded_getUserInfo115_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/sso/ping/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("domain", """[^/]+""",true), StaticPart("/"), DynamicPart("dashboardId", """[^/]+""",true)))
  )
  private[this] lazy val controllers_SSOPingoneEmbedded_getUserInfo115_invoker = createInvoker(
    controllers.SSOPingoneEmbedded.getUserInfo(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SSOPingoneEmbedded",
      "getUserInfo",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """POST     /:version/sso/saml                                                                        controllers.SSOSAMLAssertionHandlerJ.getUserInfo(version: String)""",
      this.prefix + """$version<[^/]+>/sso/ping/$mfr<[^/]+>/$prod<[^/]+>/$domain<[^/]+>/$dashboardId<[^/]+>"""
    )
  )

  // @LINE:166
  private[this] lazy val controllers_Application_trackUser116_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user_tracking/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("app", """[^/]+""",true), StaticPart("/"), DynamicPart("module", """[^/]+""",true), StaticPart("/"), DynamicPart("activity", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Application_trackUser116_invoker = createInvoker(
    controllers.Application.trackUser(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Application",
      "trackUser",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[String]]),
      "POST",
      """ INTERNAL: User Tracking""",
      this.prefix + """$version<[^/]+>/user_tracking/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$app<[^/]+>/$module<[^/]+>/$activity<[^/]+>"""
    )
  )

  // @LINE:167
  private[this] lazy val controllers_AdminUser_tsUserTracking117_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user_tracking/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("ec", """[^/]+""",true), StaticPart("/"), DynamicPart("st", """[^/]+""",true), StaticPart("/"), DynamicPart("et", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_tsUserTracking117_invoker = createInvoker(
    controllers.AdminUser.tsUserTracking(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[List[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[String]], fakeValue[Option[Integer]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "tsUserTracking",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[List[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[String]], classOf[Option[Integer]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user_tracking/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$et<[^/]+>"""
    )
  )

  // @LINE:170
  private[this] lazy val controllers_Analytics_sql118_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/analytics/"), DynamicPart("sqlQuery", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Analytics_sql118_invoker = createInvoker(
    controllers.Analytics.sql(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Analytics",
      "sql",
      Seq(classOf[String], classOf[String]),
      "GET",
      """ INTERNAL: Allows sql query through URI""",
      this.prefix + """$version<[^/]+>/analytics/$sqlQuery<[^/]+>"""
    )
  )

  // @LINE:171
  private[this] lazy val controllers_Analytics_refreshSpark119_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/spark/refresh")))
  )
  private[this] lazy val controllers_Analytics_refreshSpark119_invoker = createInvoker(
    controllers.Analytics.refreshSpark(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Analytics",
      "refreshSpark",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/spark/refresh"""
    )
  )

  // @LINE:173
  private[this] lazy val controllers_Analytics_hql120_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/analytics/hql/"), DynamicPart("hqlQuery", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Analytics_hql120_invoker = createInvoker(
    controllers.Analytics.hql(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Analytics",
      "hql",
      Seq(classOf[String], classOf[String]),
      "GET",
      """ INTERNAL: URI for HiveQL queries""",
      this.prefix + """$version<[^/]+>/analytics/hql/$hqlQuery<[^/]+>"""
    )
  )

  // @LINE:177
  private[this] lazy val controllers_AdminRealm_realmInfo121_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/realm/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRealm_realmInfo121_invoker = createInvoker(
    controllers.AdminRealm.realmInfo(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRealm",
      "realmInfo",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/realm/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:180
  private[this] lazy val controllers_Assets_at122_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/"), DynamicPart("file", """.+""",false)))
  )
  private[this] lazy val controllers_Assets_at122_invoker = createInvoker(
    controllers.Assets.at(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Assets",
      "at",
      Seq(classOf[String], classOf[String]),
      "GET",
      """ INTERNAL: Map static resources from the /public folder to the /assets URL path""",
      this.prefix + """assets/$file<.+>"""
    )
  )

  // @LINE:183
  private[this] lazy val controllers_Clinsight_createMailWrapper123_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/create/email")))
  )
  private[this] lazy val controllers_Clinsight_createMailWrapper123_invoker = createInvoker(
    controllers.Clinsight.createMailWrapper(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "createMailWrapper",
      Seq(classOf[String]),
      "POST",
      """ Clinsight APIs""",
      this.prefix + """$version<[^/]+>/create/email"""
    )
  )

  // @LINE:184
  private[this] lazy val controllers_Clinsight_clinsightView124_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/clinsight")))
  )
  private[this] lazy val controllers_Clinsight_clinsightView124_invoker = createInvoker(
    controllers.Clinsight.clinsightView(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "clinsightView",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/clinsight"""
    )
  )

  // @LINE:185
  private[this] lazy val controllers_Clinsight_login125_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/login")))
  )
  private[this] lazy val controllers_Clinsight_login125_invoker = createInvoker(
    controllers.Clinsight.login(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "login",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/login"""
    )
  )

  // @LINE:186
  private[this] lazy val controllers_Clinsight_getUserDetails126_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/userdetails")))
  )
  private[this] lazy val controllers_Clinsight_getUserDetails126_invoker = createInvoker(
    controllers.Clinsight.getUserDetails(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "getUserDetails",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/userdetails"""
    )
  )

  // @LINE:187
  private[this] lazy val controllers_Clinsight_setDefaultMPS127_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/setdefaultmps")))
  )
  private[this] lazy val controllers_Clinsight_setDefaultMPS127_invoker = createInvoker(
    controllers.Clinsight.setDefaultMPS(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "setDefaultMPS",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/setdefaultmps"""
    )
  )

  // @LINE:188
  private[this] lazy val controllers_Clinsight_registerProspect128_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/campaign/user/add")))
  )
  private[this] lazy val controllers_Clinsight_registerProspect128_invoker = createInvoker(
    controllers.Clinsight.registerProspect(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "registerProspect",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/campaign/user/add"""
    )
  )

  // @LINE:189
  private[this] lazy val controllers_Clinsight_verifyProspect129_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/campaign/user/verification")))
  )
  private[this] lazy val controllers_Clinsight_verifyProspect129_invoker = createInvoker(
    controllers.Clinsight.verifyProspect(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "verifyProspect",
      Seq(classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/campaign/user/verification"""
    )
  )

  // @LINE:190
  private[this] lazy val controllers_Clinsight_regenerateVerificationEmail130_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/campaign/user/regenerate/verification/"), DynamicPart("email", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Clinsight_regenerateVerificationEmail130_invoker = createInvoker(
    controllers.Clinsight.regenerateVerificationEmail(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "regenerateVerificationEmail",
      Seq(classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/campaign/user/regenerate/verification/$email<[^/]+>"""
    )
  )

  // @LINE:191
  private[this] lazy val controllers_Clinsight_clinsightRegistrationView131_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/registration")))
  )
  private[this] lazy val controllers_Clinsight_clinsightRegistrationView131_invoker = createInvoker(
    controllers.Clinsight.clinsightRegistrationView(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "clinsightRegistrationView",
      Seq(classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/registration"""
    )
  )

  // @LINE:192
  private[this] lazy val controllers_Clinsight_deleteUserDeviceInfo132_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user_info/delete/device_info")))
  )
  private[this] lazy val controllers_Clinsight_deleteUserDeviceInfo132_invoker = createInvoker(
    controllers.Clinsight.deleteUserDeviceInfo(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "deleteUserDeviceInfo",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user_info/delete/device_info"""
    )
  )

  // @LINE:193
  private[this] lazy val controllers_Clinsight_updateUserDeviceInfo133_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user_info/update/device_info")))
  )
  private[this] lazy val controllers_Clinsight_updateUserDeviceInfo133_invoker = createInvoker(
    controllers.Clinsight.updateUserDeviceInfo(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "updateUserDeviceInfo",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user_info/update/device_info"""
    )
  )

  // @LINE:194
  private[this] lazy val controllers_AdminUser_decryptUser134_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/decrypt")))
  )
  private[this] lazy val controllers_AdminUser_decryptUser134_invoker = createInvoker(
    controllers.AdminUser.decryptUser(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "decryptUser",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/decrypt"""
    )
  )

  // @LINE:195
  private[this] lazy val controllers_AdminUser_getTableauUsername135_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/tableau/user/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminUser_getTableauUsername135_invoker = createInvoker(
    controllers.AdminUser.getTableauUsername(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminUser",
      "getTableauUsername",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/tableau/user/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>"""
    )
  )

  // @LINE:196
  private[this] lazy val controllers_AdminRole_userRoleDetails136_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/role/user/details/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminRole_userRoleDetails136_invoker = createInvoker(
    controllers.AdminRole.userRoleDetails(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminRole",
      "userRoleDetails",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/role/user/details/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:198
  private[this] lazy val controllers_ClinsightMenu_clinsightsMasterTree137_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/master/menu/tree/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsMasterTree137_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsMasterTree(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsMasterTree",
      Seq(classOf[String], classOf[String]),
      "GET",
      """ Clinsight Menu APIs""",
      this.prefix + """$version<[^/]+>/cs/master/menu/tree/$mfr<[^/]+>"""
    )
  )

  // @LINE:199
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsTree138_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/mps/menu/tree/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsTree138_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsMpsTree(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[String]], fakeValue[Option[Long]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsMpsTree",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[String]], classOf[Option[Long]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/mps/menu/tree/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:200
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsFlatMenu139_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/mps/menu/flat_json/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsFlatMenu139_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsMpsFlatMenu(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[String]], fakeValue[Option[Long]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsMpsFlatMenu",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[String]], classOf[Option[Long]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/cs/mps/menu/flat_json/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:201
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsNodeHide140_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/"), DynamicPart("operation_type", """[^/]+""",true), StaticPart("/mps/menu/node/hide/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsNodeHide140_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsMpsNodeHide(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsMpsNodeHide",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/$operation_type<[^/]+>/mps/menu/node/hide/$mfr<[^/]+>"""
    )
  )

  // @LINE:202
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsNodeDisable141_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/"), DynamicPart("operation_type", """[^/]+""",true), StaticPart("/mps/menu/node/disable/"), DynamicPart("mfr", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsMpsNodeDisable141_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsMpsNodeDisable(fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsMpsNodeDisable",
      Seq(classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/$operation_type<[^/]+>/mps/menu/node/disable/$mfr<[^/]+>"""
    )
  )

  // @LINE:203
  private[this] lazy val controllers_ClinsightMenu_clinsightsRoleNodeHide142_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/"), DynamicPart("operation_type", """[^/]+""",true), StaticPart("/role/menu/node/hide/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsRoleNodeHide142_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsRoleNodeHide(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsRoleNodeHide",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/$operation_type<[^/]+>/role/menu/node/hide/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:204
  private[this] lazy val controllers_ClinsightMenu_clinsightsRoleNodeDisable143_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/"), DynamicPart("operation_type", """[^/]+""",true), StaticPart("/role/menu/node/disable/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_ClinsightMenu_clinsightsRoleNodeDisable143_invoker = createInvoker(
    controllers.ClinsightMenu.clinsightsRoleNodeDisable(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.ClinsightMenu",
      "clinsightsRoleNodeDisable",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/$operation_type<[^/]+>/role/menu/node/disable/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:205
  private[this] lazy val controllers_Clinsight_mobileLogin144_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/mobile/login")))
  )
  private[this] lazy val controllers_Clinsight_mobileLogin144_invoker = createInvoker(
    controllers.Clinsight.mobileLogin(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "mobileLogin",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/mobile/login"""
    )
  )

  // @LINE:206
  private[this] lazy val controllers_Clinsight_getUserMpsDetails145_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/cs/mobile/userdetails/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Clinsight_getUserMpsDetails145_invoker = createInvoker(
    controllers.Clinsight.getUserMpsDetails(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Clinsight",
      "getUserMpsDetails",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/cs/mobile/userdetails/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:209
  private[this] lazy val controllers_SqlHelper_getQueryDB146_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/db/"), DynamicPart("sqlQuery", """[^/]+""",true)))
  )
  private[this] lazy val controllers_SqlHelper_getQueryDB146_invoker = createInvoker(
    controllers.SqlHelper.getQueryDB(fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SqlHelper",
      "getQueryDB",
      Seq(classOf[String], classOf[String]),
      "GET",
      """ vertica select query""",
      this.prefix + """$version<[^/]+>/db/$sqlQuery<[^/]+>"""
    )
  )

  // @LINE:210
  private[this] lazy val controllers_SqlHelper_queryDB147_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/db")))
  )
  private[this] lazy val controllers_SqlHelper_queryDB147_invoker = createInvoker(
    controllers.SqlHelper.queryDB(fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.SqlHelper",
      "queryDB",
      Seq(classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/db"""
    )
  )

  // @LINE:213
  private[this] lazy val controllers_AdminCustomer_ecSystemsListData148_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/bundle/system_info/ec/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("ec", """[^/]+""",true), StaticPart("/"), DynamicPart("st", """[^/]+""",true), StaticPart("/"), DynamicPart("en", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecSystemsListData148_invoker = createInvoker(
    controllers.AdminCustomer.ecSystemsListData(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Int], fakeValue[Int]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecSystemsListData",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Int], classOf[Int]),
      "POST",
      """ sysids APIs""",
      this.prefix + """$version<[^/]+>/bundle/system_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$ec<[^/]+>/$st<[^/]+>/$en<[^/]+>"""
    )
  )

  // @LINE:214
  private[this] lazy val controllers_AdminCustomer_ecSystemsColsListData149_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/bundle/system_cols_info/ec/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecSystemsColsListData149_invoker = createInvoker(
    controllers.AdminCustomer.ecSystemsColsListData(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecSystemsColsListData",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/bundle/system_cols_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:215
  private[this] lazy val controllers_AdminCustomer_ecAvailableSystemsListData150_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/bundle/available_system_info/ec/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_ecAvailableSystemsListData150_invoker = createInvoker(
    controllers.AdminCustomer.ecAvailableSystemsListData(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "ecAvailableSystemsListData",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/bundle/available_system_info/ec/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:216
  private[this] lazy val controllers_AdminCustomer_userECAvailableSystemsListData151_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/ec/available_system_info/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_userECAvailableSystemsListData151_invoker = createInvoker(
    controllers.AdminCustomer.userECAvailableSystemsListData(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "userECAvailableSystemsListData",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/user/ec/available_system_info/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>"""
    )
  )

  // @LINE:217
  private[this] lazy val controllers_AdminCustomer_userEcSystemsListData152_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/user/ec/system_info/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("st", """[^/]+""",true), StaticPart("/"), DynamicPart("en", """[^/]+""",true)))
  )
  private[this] lazy val controllers_AdminCustomer_userEcSystemsListData152_invoker = createInvoker(
    controllers.AdminCustomer.userEcSystemsListData(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Int], fakeValue[Int]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AdminCustomer",
      "userEcSystemsListData",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Int], classOf[Int]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/user/ec/system_info/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$st<[^/]+>/$en<[^/]+>"""
    )
  )

  // @LINE:220
  private[this] lazy val controllers_RulesAlerts_alertFilterList153_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/rules/alerts/filters/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_RulesAlerts_alertFilterList153_invoker = createInvoker(
    controllers.RulesAlerts.alertFilterList(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[Long]], fakeValue[Option[String]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.RulesAlerts",
      "alertFilterList",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[Long]], classOf[Option[String]]),
      "GET",
      """ Rule's subscription APIs""",
      this.prefix + """$version<[^/]+>/rules/alerts/filters/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:221
  private[this] lazy val controllers_RulesAlerts_addUpdateAlertFiltersAtributes154_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/rules/alerts/filters/add_update/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_RulesAlerts_addUpdateAlertFiltersAtributes154_invoker = createInvoker(
    controllers.RulesAlerts.addUpdateAlertFiltersAtributes(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.RulesAlerts",
      "addUpdateAlertFiltersAtributes",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/rules/alerts/filters/add_update/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:222
  private[this] lazy val controllers_RulesAlerts_bulkRulesDeleteAlertFiltersAtributes155_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/rules/alerts/filters/bulk_rules_delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_RulesAlerts_bulkRulesDeleteAlertFiltersAtributes155_invoker = createInvoker(
    controllers.RulesAlerts.bulkRulesDeleteAlertFiltersAtributes(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.RulesAlerts",
      "bulkRulesDeleteAlertFiltersAtributes",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/rules/alerts/filters/bulk_rules_delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:223
  private[this] lazy val controllers_RulesAlerts_bulkUsersDeleteAlertFiltersAtributes156_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/rules/alerts/filters/bulk_users_delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_RulesAlerts_bulkUsersDeleteAlertFiltersAtributes156_invoker = createInvoker(
    controllers.RulesAlerts.bulkUsersDeleteAlertFiltersAtributes(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.RulesAlerts",
      "bulkUsersDeleteAlertFiltersAtributes",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/rules/alerts/filters/bulk_users_delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:224
  private[this] lazy val controllers_RulesAlerts_sendNotification157_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/rules/alerts/filters/group/users/notification/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true)))
  )
  private[this] lazy val controllers_RulesAlerts_sendNotification157_invoker = createInvoker(
    controllers.RulesAlerts.sendNotification(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.RulesAlerts",
      "sendNotification",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/rules/alerts/filters/group/users/notification/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>"""
    )
  )

  // @LINE:227
  private[this] lazy val controllers_Notification_notificationList158_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_notificationList158_invoker = createInvoker(
    controllers.Notification.notificationList(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Option[Boolean]], fakeValue[Option[Boolean]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "notificationList",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Option[Boolean]], classOf[Option[Boolean]]),
      "GET",
      """ Push Notification APIs""",
      this.prefix + """$version<[^/]+>/notification/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>"""
    )
  )

  // @LINE:228
  private[this] lazy val controllers_Notification_notificationPaginationList159_route: Route.ParamsExtractor = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/list/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("st", """[^/]+""",true), StaticPart("/"), DynamicPart("en", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_notificationPaginationList159_invoker = createInvoker(
    controllers.Notification.notificationPaginationList(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Int], fakeValue[Int], fakeValue[Option[Boolean]], fakeValue[Option[Boolean]]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "notificationPaginationList",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Int], classOf[Int], classOf[Option[Boolean]], classOf[Option[Boolean]]),
      "GET",
      """""",
      this.prefix + """$version<[^/]+>/notification/list/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$st<[^/]+>/$en<[^/]+>"""
    )
  )

  // @LINE:229
  private[this] lazy val controllers_Notification_updateNotificationsReadTime160_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/bulk_update/read/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("read", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_updateNotificationsReadTime160_invoker = createInvoker(
    controllers.Notification.updateNotificationsReadTime(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Boolean]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "updateNotificationsReadTime",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Boolean]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/notification/bulk_update/read/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$read<[^/]+>"""
    )
  )

  // @LINE:230
  private[this] lazy val controllers_Notification_updateNotificationsDeletedTime161_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/bulk_update/delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("delete", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_updateNotificationsDeletedTime161_invoker = createInvoker(
    controllers.Notification.updateNotificationsDeletedTime(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Boolean]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "updateNotificationsDeletedTime",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Boolean]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/notification/bulk_update/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$delete<[^/]+>"""
    )
  )

  // @LINE:231
  private[this] lazy val controllers_Notification_markAllNotificationsReadTime162_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/mark_all/read/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("read", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_markAllNotificationsReadTime162_invoker = createInvoker(
    controllers.Notification.markAllNotificationsReadTime(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Boolean]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "markAllNotificationsReadTime",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Boolean]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/notification/mark_all/read/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$read<[^/]+>"""
    )
  )

  // @LINE:232
  private[this] lazy val controllers_Notification_markAllNotificationsDeletedTime163_route: Route.ParamsExtractor = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), DynamicPart("version", """[^/]+""",true), StaticPart("/notification/mark_all/delete/"), DynamicPart("mfr", """[^/]+""",true), StaticPart("/"), DynamicPart("prod", """[^/]+""",true), StaticPart("/"), DynamicPart("sch", """[^/]+""",true), StaticPart("/"), DynamicPart("email", """[^/]+""",true), StaticPart("/"), DynamicPart("delete", """[^/]+""",true)))
  )
  private[this] lazy val controllers_Notification_markAllNotificationsDeletedTime163_invoker = createInvoker(
    controllers.Notification.markAllNotificationsDeletedTime(fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[String], fakeValue[Boolean]),
    HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Notification",
      "markAllNotificationsDeletedTime",
      Seq(classOf[String], classOf[String], classOf[String], classOf[String], classOf[String], classOf[Boolean]),
      "POST",
      """""",
      this.prefix + """$version<[^/]+>/notification/mark_all/delete/$mfr<[^/]+>/$prod<[^/]+>/$sch<[^/]+>/$email<[^/]+>/$delete<[^/]+>"""
    )
  )


  def routes: PartialFunction[RequestHeader, Handler] = {
  
    // @LINE:6
    case controllers_Application_options0_route(params) =>
      call(Param[String]("path", Right(""))) { (path) =>
        controllers_Application_options0_invoker.call(controllers.Application.options(path))
      }
  
    // @LINE:7
    case controllers_Application_options1_route(params) =>
      call(params.fromPath[String]("path", None)) { (path) =>
        controllers_Application_options1_invoker.call(controllers.Application.options(path))
      }
  
    // @LINE:9
    case controllers_Application_index2_route(params) =>
      call { 
        controllers_Application_index2_invoker.call(controllers.Application.index())
      }
  
    // @LINE:10
    case controllers_Application_index3_route(params) =>
      call { 
        controllers_Application_index3_invoker.call(controllers.Application.index())
      }
  
    // @LINE:11
    case controllers_Application_index4_route(params) =>
      call { 
        controllers_Application_index4_invoker.call(controllers.Application.index())
      }
  
    // @LINE:12
    case controllers_Application_index5_route(params) =>
      call { 
        controllers_Application_index5_invoker.call(controllers.Application.index())
      }
  
    // @LINE:13
    case controllers_Application_index6_route(params) =>
      call { 
        controllers_Application_index6_invoker.call(controllers.Application.index())
      }
  
    // @LINE:14
    case controllers_Application_index7_route(params) =>
      call { 
        controllers_Application_index7_invoker.call(controllers.Application.index())
      }
  
    // @LINE:15
    case controllers_Application_index8_route(params) =>
      call { 
        controllers_Application_index8_invoker.call(controllers.Application.index())
      }
  
    // @LINE:16
    case controllers_Application_index9_route(params) =>
      call { 
        controllers_Application_index9_invoker.call(controllers.Application.index())
      }
  
    // @LINE:17
    case controllers_Application_createpwd10_route(params) =>
      call(params.fromPath[String]("token_id", None), params.fromPath[String]("email", None), params.fromPath[String]("domain", None)) { (token_id, email, domain) =>
        controllers_Application_createpwd10_invoker.call(controllers.Application.createpwd(token_id, email, domain))
      }
  
    // @LINE:22
    case controllers_Application_vHome11_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_vHome11_invoker.call(controllers.Application.vHome(version))
      }
  
    // @LINE:23
    case controllers_Application_uHome12_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_uHome12_invoker.call(controllers.Application.uHome(version))
      }
  
    // @LINE:24
    case controllers_Application_monitor13_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_monitor13_invoker.call(controllers.Application.monitor(version))
      }
  
    // @LINE:28
    case controllers_CGIHandler_forward14_route(params) =>
      call(params.fromQuery[Option[String]]("serialNumber", None), params.fromQuery[Option[String]]("cust_name", None), params.fromQuery[Option[String]]("db", None), params.fromQuery[Option[String]]("sessionId", None), params.fromQuery[Option[String]]("serverUrl", None), params.fromQuery[Option[String]]("dashboardId", None)) { (serialNumber, cust_name, db, sessionId, serverUrl, dashboardId) =>
        controllers_CGIHandler_forward14_invoker.call(controllers.CGIHandler.forward(serialNumber, cust_name, db, sessionId, serverUrl, dashboardId))
      }
  
    // @LINE:30
    case controllers_Callback_callback15_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("domain", None), params.fromQuery[Option[String]]("code", None)) { (version, mfr, prod, domain, code) =>
        controllers_Callback_callback15_invoker.call(controllers.Callback.callback(version, mfr, prod, domain, code))
      }
  
    // @LINE:33
    case controllers_Application_login16_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_login16_invoker.call(controllers.Application.login(version))
      }
  
    // @LINE:34
    case controllers_Application_uiLogin17_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_uiLogin17_invoker.call(controllers.Application.uiLogin(version))
      }
  
    // @LINE:36
    case controllers_Application_logout18_route(params) =>
      call(params.fromPath[String]("version", None), params.fromQuery[Option[String]]("mps", None), params.fromQuery[Option[String]]("feature", None)) { (version, mps, feature) =>
        controllers_Application_logout18_invoker.call(controllers.Application.logout(version, mps, feature))
      }
  
    // @LINE:38
    case controllers_Application_appLogin19_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_appLogin19_invoker.call(controllers.Application.appLogin(version))
      }
  
    // @LINE:40
    case controllers_Application_verifyOTP20_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_verifyOTP20_invoker.call(controllers.Application.verifyOTP(version))
      }
  
    // @LINE:41
    case controllers_Application_resendOTP21_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_resendOTP21_invoker.call(controllers.Application.resendOTP(version))
      }
  
    // @LINE:44
    case controllers_Application_validateAccessToken22_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_validateAccessToken22_invoker.call(controllers.Application.validateAccessToken(version))
      }
  
    // @LINE:47
    case controllers_Application_updateLoginSuccess23_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_updateLoginSuccess23_invoker.call(controllers.Application.updateLoginSuccess(version))
      }
  
    // @LINE:50
    case controllers_Application_xProxy24_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Application_xProxy24_invoker.call(controllers.Application.xProxy(version))
      }
  
    // @LINE:53
    case controllers_AdminCustomer_list25_route(params) =>
      call(params.fromPath[String]("version", None), params.fromQuery[Option[Boolean]]("is_request", None)) { (version, is_request) =>
        controllers_AdminCustomer_list25_invoker.call(controllers.AdminCustomer.list(version, is_request))
      }
  
    // @LINE:54
    case controllers_AdminCustomer_addForm26_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminCustomer_addForm26_invoker.call(controllers.AdminCustomer.addForm(version))
      }
  
    // @LINE:55
    case controllers_AdminCustomer_add27_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminCustomer_add27_invoker.call(controllers.AdminCustomer.add(version))
      }
  
    // @LINE:56
    case controllers_AdminCustomer_delete28_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("ec", None), params.fromPath[String]("realm", None)) { (version, mfr, prod, sch, ec, realm) =>
        controllers_AdminCustomer_delete28_invoker.call(controllers.AdminCustomer.delete(version, mfr, prod, sch, ec, realm))
      }
  
    // @LINE:57
    case controllers_AdminCustomer_getMpseInfo29_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("ec", None)) { (version, mfr, prod, sch, ec) =>
        controllers_AdminCustomer_getMpseInfo29_invoker.call(controllers.AdminCustomer.getMpseInfo(version, mfr, prod, sch, ec))
      }
  
    // @LINE:58
    case controllers_AdminCustomer_ecHealthCheck30_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromQuery[Option[String]]("user", None), params.fromQuery[Option[String]]("fnCallSrcOpt", None)) { (version, mfr, prod, sch, user, fnCallSrcOpt) =>
        controllers_AdminCustomer_ecHealthCheck30_invoker.call(controllers.AdminCustomer.ecHealthCheck(version, mfr, prod, sch, user, fnCallSrcOpt))
      }
  
    // @LINE:59
    case controllers_AdminCustomer_ecHealthCheckMfr31_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromQuery[Option[String]]("user", None), params.fromQuery[Option[String]]("fnCallSrcOpt", None)) { (version, mfr, user, fnCallSrcOpt) =>
        controllers_AdminCustomer_ecHealthCheckMfr31_invoker.call(controllers.AdminCustomer.ecHealthCheckMfr(version, mfr, user, fnCallSrcOpt))
      }
  
    // @LINE:60
    case controllers_AdminCustomer_ecHealthCheckAdd32_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecHealthCheckAdd32_invoker.call(controllers.AdminCustomer.ecHealthCheckAdd(version, mfr, prod, sch))
      }
  
    // @LINE:61
    case controllers_AdminCustomer_ecHealthCheckUpdate33_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecHealthCheckUpdate33_invoker.call(controllers.AdminCustomer.ecHealthCheckUpdate(version, mfr, prod, sch))
      }
  
    // @LINE:62
    case controllers_AdminCustomer_ecHealthCheckAddUser34_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecHealthCheckAddUser34_invoker.call(controllers.AdminCustomer.ecHealthCheckAddUser(version, mfr, prod, sch))
      }
  
    // @LINE:63
    case controllers_AdminCustomer_ecHealthCheckUpdateUser35_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecHealthCheckUpdateUser35_invoker.call(controllers.AdminCustomer.ecHealthCheckUpdateUser(version, mfr, prod, sch))
      }
  
    // @LINE:64
    case controllers_AdminCustomer_ecHealthCheckDelete36_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecHealthCheckDelete36_invoker.call(controllers.AdminCustomer.ecHealthCheckDelete(version, mfr, prod, sch))
      }
  
    // @LINE:65
    case controllers_AdminCustomer_ecHealthCheckDeleteMFr37_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminCustomer_ecHealthCheckDeleteMFr37_invoker.call(controllers.AdminCustomer.ecHealthCheckDeleteMFr(version, mfr))
      }
  
    // @LINE:66
    case controllers_AdminCustomer_ecSystemsListFiltered38_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("ec", None), params.fromPath[Int]("st", None), params.fromPath[Int]("en", None), params.fromQuery[Option[String]]("pattern", None), params.fromQuery[Option[String]]("rt", None)) { (version, mfr, prod, sch, ec, st, en, pattern, rt) =>
        controllers_AdminCustomer_ecSystemsListFiltered38_invoker.call(controllers.AdminCustomer.ecSystemsListFiltered(version, mfr, prod, sch, ec, st, en, pattern, rt))
      }
  
    // @LINE:69
    case controllers_AdminMfr_list39_route(params) =>
      call(params.fromPath[String]("version", None), params.fromQuery[Option[Boolean]]("is_request", None)) { (version, is_request) =>
        controllers_AdminMfr_list39_invoker.call(controllers.AdminMfr.list(version, is_request))
      }
  
    // @LINE:70
    case controllers_AdminMfr_listall40_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminMfr_listall40_invoker.call(controllers.AdminMfr.listall(version))
      }
  
    // @LINE:71
    case controllers_AdminMfr_addForm41_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminMfr_addForm41_invoker.call(controllers.AdminMfr.addForm(version))
      }
  
    // @LINE:72
    case controllers_AdminMfr_add42_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminMfr_add42_invoker.call(controllers.AdminMfr.add(version))
      }
  
    // @LINE:73
    case controllers_AdminMfr_addmfr43_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_addmfr43_invoker.call(controllers.AdminMfr.addmfr(version, mfr))
      }
  
    // @LINE:74
    case controllers_AdminMfr_delete44_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_delete44_invoker.call(controllers.AdminMfr.delete(version, mfr))
      }
  
    // @LINE:75
    case controllers_AdminMfr_manageRealm45_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageRealm45_invoker.call(controllers.AdminMfr.manageRealm(version, mfr))
      }
  
    // @LINE:76
    case controllers_AdminMfr_manageRealm46_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageRealm46_invoker.call(controllers.AdminMfr.manageRealm(version, mfr))
      }
  
    // @LINE:77
    case controllers_AdminMfr_listRealm47_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_listRealm47_invoker.call(controllers.AdminMfr.listRealm(version, mfr))
      }
  
    // @LINE:78
    case controllers_AdminMfr_manageDefaultFeature48_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageDefaultFeature48_invoker.call(controllers.AdminMfr.manageDefaultFeature(version, mfr))
      }
  
    // @LINE:79
    case controllers_AdminMfr_manageDefaultFeature49_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageDefaultFeature49_invoker.call(controllers.AdminMfr.manageDefaultFeature(version, mfr))
      }
  
    // @LINE:80
    case controllers_AdminMfr_listDefaultFeature50_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_listDefaultFeature50_invoker.call(controllers.AdminMfr.listDefaultFeature(version, mfr))
      }
  
    // @LINE:81
    case controllers_AdminMfr_manageUiConfig51_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageUiConfig51_invoker.call(controllers.AdminMfr.manageUiConfig(version, mfr))
      }
  
    // @LINE:82
    case controllers_AdminMfr_manageUiConfig52_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_manageUiConfig52_invoker.call(controllers.AdminMfr.manageUiConfig(version, mfr))
      }
  
    // @LINE:83
    case controllers_AdminMfr_listUiConfig53_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminMfr_listUiConfig53_invoker.call(controllers.AdminMfr.listUiConfig(version, mfr))
      }
  
    // @LINE:88
    case controllers_AdminRealm_add54_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRealm_add54_invoker.call(controllers.AdminRealm.add(version))
      }
  
    // @LINE:89
    case controllers_AdminRealm_edit55_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRealm_edit55_invoker.call(controllers.AdminRealm.edit(version))
      }
  
    // @LINE:90
    case controllers_AdminRealm_list56_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRealm_list56_invoker.call(controllers.AdminRealm.list(version))
      }
  
    // @LINE:91
    case controllers_AdminRealm_delete57_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("realm", None)) { (version, realm) =>
        controllers_AdminRealm_delete57_invoker.call(controllers.AdminRealm.delete(version, realm))
      }
  
    // @LINE:95
    case controllers_AdminUser_list58_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminUser_list58_invoker.call(controllers.AdminUser.list(version))
      }
  
    // @LINE:96
    case controllers_AdminUser_listByOrg59_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_listByOrg59_invoker.call(controllers.AdminUser.listByOrg(version, mfr))
      }
  
    // @LINE:98
    case controllers_AdminUser_listByMfr60_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_listByMfr60_invoker.call(controllers.AdminUser.listByMfr(version, mfr))
      }
  
    // @LINE:101
    case controllers_AdminUser_addForm61_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminUser_addForm61_invoker.call(controllers.AdminUser.addForm(version))
      }
  
    // @LINE:102
    case controllers_AdminUser_add62_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminUser_add62_invoker.call(controllers.AdminUser.add(version))
      }
  
    // @LINE:103
    case controllers_AdminUser_addCustomerUserAdmin63_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_addCustomerUserAdmin63_invoker.call(controllers.AdminUser.addCustomerUserAdmin(version, mfr))
      }
  
    // @LINE:104
    case controllers_AdminUser_editCustomerUserAdmin64_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_editCustomerUserAdmin64_invoker.call(controllers.AdminUser.editCustomerUserAdmin(version, usr, mfr))
      }
  
    // @LINE:105
    case controllers_AdminUser_editForm65_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_editForm65_invoker.call(controllers.AdminUser.editForm(version, usr, mfr))
      }
  
    // @LINE:106
    case controllers_AdminUser_edit66_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_edit66_invoker.call(controllers.AdminUser.edit(version, usr, mfr))
      }
  
    // @LINE:107
    case controllers_AdminUser_remove67_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_remove67_invoker.call(controllers.AdminUser.remove(version, usr, mfr))
      }
  
    // @LINE:108
    case controllers_AdminUser_editMultiForm68_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("emails", None)) { (version, mfr, emails) =>
        controllers_AdminUser_editMultiForm68_invoker.call(controllers.AdminUser.editMultiForm(version, mfr, emails))
      }
  
    // @LINE:109
    case controllers_AdminUser_editMulti69_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_editMulti69_invoker.call(controllers.AdminUser.editMulti(version, mfr))
      }
  
    // @LINE:111
    case controllers_AdminUser_createPasswd70_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminUser_createPasswd70_invoker.call(controllers.AdminUser.createPasswd(version))
      }
  
    // @LINE:112
    case controllers_AdminUser_forgotPasswd71_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None)) { (version, usr) =>
        controllers_AdminUser_forgotPasswd71_invoker.call(controllers.AdminUser.forgotPasswd(version, usr))
      }
  
    // @LINE:113
    case controllers_AdminUser_changePasswd72_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_changePasswd72_invoker.call(controllers.AdminUser.changePasswd(version, mfr))
      }
  
    // @LINE:114
    case controllers_AdminUser_updateDefaults73_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_updateDefaults73_invoker.call(controllers.AdminUser.updateDefaults(version, mfr))
      }
  
    // @LINE:115
    case controllers_AdminUser_byEmail74_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("userid", None)) { (version, mfr, userid) =>
        controllers_AdminUser_byEmail74_invoker.call(controllers.AdminUser.byEmail(version, mfr, userid))
      }
  
    // @LINE:116
    case controllers_AdminUser_disableInfo75_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_disableInfo75_invoker.call(controllers.AdminUser.disableInfo(version, mfr))
      }
  
    // @LINE:117
    case controllers_AdminUser_exportLimit76_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[Int]("limit", None), params.fromPath[String]("mfr", None)) { (version, limit, mfr) =>
        controllers_AdminUser_exportLimit76_invoker.call(controllers.AdminUser.exportLimit(version, limit, mfr))
      }
  
    // @LINE:118
    case controllers_AdminUser_resetPasswd77_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_resetPasswd77_invoker.call(controllers.AdminUser.resetPasswd(version, mfr))
      }
  
    // @LINE:119
    case controllers_AdminUser_isDashboardAdmin78_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("userid", None)) { (version, mfr, prod, sch, userid) =>
        controllers_AdminUser_isDashboardAdmin78_invoker.call(controllers.AdminUser.isDashboardAdmin(version, mfr, prod, sch, userid))
      }
  
    // @LINE:120
    case controllers_AdminUser_getDashboardAdminUsers79_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminUser_getDashboardAdminUsers79_invoker.call(controllers.AdminUser.getDashboardAdminUsers(version, mfr, prod, sch))
      }
  
    // @LINE:121
    case controllers_AdminUser_getTableauAdminUsers80_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminUser_getTableauAdminUsers80_invoker.call(controllers.AdminUser.getTableauAdminUsers(version, mfr, prod, sch))
      }
  
    // @LINE:124
    case controllers_AdminUser_addCustomerUser81_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_addCustomerUser81_invoker.call(controllers.AdminUser.addCustomerUser(version, mfr))
      }
  
    // @LINE:125
    case controllers_AdminUser_listCustomerUsers82_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_listCustomerUsers82_invoker.call(controllers.AdminUser.listCustomerUsers(version, mfr))
      }
  
    // @LINE:126
    case controllers_AdminUser_listCustomerUsersNonSso83_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_listCustomerUsersNonSso83_invoker.call(controllers.AdminUser.listCustomerUsersNonSso(version, mfr))
      }
  
    // @LINE:127
    case controllers_AdminUser_listCustomerUsersSso84_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_listCustomerUsersSso84_invoker.call(controllers.AdminUser.listCustomerUsersSso(version, mfr))
      }
  
    // @LINE:128
    case controllers_AdminUser_listCustomerUsersRuleCreator85_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminUser_listCustomerUsersRuleCreator85_invoker.call(controllers.AdminUser.listCustomerUsersRuleCreator(version, mfr, prod, sch))
      }
  
    // @LINE:129
    case controllers_AdminUser_removeCustomerUsers86_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_removeCustomerUsers86_invoker.call(controllers.AdminUser.removeCustomerUsers(version, usr, mfr))
      }
  
    // @LINE:130
    case controllers_AdminUser_regenerateVerificationEmail87_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("email", None)) { (version, email) =>
        controllers_AdminUser_regenerateVerificationEmail87_invoker.call(controllers.AdminUser.regenerateVerificationEmail(version, email))
      }
  
    // @LINE:131
    case controllers_AdminUser_disableCustomerUsers88_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_disableCustomerUsers88_invoker.call(controllers.AdminUser.disableCustomerUsers(version, usr, mfr))
      }
  
    // @LINE:132
    case controllers_AdminUser_enableCustomerUsers89_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("usr", None), params.fromPath[String]("mfr", None)) { (version, usr, mfr) =>
        controllers_AdminUser_enableCustomerUsers89_invoker.call(controllers.AdminUser.enableCustomerUsers(version, usr, mfr))
      }
  
    // @LINE:133
    case controllers_AdminUser_modifyCustomerUser90_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_modifyCustomerUser90_invoker.call(controllers.AdminUser.modifyCustomerUser(version, mfr))
      }
  
    // @LINE:134
    case controllers_AdminUser_bulkUpdateCustomerUser91_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_bulkUpdateCustomerUser91_invoker.call(controllers.AdminUser.bulkUpdateCustomerUser(version, mfr))
      }
  
    // @LINE:135
    case controllers_AdminUser_bulkDeleteCustomerUser92_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminUser_bulkDeleteCustomerUser92_invoker.call(controllers.AdminUser.bulkDeleteCustomerUser(version, mfr))
      }
  
    // @LINE:139
    case controllers_AdminRole_addForm93_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRole_addForm93_invoker.call(controllers.AdminRole.addForm(version))
      }
  
    // @LINE:140
    case controllers_AdminRole_addDomain94_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("roleName", None)) { (version, roleName) =>
        controllers_AdminRole_addDomain94_invoker.call(controllers.AdminRole.addDomain(version, roleName))
      }
  
    // @LINE:141
    case controllers_AdminRole_edit95_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("roleName", None), params.fromPath[String]("domain", None), params.fromPath[String]("permissions", None), params.fromPath[String]("mps", None), params.fromPath[String]("realm", None)) { (version, roleName, domain, permissions, mps, realm) =>
        controllers_AdminRole_edit95_invoker.call(controllers.AdminRole.edit(version, roleName, domain, permissions, mps, realm))
      }
  
    // @LINE:142
    case controllers_AdminRole_add96_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRole_add96_invoker.call(controllers.AdminRole.add(version))
      }
  
    // @LINE:143
    case controllers_AdminRole_addrole97_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminRole_addrole97_invoker.call(controllers.AdminRole.addrole(version, mfr))
      }
  
    // @LINE:144
    case controllers_AdminRole_modifyRole98_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminRole_modifyRole98_invoker.call(controllers.AdminRole.modifyRole(version, mfr))
      }
  
    // @LINE:145
    case controllers_AdminRole_bulkUpdateRoleProducts99_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminRole_bulkUpdateRoleProducts99_invoker.call(controllers.AdminRole.bulkUpdateRoleProducts(version, mfr))
      }
  
    // @LINE:146
    case controllers_AdminRole_list100_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminRole_list100_invoker.call(controllers.AdminRole.list(version))
      }
  
    // @LINE:147
    case controllers_AdminRole_listall101_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_AdminRole_listall101_invoker.call(controllers.AdminRole.listall(version, mfr))
      }
  
    // @LINE:148
    case controllers_AdminRole_delete102_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("roleName", None)) { (version, roleName) =>
        controllers_AdminRole_delete102_invoker.call(controllers.AdminRole.delete(version, roleName))
      }
  
    // @LINE:149
    case controllers_AdminRole_deleterole103_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("roleName", None), params.fromPath[String]("mfr", None)) { (version, roleName, mfr) =>
        controllers_AdminRole_deleterole103_invoker.call(controllers.AdminRole.deleterole(version, roleName, mfr))
      }
  
    // @LINE:150
    case controllers_AdminRole_deleteRoleProduct104_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("roleName", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, roleName, mfr, prod, sch) =>
        controllers_AdminRole_deleteRoleProduct104_invoker.call(controllers.AdminRole.deleteRoleProduct(version, roleName, mfr, prod, sch))
      }
  
    // @LINE:151
    case controllers_AdminRole_domainsList105_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("roleName", None)) { (version, mfr, roleName) =>
        controllers_AdminRole_domainsList105_invoker.call(controllers.AdminRole.domainsList(version, mfr, roleName))
      }
  
    // @LINE:152
    case controllers_AdminRole_userDetails106_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_userDetails106_invoker.call(controllers.AdminRole.userDetails(version, mfr, prod, sch))
      }
  
    // @LINE:153
    case controllers_AdminRole_listRoles107_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_listRoles107_invoker.call(controllers.AdminRole.listRoles(version, mfr, prod, sch))
      }
  
    // @LINE:154
    case controllers_AdminRole_listHealthCheckRoles108_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_listHealthCheckRoles108_invoker.call(controllers.AdminRole.listHealthCheckRoles(version, mfr, prod, sch))
      }
  
    // @LINE:155
    case controllers_AdminRole_tableauUpdateRole109_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_tableauUpdateRole109_invoker.call(controllers.AdminRole.tableauUpdateRole(version, mfr, prod, sch))
      }
  
    // @LINE:156
    case controllers_AdminRole_tableauAddUpdateUsers110_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_tableauAddUpdateUsers110_invoker.call(controllers.AdminRole.tableauAddUpdateUsers(version, mfr, prod, sch))
      }
  
    // @LINE:157
    case controllers_AdminRole_tableauDeleteUsers111_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_tableauDeleteUsers111_invoker.call(controllers.AdminRole.tableauDeleteUsers(version, mfr, prod, sch))
      }
  
    // @LINE:158
    case controllers_AdminRole_isTableauConfigured112_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_isTableauConfigured112_invoker.call(controllers.AdminRole.isTableauConfigured(version, mfr, prod, sch))
      }
  
    // @LINE:161
    case controllers_SSOSoap_getUserInfo113_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("domain", None), params.fromQuery[String]("sessionId", None), params.fromQuery[String]("serverUrl", None), params.fromQuery[String]("additional_params", Some(null))) { (version, mfr, prod, domain, sessionId, serverUrl, additional_params) =>
        controllers_SSOSoap_getUserInfo113_invoker.call(controllers.SSOSoap.getUserInfo(version, mfr, prod, domain, sessionId, serverUrl, additional_params))
      }
  
    // @LINE:162
    case controllers_SSOPingone_getUserInfo114_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("domain", None), params.fromQuery[String]("tokenid", None), params.fromQuery[String]("agentid", None)) { (version, mfr, prod, domain, tokenid, agentid) =>
        controllers_SSOPingone_getUserInfo114_invoker.call(controllers.SSOPingone.getUserInfo(version, mfr, prod, domain, tokenid, agentid))
      }
  
    // @LINE:164
    case controllers_SSOPingoneEmbedded_getUserInfo115_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("domain", None), params.fromPath[String]("dashboardId", None), params.fromQuery[String]("tokenid", None), params.fromQuery[String]("agentid", None)) { (version, mfr, prod, domain, dashboardId, tokenid, agentid) =>
        controllers_SSOPingoneEmbedded_getUserInfo115_invoker.call(controllers.SSOPingoneEmbedded.getUserInfo(version, mfr, prod, domain, dashboardId, tokenid, agentid))
      }
  
    // @LINE:166
    case controllers_Application_trackUser116_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("app", None), params.fromPath[String]("module", None), params.fromPath[String]("activity", None), params.fromQuery[Option[String]]("switched_feature", None)) { (version, mfr, prod, sch, app, module, activity, switched_feature) =>
        controllers_Application_trackUser116_invoker.call(controllers.Application.trackUser(version, mfr, prod, sch, app, module, activity, switched_feature))
      }
  
    // @LINE:167
    case controllers_AdminUser_tsUserTracking117_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("ec", None), params.fromPath[String]("st", None), params.fromPath[String]("et", None), params.fromQuery[List[String]]("col", None), params.fromQuery[Option[String]]("filter", None), params.fromQuery[Option[String]]("aggr", None), params.fromQuery[Option[String]]("groupby", None), params.fromQuery[Option[String]]("orderby", None), params.fromQuery[Option[Integer]]("limit", None)) { (version, mfr, prod, sch, ec, st, et, col, filter, aggr, groupby, orderby, limit) =>
        controllers_AdminUser_tsUserTracking117_invoker.call(controllers.AdminUser.tsUserTracking(version, mfr, prod, sch, ec, st, et, col, filter, aggr, groupby, orderby, limit))
      }
  
    // @LINE:170
    case controllers_Analytics_sql118_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("sqlQuery", None)) { (version, sqlQuery) =>
        controllers_Analytics_sql118_invoker.call(controllers.Analytics.sql(version, sqlQuery))
      }
  
    // @LINE:171
    case controllers_Analytics_refreshSpark119_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Analytics_refreshSpark119_invoker.call(controllers.Analytics.refreshSpark(version))
      }
  
    // @LINE:173
    case controllers_Analytics_hql120_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("hqlQuery", None)) { (version, hqlQuery) =>
        controllers_Analytics_hql120_invoker.call(controllers.Analytics.hql(version, hqlQuery))
      }
  
    // @LINE:177
    case controllers_AdminRealm_realmInfo121_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRealm_realmInfo121_invoker.call(controllers.AdminRealm.realmInfo(version, mfr, prod, sch))
      }
  
    // @LINE:180
    case controllers_Assets_at122_route(params) =>
      call(Param[String]("path", Right("/public")), params.fromPath[String]("file", None)) { (path, file) =>
        controllers_Assets_at122_invoker.call(controllers.Assets.at(path, file))
      }
  
    // @LINE:183
    case controllers_Clinsight_createMailWrapper123_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_createMailWrapper123_invoker.call(controllers.Clinsight.createMailWrapper(version))
      }
  
    // @LINE:184
    case controllers_Clinsight_clinsightView124_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_clinsightView124_invoker.call(controllers.Clinsight.clinsightView(version))
      }
  
    // @LINE:185
    case controllers_Clinsight_login125_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_login125_invoker.call(controllers.Clinsight.login(version))
      }
  
    // @LINE:186
    case controllers_Clinsight_getUserDetails126_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_getUserDetails126_invoker.call(controllers.Clinsight.getUserDetails(version))
      }
  
    // @LINE:187
    case controllers_Clinsight_setDefaultMPS127_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_setDefaultMPS127_invoker.call(controllers.Clinsight.setDefaultMPS(version))
      }
  
    // @LINE:188
    case controllers_Clinsight_registerProspect128_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_registerProspect128_invoker.call(controllers.Clinsight.registerProspect(version))
      }
  
    // @LINE:189
    case controllers_Clinsight_verifyProspect129_route(params) =>
      call(params.fromPath[String]("version", None), params.fromQuery[String]("email", None), params.fromQuery[String]("token_id", None)) { (version, email, token_id) =>
        controllers_Clinsight_verifyProspect129_invoker.call(controllers.Clinsight.verifyProspect(version, email, token_id))
      }
  
    // @LINE:190
    case controllers_Clinsight_regenerateVerificationEmail130_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("email", None)) { (version, email) =>
        controllers_Clinsight_regenerateVerificationEmail130_invoker.call(controllers.Clinsight.regenerateVerificationEmail(version, email))
      }
  
    // @LINE:191
    case controllers_Clinsight_clinsightRegistrationView131_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_clinsightRegistrationView131_invoker.call(controllers.Clinsight.clinsightRegistrationView(version))
      }
  
    // @LINE:192
    case controllers_Clinsight_deleteUserDeviceInfo132_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_deleteUserDeviceInfo132_invoker.call(controllers.Clinsight.deleteUserDeviceInfo(version))
      }
  
    // @LINE:193
    case controllers_Clinsight_updateUserDeviceInfo133_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_updateUserDeviceInfo133_invoker.call(controllers.Clinsight.updateUserDeviceInfo(version))
      }
  
    // @LINE:194
    case controllers_AdminUser_decryptUser134_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_AdminUser_decryptUser134_invoker.call(controllers.AdminUser.decryptUser(version))
      }
  
    // @LINE:195
    case controllers_AdminUser_getTableauUsername135_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None)) { (version, mfr, prod, sch, email) =>
        controllers_AdminUser_getTableauUsername135_invoker.call(controllers.AdminUser.getTableauUsername(version, mfr, prod, sch, email))
      }
  
    // @LINE:196
    case controllers_AdminRole_userRoleDetails136_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminRole_userRoleDetails136_invoker.call(controllers.AdminRole.userRoleDetails(version, mfr, prod, sch))
      }
  
    // @LINE:198
    case controllers_ClinsightMenu_clinsightsMasterTree137_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None)) { (version, mfr) =>
        controllers_ClinsightMenu_clinsightsMasterTree137_invoker.call(controllers.ClinsightMenu.clinsightsMasterTree(version, mfr))
      }
  
    // @LINE:199
    case controllers_ClinsightMenu_clinsightsMpsTree138_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromQuery[Option[String]]("user", None), params.fromQuery[Option[Long]]("clinsights_role_id", None)) { (version, mfr, prod, sch, user, clinsights_role_id) =>
        controllers_ClinsightMenu_clinsightsMpsTree138_invoker.call(controllers.ClinsightMenu.clinsightsMpsTree(version, mfr, prod, sch, user, clinsights_role_id))
      }
  
    // @LINE:200
    case controllers_ClinsightMenu_clinsightsMpsFlatMenu139_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromQuery[Option[String]]("user", None), params.fromQuery[Option[Long]]("clinsights_role_id", None)) { (version, mfr, prod, sch, user, clinsights_role_id) =>
        controllers_ClinsightMenu_clinsightsMpsFlatMenu139_invoker.call(controllers.ClinsightMenu.clinsightsMpsFlatMenu(version, mfr, prod, sch, user, clinsights_role_id))
      }
  
    // @LINE:201
    case controllers_ClinsightMenu_clinsightsMpsNodeHide140_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("operation_type", None), params.fromPath[String]("mfr", None)) { (version, operation_type, mfr) =>
        controllers_ClinsightMenu_clinsightsMpsNodeHide140_invoker.call(controllers.ClinsightMenu.clinsightsMpsNodeHide(version, operation_type, mfr))
      }
  
    // @LINE:202
    case controllers_ClinsightMenu_clinsightsMpsNodeDisable141_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("operation_type", None), params.fromPath[String]("mfr", None)) { (version, operation_type, mfr) =>
        controllers_ClinsightMenu_clinsightsMpsNodeDisable141_invoker.call(controllers.ClinsightMenu.clinsightsMpsNodeDisable(version, operation_type, mfr))
      }
  
    // @LINE:203
    case controllers_ClinsightMenu_clinsightsRoleNodeHide142_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("operation_type", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, operation_type, mfr, prod, sch) =>
        controllers_ClinsightMenu_clinsightsRoleNodeHide142_invoker.call(controllers.ClinsightMenu.clinsightsRoleNodeHide(version, operation_type, mfr, prod, sch))
      }
  
    // @LINE:204
    case controllers_ClinsightMenu_clinsightsRoleNodeDisable143_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("operation_type", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, operation_type, mfr, prod, sch) =>
        controllers_ClinsightMenu_clinsightsRoleNodeDisable143_invoker.call(controllers.ClinsightMenu.clinsightsRoleNodeDisable(version, operation_type, mfr, prod, sch))
      }
  
    // @LINE:205
    case controllers_Clinsight_mobileLogin144_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_Clinsight_mobileLogin144_invoker.call(controllers.Clinsight.mobileLogin(version))
      }
  
    // @LINE:206
    case controllers_Clinsight_getUserMpsDetails145_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_Clinsight_getUserMpsDetails145_invoker.call(controllers.Clinsight.getUserMpsDetails(version, mfr, prod, sch))
      }
  
    // @LINE:209
    case controllers_SqlHelper_getQueryDB146_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("sqlQuery", None)) { (version, sqlQuery) =>
        controllers_SqlHelper_getQueryDB146_invoker.call(controllers.SqlHelper.getQueryDB(version, sqlQuery))
      }
  
    // @LINE:210
    case controllers_SqlHelper_queryDB147_route(params) =>
      call(params.fromPath[String]("version", None)) { (version) =>
        controllers_SqlHelper_queryDB147_invoker.call(controllers.SqlHelper.queryDB(version))
      }
  
    // @LINE:213
    case controllers_AdminCustomer_ecSystemsListData148_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("ec", None), params.fromPath[Int]("st", None), params.fromPath[Int]("en", None)) { (version, mfr, prod, sch, ec, st, en) =>
        controllers_AdminCustomer_ecSystemsListData148_invoker.call(controllers.AdminCustomer.ecSystemsListData(version, mfr, prod, sch, ec, st, en))
      }
  
    // @LINE:214
    case controllers_AdminCustomer_ecSystemsColsListData149_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecSystemsColsListData149_invoker.call(controllers.AdminCustomer.ecSystemsColsListData(version, mfr, prod, sch))
      }
  
    // @LINE:215
    case controllers_AdminCustomer_ecAvailableSystemsListData150_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_AdminCustomer_ecAvailableSystemsListData150_invoker.call(controllers.AdminCustomer.ecAvailableSystemsListData(version, mfr, prod, sch))
      }
  
    // @LINE:216
    case controllers_AdminCustomer_userECAvailableSystemsListData151_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None)) { (version, mfr, prod, sch, email) =>
        controllers_AdminCustomer_userECAvailableSystemsListData151_invoker.call(controllers.AdminCustomer.userECAvailableSystemsListData(version, mfr, prod, sch, email))
      }
  
    // @LINE:217
    case controllers_AdminCustomer_userEcSystemsListData152_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Int]("st", None), params.fromPath[Int]("en", None)) { (version, mfr, prod, sch, email, st, en) =>
        controllers_AdminCustomer_userEcSystemsListData152_invoker.call(controllers.AdminCustomer.userEcSystemsListData(version, mfr, prod, sch, email, st, en))
      }
  
    // @LINE:220
    case controllers_RulesAlerts_alertFilterList153_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromQuery[Option[Long]]("ruleId", None), params.fromQuery[Option[String]]("user", None)) { (version, mfr, prod, sch, ruleId, user) =>
        controllers_RulesAlerts_alertFilterList153_invoker.call(controllers.RulesAlerts.alertFilterList(version, mfr, prod, sch, ruleId, user))
      }
  
    // @LINE:221
    case controllers_RulesAlerts_addUpdateAlertFiltersAtributes154_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_RulesAlerts_addUpdateAlertFiltersAtributes154_invoker.call(controllers.RulesAlerts.addUpdateAlertFiltersAtributes(version, mfr, prod, sch))
      }
  
    // @LINE:222
    case controllers_RulesAlerts_bulkRulesDeleteAlertFiltersAtributes155_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_RulesAlerts_bulkRulesDeleteAlertFiltersAtributes155_invoker.call(controllers.RulesAlerts.bulkRulesDeleteAlertFiltersAtributes(version, mfr, prod, sch))
      }
  
    // @LINE:223
    case controllers_RulesAlerts_bulkUsersDeleteAlertFiltersAtributes156_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_RulesAlerts_bulkUsersDeleteAlertFiltersAtributes156_invoker.call(controllers.RulesAlerts.bulkUsersDeleteAlertFiltersAtributes(version, mfr, prod, sch))
      }
  
    // @LINE:224
    case controllers_RulesAlerts_sendNotification157_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None)) { (version, mfr, prod, sch) =>
        controllers_RulesAlerts_sendNotification157_invoker.call(controllers.RulesAlerts.sendNotification(version, mfr, prod, sch))
      }
  
    // @LINE:227
    case controllers_Notification_notificationList158_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromQuery[Option[Boolean]]("deleted", None), params.fromQuery[Option[Boolean]]("read", None)) { (version, mfr, prod, sch, email, deleted, read) =>
        controllers_Notification_notificationList158_invoker.call(controllers.Notification.notificationList(version, mfr, prod, sch, email, deleted, read))
      }
  
    // @LINE:228
    case controllers_Notification_notificationPaginationList159_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Int]("st", None), params.fromPath[Int]("en", None), params.fromQuery[Option[Boolean]]("deleted", None), params.fromQuery[Option[Boolean]]("read", None)) { (version, mfr, prod, sch, email, st, en, deleted, read) =>
        controllers_Notification_notificationPaginationList159_invoker.call(controllers.Notification.notificationPaginationList(version, mfr, prod, sch, email, st, en, deleted, read))
      }
  
    // @LINE:229
    case controllers_Notification_updateNotificationsReadTime160_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Boolean]("read", None)) { (version, mfr, prod, sch, email, read) =>
        controllers_Notification_updateNotificationsReadTime160_invoker.call(controllers.Notification.updateNotificationsReadTime(version, mfr, prod, sch, email, read))
      }
  
    // @LINE:230
    case controllers_Notification_updateNotificationsDeletedTime161_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Boolean]("delete", None)) { (version, mfr, prod, sch, email, delete) =>
        controllers_Notification_updateNotificationsDeletedTime161_invoker.call(controllers.Notification.updateNotificationsDeletedTime(version, mfr, prod, sch, email, delete))
      }
  
    // @LINE:231
    case controllers_Notification_markAllNotificationsReadTime162_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Boolean]("read", None)) { (version, mfr, prod, sch, email, read) =>
        controllers_Notification_markAllNotificationsReadTime162_invoker.call(controllers.Notification.markAllNotificationsReadTime(version, mfr, prod, sch, email, read))
      }
  
    // @LINE:232
    case controllers_Notification_markAllNotificationsDeletedTime163_route(params) =>
      call(params.fromPath[String]("version", None), params.fromPath[String]("mfr", None), params.fromPath[String]("prod", None), params.fromPath[String]("sch", None), params.fromPath[String]("email", None), params.fromPath[Boolean]("delete", None)) { (version, mfr, prod, sch, email, delete) =>
        controllers_Notification_markAllNotificationsDeletedTime163_invoker.call(controllers.Notification.markAllNotificationsDeletedTime(version, mfr, prod, sch, email, delete))
      }
  }
}