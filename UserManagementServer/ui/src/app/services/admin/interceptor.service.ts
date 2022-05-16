import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()

export class InterceptorService implements HttpInterceptor { 

   constructor( private router: Router) {

   }
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
         if (navigator.onLine) {
            return next.handle(req);
         } else {
            this.router.navigate(['/error', 100]);
         }


        
   }
}