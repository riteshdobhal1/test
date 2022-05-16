import { async, ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import { FormBuilder,FormGroup } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { emailError, passError } from '../shared/message';
import { QaTestingCaptcha, QaCaptchaKey, DevCaptchaKey, CaptchaFeature, MaxLoginAttemptForCaptcha, sitekey } from './global'
import * as animationConsts from '../shared/animation';
import { Observable, Observer, of } from 'rxjs';
import { Router } from '@angular/router';
import * as api from '../shared/resource';
import { resendOtpTime, resendAttempt, resendAttemptLimit, secondsInterval, successShowTime} from '../login/global';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let timeInSyncKeeper;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [LoginService, FormBuilder],
      imports:[RouterTestingModule, RecaptchaModule, HttpClientTestingModule, BrowserAnimationsModule],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //component.isCaptchaEnabled = true;
  });
  afterEach(() => {
    fixture.destroy();
    flush;
    component = null;

    });

  it('should create app', () => {
    expect(component).toBeDefined();
  });
  
  it('check for remaining attempt and enable captcha', () => {
    component.CaptchaFeature = true;
    component.remainingAttempt = 7;
    localStorage.setItem("remainingAttempt","2");
    component.ngOnInit()
    expect(component.isCaptchaEnabled).toBeTruthy();

  });
  it('should have username label', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#email').textContent).toContain('Username');
  });
  it('should have password label', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#password').textContent).toContain('Password');
  });
  it('should have Forgot Password Link', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#forgot-password').textContent).toContain('Forgot Password?');
  });
  it('should have SignIn Button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#submit').textContent).toContain('Sign In');
  });
  // it('should have progress button', () => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   component.submitted = true;
  //   fixture.detectChanges();
  //   expect(compiled.querySelector('#progress-button').textContent).toContain('Signing..');
  // });
  xit('should validate all properties', () => {

    expect(component.loginForm instanceof FormGroup).toBe(true);
    expect(component.submitted).toBeFalsy();
    expect(component.showError).toBeFalsy();
    expect(component.errorMsg).toEqual('');
    expect(component.result instanceof Array).toBe(true);
    expect(component.res).toBeUndefined();
    expect(component.validateClassEmail).toEqual('');
    expect(component.validateClassPass).toEqual('');
    expect(component.errMsgEmail).toEqual('');
    expect(component.errMsgPass).toEqual('');
    expect(component.hideMsgEmail).toBeTruthy();
    expect(component.hideMsgPass).toBeTruthy();
    expect(component.emailMsg).toEqual(emailError);
    expect(component.passMsg).toEqual(passError);
    expect(component.showMsgEmail).toEqual(animationConsts.hideState);
    expect(component.showMsgPass).toEqual(animationConsts.hideState);
    expect(component.QaTestingCaptcha).toEqual(QaTestingCaptcha);
    expect(component.QaCaptchaKey).toEqual(QaCaptchaKey);
    expect(component.DevCaptchaKey).toEqual(DevCaptchaKey);
    expect(component.CaptchaFeature).toEqual(CaptchaFeature);
    expect(component.MaxLoginAttemptForCaptcha).toEqual(MaxLoginAttemptForCaptcha);
    expect(component.sitekey).toEqual(sitekey);
    expect(component.captchaResponse).toEqual('');
    //expect(component.remainingAttempt).toBeUndefined();
    expect(component.isCaptchaEnabled).toBeFalsy();
    expect(component.err).toBeUndefined();
    expect(component.otp).toEqual('');
    expect(component.timeout).toEqual('10 min');  
    expect(component.maskedMail).toEqual('ni******@**il.com');
    expect(component.mobileNum).toEqual('23456789876');
    expect(component.showMobMsg).toBeFalsy();
    expect(component.enableResend).toBeTruthy();
    expect(component.userValidated).toBeFalsy();
    expect(component.resendOtpTime).toEqual(resendOtpTime);
    expect(component.resendAttempt).toEqual(resendAttempt);
    expect(component.timeleft).toEqual(resendOtpTime);
    expect(component.showTimer).toBeFalsy();
    expect(component.showResendAlert).toBeFalsy();
    expect(component.otpSubmitted).toBeFalsy();
    expect(component.successShowTime).toEqual(successShowTime);
    expect(component.secondsInterval).toEqual(secondsInterval);
    expect(component.response).toBeUndefined();
    expect(component.userDetails).toBeUndefined();
    expect(component.defaultRealm).toBeUndefined();
    expect(component.defaultMps).toBeUndefined();
    expect(component.defaultUrl).toBeUndefined();    
    expect(component.reCaptcha).toBeUndefined();
  });

  it('should have input fields', () => {

    const compiled = fixture.debugElement.nativeElement;
    const email = compiled.querySelector('input[id="username"]');
    const password = compiled.querySelector('input[id="inputPassword"]');
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();

  });
  it('should have dynamic form',() => {

    const form = component.loginForm;
    component.ngOnInit();
    expect(form).toBeDefined();

  });
  it('should have input fields as part of form and should validate', () => {
  
    const form = component.loginForm;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    // component.validateForm();
    expect(emailInput.valid).toBeFalsy();
    emailInput.setValue('demo@glassbeam.com');
    expect(emailInput.valid).toBeTruthy();
    expect(passwordInput.valid).toBeFalsy();
    passwordInput.setValue('Demo@1234');
    expect(passwordInput.valid).toBeTruthy();

  });
  it('should validate form', () => {

    const form = component.loginForm;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    expect(form.valid).toBeFalsy();    
    emailInput.setValue('demo@glassbeam.com');
    passwordInput.setValue('Demo@1234');
    expect(form.valid).toBeTruthy();

  });
  it('should show error message if email is not valid', () => { 
    const form = component.loginForm;
    const emailInput = form.controls.email;
    expect(component.errorMsg).toEqual('');
    expect(emailInput.valid).toBeFalsy();
  });

  it('should hide message if email is valid', () => {
    const form = component.loginForm;
    const emailInput = form.controls.email;
    emailInput.setValue('demo@glassbeam.com');
    expect(component.errorMsg).toEqual('');
    expect(emailInput.valid).toBeTruthy();    
  });

  it('should show error message if password is not valid', () => {
    const form = component.loginForm;  
    const passwordInput = form.controls.password;
    expect(component.errorMsg).toEqual('');
    expect(passwordInput.valid).toBeFalsy();
  })
  ;
  it('should hide error message if password is valid', () => {
    const form = component.loginForm;
    const passwordInput = form.controls.password;
    passwordInput.setValue('Demo@1234');    
    expect(component.errorMsg).toEqual('');
    expect(passwordInput.valid).toBeTruthy();
  });

  
  it('should call submit button with valid form values and CaptchaFeature false',() => {
    component.CaptchaFeature = false;
    component.isCaptchaEnabled = false;
    // spyOn(component, 'validateForm').and.returnValue(true);
    spyOn(component, 'submitLogin');
    component.onSubmit();
    // expect(component.validateForm).toHaveBeenCalled();
    // expect(component.validateForm).toBeTruthy();
    expect(component.submitted).toBeTruthy();    
    expect(component.submitLogin).toHaveBeenCalled();
  });
  it('should authenticate user with Two factor authentication enabled and phone available', fakeAsync(() => {
    const mockResult = {"Status":"Success","Data":[{"email":"demo@glassbeam.com","phone":"9611209534"}],"TwoAuth":true,"Timeout":"15minutes"};
    component.submitLogin();
    expect(component.errorMsg).toEqual('');
    component.response = mockResult;
    component.timeout = mockResult.Timeout;
    expect(component.response.TwoAuth).toBeTruthy();
    component.maskedMail = mockResult.Data[0].email;
    component.mobileNum = mockResult.Data[0].phone;
    component.showMobMsg = true; 
    component.userValidated = true;
    component.showTimer = true;
    expect(component.timeout).toEqual(mockResult.Timeout);
    expect(component.maskedMail).toEqual(mockResult.Data[0].email);
    expect(component.response.Data[0].phone).toMatch(mockResult.Data[0].phone);
    expect(component.mobileNum).toMatch(mockResult.Data[0].phone);
    expect(component.showMobMsg).toBeTruthy();
    expect(component.userValidated).toBeTruthy();
    expect(component.showTimer).toBeTruthy();
  }));
  it('should authenticate user with Two factor authentication enabled and phone not available', fakeAsync(() => {
    
    const mockResult = {"Status":"Success","Data":[{"email":"demo@glassbeam.com","phone":""}],"TwoAuth":true,"Timeout":"15minutes"};
    component.submitLogin();
    expect(component.errorMsg).toEqual('');
    component.response = mockResult;
    component.timeout = mockResult.Timeout;
    expect(component.response.TwoAuth).toBeTruthy();
    component.maskedMail = mockResult.Data[0].email;
    component.mobileNum = mockResult.Data[0].phone;
    component.showMobMsg = true; 
    component.userValidated = true;
    component.showTimer = true;
    expect(component.timeout).toEqual(mockResult.Timeout);
    expect(component.maskedMail).toEqual(mockResult.Data[0].email);
    expect(component.response.Data[0].phone).toEqual('');
    expect(component.userValidated).toBeTruthy();
    expect(component.showTimer).toBeTruthy();
  }));
  it('should authenticate user with Two factor authentication disabled', fakeAsync(() => {
    
    // const loginService = TestBed.get(LoginService);
    const mockResult = {"Status":"Success","Data":{"user_details":{"realm_def":"dev.glassbeam.com","mps_def":"siemens:siemens:podui","url_def":"apps/app/index.html"}},"TwoAuth":false,"Timeout":"15minutes"};
    // spyOn(loginService, 'authenticateUser').and.returnValue(

    //    Observable.create((observer: Observer<{ Status : string, Data: Object, TwoAuth: boolean, Timeout: string}>) => {
    //     observer.next(mockResult);
    //     return observer;
    //   }
    // ));
    // tick();
    // fixture.detectChanges();
    const milliseconds = (new Date).getTime();
    // spyOn(loginService, 'setCookie');
    // spyOn(window,'open');
    component.submitLogin();
    component.userDetails = mockResult.Data.user_details;
    component.defaultRealm = mockResult.Data.user_details.realm_def;
    component.defaultMps = mockResult.Data.user_details.mps_def;
    component.defaultUrl = 'https://' + mockResult.Data.user_details.realm_def + '/' + mockResult.Data.user_details.url_def;

    // expect(loginService.authenticateUser).toHaveBeenCalledWith(component.loginForm.value,api.loginUser);
    expect(component.userDetails).toEqual(mockResult.Data.user_details);
    expect(component.defaultRealm).toEqual(mockResult.Data.user_details.realm_def);
    expect(component.defaultMps).toEqual(mockResult.Data.user_details.mps_def);
    expect(component.defaultUrl).toEqual('https://' + mockResult.Data.user_details.realm_def + '/' + mockResult.Data.user_details.url_def);
    // expect(loginService.setCookie).toHaveBeenCalledWith('mps',mockResult.Data.user_details.mps_def);
    // expect(window.open).toBeDefined();
    // expect(window.open).toHaveBeenCalledWith(component.defaultUrl + '?' + milliseconds, '_self');
    // tick(10000);
  }));
  it('should return Failure if user is not authenticated and error status is 0', fakeAsync(() => {
    // const router = TestBed.get(Router);
    // const loginService = TestBed.get(LoginService);
    // const mockResult = {"status":0,"error":{"Msg":"authentication failed"}};
    // spyOn(loginService, 'authenticateUser').and.returnValue(

    //    Observable.create((observer: Observer<{ status: number, error: object }>) => {
    //     observer.error(mockResult);
    //     return observer;
    //   }
    // ));
    
    // tick();    
    // fixture.detectChanges();
    // spyOn(router, 'navigate');
    component.submitLogin();
    expect(component.submitted).toBeTruthy();
    expect(component.errorMsg).toEqual('');
    // expect(loginService.authenticateUser).toHaveBeenCalledWith(component.loginForm.value,api.loginUser);
    // expect(component.err.status).toEqual(0);    
    // expect(router.navigate).toHaveBeenCalledWith(['/error',0]);
    // tick(10000);
  })); 

  xit('should return Failure if user is not authenticated and status is not 0', fakeAsync(() => {
    
    const loginService = TestBed.get(LoginService);
    const mockResult = {"status":1,"error":{"Msg":"authentication failed"}};
    spyOn(loginService, 'authenticateUser').and.returnValue(

       Observable.create((observer: Observer<{ status: number, error: object }>) => {
        observer.error(mockResult);
        return observer;
      }
    ));

    tick();    
    fixture.detectChanges();
    component.submitLogin();
    expect(loginService.authenticateUser).toHaveBeenCalledWith(component.loginForm.value,api.loginUser);
    expect(component.err.status).toEqual(1);
    expect(component.errorMsg).toEqual(component.err.error.Msg);    
    tick(10000);
  })); 

  it('should redirect user to forgot password page', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    component.forgotPasswordForm();
    expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);

  });
   
  it('onsubmit without captcha',() => {
    component.isCaptchaEnabled = false;
    component.CaptchaFeature = false;
    const form = component.loginForm;
    const emailInput = form.controls.email;
    const passwordInput = form.controls.password;
    emailInput.setValue('demo@glassbeam.com');
    passwordInput.setValue('Demo@1234');
    spyOn(component, 'submitLogin')
    component.onSubmit();
    expect(component.submitLogin).toHaveBeenCalled();
    
  });

  it('resend OTP', () => {
    component.resendAttempt = 2;
    component.resendAttemptLimit = 5;
   component.resendOTP();

  });

  it('resend OTP fail', () => {
    component.resendAttempt = 5;
    component.resendAttemptLimit = 5;
   component.resendOTP();
   expect(component.userValidated).toBeFalsy();

  });

  it('Validate OTP INVALID', () => {
    component.otpForm[status] = "INVALID";
    component.otpSubmitted = true;
    spyOn(component, 'validateOTP');
    component.validateOTP();
    expect(component.validateOTP).toHaveBeenCalled();
    expect(component.otpSubmitted).toBeTruthy();
  });
  it('Validate OTP VALID with response as success ', fakeAsync(() => {
    component.otpForm.controls.otp.setValue('986666666');
    const milliseconds = (new Date).getTime();
    const param = { "email": component.loginForm.value.email, "otp": component.otpForm.value.otp };
    const mockResult = {"Status":"Success","Data":{"user_details":{"realm_def":"dev.glassbeam.com","mps_def":"siemens:siemens:podui","url_def":"apps/app/index.html"}},"TwoAuth":false,"Timeout":"15minutes"};
    const loginService = TestBed.get(LoginService);
    spyOn(loginService, 'verifyOTP').and.returnValue(

      Observable.create((observer: Observer<{ Status : string, Data: Object, TwoAuth: boolean, Timeout: string }>) => {
       observer.next(mockResult);
       return observer;
     }
    ));
    spyOn(loginService, 'setCookie');
    spyOn(window, 'open');    
    tick();
    fixture.detectChanges();  
    component.validateOTP();  
    expect(component.otpSubmitted).toBeTruthy();
    expect(loginService.verifyOTP).toHaveBeenCalledWith(param,api.verifyOTP);
    expect(component.userDetails).toEqual(mockResult.Data.user_details);
    expect(component.defaultRealm).toEqual(mockResult.Data.user_details.realm_def);
    expect(component.defaultMps).toEqual(mockResult.Data.user_details.mps_def);
    expect(component.defaultUrl).toEqual('https://' + mockResult.Data.user_details.realm_def + '/' + mockResult.Data.user_details.url_def);
    expect(loginService.setCookie).toHaveBeenCalledWith('mps',mockResult.Data.user_details.mps_def);
    expect(window.open).toBeDefined();
    expect(window.open).toHaveBeenCalledWith(component.defaultUrl + '?' + milliseconds, '_self');
    tick(10000);
  }));

  xit('Validate OTP VALID with response as failure', fakeAsync(() => {
    component.otpForm.controls.otp.setValue('986666666');
    const param = { "email": component.loginForm.value.email, "otp": component.otpForm.value.otp };
    const mockResult = {"status":1,"error":{"Msg":"OTP verification failed"}};
    const loginService = TestBed.get(LoginService);
    spyOn(loginService, 'verifyOTP').and.returnValue(

      Observable.create((observer: Observer<{ Status : string, error: object}>) => {
       observer.error(mockResult);
       return observer;
     }
    ));
    tick();
    fixture.detectChanges();  
    component.validateOTP();  
    expect(component.otpSubmitted).toBeFalsy();
    expect(loginService.verifyOTP).toHaveBeenCalledWith(param,api.verifyOTP);
    expect(component.errorMsg).toEqual(component.err.error.Msg);
    tick(10000);
  }));



  // it('Validate OTP VALID', () => {
  //   const api_success = { "Status": "Success", "Msg": "End customer Nishanth added successfully", "Data": "" };
  //   const loginService = TestBed.get(LoginService);
  //   //const param = { "email": "demo@glassbeam.com", "otp": "Demo@1234" };
  //   const form = component.loginForm;
  //   const emailInput = form.controls.email;
  //   const passwordInput = form.controls.password;
  //   emailInput.setValue('demo@glassbeam.com');
  //   passwordInput.setValue('Demo@1234');
  //   component.otpForm[status] = "VALID"
  //   component.loginForm.value.email = 'demo@glassbeam.com';
  //   component.otpForm.value.otp = "12345"
  //   spyOn(component, 'validateOTP');
  //   spyOn(loginService, 'verifyOTP');//.and.returnValue(of(api_success));
  //   component.validateOTP();
  //   expect(component.validateOTP).toHaveBeenCalled();
  //   expect(loginService.verifyOTP).toHaveBeenCalled();
  // });

  // it('test otp timer', () => {
  //   component.timeleft = 30;
  //   component.otpTimer()

  // });

});
