//This is global toast component. Just import service ToastService in your component and use it.
/* Options for firing the Toast
  ** Just call "show('I am a standard toast');" function from service and it will fire the Toast with the given message **
  ** Call "show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });" method from service with delay defined **
  ** Standard Bootstrap classes works i.e. bg-success, bg-warning. bg-info etc **
*/
import {Component, TemplateRef} from '@angular/core';
import {ToastService} from './toast-service.service';
import {supportEmail} from '../global';
import {defErrorMessage} from '../message';
@Component({
  selector: 'app-toast-notification',
  template: `
    <ngb-toast *ngFor="let toast of toastService.toasts" [class]="toast.classname" [id]="toast.id" [autohide]="true" [delay]="toast.delay || toastService.getDefaultDelay()" (hide)="toastService.remove(toast)">
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text><span class="toastText float-left  mr-2">{{toast.textOrTpl == "" ? this.defErrorMessage : toast.textOrTpl}}</span><span (click)="toastService.remove(toast)" class="badge badge-light float-right h-25"><fa-icon title="Close" class="mt-1" [icon]="['fas','times']"></fa-icon></span><span *ngIf="toast.error" class="customLink">Please Contact <strong><a class="customLink" href="mailto:{{supportEmail}}">Glassbeam Support</a></strong></span></ng-template>
    </ngb-toast>
  `,
  host: {'[class.gbToast]': 'true'}
})
export class ToastsContainer {
  
  showSupportLink = false;
  supportEmail: string;
  defErrorMessage = defErrorMessage;
  constructor(public toastService: ToastService) {
    this.supportEmail = supportEmail;
  }
  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}