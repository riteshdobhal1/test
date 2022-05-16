import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { userTracking } from '../../shared/resource';

@Injectable({
    providedIn: 'root'
  })
export class UserTrackingService {

   mps = [undefined, undefined, undefined];
   application = 'application';
   module = 'admin';
   activity = 'tracking';
   param: object;

   constructor(private dataService: DataService){
    try {
        this.mps = this.dataService.getMPS().split(/:|\//);
      }catch (e){}
    
   }
   updateAccessTime() {
      this.param =  {details: "{''}", solr_query: ""};
      this.dataService.post(this.param, userTracking + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2] + '/' + this.application + '/' + this.module + '/' + this.activity).subscribe(() => {
      });
   }    
   userTracking(module: string, activity: string, detail: string) {  
            this.param = { details: detail, solr_query: ""};
            this.application = this.module;
            this.dataService.post(this.param, userTracking + this.mps[0] + '/' + this.mps[1] + '/' + this.mps[2] + '/' + this.application + '/' + module + '/' + activity).subscribe(() => {
         });    
   }  
  
}
