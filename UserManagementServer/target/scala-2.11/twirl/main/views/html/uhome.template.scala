
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object uhome_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class uhome extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template6[Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
import constants.Page._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
    """),format.raw/*9.5*/("""Page Title
""")))};implicit def /*7.2*/implicitFieldConstructor/*7.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.147*/("""

"""),format.raw/*6.1*/("""
"""),format.raw/*7.76*/("""
"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(signedInUserName, userorg, userrole, title, true, Home)/*12.62*/ {_display_(Seq[Any](format.raw/*12.64*/("""
	"""),format.raw/*13.2*/("""<div class="span10">
	
	  """),_display_(/*15.5*/flash/*15.10*/.get(FKSuccess).map/*15.29*/ { message =>_display_(Seq[Any](format.raw/*15.42*/(""" """),format.raw/*15.43*/("""<div class="alert alert-success"> """),_display_(/*15.78*/message),format.raw/*15.85*/(""" """),format.raw/*15.86*/("""</div> """)))}),format.raw/*15.94*/("""
	  """),format.raw/*16.4*/("""<p>
	     This page will be replaced by an interactive JavaScript based UI
	  </p>
	  
	</div>
""")))}),format.raw/*21.2*/("""
"""))
      }
    }
  }

  def render(signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (signedInUserName,userorg,userrole,version) => (flash,messages) => apply(signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object uhome extends uhome_Scope0.uhome
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/uhome.scala.html
                  HASH: a1a53934249b42934cba2a469f9daeb69b32f8aa
                  MATRIX: 587->1|868->288|880->293|960->297|991->302|1034->212|1066->236|1147->146|1175->210|1203->286|1231->314|1260->317|1329->377|1369->379|1398->381|1451->408|1465->413|1493->432|1544->445|1573->446|1635->481|1663->488|1692->489|1731->497|1762->501|1888->597
                  LINES: 20->1|26->8|26->8|28->8|29->9|30->7|30->7|31->1|33->6|34->7|35->10|37->12|37->12|37->12|38->13|40->15|40->15|40->15|40->15|40->15|40->15|40->15|40->15|40->15|41->16|46->21
                  -- GENERATED --
              */
          