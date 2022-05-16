
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object clinsightMsgInfo_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class clinsightMsgInfo extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template3[String,String,String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(level: String, msg: String, clinsightLogo: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import constants._
import constants.Page._
import play.api._
import play.api.Play.current

Seq[Any](format.raw/*1.53*/("""
"""),format.raw/*6.1*/("""<!DOCTYPE html>
<html>

<head>
    <title>Registration Form</title>
    <meta charset="UTF-8">
    <meta name="description" content="Your site's description should be here">
    <meta name="keywords" content="Your site's keywords should be here">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&amp;subset=cyrillic,cyrillic-ext,latin,latin-ext,vietnamese">
    <style>
        * """),format.raw/*19.11*/("""{"""),format.raw/*19.12*/("""
            """),format.raw/*20.13*/("""box-sizing: border-box;
        """),format.raw/*21.9*/("""}"""),format.raw/*21.10*/("""

        """),format.raw/*23.9*/("""body """),format.raw/*23.14*/("""{"""),format.raw/*23.15*/("""
            """),format.raw/*24.13*/("""font-family: Montserrat, sans-serif;
        """),format.raw/*25.9*/("""}"""),format.raw/*25.10*/("""

        """),format.raw/*27.9*/("""input[type=text], input[type=password],
        select,
        textarea """),format.raw/*29.18*/("""{"""),format.raw/*29.19*/("""
            """),format.raw/*30.13*/("""width: 100%;
            padding: 12px;
            border-radius: 0px;
            resize: vertical;
            border: 1px solid rgba(0, 0, 0, 0.09);
            margin-top: 15px;
            font-size: 13px;
        """),format.raw/*37.9*/("""}"""),format.raw/*37.10*/("""

        """),format.raw/*39.9*/("""input::placeholder """),format.raw/*39.28*/("""{"""),format.raw/*39.29*/("""
            """),format.raw/*40.13*/("""font-family: Montserrat, sans-serif;
        """),format.raw/*41.9*/("""}"""),format.raw/*41.10*/("""


        """),format.raw/*44.9*/("""input[type=text]:focus, input[type=password]:focus """),format.raw/*44.60*/("""{"""),format.raw/*44.61*/("""
            """),format.raw/*45.13*/("""border: 1px solid rgba(0,0,0,0.0);
        """),format.raw/*46.9*/("""}"""),format.raw/*46.10*/("""


        """),format.raw/*49.9*/("""label """),format.raw/*49.15*/("""{"""),format.raw/*49.16*/("""
            """),format.raw/*50.13*/("""padding: 12px 12px 12px 0;
            display: inline-block;
        """),format.raw/*52.9*/("""}"""),format.raw/*52.10*/("""

        """),format.raw/*54.9*/("""input[type=submit] """),format.raw/*54.28*/("""{"""),format.raw/*54.29*/("""
            """),format.raw/*55.13*/("""color: white;
            padding: 12px 20px;
            border: none;
            cursor: pointer;
            float: right;
            background: #01346d;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
            width: 100%;
            margin-top: 15px;
            font-weight: bold;
            font-size: 1.3rem;
            text-align: center;
            text-transform: uppercase;
            font-family: Montserrat, sans-serif;
            outline: none;
        """),format.raw/*70.9*/("""}"""),format.raw/*70.10*/("""

        """),format.raw/*72.9*/("""input[type=submit]:hover """),format.raw/*72.34*/("""{"""),format.raw/*72.35*/("""
            """),format.raw/*73.13*/("""background-color: #01346d;
        """),format.raw/*74.9*/("""}"""),format.raw/*74.10*/("""

        """),format.raw/*76.9*/(""".container """),format.raw/*76.20*/("""{"""),format.raw/*76.21*/("""
            """),format.raw/*77.13*/("""border-radius: 5px;
            padding: 20px;
            margin: 0px auto;
            /*width: 400px;*/
        """),format.raw/*81.9*/("""}"""),format.raw/*81.10*/("""

        """),format.raw/*83.9*/(""".col-25 """),format.raw/*83.17*/("""{"""),format.raw/*83.18*/("""
            """),format.raw/*84.13*/("""float: left;
            width: 25%;
            margin-top: 6px;
        """),format.raw/*87.9*/("""}"""),format.raw/*87.10*/("""

        """),format.raw/*89.9*/(""".col-75 """),format.raw/*89.17*/("""{"""),format.raw/*89.18*/("""
            """),format.raw/*90.13*/("""float: left;
            width: 75%;
            margin-top: 6px;
        """),format.raw/*93.9*/("""}"""),format.raw/*93.10*/("""

        """),format.raw/*95.9*/(""".col-100 """),format.raw/*95.18*/("""{"""),format.raw/*95.19*/("""
            """),format.raw/*96.13*/("""float: left;
            width: 100%;
            margin-top: 6px;
        """),format.raw/*99.9*/("""}"""),format.raw/*99.10*/("""

        """),format.raw/*101.9*/("""/* Clear floats after the columns */
        .row:after """),format.raw/*102.20*/("""{"""),format.raw/*102.21*/("""
            """),format.raw/*103.13*/("""content: "";
            display: table;
            clear: both;
        """),format.raw/*106.9*/("""}"""),format.raw/*106.10*/("""

        """),format.raw/*108.9*/(""".p """),format.raw/*108.12*/("""{"""),format.raw/*108.13*/("""
            """),format.raw/*109.13*/("""color: #7a7a7a;
            text-align: center;
            font-size: 12px;
            margin-top: 20px;
            line-height: 1.5;
        """),format.raw/*114.9*/("""}"""),format.raw/*114.10*/("""

        """),format.raw/*116.9*/(""".b_logo_div """),format.raw/*116.21*/("""{"""),format.raw/*116.22*/("""
            """),format.raw/*117.13*/("""text-align: left;
        """),format.raw/*118.9*/("""}"""),format.raw/*118.10*/("""

        """),format.raw/*120.9*/(""".gb_logo """),format.raw/*120.18*/("""{"""),format.raw/*120.19*/("""
            """),format.raw/*121.13*/("""width: 150px;
            object-fit: contain;
        """),format.raw/*123.9*/("""}"""),format.raw/*123.10*/("""

        """),format.raw/*125.9*/(""".form """),format.raw/*125.15*/("""{"""),format.raw/*125.16*/("""
            """),format.raw/*126.13*/("""padding-left: 30px;
            padding-right: 30px;
        """),format.raw/*128.9*/("""}"""),format.raw/*128.10*/("""

        """),format.raw/*130.9*/(""".alert """),format.raw/*130.16*/("""{"""),format.raw/*130.17*/("""
            """),format.raw/*131.13*/("""padding: 20px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
        """),format.raw/*135.9*/("""}"""),format.raw/*135.10*/("""

        """),format.raw/*137.9*/(""".alert-success """),format.raw/*137.24*/("""{"""),format.raw/*137.25*/("""
            """),format.raw/*138.13*/("""color: #3c763d;
            background-color: #dff0d8;
            border-color: #d6e9c6;
        """),format.raw/*141.9*/("""}"""),format.raw/*141.10*/("""

        """),format.raw/*143.9*/(""".alert-info """),format.raw/*143.21*/("""{"""),format.raw/*143.22*/("""
            """),format.raw/*144.13*/("""color: #31708f;
            background-color: #d9edf7;
            border-color: #bce8f1;
        """),format.raw/*147.9*/("""}"""),format.raw/*147.10*/("""

        """),format.raw/*149.9*/(""".alert-warning """),format.raw/*149.24*/("""{"""),format.raw/*149.25*/("""
            """),format.raw/*150.13*/("""color: #8a6d3b;
            background-color: #fcf8e3;
            border-color: #faebcc;
        """),format.raw/*153.9*/("""}"""),format.raw/*153.10*/("""

        """),format.raw/*155.9*/(""".alert-danger """),format.raw/*155.23*/("""{"""),format.raw/*155.24*/("""
            """),format.raw/*156.13*/("""color: #a94442;
            background-color: #f2dede;
            border-color: #ebccd1;
        """),format.raw/*159.9*/("""}"""),format.raw/*159.10*/("""

        """),format.raw/*161.9*/("""/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
        @media screen and (max-width: 600px) """),format.raw/*162.47*/("""{"""),format.raw/*162.48*/("""
            """),format.raw/*163.13*/(""".col-25,
            .col-75,
            .col-100,
            input[type=submit] """),format.raw/*166.32*/("""{"""),format.raw/*166.33*/("""
                """),format.raw/*167.17*/("""width: 100%;
                margin-top: 20;
            """),format.raw/*169.13*/("""}"""),format.raw/*169.14*/("""

            """),format.raw/*171.13*/(""".container """),format.raw/*171.24*/("""{"""),format.raw/*171.25*/("""
                """),format.raw/*172.17*/("""width: 100%;
            """),format.raw/*173.13*/("""}"""),format.raw/*173.14*/("""
        """),format.raw/*174.9*/("""}"""),format.raw/*174.10*/("""
    """),format.raw/*175.5*/("""</style>
</head>

<body>

<div class="container">
    <div class="row">
        <div class="col-100 gb_logo_div">
            <img class="gb_logo" src=""""),_display_(/*183.40*/clinsightLogo),format.raw/*183.53*/("""" alt="">
        </div>
    </div>
    <div class="msg row">
        <div class="col-100">
            """),_display_(/*188.14*/level/*188.19*/ match/*188.25*/ {/*189.13*/case "success" =>/*189.30*/ {_display_(Seq[Any](format.raw/*189.32*/("""
                """),format.raw/*190.17*/("""<div class="alert alert-success">
                    """),_display_(/*191.22*/msg),format.raw/*191.25*/("""
                """),format.raw/*192.17*/("""</div>
            """)))}/*195.13*/case "info" =>/*195.27*/ {_display_(Seq[Any](format.raw/*195.29*/("""
                """),format.raw/*196.17*/("""<div class="alert alert-info">
                    """),_display_(/*197.22*/msg),format.raw/*197.25*/("""
                """),format.raw/*198.17*/("""</div>
            """)))}/*201.13*/case "error" =>/*201.28*/ {_display_(Seq[Any](format.raw/*201.30*/("""
                """),format.raw/*202.17*/("""<div class="alert alert-danger">
                    """),_display_(/*203.22*/msg),format.raw/*203.25*/("""
                """),format.raw/*204.17*/("""</div>
            """)))}/*207.13*/case "warning" =>/*207.30*/ {_display_(Seq[Any](format.raw/*207.32*/("""
                """),format.raw/*208.17*/("""<div class="alert alert-warning">
                    """),_display_(/*209.22*/msg),format.raw/*209.25*/("""
                """),format.raw/*210.17*/("""</div>
            """)))}}),format.raw/*213.14*/("""
        """),format.raw/*214.9*/("""</div>
    </div>
</div>

</body>

</html>"""))
      }
    }
  }

  def render(level:String,msg:String,clinsightLogo:String): play.twirl.api.HtmlFormat.Appendable = apply(level,msg,clinsightLogo)

  def f:((String,String,String) => play.twirl.api.HtmlFormat.Appendable) = (level,msg,clinsightLogo) => apply(level,msg,clinsightLogo)

  def ref: this.type = this

}


}

