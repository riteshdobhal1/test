
package views.html

import play.twirl.api._
import play.twirl.api.TemplateMagic._


     object clinsightRegistrationForm_Scope0 {
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

class clinsightRegistrationForm extends BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with play.twirl.api.Template1[String,play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply/*1.2*/(clinsightLogo: String):play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.25*/("""
"""),format.raw/*2.1*/("""<!DOCTYPE html>
<html>

<head>
    <title>Registration Form</title>
    <meta charset="UTF-8">
    <meta name="description" content="Your site's description should be here">
    <meta name="keywords" content="Your site's keywords should be here">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&amp;subset=cyrillic,cyrillic-ext,latin,latin-ext,vietnamese">
    <style>
        * """),format.raw/*15.11*/("""{"""),format.raw/*15.12*/("""
            """),format.raw/*16.13*/("""box-sizing: border-box;
        """),format.raw/*17.9*/("""}"""),format.raw/*17.10*/("""

        """),format.raw/*19.9*/("""body """),format.raw/*19.14*/("""{"""),format.raw/*19.15*/("""
            """),format.raw/*20.13*/("""font-family: Montserrat, sans-serif;
        """),format.raw/*21.9*/("""}"""),format.raw/*21.10*/("""

        """),format.raw/*23.9*/("""input[type=text], input[type=password], input[type=email],
        select,
        textarea """),format.raw/*25.18*/("""{"""),format.raw/*25.19*/("""
            """),format.raw/*26.13*/("""width: 100%;
            padding: 12px;
            border-radius: 0px;
            resize: vertical;
            border: 1px solid rgba(0, 0, 0, 0.09);
            margin-top: 15px;
            font-size: 13px;
            -webkit-appearance: none;
        """),format.raw/*34.9*/("""}"""),format.raw/*34.10*/("""

        """),format.raw/*36.9*/("""input::placeholder """),format.raw/*36.28*/("""{"""),format.raw/*36.29*/("""
            """),format.raw/*37.13*/("""font-family: Montserrat, sans-serif;
        """),format.raw/*38.9*/("""}"""),format.raw/*38.10*/("""


        """),format.raw/*41.9*/("""input[type=text]:focus, input[type=password]:focus, select:focus, input[type=text]:focus """),format.raw/*41.98*/("""{"""),format.raw/*41.99*/("""
            """),format.raw/*42.13*/("""font-size: 13px;
        """),format.raw/*43.9*/("""}"""),format.raw/*43.10*/("""


        """),format.raw/*46.9*/("""label """),format.raw/*46.15*/("""{"""),format.raw/*46.16*/("""
            """),format.raw/*47.13*/("""padding: 12px 12px 12px 0;
            display: inline-block;
        """),format.raw/*49.9*/("""}"""),format.raw/*49.10*/("""

        """),format.raw/*51.9*/("""input[type=submit] """),format.raw/*51.28*/("""{"""),format.raw/*51.29*/("""
            """),format.raw/*52.13*/("""color: white;
            padding: 12px 20px;
            border: none;
            cursor: pointer;
            float: right;
            background: #01346d;
            width: 100%;
            margin-top: 15px;
            font-weight: bold;
            font-size: 1.3rem;
            text-align: center;
            text-transform: uppercase;
            font-family: Montserrat, sans-serif;
            outline: none;
            -webkit-appearance: none;
            border-radius: 0;
        """),format.raw/*68.9*/("""}"""),format.raw/*68.10*/("""

        """),format.raw/*70.9*/("""input[type=submit]:hover """),format.raw/*70.34*/("""{"""),format.raw/*70.35*/("""
            """),format.raw/*71.13*/("""background-color: #01346d;
        """),format.raw/*72.9*/("""}"""),format.raw/*72.10*/("""

        """),format.raw/*74.9*/(""".container """),format.raw/*74.20*/("""{"""),format.raw/*74.21*/("""
            """),format.raw/*75.13*/("""border-radius: 5px;
            padding: 20px;
            margin: 0px auto;
            /*width: 400px;*/
            padding-top: 2px;
        """),format.raw/*80.9*/("""}"""),format.raw/*80.10*/("""

        """),format.raw/*82.9*/(""".col-25 """),format.raw/*82.17*/("""{"""),format.raw/*82.18*/("""
            """),format.raw/*83.13*/("""float: left;
            width: 25%;
            margin-top: 6px;
        """),format.raw/*86.9*/("""}"""),format.raw/*86.10*/("""

        """),format.raw/*88.9*/(""".col-75 """),format.raw/*88.17*/("""{"""),format.raw/*88.18*/("""
            """),format.raw/*89.13*/("""float: left;
            width: 75%;
            margin-top: 6px;
        """),format.raw/*92.9*/("""}"""),format.raw/*92.10*/("""

        """),format.raw/*94.9*/(""".col-100 """),format.raw/*94.18*/("""{"""),format.raw/*94.19*/("""
            """),format.raw/*95.13*/("""float: left;
            width: 100%;
            margin-top: 6px;
        """),format.raw/*98.9*/("""}"""),format.raw/*98.10*/("""

        """),format.raw/*100.9*/("""/* Clear floats after the columns */
        .row:after """),format.raw/*101.20*/("""{"""),format.raw/*101.21*/("""
            """),format.raw/*102.13*/("""content: "";
            display: table;
            clear: both;
        """),format.raw/*105.9*/("""}"""),format.raw/*105.10*/("""

        """),format.raw/*107.9*/(""".p """),format.raw/*107.12*/("""{"""),format.raw/*107.13*/("""
            """),format.raw/*108.13*/("""color: #7a7a7a;
            text-align: center;
            font-size: 11px;
            margin-top: 20px;
            line-height: 1.5;
        """),format.raw/*113.9*/("""}"""),format.raw/*113.10*/("""

        """),format.raw/*115.9*/(""".b_logo_div """),format.raw/*115.21*/("""{"""),format.raw/*115.22*/("""
            """),format.raw/*116.13*/("""text-align: left;
        """),format.raw/*117.9*/("""}"""),format.raw/*117.10*/("""

        """),format.raw/*119.9*/(""".gb_logo """),format.raw/*119.18*/("""{"""),format.raw/*119.19*/("""
            """),format.raw/*120.13*/("""width: 150px;
            object-fit: contain;
        """),format.raw/*122.9*/("""}"""),format.raw/*122.10*/("""

        """),format.raw/*124.9*/(""".form """),format.raw/*124.15*/("""{"""),format.raw/*124.16*/("""
            """),format.raw/*125.13*/("""padding-left: 30px;
            padding-right: 30px;
        """),format.raw/*127.9*/("""}"""),format.raw/*127.10*/("""

        """),format.raw/*129.9*/(""".alert """),format.raw/*129.16*/("""{"""),format.raw/*129.17*/("""
            """),format.raw/*130.13*/("""padding: 20px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
        """),format.raw/*134.9*/("""}"""),format.raw/*134.10*/("""

        """),format.raw/*136.9*/(""".alert-success """),format.raw/*136.24*/("""{"""),format.raw/*136.25*/("""
            """),format.raw/*137.13*/("""color: #3c763d;
            background-color: #dff0d8;
            border-color: #d6e9c6;
        """),format.raw/*140.9*/("""}"""),format.raw/*140.10*/("""

        """),format.raw/*142.9*/(""".alert-info """),format.raw/*142.21*/("""{"""),format.raw/*142.22*/("""
            """),format.raw/*143.13*/("""color: #31708f;
            background-color: #d9edf7;
            border-color: #bce8f1;
        """),format.raw/*146.9*/("""}"""),format.raw/*146.10*/("""

        """),format.raw/*148.9*/(""".alert-warning """),format.raw/*148.24*/("""{"""),format.raw/*148.25*/("""
            """),format.raw/*149.13*/("""color: #8a6d3b;
            background-color: #fcf8e3;
            border-color: #faebcc;
        """),format.raw/*152.9*/("""}"""),format.raw/*152.10*/("""

        """),format.raw/*154.9*/(""".alert-danger """),format.raw/*154.23*/("""{"""),format.raw/*154.24*/("""
            """),format.raw/*155.13*/("""color: #a94442;
            background-color: #f2dede;
            border-color: #ebccd1;
        """),format.raw/*158.9*/("""}"""),format.raw/*158.10*/("""

        """),format.raw/*160.9*/(""".msg"""),format.raw/*160.13*/("""{"""),format.raw/*160.14*/("""
            """),format.raw/*161.13*/("""z-index: 9;
            position: relative;
            display: none;
        """),format.raw/*164.9*/("""}"""),format.raw/*164.10*/("""

        """),format.raw/*166.9*/(""".close """),format.raw/*166.16*/("""{"""),format.raw/*166.17*/("""
            """),format.raw/*167.13*/("""position: absolute;
            top: 5rem;
            right: 1.6rem;
            font-size: 1.6rem;
            cursor: pointer;
            -moz-transform:rotate(45deg);
            -webkit-transform:rotate(45deg);
            -o-transform:rotate(45deg);
            -ms-transform:rotate(45deg);
        """),format.raw/*176.9*/("""}"""),format.raw/*176.10*/("""

        """),format.raw/*178.9*/(""".error-msg-match"""),format.raw/*178.25*/("""{"""),format.raw/*178.26*/("""
            """),format.raw/*179.13*/("""display: none;
            color: red;
            font-family: Montserrat, sans-serif;
            font-size: 0.8rem;
            padding-left: 0.8rem;
            padding-right: 0.8rem;
            margin-bottom: 0;
        """),format.raw/*186.9*/("""}"""),format.raw/*186.10*/("""

        """),format.raw/*188.9*/(""".password-instruction-text"""),format.raw/*188.35*/("""{"""),format.raw/*188.36*/("""
            """),format.raw/*189.13*/("""font-size: 11px;
            font-weight: bold;
        """),format.raw/*191.9*/("""}"""),format.raw/*191.10*/("""

        """),format.raw/*193.9*/("""#passwordInstruction"""),format.raw/*193.29*/("""{"""),format.raw/*193.30*/("""
            """),format.raw/*194.13*/("""display: none;
        """),format.raw/*195.9*/("""}"""),format.raw/*195.10*/("""

        """),format.raw/*197.9*/("""#passwordInstruction li"""),format.raw/*197.32*/("""{"""),format.raw/*197.33*/("""
            """),format.raw/*198.13*/("""font-size: 10px;
            color: #808080;
        """),format.raw/*200.9*/("""}"""),format.raw/*200.10*/("""

        """),format.raw/*202.9*/("""/* The Modal (background) */
        .modal """),format.raw/*203.16*/("""{"""),format.raw/*203.17*/("""
          """),format.raw/*204.11*/("""display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          padding-top: 0; /* Location of the box */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: rgb(0,0,0); /* Fallback color */
          background-color: #fefefe;
        """),format.raw/*215.9*/("""}"""),format.raw/*215.10*/("""

        """),format.raw/*217.9*/("""/* Modal Content */
        .modal-content """),format.raw/*218.24*/("""{"""),format.raw/*218.25*/("""
          """),format.raw/*219.11*/("""background-color: #fefefe;
          margin: auto;
          padding: 2em;
          border: 1px solid #888;
          width: 100%;
          height: 100%;
          /*overflow-y: scroll;*/
        """),format.raw/*226.9*/("""}"""),format.raw/*226.10*/("""

        """),format.raw/*228.9*/("""/* The Close Button */
        .close-modal """),format.raw/*229.22*/("""{"""),format.raw/*229.23*/("""
          """),format.raw/*230.11*/("""color: #aaaaaa;
          font-size: 28px;
          font-weight: bold;
          position: fixed;
          right: 20px;
          top: 10px;
        """),format.raw/*236.9*/("""}"""),format.raw/*236.10*/("""

        """),format.raw/*238.9*/(""".close-modal:hover,
        .close-modal:focus """),format.raw/*239.28*/("""{"""),format.raw/*239.29*/("""
          """),format.raw/*240.11*/("""color: #000;
          text-decoration: none;
          cursor: pointer;
        """),format.raw/*243.9*/("""}"""),format.raw/*243.10*/("""

        """),format.raw/*245.9*/(""".modal__header"""),format.raw/*245.23*/("""{"""),format.raw/*245.24*/("""
          """),format.raw/*246.11*/("""height: 60px;
          /*box-shadow: 0 4px 5px 0 #888888;*/
        """),format.raw/*248.9*/("""}"""),format.raw/*248.10*/("""
        """),format.raw/*249.9*/(""".with-box-shadow"""),format.raw/*249.25*/("""{"""),format.raw/*249.26*/("""
          """),format.raw/*250.11*/("""box-shadow: 0 4px 5px 0 #888888;
        """),format.raw/*251.9*/("""}"""),format.raw/*251.10*/("""
        """),format.raw/*252.9*/(""".without-box-shadow"""),format.raw/*252.28*/("""{"""),format.raw/*252.29*/("""
          """),format.raw/*253.11*/("""box-shadow: none;
        """),format.raw/*254.9*/("""}"""),format.raw/*254.10*/("""
        """),format.raw/*255.9*/(""".modal__footer """),format.raw/*255.24*/("""{"""),format.raw/*255.25*/("""
            """),format.raw/*256.13*/("""height: 48px;
            bottom: 0;
            background-color: rgb(0,0,0);
            color: white;
            bottom: 0;
            text-align: center;
        """),format.raw/*262.9*/("""}"""),format.raw/*262.10*/("""
        """),format.raw/*263.9*/(""".modal__content,
        .modal__footer """),format.raw/*264.24*/("""{"""),format.raw/*264.25*/("""
            """),format.raw/*265.13*/("""position: absolute;
            width: 100%;
        """),format.raw/*267.9*/("""}"""),format.raw/*267.10*/("""
        """),format.raw/*268.9*/(""".modal__content """),format.raw/*268.25*/("""{"""),format.raw/*268.26*/("""
          """),format.raw/*269.11*/("""bottom: 48px;
          top: 60px;
          overflow-y: auto;
          font-family: Times New Roman, Calibri;
          padding: 1rem 2rem 0 2rem;
          font-size: 13px;
          color: #808080;
        """),format.raw/*276.9*/("""}"""),format.raw/*276.10*/("""
        """),format.raw/*277.9*/(""".close-button"""),format.raw/*277.22*/("""{"""),format.raw/*277.23*/("""
          """),format.raw/*278.11*/("""font-size: 2.3rem;
          background-color: rgb(0,0,0);
          color: white;
          cursor: pointer;
          font-weight: 200;
        """),format.raw/*283.9*/("""}"""),format.raw/*283.10*/("""
        """),format.raw/*284.9*/(""".terms-conditions"""),format.raw/*284.26*/("""{"""),format.raw/*284.27*/("""
          """),format.raw/*285.11*/("""margin-top:0;
          padding-top: 20px;
          text-align: center;
          text-decoration-line: underline!important;
          -webkit-text-decoration-line: underline!important;
        """),format.raw/*290.9*/("""}"""),format.raw/*290.10*/("""
        """),format.raw/*291.9*/(""".sub-header"""),format.raw/*291.20*/("""{"""),format.raw/*291.21*/("""
          """),format.raw/*292.11*/("""font-size: 14px!important;
          font-weight: bold!important;
          color: #000000!important;
        """),format.raw/*295.9*/("""}"""),format.raw/*295.10*/("""

        """),format.raw/*297.9*/("""/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
        @media screen and (max-width: 600px) """),format.raw/*298.47*/("""{"""),format.raw/*298.48*/("""
            """),format.raw/*299.13*/(""".col-25,
            .col-75,
            .col-100,
            input[type=submit] """),format.raw/*302.32*/("""{"""),format.raw/*302.33*/("""
                """),format.raw/*303.17*/("""width: 100%;
                margin-top: 20;
            """),format.raw/*305.13*/("""}"""),format.raw/*305.14*/("""

            """),format.raw/*307.13*/(""".container """),format.raw/*307.24*/("""{"""),format.raw/*307.25*/("""
                """),format.raw/*308.17*/("""width: 100%;
            """),format.raw/*309.13*/("""}"""),format.raw/*309.14*/("""
            """),format.raw/*310.13*/(""".close-modal"""),format.raw/*310.25*/("""{"""),format.raw/*310.26*/("""
                """),format.raw/*311.17*/("""right: 1rem;
            """),format.raw/*312.13*/("""}"""),format.raw/*312.14*/("""
        """),format.raw/*313.9*/("""}"""),format.raw/*313.10*/("""
    """),format.raw/*314.5*/("""</style>
</head>

<body>
<div class="container">
    <div class="row">
        <div class="col-100 gb_logo_div">
            <img class="gb_logo" src=""""),_display_(/*321.40*/clinsightLogo),format.raw/*321.53*/("""" alt="">
        </div>
        <div id="responseBlock" class="container msg">
            <div class="close" onclick="removeThis('responseBlock')">+</div>
            <div class="col-100">
                <div id="responseContainer" class="alert">

                </div>
            </div>
        </div>
    </div>
    <form name="registration_form" id="registrationForm" onsubmit="registerForm(event)" class="form">
        <div class="row">
            <div class="col-100">
                <input id="fname" type="text" onkeyup="removeMessage('fname', 'fnameMessage')" placeholder="First Name*" autofocus />
            </div>
        </div>
        <p id="fnameMessage" class="col-100 error-msg-match"></p>
        <div class="row">
            <div class="col-100">
                <input id="lname" type="text" placeholder="Last Name" />
            </div>
        </div>
        <p id="lnameMessage" class="col-100 error-msg-match"></p>
        <div class="row">
            <div class="col-100">
                <input id="company" type="text" placeholder="Company Name" />
            </div>
        </div>
        <p id="companyMessage" class="col-100 error-msg-match"></p>
        <div class="row">
            <div class="col-100">
                <input id="email" type="email" onkeyup="removeMessage('email', 'emailMessage')" placeholder="Email Id*" />
            </div>
        </div>
        <p id="emailMessage" class="col-100 error-msg-match"></p>
        <div class="row">
            <div class="col-100">
                <input id="password" type="password" placeholder="Password*" minlength="6" maxlength="40" pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s])."""),format.raw/*359.167*/("""{"""),format.raw/*359.168*/("""6,"""),format.raw/*359.170*/("""}"""),format.raw/*359.171*/("""" onfocus="showThis('passwordInstruction')" onblur="removeThis('passwordInstruction')" />
            </div>
        </div>
        <div id="passwordInstruction" class="row">
            <div class="col-100">
                <h2 class="password-instruction-text">Password instructions</h2>

                <ul>
                    <li>Passwords shall have a minimum of 6 characters and maximum of 40 characters </li>
                    <li>Choose a password that is easy for you to remember but would be hard for another to guess</li>
                    <li>Passwords must include combination of the four following types of characters.<br />
                        -uppercase letters (A through Z). <br>
                        -lower case letters (a through z).<br>
                        -Numbers (0 through 9).<br>
                        -Special characters and punctuation symbols (Example: _, -. +, =,!, @, %, *, &, ”, :, ., or /).
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-100">
                <input id="cpassword" type="password" onkeyup="removeMessage('cpassword', 'cpasswordMessage')" placeholder="Confirm Password*" />
            </div>
        </div>
        <p id="cpasswordMessage" class="col-100 error-msg-match"></p>
        <div class="row">
            <div class="col-100">
                <input class="register" type="submit" id="register" value="REGISTER" />
            </div>
        </div>
        <div>
            <p class="p">By clicking on Sign up, you agree to Glassbeam’s
                <a href="#" id="myBtn" class="text-style">Terms and Conditions of Use.</a>
            </p>
        </div>
    </form>

    <div id="myModal" class="modal">
        <div class="modal__header">
            <h3 class="terms-conditions">Terms and Conditions</h6>
        </div>
        <div class="modal__content">
            <p><strong class="sub-header">Sharing of Personally Identifiable Information:</strong></p>
            <p>We do not share personally identifiable information with third parties as described in this policy. We also maintain some records of Users who contact us for support, for the purpose of responding to such queries and other related activities. However, we do not provide this information to any third party without your permission, or utilize the same for any purposes not set out here.</p>
            <p><strong class="sub-header">What Information Are We Are Collecting:</strong></p>
            <ul>
                <li>
                    <p>Your first and last name, email and company name when register to use the app</p>
                </li>
            </ul>
            <p><strong class="sub-header">How We Use the Information:</strong></p>
            <p>What do we do with the information we collect? The short answer is: Provide you an up-to-date set of products and services that we are relentlessly improving. Here are some of the ways we will use the information you provide to do that:</p>
            <ul>
                <li>
                    <p>Develop, operate, improve, deliver, maintain, and communicate changes product features from time to time</p>
                </li>
                <li>
                    <p>Send you communications by email. For example, we may use your email to respond to questions you have on our products or support inquires to share information about our products and services that we think may interest you</p>
                </li>
                <li>
                    <p>Monitor and analyze trends</p>
                </li>
                <li>
                    <p>Personalize the product, among other things including dashboard content that are relevant to your industry and departments challenges</p>
                </li>
                <li>
                    <p>Contextualize your experience, using visual experiences relevant to your industry, for example as a healthcare provider or hospital network</p>
                </li>
                <li>
                    <p>Diagnose or fix technology problems</p>
                </li>
                <li>
                    <p>Remember information so you will not have to reenter it during your next launch of the app.</p>
                </li>
            </ul>
        </div>
        <div class="modal__footer">
            <span id="closeButton" onclick="removeThis('myModal')" class="register close-button" >&times;</span>
        </div>
    </div>
</div>

</body>

<script type="text/javascript">
    function registerForm(evt) """),format.raw/*444.32*/("""{"""),format.raw/*444.33*/("""
        """),format.raw/*445.9*/("""evt.preventDefault();
        var isValidForm = validateForm();
        if(!isValidForm)"""),format.raw/*447.25*/("""{"""),format.raw/*447.26*/("""
            """),format.raw/*448.13*/("""return;
        """),format.raw/*449.9*/("""}"""),format.raw/*449.10*/("""
        """),format.raw/*450.9*/("""removeThis("cpasswordMessage");
        removeThis("responseBlock");
        var isMatching = checkPassword();
        if(!isMatching)"""),format.raw/*453.24*/("""{"""),format.raw/*453.25*/("""
            """),format.raw/*454.13*/("""return;
        """),format.raw/*455.9*/("""}"""),format.raw/*455.10*/("""
        """),format.raw/*456.9*/("""var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var company = document.getElementById("company").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var cpassword = document.getElementById("cpassword").value;
        var url = window.location.protocol + "//" + window.location.host + "/v1/cs/campaign/user/add";
        postData(url, fname, lname, company, email, password)
    """),format.raw/*464.5*/("""}"""),format.raw/*464.6*/("""



    """),format.raw/*468.5*/("""function postData(url, fn, ln, cmp, mail, pass) """),format.raw/*468.53*/("""{"""),format.raw/*468.54*/("""
        """),format.raw/*469.9*/("""var data = new FormData();
        data.append('first_name', fn);
        data.append('last_name', ln);
        data.append('company_name', cmp);
        data.append('username', mail);
        data.append('password', pass);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function () """),format.raw/*477.34*/("""{"""),format.raw/*477.35*/("""

        """),format.raw/*479.9*/("""}"""),format.raw/*479.10*/(""";
        xhr.onreadystatechange = function() """),format.raw/*480.45*/("""{"""),format.raw/*480.46*/("""
            """),format.raw/*481.13*/("""if(xhr.readyState === 4) """),format.raw/*481.38*/("""{"""),format.raw/*481.39*/("""
                """),format.raw/*482.17*/("""var response = JSON.parse(xhr.response);
                var resMsg = response.Msg;
                var resStat = response.Status;
                showThis("responseBlock");
                appendMsg(resStat, resMsg);
                window.scrollTo("""),format.raw/*487.33*/("""{"""),format.raw/*487.34*/(""" """),format.raw/*487.35*/("""top: 0, behavior: 'smooth' """),format.raw/*487.62*/("""}"""),format.raw/*487.63*/(""");
                if(resStat == "Success")"""),format.raw/*488.41*/("""{"""),format.raw/*488.42*/("""
                    """),format.raw/*489.21*/("""initForm();
                """),format.raw/*490.17*/("""}"""),format.raw/*490.18*/("""
            """),format.raw/*491.13*/("""}"""),format.raw/*491.14*/("""
        """),format.raw/*492.9*/("""}"""),format.raw/*492.10*/("""
        """),format.raw/*493.9*/("""xhr.send(data);
    """),format.raw/*494.5*/("""}"""),format.raw/*494.6*/("""

    """),format.raw/*496.5*/("""function appendMsg(status, msg)"""),format.raw/*496.36*/("""{"""),format.raw/*496.37*/("""
        """),format.raw/*497.9*/("""var d = document.getElementById("responseContainer");
        d.innerText = msg;
        if(status == "Success")"""),format.raw/*499.32*/("""{"""),format.raw/*499.33*/("""
            """),format.raw/*500.13*/("""d.className = "alert alert-success";
        """),format.raw/*501.9*/("""}"""),format.raw/*501.10*/("""
        """),format.raw/*502.9*/("""else if(status == "Info")"""),format.raw/*502.34*/("""{"""),format.raw/*502.35*/("""
            """),format.raw/*503.13*/("""d.className = "alert alert-info";
        """),format.raw/*504.9*/("""}"""),format.raw/*504.10*/("""
        """),format.raw/*505.9*/("""else if(status == "Failure")"""),format.raw/*505.37*/("""{"""),format.raw/*505.38*/("""
            """),format.raw/*506.13*/("""d.className = "alert alert-danger";
        """),format.raw/*507.9*/("""}"""),format.raw/*507.10*/("""
        """),format.raw/*508.9*/("""else
            d.className = "alert alert-warning";

    """),format.raw/*511.5*/("""}"""),format.raw/*511.6*/("""

    """),format.raw/*513.5*/("""function initForm()"""),format.raw/*513.24*/("""{"""),format.raw/*513.25*/("""
        """),format.raw/*514.9*/("""document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("company").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("cpassword").value = "";
    """),format.raw/*520.5*/("""}"""),format.raw/*520.6*/("""

    """),format.raw/*522.5*/("""function showThis(id)"""),format.raw/*522.26*/("""{"""),format.raw/*522.27*/("""
        """),format.raw/*523.9*/("""var d = document.getElementById(id);
        d.style.display = "block";
    """),format.raw/*525.5*/("""}"""),format.raw/*525.6*/("""

    """),format.raw/*527.5*/("""function removeThis(id)"""),format.raw/*527.28*/("""{"""),format.raw/*527.29*/("""
        """),format.raw/*528.9*/("""var d = document.getElementById(id);
        d.style.display = "none";
    """),format.raw/*530.5*/("""}"""),format.raw/*530.6*/("""

    """),format.raw/*532.5*/("""function checkPassword() """),format.raw/*532.30*/("""{"""),format.raw/*532.31*/("""
        """),format.raw/*533.9*/("""if (document.getElementById('password').value ==
            document.getElementById('cpassword').value) """),format.raw/*534.57*/("""{"""),format.raw/*534.58*/("""
            """),format.raw/*535.13*/("""return true;
        """),format.raw/*536.9*/("""}"""),format.raw/*536.10*/(""" """),format.raw/*536.11*/("""else """),format.raw/*536.16*/("""{"""),format.raw/*536.17*/("""
            """),format.raw/*537.13*/("""showThis('cpasswordMessage')
            document.getElementById('cpasswordMessage').style.color = 'red';
            document.getElementById('cpasswordMessage').innerHTML = "Passwords do not match";
            return false;
        """),format.raw/*541.9*/("""}"""),format.raw/*541.10*/("""
    """),format.raw/*542.5*/("""}"""),format.raw/*542.6*/("""

    """),format.raw/*544.5*/("""var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    btn.onclick = function() """),format.raw/*546.30*/("""{"""),format.raw/*546.31*/("""
      """),format.raw/*547.7*/("""modal.style.display = "block";
      modalContent.scrollTop= 0;
    """),format.raw/*549.5*/("""}"""),format.raw/*549.6*/("""
    """),format.raw/*550.5*/("""window.onclick = function(event) """),format.raw/*550.38*/("""{"""),format.raw/*550.39*/("""
      """),format.raw/*551.7*/("""if (event.target == modal) """),format.raw/*551.34*/("""{"""),format.raw/*551.35*/("""
        """),format.raw/*552.9*/("""modal.style.display = "none";
      """),format.raw/*553.7*/("""}"""),format.raw/*553.8*/("""
    """),format.raw/*554.5*/("""}"""),format.raw/*554.6*/("""
    """),format.raw/*555.5*/("""var modalContent = document.getElementsByClassName("modal__content")[0];
    var modalHeader = document.getElementsByClassName("modal__header")[0];
    modalContent.onscroll = function(event) """),format.raw/*557.45*/("""{"""),format.raw/*557.46*/("""
      """),format.raw/*558.7*/("""if(modalContent.scrollTop < 20)"""),format.raw/*558.38*/("""{"""),format.raw/*558.39*/("""
        """),format.raw/*559.9*/("""modalHeader.className = "modal__header without-box-shadow";
      """),format.raw/*560.7*/("""}"""),format.raw/*560.8*/("""
      """),format.raw/*561.7*/("""else"""),format.raw/*561.11*/("""{"""),format.raw/*561.12*/("""
        """),format.raw/*562.9*/("""modalHeader.className = "modal__header with-box-shadow";
      """),format.raw/*563.7*/("""}"""),format.raw/*563.8*/("""
    """),format.raw/*564.5*/("""}"""),format.raw/*564.6*/("""


    """),format.raw/*567.5*/("""function validateForm() """),format.raw/*567.29*/("""{"""),format.raw/*567.30*/("""
        """),format.raw/*568.9*/("""var fname = document.forms["registration_form"]["fname"];
        var lname = document.forms["registration_form"]["lname"];
        var company = document.forms["registration_form"]["company"];
        var email = document.forms["registration_form"]["email"];
        var password = document.forms["registration_form"]["password"];
        var cpassword = document.forms["registration_form"]["cpassword"];

        if (fname.value == "")
        """),format.raw/*576.9*/("""{"""),format.raw/*576.10*/("""
            """),format.raw/*577.13*/("""showValidationErrorMessage("fnameMessage", "Please enter your first name.");
            fname.focus();
            return false;
        """),format.raw/*580.9*/("""}"""),format.raw/*580.10*/("""

        """),format.raw/*582.9*/("""// if (lname.value == "")
        // """),format.raw/*583.12*/("""{"""),format.raw/*583.13*/("""
        """),format.raw/*584.9*/("""//     showValidationErrorMessage("lnameMessage", "Please enter your last name.");
        //     lname.focus();
        //     return false;
        // """),format.raw/*587.12*/("""}"""),format.raw/*587.13*/("""

        """),format.raw/*589.9*/("""// if (company.value == "")
        // """),format.raw/*590.12*/("""{"""),format.raw/*590.13*/("""
        """),format.raw/*591.9*/("""//     showValidationErrorMessage("comapnyMessage", "Please enter your company name.");
        //     company.focus();
        //     return false;
        // """),format.raw/*594.12*/("""}"""),format.raw/*594.13*/("""

        """),format.raw/*596.9*/("""if (email.value == "" || !validateEmail(email.value))
        """),format.raw/*597.9*/("""{"""),format.raw/*597.10*/("""
            """),format.raw/*598.13*/("""showValidationErrorMessage("emailMessage", "Please enter a valid e-mail address.");
            email.focus();
            return false;
        """),format.raw/*601.9*/("""}"""),format.raw/*601.10*/("""

        """),format.raw/*603.9*/("""if (password.value == "" || !validatePassword(password.value))
        """),format.raw/*604.9*/("""{"""),format.raw/*604.10*/("""
            """),format.raw/*605.13*/("""// showValidationErrorMessage("passwordMessage", "Please match the format requested.");
            password.focus();
            return false;
        """),format.raw/*608.9*/("""}"""),format.raw/*608.10*/("""

        """),format.raw/*610.9*/("""if (cpassword.value == "")
        """),format.raw/*611.9*/("""{"""),format.raw/*611.10*/("""
            """),format.raw/*612.13*/("""showValidationErrorMessage("cpasswordMessage", "Please confirm your password.");
            cpassword.focus();
            return false;
        """),format.raw/*615.9*/("""}"""),format.raw/*615.10*/("""

        """),format.raw/*617.9*/("""return true;
    """),format.raw/*618.5*/("""}"""),format.raw/*618.6*/("""

    """),format.raw/*620.5*/("""function showValidationErrorMessage(elemId, msg) """),format.raw/*620.54*/("""{"""),format.raw/*620.55*/("""
        """),format.raw/*621.9*/("""showThis(elemId)
        document.getElementById(elemId).style.color = 'red';
        document.getElementById(elemId).innerHTML = msg;
    """),format.raw/*624.5*/("""}"""),format.raw/*624.6*/("""

    """),format.raw/*626.5*/("""function removeMessage(inputFieldId, msgId)"""),format.raw/*626.48*/("""{"""),format.raw/*626.49*/("""
        """),format.raw/*627.9*/("""var inputText = document.getElementById(inputFieldId).value;
        if(inputFieldId == 'password')"""),format.raw/*628.39*/("""{"""),format.raw/*628.40*/("""
            """),format.raw/*629.13*/("""var isPasswordValid = validatePassword(inputText);
            if(isPasswordValid)"""),format.raw/*630.32*/("""{"""),format.raw/*630.33*/("""
                """),format.raw/*631.17*/("""removeThis(msgId);
            """),format.raw/*632.13*/("""}"""),format.raw/*632.14*/("""
        """),format.raw/*633.9*/("""}"""),format.raw/*633.10*/("""
        """),format.raw/*634.9*/("""else if(inputFieldId == 'email')"""),format.raw/*634.41*/("""{"""),format.raw/*634.42*/("""
            """),format.raw/*635.13*/("""var isEmailValid = validateEmail(inputText);
            if(isEmailValid)"""),format.raw/*636.29*/("""{"""),format.raw/*636.30*/("""
                """),format.raw/*637.17*/("""removeThis(msgId);
            """),format.raw/*638.13*/("""}"""),format.raw/*638.14*/("""
        """),format.raw/*639.9*/("""}"""),format.raw/*639.10*/("""
        """),format.raw/*640.9*/("""else"""),format.raw/*640.13*/("""{"""),format.raw/*640.14*/("""
            """),format.raw/*641.13*/("""if(inputText.length > 0)"""),format.raw/*641.37*/("""{"""),format.raw/*641.38*/("""
                """),format.raw/*642.17*/("""removeThis(msgId);
            """),format.raw/*643.13*/("""}"""),format.raw/*643.14*/("""
        """),format.raw/*644.9*/("""}"""),format.raw/*644.10*/("""
    """),format.raw/*645.5*/("""}"""),format.raw/*645.6*/("""

    """),format.raw/*647.5*/("""function validateEmail(email) """),format.raw/*647.35*/("""{"""),format.raw/*647.36*/("""
        """),format.raw/*648.9*/("""var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]"""),format.raw/*648.93*/("""{"""),format.raw/*648.94*/("""1,3"""),format.raw/*648.97*/("""}"""),format.raw/*648.98*/("""\.[0-9]"""),format.raw/*648.105*/("""{"""),format.raw/*648.106*/("""1,3"""),format.raw/*648.109*/("""}"""),format.raw/*648.110*/("""\.[0-9]"""),format.raw/*648.117*/("""{"""),format.raw/*648.118*/("""1,3"""),format.raw/*648.121*/("""}"""),format.raw/*648.122*/("""\.[0-9]"""),format.raw/*648.129*/("""{"""),format.raw/*648.130*/("""1,3"""),format.raw/*648.133*/("""}"""),format.raw/*648.134*/("""\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]"""),format.raw/*648.166*/("""{"""),format.raw/*648.167*/("""2,"""),format.raw/*648.169*/("""}"""),format.raw/*648.170*/("""))$/;
        return re.test(String(email).toLowerCase());
    """),format.raw/*650.5*/("""}"""),format.raw/*650.6*/("""

    """),format.raw/*652.5*/("""function validatePassword(passwordText) """),format.raw/*652.45*/("""{"""),format.raw/*652.46*/("""
        """),format.raw/*653.9*/("""if(passwordText.length < 6 && passwordText.length > 40)"""),format.raw/*653.64*/("""{"""),format.raw/*653.65*/("""
            """),format.raw/*654.13*/("""return false;
        """),format.raw/*655.9*/("""}"""),format.raw/*655.10*/("""
        """),format.raw/*656.9*/("""var re = /^(?=.*?[a-z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s])."""),format.raw/*656.71*/("""{"""),format.raw/*656.72*/("""6,"""),format.raw/*656.74*/("""}"""),format.raw/*656.75*/("""$/;
        return re.test(String(passwordText));
    """),format.raw/*658.5*/("""}"""),format.raw/*658.6*/("""
    """),format.raw/*659.5*/("""</script>
</html>
"""))
      }
    }
  }

  def render(clinsightLogo:String): play.twirl.api.HtmlFormat.Appendable = apply(clinsightLogo)

  def f:((String) => play.twirl.api.HtmlFormat.Appendable) = (clinsightLogo) => apply(clinsightLogo)

  def ref: this.type = this

}


}

