import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../data.service';
import { map } from 'rxjs/operators';
import * as globals from '../../shared/global';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends DataService {
  userDomain: string;
  constructor(http: HttpClient) {
    super(http);
   }

  authenticateUser(params: any, url: string) {
    this.userDomain =  params.email.split('@')[1];
    if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(params.email) !== -1 ){
      this.serverUrl = globals.ddauUms;
    }

    this.apiUrl = this.serverUrl + url;
    return this.http.post
    (this.apiUrl, params).pipe(map(responseData => {
      return responseData;
    })
    );
  }

  //service to call resend OTP
  resendOtp(params:any, url:string){
    this.userDomain =  params.email.split('@')[1];
    if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(params.email) !== -1 ){
      this.serverUrl = globals.ddauUms;
    }

    this.apiUrl = this.serverUrl + url;
    return this.http.post
    (this.apiUrl, params).pipe(map(responseData => {
      return responseData;
    })
    );
  }

  //Service to call verify OTP
  verifyOTP(params:any, url:string){
    this.userDomain =  params.email.split('@')[1];
    if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(params.email) !== -1 ){
      this.serverUrl = globals.ddauUms;
    }

    this.apiUrl = this.serverUrl + url;
    return this.http.post
    (this.apiUrl, params).pipe(map(responseData => {
      return responseData;
    })
    );
  }

}
