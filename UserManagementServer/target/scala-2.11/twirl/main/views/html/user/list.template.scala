
package views.html.user

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object list_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class list extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template7[IndexedSeq[User],Option[String],Option[String],Option[String],String,Flash,Messages,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(ul: IndexedSeq[User], signedInUserName: Option[String], userorg: Option[String], userrole: Option[String], version: String)(implicit flash: Flash, messages: Messages):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {
import helper._
import constants._
def /*8.2*/title/*8.7*/:play.twirl.api.HtmlFormat.Appendable = {_display_(

Seq[Any](format.raw/*8.11*/("""
  """),format.raw/*9.3*/("""Users 
""")))};implicit def /*6.2*/implicitFieldConstructor/*6.26*/ = {{ FieldConstructor(twitterBootstrap2Input.f) }};
Seq[Any](format.raw/*1.169*/("""

"""),format.raw/*5.1*/("""
"""),format.raw/*6.76*/(""" 

"""),format.raw/*10.2*/("""

"""),_display_(/*12.2*/main(signedInUserName, userorg, userrole, title, true, Page.Admin)/*12.68*/ {_display_(Seq[Any](format.raw/*12.70*/("""
  
  """),format.raw/*14.3*/("""<div class="span12">
  """),_display_(/*15.4*/userorg/*15.11*/.map/*15.15*/ {org =>_display_(Seq[Any](format.raw/*15.23*/(""" """),_display_(/*15.25*/if(org == GBName)/*15.42*/ {_display_(Seq[Any](format.raw/*15.44*/("""
          """),format.raw/*16.11*/("""<select id="drop" name="mfrDrop">
            <option value="">Select a manufacturer.. </option>
            <option value=""""),_display_(/*18.29*/routes/*18.35*/.AdminUser.listByOrg(version, "all")),format.raw/*18.71*/("""">All</option>
            """),_display_(/*19.14*/Org/*19.17*/.mfrs.toList.map/*19.33*/ { m=>_display_(Seq[Any](format.raw/*19.39*/(""" 
              """),format.raw/*20.15*/("""<option value=""""),_display_(/*20.31*/routes/*20.37*/.AdminUser.listByOrg(version, m)),format.raw/*20.69*/("""">"""),_display_(/*20.72*/m/*20.73*/.toString),format.raw/*20.82*/("""</option>
            """)))}),format.raw/*21.14*/("""
          """),format.raw/*22.11*/("""</select>
          <a href="#" id="goBtn" class="btn btn-primary" style="margin-bottom:10px">Go</a> 
          <a href="#" id="selectAllUsersBtn" class="btn btn-primary" style="margin-bottom:10px">Select All Users</a>
          <a id="editUsersBtn" class="btn btn-primary" style="margin-bottom:10px">Edit Users</a>
          <script src=""""),_display_(/*26.25*/routes/*26.31*/.Assets.at("javascripts/jquery-1.7.1.min.js")),format.raw/*26.76*/(""""></script> 
          <script>
            $(document).on('change', '#drop', function()"""),format.raw/*28.57*/("""{"""),format.raw/*28.58*/("""
              """),format.raw/*29.15*/("""$('#goBtn').attr('href', $(this).val());
            """),format.raw/*30.13*/("""}"""),format.raw/*30.14*/(""");
            $(document).ready(function()"""),format.raw/*31.41*/("""{"""),format.raw/*31.42*/("""
                """),format.raw/*32.17*/("""var mfr= $(location).attr('href').split("/")[$(location).attr('href').split("/").length - 1]
                if(mfr!="list")"""),format.raw/*33.32*/("""{"""),format.raw/*33.33*/("""
                	"""),format.raw/*34.18*/("""$('#drop').val("/v1/admin/user/list/" + mfr)
                    """),format.raw/*35.21*/("""}"""),format.raw/*35.22*/("""
                """),format.raw/*36.17*/("""if(mfr=="list")"""),format.raw/*36.32*/("""{"""),format.raw/*36.33*/("""
                	"""),format.raw/*37.18*/("""$('#drop').val("/v1/admin/user/list/all")
                """),format.raw/*38.17*/("""}"""),format.raw/*38.18*/("""
                """),format.raw/*39.17*/("""if(mfr=="all" || mfr=="list" || mfr =="")"""),format.raw/*39.58*/("""{"""),format.raw/*39.59*/("""
                    """),format.raw/*40.21*/("""$('#editUsersBtn').hide()
                    $('#selectAllUsersBtn').hide()
                    $("input:checkbox").hide() 
                """),format.raw/*43.17*/("""}"""),format.raw/*43.18*/("""
                

            """),format.raw/*46.13*/("""}"""),format.raw/*46.14*/(""");
            var emailArr = [] ;
            $('#editUsersBtn').click(function()"""),format.raw/*48.48*/("""{"""),format.raw/*48.49*/("""
                
                """),format.raw/*50.17*/("""$("input:checkbox[class=checkbox]:checked").each(function()"""),format.raw/*50.76*/("""{"""),format.raw/*50.77*/("""
                	"""),format.raw/*51.18*/("""emailArr.push($(this).val())
                """),format.raw/*52.17*/("""}"""),format.raw/*52.18*/(""");
                var emailString = emailArr.join(",");
                var mfrLink = $('#drop').val();
                var mfr = mfrLink.split("/")[mfrLink.split("/").length - 1];
                if(mfr=="list")"""),format.raw/*56.32*/("""{"""),format.raw/*56.33*/("""
                    """),format.raw/*57.21*/("""mfr="all";
                """),format.raw/*58.17*/("""}"""),format.raw/*58.18*/(""" 
                """),format.raw/*59.17*/("""alert(mfr);
                var url = "/v1/admin/users/edit/" + mfr + "/" + emailString;
                if(emailString=="") """),format.raw/*61.37*/("""{"""),format.raw/*61.38*/("""
                	"""),format.raw/*62.18*/("""return confirm('Please select at least one user to edit.');
                """),format.raw/*63.17*/("""}"""),format.raw/*63.18*/(""" """),format.raw/*63.19*/("""else """),format.raw/*63.24*/("""{"""),format.raw/*63.25*/("""
                 """),format.raw/*64.18*/("""window.location.href=url
                """),format.raw/*65.17*/("""}"""),format.raw/*65.18*/("""
            """),format.raw/*66.13*/("""}"""),format.raw/*66.14*/(""");
                        
         </script>           
        """)))}/*69.11*/else/*69.16*/{_display_(Seq[Any](format.raw/*69.17*/("""
             """),format.raw/*70.14*/("""<input type="hidden" name="mfr" value="""),_display_(/*70.53*/org),format.raw/*70.56*/(""" """),format.raw/*70.57*/("""/>   
        """)))}),format.raw/*71.10*/("""
        
  """)))}),format.raw/*73.4*/("""
  """),format.raw/*74.3*/("""</div>
  <div class="span12">
  
    """),_display_(/*77.6*/flash/*77.11*/.get(FKSuccess).map/*77.30*/ { message =>_display_(Seq[Any](format.raw/*77.43*/("""  """),format.raw/*77.45*/("""<div class="alert alert-success"> """),_display_(/*77.80*/message),format.raw/*77.87*/("""  """),format.raw/*77.89*/("""</div> """)))}),format.raw/*77.97*/("""
    """),_display_(/*78.6*/flash/*78.11*/.get(FKError).map/*78.28*/ { message =>_display_(Seq[Any](format.raw/*78.41*/("""  """),format.raw/*78.43*/("""<div class="alert alert-error"> """),_display_(/*78.76*/message),format.raw/*78.83*/("""  """),format.raw/*78.85*/("""</div> """)))}),format.raw/*78.93*/("""
    
    """),_display_(/*80.6*/if(ul.nonEmpty)/*80.21*/{_display_(Seq[Any](format.raw/*80.22*/("""
    """),format.raw/*81.5*/("""<table class="table table-striped" >
      <thead>
        <tr>        
          <th> Name </th>
          <th> Organization </th>
          <th> Email </th>
          <th> Role </th>
          <th> MPS Def </th>
          <th> Realm Def </th>
          <th> URL Def </th>
          <th> SSO </th>
          <th> WB User Name </th>
          <th> Report Usage </th>
          <th> Active </th>
          <th> Show Info </th>
          <th> Dashboard Admin </th> 
          <th> Action </th>
        </tr>
      </thead>
      <tbody>
        """),_display_(/*101.10*/ul/*101.12*/.map/*101.16*/ { u =>_display_(Seq[Any](format.raw/*101.23*/(""" """),_display_(/*101.25*/if(u.first_name != signedInUserName.get)/*101.65*/ {_display_(Seq[Any](format.raw/*101.67*/("""
          """),format.raw/*102.11*/("""<tr id="""),_display_(/*102.19*/u/*102.20*/.email),format.raw/*102.26*/(""">      
            <td> """),_display_(/*103.19*/u/*103.20*/.first_name),format.raw/*103.31*/("""  """),format.raw/*103.33*/("""</td>
            <td> """),_display_(/*104.19*/u/*104.20*/.org),format.raw/*104.24*/("""  """),format.raw/*104.26*/("""</td>
            <td> """),_display_(/*105.19*/u/*105.20*/.email),format.raw/*105.26*/(""" """),format.raw/*105.27*/("""</td>
            <td> """),_display_(/*106.19*/u/*106.20*/.role),format.raw/*106.25*/(""" """),format.raw/*106.26*/("""</td>
            <td> """),_display_(/*107.19*/u/*107.20*/.mps_def),format.raw/*107.28*/(""" """),format.raw/*107.29*/("""</td>
            <td> """),_display_(/*108.19*/u/*108.20*/.realm_def),format.raw/*108.30*/(""" """),format.raw/*108.31*/("""</td>
            <td> """),_display_(/*109.19*/u/*109.20*/.url_def),format.raw/*109.28*/(""" """),format.raw/*109.29*/("""</td>
            <td> """),_display_(/*110.19*/u/*110.20*/.sso),format.raw/*110.24*/(""" """),format.raw/*110.25*/("""</td>
            <td> """),_display_(/*111.19*/u/*111.20*/.wb_user_name),format.raw/*111.33*/(""" """),format.raw/*111.34*/("""</td>
            <td> """),_display_(/*112.19*/u/*112.20*/.report_usage),format.raw/*112.33*/(""" """),format.raw/*112.34*/("""</td>
            <td> """),_display_(/*113.19*/u/*113.20*/.active),format.raw/*113.27*/(""" """),format.raw/*113.28*/("""</td>
            <td> """),_display_(/*114.19*/u/*114.20*/.show_info),format.raw/*114.30*/(""" """),format.raw/*114.31*/("""</td>
            <td> """),_display_(/*115.19*/u/*115.20*/.dashboard_admin),format.raw/*115.36*/(""" """),format.raw/*115.37*/("""</td>
            <td> 
              <table style="float:left">  
                <tr><td style="border:0;background:transparent">
                """),_display_(/*119.18*/form(routes.AdminUser.remove(version, u.email, u.org))/*119.72*/ {_display_(Seq[Any](format.raw/*119.74*/("""
                  """),format.raw/*120.19*/("""<input class="btn btn-primary" type="submit" name="action" onclick="return confirm('Are you sure to remove this user?')" value="Remove" />
                """)))}),format.raw/*121.18*/("""</td><td style="border:0;background:transparent">
	            """),_display_(/*122.15*/form(routes.AdminUser.editForm(version, u.email, u.org))/*122.71*/ {_display_(Seq[Any](format.raw/*122.73*/("""
                  """),format.raw/*123.19*/("""<input class="btn btn-primary" type="submit" name="action" value="Edit" />
                """)))}),format.raw/*124.18*/("""
	            """),format.raw/*125.14*/("""</td><td style="border:0;background:transparent">
	              <input type="checkbox" value="""),_display_(/*126.46*/u/*126.47*/.email),format.raw/*126.53*/(""" """),format.raw/*126.54*/("""id="selecteduser" class="checkbox">
	            </td></tr>
	          </table>     
            </td>
          </tr>
        """)))}),format.raw/*131.10*/(""" """)))}),format.raw/*131.12*/("""
      """),format.raw/*132.7*/("""</tbody>
      <script src=""""),_display_(/*133.21*/routes/*133.27*/.Assets.at("javascripts/jquery-1.7.1.min.js")),format.raw/*133.72*/(""""></script> 
          <script>
            $('#selectAllUsersBtn').on('click', function()"""),format.raw/*135.59*/("""{"""),format.raw/*135.60*/("""
                """),format.raw/*136.17*/("""$('.checkbox').prop('checked', function(i, val) """),format.raw/*136.65*/("""{"""),format.raw/*136.66*/("""return !val;"""),format.raw/*136.78*/("""}"""),format.raw/*136.79*/(""");
                $(this).text( ($(this).html() == 'Select All Users' ? 'Unselect All' : 'Select All Users'));
            """),format.raw/*138.13*/("""}"""),format.raw/*138.14*/(""");
            $('#checkAll').change(function()"""),format.raw/*139.45*/("""{"""),format.raw/*139.46*/("""
               """),format.raw/*140.16*/("""$("input:checkbox").prop('checked', $(this).prop("checked"));
            """),format.raw/*141.13*/("""}"""),format.raw/*141.14*/(""");

         </script>
    </table>
  """)))}/*145.5*/else/*145.10*/{_display_(Seq[Any](format.raw/*145.11*/("""
        """),format.raw/*146.9*/("""<div class="well">
            <em> You have not created any users yet.</em>
        </div>  
  """)))}),format.raw/*149.4*/("""
  """),format.raw/*150.3*/("""</div>
       
""")))}),format.raw/*152.2*/("""
"""))
      }
    }
  }

  def render(ul:IndexedSeq[User],signedInUserName:Option[String],userorg:Option[String],userrole:Option[String],version:String,flash:Flash,messages:Messages): play.twirl.api.HtmlFormat.Appendable = apply(ul,signedInUserName,userorg,userrole,version)(flash,messages)

  def f:((IndexedSeq[User],Option[String],Option[String],Option[String],String) => (Flash,Messages) => play.twirl.api.HtmlFormat.Appendable) = (ul,signedInUserName,userorg,userrole,version) => (flash,messages) => apply(ul,signedInUserName,userorg,userrole,version)(flash,messages)

  def ref: this.type = this

}


}

