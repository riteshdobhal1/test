
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object groupUpdateNotification_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class groupUpdateNotification extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template6[String,String,String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, group: String, header: String, body: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.95*/("""
"""),format.raw/*6.1*/("""
"""),format.raw/*7.1*/("""<span style="font-size:17px">
"""),_display_(/*8.2*/if(header == "")/*8.18*/{_display_(Seq[Any](format.raw/*8.19*/("""
"""),format.raw/*9.1*/("""Dear """),_display_(/*9.7*/f_name),format.raw/*9.13*/(""",
""")))}/*10.3*/else/*10.8*/{_display_(Seq[Any](format.raw/*10.9*/("""
"""),_display_(/*11.2*/header),format.raw/*11.8*/(""" """),_display_(/*11.10*/f_name),format.raw/*11.16*/(""",
""")))}),format.raw/*12.2*/("""
"""),_display_(/*13.2*/if(body == "")/*13.16*/{_display_(Seq[Any](format.raw/*13.17*/("""
"""),format.raw/*14.1*/("""The list of systems/devices that you have access to on
Glassbeam has been modified.

This may affect
- Rules that you have subscribed to
- Systems you viewed as part of Clinsights

Once you login to Glassbeam using your credentials, click
on your User Profile -> Device List (which is on the top
right corner of the Glassbeam application) to view the
updated list of systems/devices that you have access to.
""")))}/*25.3*/else/*25.8*/{_display_(Seq[Any](format.raw/*25.9*/("""
"""),_display_(/*26.2*/body),format.raw/*26.6*/("""
""")))}),format.raw/*27.2*/("""
"""),_display_(/*28.2*/if(footer == "")/*28.18*/ {_display_(Seq[Any](format.raw/*28.20*/("""
"""),format.raw/*29.1*/("""Glassbeam administrator
""")))}/*30.3*/else/*30.8*/{_display_(Seq[Any](format.raw/*30.9*/("""
"""),_display_(/*31.2*/footer),format.raw/*31.8*/("""
""")))}),format.raw/*32.2*/("""

"""),format.raw/*34.1*/("""</span>"""))
      }
    }
  }

  def render(f_name:String,l_name:String,group:String,header:String,body:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,group,header,body,footer)

  def f:((String,String,String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,group,header,body,footer) => apply(f_name,l_name,group,header,body,footer)

  def ref: this.type = this

}


}

/**/
object groupUpdateNotification extends groupUpdateNotification_Scope0.groupUpdateNotification
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/groupUpdateNotification.scala.html
                  HASH: 6ee23cc6efbf7e90735ef62e4956dd6fee1ceae3
                  MATRIX: 598->1|875->94|902->189|929->190|985->221|1009->237|1047->238|1074->239|1105->245|1131->251|1152->255|1164->260|1202->261|1230->263|1256->269|1285->271|1312->277|1345->280|1373->282|1396->296|1435->297|1463->298|1890->708|1902->713|1940->714|1968->716|1992->720|2024->722|2052->724|2077->740|2117->742|2145->743|2188->769|2200->774|2238->775|2266->777|2292->783|2324->785|2353->787
                  LINES: 20->1|28->1|29->6|30->7|31->8|31->8|31->8|32->9|32->9|32->9|33->10|33->10|33->10|34->11|34->11|34->11|34->11|35->12|36->13|36->13|36->13|37->14|48->25|48->25|48->25|49->26|49->26|50->27|51->28|51->28|51->28|52->29|53->30|53->30|53->30|54->31|54->31|55->32|57->34
                  -- GENERATED --
              */
          