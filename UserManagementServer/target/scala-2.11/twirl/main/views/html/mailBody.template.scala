
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object mailBody_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class mailBody extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[String,String,String,String,Int,Boolean,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(username: String, f_name: String, l_name: String, loginUrl: String, expiryDays: Int, isCreated: Boolean, footer: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.123*/("""

"""),format.raw/*7.1*/("""<span style="font-size:17px">Hello """),_display_(/*7.37*/f_name),format.raw/*7.43*/(""",
"""),_display_(/*8.2*/if(isCreated)/*8.15*/ {_display_(Seq[Any](format.raw/*8.17*/("""
"""),format.raw/*9.1*/("""Welcome to Glassbeam Analytics. For the next 30 days you
will have access to one of the world's most powerful insightful
analytics tool. Click on the login link below to explore into
our interactive demos.

<a style='padding:10px 20px 10px 30px;margin-bottom:20px;color:#22b8eb;font-size:17px;text-decoration:none;display:inline-block;text-align:center' href="""),_display_(/*14.154*/loginUrl),format.raw/*14.162*/(""">Login</a>
""")))}),format.raw/*15.2*/(""" """),_display_(/*15.4*/if(!isCreated && expiryDays == 7)/*15.37*/{_display_(Seq[Any](format.raw/*15.38*/("""
"""),format.raw/*16.1*/("""It&#8217;s been a week since you registered for your free trial of
Glassbeam Clinsights and we hope your experience is going
well. If you have any feedback or questions, please contact
<a href="mailto:"""),_display_(/*19.18*/SalesEmail),format.raw/*19.28*/("""">Glassbeam Sales</a>
""")))}),format.raw/*20.2*/(""" """),_display_(/*20.4*/if(!isCreated && expiryDays == 25)/*20.38*/{_display_(Seq[Any](format.raw/*20.39*/("""
"""),format.raw/*21.1*/("""You have 5 days left on your free trial and we hope you saw
value with the clinical insights provided on machine data
through Glassbeam Clinsights. If you are interested to deploy
Glassbeam Clinsights in your facility or would like to extend
the trial period, you can reach out to us at <a href="mailto:"""),_display_(/*25.63*/SalesEmail),format.raw/*25.73*/("""">Glassbeam Sales</a>
""")))}),format.raw/*26.2*/(""" """),_display_(/*26.4*/if(!isCreated && expiryDays >= 30)/*26.38*/{_display_(Seq[Any](format.raw/*26.39*/("""
"""),format.raw/*27.1*/("""Thank you again for your interest in the Glassbeam Clinsight&#8217;s
Free Trial. Your free trial has expired and we hope this trial
was helpful to make a decision on your clinical insights requirement.

If you are interested to deploy Glassbeam Clinsights in your
facility or would like to extend the trial period, you can reach
out to us at <a href="mailto:"""),_display_(/*33.31*/SalesEmail),format.raw/*33.41*/("""">Glassbeam Sales</a>
""")))}),format.raw/*34.2*/("""

"""),_display_(/*36.2*/footer),format.raw/*36.8*/("""
"""),format.raw/*37.1*/("""</span>
"""))
      }
    }
  }

  def render(username:String,f_name:String,l_name:String,loginUrl:String,expiryDays:Int,isCreated:Boolean,footer:String): play.twirl.api.HtmlFormat.Appendable = apply(username,f_name,l_name,loginUrl,expiryDays,isCreated,footer)

  def f:((String,String,String,String,Int,Boolean,String) => play.twirl.api.HtmlFormat.Appendable) = (username,f_name,l_name,loginUrl,expiryDays,isCreated,footer) => apply(username,f_name,l_name,loginUrl,expiryDays,isCreated,footer)

  def ref: this.type = this

}


}

/**/
object mailBody extends mailBody_Scope0.mailBody
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/mailBody.scala.html
                  HASH: 60c482a21684c9b0170b56f43fdbe832fa921e63
                  MATRIX: 573->1|879->122|907->218|969->254|995->260|1023->263|1044->276|1083->278|1110->279|1498->639|1528->647|1570->659|1598->661|1640->694|1679->695|1707->696|1936->898|1967->908|2020->931|2048->933|2091->967|2130->968|2158->969|2489->1273|2520->1283|2573->1306|2601->1308|2644->1342|2683->1343|2711->1344|3097->1703|3128->1713|3181->1736|3210->1739|3236->1745|3264->1746
                  LINES: 20->1|28->1|30->7|30->7|30->7|31->8|31->8|31->8|32->9|37->14|37->14|38->15|38->15|38->15|38->15|39->16|42->19|42->19|43->20|43->20|43->20|43->20|44->21|48->25|48->25|49->26|49->26|49->26|49->26|50->27|56->33|56->33|57->34|59->36|59->36|60->37
                  -- GENERATED --
              */
          