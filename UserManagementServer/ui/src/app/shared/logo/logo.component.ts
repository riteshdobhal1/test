import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminService } from 'src/app/services/admin/admin.service';
import { redirectLink } from '../global';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  imageDir: string;
  showGlassbeamLogo: boolean = true;
  internal_logo: string;
  redirectLink = redirectLink;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.imageDir = environment.baseImageDir;
    let val = this.adminService.getCookie('internal_logo');
    if(val && val !=='NA'){
      this.showGlassbeamLogo = false;
      this.internal_logo = `./../${this.imageDir}/${val}`;
    }else{
      this.showGlassbeamLogo = true;
      this.internal_logo = `./../${this.imageDir}/glassbeam.png`;
    }
  }

}
