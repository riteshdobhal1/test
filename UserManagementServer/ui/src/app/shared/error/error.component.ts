import { Component, OnInit} from '@angular/core';
import * as message from '../../shared/message';
import {logoutAdmin} from '../../shared/resource';
import { ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service';
//import { supportEmail } from '../../shared/global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutService} from '../../services/logout/logout.service';
import { Router } from '@angular/router';

@Component({
  template: `<div><app-logo></app-logo></div><div class="alert alert-danger" role="alert" align="center">
  {{errorMsg}} <span *ngIf="showSupportLink">Please contact <a href="mailto:{{supportEmail}}">Glassbeam Support</a> </span><span *ngIf="showLoginLink"> and <a href="{{loginLink}}">Login Again</a></span><span *ngIf="showBackLink">and <a [routerLink]="['/users']">click here</a> to reload</span>
</div>`
  })
export class ErrorComponent implements OnInit {
  errorMsg: string;
  supportEmail: string;
  loginLink: string;
  showLoginLink = false;
  showSupportLink = true;
  showBackLink = false;
  constructor(private router: Router, private logoutService: LogoutService, private modalService: NgbModal, private route: ActivatedRoute, private dataService: DataService) {
  this.modalService.dismissAll();
  
  }

  ngOnInit() {

    const loginUrl = this.dataService.getCookie('loginurl');

    const token =this.dataService.getCookie('token_id');
    if (!(token === undefined || token === null)){
      
      this.router.navigate(['/create-password']);

    } 
    
    if (!(loginUrl === undefined || loginUrl === null)){
      
      this.loginLink = loginUrl;
      this.showLoginLink = true;

    } 
    const errorCode = this.route.snapshot.paramMap.get('code');
    this.supportEmail = this.dataService.getSupportEmail();
    
    switch (errorCode) {

      case '0': {        
        this.errorMsg = message.errorCodeMsg[0];
        this.showSupportLink = true;
        this.logoutService.get(logoutAdmin).subscribe(() => {});
        break;
      }
      case '100': {        
        this.errorMsg = message.errorCodeMsg[100];
        this.showSupportLink = false;
        this.showLoginLink = false;
        this.showBackLink = true;
        break;
      }
      case '400': {
        this.errorMsg = message.errorCodeMsg[400];
        break;
      }
      case '403': {
        this.errorMsg = message.errorCodeMsg[403];
        this.logoutService.get(logoutAdmin).subscribe(() => {});
        break;
      }
      case '500': {
        this.errorMsg = message.errorCodeMsg[500];
        this.logoutService.get(logoutAdmin).subscribe(() => {});
        break;
      }
      case '404': {
        this.errorMsg = message.errorCodeMsg[404];
        this.logoutService.get(logoutAdmin).subscribe(() => {});
        break;
      }
      default: {
        this.errorMsg = message.errorCodeMsg[404];
        this.showSupportLink = false;
        this.showLoginLink = false;
        break;
      }
    } 
  }     
}
