
// @GENERATOR:play-routes-compiler
// @SOURCE:/home/ritesh/development/UserManagementServer/conf/routes
// @DATE:Mon Apr 18 12:31:26 IST 2022

import play.api.mvc.{ QueryStringBindable, PathBindable, Call, JavascriptLiteral }
import play.core.routing.{ HandlerDef, ReverseRouteContext, queryString, dynamicString }


import _root_.controllers.Assets.Asset

// @LINE:6
package controllers {

  // @LINE:180
  class ReverseAssets(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:180
    def at(file:String): Call = {
      implicit val _rrc = new ReverseRouteContext(Map(("path", "/public")))
      Call("GET", _prefix + { _defaultPrefix } + "assets/" + implicitly[PathBindable[String]].unbind("file", file))
    }
  
  }

  // @LINE:227
  class ReverseNotification(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:231
    def markAllNotificationsReadTime(version:String, mfr:String, prod:String, sch:String, email:String, read:Boolean): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/mark_all/read/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Boolean]].unbind("read", read))
    }
  
    // @LINE:230
    def updateNotificationsDeletedTime(version:String, mfr:String, prod:String, sch:String, email:String, delete:Boolean): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/bulk_update/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Boolean]].unbind("delete", delete))
    }
  
    // @LINE:228
    def notificationPaginationList(version:String, mfr:String, prod:String, sch:String, email:String, st:Int, en:Int, deleted:Option[Boolean], read:Option[Boolean]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Int]].unbind("st", st) + "/" + implicitly[PathBindable[Int]].unbind("en", en) + queryString(List(Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("deleted", deleted)), Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("read", read)))))
    }
  
    // @LINE:232
    def markAllNotificationsDeletedTime(version:String, mfr:String, prod:String, sch:String, email:String, delete:Boolean): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/mark_all/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Boolean]].unbind("delete", delete))
    }
  
    // @LINE:229
    def updateNotificationsReadTime(version:String, mfr:String, prod:String, sch:String, email:String, read:Boolean): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/bulk_update/read/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Boolean]].unbind("read", read))
    }
  
    // @LINE:227
    def notificationList(version:String, mfr:String, prod:String, sch:String, email:String, deleted:Option[Boolean], read:Option[Boolean]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/notification/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + queryString(List(Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("deleted", deleted)), Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("read", read)))))
    }
  
  }

  // @LINE:220
  class ReverseRulesAlerts(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:220
    def alertFilterList(version:String, mfr:String, prod:String, sch:String, ruleId:Option[Long], user:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/rules/alerts/filters/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + queryString(List(Some(implicitly[QueryStringBindable[Option[Long]]].unbind("ruleId", ruleId)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("user", user)))))
    }
  
    // @LINE:221
    def addUpdateAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/rules/alerts/filters/add_update/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:222
    def bulkRulesDeleteAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/rules/alerts/filters/bulk_rules_delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:223
    def bulkUsersDeleteAlertFiltersAtributes(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/rules/alerts/filters/bulk_users_delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:224
    def sendNotification(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/rules/alerts/filters/group/users/notification/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
  }

  // @LINE:88
  class ReverseAdminRealm(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:90
    def list(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/realm/list")
    }
  
    // @LINE:89
    def edit(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/realm/edit")
    }
  
    // @LINE:177
    def realmInfo(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/realm/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:91
    def delete(version:String, realm:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/realm/delete/" + implicitly[PathBindable[String]].unbind("realm", dynamicString(realm)))
    }
  
    // @LINE:88
    def add(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/realm/add")
    }
  
  }

  // @LINE:183
  class ReverseClinsight(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:186
    def getUserDetails(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/userdetails")
    }
  
    // @LINE:206
    def getUserMpsDetails(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/mobile/userdetails/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:191
    def clinsightRegistrationView(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/registration")
    }
  
    // @LINE:189
    def verifyProspect(version:String, email:String, token_id:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/campaign/user/verification" + queryString(List(Some(implicitly[QueryStringBindable[String]].unbind("email", email)), Some(implicitly[QueryStringBindable[String]].unbind("token_id", token_id)))))
    }
  
    // @LINE:187
    def setDefaultMPS(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/setdefaultmps")
    }
  
    // @LINE:205
    def mobileLogin(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/mobile/login")
    }
  
    // @LINE:183
    def createMailWrapper(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/create/email")
    }
  
    // @LINE:185
    def login(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/login")
    }
  
    // @LINE:184
    def clinsightView(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/clinsight")
    }
  
    // @LINE:188
    def registerProspect(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/campaign/user/add")
    }
  
    // @LINE:190
    def regenerateVerificationEmail(version:String, email:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/campaign/user/regenerate/verification/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)))
    }
  
    // @LINE:192
    def deleteUserDeviceInfo(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user_info/delete/device_info")
    }
  
    // @LINE:193
    def updateUserDeviceInfo(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user_info/update/device_info")
    }
  
  }

  // @LINE:170
  class ReverseAnalytics(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:173
    def hql(version:String, hqlQuery:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/analytics/hql/" + implicitly[PathBindable[String]].unbind("hqlQuery", dynamicString(hqlQuery)))
    }
  
    // @LINE:170
    def sql(version:String, sqlQuery:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/analytics/" + implicitly[PathBindable[String]].unbind("sqlQuery", dynamicString(sqlQuery)))
    }
  
    // @LINE:171
    def refreshSpark(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/spark/refresh")
    }
  
  }

  // @LINE:162
  class ReverseSSOPingone(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:162
    def getUserInfo(version:String, mfr:String, prod:String, domain:String, tokenid:String, agentid:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/sso/ping/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)) + queryString(List(Some(implicitly[QueryStringBindable[String]].unbind("tokenid", tokenid)), Some(implicitly[QueryStringBindable[String]].unbind("agentid", agentid)))))
    }
  
  }

  // @LINE:30
  class ReverseCallback(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:30
    def callback(version:String, mfr:String, prod:String, domain:String, code:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/startsso/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("code", code)))))
    }
  
  }

  // @LINE:198
  class ReverseClinsightMenu(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:201
    def clinsightsMpsNodeHide(version:String, operation_type:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/" + implicitly[PathBindable[String]].unbind("operation_type", dynamicString(operation_type)) + "/mps/menu/node/hide/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:199
    def clinsightsMpsTree(version:String, mfr:String, prod:String, sch:String, user:Option[String], clinsights_role_id:Option[Long]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/mps/menu/tree/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("user", user)), Some(implicitly[QueryStringBindable[Option[Long]]].unbind("clinsights_role_id", clinsights_role_id)))))
    }
  
    // @LINE:203
    def clinsightsRoleNodeHide(version:String, operation_type:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/" + implicitly[PathBindable[String]].unbind("operation_type", dynamicString(operation_type)) + "/role/menu/node/hide/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:204
    def clinsightsRoleNodeDisable(version:String, operation_type:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/" + implicitly[PathBindable[String]].unbind("operation_type", dynamicString(operation_type)) + "/role/menu/node/disable/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:200
    def clinsightsMpsFlatMenu(version:String, mfr:String, prod:String, sch:String, user:Option[String], clinsights_role_id:Option[Long]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/mps/menu/flat_json/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("user", user)), Some(implicitly[QueryStringBindable[Option[Long]]].unbind("clinsights_role_id", clinsights_role_id)))))
    }
  
    // @LINE:198
    def clinsightsMasterTree(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/master/menu/tree/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:202
    def clinsightsMpsNodeDisable(version:String, operation_type:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/" + implicitly[PathBindable[String]].unbind("operation_type", dynamicString(operation_type)) + "/mps/menu/node/disable/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
  }

  // @LINE:161
  class ReverseSSOSoap(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:161
    def getUserInfo(version:String, mfr:String, prod:String, domain:String, sessionId:String, serverUrl:String, additional_params:String = null): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/sso/soap/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)) + queryString(List(Some(implicitly[QueryStringBindable[String]].unbind("sessionId", sessionId)), Some(implicitly[QueryStringBindable[String]].unbind("serverUrl", serverUrl)), if(additional_params == null) None else Some(implicitly[QueryStringBindable[String]].unbind("additional_params", additional_params)))))
    }
  
  }

  // @LINE:95
  class ReverseAdminUser(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:106
    def edit(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/edit/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:195
    def getTableauUsername(version:String, mfr:String, prod:String, sch:String, email:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/tableau/user/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)))
    }
  
    // @LINE:113
    def changePasswd(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/change/passwd/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:117
    def exportLimit(version:String, limit:Int, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/eventexport/" + implicitly[PathBindable[Int]].unbind("limit", limit) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:109
    def editMulti(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/users/edit/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:126
    def listCustomerUsersNonSso(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/listnonsso/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:95
    def list(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/list")
    }
  
    // @LINE:128
    def listCustomerUsersRuleCreator(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/listrulecreator/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:125
    def listCustomerUsers(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:129
    def removeCustomerUsers(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/remove/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:114
    def updateDefaults(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/update/defaults/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:121
    def getTableauAdminUsers(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/tableauadmin/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:119
    def isDashboardAdmin(version:String, mfr:String, prod:String, sch:String, userid:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/dashboardadmin/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("userid", dynamicString(userid)))
    }
  
    // @LINE:124
    def addCustomerUser(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:167
    def tsUserTracking(version:String, mfr:String, prod:String, sch:String, ec:String, st:String, et:String, col:List[String], filter:Option[String], aggr:Option[String], groupby:Option[String], orderby:Option[String], limit:Option[Integer]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user_tracking/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("ec", dynamicString(ec)) + "/" + implicitly[PathBindable[String]].unbind("st", dynamicString(st)) + "/" + implicitly[PathBindable[String]].unbind("et", dynamicString(et)) + queryString(List(Some(implicitly[QueryStringBindable[List[String]]].unbind("col", col)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("filter", filter)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("aggr", aggr)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("groupby", groupby)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("orderby", orderby)), Some(implicitly[QueryStringBindable[Option[Integer]]].unbind("limit", limit)))))
    }
  
    // @LINE:131
    def disableCustomerUsers(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/disable/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:132
    def enableCustomerUsers(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/enable/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:103
    def addCustomerUserAdmin(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/customer/user/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:116
    def disableInfo(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/disable/info/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:118
    def resetPasswd(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/reset/passwd/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:107
    def remove(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/remove/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:108
    def editMultiForm(version:String, mfr:String, emails:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/users/edit/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("emails", dynamicString(emails)))
    }
  
    // @LINE:133
    def modifyCustomerUser(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/modify/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:127
    def listCustomerUsersSso(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/listsso/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:115
    def byEmail(version:String, mfr:String, userid:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/exists/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("userid", dynamicString(userid)))
    }
  
    // @LINE:98
    def listByMfr(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:104
    def editCustomerUserAdmin(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/customer/user/edit/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:135
    def bulkDeleteCustomerUser(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/bulk_delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:134
    def bulkUpdateCustomerUser(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/bulk_update/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:105
    def editForm(version:String, usr:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/edit/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:111
    def createPasswd(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/create/passwd")
    }
  
    // @LINE:102
    def add(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/add")
    }
  
    // @LINE:194
    def decryptUser(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/decrypt")
    }
  
    // @LINE:96
    def listByOrg(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:120
    def getDashboardAdminUsers(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/dashboardadmin/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:130
    def regenerateVerificationEmail(version:String, email:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/customer/user/regenerate/verification/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)))
    }
  
    // @LINE:112
    def forgotPasswd(version:String, usr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/forgot/passwd/" + implicitly[PathBindable[String]].unbind("usr", dynamicString(usr)))
    }
  
    // @LINE:101
    def addForm(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/user/add")
    }
  
  }

  // @LINE:6
  class ReverseApplication(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:24
    def monitor(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/monitor")
    }
  
    // @LINE:23
    def uHome(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/home/user")
    }
  
    // @LINE:36
    def logout(version:String, mps:Option[String], feature:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/logout" + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("mps", mps)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("feature", feature)))))
    }
  
    // @LINE:6
    def options(path:String): Call = {
    
      (path: @unchecked) match {
      
        // @LINE:6
        case (path) if path == "" =>
          implicit val _rrc = new ReverseRouteContext(Map(("path", "")))
          Call("OPTIONS", _prefix)
      
        // @LINE:7
        case (path)  =>
          import ReverseRouteContext.empty
          Call("OPTIONS", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("path", path))
      
      }
    
    }
  
    // @LINE:41
    def resendOTP(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/resendOTP")
    }
  
    // @LINE:47
    def updateLoginSuccess(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/updateloginsuccess")
    }
  
    // @LINE:44
    def validateAccessToken(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/validate/access_token")
    }
  
    // @LINE:34
    def uiLogin(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/uilogin")
    }
  
    // @LINE:50
    def xProxy(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/xproxy")
    }
  
    // @LINE:40
    def verifyOTP(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/verifyOTP")
    }
  
    // @LINE:33
    def login(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/login")
    }
  
    // @LINE:38
    def appLogin(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/aa/app_login")
    }
  
    // @LINE:166
    def trackUser(version:String, mfr:String, prod:String, sch:String, app:String, module:String, activity:String, switched_feature:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user_tracking/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("app", dynamicString(app)) + "/" + implicitly[PathBindable[String]].unbind("module", dynamicString(module)) + "/" + implicitly[PathBindable[String]].unbind("activity", dynamicString(activity)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("switched_feature", switched_feature)))))
    }
  
    // @LINE:9
    def index(): Call = {
    
      () match {
      
        // @LINE:9
        case ()  =>
          import ReverseRouteContext.empty
          Call("GET", _prefix)
      
      }
    
    }
  
    // @LINE:17
    def createpwd(token_id:String, email:String, domain:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + "assets/create-password/" + implicitly[PathBindable[String]].unbind("token_id", dynamicString(token_id)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)))
    }
  
    // @LINE:22
    def vHome(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/home/visitor")
    }
  
  }

  // @LINE:28
  class ReverseCGIHandler(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:28
    def forward(serialNumber:Option[String], cust_name:Option[String], db:Option[String], sessionId:Option[String], serverUrl:Option[String], dashboardId:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + "gb/ui/prod/sso/testsso.cgi" + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("serialNumber", serialNumber)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("cust_name", cust_name)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("db", db)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("sessionId", sessionId)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("serverUrl", serverUrl)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("dashboardId", dashboardId)))))
    }
  
  }

  // @LINE:53
  class ReverseAdminCustomer(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:56
    def delete(version:String, mfr:String, prod:String, sch:String, ec:String, realm:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/ec/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("ec", dynamicString(ec)) + "/" + implicitly[PathBindable[String]].unbind("realm", dynamicString(realm)))
    }
  
    // @LINE:66
    def ecSystemsListFiltered(version:String, mfr:String, prod:String, sch:String, ec:String, st:Int, en:Int, pattern:Option[String], rt:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/analytics/system/ec/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("ec", dynamicString(ec)) + "/" + implicitly[PathBindable[Int]].unbind("st", st) + "/" + implicitly[PathBindable[Int]].unbind("en", en) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("pattern", pattern)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("rt", rt)))))
    }
  
    // @LINE:61
    def ecHealthCheckUpdate(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/update/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:58
    def ecHealthCheck(version:String, mfr:String, prod:String, sch:String, user:Option[String], fnCallSrcOpt:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/details/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("user", user)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("fnCallSrcOpt", fnCallSrcOpt)))))
    }
  
    // @LINE:64
    def ecHealthCheckDelete(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:62
    def ecHealthCheckAddUser(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/addUser/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:213
    def ecSystemsListData(version:String, mfr:String, prod:String, sch:String, ec:String, st:Int, en:Int): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/bundle/system_info/ec/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("ec", dynamicString(ec)) + "/" + implicitly[PathBindable[Int]].unbind("st", st) + "/" + implicitly[PathBindable[Int]].unbind("en", en))
    }
  
    // @LINE:214
    def ecSystemsColsListData(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/bundle/system_cols_info/ec/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:53
    def list(version:String, is_request:Option[Boolean]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/ec/list" + queryString(List(Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("is_request", is_request)))))
    }
  
    // @LINE:59
    def ecHealthCheckMfr(version:String, mfr:String, user:Option[String], fnCallSrcOpt:Option[String]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/details/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + queryString(List(Some(implicitly[QueryStringBindable[Option[String]]].unbind("user", user)), Some(implicitly[QueryStringBindable[Option[String]]].unbind("fnCallSrcOpt", fnCallSrcOpt)))))
    }
  
    // @LINE:215
    def ecAvailableSystemsListData(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/bundle/available_system_info/ec/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:57
    def getMpseInfo(version:String, mfr:String, prod:String, sch:String, ec:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/mpse/config/details/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("ec", dynamicString(ec)))
    }
  
    // @LINE:55
    def add(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/ec/add")
    }
  
    // @LINE:60
    def ecHealthCheckAdd(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:217
    def userEcSystemsListData(version:String, mfr:String, prod:String, sch:String, email:String, st:Int, en:Int): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/ec/system_info/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)) + "/" + implicitly[PathBindable[Int]].unbind("st", st) + "/" + implicitly[PathBindable[Int]].unbind("en", en))
    }
  
    // @LINE:216
    def userECAvailableSystemsListData(version:String, mfr:String, prod:String, sch:String, email:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/user/ec/available_system_info/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)) + "/" + implicitly[PathBindable[String]].unbind("email", dynamicString(email)))
    }
  
    // @LINE:63
    def ecHealthCheckUpdateUser(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/updateUser/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:65
    def ecHealthCheckDeleteMFr(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/healthcheck/ec/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:54
    def addForm(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/ec/add")
    }
  
  }

  // @LINE:69
  class ReverseAdminMfr(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:70
    def listall(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/listall")
    }
  
    // @LINE:73
    def addmfr(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/addmfr/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:80
    def listDefaultFeature(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/defaultfeature/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:69
    def list(version:String, is_request:Option[Boolean]): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/list" + queryString(List(Some(implicitly[QueryStringBindable[Option[Boolean]]].unbind("is_request", is_request)))))
    }
  
    // @LINE:83
    def listUiConfig(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/uiconfig/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:81
    def manageUiConfig(version:String, mfr:String): Call = {
    
      (version: @unchecked, mfr: @unchecked) match {
      
        // @LINE:81
        case (version, mfr)  =>
          import ReverseRouteContext.empty
          Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/uiconfig/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
      
      }
    
    }
  
    // @LINE:74
    def delete(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/delete/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:77
    def listRealm(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/realm/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:75
    def manageRealm(version:String, mfr:String): Call = {
    
      (version: @unchecked, mfr: @unchecked) match {
      
        // @LINE:75
        case (version, mfr)  =>
          import ReverseRouteContext.empty
          Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/realm/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
      
      }
    
    }
  
    // @LINE:72
    def add(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/add")
    }
  
    // @LINE:78
    def manageDefaultFeature(version:String, mfr:String): Call = {
    
      (version: @unchecked, mfr: @unchecked) match {
      
        // @LINE:78
        case (version, mfr)  =>
          import ReverseRouteContext.empty
          Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/defaultfeature/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
      
      }
    
    }
  
    // @LINE:71
    def addForm(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/mfr/add")
    }
  
  }

  // @LINE:164
  class ReverseSSOPingoneEmbedded(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:164
    def getUserInfo(version:String, mfr:String, prod:String, domain:String, dashboardId:String, tokenid:String, agentid:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/sso/ping/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)) + "/" + implicitly[PathBindable[String]].unbind("dashboardId", dynamicString(dashboardId)) + queryString(List(Some(implicitly[QueryStringBindable[String]].unbind("tokenid", tokenid)), Some(implicitly[QueryStringBindable[String]].unbind("agentid", agentid)))))
    }
  
  }

  // @LINE:209
  class ReverseSqlHelper(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:210
    def queryDB(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/db")
    }
  
    // @LINE:209
    def getQueryDB(version:String, sqlQuery:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/db/" + implicitly[PathBindable[String]].unbind("sqlQuery", dynamicString(sqlQuery)))
    }
  
  }

  // @LINE:139
  class ReverseAdminRole(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:144
    def modifyRole(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/modify/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:151
    def domainsList(version:String, mfr:String, roleName:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/domains/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)))
    }
  
    // @LINE:146
    def list(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/list")
    }
  
    // @LINE:155
    def tableauUpdateRole(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/tableau/tableauUpdateRole/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:149
    def deleterole(version:String, roleName:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/delete/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:158
    def isTableauConfigured(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/tableau/configured/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:196
    def userRoleDetails(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/cs/role/user/details/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:145
    def bulkUpdateRoleProducts(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/bulk_update/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:141
    def edit(version:String, roleName:String, domain:String, permissions:String, mps:String, realm:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/edit/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)) + "/" + implicitly[PathBindable[String]].unbind("domain", dynamicString(domain)) + "/" + implicitly[PathBindable[String]].unbind("permissions", dynamicString(permissions)) + "/" + implicitly[PathBindable[String]].unbind("mps", dynamicString(mps)) + "/" + implicitly[PathBindable[String]].unbind("realm", dynamicString(realm)))
    }
  
    // @LINE:153
    def listRoles(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/names/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:148
    def delete(version:String, roleName:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/delete/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)))
    }
  
    // @LINE:157
    def tableauDeleteUsers(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/tableau/tableauDeleteUsers/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:140
    def addDomain(version:String, roleName:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/add/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)))
    }
  
    // @LINE:143
    def addrole(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/add/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:154
    def listHealthCheckRoles(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/healthcheck/names/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:142
    def add(version:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/add")
    }
  
    // @LINE:152
    def userDetails(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/user/details/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:150
    def deleteRoleProduct(version:String, roleName:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/product/delete/" + implicitly[PathBindable[String]].unbind("roleName", dynamicString(roleName)) + "/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:156
    def tableauAddUpdateUsers(version:String, mfr:String, prod:String, sch:String): Call = {
      import ReverseRouteContext.empty
      Call("POST", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/tableau/tableauAddUpdateUsers/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)) + "/" + implicitly[PathBindable[String]].unbind("prod", dynamicString(prod)) + "/" + implicitly[PathBindable[String]].unbind("sch", dynamicString(sch)))
    }
  
    // @LINE:147
    def listall(version:String, mfr:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/usermanagement/role/list/" + implicitly[PathBindable[String]].unbind("mfr", dynamicString(mfr)))
    }
  
    // @LINE:139
    def addForm(version:String): Call = {
      import ReverseRouteContext.empty
      Call("GET", _prefix + { _defaultPrefix } + implicitly[PathBindable[String]].unbind("version", dynamicString(version)) + "/admin/role/add")
    }
  
  }


}