
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object sendWelcomeProspectEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class sendWelcomeProspectEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[String,String,String,String,Int,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(username: String, f_name: String, l_name: String, loginUrl: String, expiryDays: Int, expiryDate: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.123*/("""

"""),format.raw/*7.1*/("""<span style="font-size:17px">Hello """),_display_(/*7.37*/f_name),format.raw/*7.43*/(""",

Thank you for signing up with us for your 30 days trial.
You can now login to your account and explore clinical insights
on your machine data.

To login, use the verified email address as your user name and the
password mentioned while registration.

For any queries please contact out support team : <a href="mailto:"""),_display_(/*16.68*/SalesEmail),format.raw/*16.78*/("""">Glassbeam Sales</a>

"""),_display_(/*18.2*/footer),format.raw/*18.8*/("""
"""),format.raw/*19.1*/("""</span>
"""))
      }
    }
  }

  def render(username:String,f_name:String,l_name:String,loginUrl:String,expiryDays:Int,expiryDate:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(username,f_name,l_name,loginUrl,expiryDays,expiryDate,footer)

  def f:((String,String,String,String,Int,String,String) => play.twirl.api.HtmlFormat.Appendable) = (username,f_name,l_name,loginUrl,expiryDays,expiryDate,footer) => apply(username,f_name,l_name,loginUrl,expiryDays,expiryDate,footer)

  def ref: this.type = this

}


}

/**/
object sendWelcomeProspectEmail extends sendWelcomeProspectEmail_Scope0.sendWelcomeProspectEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/sendWelcomeProspectEmail.scala.html
                  HASH: b6cd92287c0c568c111b072fa3b45eed575fd53a
                  MATRIX: 604->1|910->122|938->218|1000->254|1026->260|1374->581|1405->591|1455->615|1481->621|1509->622
                  LINES: 20->1|28->1|30->7|30->7|30->7|39->16|39->16|41->18|41->18|42->19
                  -- GENERATED --
              */
          