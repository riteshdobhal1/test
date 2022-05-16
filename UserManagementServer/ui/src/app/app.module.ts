import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorHandler } from './shared/error/app-error-handler';
import { InterceptorService } from './services/admin/interceptor.service';
import {onscreen} from './shared/onscreen';
library.add(fas);


@NgModule({
  declarations: [
    AppComponent           
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AdminModule,
    FontAwesomeModule,
    LoginModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [{provide: ErrorHandler, useClass: AppErrorHandler}, {provide: HTTP_INTERCEPTORS, useClass: InterceptorService,multi: true}, onscreen],
  bootstrap: [AppComponent]
})
export class AppModule { }
