
package views.html.user

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

class add extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template9[Form[UserWithPasswd],IndexedSeq[String],Set[String],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(addUserForm: Form[UserWithPasswd], orgs: IndexedSeq[String], roles: Set[String], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*7.2*/title/*7.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*7.11*/("""
  """),format.raw/*8.3*/("""Add New User 
""")))};implicit def /*5.2*/implicitFieldConstructor/*5.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.228*/("""

"""),format.raw/*5.76*/(""" 

"""),format.raw/*9.2*/("""

"""),_display_(/*11.2*/main(signedInUserName,  userorg, userrole, title, true, Page.Admin)/*11.69*/ {_display_(Seq[Any](format.raw/*11.71*/("""
  """),format.raw/*12.3*/("""<div class="span6">

   """),_display_(/*14.5*/flash/*14.10*/.get(FKSuccess).map/*14.29*/ { message =>_display_(Seq[Any](format.raw/*14.42*/("""  """),format.raw/*14.44*/("""<div class="alert alert-success">   """),_display_(/*14.81*/message),format.raw/*14.88*/("""  """),format.raw/*14.90*/("""</div>  """)))}),format.raw/*14.99*/("""
   
   """),_display_(/*16.5*/if(addUserForm.hasErrors)/*16.30*/ {_display_(Seq[Any](format.raw/*16.32*/(""" """),format.raw/*16.33*/("""<div class="alert alert-error"> Oops! Please see below. </div> """)))}),format.raw/*16.97*/("""       
   """),_display_(/*17.5*/addUserForm/*17.16*/.globalError.map/*17.32*/ { error =>_display_(Seq[Any](format.raw/*17.43*/(""" """),format.raw/*17.44*/("""<div class="alert alert-error"> """),_display_(/*17.77*/error/*17.82*/.message),format.raw/*17.90*/("""   """),format.raw/*17.93*/("""</div>  """)))}),format.raw/*17.102*/("""

   """),_display_(/*19.5*/form(routes.AdminUser.add("v1"), 'class -> "form-horizontal")/*19.66*/ {_display_(Seq[Any](format.raw/*19.68*/("""        
      """),_display_(/*20.8*/inputText( addUserForm("first_name"), 'maxlength -> "128", '_label -> "First Name: *",'_showConstraints -> false)),format.raw/*20.121*/("""   
      """),_display_(/*21.8*/inputText( addUserForm("last_name"), 'maxlength -> "128", '_label -> "Last Name: *",'_showConstraints -> false)),format.raw/*21.119*/("""       
      """),_display_(/*22.8*/inputText( addUserForm("emails.main"), 'maxlength -> "128", '_label -> "Email: *", '_showConstraints -> false)),format.raw/*22.118*/("""     
      """),_display_(/*23.8*/inputText( addUserForm("emails.confirm"), 'maxlength -> "128", '_label -> "Re-enter Email: *",
        '_showConstraints -> false, 
        '_error -> addUserForm.error("emails"))),format.raw/*25.48*/("""
      """),_display_(/*26.8*/inputText( addUserForm("phone"), 'maxlength -> "20", '_label -> "Phone:",'_showConstraints -> false)),format.raw/*26.108*/("""
     """),format.raw/*27.6*/("""<!-- """),_display_(/*27.12*/checkbox( addUserForm("def_passwd"),  '_label -> "Default Password:", 'checked -> "checked" ,'_showConstraints -> false)),format.raw/*27.132*/(""" 
      """),_display_(/*28.8*/inputText( addUserForm("passwords.main"), 'maxlength -> "128", '_label -> "Password:", '_showConstraints -> false,
        '_error -> addUserForm("passwords.main").error.map(_.withMessage("Password required")))),format.raw/*29.96*/("""     
      """),_display_(/*30.8*/inputText( addUserForm("passwords.confirm"), 'maxlength -> "128", '_label -> "Re-enter Password:",
        '_showConstraints -> false, 
        '_error -> addUserForm.error("passwords"))),format.raw/*32.51*/("""-->
        
      """),_display_(/*34.8*/inputText( addUserForm("department"), 'maxlength -> "128", '_label -> "Department:",'_showConstraints -> false)),format.raw/*34.119*/("""   
      """),_display_(/*35.8*/inputText( addUserForm("state"), 'maxlength -> "128", '_label -> "State: *",'_showConstraints -> false)),format.raw/*35.111*/("""   
       """),_display_(/*36.9*/inputText( addUserForm("city"), 'maxlength -> "128", '_label -> "City: *",'_showConstraints -> false)),format.raw/*36.110*/("""   
      """),_display_(/*37.8*/inputText( addUserForm("country"), 'maxlength -> "128", '_label -> "Country: *",'_showConstraints -> false)),format.raw/*37.115*/("""   
   
      """),_display_(/*39.8*/select(addUserForm("org"),	 
        options(orgs.toList),
        '_default -> "Select the user's company",
        '_label -> "Company: *",
        '_error -> addUserForm("org").error.map(_.withMessage("Please select a company")),
        '_showConstraints -> false          
        )),format.raw/*45.10*/("""
      """),_display_(/*46.8*/select(addUserForm("role"), 
        options(roles.toList),
        '_default -> "Select the user's role",
        '_label -> "Role: *",
        '_error -> addUserForm("role").error.map(_.withMessage("Please select a role")),
        '_showConstraints -> false          
        )),format.raw/*52.10*/(""" 
      """),_display_(/*53.8*/select( addUserForm("realm_def").copy(value = addUserForm("realm_def").value), 
	          options = options(Org.realms.toList),
	          '_default -> "Select a Realm",
	          '_label -> "Default Realm: *",
	          '_error -> addUserForm("realm_def").error.map(_.withMessage("Please select a default realm")),
	          '_showConstraints -> false)),format.raw/*58.39*/("""               

      """),_display_(/*60.8*/inputText( addUserForm("url_def"), 'maxlength -> "512", '_label -> "Default Url: *",'_showConstraints -> false)),format.raw/*60.119*/(""" 
      """),_display_(/*61.8*/inputText( addUserForm("mps_def"), 'maxlength -> "128", '_label -> "Default MPS: *",'_showConstraints -> false)),format.raw/*61.119*/("""
      """),_display_(/*62.8*/checkbox( addUserForm("dashboard_admin"),  '_label -> "Dashboard Admin:", '_showConstraints -> false)),format.raw/*62.109*/(""" 
      """),_display_(/*63.8*/checkbox( addUserForm("is_prospect"),  '_label -> "Is Prospect:", '_showConstraints -> false)),format.raw/*63.101*/("""    
      """),_display_(/*64.8*/checkbox( addUserForm("sso"),  '_label -> "SSO:", 'checked -> "checked" ,'_showConstraints -> false)),format.raw/*64.108*/(""" 
      """),_display_(/*65.8*/checkbox( addUserForm("report_usage"),  '_label -> "Report Usage:", 'checked -> "checked",'_showConstraints -> false )),format.raw/*65.126*/("""   
      """),_display_(/*66.8*/inputText( addUserForm("wb_user_name"), 'maxlength -> "128", '_label -> "Wb User Name: *",'_showConstraints -> false)),format.raw/*66.125*/("""   
     """),format.raw/*67.6*/("""<!--  """),_display_(/*67.13*/checkbox( addUserForm("active"),  '_label -> "Is Active:",'_showConstraints -> false, 'checked -> "checked" ,'_showConstraints -> false)),format.raw/*67.149*/(""" """),format.raw/*67.150*/("""-->
         
     
      <div class="form-actions">
        <input name="action" class="btn btn-primary" type="submit" value="Save">
        <a href=""""),_display_(/*72.19*/routes/*72.25*/.AdminUser.list("v1")),format.raw/*72.46*/("""" class="btn">Cancel</a> 
      </div>
    """)))}),format.raw/*74.6*/("""            
  """),format.raw/*75.3*/("""</div>
""")))}),format.raw/*76.2*/("""
"""))
      }
    }
  }

  def render(addUserForm:Form[UserWithPasswd],orgs:IndexedSeq[String],roles:Set[String],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(addUserForm,orgs,roles,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((Form[UserWithPasswd],IndexedSeq[String],Set[String],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (addUserForm,orgs,roles,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(addUserForm,orgs,roles,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object add extends add_Scope0.add
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/user/add.scala.html
                  HASH: 3f45b1492f8ebbf4957c490df1f7bab990e89d51
                  MATRIX: 640->1|978->345|990->350|1070->354|1099->357|1145->267|1177->291|1258->227|1287->341|1316->372|1345->375|1421->442|1461->444|1491->447|1542->472|1556->477|1584->496|1635->509|1665->511|1729->548|1757->555|1787->557|1827->566|1862->575|1896->600|1936->602|1965->603|2060->667|2098->679|2118->690|2143->706|2192->717|2221->718|2281->751|2295->756|2324->764|2355->767|2396->776|2428->782|2498->843|2538->845|2580->861|2715->974|2752->985|2885->1096|2926->1111|3058->1221|3097->1234|3297->1413|3331->1421|3453->1521|3486->1527|3519->1533|3661->1653|3696->1662|3927->1872|3966->1885|4173->2071|4219->2091|4352->2202|4389->2213|4514->2316|4552->2328|4675->2429|4712->2440|4841->2547|4882->2562|5190->2849|5224->2857|5525->3137|5560->3146|5938->3503|5988->3527|6121->3638|6156->3647|6289->3758|6323->3766|6446->3867|6481->3876|6596->3969|6634->3981|6756->4081|6791->4090|6931->4208|6968->4219|7107->4336|7143->4345|7177->4352|7335->4488|7365->4489|7544->4641|7559->4647|7601->4668|7675->4712|7717->4727|7755->4735
                  LINES: 20->1|25->7|25->7|27->7|28->8|29->5|29->5|30->1|32->5|34->9|36->11|36->11|36->11|37->12|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|39->14|41->16|41->16|41->16|41->16|41->16|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|42->17|44->19|44->19|44->19|45->20|45->20|46->21|46->21|47->22|47->22|48->23|50->25|51->26|51->26|52->27|52->27|52->27|53->28|54->29|55->30|57->32|59->34|59->34|60->35|60->35|61->36|61->36|62->37|62->37|64->39|70->45|71->46|77->52|78->53|83->58|85->60|85->60|86->61|86->61|87->62|87->62|88->63|88->63|89->64|89->64|90->65|90->65|91->66|91->66|92->67|92->67|92->67|92->67|97->72|97->72|97->72|99->74|100->75|101->76
                  -- GENERATED --
              */
          