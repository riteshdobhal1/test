import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { LogoComponent } from './logo/logo.component';
import { FooterComponent } from './footer/footer.component';
import { LogoutComponent} from './logout/logout.component';
import { LoaderComponent} from './loader/loader.component';
import { RedirectComponent} from './redirect/redirect.component';
import { ToastsContainer } from './toast-notification/toast-notification.component';
import { PoweredByComponent } from './powered-by/powered-by.component';


@NgModule({
  declarations: [LogoComponent, FooterComponent, LogoutComponent,LoaderComponent,RedirectComponent, ToastsContainer, PoweredByComponent],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NgxPrettyCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgbModule,
    FontAwesomeModule,
    NgxPrettyCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    LogoComponent,
    FooterComponent,    
    LogoutComponent,
    LoaderComponent,
    ToastsContainer,
    RedirectComponent,  
    PoweredByComponent
  ]
})
export class SharedModule {
	constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }

}
