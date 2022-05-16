import { Component, OnInit } from '@angular/core';
import * as animationConsts from '../shared/animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../services/forgot-password/forgot-password.service';
import { Router } from '@angular/router';
import * as api from '../shared/resource';
import {emailError, forgotPasswordSuccess} from '../shared/message';
import { environment } from '../../environments/environment';
import * as pattern from '../admin/user/global';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [animationConsts.highlightElement, animationConsts.highlightMessage]
})
export class ForgotPasswordComponent implements OnInit {
  imageDir = environment.baseImageDir;
  forgotPasswordForm: FormGroup;
  submitted = false;
  loading = false;
  errorBlock = true;
  successBlock = true;
  errorMsg = '';
  result = [];
  res: any;
  validateClassEmail = ''; 
  errMsgEmail = '';
  hideMsgEmail = true;
  emailMsg = emailError;
  successMsg = '';
  showMsgEmail = animationConsts.hideState;
  status = false;
  emailPattern = pattern.regex.email;
  constructor(private router: Router , private forgotPasswordService: ForgotPasswordService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
        email : ['', [Validators.required, Validators.pattern(this.emailPattern)]]
       });
 }
  // mouseEnterEmail(event: Event) {
  //   this.errorMsg = '';
  //   event.stopPropagation();
  //   this.validateClassEmail = animationConsts.onElementState;
  // }
  hideMsgs(event: Event) {
    this.errorMsg = '';
    this.successMsg = '';
    event.stopPropagation();
  }
  validateForm() {
    this.errorMsg = '';
    this.validateClassEmail = (this.forgotPasswordForm.controls.email.errors === null ) ? animationConsts.successState : animationConsts.errorState;
    if (this.validateClassEmail === animationConsts.errorState) {
      this.errMsgEmail = this.emailMsg;
      this.showMsgEmail = animationConsts.showState;
    } else {
      this.showMsgEmail = animationConsts.hideState;
    }
   const status =  this.validateClassEmail === animationConsts.errorState ? false : true;
    return status;
  }
  loginForm() {
    this.router.navigate(['/login']);
  }
  onSubmit() {
    this.status = this.validateForm();
    this.submitted = true;
    if(this.forgotPasswordForm.valid){
      this.loading = true;
      this.errorBlock = true;
      this.successBlock = true;
      this.errorMsg = '';
      this.successMsg = ''; 
        this.forgotPasswordService.resetPassword(this.forgotPasswordForm.value, api.forgotPassword)
        .subscribe(() => {
            this.errorBlock = false;
            this.successMsg = forgotPasswordSuccess;
            this.submitted = false;
            this.loading = false;
        }, err => {
          this.submitted = false;
          this.loading = false;
          this.successBlock = false;
          this.errorBlock = true;
            if (err.status === 0) {
              this.router.navigate(['/error', 0]);
            } else {
              this.errorMsg = err.error.Msg;
            }
        });
    }
    // if (this.status) {
    // }
   }

   get f() { return this.forgotPasswordForm.controls; }
}