/**/
object list extends list_Scope0.list
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/user/list.scala.html
                  HASH: c65fd0626515149320583d7a89b782eb4b496a40
                  MATRIX: 607->1|886->287|898->292|978->296|1007->299|1046->209|1078->233|1159->168|1187->207|1215->283|1245->307|1274->310|1349->376|1389->378|1422->384|1472->408|1488->415|1501->419|1547->427|1576->429|1602->446|1642->448|1681->459|1833->584|1848->590|1905->626|1960->654|1972->657|1997->673|2041->679|2085->695|2128->711|2143->717|2196->749|2226->752|2236->753|2266->762|2320->785|2359->796|2726->1136|2741->1142|2807->1187|2923->1275|2952->1276|2995->1291|3076->1344|3105->1345|3176->1388|3205->1389|3250->1406|3402->1530|3431->1531|3477->1549|3570->1614|3599->1615|3644->1632|3687->1647|3716->1648|3762->1666|3848->1724|3877->1725|3922->1742|3991->1783|4020->1784|4069->1805|4238->1946|4267->1947|4326->1978|4355->1979|4465->2061|4494->2062|4556->2096|4643->2155|4672->2156|4718->2174|4791->2219|4820->2220|5061->2433|5090->2434|5139->2455|5194->2482|5223->2483|5269->2501|5422->2626|5451->2627|5497->2645|5601->2721|5630->2722|5659->2723|5692->2728|5721->2729|5767->2747|5836->2788|5865->2789|5906->2802|5935->2803|6021->2871|6034->2876|6073->2877|6115->2891|6181->2930|6205->2933|6234->2934|6280->2949|6323->2962|6353->2965|6417->3003|6431->3008|6459->3027|6510->3040|6540->3042|6602->3077|6630->3084|6660->3086|6699->3094|6731->3100|6745->3105|6771->3122|6822->3135|6852->3137|6912->3170|6940->3177|6970->3179|7009->3187|7046->3198|7070->3213|7109->3214|7141->3219|7713->3763|7725->3765|7739->3769|7785->3776|7815->3778|7865->3818|7906->3820|7946->3831|7982->3839|7993->3840|8021->3846|8075->3872|8086->3873|8119->3884|8150->3886|8202->3910|8213->3911|8239->3915|8270->3917|8322->3941|8333->3942|8361->3948|8391->3949|8443->3973|8454->3974|8481->3979|8511->3980|8563->4004|8574->4005|8604->4013|8634->4014|8686->4038|8697->4039|8729->4049|8759->4050|8811->4074|8822->4075|8852->4083|8882->4084|8934->4108|8945->4109|8971->4113|9001->4114|9053->4138|9064->4139|9099->4152|9129->4153|9181->4177|9192->4178|9227->4191|9257->4192|9309->4216|9320->4217|9349->4224|9379->4225|9431->4249|9442->4250|9474->4260|9504->4261|9556->4285|9567->4286|9605->4302|9635->4303|9812->4452|9876->4506|9917->4508|9965->4527|10153->4683|10245->4747|10311->4803|10352->4805|10400->4824|10524->4916|10567->4930|10690->5025|10701->5026|10729->5032|10759->5033|10919->5161|10953->5163|10988->5170|11045->5199|11061->5205|11128->5250|11247->5340|11277->5341|11323->5358|11400->5406|11430->5407|11471->5419|11501->5420|11654->5544|11684->5545|11760->5592|11790->5593|11835->5609|11938->5683|11968->5684|12026->5724|12040->5729|12080->5730|12117->5739|12245->5836|12276->5839|12323->5855
                  LINES: 20->1|25->8|25->8|27->8|28->9|29->6|29->6|30->1|32->5|33->6|35->10|37->12|37->12|37->12|39->14|40->15|40->15|40->15|40->15|40->15|40->15|40->15|41->16|43->18|43->18|43->18|44->19|44->19|44->19|44->19|45->20|45->20|45->20|45->20|45->20|45->20|45->20|46->21|47->22|51->26|51->26|51->26|53->28|53->28|54->29|55->30|55->30|56->31|56->31|57->32|58->33|58->33|59->34|60->35|60->35|61->36|61->36|61->36|62->37|63->38|63->38|64->39|64->39|64->39|65->40|68->43|68->43|71->46|71->46|73->48|73->48|75->50|75->50|75->50|76->51|77->52|77->52|81->56|81->56|82->57|83->58|83->58|84->59|86->61|86->61|87->62|88->63|88->63|88->63|88->63|88->63|89->64|90->65|90->65|91->66|91->66|94->69|94->69|94->69|95->70|95->70|95->70|95->70|96->71|98->73|99->74|102->77|102->77|102->77|102->77|102->77|102->77|102->77|102->77|102->77|103->78|103->78|103->78|103->78|103->78|103->78|103->78|103->78|103->78|105->80|105->80|105->80|106->81|126->101|126->101|126->101|126->101|126->101|126->101|126->101|127->102|127->102|127->102|127->102|128->103|128->103|128->103|128->103|129->104|129->104|129->104|129->104|130->105|130->105|130->105|130->105|131->106|131->106|131->106|131->106|132->107|132->107|132->107|132->107|133->108|133->108|133->108|133->108|134->109|134->109|134->109|134->109|135->110|135->110|135->110|135->110|136->111|136->111|136->111|136->111|137->112|137->112|137->112|137->112|138->113|138->113|138->113|138->113|139->114|139->114|139->114|139->114|140->115|140->115|140->115|140->115|144->119|144->119|144->119|145->120|146->121|147->122|147->122|147->122|148->123|149->124|150->125|151->126|151->126|151->126|151->126|156->131|156->131|157->132|158->133|158->133|158->133|160->135|160->135|161->136|161->136|161->136|161->136|161->136|163->138|163->138|164->139|164->139|165->140|166->141|166->141|170->145|170->145|170->145|171->146|174->149|175->150|177->152
                  -- GENERATED --
              */
          