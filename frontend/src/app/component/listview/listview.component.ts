import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListviewComponent implements OnInit {
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
