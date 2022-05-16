import { Component, OnInit } from '@angular/core';
import * as animationConsts from '../shared/animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import * as api from '../shared/resource';
import * as pattern from '../admin/user/global';
import * as globals from '../shared/global';
import { emailError, passError, errorCodeMsg } from '../shared/message';
import { environment } from '../../environments/environment';
import {
  QaTestingCaptcha, QaCaptchaKey, DevCaptchaKey, CaptchaFeature, MaxLoginAttemptForCaptcha, sitekey, resendOtpTime, resendAttempt,
  resendAttemptLimit, secondsInterval, successShowTime, otpExpiryTime, userDisabledMsg, ResendLimitMsg, userDisbleMsgLogin, resendSuccessMsg
} from './global'
import { DataResponse } from './login.modal'
import { applicationProtocol } from '../shared/global';
import {ToastService} from '../shared/toast-notification/toast-service.service';
import { toastTypes,  toastDelay} from '../shared/global';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [animationConsts.highlightElement, animationConsts.highlightMessage]
})
export class LoginComponent implements OnInit {
  imageDir = environment.baseImageDir;
  loginForm: FormGroup;
  otpForm: FormGroup
  submitted = false;
  showError = false;
  errorMsg = '';
  result = [];
  res: any;
  validateClassEmail = '';
  validateClassPass = '';
  errMsgEmail = '';
  errMsgPass = '';
  hideMsgEmail = true;
  hideMsgPass = true;
  emailMsg = emailError;
  passMsg = passError;
  showMsgEmail = animationConsts.hideState;
  showMsgPass = animationConsts.hideState;
  QaTestingCaptcha = QaTestingCaptcha;
  QaCaptchaKey = QaCaptchaKey;
  DevCaptchaKey = DevCaptchaKey;
  CaptchaFeature = CaptchaFeature;
  MaxLoginAttemptForCaptcha = MaxLoginAttemptForCaptcha;
  sitekey = sitekey;
  captchaResponse: string = '';
  remainingAttempt: any;
  isCaptchaEnabled = false;
  err: any;
  otp = '';
  timeout: string = "";
  maskedMail: string = ""
  mobileNum: string = "23456789876";
  showMobMsg: boolean = false;
  enableResend: boolean = true;
  userValidated: boolean = false;
  resendOtpTime = resendOtpTime;
  resendAttempt = resendAttempt;
  resendAttemptLimit = resendAttemptLimit;
  timeleft = resendOtpTime;
  showTimer = false;
  showResendAlert: boolean = false;
  otpSubmitted: boolean = false;
  successShowTime = successShowTime;
  secondsInterval = secondsInterval;
  otpExpiryTime = otpExpiryTime;
  loading: boolean = false;
  ResendLimitMsg = ResendLimitMsg;
  userDisabledMsg = userDisabledMsg;
  userDisbleMsgLogin = userDisbleMsgLogin;
  resendSuccessMsg = resendSuccessMsg;

  response: any;
  userDetails: any;
  defaultRealm: string;
  defaultMps: string;
  defaultUrl: string;
  reCaptcha: any;
  mobile:boolean = false;
  successMsg = '';
  passwordCreated: boolean = false;
  userDomain:string;
  emailPattern = pattern.regex.email;
  


  /**************FILE COMMENTS***************
    * 
    * The file has implementation of Google invisible Recaptcha v2 via the npm package Ng-Recaptcha
    * https://www.npmjs.com/package/ng-recaptcha
    * Refer the above link for further documentation
    * 
    * This file has implementation of 2 Factor Authentication
    * Refer https://github.com/glassbeam/gblogin/wiki/2FA-(Two-Factor-Authentication)  for further documentation.
    * 
    */

