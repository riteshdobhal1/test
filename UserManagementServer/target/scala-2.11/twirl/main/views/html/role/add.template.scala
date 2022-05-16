
package views.html.role

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object add_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class add extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template11[Form[Role],Seq[String],Seq[String],Seq[String],Seq[scala.Tuple2[String, String]],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(roleForm: Form[Role], mfr: Seq[String],  prod: Seq[String], sch: Seq[String], feature: Seq[(String,String)],signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
   """),_display_(/*9.5*/roleForm/*9.13*/.value/*9.19*/ match/*9.25*/ {/*10.5*/case Some(rf) =>/*10.21*/ {_display_(Seq[Any](format.raw/*10.23*/(""" """),format.raw/*10.24*/("""Edit Role""")))}/*11.5*/case None =>/*11.17*/ {_display_(Seq[Any](format.raw/*11.19*/("""Add New Role""")))}}),format.raw/*12.5*/("""
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.255*/("""


"""),format.raw/*6.76*/(""" 

"""),format.raw/*13.2*/("""

"""),_display_(/*15.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*15.69*/ {_display_(Seq[Any](format.raw/*15.71*/("""
  """),format.raw/*16.3*/("""<div class="span6">
   """),_display_(/*17.5*/flash/*17.10*/.get(FKSuccess).map/*17.29*/ { message =>_display_(Seq[Any](format.raw/*17.42*/("""  """),format.raw/*17.44*/("""<div class="alert alert-success">   """),_display_(/*17.81*/message),format.raw/*17.88*/("""  """),format.raw/*17.90*/("""</div>  """)))}),format.raw/*17.99*/("""
   """),_display_(/*18.5*/if(roleForm.hasErrors)/*18.27*/ {_display_(Seq[Any](format.raw/*18.29*/(""" """),format.raw/*18.30*/("""<div class="alert alert-error"> Oops! Please see below. </div>  """)))}),format.raw/*18.95*/("""       
   """),_display_(/*19.5*/roleForm/*19.13*/.globalError.map/*19.29*/ { error =>_display_(Seq[Any](format.raw/*19.40*/(""" """),format.raw/*19.41*/("""<div class="alert alert-error"> """),_display_(/*19.74*/error/*19.79*/.message),format.raw/*19.87*/("""   """),format.raw/*19.90*/("""</div>  """)))}),format.raw/*19.99*/("""
   """),_display_(/*20.5*/form(routes.AdminRole.add(version), 'class -> "form-horizontal")/*20.69*/ {_display_(Seq[Any](format.raw/*20.71*/("""
    """),_display_(/*21.6*/inputText( roleForm("name"), 'maxlength -> "128", '_label -> "Name: *",'_showConstraints -> false)),format.raw/*21.104*/("""
      
     """),_display_(/*23.7*/inputText( roleForm("domain"), 'maxlength -> "128", '_label -> "Domain: *",'_showConstraints -> false)),format.raw/*23.109*/("""
    """),_display_(/*24.6*/select(roleForm ("mfr"),
      options = mfr.map(m => (m.toString, m)),
      '_label -> "Manufacture:",
      '_error -> roleForm("mfr").error.map(_.withMessage("Please select at least one manufacture")),
      '_showConstraints -> false
    )),format.raw/*29.6*/("""
     """),_display_(/*30.7*/select(roleForm ("prod"),
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
          '_error -> roleForm("features").error.map(_.withMessage("select one or more features")))),format.raw/*54.99*/("""
    
    """),format.raw/*56.5*/("""<div class="form-actions">
      <input name="action" class="btn btn-primary" type="submit" value="Save">
      <a href=""""),_display_(/*58.17*/routes/*58.23*/.AdminRole.list(version)),format.raw/*58.47*/("""" class="btn">Cancel</a>
    </div>
  """)))}),format.raw/*60.4*/("""
  """),format.raw/*61.3*/("""</div>
""")))}),format.raw/*62.2*/("""
"""))
      }
    }
  }

  def render(roleForm:Form[Role],mfr:Seq[String],prod:Seq[String],sch:Seq[String],feature:Seq[scala.Tuple2[String, String]],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[Role],Seq[String],Seq[String],Seq[String],Seq[scala.Tuple2[String, String]],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(roleForm,mfr,prod,sch,feature,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object add extends add_Scope0.add
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/role/add.scala.html
                  HASH: 3856373544f5bb8192084a5d56b1a7a41342cd50
                  MATRIX: 670->1|1035->373|1047->378|1127->382|1157->387|1173->395|1187->401|1201->407|1211->414|1236->430|1276->432|1305->433|1333->448|1354->460|1394->462|1438->480|1471->295|1503->319|1584->254|1614->369|1644->482|1673->485|1749->552|1789->554|1819->557|1869->581|1883->586|1911->605|1962->618|1992->620|2056->657|2084->664|2114->666|2154->675|2185->680|2216->702|2256->704|2285->705|2381->770|2419->782|2436->790|2461->806|2510->817|2539->818|2599->851|2613->856|2642->864|2673->867|2713->876|2744->881|2817->945|2857->947|2889->953|3009->1051|3049->1065|3173->1167|3205->1173|3469->1417|3502->1424|3761->1663|3793->1669|4047->1903|4084->1914|4213->2021|4251->2033|4448->2210|4481->2217|4713->2428|4750->2438|4899->2560|4914->2566|4959->2590|5028->2629|5058->2632|5096->2640
                  LINES: 20->1|25->8|25->8|27->8|28->9|28->9|28->9|28->9|28->10|28->10|28->10|28->10|28->11|28->11|28->11|28->12|29->6|29->6|30->1|33->6|35->13|37->15|37->15|37->15|38->16|39->17|39->17|39->17|39->17|39->17|39->17|39->17|39->17|39->17|40->18|40->18|40->18|40->18|40->18|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|41->19|42->20|42->20|42->20|43->21|43->21|45->23|45->23|46->24|51->29|52->30|57->35|58->36|63->41|65->43|65->43|67->45|73->51|75->53|76->54|78->56|80->58|80->58|80->58|82->60|83->61|84->62
                  -- GENERATED --
              */
          