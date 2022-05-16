import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-powered-by',
  templateUrl: './powered-by.component.html',
  styleUrls: ['./powered-by.component.scss']
})
export class PoweredByComponent implements OnInit {

  imageDir: string;
  showPoweredBy: boolean = false;
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.imageDir = environment.baseImageDir;
  }

}