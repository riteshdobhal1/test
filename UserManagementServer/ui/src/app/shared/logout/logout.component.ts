import { Component, OnInit } from '@angular/core';
import * as api from '../resource';
import { LogoutService } from '../../services/logout/logout.service';
import { Router } from '@angular/router';
import { DataResponse } from '../../services/data-response';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private logoutService: LogoutService, private dataService: DataService) { }

  ngOnInit() {
  }

  logoutAdmin() {
  const url = '';
  this.logoutService.get(api.logoutAdmin)
  .subscribe((response: DataResponse) => {
    this.dataService.deleteAllCookies();
    if(!environment.production){
      this.router.navigate(['/login']);
    } else {
      window.location.href = url ? this.dataService.getLoginUrl() : this.dataService.logoutUrl; 
    }
  });
  }

}
