
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object forgotPasswordEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class forgotPasswordEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template4[String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, email_link: String, expiry: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.70*/("""
"""),format.raw/*6.1*/("""<span style="font-family: Georgia, Times, Times New Roman, serif;font-size:17px">Hello """),_display_(/*6.89*/f_name),format.raw/*6.95*/(""",

Please click the link below to reset your password.

<a style='color:#22b8eb;font-size:17px;text-decoration:none;text-align:left' href="""),_display_(/*10.84*/email_link),format.raw/*10.94*/(""">Click here to reset your password.</a>

Kindly note that the link will get expired in <b>"""),_display_(/*12.51*/expiry),format.raw/*12.57*/("""</b>.

Thank You,
The Glassbeam Team
http://www.glassbeam.com
</span>       
"""))
      }
    }
  }

  def render(f_name:String,l_name:String,email_link:String,expiry:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,email_link,expiry)

  def f:((String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,email_link,expiry) => apply(f_name,l_name,email_link,expiry)

  def ref: this.type = this

}


}

/**/
object forgotPasswordEmail extends forgotPasswordEmail_Scope0.forgotPasswordEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/forgotPasswordEmail.scala.html
                  HASH: 58682c4ef96c764a5c885cb4f8693196e2981c0a
                  MATRIX: 576->1|828->69|855->164|969->252|995->258|1161->397|1192->407|1310->498|1337->504
                  LINES: 20->1|28->1|29->6|29->6|29->6|33->10|33->10|35->12|35->12
                  -- GENERATED --
              */
          