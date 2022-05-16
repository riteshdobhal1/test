
package views.html.user

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object editMulti_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class editMulti extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template10[Form[MultiUserEdit],Set[String],Option[String],Option[String],Option[String],String,String,String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(editMultiUserForm: Form[MultiUserEdit], roles: Set[String], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], usrEmails: String, mfr:String, version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
  """),format.raw/*8.3*/("""Edit User 
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.238*/("""

"""),format.raw/*5.76*/(""" 

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*11.69*/ {_display_(Seq[Any](format.raw/*11.71*/("""
  """),format.raw/*12.3*/("""<div class="span6">

   """),_display_(/*14.5*/flash/*14.10*/.get(FKSuccess).map/*14.29*/ { message =>_display_(Seq[Any](format.raw/*14.42*/("""  """),format.raw/*14.44*/("""<div class="alert alert-success">   """),_display_(/*14.81*/message),format.raw/*14.88*/("""  """),format.raw/*14.90*/("""</div>  """)))}),format.raw/*14.99*/("""
   
   """),_display_(/*16.5*/if(editMultiUserForm.hasErrors)/*16.36*/ {_display_(Seq[Any](format.raw/*16.38*/(""" """),format.raw/*16.39*/("""<div class="alert alert-error"> Oops! Please see below. </div> """)))}),format.raw/*16.103*/("""       
   """),_display_(/*17.5*/editMultiUserForm/*17.22*/.globalError.map/*17.38*/ { error =>_display_(Seq[Any](format.raw/*17.49*/(""" """),format.raw/*17.50*/("""<div class="alert alert-error"> """),_display_(/*17.83*/error/*17.88*/.message),format.raw/*17.96*/("""   """),format.raw/*17.99*/("""</div>  """)))}),format.raw/*17.108*/("""

   """),_display_(/*19.5*/form(routes.AdminUser.editMulti("v1", mfr), 'class -> "form-horizontal")/*19.77*/ {_display_(Seq[Any](format.raw/*19.79*/("""        
      """),_display_(/*20.8*/inputText( editMultiUserForm("wb_user_name"), 'maxlength -> "128", '_label -> "Wb User Name: ",'_showConstraints -> false)),format.raw/*20.130*/(""" 
      """),_display_(/*21.8*/select(editMultiUserForm("role"), 
        options(roles.toList),
        '_default -> "Select the user's role",
        '_label -> "Role: *",
        '_error -> editMultiUserForm("role").error.map(_.withMessage("Please select a role")),
        '_showConstraints -> false          
        )),format.raw/*27.10*/(""" 
      """),_display_(/*28.8*/select( editMultiUserForm("realm_def"), 
	          options = options(Org.realms.toList),
	          '_default -> "Select a Realm",
	          '_label -> "Default Realm: *",
	          '_error -> editMultiUserForm("realm_def").error.map(_.withMessage("Please select a default realm")),
	          '_showConstraints -> false)),format.raw/*33.39*/("""               

      """),_display_(/*35.8*/inputText( editMultiUserForm("url_def"), 'maxlength -> "512", '_label -> "Default Url: ",'_showConstraints -> false)),format.raw/*35.124*/(""" 
      """),_display_(/*36.8*/inputText( editMultiUserForm("mps_def"), 'maxlength -> "128", '_label -> "Default MPS: ",'_showConstraints -> false)),format.raw/*36.124*/("""
      """),format.raw/*37.7*/("""<input type="hidden" id="usrEmails" name="usrEmails" value="""),_display_(/*37.67*/usrEmails),format.raw/*37.76*/(""" """),format.raw/*37.77*/("""/> 
      <div class="form-actions">
        <input name="action" class="btn btn-primary" type="submit" value="Save">
        <a href=""""),_display_(/*40.19*/routes/*40.25*/.AdminUser.list("v1")),format.raw/*40.46*/("""" class="btn">Cancel</a> 
      </div>
    """)))}),format.raw/*42.6*/("""            
  """),format.raw/*43.3*/("""</div>
""")))}),format.raw/*44.2*/("""
"""))
      }
    }
  }

  def render(editMultiUserForm:Form[MultiUserEdit],roles:Set[String],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],usrEmails:String,mfr:String,version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(editMultiUserForm,roles,signedInUserName,userorg,userrole,usrEmails,mfr,version)(flash,messages)

  def f:((Form[MultiUserEdit],Set[String],Option[String],Option[String],Option[String],String,String,String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (editMultiUserForm,roles,signedInUserName,userorg,userrole,usrEmails,mfr,version) => (flash,messages) => apply(editMultiUserForm,roles,signedInUserName,userorg,userrole,usrEmails,mfr,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object editMulti extends editMulti_Scope0.editMulti
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/user/editMulti.scala.html
                  HASH: 131c2fe9a94b6667f7c1308591124c56decedd27
                  MATRIX: 647->1|995->355|1007->360|1087->364|1116->367|1159->277|1191->301|1272->237|1301->351|1330->379|1359->382|1435->449|1475->451|1505->454|1556->479|1570->484|1598->503|1649->516|1679->518|1743->555|1771->562|1801->564|1841->573|1876->582|1916->613|1956->615|1985->616|2081->680|2119->692|2145->709|2170->725|2219->736|2248->737|2308->770|2322->775|2351->783|2382->786|2423->795|2455->801|2536->873|2576->875|2618->891|2762->1013|2797->1022|3110->1314|3145->1323|3490->1647|3540->1671|3678->1787|3713->1796|3851->1912|3885->1919|3972->1979|4002->1988|4031->1989|4194->2125|4209->2131|4251->2152|4325->2196|4367->2211|4405->2219
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|44->19|44->19|44->19|45->20|45->20|46->21|52->27|53->28|58->33|60->35|60->35|61->36|61->36|62->37|62->37|62->37|62->37|65->40|65->40|65->40|67->42|68->43|69->44
                  -- GENERATED --
              */
          