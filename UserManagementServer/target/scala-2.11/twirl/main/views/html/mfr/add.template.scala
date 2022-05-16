
package views.html.mfr

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object add_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class add extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[Form[Org],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(addMfForm: Form[Org], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
  """),format.raw/*8.3*/("""Add New Manufacturer 
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.169*/("""

"""),format.raw/*5.76*/(""" 

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName, userorg, userrole, title, true, Page.Admin)/*11.68*/ {_display_(Seq[Any](format.raw/*11.70*/("""
  """),format.raw/*12.3*/("""<div class="span6">

   """),_display_(/*14.5*/flash/*14.10*/.get(FKSuccess).map/*14.29*/ { message =>_display_(Seq[Any](format.raw/*14.42*/("""  """),format.raw/*14.44*/("""<div class="alert alert-success">   """),_display_(/*14.81*/message),format.raw/*14.88*/("""  """),format.raw/*14.90*/("""</div>  """)))}),format.raw/*14.99*/("""
   """),_display_(/*15.5*/if(addMfForm.hasErrors)/*15.28*/ {_display_(Seq[Any](format.raw/*15.30*/(""" """),format.raw/*15.31*/("""<div class="alert alert-error"> Oops! Please see below. </div>  """)))}),format.raw/*15.96*/("""       
   """),_display_(/*16.5*/addMfForm/*16.14*/.globalError.map/*16.30*/ { error =>_display_(Seq[Any](format.raw/*16.41*/(""" """),format.raw/*16.42*/("""<div class="alert alert-error"> """),_display_(/*16.75*/error/*16.80*/.message),format.raw/*16.88*/("""   """),format.raw/*16.91*/("""</div>  """)))}),format.raw/*16.100*/("""

  """),_display_(/*18.4*/form(routes.AdminMfr.add(version), 'class -> "form-horizontal")/*18.67*/ {_display_(Seq[Any](format.raw/*18.69*/("""        
      """),_display_(/*19.8*/inputText( addMfForm("name"), 'maxlength -> "128", '_label -> "Name: *",'_showConstraints -> false)),format.raw/*19.107*/("""       
      """),_display_(/*20.8*/inputText( addMfForm("desc"), 'maxlength -> "512", '_label -> "Description: *", '_showConstraints -> false)),format.raw/*20.115*/("""     
    """),format.raw/*21.5*/("""<div class="form-actions">
      <input name="action" class="btn btn-primary" type="submit" value="Save">
      <a href=""""),_display_(/*23.17*/routes/*23.23*/.AdminMfr.list(version, None)),format.raw/*23.52*/("""" class="btn">Cancel</a> 
    </div>        
  """)))}),format.raw/*25.4*/("""    
  """),format.raw/*26.3*/("""</div> 
""")))}),format.raw/*27.2*/(""" 
"""))
      }
    }
  }

  def render(addMfForm:Form[Org],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(addMfForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[Org],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (addMfForm,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(addMfForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object add extends add_Scope0.add
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/mfr/add.scala.html
                  HASH: 95b8e64a2f483611f0ec311077b262fbe2015523
                  MATRIX: 597->1|876->286|888->291|968->295|997->298|1051->208|1083->232|1164->168|1193->282|1222->321|1251->324|1326->390|1366->392|1396->395|1447->420|1461->425|1489->444|1540->457|1570->459|1634->496|1662->503|1692->505|1732->514|1763->519|1795->542|1835->544|1864->545|1960->610|1998->622|2016->631|2041->647|2090->658|2119->659|2179->692|2193->697|2222->705|2253->708|2294->717|2325->722|2397->785|2437->787|2479->803|2600->902|2641->917|2770->1024|2807->1034|2956->1156|2971->1162|3021->1191|3099->1239|3133->1246|3172->1255
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|40->15|40->15|40->15|40->15|40->15|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|43->18|43->18|43->18|44->19|44->19|45->20|45->20|46->21|48->23|48->23|48->23|50->25|51->26|52->27
                  -- GENERATED --
              */
          