
package views.html.user

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object edit_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class edit extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template11[Form[UserEdit],IndexedSeq[String],Set[String],Option[String],Option[String],Option[String],String,String,String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(editUserForm: Form[UserEdit], orgs: IndexedSeq[String], roles: Set[String], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], usrEmail: String, mfr: String, version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
  """),format.raw/*8.3*/("""Edit User 
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.254*/("""

"""),format.raw/*5.76*/(""" 

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*11.69*/ {_display_(Seq[Any](format.raw/*11.71*/("""
  """),format.raw/*12.3*/("""<div class="span6">

   """),_display_(/*14.5*/flash/*14.10*/.get(FKSuccess).map/*14.29*/ { message =>_display_(Seq[Any](format.raw/*14.42*/("""  """),format.raw/*14.44*/("""<div class="alert alert-success">   """),_display_(/*14.81*/message),format.raw/*14.88*/("""  """),format.raw/*14.90*/("""</div>  """)))}),format.raw/*14.99*/("""
   
   """),_display_(/*16.5*/if(editUserForm.hasErrors)/*16.31*/ {_display_(Seq[Any](format.raw/*16.33*/(""" """),format.raw/*16.34*/("""<div class="alert alert-error"> Oops! Please see below. </div> """)))}),format.raw/*16.98*/("""       
   """),_display_(/*17.5*/editUserForm/*17.17*/.globalError.map/*17.33*/ { error =>_display_(Seq[Any](format.raw/*17.44*/(""" """),format.raw/*17.45*/("""<div class="alert alert-error"> """),_display_(/*17.78*/error/*17.83*/.message),format.raw/*17.91*/("""   """),format.raw/*17.94*/("""</div>  """)))}),format.raw/*17.103*/("""

   """),_display_(/*19.5*/form(routes.AdminUser.edit("v1", usrEmail, mfr), 'class -> "form-horizontal")/*19.82*/ {_display_(Seq[Any](format.raw/*19.84*/("""        
      """),_display_(/*20.8*/inputText( editUserForm("first_name").copy(value = editUserForm("first_name").value), 'maxlength -> "128", '_label -> "First Name: *",'_showConstraints -> false)),format.raw/*20.169*/("""   
      """),_display_(/*21.8*/inputText( editUserForm("last_name").copy(value = editUserForm("last_name").value), 'maxlength -> "128", '_label -> "Last Name: *",'_showConstraints -> false)),format.raw/*21.166*/("""
      """),_display_(/*22.8*/checkbox( editUserForm("sso").copy(value = editUserForm("sso").value),  '_label -> "SSO:", '_showConstraints -> false)),format.raw/*22.126*/("""  
      """),_display_(/*23.8*/inputText( editUserForm("wb_user_name").copy(value = editUserForm("wb_user_name").value), 'maxlength -> "128", '_label -> "Wb User Name: *",'_showConstraints -> false)),format.raw/*23.175*/(""" 
      """),_display_(/*24.8*/checkbox( editUserForm("report_usage").copy(value = editUserForm("report_usage").value),  '_label -> "Report Usage:", '_showConstraints -> false )),format.raw/*24.154*/("""      
      """),_display_(/*25.8*/select(editUserForm("org").copy(value = editUserForm("org").value),	 
        options(orgs.toList),
        '_default -> "Select the user's company",
        '_label -> "Company: *",
        '_error -> editUserForm("org").error.map(_.withMessage("Please select a company")),
        '_showConstraints -> false          
        )),format.raw/*31.10*/("""
      """),_display_(/*32.8*/select(editUserForm("role").copy(value = editUserForm("role").value), 
        options(roles.toList),
        '_default -> "Select the user's role",
        '_label -> "Role: *",
        '_error -> editUserForm("role").error.map(_.withMessage("Please select a role")),
        '_showConstraints -> false          
        )),format.raw/*38.10*/(""" 
      """),_display_(/*39.8*/select( editUserForm("realm_def").copy(value = editUserForm("realm_def").value), 
	          options = options(Org.realms.toList),
	          '_default -> "Select a Realm",
	          '_label -> "Default Realm: *",
	          '_error -> editUserForm("realm_def").error.map(_.withMessage("Please select a default realm")),
	          '_showConstraints -> false)),format.raw/*44.39*/("""               

      """),_display_(/*46.8*/inputText( editUserForm("url_def").copy(value = editUserForm("url_def").value), 'maxlength -> "512", '_label -> "Default Url: *",'_showConstraints -> false)),format.raw/*46.164*/(""" 
      """),_display_(/*47.8*/inputText( editUserForm("mps_def").copy(value = editUserForm("mps_def").value), 'maxlength -> "128", '_label -> "Default MPS: *",'_showConstraints -> false)),format.raw/*47.164*/("""
      """),_display_(/*48.8*/checkbox( editUserForm("is_prospect").copy(value = editUserForm("is_prospect").value),  '_label -> "Is Prospect:", '_showConstraints -> false)),format.raw/*48.150*/("""
      """),_display_(/*49.8*/checkbox( editUserForm("dashboard_admin").copy(value = editUserForm("dashboard_admin").value),  '_label -> "Dashboard Admin:", '_showConstraints -> false)),format.raw/*49.162*/(""" 
      """),_display_(/*50.8*/checkbox( editUserForm("active").copy(value = editUserForm("active").value),  '_label -> "Is Active:",'_showConstraints -> false)),format.raw/*50.137*/("""
      """),_display_(/*51.8*/checkbox( editUserForm("show_info").copy(value = editUserForm("show_info").value),  '_label -> "Show Info:", '_showConstraints -> false)),format.raw/*51.144*/("""
         
     
      """),format.raw/*54.7*/("""<div class="form-actions">
        <input name="action" class="btn btn-primary" type="submit" value="Save">
        <a href=""""),_display_(/*56.19*/routes/*56.25*/.AdminUser.list("v1")),format.raw/*56.46*/("""" class="btn">Cancel</a> 
      </div>
    """)))}),format.raw/*58.6*/("""            
  """),format.raw/*59.3*/("""</div>
""")))}),format.raw/*60.2*/("""
"""))
      }
    }
  }

  def render(editUserForm:Form[UserEdit],orgs:IndexedSeq[String],roles:Set[String],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],usrEmail:String,mfr:String,version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(editUserForm,orgs,roles,signedInUserName,userorg,userrole,usrEmail,mfr,version)(flash,messages)

  def f:((Form[UserEdit],IndexedSeq[String],Set[String],Option[String],Option[String],Option[String],String,String,String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (editUserForm,orgs,roles,signedInUserName,userorg,userrole,usrEmail,mfr,version) => (flash,messages) => apply(editUserForm,orgs,roles,signedInUserName,userorg,userrole,usrEmail,mfr,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object edit extends edit_Scope0.edit
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/user/edit.scala.html
                  HASH: 86d4ce5db0193bd61c8a20bba3ac003e16f1134c
                  MATRIX: 651->1|1015->371|1027->376|1107->380|1136->383|1179->293|1211->317|1292->253|1321->367|1350->395|1379->398|1455->465|1495->467|1525->470|1576->495|1590->500|1618->519|1669->532|1699->534|1763->571|1791->578|1821->580|1861->589|1896->598|1931->624|1971->626|2000->627|2095->691|2133->703|2154->715|2179->731|2228->742|2257->743|2317->776|2331->781|2360->789|2391->792|2432->801|2464->807|2550->884|2590->886|2632->902|2815->1063|2852->1074|3032->1232|3066->1240|3206->1358|3242->1368|3431->1535|3466->1544|3634->1690|3674->1704|4024->2033|4058->2041|4402->2364|4437->2373|4818->2733|4868->2757|5046->2913|5081->2922|5259->3078|5293->3086|5457->3228|5491->3236|5667->3390|5702->3399|5853->3528|5887->3536|6045->3672|6095->3695|6248->3821|6263->3827|6305->3848|6379->3892|6421->3907|6459->3915
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|44->19|44->19|44->19|45->20|45->20|46->21|46->21|47->22|47->22|48->23|48->23|49->24|49->24|50->25|56->31|57->32|63->38|64->39|69->44|71->46|71->46|72->47|72->47|73->48|73->48|74->49|74->49|75->50|75->50|76->51|76->51|79->54|81->56|81->56|81->56|83->58|84->59|85->60
                  -- GENERATED --
              */
          