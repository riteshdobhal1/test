import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loader',
  template: '<img id="app-loader" src="../../../{{imageDir}}/loader.svg" alt="Loading ..." width="75px"/>'
})
export class LoaderComponent implements OnInit {

  imageDir: string;
  constructor() { }

  ngOnInit() {
    this.imageDir = environment.baseImageDir;
  }

}
