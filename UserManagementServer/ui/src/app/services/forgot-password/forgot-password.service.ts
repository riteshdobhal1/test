import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../data.service';
import { map } from 'rxjs/operators';
import * as globals from '../../shared/global';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService extends DataService {
  
  userDomain:string;
  constructor(http: HttpClient) {
    super(http);
   }

  resetPassword(params: any, url: string) {

     this.userDomain =  params.email.split('@')[1];
    if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(params.email) !== -1 ){
      this.serverUrl = globals.ddauUms;
    }

    this.apiUrl = this.serverUrl + url + '/' + params.email;
    return this.http.post
    (this.apiUrl, {}).pipe(map(responseData => {
      return responseData;
    })
    );
  }

}
