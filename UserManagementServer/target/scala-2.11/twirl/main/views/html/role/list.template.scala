
package views.html.role

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

class list extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[List[RoleDetails],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(ul: List[RoleDetails], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
  """),format.raw/*9.3*/("""Roles 
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.170*/("""

"""),format.raw/*5.1*/("""
"""),format.raw/*6.76*/(""" 

"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(signedInUserName, userorg, userrole, title, true, Page.Admin)/*12.68*/ {_display_(Seq[Any](format.raw/*12.70*/("""

  """),format.raw/*14.3*/("""<div class="span12">
  
    """),_display_(/*16.6*/flash/*16.11*/.get(FKSuccess).map/*16.30*/ { message =>_display_(Seq[Any](format.raw/*16.43*/("""  """),format.raw/*16.45*/("""<div class="alert alert-success"> """),_display_(/*16.80*/message),format.raw/*16.87*/("""  """),format.raw/*16.89*/("""</div> """)))}),format.raw/*16.97*/("""
    """),_display_(/*17.6*/flash/*17.11*/.get(FKError).map/*17.28*/ { message =>_display_(Seq[Any](format.raw/*17.41*/("""  """),format.raw/*17.43*/("""<div class="alert alert-error"> """),_display_(/*17.76*/message),format.raw/*17.83*/("""  """),format.raw/*17.85*/("""</div> """)))}),format.raw/*17.93*/("""
    """),_display_(/*18.6*/if(ul.nonEmpty)/*18.21*/{_display_(Seq[Any](format.raw/*18.22*/("""
    """),format.raw/*19.5*/("""<table class="table table-striped" >
      <thead>
        <tr>        
          <th> Role </th>
          <th> Domain -> MPS </th>
          <th style="padding-left:100px"> Action </th>
        </tr>
      </thead>
      <tbody>
        """),_display_(/*28.10*/ul/*28.12*/.map/*28.16*/ { u =>_display_(Seq[Any](format.raw/*28.23*/(""" 
        """),format.raw/*29.9*/("""<tr>  
            <td>  """),_display_(/*30.20*/u/*30.21*/.name),format.raw/*30.26*/("""  """),format.raw/*30.28*/("""</td>
     	    <td>
 	          <table>
	            """),_display_(/*33.15*/u/*33.16*/.domains.map/*33.28*/{p =>_display_(Seq[Any](format.raw/*33.33*/(""" 
                   """),format.raw/*34.20*/("""<tr><td style="border: 0;background: transparent;">"""),_display_(/*34.72*/p/*34.73*/._1),format.raw/*34.76*/(""" """),format.raw/*34.77*/("""-> """),_display_(/*34.81*/p/*34.82*/._2),format.raw/*34.85*/("""</td><td style="border:0;background:transparent">
                """),_display_(/*35.18*/form(routes.AdminRole.edit(version, u.name, p._1, u.features.values.mkString(","), p._2, u.realm_isdomain.keys.mkString(",")))/*35.144*/ {_display_(Seq[Any](format.raw/*35.146*/("""
                   """),format.raw/*36.20*/("""<input class="btn btn-primary" type="submit" name="action" value="Edit Domain" />
	            """)))}),format.raw/*37.15*/("""</td></tr>
	            """)))}),format.raw/*38.15*/("""
              """),format.raw/*39.15*/("""</table>
	        </td>
            <td>
              <table style="float:left">  
                <tr><td style="border:0;background:transparent">
                """),_display_(/*44.18*/form(routes.AdminRole.addDomain(version, u.name))/*44.67*/ {_display_(Seq[Any](format.raw/*44.69*/("""
                   """),format.raw/*45.20*/("""<input class="btn btn-primary" type="submit" name="action" value="Add More" />
	            """)))}),format.raw/*46.15*/("""</td><td style="border:0;background:transparent">
	            """),_display_(/*47.15*/form(routes.AdminRole.delete(version, u.name))/*47.61*/ {_display_(Seq[Any](format.raw/*47.63*/("""
                   """),format.raw/*48.20*/("""<input class="btn btn-primary" type="submit" name="action" onclick="return confirm('Are you sure to remove this role?')" value="Remove" />
	            """)))}),format.raw/*49.15*/("""
	            """),format.raw/*50.14*/("""</td></tr>
	          </table>
	      </td>
        </tr>
        """)))}),format.raw/*54.10*/("""
      """),format.raw/*55.7*/("""</tbody>
    </table>
  """)))}/*57.5*/else/*57.10*/{_display_(Seq[Any](format.raw/*57.11*/("""
        """),format.raw/*58.9*/("""<div class="well">
            <em> You have not created any Roles yet.</em>
        </div>  
  """)))}),format.raw/*61.4*/("""
  """),format.raw/*62.3*/("""</div>
       
""")))}),format.raw/*64.2*/("""
"""))
      }
    }
  }

  def render(ul:List[RoleDetails],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(ul,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((List[RoleDetails],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (ul,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(ul,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object list extends list_Scope0.list
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/role/list.scala.html
                  HASH: f9947a5183315075d101b0ca0965fc1f8071a920
                  MATRIX: 608->1|888->288|900->293|980->297|1009->300|1048->210|1080->234|1161->169|1189->208|1217->284|1247->308|1276->311|1351->377|1391->379|1422->383|1477->412|1491->417|1519->436|1570->449|1600->451|1662->486|1690->493|1720->495|1759->503|1791->509|1805->514|1831->531|1882->544|1912->546|1972->579|2000->586|2030->588|2069->596|2101->602|2125->617|2164->618|2196->623|2463->863|2474->865|2487->869|2532->876|2569->886|2622->912|2632->913|2658->918|2688->920|2770->975|2780->976|2801->988|2844->993|2893->1014|2972->1066|2982->1067|3006->1070|3035->1071|3066->1075|3076->1076|3100->1079|3194->1146|3330->1272|3371->1274|3419->1294|3546->1390|3602->1415|3645->1430|3838->1596|3896->1645|3936->1647|3984->1667|4108->1760|4199->1824|4254->1870|4294->1872|4342->1892|4526->2045|4568->2059|4666->2126|4700->2133|4743->2159|4756->2164|4795->2165|4831->2174|4958->2271|4988->2274|5034->2290
                  LINES: 20->1|25->8|25->8|27->8|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|37->12|37->12|39->14|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|43->18|43->18|43->18|44->19|53->28|53->28|53->28|53->28|54->29|55->30|55->30|55->30|55->30|58->33|58->33|58->33|58->33|59->34|59->34|59->34|59->34|59->34|59->34|59->34|59->34|60->35|60->35|60->35|61->36|62->37|63->38|64->39|69->44|69->44|69->44|70->45|71->46|72->47|72->47|72->47|73->48|74->49|75->50|79->54|80->55|82->57|82->57|82->57|83->58|86->61|87->62|89->64
                  -- GENERATED --
              */
          