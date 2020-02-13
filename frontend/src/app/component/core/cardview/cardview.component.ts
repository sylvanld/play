import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ViewItem } from '~types/view-item';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        query('.list-item', [
          style({opacity: 0, transform: 'translateX(-100px)'}),
          stagger(30, [
            animate('0.2s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CardviewComponent implements OnInit {
  @Input() items: ViewItem[] = [];

  @Output() clickedItem: EventEmitter<any> = new EventEmitter();
  @Output() deletedItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  clickItem(item: ViewItem) {
    this.clickedItem.emit(item);
  }

  deleteItem(item: ViewItem) {
    this.deletedItem.emit(item);
  }
}
