import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.scss']
})
export class CardviewComponent implements OnInit {
  @Input() items: Object = [];
  @Input() addBtnStart: Boolean = false;
  @Input() addBtnEnd: Boolean = false;
  @Output() newItem: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  addItem() {
    this.newItem.emit();
  }
  
}
