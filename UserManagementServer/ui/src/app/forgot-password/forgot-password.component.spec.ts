import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormBuilder,FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';
import {emailError, forgotPasswordSuccess} from '../shared/message';
import * as animationConsts from '../shared/animation';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      providers: [ForgotPasswordService, FormBuilder],
      imports:[RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create have a component', () => {
    expect(component).toBeDefined();
  });

  it('should have logo', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#logo').textContent).toEqual('');
  });
  xit('should have click event with parent div',() => {
    //const compiled = fixture.debugElement.query(By.css('container-fluid'));
    //const pDiv = compiled.querySelector('.container-fluid');
    //compiled.triggerEventHandler('click', {});
    //fixture.detectChanges();
    //expect(compiled.querySelectorAll('col-sm-10,text-danger').textContent).toEqual('');
    //expect(compiled.querySelectorAll('col-sm-10,text-success').textContent).toEqual('');
  });
  xit('should have email label as Username', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#email').textContent).toEqual('Username');

  });
  xit('should have submit button label as "Submit"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#submit').textContent).toEqual(' Submit ');

  });
  xit('should have progress button as Sending Email..', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.submitted = true;
    fixture.detectChanges();
    expect(compiled.querySelector('#progress-button').textContent).toContain('Sending Email..');

  });
  xit('should have a back button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#back').textContent).toContain('Back');

  });
  it('should have primary company info', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#primary-info').textContent).toContain('Leverage the power of your machine data');

  });
  it('should have secondary company info', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#secondary-info').textContent).
    toContain('360-degree product intelligenceTurn data into insightDeliver proactive customer servicesPursue data-driven product roadmapsCross and upsell with reliable customer intelligence');
  
  });
  it('should have footer', () => {

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#footer').textContent).toBeDefined();

  });

  it('should validate all properties', () => {
  
    expect(component.forgotPasswordForm instanceof FormGroup).toBe(true);
    expect(component.submitted).toBeFalsy();
    expect(component.errorBlock).toBeTruthy();
    expect(component.successBlock).toBeTruthy();
    expect(component.errorMsg).toEqual('');
    expect(component.result instanceof Array).toBe(true);
    expect(component.res).toBeUndefined();
    expect(component.validateClassEmail).toEqual('');
    expect(component.errMsgEmail).toEqual('');
    expect(component.hideMsgEmail).toBeTruthy();
    expect(component.emailMsg).toEqual(emailError);
    expect(component.successMsg).toEqual('');
    expect(component.showMsgEmail).toEqual(animationConsts.hideState);

  });

  it('should have dynamic form',() => {

    const form = component.forgotPasswordForm;
    component.ngOnInit();
    expect(form).toBeDefined();

  });

  it('should have email as input field and should validate',() => {

    const form = component.forgotPasswordForm;
    const emailInput = form.controls.email;
    expect(emailInput.valid).toBeFalsy();
    emailInput.setValue('demo@glassbeam.com');
    expect(emailInput.valid).toBeTruthy();

  });

  it('should validate form before submit', () => {

    component.forgotPasswordForm.controls.email.setValue('');
    component.validateForm();
    expect(component.validateClassEmail).toEqual(animationConsts.errorState);
    expect(component.errMsgEmail).toEqual(component.emailMsg);
    expect(component.showMsgEmail).toEqual(animationConsts.showState);
    expect(component.errorMsg).toEqual('');

    component.forgotPasswordForm.controls.email.setValue('test');
    component.validateForm();
    expect(component.validateClassEmail).toEqual(animationConsts.errorState);
    expect(component.errMsgEmail).toEqual(component.emailMsg);
    expect(component.showMsgEmail).toEqual(animationConsts.showState);
    expect(component.errorMsg).toEqual('');

    component.forgotPasswordForm.controls.email.setValue('demo@glassbeam.com');
    component.validateForm();
    expect(component.validateClassEmail).toEqual(animationConsts.successState);
    expect(component.errMsgEmail).toEqual(component.emailMsg);
    expect(component.showMsgEmail).toEqual(animationConsts.hideState);
    expect(component.errorMsg).toEqual('');

  });

  it('should be able to redirect user to login page',() => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');
    component.loginForm();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

  });

  it('should success if password is reset', fakeAsync(() => {
    component.forgotPasswordForm.controls.email.setValue('demo@glassbeam.com');
    component.onSubmit();
    expect(component.status).toBeTruthy();
    expect(component.submitted).toBeTruthy();
    expect(component.errorBlock).toBeTruthy();
    expect(component.successBlock).toBeTruthy();
    expect(component.errorMsg).toEqual('');
    expect(component.successMsg).toEqual('');

    const forgotPasswordService = TestBed.get(ForgotPasswordService);
    const mockResult = {"Status":"Success"};
    spyOn(forgotPasswordService, 'resetPassword').and.returnValue(

       Observable.create((observer: Observer<{ Status : string }>) => {
        observer.next(mockResult);
        return observer;
      }
    ));
    tick();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.errorBlock).toBeFalsy();
    expect(component.submitted).toBeFalsy();
    expect(component.successMsg).toEqual(forgotPasswordSuccess);
    tick(5000);
  }));

  xit('should fail if password is not reset', fakeAsync(() => {
    component.forgotPasswordForm.controls.email.setValue('demo@glassbeam.com');
    component.onSubmit();
    expect(component.status).toBeTruthy();
    expect(component.submitted).toBeTruthy();
    expect(component.errorBlock).toBeTruthy();
    expect(component.successBlock).toBeTruthy();
    expect(component.errorMsg).toEqual('');
    expect(component.successMsg).toEqual('');

    const forgotPasswordService = TestBed.get(ForgotPasswordService);
    const mockResult = {"Status":"Failure"};
    spyOn(forgotPasswordService, 'resetPassword').and.returnValue(

    Observable.create((observer: Observer<{ Status : string }>) => {
        observer.error(mockResult);
        return observer;
      }
    ));
    tick();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.successBlock).toBeFalsy();
    expect(component.errorBlock).toBeTruthy();
    expect(component.submitted).toBeFalsy();
    tick(5000);
  }));


});
