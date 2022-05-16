import { Component, OnInit,Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  @Input() msg: string;
  @Input() listToDisplay: Array<string>
  @Input() subMsg: Array<string>
  @Input() footerMsg: string
  @Input() confirmationMsg: string
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  onYesClick() {
  }
  onNoClick() {
  }
}
