
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object index_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class index extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template0[play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply():play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.1*/("""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Ui</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="stylesheet" href="/assets/styles.3ff695c00d717f2d2a11.css"></head>
<body>
  <app-root>Loading....</app-root>
<script type="text/javascript" src="/assets/runtime.b57bf819d5bdce77f1c7.js"></script><script type="text/javascript" src="/assets/polyfills.20d0bb3b90b253b298ff.js"></script><script type="text/javascript" src="/assets/main.295704d91ccc2d848154.js"></script></body>
</html>
"""))
      }
    }
  }

  def render(): play.twirl.api.HtmlFormat.Appendable = apply()

  def f:(() => play.twirl.api.HtmlFormat.Appendable) = () => apply()

  def ref: this.type = this

}


}

/**/
object index extends index_Scope0.index
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:29 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/index.scala.html
                  HASH: 769f45ba04c1aa7ea4a8843c4526bfb91adb5789
                  MATRIX: 609->0
                  LINES: 25->1
                  -- GENERATED --
              */
          