/**/
object clinsightMsgInfo extends clinsightMsgInfo_Scope0.clinsightMsgInfo
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/clinsightMsgInfo.scala.html
                  HASH: f1633c1009033f299efbd15dfe6db5f9d40e1fa9
                  MATRIX: 563->1|798->52|825->147|1535->829|1564->830|1605->843|1664->875|1693->876|1730->886|1763->891|1792->892|1833->905|1905->950|1934->951|1971->961|2072->1034|2101->1035|2142->1048|2389->1268|2418->1269|2455->1279|2502->1298|2531->1299|2572->1312|2644->1357|2673->1358|2711->1369|2790->1420|2819->1421|2860->1434|2930->1477|2959->1478|2997->1489|3031->1495|3060->1496|3101->1509|3198->1579|3227->1580|3264->1590|3311->1609|3340->1610|3381->1623|3962->2177|3991->2178|4028->2188|4081->2213|4110->2214|4151->2227|4213->2262|4242->2263|4279->2273|4318->2284|4347->2285|4388->2298|4530->2413|4559->2414|4596->2424|4632->2432|4661->2433|4702->2446|4803->2520|4832->2521|4869->2531|4905->2539|4934->2540|4975->2553|5076->2627|5105->2628|5142->2638|5179->2647|5208->2648|5249->2661|5351->2736|5380->2737|5418->2747|5503->2803|5533->2804|5575->2817|5677->2891|5707->2892|5745->2902|5777->2905|5807->2906|5849->2919|6022->3064|6052->3065|6090->3075|6131->3087|6161->3088|6203->3101|6257->3127|6287->3128|6325->3138|6363->3147|6393->3148|6435->3161|6518->3216|6548->3217|6586->3227|6621->3233|6651->3234|6693->3247|6782->3308|6812->3309|6850->3319|6886->3326|6916->3327|6958->3340|7117->3471|7147->3472|7185->3482|7229->3497|7259->3498|7301->3511|7427->3609|7457->3610|7495->3620|7536->3632|7566->3633|7608->3646|7734->3744|7764->3745|7802->3755|7846->3770|7876->3771|7918->3784|8044->3882|8074->3883|8112->3893|8155->3907|8185->3908|8227->3921|8353->4019|8383->4020|8421->4030|8640->4221|8670->4222|8712->4235|8824->4318|8854->4319|8900->4336|8986->4393|9016->4394|9059->4408|9099->4419|9129->4420|9175->4437|9229->4462|9259->4463|9296->4472|9326->4473|9359->4478|9540->4631|9575->4644|9708->4749|9723->4754|9739->4760|9751->4775|9778->4792|9819->4794|9865->4811|9948->4866|9973->4869|10019->4886|10059->4920|10083->4934|10124->4936|10170->4953|10250->5005|10275->5008|10321->5025|10361->5059|10386->5074|10427->5076|10473->5093|10555->5147|10580->5150|10626->5167|10666->5201|10693->5218|10734->5220|10780->5237|10863->5292|10888->5295|10934->5312|10987->5347|11024->5356
                  LINES: 20->1|28->1|29->6|42->19|42->19|43->20|44->21|44->21|46->23|46->23|46->23|47->24|48->25|48->25|50->27|52->29|52->29|53->30|60->37|60->37|62->39|62->39|62->39|63->40|64->41|64->41|67->44|67->44|67->44|68->45|69->46|69->46|72->49|72->49|72->49|73->50|75->52|75->52|77->54|77->54|77->54|78->55|93->70|93->70|95->72|95->72|95->72|96->73|97->74|97->74|99->76|99->76|99->76|100->77|104->81|104->81|106->83|106->83|106->83|107->84|110->87|110->87|112->89|112->89|112->89|113->90|116->93|116->93|118->95|118->95|118->95|119->96|122->99|122->99|124->101|125->102|125->102|126->103|129->106|129->106|131->108|131->108|131->108|132->109|137->114|137->114|139->116|139->116|139->116|140->117|141->118|141->118|143->120|143->120|143->120|144->121|146->123|146->123|148->125|148->125|148->125|149->126|151->128|151->128|153->130|153->130|153->130|154->131|158->135|158->135|160->137|160->137|160->137|161->138|164->141|164->141|166->143|166->143|166->143|167->144|170->147|170->147|172->149|172->149|172->149|173->150|176->153|176->153|178->155|178->155|178->155|179->156|182->159|182->159|184->161|185->162|185->162|186->163|189->166|189->166|190->167|192->169|192->169|194->171|194->171|194->171|195->172|196->173|196->173|197->174|197->174|198->175|206->183|206->183|211->188|211->188|211->188|211->189|211->189|211->189|212->190|213->191|213->191|214->192|215->195|215->195|215->195|216->196|217->197|217->197|218->198|219->201|219->201|219->201|220->202|221->203|221->203|222->204|223->207|223->207|223->207|224->208|225->209|225->209|226->210|227->213|228->214
                  -- GENERATED --
              */
          