import { Component, OnInit } from '@angular/core';
import * as api from '../resource';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {

  if (this.dataService.getCookie('landingPageUrl') !== null && this.dataService.getCookie('mps') !== null) {
      console.log("5");
      window.location.href = this.dataService.getCookie('landingPageUrl');
      } else {
      console.log("6");
      this.dataService.get(api.logoutAdmin)
      .subscribe(() => {
      this.dataService.deleteAllCookies();        
          this.router.navigate(['/login']);        
	  });
    }
  }
}
