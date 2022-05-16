
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object createPasswordEmail_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class createPasswordEmail extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[String,String,String,String,String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(f_name: String, l_name: String, email_link: String, expiry: String,body: String, header: String, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.115*/("""
"""),format.raw/*6.1*/("""
"""),_display_(/*7.2*/if(body == "NA" && header == "NA" && footer == "NA")/*7.54*/ {_display_(Seq[Any](format.raw/*7.56*/("""
"""),format.raw/*8.1*/("""<span style="font-family: Georgia, Times, Times New Roman, serif;font-size:17px">Hello """),_display_(/*8.89*/f_name),format.raw/*8.95*/(""",

Your Account has been created on Glassbeam. Please click this <a style='color:#22b8eb;font-size:17px;text-decoration:none;text-align:left' href="""),_display_(/*10.146*/email_link),format.raw/*10.156*/(""">link</a> to set up your password

Kindly note that the password link will expire in <b>"""),_display_(/*12.55*/expiry),format.raw/*12.61*/("""</b>.

Thank You,
The Glassbeam Team
http://www.glassbeam.com
</span>       
""")))}/*18.3*/else/*18.8*/{_display_(Seq[Any](format.raw/*18.9*/("""

"""),format.raw/*20.1*/("""<span style="font-family: Georgia, Times, Times New Roman, serif;font-size:17px">"""),_display_(/*20.83*/header),format.raw/*20.89*/(""" """),_display_(/*20.91*/f_name),format.raw/*20.97*/(""",<br/>
"""),_display_(/*21.2*/body),format.raw/*21.6*/(""" 
"""),format.raw/*22.1*/("""Please click this <a style='color:#22b8eb;font-size:17px;text-decoration:none;text-align:left' href="""),_display_(/*22.102*/email_link),format.raw/*22.112*/(""">link</a> to set up your password

Kindly note that the password link will expire in <b>"""),_display_(/*24.55*/expiry),format.raw/*24.61*/("""</b>  
<br/>  
"""),_display_(/*26.2*/footer),format.raw/*26.8*/("""
"""),format.raw/*27.1*/("""</span>       

""")))}),format.raw/*29.2*/("""
"""))
      }
    }
  }

  def render(f_name:String,l_name:String,email_link:String,expiry:String,body:String,header:String,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(f_name,l_name,email_link,expiry,body,header,footer)

  def f:((String,String,String,String,String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (f_name,l_name,email_link,expiry,body,header,footer) => apply(f_name,l_name,email_link,expiry,body,header,footer)

  def ref: this.type = this

}


}

/**/
object createPasswordEmail extends createPasswordEmail_Scope0.createPasswordEmail
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/createPasswordEmail.scala.html
                  HASH: 41e9709f0ae4b9bfd08470aa2ad771f0894c189a
                  MATRIX: 597->1|895->114|922->209|949->211|1009->263|1048->265|1075->266|1189->354|1215->360|1391->508|1423->518|1539->607|1566->613|1662->692|1674->697|1712->698|1741->700|1850->782|1877->788|1906->790|1933->796|1967->804|1991->808|2020->810|2149->911|2181->921|2297->1010|2324->1016|2366->1032|2392->1038|2420->1039|2467->1056
                  LINES: 20->1|28->1|29->6|30->7|30->7|30->7|31->8|31->8|31->8|33->10|33->10|35->12|35->12|41->18|41->18|41->18|43->20|43->20|43->20|43->20|43->20|44->21|44->21|45->22|45->22|45->22|47->24|47->24|49->26|49->26|50->27|52->29
                  -- GENERATED --
              */
          