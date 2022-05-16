
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object accountBlockedEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class accountBlockedEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template3[String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, timeString: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.54*/("""
"""),format.raw/*6.1*/("""<span style="font-size:17px">Hello """),_display_(/*6.37*/f_name),format.raw/*6.43*/(""",

Your account has been blocked as you have exceeded the
maximum number of incorrect login attempts.

Please try logging in after """),_display_(/*11.30*/timeString),format.raw/*11.40*/(""" """),format.raw/*11.41*/("""or contact your
site administrator to enable your account.

Thank You,
The Glassbeam Team
<a href="http://www.glassbeam.com" target="_blank">http://www.glassbeam.com</a>
</span>"""))
      }
    }
  }

  def render(f_name:String,l_name:String,timeString:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,timeString)

  def f:((String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,timeString) => apply(f_name,l_name,timeString)

  def ref: this.type = this

}


}

/**/
object accountBlockedEmail extends accountBlockedEmail_Scope0.accountBlockedEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/accountBlockedEmail.scala.html
                  HASH: c1920357386c756aedfc222a29d8c4965b1b6df4
                  MATRIX: 569->1|805->53|832->148|894->184|920->190|1079->322|1110->332|1139->333
                  LINES: 20->1|28->1|29->6|29->6|29->6|34->11|34->11|34->11
                  -- GENERATED --
              */
          