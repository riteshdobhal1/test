import { Component, OnInit } from '@angular/core';
import * as animationConsts from '../shared/animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePasswordService } from '../services/create-password/create-password.service';
import { Router } from '@angular/router';
import * as api from '../shared/resource';
import * as pattern from '../admin/user/global';
import {passwordMinLength, passwordMaxLength,  instructions} from '../shared/global';
import {passwordError, rePasswordError, createPasswordSuccess, passwordMatch} from '../shared/message';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
  animations: [animationConsts.highlightElement, animationConsts.highlightMessage]
})
export class CreatePasswordComponent implements OnInit {
  imageDir = environment.baseImageDir;
  createPasswordForm: FormGroup;
  submitted = false;
  errorBlock = true;
  successBlock = true;
  loginLink = false;
  errorMsg = '';
  result = [];
  res: any;
  validateClassPassword = '';
  validateClassRePassword = ''; 
  errMsgPassword = '';
  errMsgRePassword = '';
  hideMsgPassword = true;
  hideMsgRePassword = true;
  passwordMsg = passwordError;
  rePasswordMsg = rePasswordError;
  successMsg = '';
  showMsgPassword = animationConsts.hideState;
  showMsgRePassword = animationConsts.hideState;
  status = false;
  instructions:any;
  constructor(private router: Router , private createPasswordService: CreatePasswordService, private formBuilder: FormBuilder) { }
  ngOnInit() {

    const token_id = this.createPasswordService.getCookie('token_id'); 
    const email = this.createPasswordService.getCookie('email');
    this.createPasswordService.deleteCookie(token_id);
    this.createPasswordService.deleteCookie(email);

    this.createPasswordForm = this.formBuilder.group({
        passwd : ['', [Validators.required, Validators.minLength(passwordMinLength), Validators.maxLength(passwordMaxLength), Validators.pattern(pattern.regex.password)]],
        repassword : ['', [Validators.required, Validators.minLength(passwordMinLength), Validators.maxLength(passwordMaxLength), Validators.pattern(pattern.regex.password)]],
        token_id : [token_id],
        email : [email]
       });

       this.instructions = instructions
 }
  mouseEnterPassword(event: Event) {
    this.errorMsg = '';
    event.stopPropagation();
    this.validateClassPassword = animationConsts.onElementState;
  }
  mouseEnterRePassword(event: Event) {
    this.errorMsg = '';
    event.stopPropagation();
    this.validateClassRePassword = animationConsts.onElementState;
  }
  hideMsgs(event: Event) {
    this.errorMsg = '';
    this.successMsg = '';
    event.stopPropagation();
  }
  validateForm() {
    this.errorMsg = '';
    this.validateClassPassword = (this.createPasswordForm.controls.passwd.errors === null) ? animationConsts.successState : animationConsts.errorState;
    this.validateClassRePassword = (this.createPasswordForm.controls.repassword.errors === null) ? animationConsts.successState : animationConsts.errorState;
    if (this.validateClassPassword === animationConsts.errorState) {
      this.errMsgPassword = this.passwordMsg;
      this.showMsgPassword = animationConsts.showState;
    } else {
      this.showMsgPassword = animationConsts.hideState;
    }
    if (this.validateClassRePassword === animationConsts.errorState) {
      this.errMsgRePassword = this.rePasswordMsg;
      this.hideMsgRePassword = false;
      this.showMsgRePassword = animationConsts.showState;
    } else {
      this.showMsgRePassword = animationConsts.hideState;
    }
    const status = (this.validateClassPassword === animationConsts.errorState || this.validateClassRePassword === animationConsts.errorState)
      ? false : true;
    return status;
  }
  loginForm() {
    this.router.navigate(['/login']);
  }
  onSubmit() {
    this.status = this.validateForm();
    if (this.status && (this.createPasswordForm.controls.passwd.value === this.createPasswordForm.controls.repassword.value)) {
      this.submitted = true;
      this.errorBlock = true;
      this.successBlock = true;
      this.errorMsg = '';
      this.successMsg = ''; 
      
      
      this.createPasswordService.createPassword(this.createPasswordForm.value, api.createPassword)
        .subscribe(() => {

          this.router.navigate(['/login', 200]);
            /* this.errorBlock = false;
            this.successMsg = createPasswordSuccess;
            this.submitted = false;
            this.loginLink = true; */
            
        }, err => {
          this.submitted = false;
          this.successBlock = false;
          this.errorBlock = true;
            if (err.status === 0) {
              this.router.navigate(['/error', 0]);
            } else {
              this.errorMsg = err.error.Msg;
            }
        });
      } else {

        if (this.createPasswordForm.controls.passwd.value !== this.createPasswordForm.controls.repassword.value){
      
          this.submitted = false;
          this.successBlock = false;
          this.errorBlock = true;
          this.errorMsg = passwordMatch;
        }  
      }
   }

   get f() { return this.createPasswordForm.controls; }
}

