import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { EndcustomerComponent } from './endcustomer/endcustomer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { SidenavComponent } from '../shared/sidenav/sidenav.component';
import { SharedModule } from '../shared/shared.module';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { HttpClientModule } from '@angular/common/http';

import { SortableDirective } from '../shared/directives/sortable.directive';
import { CtrlClickDirective } from '../shared/directives/ctrlclick.directive';

// import { LoaderComponent } from '../shared/loader/loader.component';
import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';
import { MessagePopupComponent } from '../shared/message-popup/message-popup.component';
import { LogoutComponent } from '../shared/logout/logout.component';
import { ErrorComponent } from '../shared/error/error.component';
// import { ToastsContainer } from '../shared/toast-notification/toast-notification.component';

@NgModule({
  declarations: [AdminComponent, UserComponent, RoleComponent, EndcustomerComponent, HeaderComponent, SidenavComponent, SortableDirective, ConfirmationPopupComponent,ErrorComponent, MessagePopupComponent, CtrlClickDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    SharedModule,
    RoundProgressModule
  ],
  exports: [
    AdminComponent,
    LogoutComponent
  ],
  entryComponents: [ConfirmationPopupComponent,  MessagePopupComponent],
  providers: [
    DatePipe
  ]
})
export class AdminModule { }
