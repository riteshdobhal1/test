
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object main_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class main extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template8[Option[String],Option[String],Option[String],Html,Boolean,constants.Page.Page,Html,Html,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(username: Option[String], userorg: Option[String], userrole: Option[String], pageTitle: Html, showTitle: Boolean, activePage: constants.Page.Page, customScript:Html = Html(""))(content: Html):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.194*/("""

"""),format.raw/*7.1*/("""
"""),format.raw/*8.1*/("""<!DOCTYPE html>

<html>
  <head>
  <title>"""),_display_(/*12.11*/pageTitle),format.raw/*12.20*/(""" """),format.raw/*12.21*/("""| Glass Beam</title>
  
  <meta charset="utf-8">
  <meta name="description" content="Machine Data Analytics">
  
  <link rel="stylesheet" type="text/css" media="screen" href=""""),_display_(/*17.64*/routes/*17.70*/.Assets.at("stylesheets/bootstrap.min.css")),format.raw/*17.113*/(""""> 
  <link rel="stylesheet" type="text/css" media="screen" href=""""),_display_(/*18.64*/routes/*18.70*/.Assets.at("stylesheets/main.css")),format.raw/*18.104*/(""""> 
  <link rel="shortcut icon" type="image/ico" href=""""),_display_(/*19.53*/routes/*19.59*/.Assets.at("img/favicon.ico")),format.raw/*19.88*/("""" >  
  
  <style>
    body """),format.raw/*22.10*/("""{"""),format.raw/*22.11*/("""
      """),format.raw/*23.7*/("""padding-top: 40px; 
    """),format.raw/*24.5*/("""}"""),format.raw/*24.6*/("""
  """),format.raw/*25.3*/("""</style>    
  </head>

  <body>  
    <header class="navbar navbar-fixed-top">
    <div class="navbar-inner">
      <div class="container">
      
      <!--  <a class="brand" href="/">"""),_display_(/*33.40*/if(Play.isProd)/*33.55*/ {_display_(_display_(/*33.58*/SiteName))}/*33.68*/else/*33.73*/{_display_(Seq[Any](_display_(/*33.75*/SiteName),format.raw/*33.83*/(""" """),format.raw/*33.84*/("""(Dev)""")))}),format.raw/*33.90*/("""</a> --> 
      <a class="brand" href="www.glassbeam.com">"""),_display_(/*34.50*/SiteName),format.raw/*34.58*/("""</a>
      <ul class="nav">
        <li """),_display_(/*36.14*/if(activePage == Home)/*36.36*/ {_display_(Seq[Any](format.raw/*36.38*/("""class="active"""")))}),format.raw/*36.53*/(""" """),format.raw/*36.54*/("""><a href="/">Home</a></li>
        """),_display_(/*37.10*/username/*37.18*/.map/*37.22*/ { name =>_display_(Seq[Any](format.raw/*37.32*/("""
          """),format.raw/*38.11*/("""<li """),_display_(/*38.16*/if(activePage == Admin)/*38.39*/ {_display_(Seq[Any](format.raw/*38.41*/("""class="dropdown active"""")))}/*38.66*/else/*38.71*/{_display_(Seq[Any](format.raw/*38.72*/("""class="dropdown"""")))}),format.raw/*38.89*/(""">
            <a id="adminDrpDown" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a>
            <ul class="dropdown-menu" role="menu" aria-labelledby="adminDrpDown">
              """),_display_(/*41.16*/userorg/*41.23*/.map/*41.27*/ {org =>_display_(Seq[Any](format.raw/*41.35*/(""" """),_display_(/*41.37*/if(org == GBName)/*41.54*/ {_display_(Seq[Any](format.raw/*41.56*/("""            
	      	"""),_display_(/*42.10*/userrole/*42.18*/.map/*42.22*/ {role =>_display_(Seq[Any](format.raw/*42.31*/(""" """),_display_(/*42.33*/if(role == URAdmin)/*42.52*/ {_display_(Seq[Any](format.raw/*42.54*/("""
              	"""),format.raw/*43.16*/("""<li><a tabindex="-1" href=""""),_display_(/*43.44*/routes/*43.50*/.AdminMfr.addForm("v1")),format.raw/*43.73*/("""">Add a Manufacturer</a></li>
              	<li><a tabindex="-1" href=""""),_display_(/*44.44*/routes/*44.50*/.AdminMfr.list("v1", None)),format.raw/*44.76*/("""">View Manufacturers</a></li>
	      	<li class="divider"></li>
	      	<li><a tabindex="-1" href=""""),_display_(/*46.37*/routes/*46.43*/.AdminCustomer.addForm("v1")),format.raw/*46.71*/("""">Add a Customer</a></li>
              <li><a tabindex="-1" href=""""),_display_(/*47.43*/routes/*47.49*/.AdminCustomer.list("v1", None)),format.raw/*47.80*/("""">View Customers</a></li>
              <li class="divider"></li>
              	
	      	""")))})))}),format.raw/*50.11*/("""
	      """)))})))}),format.raw/*51.10*/("""
              """),format.raw/*52.15*/("""<li><a tabindex="-1" href=""""),_display_(/*52.43*/routes/*52.49*/.AdminRole.addForm("v1")),format.raw/*52.73*/("""">Add a Role</a></li>
              	<li><a tabindex="-1" href=""""),_display_(/*53.44*/routes/*53.50*/.AdminRole.list("v1")),format.raw/*53.71*/("""">View Roles</a></li>
              	<li class="divider"></li>
               <li><a tabindex="-1" href=""""),_display_(/*55.44*/routes/*55.50*/.AdminUser.addForm("v1")),format.raw/*55.74*/("""">Add a User</a></li>
              <li><a tabindex="-1" href=""""),_display_(/*56.43*/routes/*56.49*/.AdminUser.list("v1")),format.raw/*56.70*/("""">View Users</a></li>
            </ul>
          </li>
          <!--  <li """),_display_(/*59.22*/if(activePage == Basic)/*59.45*/ {_display_(Seq[Any](format.raw/*59.47*/("""class="active"""")))}),format.raw/*59.62*/(""" """),format.raw/*59.63*/("""><a href="#">Basic</a></li>
          <li """),_display_(/*60.16*/if(activePage == Advanced)/*60.42*/ {_display_(Seq[Any](format.raw/*60.44*/("""class="active"""")))}),format.raw/*60.59*/(""" """),format.raw/*60.60*/("""><a href="#">Advanced</a></li> -->
        """)))}),format.raw/*61.10*/("""
      """),format.raw/*62.7*/("""</ul>                 
          
        """),_display_(/*64.10*/username/*64.18*/.map/*64.22*/ { name =>_display_(Seq[Any](format.raw/*64.32*/("""
        """),format.raw/*65.9*/("""<ul class="nav pull-right">
        <li class="dropdown">
          <a href="#" """),_display_(/*67.24*/if(activePage == Account)/*67.49*/ {_display_(Seq[Any](format.raw/*67.51*/("""class="active dropdown-toggle"""")))}/*67.83*/else/*67.88*/{_display_(Seq[Any](format.raw/*67.89*/("""class="dropdown-toggle"""")))}),format.raw/*67.113*/("""
                """),format.raw/*68.17*/("""data-toggle="dropdown">Hi """),_display_(/*68.44*/name),format.raw/*68.48*/(""" """),format.raw/*68.49*/("""<b class="caret"></b></a>
                
          <ul class="dropdown-menu">
            <li><a href="#">Change password</a></li>             
            <li><a href="#">Update profile</a></li>
            <li><a href="#">Update settings</a></li>             
            <li class="divider"></li>
            <li><a href=""""),_display_(/*75.27*/routes/*75.33*/.Application.logout("v1", None, None)),format.raw/*75.70*/("""">Sign out</a></li>
          </ul>
        </li>
        </ul>
        """)))}),format.raw/*79.10*/("""
      """),format.raw/*80.7*/("""</div>
    </div>
    </header>
    
  <section id="main" class="container">
    """),_display_(/*85.6*/if(showTitle)/*85.19*/ {_display_(Seq[Any](format.raw/*85.21*/("""
      """),format.raw/*86.7*/("""<header class="row page-header">
        <h1>"""),_display_(/*87.14*/pageTitle),format.raw/*87.23*/("""</h1>
      </header>     
    """)))}),format.raw/*89.6*/("""
  
    """),format.raw/*91.5*/("""<div class="row">
      """),_display_(/*92.8*/content),format.raw/*92.15*/("""
    """),format.raw/*93.5*/("""</div>
    
    <footer id="site_footer" class="row">
      <nav id="footer_navbar">
       <ul>
        <li> <a href="#">About </a> </li>
        <li> <a href="#">FAQ</a> </li>
        <li> <a href="#">Terms </a> </li>
        <li> <a href="#">Privacy Policy</a> </li>
        <li> <a href="#">Contact Us</a> </li>
       </ul>
      </nav>
      
      <p id="copyright" itemscope itemtype="http://data-vocabulary.org/Organization">
        Copyright &copy;
        <span itemprop="copyrightYear">2012</span>
        <span itemprop="copyrightHolder">"""),_display_(/*109.43*/CompanyName),format.raw/*109.54*/("""</span>.
        <span>All trademarks and copyrights are the property of their respective owners.</span>
      </p>
    </footer>

  </section>

  <!-- Le javascript
  ================================================== -->
  <!-- Placed at the end of the document so the pages load faster -->
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script type="text/javascript">
    if (typeof jQuery == 'undefined') """),format.raw/*121.39*/("""{"""),format.raw/*121.40*/("""
      """),format.raw/*122.7*/("""document.write(unescape("%3Cscript src='"""),_display_(/*122.48*/routes/*122.54*/.Assets.at("javascripts/jquery-1.7.1.min.js")),format.raw/*122.99*/("""' type='text/javascript'%3E%3C/script%3E")); 
        """),format.raw/*123.9*/("""}"""),format.raw/*123.10*/("""
  """),format.raw/*124.3*/("""</script>
  <script src=""""),_display_(/*125.17*/routes/*125.23*/.Assets.at("javascripts/bootstrap.min.js")),format.raw/*125.65*/("""" type="text/javascript"></script>
  """),_display_(/*126.4*/customScript),format.raw/*126.16*/(""" 
  
  """),format.raw/*128.3*/("""</body>
</html>
"""))
      }
    }
  }

  def render(username:Option[String],userorg:Option[String],userrole:Option[String],pageTitle:Html,showTitle:Boolean,activePage:constants.Page.Page,customScript:Html,content:Html): play.twirl.api.HtmlFormat.Appendable = apply(username,userorg,userrole,pageTitle,showTitle,activePage,customScript)(content)

  def f:((Option[String],Option[String],Option[String],Html,Boolean,constants.Page.Page,Html) => (Html) => play.twirl.api.HtmlFormat.Appendable) = (username,userorg,userrole,pageTitle,showTitle,activePage,customScript) => (content) => apply(username,userorg,userrole,pageTitle,showTitle,activePage,customScript)(content)

  def ref: this.type = this

}


}

/**/
object main extends main_Scope0.main
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:27 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/main.scala.html
                  HASH: 132e16d393942853b081c91bc3f5fbe6845c0d79
                  MATRIX: 606->1|983->193|1011->289|1038->290|1108->333|1138->342|1167->343|1370->519|1385->525|1450->568|1544->635|1559->641|1615->675|1698->731|1713->737|1763->766|1819->794|1848->795|1882->802|1933->826|1961->827|1991->830|2205->1017|2229->1032|2260->1035|2280->1045|2293->1050|2332->1052|2361->1060|2390->1061|2427->1067|2513->1126|2542->1134|2610->1175|2641->1197|2681->1199|2727->1214|2756->1215|2819->1251|2836->1259|2849->1263|2897->1273|2936->1284|2968->1289|3000->1312|3040->1314|3083->1339|3096->1344|3135->1345|3183->1362|3444->1596|3460->1603|3473->1607|3519->1615|3548->1617|3574->1634|3614->1636|3663->1658|3680->1666|3693->1670|3740->1679|3769->1681|3797->1700|3837->1702|3881->1718|3936->1746|3951->1752|3995->1775|4095->1848|4110->1854|4157->1880|4284->1980|4299->1986|4348->2014|4443->2082|4458->2088|4510->2119|4636->2211|4680->2221|4723->2236|4778->2264|4793->2270|4838->2294|4930->2359|4945->2365|4987->2386|5120->2492|5135->2498|5180->2522|5271->2586|5286->2592|5328->2613|5432->2690|5464->2713|5504->2715|5550->2730|5579->2731|5649->2774|5684->2800|5724->2802|5770->2817|5799->2818|5874->2862|5908->2869|5978->2912|5995->2920|6008->2924|6056->2934|6092->2943|6200->3024|6234->3049|6274->3051|6324->3083|6337->3088|6376->3089|6432->3113|6477->3130|6531->3157|6556->3161|6585->3162|6940->3490|6955->3496|7013->3533|7117->3606|7151->3613|7259->3695|7281->3708|7321->3710|7355->3717|7428->3763|7458->3772|7520->3804|7555->3812|7606->3837|7634->3844|7666->3849|8247->4402|8280->4413|8787->4891|8817->4892|8852->4899|8921->4940|8937->4946|9004->4991|9086->5045|9116->5046|9147->5049|9201->5075|9217->5081|9281->5123|9346->5161|9380->5173|9415->5180
                  LINES: 20->1|28->1|30->7|31->8|35->12|35->12|35->12|40->17|40->17|40->17|41->18|41->18|41->18|42->19|42->19|42->19|45->22|45->22|46->23|47->24|47->24|48->25|56->33|56->33|56->33|56->33|56->33|56->33|56->33|56->33|56->33|57->34|57->34|59->36|59->36|59->36|59->36|59->36|60->37|60->37|60->37|60->37|61->38|61->38|61->38|61->38|61->38|61->38|61->38|61->38|64->41|64->41|64->41|64->41|64->41|64->41|64->41|65->42|65->42|65->42|65->42|65->42|65->42|65->42|66->43|66->43|66->43|66->43|67->44|67->44|67->44|69->46|69->46|69->46|70->47|70->47|70->47|73->50|74->51|75->52|75->52|75->52|75->52|76->53|76->53|76->53|78->55|78->55|78->55|79->56|79->56|79->56|82->59|82->59|82->59|82->59|82->59|83->60|83->60|83->60|83->60|83->60|84->61|85->62|87->64|87->64|87->64|87->64|88->65|90->67|90->67|90->67|90->67|90->67|90->67|90->67|91->68|91->68|91->68|91->68|98->75|98->75|98->75|102->79|103->80|108->85|108->85|108->85|109->86|110->87|110->87|112->89|114->91|115->92|115->92|116->93|132->109|132->109|144->121|144->121|145->122|145->122|145->122|145->122|146->123|146->123|147->124|148->125|148->125|148->125|149->126|149->126|151->128
                  -- GENERATED --
              */
          