/**/
object clinsightRegistrationForm extends clinsightRegistrationForm_Scope0.clinsightRegistrationForm
              /*
                  -- GENERATED --
                  DATE: Mon Feb 21 16:24:28 IST 2022
                  SOURCE: /home/ritesh/development/UserManagementServer/app/views/clinsightRegistrationForm.scala.html
                  HASH: d10cc1a3b53c8dbcf29a02f94c20787359e63c58
                  MATRIX: 567->1|685->24|712->25|1463->748|1492->749|1533->762|1592->794|1621->795|1658->805|1691->810|1720->811|1761->824|1833->869|1862->870|1899->880|2019->972|2048->973|2089->986|2374->1244|2403->1245|2440->1255|2487->1274|2516->1275|2557->1288|2629->1333|2658->1334|2696->1345|2813->1434|2842->1435|2883->1448|2935->1473|2964->1474|3002->1485|3036->1491|3065->1492|3106->1505|3203->1575|3232->1576|3269->1586|3316->1605|3345->1606|3386->1619|3913->2119|3942->2120|3979->2130|4032->2155|4061->2156|4102->2169|4164->2204|4193->2205|4230->2215|4269->2226|4298->2227|4339->2240|4511->2385|4540->2386|4577->2396|4613->2404|4642->2405|4683->2418|4784->2492|4813->2493|4850->2503|4886->2511|4915->2512|4956->2525|5057->2599|5086->2600|5123->2610|5160->2619|5189->2620|5230->2633|5332->2708|5361->2709|5399->2719|5484->2775|5514->2776|5556->2789|5658->2863|5688->2864|5726->2874|5758->2877|5788->2878|5830->2891|6003->3036|6033->3037|6071->3047|6112->3059|6142->3060|6184->3073|6238->3099|6268->3100|6306->3110|6344->3119|6374->3120|6416->3133|6499->3188|6529->3189|6567->3199|6602->3205|6632->3206|6674->3219|6763->3280|6793->3281|6831->3291|6867->3298|6897->3299|6939->3312|7098->3443|7128->3444|7166->3454|7210->3469|7240->3470|7282->3483|7408->3581|7438->3582|7476->3592|7517->3604|7547->3605|7589->3618|7715->3716|7745->3717|7783->3727|7827->3742|7857->3743|7899->3756|8025->3854|8055->3855|8093->3865|8136->3879|8166->3880|8208->3893|8334->3991|8364->3992|8402->4002|8435->4006|8465->4007|8507->4020|8614->4099|8644->4100|8682->4110|8718->4117|8748->4118|8790->4131|9124->4437|9154->4438|9192->4448|9237->4464|9267->4465|9309->4478|9563->4704|9593->4705|9631->4715|9686->4741|9716->4742|9758->4755|9842->4811|9872->4812|9910->4822|9959->4842|9989->4843|10031->4856|10082->4879|10112->4880|10150->4890|10202->4913|10232->4914|10274->4927|10355->4980|10385->4981|10423->4991|10496->5035|10526->5036|10566->5047|11052->5505|11082->5506|11120->5516|11192->5559|11222->5560|11262->5571|11488->5769|11518->5770|11556->5780|11629->5824|11659->5825|11699->5836|11878->5987|11908->5988|11946->5998|12022->6045|12052->6046|12092->6057|12201->6138|12231->6139|12269->6149|12312->6163|12342->6164|12382->6175|12479->6244|12509->6245|12546->6254|12591->6270|12621->6271|12661->6282|12730->6323|12760->6324|12797->6333|12845->6352|12875->6353|12915->6364|12969->6390|12999->6391|13036->6400|13080->6415|13110->6416|13152->6429|13348->6597|13378->6598|13415->6607|13484->6647|13514->6648|13556->6661|13637->6714|13667->6715|13704->6724|13749->6740|13779->6741|13819->6752|14057->6962|14087->6963|14124->6972|14166->6985|14196->6986|14236->6997|14410->7143|14440->7144|14477->7153|14523->7170|14553->7171|14593->7182|14816->7377|14846->7378|14883->7387|14923->7398|14953->7399|14993->7410|15131->7520|15161->7521|15199->7531|15418->7722|15448->7723|15490->7736|15602->7819|15632->7820|15678->7837|15764->7894|15794->7895|15837->7909|15877->7920|15907->7921|15953->7938|16007->7963|16037->7964|16079->7977|16120->7989|16150->7990|16196->8007|16250->8032|16280->8033|16317->8042|16347->8043|16380->8048|16560->8200|16595->8213|18322->9910|18353->9911|18385->9913|18416->9914|23054->14524|23084->14525|23121->14534|23238->14622|23268->14623|23310->14636|23354->14652|23384->14653|23421->14662|23584->14796|23614->14797|23656->14810|23700->14826|23730->14827|23767->14836|24334->15375|24363->15376|24399->15384|24476->15432|24506->15433|24543->15442|24906->15776|24936->15777|24974->15787|25004->15788|25079->15834|25109->15835|25151->15848|25205->15873|25235->15874|25281->15891|25560->16141|25590->16142|25620->16143|25676->16170|25706->16171|25778->16214|25808->16215|25858->16236|25915->16264|25945->16265|25987->16278|26017->16279|26054->16288|26084->16289|26121->16298|26169->16318|26198->16319|26232->16325|26292->16356|26322->16357|26359->16366|26500->16478|26530->16479|26572->16492|26645->16537|26675->16538|26712->16547|26766->16572|26796->16573|26838->16586|26908->16628|26938->16629|26975->16638|27032->16666|27062->16667|27104->16680|27176->16724|27206->16725|27243->16734|27330->16793|27359->16794|27393->16800|27441->16819|27471->16820|27508->16829|27859->17152|27888->17153|27922->17159|27972->17180|28002->17181|28039->17190|28143->17266|28172->17267|28206->17273|28258->17296|28288->17297|28325->17306|28428->17381|28457->17382|28491->17388|28545->17413|28575->17414|28612->17423|28746->17528|28776->17529|28818->17542|28867->17563|28897->17564|28927->17565|28961->17570|28991->17571|29033->17584|29295->17818|29325->17819|29358->17824|29387->17825|29421->17831|29575->17956|29605->17957|29640->17964|29736->18032|29765->18033|29798->18038|29860->18071|29890->18072|29925->18079|29981->18106|30011->18107|30048->18116|30112->18152|30141->18153|30174->18158|30203->18159|30236->18164|30457->18356|30487->18357|30522->18364|30582->18395|30612->18396|30649->18405|30743->18471|30772->18472|30807->18479|30840->18483|30870->18484|30907->18493|30998->18556|31027->18557|31060->18562|31089->18563|31124->18570|31177->18594|31207->18595|31244->18604|31718->19050|31748->19051|31790->19064|31956->19202|31986->19203|32024->19213|32090->19250|32120->19251|32157->19260|32339->19413|32369->19414|32407->19424|32475->19463|32505->19464|32542->19473|32731->19633|32761->19634|32799->19644|32889->19706|32919->19707|32961->19720|33134->19865|33164->19866|33202->19876|33301->19947|33331->19948|33373->19961|33553->20113|33583->20114|33621->20124|33684->20159|33714->20160|33756->20173|33930->20319|33960->20320|33998->20330|34043->20347|34072->20348|34106->20354|34184->20403|34214->20404|34251->20413|34418->20552|34447->20553|34481->20559|34553->20602|34583->20603|34620->20612|34748->20711|34778->20712|34820->20725|34931->20807|34961->20808|35007->20825|35067->20856|35097->20857|35134->20866|35164->20867|35201->20876|35262->20908|35292->20909|35334->20922|35436->20995|35466->20996|35512->21013|35572->21044|35602->21045|35639->21054|35669->21055|35706->21064|35739->21068|35769->21069|35811->21082|35864->21106|35894->21107|35940->21124|36000->21155|36030->21156|36067->21165|36097->21166|36130->21171|36159->21172|36193->21178|36252->21208|36282->21209|36319->21218|36429->21302|36459->21303|36491->21306|36521->21307|36558->21314|36589->21315|36622->21318|36653->21319|36690->21326|36721->21327|36754->21330|36785->21331|36822->21338|36853->21339|36886->21342|36917->21343|36979->21375|37010->21376|37042->21378|37073->21379|37164->21442|37193->21443|37227->21449|37296->21489|37326->21490|37363->21499|37447->21554|37477->21555|37519->21568|37569->21590|37599->21591|37636->21600|37727->21662|37757->21663|37788->21665|37818->21666|37900->21720|37929->21721|37962->21726
                  LINES: 20->1|25->1|26->2|39->15|39->15|40->16|41->17|41->17|43->19|43->19|43->19|44->20|45->21|45->21|47->23|49->25|49->25|50->26|58->34|58->34|60->36|60->36|60->36|61->37|62->38|62->38|65->41|65->41|65->41|66->42|67->43|67->43|70->46|70->46|70->46|71->47|73->49|73->49|75->51|75->51|75->51|76->52|92->68|92->68|94->70|94->70|94->70|95->71|96->72|96->72|98->74|98->74|98->74|99->75|104->80|104->80|106->82|106->82|106->82|107->83|110->86|110->86|112->88|112->88|112->88|113->89|116->92|116->92|118->94|118->94|118->94|119->95|122->98|122->98|124->100|125->101|125->101|126->102|129->105|129->105|131->107|131->107|131->107|132->108|137->113|137->113|139->115|139->115|139->115|140->116|141->117|141->117|143->119|143->119|143->119|144->120|146->122|146->122|148->124|148->124|148->124|149->125|151->127|151->127|153->129|153->129|153->129|154->130|158->134|158->134|160->136|160->136|160->136|161->137|164->140|164->140|166->142|166->142|166->142|167->143|170->146|170->146|172->148|172->148|172->148|173->149|176->152|176->152|178->154|178->154|178->154|179->155|182->158|182->158|184->160|184->160|184->160|185->161|188->164|188->164|190->166|190->166|190->166|191->167|200->176|200->176|202->178|202->178|202->178|203->179|210->186|210->186|212->188|212->188|212->188|213->189|215->191|215->191|217->193|217->193|217->193|218->194|219->195|219->195|221->197|221->197|221->197|222->198|224->200|224->200|226->202|227->203|227->203|228->204|239->215|239->215|241->217|242->218|242->218|243->219|250->226|250->226|252->228|253->229|253->229|254->230|260->236|260->236|262->238|263->239|263->239|264->240|267->243|267->243|269->245|269->245|269->245|270->246|272->248|272->248|273->249|273->249|273->249|274->250|275->251|275->251|276->252|276->252|276->252|277->253|278->254|278->254|279->255|279->255|279->255|280->256|286->262|286->262|287->263|288->264|288->264|289->265|291->267|291->267|292->268|292->268|292->268|293->269|300->276|300->276|301->277|301->277|301->277|302->278|307->283|307->283|308->284|308->284|308->284|309->285|314->290|314->290|315->291|315->291|315->291|316->292|319->295|319->295|321->297|322->298|322->298|323->299|326->302|326->302|327->303|329->305|329->305|331->307|331->307|331->307|332->308|333->309|333->309|334->310|334->310|334->310|335->311|336->312|336->312|337->313|337->313|338->314|345->321|345->321|383->359|383->359|383->359|383->359|468->444|468->444|469->445|471->447|471->447|472->448|473->449|473->449|474->450|477->453|477->453|478->454|479->455|479->455|480->456|488->464|488->464|492->468|492->468|492->468|493->469|501->477|501->477|503->479|503->479|504->480|504->480|505->481|505->481|505->481|506->482|511->487|511->487|511->487|511->487|511->487|512->488|512->488|513->489|514->490|514->490|515->491|515->491|516->492|516->492|517->493|518->494|518->494|520->496|520->496|520->496|521->497|523->499|523->499|524->500|525->501|525->501|526->502|526->502|526->502|527->503|528->504|528->504|529->505|529->505|529->505|530->506|531->507|531->507|532->508|535->511|535->511|537->513|537->513|537->513|538->514|544->520|544->520|546->522|546->522|546->522|547->523|549->525|549->525|551->527|551->527|551->527|552->528|554->530|554->530|556->532|556->532|556->532|557->533|558->534|558->534|559->535|560->536|560->536|560->536|560->536|560->536|561->537|565->541|565->541|566->542|566->542|568->544|570->546|570->546|571->547|573->549|573->549|574->550|574->550|574->550|575->551|575->551|575->551|576->552|577->553|577->553|578->554|578->554|579->555|581->557|581->557|582->558|582->558|582->558|583->559|584->560|584->560|585->561|585->561|585->561|586->562|587->563|587->563|588->564|588->564|591->567|591->567|591->567|592->568|600->576|600->576|601->577|604->580|604->580|606->582|607->583|607->583|608->584|611->587|611->587|613->589|614->590|614->590|615->591|618->594|618->594|620->596|621->597|621->597|622->598|625->601|625->601|627->603|628->604|628->604|629->605|632->608|632->608|634->610|635->611|635->611|636->612|639->615|639->615|641->617|642->618|642->618|644->620|644->620|644->620|645->621|648->624|648->624|650->626|650->626|650->626|651->627|652->628|652->628|653->629|654->630|654->630|655->631|656->632|656->632|657->633|657->633|658->634|658->634|658->634|659->635|660->636|660->636|661->637|662->638|662->638|663->639|663->639|664->640|664->640|664->640|665->641|665->641|665->641|666->642|667->643|667->643|668->644|668->644|669->645|669->645|671->647|671->647|671->647|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|672->648|674->650|674->650|676->652|676->652|676->652|677->653|677->653|677->653|678->654|679->655|679->655|680->656|680->656|680->656|680->656|680->656|682->658|682->658|683->659
                  -- GENERATED --
              */
          