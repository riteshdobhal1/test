import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../login/login.modal';
import { throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '../shared/error/app-error';
import { NotFoundError } from '../shared/error/not-found-error';
import { BadInputError } from '../shared/error/bad-input';
import { InternalServerError } from '../shared/error/internal-server-error';
import { forbiddenError } from '../shared/error/forbidden-error';
import * as global from '../shared/global';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  serverUrl: string;
  apiUrl: string;
  baseUrl: string;
  logoutUrl: string; 
  supportEmail: string;
  constructor(public http: HttpClient) {
    this.baseUrl = global.applicationProtocol + '//' + global.umsDomain;
    this.logoutUrl = this.getLogoutUrl();
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


  get(url: string) {
    this.apiUrl = this.serverUrl + url;
    return this.http.get
    (this.apiUrl).pipe(catchError(this.handleError));
  }
  post(params: any, url: string) {
    this.apiUrl = this.serverUrl + url;
    return this.http.post
    (this.apiUrl, params).pipe(map(responseData => {
      return responseData;

    }), catchError(this.handleError)
    );

  }

  update(loginData: Login, url: string) {

    this.apiUrl = this.serverUrl + url;
    return this.http.post
    (this.apiUrl, loginData).pipe(catchError(this.handleError));

  }

  //Cookie Handlers

  getCookie(name: any){
    try{
      var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return v ? v[2] : null;
    }catch(e){}
  }
  setCookie(name: string, value: string) {
    document.cookie = name + "=" + value + ";path=/; domain="+window.location.hostname.slice(window.location.hostname.indexOf("."))+";";
  }
  deleteCookie(name: string) { 
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + window.location.hostname.slice(window.location.hostname.indexOf("."))+';path=/';
  }
   
  deleteAllCookies() {
    
    const cookie = document.cookie.split(';');
    for (var i = 0; i < cookie.length; i++) {
    let chip = cookie[i],
        entry = chip.split("="),
        name = entry[0];
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + window.location.hostname.slice(window.location.hostname.indexOf(".")) +';path=/';
    }
  }
   

  //Shared Functions
  getMPS(){   
    try{
      return this.getCookie("mps");
    }catch(e){}
  }
  
  getMfr() {
    try {
      var mps = this.getCookie("mps").split(/:|\//);
      return mps[0];
    } catch (e) {
      return undefined;
    }

  }
  getAdminAddUserDefUrl() {
    
    try{
      return this.getCookie('adminAddUserDefUrl');
    }catch(e){}
    
  }
  getLoginUrl(){
    try{
      return this.getCookie('loginurl');
    }catch(e){}  
    
  } 
  getLogoutUrl(){
    try{
      return this.getCookie('logouturl');
    }catch(e){}

  }
 
  getInfoServerUrl(){
    try{
      return this.getCookie('infoserverDomain');
    }catch(e){}  
    
  }
  getSupportEmail(){

  try{
      return this.supportEmail ? this.getCookie('adminEmail'): global.supportEmail;
    }catch(e){}


  }
  handleError(err: HttpErrorResponse) {

    if (err.status === 404) {
            return throwError(new NotFoundError(err.statusText));
    } else if (err.status === 400) {
            //return throwError(new AppError(err.error.Msg));
            return throwError(new BadInputError(err.error.Msg));
    } else if (err.status === 403) {
            return throwError(new forbiddenError(err.error.Msg));
    } else if (err.status === 500) {
            return throwError(new InternalServerError(err.error.Msg));
    } else {
            return throwError(new AppError(err));
    }
  }
}
