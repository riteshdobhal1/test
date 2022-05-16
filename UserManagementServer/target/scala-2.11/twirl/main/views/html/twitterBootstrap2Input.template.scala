
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object twitterBootstrap2Input_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class twitterBootstrap2Input extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template1[helper.FieldElements,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(elements: helper.FieldElements):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.34*/("""

"""),format.raw/*5.52*/("""

"""),format.raw/*7.1*/("""<div class="control-group """),_display_(/*7.28*/if(elements.hasErrors)/*7.50*/ {_display_(Seq[Any](format.raw/*7.52*/("""error""")))}),format.raw/*7.58*/("""">
	<label class="control-label" for=""""),_display_(/*8.37*/elements/*8.45*/.id),format.raw/*8.48*/("""">"""),_display_(/*8.51*/elements/*8.59*/.label),format.raw/*8.65*/("""</label>
	<div class="controls">
		"""),_display_(/*10.4*/elements/*10.12*/.input),format.raw/*10.18*/("""
        """),_display_(/*11.10*/if(elements.hasErrors)/*11.32*/ {_display_(Seq[Any](format.raw/*11.34*/("""<span class="help-inline">"""),_display_(/*11.61*/elements/*11.69*/.errors.mkString(", ")),format.raw/*11.91*/("""</span>""")))}),format.raw/*11.99*/("""
		"""),format.raw/*12.3*/("""<span class="help-block">"""),_display_(/*12.29*/elements/*12.37*/.infos.mkString(", ")),format.raw/*12.58*/("""</span> 		
	</div>
</div>
"""))
      }
    }
  }

  def render(elements:helper.FieldElements): play.twirl.api.HtmlFormat.Appendable = apply(elements)

  def f:((helper.FieldElements) => play.twirl.api.HtmlFormat.Appendable) = (elements) => apply(elements)

  def ref: this.type = this

}


}

/**/
object twitterBootstrap2Input extends twitterBootstrap2Input_Scope0.twitterBootstrap2Input
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/twitterBootstrap2Input.scala.html
                  HASH: 13388341a5033e48926ed2aa2aca27db0cb0cb1f
                  MATRIX: 575->1|702->33|731->194|759->196|812->223|842->245|881->247|917->253|982->292|998->300|1021->303|1050->306|1066->314|1092->320|1154->356|1171->364|1198->370|1235->380|1266->402|1306->404|1360->431|1377->439|1420->461|1459->469|1489->472|1542->498|1559->506|1601->527
                  LINES: 20->1|25->1|27->5|29->7|29->7|29->7|29->7|29->7|30->8|30->8|30->8|30->8|30->8|30->8|32->10|32->10|32->10|33->11|33->11|33->11|33->11|33->11|33->11|33->11|34->12|34->12|34->12|34->12
                  -- GENERATED --
              */
          