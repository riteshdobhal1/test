
package views.html.customer

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object listAll_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class listAll extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[IndexedSeq[scala.Tuple5[String, String, String, String, String]],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(cl:IndexedSeq[(String, String, String, String, String)], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
  """),format.raw/*9.3*/("""Customers 
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.204*/("""

"""),format.raw/*5.1*/("""
"""),format.raw/*6.76*/(""" 

"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*12.69*/ {_display_(Seq[Any](format.raw/*12.71*/("""

  """),format.raw/*14.3*/("""<div class="span12">
  
    """),_display_(/*16.6*/flash/*16.11*/.get(FKSuccess).map/*16.30*/ { message =>_display_(Seq[Any](format.raw/*16.43*/("""  """),format.raw/*16.45*/("""<div class="alert alert-success"> """),_display_(/*16.80*/message),format.raw/*16.87*/("""  """),format.raw/*16.89*/("""</div> """)))}),format.raw/*16.97*/("""
    """),_display_(/*17.6*/flash/*17.11*/.get(FKError).map/*17.28*/ { message =>_display_(Seq[Any](format.raw/*17.41*/("""  """),format.raw/*17.43*/("""<div class="alert alert-error"> """),_display_(/*17.76*/message),format.raw/*17.83*/("""  """),format.raw/*17.85*/("""</div> """)))}),format.raw/*17.93*/("""
    
    """),_display_(/*19.6*/if(cl.nonEmpty)/*19.21*/{_display_(Seq[Any](format.raw/*19.22*/("""
    """),format.raw/*20.5*/("""<table class="table table-striped" >
      <thead>
        <tr>
          <th> Manufacturer </th>
          <th> Product </th>
          <th> Schema </th>
          <th> Ec </th>
          <th> Realm </th>
          <th> Action </th>
        </tr>
      </thead>
      <tbody>      
        """),_display_(/*32.10*/cl/*32.12*/.map/*32.16*/ { case (m, p, s, e, r) =>_display_(Seq[Any](format.raw/*32.42*/(""" 
          """),format.raw/*33.11*/("""<tr>      
            <td> """),_display_(/*34.19*/m),format.raw/*34.20*/("""  """),format.raw/*34.22*/("""</td>
            <td> """),_display_(/*35.19*/p),format.raw/*35.20*/("""  """),format.raw/*35.22*/("""</td>
            <td> """),_display_(/*36.19*/s),format.raw/*36.20*/("""  """),format.raw/*36.22*/("""</td>
            <td> """),_display_(/*37.19*/e),format.raw/*37.20*/("""  """),format.raw/*37.22*/("""</td>
            <td> """),_display_(/*38.19*/r),format.raw/*38.20*/("""  """),format.raw/*38.22*/("""</td>
            <td>      
              """),_display_(/*40.16*/form(routes.AdminCustomer.delete("v1", m, p, s, e, r))/*40.70*/ {_display_(Seq[Any](format.raw/*40.72*/("""
                """),format.raw/*41.17*/("""<input class="btn btn-primary" type="submit" name="action" onclick="return confirm('Are you sure to remove this customer?')" value="remove" />
              """)))}),format.raw/*42.16*/("""   
            """),format.raw/*43.13*/("""</td>
          </tr>
      """)))}),format.raw/*45.8*/("""
      """),format.raw/*46.7*/("""</tbody>
    </table>
  """)))}/*48.5*/else/*48.10*/{_display_(Seq[Any](format.raw/*48.11*/("""
        """),format.raw/*49.9*/("""<div class="well">
            <em> You have not created any customers yet.</em>
        </div>  
  """)))}),format.raw/*52.4*/("""
    
  """),format.raw/*54.3*/("""</div>
       
""")))}),format.raw/*56.2*/("""
"""))
      }
    }
  }

  def render(cl:IndexedSeq[scala.Tuple5[String, String, String, String, String]],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(cl,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((IndexedSeq[scala.Tuple5[String, String, String, String, String]],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (cl,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(cl,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object listAll extends listAll_Scope0.listAll
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/customer/listAll.scala.html
                  HASH: 727ca4edbd1145d99585ed612f4b049c1cd428fa
                  MATRIX: 665->1|979->322|991->327|1071->331|1100->334|1143->244|1175->268|1256->203|1284->242|1312->318|1342->346|1371->349|1447->416|1487->418|1518->422|1573->451|1587->456|1615->475|1666->488|1696->490|1758->525|1786->532|1816->534|1855->542|1887->548|1901->553|1927->570|1978->583|2008->585|2068->618|2096->625|2126->627|2165->635|2202->646|2226->661|2265->662|2297->667|2616->959|2627->961|2640->965|2704->991|2744->1003|2800->1032|2822->1033|2852->1035|2903->1059|2925->1060|2955->1062|3006->1086|3028->1087|3058->1089|3109->1113|3131->1114|3161->1116|3212->1140|3234->1141|3264->1143|3335->1187|3398->1241|3438->1243|3483->1260|3672->1418|3716->1434|3775->1463|3809->1470|3852->1496|3865->1501|3904->1502|3940->1511|4071->1612|4106->1620|4152->1636
                  LINES: 20->1|25->8|25->8|27->8|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|37->12|37->12|39->14|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|44->19|44->19|44->19|45->20|57->32|57->32|57->32|57->32|58->33|59->34|59->34|59->34|60->35|60->35|60->35|61->36|61->36|61->36|62->37|62->37|62->37|63->38|63->38|63->38|65->40|65->40|65->40|66->41|67->42|68->43|70->45|71->46|73->48|73->48|73->48|74->49|77->52|79->54|81->56
                  -- GENERATED --
              */
          