
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object notFound_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class notFound extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template5[Option[String],Option[String],Option[String],constants.HttpStatus.HttpStatus,String,play.twirl.api.HtmlFormat.Appendable] {

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

"""),format.raw/*12.1*/("""<html>
  <head>
  <title> Glass Beam</title>
  
  <meta charset="utf-8">
  <meta name="description" content="Machine Data Analytics">
  
  <link rel="stylesheet" type="text/css" media="screen" href=""""),_display_(/*19.64*/routes/*19.70*/.Assets.at("stylesheets/bootstrap.min.css")),format.raw/*19.113*/(""""> 
  <link rel="stylesheet" type="text/css" media="screen" href=""""),_display_(/*20.64*/routes/*20.70*/.Assets.at("stylesheets/main.css")),format.raw/*20.104*/(""""> 
  <link rel="shortcut icon" type="image/ico" href=""""),_display_(/*21.53*/routes/*21.59*/.Assets.at("img/favicon.ico")),format.raw/*21.88*/("""" >  
  
  <style>
    body """),format.raw/*24.10*/("""{"""),format.raw/*24.11*/("""
      """),format.raw/*25.7*/("""padding-top: 40px; 
    """),format.raw/*26.5*/("""}"""),format.raw/*26.6*/("""
  """),format.raw/*27.3*/("""</style>    
  </head>

  <body>  
    <header class="navbar navbar-fixed-top">
    <div class="navbar-inner">
      <div class="container">
    </header>
    
    
    <section id="main" class="container">
   
      <header class="row page-header">
        <h1>Request Not Found</h1>
      </header>     
    
  
    <div class="row">
      	<p> """),_display_(/*45.13*/errMessage),format.raw/*45.23*/(""" """),format.raw/*45.24*/("""</p>
    </div>
    
    

  </section>

   
  </body>
</html>
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
object notFound extends notFound_Scope0.notFound
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/notFound.scala.html
                  HASH: e37c8fe792c1f30337e7cc0aee5555c55f844318
                  MATRIX: 610->1|861->259|873->264|953->268|981->271|1008->278|1041->181|1073->205|1154->140|1182->179|1210->255|1240->280|1269->282|1496->482|1511->488|1576->531|1670->598|1685->604|1741->638|1824->694|1839->700|1889->729|1945->757|1974->758|2008->765|2059->789|2087->790|2117->793|2492->1141|2523->1151|2552->1152
                  LINES: 20->1|25->8|25->8|27->8|28->9|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|44->19|44->19|44->19|45->20|45->20|45->20|46->21|46->21|46->21|49->24|49->24|50->25|51->26|51->26|52->27|70->45|70->45|70->45
                  -- GENERATED --
              */
          