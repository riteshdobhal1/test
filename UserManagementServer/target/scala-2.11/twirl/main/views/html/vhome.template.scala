
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object vhome_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class vhome extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template4[Form[scala.Tuple4[String, String, Option[String], Option[String]]],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(loginForm: Form[(String, String, Option[String], Option[String])], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
import constants.Page._
def /*9.2*/title/*9.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*9.11*/("""
    """),format.raw/*10.5*/("""Home
""")))};implicit def /*7.2*/implicitFieldConstructor/*7.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.129*/("""

"""),format.raw/*6.1*/("""
"""),format.raw/*7.76*/(""" 

"""),format.raw/*11.2*/("""

"""),_display_(/*13.2*/main(None, None, None, title, false, Home)/*13.44*/ {_display_(Seq[Any](format.raw/*13.46*/("""

	"""),format.raw/*15.2*/("""<div class="span7">
	  <div class="front_page_intro">
		  <h2>Title</h2>
			<p>
				Product description
			</p>
			<p>
        Product description continued...
			</p>
		</div>
	</div>
    
	<div class="span5">
	  <div id="login_message_box">
		  """),_display_(/*29.6*/flash/*29.11*/.get(FKSuccess).map/*29.30*/ { message =>_display_(Seq[Any](format.raw/*29.43*/(""" """),format.raw/*29.44*/("""<div class="alert alert-success"> """),_display_(/*29.79*/message),format.raw/*29.86*/("""  """),format.raw/*29.88*/("""</div> """)))}),format.raw/*29.96*/("""
		  """),_display_(/*30.6*/flash/*30.11*/.get(FKError).map/*30.28*/ { message =>_display_(Seq[Any](format.raw/*30.41*/(""" """),format.raw/*30.42*/("""<div class="alert alert-error"> """),_display_(/*30.75*/message),format.raw/*30.82*/("""  """),format.raw/*30.84*/("""</div> """)))}),format.raw/*30.92*/("""
	  """),format.raw/*31.4*/("""</div>

	  <div id="login_box">		  		  
  		<div id="sign_in_form">	  
	  	  """),_display_(/*35.8*/helper/*35.14*/.form(action = routes.Application.login(version), 'class -> "form-horizontal", 'id -> "form_login", 'autocomplete->"on")/*35.134*/ {_display_(Seq[Any](format.raw/*35.136*/("""
    			"""),_display_(/*36.9*/loginForm/*36.18*/.globalError.map/*36.34*/ { error =>_display_(Seq[Any](format.raw/*36.45*/(""" """),format.raw/*36.46*/("""<div class="alert alert-error">"""),_display_(/*36.78*/error/*36.83*/.message),format.raw/*36.91*/("""	"""),format.raw/*36.92*/("""</div> """)))}),format.raw/*36.100*/("""
    			"""),_display_(/*37.9*/flash/*37.14*/.get(FKRedirect).map/*37.34*/ { uri =>_display_(Seq[Any](format.raw/*37.43*/(""" 
    			  """),format.raw/*38.10*/("""<div class="alert alert-info"> 			
	    		    You requested access to a page available to signed-in members only. Please sign in. 
	    		  </div> 
		    	  <input type="hidden" name="redirectURI" value="""),_display_(/*41.57*/uri),format.raw/*41.60*/(""" """),format.raw/*41.61*/("""/>
			    """)))}),format.raw/*42.9*/("""		
    			"""),_display_(/*43.9*/loginForm/*43.18*/.data.get("redirectURI").map/*43.46*/ { uri =>_display_(Seq[Any](format.raw/*43.55*/(""" 
	    		  """),format.raw/*44.10*/("""<input type="hidden" name="redirectURI" value="""),_display_(/*44.57*/uri),format.raw/*44.60*/(""" """),format.raw/*44.61*/("""/>			
		    	""")))}),format.raw/*45.9*/("""
			    """),_display_(/*46.9*/inputText( loginForm("email"), 'class -> "input-large", 'maxlength -> "128",  
				  		'_label -> "Email:", '_showConstraints -> false)),format.raw/*47.57*/("""							
  			  """),_display_(/*48.9*/inputPassword(loginForm("password"), 'class -> "input-large", 'maxlength -> "16",
					  	'_label -> "Password:",
					  	'_error -> loginForm("password").error.map(_.withMessage("Correct password required")),
					  	'_showConstraints -> false)),format.raw/*51.36*/("""
  			  """),format.raw/*52.8*/("""<div class="form-actions">
	  			  <input class="btn btn-large btn-primary" type="submit" value="Sign in" >
		  		  <a  class="forgot-password-link" href="#">Forgot password?</a>			
			    </div>		
		    """)))}),format.raw/*56.8*/("""
		  """),format.raw/*57.5*/("""</div>
						
	  </div>
  </div>
""")))}),format.raw/*61.2*/("""
"""))
      }
    }
  }

  def render(loginForm:Form[scala.Tuple4[String, String, Option[String], Option[String]]],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(loginForm,version)(flash,messages)

  def f:((Form[scala.Tuple4[String, String, Option[String], Option[String]]],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (loginForm,version) => (flash,messages) => apply(loginForm,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object vhome extends vhome_Scope0.vhome
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/vhome.scala.html
                  HASH: 753c5ad10e17e9d48e180badb91f82e46158ae0b
                  MATRIX: 609->1|872->272|884->277|964->281|996->286|1033->194|1065->218|1146->128|1174->192|1202->268|1232->292|1261->295|1312->337|1352->339|1382->342|1656->590|1670->595|1698->614|1749->627|1778->628|1840->663|1868->670|1898->672|1937->680|1969->686|1983->691|2009->708|2060->721|2089->722|2149->755|2177->762|2207->764|2246->772|2277->776|2381->854|2396->860|2526->980|2567->982|2602->991|2620->1000|2645->1016|2694->1027|2723->1028|2782->1060|2796->1065|2825->1073|2854->1074|2894->1082|2929->1091|2943->1096|2972->1116|3019->1125|3058->1136|3289->1340|3313->1343|3342->1344|3383->1355|3420->1366|3438->1375|3475->1403|3522->1412|3561->1423|3635->1470|3659->1473|3688->1474|3732->1488|3767->1497|3923->1632|3965->1648|4231->1893|4266->1901|4501->2106|4533->2111|4597->2145
                  LINES: 20->1|26->9|26->9|28->9|29->10|30->7|30->7|31->1|33->6|34->7|36->11|38->13|38->13|38->13|40->15|54->29|54->29|54->29|54->29|54->29|54->29|54->29|54->29|54->29|55->30|55->30|55->30|55->30|55->30|55->30|55->30|55->30|55->30|56->31|60->35|60->35|60->35|60->35|61->36|61->36|61->36|61->36|61->36|61->36|61->36|61->36|61->36|61->36|62->37|62->37|62->37|62->37|63->38|66->41|66->41|66->41|67->42|68->43|68->43|68->43|68->43|69->44|69->44|69->44|69->44|70->45|71->46|72->47|73->48|76->51|77->52|81->56|82->57|86->61
                  -- GENERATED --
              */
          