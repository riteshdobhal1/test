
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object error_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class error extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template5[Option[String],Option[String],Option[String],constants.HttpStatus.HttpStatus,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(username: Option[String], userorg: Option[String], userrole: Option[String], errType: constants.HttpStatus.HttpStatus, errMessage: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
	"""),_display_(/*9.3*/errType),format.raw/*9.10*/("""
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.141*/("""

"""),format.raw/*5.1*/("""
"""),format.raw/*6.76*/(""" 

"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(username, userorg, userrole, title, true, Page.Error)/*12.60*/ {_display_(Seq[Any](format.raw/*12.62*/("""

	"""),format.raw/*14.2*/("""<div class="span10">	
		<div class="alert alert-error">
			<p> """),_display_(/*16.9*/errMessage),format.raw/*16.19*/(""" """),format.raw/*16.20*/("""</p>
		</div>
	</div>
""")))}),format.raw/*19.2*/("""
"""))
      }
    }
  }

  def render(username:Option[String],userorg:Option[String],userrole:Option[String],errType:constants.HttpStatus.HttpStatus,errMessage:String): play.twirl.api.HtmlFormat.Appendable = apply(username,userorg,userrole,errType,errMessage)

  def f:((Option[String],Option[String],Option[String],constants.HttpStatus.HttpStatus,String) => play.twirl.api.HtmlFormat.Appendable) = (username,userorg,userrole,errType,errMessage) => apply(username,userorg,userrole,errType,errMessage)

  def ref: this.type = this

}


}

/**/
object error extends error_Scope0.error
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/error.scala.html
                  HASH: 150df8fa7af6a1e243f8d1989f98443efc0d4103
                  MATRIX: 604->1|855->259|867->264|947->268|975->271|1002->278|1035->181|1067->205|1148->140|1176->179|1204->255|1234->280|1263->283|1330->341|1370->343|1400->346|1490->410|1521->420|1550->421|1603->444
                  LINES: 20->1|25->8|25->8|27->8|28->9|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|37->12|37->12|39->14|41->16|41->16|41->16|44->19
                  -- GENERATED --
              */
          