
// @GENERATOR:play-routes-compiler
// @SOURCE:/home/ritesh/development/UserManagementServer/conf/routes
// @DATE:Mon Apr 18 12:31:26 IST 2022

import play.api.routing.JavaScriptReverseRoute
import play.api.mvc.{ QueryStringBindable, PathBindable, Call, JavascriptLiteral }
import play.core.routing.{ HandlerDef, ReverseRouteContext, queryString, dynamicString }


import _root_.controllers.Assets.Asset

// @LINE:6
package controllers.javascript {
  import ReverseRouteContext.empty

  // @LINE:180
  class ReverseAssets(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:180
    def at: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Assets.at",
      """
        function(file) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "assets/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
        }
      """
    )
  
  }

  // @LINE:227
  class ReverseNotification(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:231
    def markAllNotificationsReadTime: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.markAllNotificationsReadTime",
      """
        function(version,mfr,prod,sch,email,read) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/mark_all/read/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Boolean]].javascriptUnbind + """)("read", read)})
        }
      """
    )
  
    // @LINE:230
    def updateNotificationsDeletedTime: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.updateNotificationsDeletedTime",
      """
        function(version,mfr,prod,sch,email,delete) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/bulk_update/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Boolean]].javascriptUnbind + """)("delete", delete)})
        }
      """
    )
  
    // @LINE:228
    def notificationPaginationList: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.notificationPaginationList",
      """
        function(version,mfr,prod,sch,email,st,en,deleted,read) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("st", st) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("en", en) + _qS([(""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("deleted", deleted), (""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("read", read)])})
        }
      """
    )
  
    // @LINE:232
    def markAllNotificationsDeletedTime: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.markAllNotificationsDeletedTime",
      """
        function(version,mfr,prod,sch,email,delete) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/mark_all/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Boolean]].javascriptUnbind + """)("delete", delete)})
        }
      """
    )
  
    // @LINE:229
    def updateNotificationsReadTime: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.updateNotificationsReadTime",
      """
        function(version,mfr,prod,sch,email,read) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/bulk_update/read/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Boolean]].javascriptUnbind + """)("read", read)})
        }
      """
    )
  
    // @LINE:227
    def notificationList: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Notification.notificationList",
      """
        function(version,mfr,prod,sch,email,deleted,read) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/notification/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + _qS([(""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("deleted", deleted), (""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("read", read)])})
        }
      """
    )
  
  }

  // @LINE:220
  class ReverseRulesAlerts(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:220
    def alertFilterList: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.RulesAlerts.alertFilterList",
      """
        function(version,mfr,prod,sch,ruleId,user) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/rules/alerts/filters/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + _qS([(""" + implicitly[QueryStringBindable[Option[Long]]].javascriptUnbind + """)("ruleId", ruleId), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("user", user)])})
        }
      """
    )
  
    // @LINE:221
    def addUpdateAlertFiltersAtributes: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.RulesAlerts.addUpdateAlertFiltersAtributes",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/rules/alerts/filters/add_update/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:222
    def bulkRulesDeleteAlertFiltersAtributes: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.RulesAlerts.bulkRulesDeleteAlertFiltersAtributes",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/rules/alerts/filters/bulk_rules_delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:223
    def bulkUsersDeleteAlertFiltersAtributes: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.RulesAlerts.bulkUsersDeleteAlertFiltersAtributes",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/rules/alerts/filters/bulk_users_delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:224
    def sendNotification: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.RulesAlerts.sendNotification",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/rules/alerts/filters/group/users/notification/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
  }

  // @LINE:88
  class ReverseAdminRealm(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:90
    def list: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRealm.list",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/realm/list"})
        }
      """
    )
  
    // @LINE:89
    def edit: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRealm.edit",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/realm/edit"})
        }
      """
    )
  
    // @LINE:177
    def realmInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRealm.realmInfo",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/realm/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:91
    def delete: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRealm.delete",
      """
        function(version,realm) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/realm/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("realm", encodeURIComponent(realm))})
        }
      """
    )
  
    // @LINE:88
    def add: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRealm.add",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/realm/add"})
        }
      """
    )
  
  }

  // @LINE:183
  class ReverseClinsight(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:186
    def getUserDetails: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.getUserDetails",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/userdetails"})
        }
      """
    )
  
    // @LINE:206
    def getUserMpsDetails: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.getUserMpsDetails",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/mobile/userdetails/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:191
    def clinsightRegistrationView: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.clinsightRegistrationView",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/registration"})
        }
      """
    )
  
    // @LINE:189
    def verifyProspect: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.verifyProspect",
      """
        function(version,email,token_id) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/campaign/user/verification" + _qS([(""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("email", email), (""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("token_id", token_id)])})
        }
      """
    )
  
    // @LINE:187
    def setDefaultMPS: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.setDefaultMPS",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/setdefaultmps"})
        }
      """
    )
  
    // @LINE:205
    def mobileLogin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.mobileLogin",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/mobile/login"})
        }
      """
    )
  
    // @LINE:183
    def createMailWrapper: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.createMailWrapper",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/create/email"})
        }
      """
    )
  
    // @LINE:185
    def login: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.login",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/login"})
        }
      """
    )
  
    // @LINE:184
    def clinsightView: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.clinsightView",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/clinsight"})
        }
      """
    )
  
    // @LINE:188
    def registerProspect: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.registerProspect",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/campaign/user/add"})
        }
      """
    )
  
    // @LINE:190
    def regenerateVerificationEmail: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.regenerateVerificationEmail",
      """
        function(version,email) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/campaign/user/regenerate/verification/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email))})
        }
      """
    )
  
    // @LINE:192
    def deleteUserDeviceInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.deleteUserDeviceInfo",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user_info/delete/device_info"})
        }
      """
    )
  
    // @LINE:193
    def updateUserDeviceInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Clinsight.updateUserDeviceInfo",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user_info/update/device_info"})
        }
      """
    )
  
  }

  // @LINE:170
  class ReverseAnalytics(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:173
    def hql: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Analytics.hql",
      """
        function(version,hqlQuery) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/analytics/hql/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("hqlQuery", encodeURIComponent(hqlQuery))})
        }
      """
    )
  
    // @LINE:170
    def sql: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Analytics.sql",
      """
        function(version,sqlQuery) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/analytics/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sqlQuery", encodeURIComponent(sqlQuery))})
        }
      """
    )
  
    // @LINE:171
    def refreshSpark: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Analytics.refreshSpark",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/spark/refresh"})
        }
      """
    )
  
  }

  // @LINE:162
  class ReverseSSOPingone(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:162
    def getUserInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SSOPingone.getUserInfo",
      """
        function(version,mfr,prod,domain,tokenid,agentid) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/sso/ping/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain)) + _qS([(""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("tokenid", tokenid), (""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("agentid", agentid)])})
        }
      """
    )
  
  }

  // @LINE:30
  class ReverseCallback(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:30
    def callback: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Callback.callback",
      """
        function(version,mfr,prod,domain,code) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/startsso/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("code", code)])})
        }
      """
    )
  
  }

  // @LINE:198
  class ReverseClinsightMenu(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:201
    def clinsightsMpsNodeHide: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsMpsNodeHide",
      """
        function(version,operation_type,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("operation_type", encodeURIComponent(operation_type)) + "/mps/menu/node/hide/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:199
    def clinsightsMpsTree: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsMpsTree",
      """
        function(version,mfr,prod,sch,user,clinsights_role_id) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/mps/menu/tree/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("user", user), (""" + implicitly[QueryStringBindable[Option[Long]]].javascriptUnbind + """)("clinsights_role_id", clinsights_role_id)])})
        }
      """
    )
  
    // @LINE:203
    def clinsightsRoleNodeHide: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsRoleNodeHide",
      """
        function(version,operation_type,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("operation_type", encodeURIComponent(operation_type)) + "/role/menu/node/hide/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:204
    def clinsightsRoleNodeDisable: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsRoleNodeDisable",
      """
        function(version,operation_type,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("operation_type", encodeURIComponent(operation_type)) + "/role/menu/node/disable/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:200
    def clinsightsMpsFlatMenu: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsMpsFlatMenu",
      """
        function(version,mfr,prod,sch,user,clinsights_role_id) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/mps/menu/flat_json/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("user", user), (""" + implicitly[QueryStringBindable[Option[Long]]].javascriptUnbind + """)("clinsights_role_id", clinsights_role_id)])})
        }
      """
    )
  
    // @LINE:198
    def clinsightsMasterTree: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsMasterTree",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/master/menu/tree/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:202
    def clinsightsMpsNodeDisable: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.ClinsightMenu.clinsightsMpsNodeDisable",
      """
        function(version,operation_type,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("operation_type", encodeURIComponent(operation_type)) + "/mps/menu/node/disable/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
  }

  // @LINE:161
  class ReverseSSOSoap(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:161
    def getUserInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SSOSoap.getUserInfo",
      """
        function(version,mfr,prod,domain,sessionId,serverUrl,additional_params) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/sso/soap/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain)) + _qS([(""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("sessionId", sessionId), (""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("serverUrl", serverUrl), (additional_params == null ? null : (""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("additional_params", additional_params))])})
        }
      """
    )
  
  }

  // @LINE:95
  class ReverseAdminUser(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:106
    def edit: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.edit",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:195
    def getTableauUsername: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.getTableauUsername",
      """
        function(version,mfr,prod,sch,email) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/tableau/user/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email))})
        }
      """
    )
  
    // @LINE:113
    def changePasswd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.changePasswd",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/change/passwd/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:117
    def exportLimit: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.exportLimit",
      """
        function(version,limit,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/eventexport/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("limit", limit) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:109
    def editMulti: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.editMulti",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/users/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:126
    def listCustomerUsersNonSso: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listCustomerUsersNonSso",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/listnonsso/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:95
    def list: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.list",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/list"})
        }
      """
    )
  
    // @LINE:128
    def listCustomerUsersRuleCreator: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listCustomerUsersRuleCreator",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/listrulecreator/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:125
    def listCustomerUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listCustomerUsers",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:129
    def removeCustomerUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.removeCustomerUsers",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/remove/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:114
    def updateDefaults: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.updateDefaults",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/update/defaults/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:121
    def getTableauAdminUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.getTableauAdminUsers",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/tableauadmin/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:119
    def isDashboardAdmin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.isDashboardAdmin",
      """
        function(version,mfr,prod,sch,userid) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/dashboardadmin/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("userid", encodeURIComponent(userid))})
        }
      """
    )
  
    // @LINE:124
    def addCustomerUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.addCustomerUser",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:167
    def tsUserTracking: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.tsUserTracking",
      """
        function(version,mfr,prod,sch,ec,st,et,col,filter,aggr,groupby,orderby,limit) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user_tracking/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("ec", encodeURIComponent(ec)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("st", encodeURIComponent(st)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("et", encodeURIComponent(et)) + _qS([(""" + implicitly[QueryStringBindable[List[String]]].javascriptUnbind + """)("col", col), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("filter", filter), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("aggr", aggr), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("groupby", groupby), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("orderby", orderby), (""" + implicitly[QueryStringBindable[Option[Integer]]].javascriptUnbind + """)("limit", limit)])})
        }
      """
    )
  
    // @LINE:131
    def disableCustomerUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.disableCustomerUsers",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/disable/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:132
    def enableCustomerUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.enableCustomerUsers",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/enable/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:103
    def addCustomerUserAdmin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.addCustomerUserAdmin",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/customer/user/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:116
    def disableInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.disableInfo",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/disable/info/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:118
    def resetPasswd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.resetPasswd",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/reset/passwd/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:107
    def remove: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.remove",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/remove/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:108
    def editMultiForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.editMultiForm",
      """
        function(version,mfr,emails) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/users/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("emails", encodeURIComponent(emails))})
        }
      """
    )
  
    // @LINE:133
    def modifyCustomerUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.modifyCustomerUser",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/modify/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:127
    def listCustomerUsersSso: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listCustomerUsersSso",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/listsso/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:115
    def byEmail: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.byEmail",
      """
        function(version,mfr,userid) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/exists/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("userid", encodeURIComponent(userid))})
        }
      """
    )
  
    // @LINE:98
    def listByMfr: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listByMfr",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:104
    def editCustomerUserAdmin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.editCustomerUserAdmin",
      """
        function(version,usr,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/customer/user/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:135
    def bulkDeleteCustomerUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.bulkDeleteCustomerUser",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/bulk_delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:134
    def bulkUpdateCustomerUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.bulkUpdateCustomerUser",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/bulk_update/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:105
    def editForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.editForm",
      """
        function(version,usr,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:111
    def createPasswd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.createPasswd",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/create/passwd"})
        }
      """
    )
  
    // @LINE:102
    def add: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.add",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/add"})
        }
      """
    )
  
    // @LINE:194
    def decryptUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.decryptUser",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/decrypt"})
        }
      """
    )
  
    // @LINE:96
    def listByOrg: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.listByOrg",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:120
    def getDashboardAdminUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.getDashboardAdminUsers",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/dashboardadmin/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:130
    def regenerateVerificationEmail: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.regenerateVerificationEmail",
      """
        function(version,email) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/customer/user/regenerate/verification/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email))})
        }
      """
    )
  
    // @LINE:112
    def forgotPasswd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.forgotPasswd",
      """
        function(version,usr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/forgot/passwd/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("usr", encodeURIComponent(usr))})
        }
      """
    )
  
    // @LINE:101
    def addForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminUser.addForm",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/user/add"})
        }
      """
    )
  
  }

  // @LINE:6
  class ReverseApplication(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:24
    def monitor: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.monitor",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/monitor"})
        }
      """
    )
  
    // @LINE:23
    def uHome: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.uHome",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/home/user"})
        }
      """
    )
  
    // @LINE:36
    def logout: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.logout",
      """
        function(version,mps,feature) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/logout" + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("mps", mps), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("feature", feature)])})
        }
      """
    )
  
    // @LINE:6
    def options: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.options",
      """
        function(path) {
        
          if (path == """ + implicitly[JavascriptLiteral[String]].to("") + """) {
            return _wA({method:"OPTIONS", url:"""" + _prefix + """"})
          }
        
          if (true) {
            return _wA({method:"OPTIONS", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("path", path)})
          }
        
        }
      """
    )
  
    // @LINE:41
    def resendOTP: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.resendOTP",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/resendOTP"})
        }
      """
    )
  
    // @LINE:47
    def updateLoginSuccess: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.updateLoginSuccess",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/updateloginsuccess"})
        }
      """
    )
  
    // @LINE:44
    def validateAccessToken: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.validateAccessToken",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/validate/access_token"})
        }
      """
    )
  
    // @LINE:34
    def uiLogin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.uiLogin",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/uilogin"})
        }
      """
    )
  
    // @LINE:50
    def xProxy: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.xProxy",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/xproxy"})
        }
      """
    )
  
    // @LINE:40
    def verifyOTP: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.verifyOTP",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/verifyOTP"})
        }
      """
    )
  
    // @LINE:33
    def login: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.login",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/login"})
        }
      """
    )
  
    // @LINE:38
    def appLogin: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.appLogin",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/aa/app_login"})
        }
      """
    )
  
    // @LINE:166
    def trackUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.trackUser",
      """
        function(version,mfr,prod,sch,app,module,activity,switched_feature) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user_tracking/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("app", encodeURIComponent(app)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("module", encodeURIComponent(module)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("activity", encodeURIComponent(activity)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("switched_feature", switched_feature)])})
        }
      """
    )
  
    // @LINE:9
    def index: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.index",
      """
        function() {
        
          if (true) {
            return _wA({method:"GET", url:"""" + _prefix + """"})
          }
        
        }
      """
    )
  
    // @LINE:17
    def createpwd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.createpwd",
      """
        function(token_id,email,domain) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "assets/create-password/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("token_id", encodeURIComponent(token_id)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain))})
        }
      """
    )
  
    // @LINE:22
    def vHome: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Application.vHome",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/home/visitor"})
        }
      """
    )
  
  }

  // @LINE:28
  class ReverseCGIHandler(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:28
    def forward: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.CGIHandler.forward",
      """
        function(serialNumber,cust_name,db,sessionId,serverUrl,dashboardId) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "gb/ui/prod/sso/testsso.cgi" + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("serialNumber", serialNumber), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("cust_name", cust_name), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("db", db), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("sessionId", sessionId), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("serverUrl", serverUrl), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("dashboardId", dashboardId)])})
        }
      """
    )
  
  }

  // @LINE:53
  class ReverseAdminCustomer(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:56
    def delete: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.delete",
      """
        function(version,mfr,prod,sch,ec,realm) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/ec/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("ec", encodeURIComponent(ec)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("realm", encodeURIComponent(realm))})
        }
      """
    )
  
    // @LINE:66
    def ecSystemsListFiltered: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecSystemsListFiltered",
      """
        function(version,mfr,prod,sch,ec,st,en,pattern,rt) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/analytics/system/ec/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("ec", encodeURIComponent(ec)) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("st", st) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("en", en) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("pattern", pattern), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("rt", rt)])})
        }
      """
    )
  
    // @LINE:61
    def ecHealthCheckUpdate: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckUpdate",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/update/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:58
    def ecHealthCheck: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheck",
      """
        function(version,mfr,prod,sch,user,fnCallSrcOpt) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/details/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("user", user), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("fnCallSrcOpt", fnCallSrcOpt)])})
        }
      """
    )
  
    // @LINE:64
    def ecHealthCheckDelete: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckDelete",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:62
    def ecHealthCheckAddUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckAddUser",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/addUser/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:213
    def ecSystemsListData: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecSystemsListData",
      """
        function(version,mfr,prod,sch,ec,st,en) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/bundle/system_info/ec/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("ec", encodeURIComponent(ec)) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("st", st) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("en", en)})
        }
      """
    )
  
    // @LINE:214
    def ecSystemsColsListData: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecSystemsColsListData",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/bundle/system_cols_info/ec/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:53
    def list: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.list",
      """
        function(version,is_request) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/ec/list" + _qS([(""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("is_request", is_request)])})
        }
      """
    )
  
    // @LINE:59
    def ecHealthCheckMfr: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckMfr",
      """
        function(version,mfr,user,fnCallSrcOpt) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/details/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + _qS([(""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("user", user), (""" + implicitly[QueryStringBindable[Option[String]]].javascriptUnbind + """)("fnCallSrcOpt", fnCallSrcOpt)])})
        }
      """
    )
  
    // @LINE:215
    def ecAvailableSystemsListData: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecAvailableSystemsListData",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/bundle/available_system_info/ec/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:57
    def getMpseInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.getMpseInfo",
      """
        function(version,mfr,prod,sch,ec) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/mpse/config/details/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("ec", encodeURIComponent(ec))})
        }
      """
    )
  
    // @LINE:55
    def add: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.add",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/ec/add"})
        }
      """
    )
  
    // @LINE:60
    def ecHealthCheckAdd: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckAdd",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:217
    def userEcSystemsListData: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.userEcSystemsListData",
      """
        function(version,mfr,prod,sch,email,st,en) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/ec/system_info/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email)) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("st", st) + "/" + (""" + implicitly[PathBindable[Int]].javascriptUnbind + """)("en", en)})
        }
      """
    )
  
    // @LINE:216
    def userECAvailableSystemsListData: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.userECAvailableSystemsListData",
      """
        function(version,mfr,prod,sch,email) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/user/ec/available_system_info/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("email", encodeURIComponent(email))})
        }
      """
    )
  
    // @LINE:63
    def ecHealthCheckUpdateUser: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckUpdateUser",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/updateUser/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:65
    def ecHealthCheckDeleteMFr: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.ecHealthCheckDeleteMFr",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/healthcheck/ec/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:54
    def addForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminCustomer.addForm",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/ec/add"})
        }
      """
    )
  
  }

  // @LINE:69
  class ReverseAdminMfr(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:70
    def listall: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.listall",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/listall"})
        }
      """
    )
  
    // @LINE:73
    def addmfr: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.addmfr",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/addmfr/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:80
    def listDefaultFeature: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.listDefaultFeature",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/defaultfeature/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:69
    def list: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.list",
      """
        function(version,is_request) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/list" + _qS([(""" + implicitly[QueryStringBindable[Option[Boolean]]].javascriptUnbind + """)("is_request", is_request)])})
        }
      """
    )
  
    // @LINE:83
    def listUiConfig: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.listUiConfig",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/uiconfig/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:81
    def manageUiConfig: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.manageUiConfig",
      """
        function(version,mfr) {
        
          if (true) {
            return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/uiconfig/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
          }
        
        }
      """
    )
  
    // @LINE:74
    def delete: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.delete",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:77
    def listRealm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.listRealm",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/realm/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:75
    def manageRealm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.manageRealm",
      """
        function(version,mfr) {
        
          if (true) {
            return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/realm/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
          }
        
        }
      """
    )
  
    // @LINE:72
    def add: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.add",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/add"})
        }
      """
    )
  
    // @LINE:78
    def manageDefaultFeature: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.manageDefaultFeature",
      """
        function(version,mfr) {
        
          if (true) {
            return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/defaultfeature/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
          }
        
        }
      """
    )
  
    // @LINE:71
    def addForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminMfr.addForm",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/mfr/add"})
        }
      """
    )
  
  }

  // @LINE:164
  class ReverseSSOPingoneEmbedded(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:164
    def getUserInfo: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SSOPingoneEmbedded.getUserInfo",
      """
        function(version,mfr,prod,domain,dashboardId,tokenid,agentid) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/sso/ping/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("dashboardId", encodeURIComponent(dashboardId)) + _qS([(""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("tokenid", tokenid), (""" + implicitly[QueryStringBindable[String]].javascriptUnbind + """)("agentid", agentid)])})
        }
      """
    )
  
  }

  // @LINE:209
  class ReverseSqlHelper(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:210
    def queryDB: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SqlHelper.queryDB",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/db"})
        }
      """
    )
  
    // @LINE:209
    def getQueryDB: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.SqlHelper.getQueryDB",
      """
        function(version,sqlQuery) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/db/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sqlQuery", encodeURIComponent(sqlQuery))})
        }
      """
    )
  
  }

  // @LINE:139
  class ReverseAdminRole(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:144
    def modifyRole: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.modifyRole",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/modify/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:151
    def domainsList: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.domainsList",
      """
        function(version,mfr,roleName) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/domains/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName))})
        }
      """
    )
  
    // @LINE:146
    def list: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.list",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/list"})
        }
      """
    )
  
    // @LINE:155
    def tableauUpdateRole: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.tableauUpdateRole",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/tableau/tableauUpdateRole/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:149
    def deleterole: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.deleterole",
      """
        function(version,roleName,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:158
    def isTableauConfigured: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.isTableauConfigured",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/tableau/configured/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:196
    def userRoleDetails: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.userRoleDetails",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/cs/role/user/details/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:145
    def bulkUpdateRoleProducts: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.bulkUpdateRoleProducts",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/bulk_update/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:141
    def edit: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.edit",
      """
        function(version,roleName,domain,permissions,mps,realm) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/edit/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("domain", encodeURIComponent(domain)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("permissions", encodeURIComponent(permissions)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mps", encodeURIComponent(mps)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("realm", encodeURIComponent(realm))})
        }
      """
    )
  
    // @LINE:153
    def listRoles: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.listRoles",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/names/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:148
    def delete: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.delete",
      """
        function(version,roleName) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName))})
        }
      """
    )
  
    // @LINE:157
    def tableauDeleteUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.tableauDeleteUsers",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/tableau/tableauDeleteUsers/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:140
    def addDomain: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.addDomain",
      """
        function(version,roleName) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName))})
        }
      """
    )
  
    // @LINE:143
    def addrole: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.addrole",
      """
        function(version,mfr) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/add/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:154
    def listHealthCheckRoles: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.listHealthCheckRoles",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/healthcheck/names/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:142
    def add: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.add",
      """
        function(version) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/add"})
        }
      """
    )
  
    // @LINE:152
    def userDetails: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.userDetails",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/user/details/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:150
    def deleteRoleProduct: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.deleteRoleProduct",
      """
        function(version,roleName,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/product/delete/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("roleName", encodeURIComponent(roleName)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:156
    def tableauAddUpdateUsers: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.tableauAddUpdateUsers",
      """
        function(version,mfr,prod,sch) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/tableau/tableauAddUpdateUsers/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("prod", encodeURIComponent(prod)) + "/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("sch", encodeURIComponent(sch))})
        }
      """
    )
  
    // @LINE:147
    def listall: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.listall",
      """
        function(version,mfr) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/usermanagement/role/list/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("mfr", encodeURIComponent(mfr))})
        }
      """
    )
  
    // @LINE:139
    def addForm: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AdminRole.addForm",
      """
        function(version) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("version", encodeURIComponent(version)) + "/admin/role/add"})
        }
      """
    )
  
  }


}