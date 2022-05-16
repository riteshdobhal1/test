
package views.html.role

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object addNew_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class addNew extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template11[Form[NewRole],Seq[String],Seq[String],Seq[String],Seq[scala.Tuple2[String, String]],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(roleForm: Form[NewRole], mfr: Seq[String],  prod: Seq[String], sch: Seq[String], feature: Seq[(String,String)],signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
"""),_display_(/*9.2*/roleForm/*9.10*/.value/*9.16*/ match/*9.22*/ {/*10.1*/case Some(rf) =>/*10.17*/ {_display_(Seq[Any](format.raw/*10.19*/(""" """),format.raw/*10.20*/("""Edit Role""")))}/*11.1*/case None =>/*11.13*/ {_display_(Seq[Any](format.raw/*11.15*/("""Add New Role""")))}}),format.raw/*12.2*/("""
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.258*/("""


"""),format.raw/*6.76*/("""

"""),format.raw/*13.2*/("""

"""),_display_(/*15.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*15.69*/ {_display_(Seq[Any](format.raw/*15.71*/("""
"""),format.raw/*16.1*/("""<div class="span6">
    """),_display_(/*17.6*/flash/*17.11*/.get(FKSuccess).map/*17.30*/ { message =>_display_(Seq[Any](format.raw/*17.43*/("""  """),format.raw/*17.45*/("""<div class="alert alert-success">   """),_display_(/*17.82*/message),format.raw/*17.89*/("""  """),format.raw/*17.91*/("""</div>  """)))}),format.raw/*17.100*/("""
    """),_display_(/*18.6*/if(roleForm.hasErrors)/*18.28*/ {_display_(Seq[Any](format.raw/*18.30*/(""" """),format.raw/*18.31*/("""<div class="alert alert-error"> Oops! Please see below. </div>  """)))}),format.raw/*18.96*/("""
    """),_display_(/*19.6*/roleForm/*19.14*/.globalError.map/*19.30*/ { error =>_display_(Seq[Any](format.raw/*19.41*/(""" """),format.raw/*19.42*/("""<div class="alert alert-error"> """),_display_(/*19.75*/error/*19.80*/.message),format.raw/*19.88*/("""   """),format.raw/*19.91*/("""</div>  """)))}),format.raw/*19.100*/("""
    """),_display_(/*20.6*/form(routes.AdminRole.add(version), 'class -> "form-horizontal")/*20.70*/ {_display_(Seq[Any](format.raw/*20.72*/("""
    """),_display_(/*21.6*/inputText( roleForm("name"), 'maxlength -> "128", '_label -> "Name: *",'_showConstraints -> false)),format.raw/*21.104*/("""

    """),_display_(/*23.6*/inputText( roleForm("domain"), 'maxlength -> "128", '_label -> "Domain: *",'_showConstraints -> false)),format.raw/*23.108*/("""
    """),_display_(/*24.6*/select(roleForm ("mfr"),
    options = mfr.map(m => (m.toString, m)),
    '_label -> "Manufacture:",
    '_error -> roleForm("mfr").error.map(_.withMessage("Please select at least one manufacture")),
    '_showConstraints -> false
    )),format.raw/*29.6*/("""
    """),_display_(/*30.6*/select(roleForm ("prod"),
    options = prod.map(p => (p.toString, p)),
    '_label -> "Product:",
    '_error -> roleForm("prod").error.map(_.withMessage("Please select at least one product")),
    '_showConstraints -> false
    )),format.raw/*35.6*/("""
    """),_display_(/*36.6*/select(roleForm ("sch"),
    options = sch.map(s => (s.toString, s)),
    '_label -> "Schema:",
    '_error -> roleForm("sch").error.map(_.withMessage("Please select at least one schema")),
    '_showConstraints -> false
    )),format.raw/*41.6*/("""

    """),_display_(/*43.6*/checkbox( roleForm("is_super"),  '_label -> "Is Super:", 'checked -> "checked",'_showConstraints -> false )),format.raw/*43.113*/("""

    """),_display_(/*45.6*/select(roleForm("realm"),
    options = options(Org.realms.toList),
    '_label -> "Realm: *",
    '_showConstraints -> false,
    'multiple-> "multiple"

    )),format.raw/*51.6*/("""

    """),_display_(/*53.6*/inputCheckboxGroup(roleForm("features"),  options = feature,'_showConstraints -> false,'_label -> "Features: *",
    '_error -> roleForm("features").error.map(_.withMessage("select one or more features")))),format.raw/*54.93*/("""

    """),format.raw/*56.5*/("""<div class="form-actions">
        <input name="action" class="btn btn-primary" type="submit" value="Save">
        <a href=""""),_display_(/*58.19*/routes/*58.25*/.AdminRole.list(version)),format.raw/*58.49*/("""" class="btn">Cancel</a>
    </div>
    """)))}),format.raw/*60.6*/("""
"""),format.raw/*61.1*/("""</div>
""")))}),format.raw/*62.2*/("""
"""))
      }
    }
  }

  def render(roleForm:Form[NewRole],mfr:Seq[String],prod:Seq[String],sch:Seq[String],feature:Seq[scala.Tuple2[String, String]],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[NewRole],Seq[String],Seq[String],Seq[String],Seq[scala.Tuple2[String, String]],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object addNew extends addNew_Scope0.addNew
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/role/addNew.scala.html
                  HASH: ccbd37a208333622c78f8c9f8422283b4bedb7d0
                  MATRIX: 679->1|1047->375|1059->380|1139->384|1166->386|1182->394|1196->400|1210->406|1220->409|1245->425|1285->427|1314->428|1342->439|1363->451|1403->453|1447->468|1480->298|1512->322|1593->257|1623->372|1652->470|1681->473|1757->540|1797->542|1825->543|1876->568|1890->573|1918->592|1969->605|1999->607|2063->644|2091->651|2121->653|2162->662|2194->668|2225->690|2265->692|2294->693|2390->758|2422->764|2439->772|2464->788|2513->799|2542->800|2602->833|2616->838|2645->846|2676->849|2717->858|2749->864|2822->928|2862->930|2894->936|3014->1034|3047->1041|3171->1143|3203->1149|3459->1385|3491->1391|3742->1622|3774->1628|4020->1854|4053->1861|4182->1968|4215->1975|4395->2135|4428->2142|4654->2347|4687->2353|4840->2479|4855->2485|4900->2509|4971->2550|4999->2551|5037->2559
                  LINES: 20->1|25->8|25->8|27->8|28->9|28->9|28->9|28->9|28->10|28->10|28->10|28->10|28->11|28->11|28->11|28->12|29->6|29->6|30->1|33->6|35->13|37->15|37->15|37->15|38->16|39->17|39->17|39->17|39->17|39->17|39->17|39->17|39->17|39->17|40->18|40->18|40->18|40->18|40->18|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|42->20|42->20|42->20|43->21|43->21|45->23|45->23|46->24|51->29|52->30|57->35|58->36|63->41|65->43|65->43|67->45|73->51|75->53|76->54|78->56|80->58|80->58|80->58|82->60|83->61|84->62
                  -- GENERATED --
              */
          