  constructor(private route:ActivatedRoute, private router: Router, private loginService: LoginService, private formBuilder: FormBuilder, private toast:ToastService) { }
  ngOnInit() {

    if(this.route.snapshot.paramMap.get('code') !== ''){
      //this.successMsg = errorCodeMsg[this.route.snapshot.paramMap.get('code')];
      if(this.route.snapshot.paramMap.get('code') === '200')
        this.toast.show(errorCodeMsg[this.route.snapshot.paramMap.get('code')], { classname: toastTypes.green, delay: toastDelay });
      else if(errorCodeMsg.hasOwnProperty(errorCodeMsg[this.route.snapshot.paramMap.get('code')]))
        this.toast.show(errorCodeMsg[this.route.snapshot.paramMap.get('code')], { classname: toastTypes.red, delay: toastDelay });
      this.passwordCreated = true;
    }
    
    if (this.loginService.getCookie('mps') !== null) {
      if(this.loginService.getCookie('adminClick') === '1'){
      this.loginService.deleteCookie('adminClick');
        console.log("3");
	this.router.navigate(['/users']);
	}else {
	console.log("4");
        this.router.navigate(['/apps']);
	}	
    } 
    

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      //password: ['', [Validators.required, Validators.pattern(pattern.regex.password)]]
      password: ['', [Validators.required]]
    });
    //initilize otp form
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required]]

    });


    //on reload check if captcha should be enabled or not.
    if (this.CaptchaFeature && !this.userValidated) {
      if (localStorage.remainingAttempt) {
        this.remainingAttempt = parseInt(localStorage.remainingAttempt);
        if (this.remainingAttempt <= this.MaxLoginAttemptForCaptcha && this.remainingAttempt != 0) {
          this.isCaptchaEnabled = true;
        }
      }
    }
    this.showResendAlert = false;
    this.mobile = this.mobilecheck();
  }

  // mouseEnterEmail(event: Event) {
  //   this.errorMsg = '';
  //   event.stopPropagation();
  //   this.validateClassEmail = animationConsts.onElementState;
  // }
  // mouseEnterPass(event: Event) {
  //   this.errorMsg = '';
  //   event.stopPropagation();
  //   this.validateClassPass = animationConsts.onElementState;
  // }
  // validateForm() {
  //   this.errorMsg = '';
  //   this.validateClassEmail = (this.loginForm.controls.email.errors === null) ? animationConsts.successState : animationConsts.errorState;
  //   this.validateClassPass = (this.loginForm.controls.password.errors === null) ? animationConsts.successState : animationConsts.errorState;
  //   if (this.validateClassEmail === animationConsts.errorState) {
  //     this.errMsgEmail = this.emailMsg;
  //     this.showMsgEmail = animationConsts.showState;
  //   } else {
  //     this.showMsgEmail = animationConsts.hideState;
  //   }
  //   if (this.validateClassPass === animationConsts.errorState) {
  //     this.errMsgPass = this.passMsg;
  //     this.hideMsgPass = false;
  //     this.showMsgPass = animationConsts.showState;
  //   } else {
  //     this.showMsgPass = animationConsts.hideState;
  //   }
  //   const status = (this.validateClassEmail === animationConsts.errorState || this.validateClassPass === animationConsts.errorState)
  //     ? false : true;
  //   return status;
  // }
  
  forgotPasswordForm() {
    this.router.navigate(['/forgot-password']);
  }

  //called from html on form submit to execute captcha is its enabled as a feature
  onSubmit() {
    //this.reCaptcha = grecaptcha;
    this.submitted = true;
    //this.loading = true;
    //execute captcha is enabled
    if (this.CaptchaFeature && this.isCaptchaEnabled) {
      grecaptcha.execute();
      this.loginForm.value['captcha'] = this.captchaResponse;
    }
    //if captcha not enabled login normally
    else {
      this.loading = true;
      this.submitLogin();
    }
    // if (this.CaptchaFeature && this.isCaptchaEnabled) {
    //   grecaptcha.reset();
    // }
    // if (this.validateForm()) {

    // } else if (this.CaptchaFeature && this.isCaptchaEnabled) {
    //   grecaptcha.reset();
    // }
  }

  get login() {
    return this.loginForm.controls;
  }
  //Actual submit function
  submitLogin() {
    this.errorMsg = '';
    this.submitted = true;
    this.loginForm.value['mobile'] = this.mobile;
    if(this.loginForm.valid){
      this.loading = true;
      this.loginService.authenticateUser(this.loginForm.value, api.loginUser).subscribe((response: any) => {
        //remove from localstorage if login successful
        this.response = response;
        //If Two Factor Auth is enabled.
        if (response.TwoAuth) {
          this.timeout = response.Timeout || this.otpExpiryTime;
          this.maskedMail = response.Data[0].email;
          if (response.Data[0].phone) {
            this.mobileNum = response.Data[0].phone;
            this.showMobMsg = true;
          }
          this.userValidated = true;
          this.showTimer = true;
          this.timeleft = this.resendOtpTime;
          this.otpTimer();
        } else {
          if (localStorage.remainingAttempt) {
            localStorage.removeItem('remainingAttempt');
          }
          this.userDetails = this.response.Data.user_details;
          this.defaultRealm = this.userDetails.realm_def;
          this.defaultMps = this.userDetails.mps_def;
          this.defaultUrl = this.defaultRealm + '/' + this.userDetails.url_def;
          const milliseconds = (new Date).getTime();
          this.loginService.setCookie('mps', this.defaultMps);
          if (applicationProtocol === 'http') {
            this.defaultUrl = 'http://' + this.defaultUrl;
          } else {
            this.defaultUrl = 'https://' + this.defaultUrl;
      }
          this.userDomain =  this.loginForm.value.email.split('@')[1];
          if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(this.loginForm.value.email) !== -1){
                  this.loginService.setCookie('email',this.loginForm.value.email);
                  this.loginService.setCookie('password',this.loginForm.value.password);
      this.defaultUrl =  'https://' + globals.loginUrl;
      console.log("1");
                  window.open(this.defaultUrl + '?' + milliseconds, '_self');
          }
    else{
            console.log("2");
                  this.loginService.setCookie('mps', this.defaultMps);
                  window.open(this.defaultUrl + '?' + milliseconds, '_self');
          }
        }
        this.loading = false
      }, err => {
        this.loading = false;
        this.submitted = false;
        this.err = err;
        if (this.err.status === 0) {
          this.router.navigate(['/error', 0]);
        } else {
  
          //this.errorMsg = this.err.error.Msg;
          this.toast.show(this.err.error.Msg, { classname: toastTypes.red, delay: toastDelay, id:"loginErrorId" });
        }
        //reset captcha on login failure
        if (this.CaptchaFeature && this.isCaptchaEnabled) {
          grecaptcha.reset();
        }
        //based on attempt left enable captcha
        if (this.err.error.hasOwnProperty('RemainingAttempt') && this.err.error.RemainingAttempt > -1) {
          this.remainingAttempt = this.err.error.RemainingAttempt;
          localStorage.setItem("remainingAttempt", this.remainingAttempt);
          if (this.CaptchaFeature) {
            if (this.remainingAttempt <= this.MaxLoginAttemptForCaptcha && this.remainingAttempt != 0) {
              this.isCaptchaEnabled = true;
              //reload and show captcha if failed attempt >5 and captcha feature is enabled
              this.router.navigate(['/login']);
            } else if (this.remainingAttempt == 0) {
              //this.errorMsg = this.userDisbleMsgLogin;
              this.toast.show(this.userDisbleMsgLogin, { classname: toastTypes.red, delay: toastDelay, id:"userDisabledLogin" });
              delete this.loginForm.value.captcha;
              this.isCaptchaEnabled = false;
              localStorage.removeItem('remainingAttempt');
            }
          }else if (this.remainingAttempt == 0) {
            //this.errorMsg = this.userDisbleMsgLogin;
            this.toast.show(this.userDisbleMsgLogin, { classname: toastTypes.red, delay: toastDelay, id:"userDisabledLogin" });
            localStorage.removeItem('remainingAttempt');
          }
        }
      });
    }else{
      this.loading = false;
    }
  }

  //callback function for captcha called from html after captcha is generated
  resolved(captchaResponse: string) {
    //store the captcha response to send it to server verification
    this.loginForm.value['captcha'] = captchaResponse;
    this.submitLogin();
  }

  //resend OTP Function
  resendOTP() {
    this.errorMsg = '';
    this.loading = true;
    this.enableResend = true;
    this.otpForm.patchValue({
      otp: ''
    });
    if (this.resendAttempt == this.resendAttemptLimit) {
      this.userValidated = false;
      this.submitted = false;
      this.loading = false;
      this.resendAttempt = 0;
      this.toast.show(this.ResendLimitMsg, { classname: toastTypes.red, delay: toastDelay, id:"ResendLimitMsg" });
    } else {
      this.resendAttempt++;
      this.timeleft = this.resendOtpTime;

      let param = { "email": this.loginForm.value.email }
      this.loginService.resendOtp(param, api.resendOtp).subscribe((response: any) => {
        this.showTimer = true;
        this.otpTimer();
        //this.showResendAlert = true;
        this.toast.show(this.resendSuccessMsg, { classname: toastTypes.green, delay: toastDelay, id:"resendSuccessMsg" });
        // setTimeout(() => {
        //   this.showResendAlert = false;
        // }, this.successShowTime);
        this.loading = false;
      }, err => {
        this.showTimer = true;
        this.otpTimer();
        this.err = err;
        this.loading = false;
        //this.errorMsg = this.err.error.Msg;
        this.toast.show(this.err.error.Msg, { classname: toastTypes.red, delay: toastDelay, id:"resendError" });
      });
    }
  }

  //Validate OTP Function
  validateOTP() {
    this.errorMsg = '';
    this.otpSubmitted = true;
    if (this.otpForm.invalid) {
      //this.otpForm.controls['otp'].setErrors({ 'required': true });
      return;
    } else if (this.otpForm.status == "VALID") {
      this.loading = true;
      var param = { "email": this.loginForm.value.email, "otp": this.otpForm.value.otp };
      this.loginService.verifyOTP(param, api.verifyOTP).subscribe((response: any) => {
        if (localStorage.remainingAttempt) {
          localStorage.removeItem('remainingAttempt');
        }
        this.response = response;
        this.userDetails = this.response.Data.user_details;
        this.defaultRealm = this.userDetails.realm_def;
        this.defaultMps = this.userDetails.mps_def;
        this.defaultUrl = this.defaultRealm + '/' + this.userDetails.url_def;
        const milliseconds = (new Date).getTime();
        this.loginService.setCookie('mps', this.defaultMps);
        if (applicationProtocol === 'http') {
          this.defaultUrl = 'http://' + this.defaultUrl;
        } else {
          this.defaultUrl = 'https://' + this.defaultUrl;
        }
        window.open(this.defaultUrl + '?' + milliseconds, '_self');
      }, err => {
        this.err = err;
        //invalid otp
        //this.errorMsg = this.err.error.Msg;
        this.toast.show(this.err.error.Msg, { classname: toastTypes.red, delay: toastDelay, id:"otpValidationError" });
        this.otpSubmitted = false;
        //No captcha here!
        //based on attempts  if attempt == 0 indicates that user has been disabled/inactive. Redirect him to login page
        if (this.err.error.hasOwnProperty('RemainingAttempt') && this.err.error.RemainingAttempt > -1) {
          this.remainingAttempt = err.error.RemainingAttempt;
          localStorage.setItem("remainingAttempt", this.remainingAttempt);
          if (this.remainingAttempt == 0) {
            this.userValidated = false;
            this.submitted = false;
            //this.errorMsg = this.userDisabledMsg;
            this.toast.show(this.userDisabledMsg, { classname: toastTypes.red, delay: toastDelay, id:"userDisabledMsg" });
            this.isCaptchaEnabled = false;
            this.otpForm.patchValue({
              otp: ''
            });
            localStorage.removeItem('remainingAttempt');
          }
        }
        this.loading = false;
      });
    }
  }

  //otp resend timer function
  otpTimer() {
    var self = this;
    var secondsTimer = setInterval(function () {
      if (self.timeleft != 0) {
        self.timeleft -= 1;
      }
      //clear timer after 30 seconds
      else {
        self.enableResend = false;
        clearInterval(secondsTimer);
        self.showTimer = false
      }
    }, this.secondsInterval);
  }

  //close success notificasation after otp resend
  closeNotification() {
    this.showResendAlert = false;
  }
  //Form control methos
  get f() { return this.otpForm.controls; }

  //mobilecheck
  mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  }


}
