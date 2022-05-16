
package views.html.mfr

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object list_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class list extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[IndexedSeq[String],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(mfrs: IndexedSeq[String], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
  """),format.raw/*9.3*/("""Manufacturers 
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.173*/("""

"""),format.raw/*5.1*/("""
"""),format.raw/*6.76*/(""" 

"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(signedInUserName, userorg, userrole, title, true, Page.Admin)/*12.68*/ {_display_(Seq[Any](format.raw/*12.70*/("""

  """),format.raw/*14.3*/("""<div class="span12">
  
    """),_display_(/*16.6*/flash/*16.11*/.get(FKSuccess).map/*16.30*/ { message =>_display_(Seq[Any](format.raw/*16.43*/("""  """),format.raw/*16.45*/("""<div class="alert alert-success"> """),_display_(/*16.80*/message),format.raw/*16.87*/("""  """),format.raw/*16.89*/("""</div> """)))}),format.raw/*16.97*/("""
    """),_display_(/*17.6*/flash/*17.11*/.get(FKError).map/*17.28*/ { message =>_display_(Seq[Any](format.raw/*17.41*/("""  """),format.raw/*17.43*/("""<div class="alert alert-error"> """),_display_(/*17.76*/message),format.raw/*17.83*/("""  """),format.raw/*17.85*/("""</div> """)))}),format.raw/*17.93*/("""
    
    """),_display_(/*19.6*/if(mfrs.nonEmpty)/*19.23*/{_display_(Seq[Any](format.raw/*19.24*/("""
    """),format.raw/*20.5*/("""<table class="table table-striped" >
      <thead>
        <tr>
          <th> Name </th>
          <th> Action </th>
        </tr>
      </thead>
      <tbody>
        """),_display_(/*28.10*/mfrs/*28.14*/.map/*28.18*/ { mfr =>_display_(Seq[Any](format.raw/*28.27*/("""
          """),format.raw/*29.11*/("""<tr>      
            <td> """),_display_(/*30.19*/mfr),format.raw/*30.22*/("""  """),format.raw/*30.24*/("""</td>
            <td>      
              """),_display_(/*32.16*/form(routes.AdminMfr.delete(version, mfr))/*32.58*/ {_display_(Seq[Any](format.raw/*32.60*/("""
                """),format.raw/*33.17*/("""<input class="btn btn-primary" type="submit" name="action" onclick="return confirm('Are you sure to remove this manufacturer?')" value="remove" />
              """)))}),format.raw/*34.16*/("""   
            """),format.raw/*35.13*/("""</td>
          </tr>
        """)))}),format.raw/*37.10*/("""
      """),format.raw/*38.7*/("""</tbody>
    </table>
  """)))}/*40.5*/else/*40.10*/{_display_(Seq[Any](format.raw/*40.11*/("""
        """),format.raw/*41.9*/("""<div class="well">
            <em> You have not created any manufacturers yet.</em>
        </div>  
  """)))}),format.raw/*44.4*/("""
    
  """),format.raw/*46.3*/("""</div>
       
""")))}),format.raw/*48.2*/("""
"""))
      }
    }
  }

  def render(mfrs:IndexedSeq[String],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(mfrs,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((IndexedSeq[String],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (mfrs,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(mfrs,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object list extends list_Scope0.list
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/mfr/list.scala.html
                  HASH: 06771dbadf86ea0e2cd051ed2c8946f461d7be79
                  MATRIX: 608->1|891->291|903->296|983->300|1012->303|1059->213|1091->237|1172->172|1200->211|1228->287|1258->319|1287->322|1362->388|1402->390|1433->394|1488->423|1502->428|1530->447|1581->460|1611->462|1673->497|1701->504|1731->506|1770->514|1802->520|1816->525|1842->542|1893->555|1923->557|1983->590|2011->597|2041->599|2080->607|2117->618|2143->635|2182->636|2214->641|2411->811|2424->815|2437->819|2484->828|2523->839|2579->868|2603->871|2633->873|2704->917|2755->959|2795->961|2840->978|3033->1140|3077->1156|3139->1187|3173->1194|3216->1220|3229->1225|3268->1226|3304->1235|3439->1340|3474->1348|3520->1364
                  LINES: 20->1|25->8|25->8|27->8|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|37->12|37->12|39->14|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|44->19|44->19|44->19|45->20|53->28|53->28|53->28|53->28|54->29|55->30|55->30|55->30|57->32|57->32|57->32|58->33|59->34|60->35|62->37|63->38|65->40|65->40|65->40|66->41|69->44|71->46|73->48
                  -- GENERATED --
              */
          