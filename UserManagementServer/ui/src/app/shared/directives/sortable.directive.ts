/******  Default Sorting Steps *******/
/*
Step 1 : Define an object in your globals for default sorting [global.js] as below :
const defaultSort = {
    column: "DisName",
    direction: "asc"
}

Step 2: Import and initialise the variable in your component:
defaultSort = defaultSort;

Step 3: Call the onsort function from your init function after your list data is available:
this.onSort(defaultSort as SortEvent);

Step 4: introduce attribute 'direction' in each of your sortable header like
<span sortable="roleType" direction="" (sort)="onSort($event)"> // For non Default Sorting header
<span sortable="DisName" direction="{{persistantSorting.column==='DisName'?persistantSorting.direction:''}}" (sort)="onSort($event)" id="roleNameTableHeader"> // For default sorting header
*/

import {Directive, EventEmitter, Input, Output} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': 'asc' };

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'span[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class SortableDirective {

  @Input() sortable: string;
  @Input() direction: SortDirection;
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    if(this.direction===undefined || this.direction===''){
      this.direction = rotate['asc'];
    }else {
      this.direction = rotate[this.direction];
    }
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}