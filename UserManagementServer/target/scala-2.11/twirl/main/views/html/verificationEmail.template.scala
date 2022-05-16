
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object verificationEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class verificationEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template5[String,String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, email_link: String, linkExpiry: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.90*/("""
"""),format.raw/*6.1*/("""<span style="font-size:17px">Hello """),_display_(/*6.37*/f_name),format.raw/*6.43*/(""",

Thank you for signing up with Glassbeam. Please click
the link below to verify your email address.

<a style='padding:10px 20px 10px 30px;margin-bottom:20px;color:#22b8eb;font-size:17px;text-decoration:none;display:inline-block;text-align:left' href="""),_display_(/*11.152*/email_link),format.raw/*11.162*/(""">Click here to verify your account</a>

This link will expire in next """),_display_(/*13.32*/linkExpiry),format.raw/*13.42*/(""" """),format.raw/*13.43*/("""from now.

"""),_display_(/*15.2*/footer),format.raw/*15.8*/("""
"""),format.raw/*16.1*/("""</span>       
"""))
      }
    }
  }

  def render(f_name:String,l_name:String,email_link:String,linkExpiry:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,email_link,linkExpiry,footer)

  def f:((String,String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,email_link,linkExpiry,footer) => apply(f_name,l_name,email_link,linkExpiry,footer)

  def ref: this.type = this

}


}

/**/
object verificationEmail extends verificationEmail_Scope0.verificationEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/verificationEmail.scala.html
                  HASH: 56e7f611045a25561bc8d13e2461731db3ab6408
                  MATRIX: 579->1|851->89|878->184|940->220|966->226|1248->480|1280->490|1378->561|1409->571|1438->572|1476->584|1502->590|1530->591
                  LINES: 20->1|28->1|29->6|29->6|29->6|34->11|34->11|36->13|36->13|36->13|38->15|38->15|39->16
                  -- GENERATED --
              */
          