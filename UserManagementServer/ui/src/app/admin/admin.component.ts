import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { ViewEncapsulation} from '@angular/core';
import {onscreen} from '../shared/onscreen';
import * as introJs from 'intro.js/intro.js';
import * as introSteps from '../shared/pagetour';
import * as globals from '../shared/global';
import { AdminService } from './../services/admin/admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  helperFlag: boolean = false;
  page: boolean = globals.pageTourFlag;
  onscreenflag: boolean = globals.onscreenFlag;
  onscreen: boolean = false;
  introJS = introJs();
  showPoweredBy: boolean = false;

  constructor(public onscreenConstants:onscreen, private router:Router, public adminService: AdminService) { 
  }

  ngOnInit() {
    let val = this.adminService.getCookie('internal_logo');
    this.showPoweredBy = val && val !== 'NA' ? true : false;
  }
  expandHelper() {
    this.helperFlag = !this.helperFlag;
  }

  togglePageInfo() {
    this.introJS.setOptions({
      showStepNumbers: false,
      showBullets: false,
      exitOnOverlayClick: false,
      doneLabel: "Close",
      nextLabel: "Next",
      prevLabel: "Back",
      showProgress: true
    });
    if(this.router.url.indexOf("/users") !== -1) {
      this.introJS.setOptions({
        steps: introSteps.userIntro
      });
    }else if(this.router.url.indexOf("/roles") !== -1){
      this.introJS.setOptions({
        steps: introSteps.roleIntro
      });
    }else {
      this.introJS.setOptions({
        steps: introSteps.endCustIntro
      });
    }
    this.introJS.start();
  }
  toggleOnScreen() {
    this.onscreen = !this.onscreen;
    this.onscreenConstants.onscreen = this.onscreen;
  }
  getOnScreenStatus() {
    return this.onscreenConstants.onscreen;
  }
}
