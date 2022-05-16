
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object createSSOEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class createSSOEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template6[String,String,String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, email_link: String, body: String, header: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.100*/("""
"""),format.raw/*6.1*/("""
"""),_display_(/*7.2*/if(body == "NA" && header == "NA" && footer == "NA")/*7.54*/ {_display_(Seq[Any](format.raw/*7.56*/("""
"""),format.raw/*8.1*/("""<span style="font-family: Georgia, Times, Times New Roman, serif;font-size:17px">Hello """),_display_(/*8.89*/f_name),format.raw/*8.95*/(""",

Your Account has been created on SmartFleet. 
You are now authorized to access SmartFleet Glassbeam Applications through you Single Sign On (SSO) credentials.	

Thank You,
SmartFleet-Glassbeam Account Administrator

</span>       
""")))}/*17.3*/else/*17.8*/{_display_(Seq[Any](format.raw/*17.9*/("""

"""),format.raw/*19.1*/("""<span style="font-family: Georgia, Times, Times New Roman, serif;font-size:17px">"""),_display_(/*19.83*/header),format.raw/*19.89*/(""" """),_display_(/*19.91*/f_name),format.raw/*19.97*/(""",<br/>
"""),_display_(/*20.2*/body),format.raw/*20.6*/("""
"""),_display_(/*21.2*/if(email_link != "NA")/*21.24*/{_display_(Seq[Any](format.raw/*21.25*/("""Please visit the <a style='color:#22b8eb;font-size:17px;text-decoration:none;text-align:left' href="""),_display_(/*21.125*/email_link),format.raw/*21.135*/(""">link</a>
""")))}),format.raw/*22.2*/("""

"""),_display_(/*24.2*/footer),format.raw/*24.8*/("""
"""),format.raw/*25.1*/("""</span>       

""")))}),format.raw/*27.2*/("""
"""))
      }
    }
  }

  def render(f_name:String,l_name:String,email_link:String,body:String,header:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,email_link,body,header,footer)

  def f:((String,String,String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,email_link,body,header,footer) => apply(f_name,l_name,email_link,body,header,footer)

  def ref: this.type = this

}


}

/**/
object createSSOEmail extends createSSOEmail_Scope0.createSSOEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/createSSOEmail.scala.html
                  HASH: 09e394cac304f9d472c6b84232bf3c41f1d72d14
                  MATRIX: 580->1|863->99|890->194|917->196|977->248|1016->250|1043->251|1157->339|1183->345|1436->581|1448->586|1486->587|1515->589|1624->671|1651->677|1680->679|1707->685|1741->693|1765->697|1793->699|1824->721|1863->722|1991->822|2023->832|2064->843|2093->846|2119->852|2147->853|2194->870
                  LINES: 20->1|28->1|29->6|30->7|30->7|30->7|31->8|31->8|31->8|40->17|40->17|40->17|42->19|42->19|42->19|42->19|42->19|43->20|43->20|44->21|44->21|44->21|44->21|44->21|45->22|47->24|47->24|48->25|50->27
                  -- GENERATED --
              */
          