import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../data.service';
import { map } from 'rxjs/operators';
import * as globals from '../../shared/global';

@Injectable({
  providedIn: 'root'
})
export class CreatePasswordService extends DataService {
  userDomain:string;
  constructor(http: HttpClient) {
    super(http);
   }

  createPassword(params: any, url: string) {

  this.userDomain =  params.email.split('@')[1];
    if(globals.domainCass.indexOf(this.userDomain) !== -1 || globals.allowedEmailddau.indexOf(params.email) !== -1 ){
      this.serverUrl = globals.ddauUms;
    }  
  this.apiUrl = this.serverUrl + url;

    const postData = { email: params.email, token_id : params.token_id, passwd : params.passwd};
    
    return this.http.post
    (this.apiUrl, postData).pipe(map(responseData => {
      return responseData;
    })
    );
  }

}
