
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object clinsight_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class clinsight extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template1[String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(ctoken: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.18*/("""
"""),format.raw/*2.1*/("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Client</title>
</head>
<style>
	input[type=text], select """),format.raw/*11.27*/("""{"""),format.raw/*11.28*/("""
	  """),format.raw/*12.4*/("""width: 100%;
	  padding: 12px 20px;
	  margin: 8px 0;
	  display: inline-block;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  box-sizing: border-box;
	"""),format.raw/*19.2*/("""}"""),format.raw/*19.3*/("""

	"""),format.raw/*21.2*/("""input[type=submit] """),format.raw/*21.21*/("""{"""),format.raw/*21.22*/("""
	  """),format.raw/*22.4*/("""width: 100%;
	  background-color: #4CAF50;
	  color: white;
	  padding: 14px 20px;
	  margin: 8px 0;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	"""),format.raw/*30.2*/("""}"""),format.raw/*30.3*/("""

	"""),format.raw/*32.2*/("""input[type=submit]:hover """),format.raw/*32.27*/("""{"""),format.raw/*32.28*/("""
	  """),format.raw/*33.4*/("""background-color: #45a049;
	"""),format.raw/*34.2*/("""}"""),format.raw/*34.3*/("""

	"""),format.raw/*36.2*/("""div """),format.raw/*36.6*/("""{"""),format.raw/*36.7*/("""
	  """),format.raw/*37.4*/("""border-radius: 5px;
	  background-color: #f2f2f2;
	  padding: 20px;
	"""),format.raw/*40.2*/("""}"""),format.raw/*40.3*/("""
    """),format.raw/*41.5*/("""</style>
<body>

<div>
    <form id="myForm">
        <h2>Enter details: </h2>
        <label for="fname">First Name</label>
        <input type="text" id="fname" name="fname" placeholder="Your name..">

        <label for="lname">Last Name</label>
        <input type="text" id="lname" name="lname" placeholder="Your last name..">

        <label for="company">Company</label>
        <input type="text" id="company" name="company" placeholder="Your Company name..">

        <label for="email">Email</label>
        <input type="text" id="email" name="email" placeholder="Your Email id..">


        <input type="submit" value="Submit">
    </form>
</div>
<script>
	
	var form_el = document.getElementById("myForm");
	form_el.addEventListener("submit", function(evt) """),format.raw/*66.51*/("""{"""),format.raw/*66.52*/("""
	    """),format.raw/*67.6*/("""evt.preventDefault();
	    var fname = document.getElementById("fname").value;
	    var lname = document.getElementById("lname").value;
	    var company = document.getElementById("company").value;
	    var email = document.getElementById("email").value;
	    console.log("entered details : fname - "+fname)
	    console.log("entered details : lname - "+lname)
	    console.log("entered details : company - "+company)
	    console.log("entered details : email - "+email)
	    var url = window.location.protocol+"//"+window.location.host+"/v1/create/email"
	    postData(url, fname, lname, company, email)
	"""),format.raw/*78.2*/("""}"""),format.raw/*78.3*/(""");

	function fillArray() """),format.raw/*80.23*/("""{"""),format.raw/*80.24*/("""
	    """),format.raw/*81.6*/("""console.log("do something with "+ wordInput.value);
	"""),format.raw/*82.2*/("""}"""),format.raw/*82.3*/("""
	"""),format.raw/*83.2*/("""function postData(url, fn, ln,cmp, mail)"""),format.raw/*83.42*/("""{"""),format.raw/*83.43*/("""
		"""),format.raw/*84.3*/("""var data = new FormData();
		data.append('first_name', fn);
		data.append('last_name', ln);
		data.append('company', cmp);
		data.append('email', mail);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		var token = """"),_display_(/*91.17*/ctoken),format.raw/*91.23*/("""";
		xhr.setRequestHeader("ctoken", token);
		xhr.onload = function () """),format.raw/*93.28*/("""{"""),format.raw/*93.29*/("""
		    """),format.raw/*94.7*/("""document.getElementById("fname").value = "";
	    	    document.getElementById("lname").value = "";
	    	    document.getElementById("company").value = "";
	    	    document.getElementById("email").value = "";
		"""),format.raw/*98.3*/("""}"""),format.raw/*98.4*/(""";
		xhr.send(data);
	"""),format.raw/*100.2*/("""}"""),format.raw/*100.3*/("""	
    """),format.raw/*101.5*/("""</script>
</body>
</html>"""))
      }
    }
  }

  def render(ctoken:String): play.twirl.api.HtmlFormat.Appendable = apply(ctoken)

  def f:((String) => play.twirl.api.HtmlFormat.Appendable) = (ctoken) => apply(ctoken)

  def ref: this.type = this

}


}

/**/
object clinsight extends clinsight_Scope0.clinsight
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/clinsight.scala.html
                  HASH: 1cb903639e839e097d78a4802f8cb326d6747f7d
                  MATRIX: 535->1|646->17|673->18|916->233|945->234|976->238|1161->396|1189->397|1219->400|1266->419|1295->420|1326->424|1515->586|1543->587|1573->590|1626->615|1655->616|1686->620|1741->648|1769->649|1799->652|1830->656|1858->657|1889->661|1985->730|2013->731|2045->736|2842->1505|2871->1506|2904->1512|3536->2117|3564->2118|3618->2144|3647->2145|3680->2151|3760->2204|3788->2205|3817->2207|3885->2247|3914->2248|3944->2251|4205->2485|4232->2491|4331->2562|4360->2563|4394->2570|4635->2784|4663->2785|4712->2806|4741->2807|4775->2813
                  LINES: 20->1|25->1|26->2|35->11|35->11|36->12|43->19|43->19|45->21|45->21|45->21|46->22|54->30|54->30|56->32|56->32|56->32|57->33|58->34|58->34|60->36|60->36|60->36|61->37|64->40|64->40|65->41|90->66|90->66|91->67|102->78|102->78|104->80|104->80|105->81|106->82|106->82|107->83|107->83|107->83|108->84|115->91|115->91|117->93|117->93|118->94|122->98|122->98|124->100|124->100|125->101
                  -- GENERATED --
              */
          