import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  darkMode: boolean;
  imageDir: string;
  constructor() { }
  ngOnInit() {
  	this.darkMode = false;
    this.imageDir = environment.baseImageDir;
  }
  switchToDark() {
    this.darkMode = !this.darkMode;
    let body = document.getElementById("bodyWrap");
    let currentClass = body.className;
    body.className = currentClass == "dark-mode" ? "light-mode" : "dark-mode";
  }
}
