import { Injectable, TemplateRef } from '@angular/core';
import * as global from '../../shared/global';
import { environment } from 'src/environments/environment';
import { logoutAdmin } from '../resource';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { DataService } from 'src/app/services/data.service';

@Injectable({ providedIn: 'root' })
export class ToastService {

  toasts: any[] = [];
  toastColor: string;
  toastDelay: number;
  toastDelayError: number;
  toastObj: object;
  baseUrl: string;
  serverUrl: string;
  showRemoveOption = true;
  

  constructor(private router: Router, private logoutService: LogoutService, private dataService: DataService){

    this.baseUrl = global.applicationProtocol + '//' + global.umsDomain;
    if(environment.production) {
      if(window.location.port === global.devPort){
        this.serverUrl = this.baseUrl + ':' + global.devPort + '/';
      } else {
        this.serverUrl = this.baseUrl + '/';
      }      
    } else {
      this.serverUrl = this.baseUrl + ':' + global.devPort + '/';
      
    }

  }
  
  getDefaultDelay() {
    return this.toastDelay;
  }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    
    
    this.toastObj = options;
    if(this.toastObj['error']){
      this.toastDelay = global.toastDelayError;
      //this.showRemoveOption = false;
      
    }
    this.toasts = [];
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
    /* if(this.toastObj['logout']){
      this.logoutService.get(logoutAdmin)
      .subscribe(() => {
        if(!environment.production){
          this.router.navigate(['/login']);
        } else {
          window.location.href = this.dataService.getLoginUrl();
        }
      });
    } */

  }
}