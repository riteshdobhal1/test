
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object proxy_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

     object proxy_Scope1 {
import play.api._
import play.api.Play.current

class proxy extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template0[play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply():play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {

def /*4.2*/httpProxy/*4.11*/ = {{}};
Seq[Any](format.raw/*4.17*/("""
"""),format.raw/*5.1*/("""<!DOCTYPE HTML>
<script src=""""),_display_(/*6.15*/routes/*6.21*/.Assets.at("assets/javascripts/xdomain.min.js")),format.raw/*6.68*/(""""></script>
<script>
	xdomain.masters("""),format.raw/*8.18*/("""{"""),format.raw/*8.19*/("""
		"""),format.raw/*9.3*/("""""""),_display_(/*9.5*/{"http://*." + play.Play.application().configuration().getString("xdomain.name")}),format.raw/*9.86*/("""" : "/*",
		""""),_display_(/*10.5*/{"https://*." + play.Play.application().configuration().getString("xdomain.name")}),format.raw/*10.87*/("""" : "/*"
	"""),format.raw/*11.2*/("""}"""),format.raw/*11.3*/(""");
</script>

"""))
      }
    }
  }

  def render(): play.twirl.api.HtmlFormat.Appendable = apply()

  def f:(() => play.twirl.api.HtmlFormat.Appendable) = () => apply()

  def ref: this.type = this

}


}
}

/**/
object proxy extends proxy_Scope0.proxy_Scope1.proxy
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/proxy.scala.html
                  HASH: b8b025f72176d4d5bf6b11ebc9614f8520617dd9
                  MATRIX: 668->51|685->60|721->66|748->67|804->97|818->103|885->150|950->188|978->189|1007->192|1034->194|1135->275|1175->289|1278->371|1315->381|1343->382
                  LINES: 28->4|28->4|29->4|30->5|31->6|31->6|31->6|33->8|33->8|34->9|34->9|34->9|35->10|35->10|36->11|36->11
                  -- GENERATED --
              */
          