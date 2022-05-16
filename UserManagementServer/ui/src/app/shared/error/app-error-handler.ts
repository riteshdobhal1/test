import { ErrorHandler, Injector, NgZone } from '@angular/core';
import { NotFoundError } from './not-found-error';
import { BadInputError } from './bad-input';
import { InternalServerError } from './internal-server-error';
import { forbiddenError } from './forbidden-error';
import { ToastService } from 'src/app/shared/toast-notification/toast-service.service';
import { DataService } from '../../services/data.service';
import {toastTypes} from '../../shared/global';
import * as errorMsg from '../message';
import * as globals from '../global';
import { Router } from '@angular/router';

export class AppErrorHandler implements ErrorHandler  {
    constructor(private ngzone: NgZone, private dataService: DataService, private toast: ToastService, private injector: Injector){
    }
    setRoute(code: number){
        const router = this.injector.get(Router);
        this.ngzone.run(() => router.navigate(['/error', code]));
    }
    handleError(error: any) {
       if (error instanceof NotFoundError) {            
            this.setRoute(404);                    
        } else if(error instanceof InternalServerError){
            this.setRoute(500);
        } else if((error instanceof forbiddenError) || error instanceof BadInputError) {

            if(error instanceof forbiddenError){
                //if( error.actualError === globals.sessionTimeout ){            
                    window.location.href = this.dataService.logoutUrl + '?timeout=true';
	            this.dataService.deleteAllCookies();		
                //}
                //else {
                  //  this.setRoute(403);    
                //}                
            }else {
                this.toast.show(error.actualError, { classname: toastTypes.red, delay: globals.toastDelayError, error: true});                  
            }          
            
        } else {
            console.log(error);
            if(error.actualError.status === 0){
                //console.log(error);
                this.setRoute(0);
            } else {
                console.log(error); 
                if(navigator.onLine){               
                    this.toast.show(errorMsg.unexpectedError, { classname: toastTypes.red, delay: globals.toastDelayError, error: true});
                }
            }      
        }       
        
    }
}
