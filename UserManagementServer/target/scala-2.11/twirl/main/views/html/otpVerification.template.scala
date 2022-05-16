
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object otpVerification_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class otpVerification extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template5[String,String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, otp: String, otpExpiry: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.82*/("""
"""),format.raw/*6.1*/("""<span style="font-size:17px">Hello """),_display_(/*6.37*/f_name),format.raw/*6.43*/(""",


Your one time security code to login to Glassbeam is """),_display_(/*9.55*/otp),format.raw/*9.58*/(""".
This code is valid for """),_display_(/*10.25*/otpExpiry),format.raw/*10.34*/(""". If you did not request this code,
please contact <a href="mailto:"""),_display_(/*11.33*/SupportEmail),format.raw/*11.45*/("""">Glassbeam Support</a>

"""),_display_(/*13.2*/footer),format.raw/*13.8*/("""
"""),format.raw/*14.1*/("""</span> """))
      }
    }
  }

  def render(f_name:String,l_name:String,otp:String,otpExpiry:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,otp,otpExpiry,footer)

  def f:((String,String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,otp,otpExpiry,footer) => apply(f_name,l_name,otp,otpExpiry,footer)

  def ref: this.type = this

}


}

/**/
object otpVerification extends otpVerification_Scope0.otpVerification
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/otpVerification.scala.html
                  HASH: 3562e0e6e2384db7cd9d80b91297e849470e16b8
                  MATRIX: 575->1|839->81|866->176|928->212|954->218|1038->276|1061->279|1114->305|1144->314|1239->382|1272->394|1324->420|1350->426|1378->427
                  LINES: 20->1|28->1|29->6|29->6|29->6|32->9|32->9|33->10|33->10|34->11|34->11|36->13|36->13|37->14
                  -- GENERATED --
              */
          