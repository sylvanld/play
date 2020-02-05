import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ViewItem } from 'src/app/classes/ViewItem';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

enum Position { Start= 'start', End= 'end', Both= 'both'}

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
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(index) {
    this.clicked.emit(index);
  }
}
