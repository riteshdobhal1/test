
package views.html.customer

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

class add extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[Form[Cust],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(customerForm: Form[Cust], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
  """),format.raw/*8.3*/("""Add New Customer 
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.173*/("""

"""),format.raw/*5.76*/(""" 

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*11.69*/ {_display_(Seq[Any](format.raw/*11.71*/("""
  """),format.raw/*12.3*/("""<div class="span6">

   """),_display_(/*14.5*/flash/*14.10*/.get(FKSuccess).map/*14.29*/ { message =>_display_(Seq[Any](format.raw/*14.42*/("""  """),format.raw/*14.44*/("""<div class="alert alert-success">   """),_display_(/*14.81*/message),format.raw/*14.88*/("""  """),format.raw/*14.90*/("""</.div>  """)))}),format.raw/*14.100*/("""
   """),_display_(/*15.5*/if(customerForm.hasErrors)/*15.31*/ {_display_(Seq[Any](format.raw/*15.33*/(""" """),format.raw/*15.34*/("""<div class="alert alert-error"> Oops! Please see below.  </div>  """)))}),format.raw/*15.100*/("""       
   """),_display_(/*16.5*/customerForm/*16.17*/.globalError.map/*16.33*/ { error =>_display_(Seq[Any](format.raw/*16.44*/(""" """),format.raw/*16.45*/("""<div class="alert alert-error"> """),_display_(/*16.78*/error/*16.83*/.message),format.raw/*16.91*/("""   """),format.raw/*16.94*/("""</div>  """)))}),format.raw/*16.103*/("""

  """),_display_(/*18.4*/form(routes.AdminCustomer.add(version), 'class -> "form-horizontal")/*18.72*/ {_display_(Seq[Any](format.raw/*18.74*/("""        
      """),format.raw/*19.7*/("""<!--  """),_display_(/*19.14*/inputText( customerForm("name"), 'maxlength -> "128", '_label -> "Name: *",'_showConstraints -> false)),format.raw/*19.116*/("""  """),format.raw/*19.118*/("""-->
       """),_display_(/*20.9*/userorg/*20.16*/.map/*20.20*/ {org =>_display_(Seq[Any](format.raw/*20.28*/(""" """),_display_(/*20.30*/if(org == GBName)/*20.47*/ {_display_(Seq[Any](format.raw/*20.49*/("""
	      """),_display_(/*21.9*/select(  
	          customerForm("mfr").copy(value = customerForm("mfr").value), 
	          options = options(Org.mfrs.toList),
	          '_default -> "Select a manufacturer",
	          '_label -> "Customer of: *",
	          '_error -> customerForm("mfr").error.map(_.withMessage("Please select a manufacturer")),
	          '_showConstraints -> false)),format.raw/*27.39*/("""               
        """)))}/*28.11*/else/*28.16*/{_display_(Seq[Any](format.raw/*28.17*/("""
             """),format.raw/*29.14*/("""<input type="hidden" name="mfr" value="""),_display_(/*29.53*/org),format.raw/*29.56*/(""" """),format.raw/*29.57*/("""/>   
        """)))}),format.raw/*30.10*/("""
        
      """)))}),format.raw/*32.8*/(""" 
       """),format.raw/*33.8*/("""<div class="control-group">
      <label class="control-label" for="domain_ec">End Customer: *</label>
      <div class="controls"><input type="text" id="domain_ec" name="domain.ec" value maxlength="512"><span class="help-block" style="color:red">If this is not the EC, enter the same anme as mfr selected above</span>
       </div>
      </div>      
      """),_display_(/*38.8*/inputText( customerForm("desc"), 'maxlength -> "512", '_label -> "Description: *", '_showConstraints -> false)),format.raw/*38.118*/("""
     
      """),_display_(/*40.8*/userorg/*40.15*/.map/*40.19*/ {org =>_display_(Seq[Any](format.raw/*40.27*/(""" """),_display_(/*40.29*/if(org == GBName)/*40.46*/ {_display_(Seq[Any](format.raw/*40.48*/("""
	      """),_display_(/*41.9*/select(  
	          customerForm("domain.realm").copy(value = customerForm("domain.realm").value), 
	          options = options(Org.realms.toList),
	          '_default -> "Select a Realm",
	          '_label -> "Realm: *",
	          '_error -> customerForm("domain.realm").error.map(_.withMessage("Please select a realm")),
	          '_showConstraints -> false)),format.raw/*47.39*/("""               
        """)))}/*48.11*/else/*48.16*/{_display_(Seq[Any](format.raw/*48.17*/("""
             """),format.raw/*49.14*/("""<input type="hidden" name="domain.realm" value="""),_display_(/*49.62*/org),format.raw/*49.65*/(""" """),format.raw/*49.66*/("""/>   
        """)))}),format.raw/*50.10*/("""
        
      """)))}),format.raw/*52.8*/("""
      """),_display_(/*53.8*/inputText( customerForm("domain.prod"), 'maxlength -> "512", '_label -> "Product: *", '_showConstraints -> false)),format.raw/*53.121*/("""
      """),_display_(/*54.8*/inputText( customerForm("domain.sch"), 'maxlength -> "512", '_label -> "Schema: *", '_showConstraints -> false)),format.raw/*54.119*/("""
      """),format.raw/*55.7*/("""<!-- """),_display_(/*55.13*/inputText( customerForm("domain.ec"), 'maxlength -> "512", '_label -> "End Customer: *", '_showConstraints -> false)),format.raw/*55.129*/(""" """),format.raw/*55.130*/("""-->
     
      """),_display_(/*57.8*/inputText( customerForm("domain.sso_login_url"), 'maxlength -> "512", '_label -> "SSO Login Url:", '_showConstraints -> false)),format.raw/*57.134*/("""
      """),_display_(/*58.8*/inputText( customerForm("domain.sso_logout_url"), 'maxlength -> "512", '_label -> "SSO Logout Url:", '_showConstraints -> false)),format.raw/*58.136*/("""
      """),_display_(/*59.8*/inputText( customerForm("domain.sso_roles"), 'maxlength -> "512", '_label -> "SSO Roles:", '_showConstraints -> false)),format.raw/*59.126*/("""
      """),_display_(/*60.8*/inputText( customerForm("domain.sso_idp_id"), 'maxlength -> "128", '_label -> "SSO IDP ID:",'_showConstraints -> false)),format.raw/*60.127*/("""       
     
          
    """),format.raw/*63.5*/("""<div class="form-actions">
      <input name="action" class="btn btn-primary" type="submit" value="Save">
      <a href=""""),_display_(/*65.17*/routes/*65.23*/.AdminCustomer.list(version, None)),format.raw/*65.57*/("""" class="btn">Cancel</a> 
    </div>        
  """)))}),format.raw/*67.4*/("""    
  """),format.raw/*68.3*/("""</div>
""")))}),format.raw/*69.2*/("""
"""))
      }
    }
  }

  def render(customerForm:Form[Cust],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(customerForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[Cust],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (customerForm,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(customerForm,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object add extends add_Scope0.add
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/customer/add.scala.html
                  HASH: e4e824de7b3b86b02674a7dd31b55a3c70d40bca
                  MATRIX: 603->1|886->290|898->295|978->299|1007->302|1057->212|1089->236|1170->172|1199->286|1228->321|1257->324|1333->391|1373->393|1403->396|1454->421|1468->426|1496->445|1547->458|1577->460|1641->497|1669->504|1699->506|1741->516|1772->521|1807->547|1847->549|1876->550|1974->616|2012->628|2033->640|2058->656|2107->667|2136->668|2196->701|2210->706|2239->714|2270->717|2311->726|2342->731|2419->799|2459->801|2501->816|2535->823|2659->925|2690->927|2728->939|2744->946|2757->950|2803->958|2832->960|2858->977|2898->979|2933->988|3311->1345|3355->1371|3368->1376|3407->1377|3449->1391|3515->1430|3539->1433|3568->1434|3614->1449|3661->1466|3697->1475|4082->1834|4214->1944|4254->1958|4270->1965|4283->1969|4329->1977|4358->1979|4384->1996|4424->1998|4459->2007|4846->2373|4890->2399|4903->2404|4942->2405|4984->2419|5059->2467|5083->2470|5112->2471|5158->2486|5205->2503|5239->2511|5374->2624|5408->2632|5541->2743|5575->2750|5608->2756|5746->2872|5776->2873|5819->2890|5967->3016|6001->3024|6151->3152|6185->3160|6325->3278|6359->3286|6500->3405|6556->3434|6705->3556|6720->3562|6775->3596|6853->3644|6887->3651|6925->3659
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|40->15|40->15|40->15|40->15|40->15|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|41->16|43->18|43->18|43->18|44->19|44->19|44->19|44->19|45->20|45->20|45->20|45->20|45->20|45->20|45->20|46->21|52->27|53->28|53->28|53->28|54->29|54->29|54->29|54->29|55->30|57->32|58->33|63->38|63->38|65->40|65->40|65->40|65->40|65->40|65->40|65->40|66->41|72->47|73->48|73->48|73->48|74->49|74->49|74->49|74->49|75->50|77->52|78->53|78->53|79->54|79->54|80->55|80->55|80->55|80->55|82->57|82->57|83->58|83->58|84->59|84->59|85->60|85->60|88->63|90->65|90->65|90->65|92->67|93->68|94->69
                  -- GENERATED --
              */
          