
package views.html.mfr

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object addNew_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class addNew extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[Form[NewOrg],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(addMfForm: Form[NewOrg], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
"""),format.raw/*8.1*/("""Add New Manufacturer
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.172*/("""

"""),format.raw/*5.76*/("""

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName, userorg, userrole, title, true, Page.Admin)/*11.68*/ {_display_(Seq[Any](format.raw/*11.70*/("""
"""),format.raw/*12.1*/("""<div class="span6">

    """),_display_(/*14.6*/flash/*14.11*/.get(FKSuccess).map/*14.30*/ { message =>_display_(Seq[Any](format.raw/*14.43*/("""  """),format.raw/*14.45*/("""<div class="alert alert-success">   """),_display_(/*14.82*/message),format.raw/*14.89*/("""  """),format.raw/*14.91*/("""</div>  """)))}),format.raw/*14.100*/("""
    """),_display_(/*15.6*/if(addMfForm.hasErrors)/*15.29*/ {_display_(Seq[Any](format.raw/*15.31*/(""" """),format.raw/*15.32*/("""<div class="alert alert-error"> Oops! Please see below. </div>  """)))}),format.raw/*15.97*/("""
    """),_display_(/*16.6*/addMfForm/*16.15*/.globalError.map/*16.31*/ { error =>_display_(Seq[Any](format.raw/*16.42*/(""" """),format.raw/*16.43*/("""<div class="alert alert-error"> """),_display_(/*16.76*/error/*16.81*/.message),format.raw/*16.89*/("""   """),format.raw/*16.92*/("""</div>  """)))}),format.raw/*16.101*/("""

    """),_display_(/*18.6*/form(routes.AdminMfr.add(version), 'class -> "form-horizontal")/*18.69*/ {_display_(Seq[Any](format.raw/*18.71*/("""
    """),_display_(/*19.6*/inputText( addMfForm("name"), 'maxlength -> "128", '_label -> "Name: *",'_showConstraints -> false)),format.raw/*19.105*/("""
    """),_display_(/*20.6*/inputText( addMfForm("desc"), 'maxlength -> "512", '_label -> "Description: *", '_showConstraints -> false)),format.raw/*20.113*/("""
    """),format.raw/*21.5*/("""<div class="form-actions">
        <input name="action" class="btn btn-primary" type="submit" value="Save">
        <a href=""""),_display_(/*23.19*/routes/*23.25*/.AdminMfr.list(version, None)),format.raw/*23.54*/("""" class="btn">Cancel</a>
    </div>
    """)))}),format.raw/*25.6*/("""
"""),format.raw/*26.1*/("""</div>
""")))}),format.raw/*27.2*/(""" 
"""))
      }
    }
  }

  def render(addMfForm:Form[NewOrg],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(addMfForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[NewOrg],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (addMfForm,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(addMfForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object addNew extends addNew_Scope0.addNew
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/mfr/addNew.scala.html
                  HASH: 99064cdf4fab009ae06a47d9e442153947352404
                  MATRIX: 606->1|888->288|900->293|980->297|1007->298|1060->211|1092->235|1173->171|1202->285|1230->320|1259->323|1334->389|1374->391|1402->392|1454->418|1468->423|1496->442|1547->455|1577->457|1641->494|1669->501|1699->503|1740->512|1772->518|1804->541|1844->543|1873->544|1969->609|2001->615|2019->624|2044->640|2093->651|2122->652|2182->685|2196->690|2225->698|2256->701|2297->710|2330->717|2402->780|2442->782|2474->788|2595->887|2627->893|2756->1000|2788->1005|2941->1131|2956->1137|3006->1166|3077->1207|3105->1208|3143->1216
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|40->15|40->15|40->15|40->15|40->15|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|43->18|43->18|43->18|44->19|44->19|45->20|45->20|46->21|48->23|48->23|48->23|50->25|51->26|52->27
                  -- GENERATED --
              */
          