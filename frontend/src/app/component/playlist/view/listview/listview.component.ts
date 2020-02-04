import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ViewItem } from 'src/app/classes/ViewItem';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

enum Position { Start='start', End='end', Both='both'}

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss'],
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
export class ListviewComponent implements OnInit {
  @Input() items: ViewItem[] = [];
  @Input() locked: boolean = true;
  @Input() addBtnPosition: Position = Position.Start;
  @Input() addBtnLabel: string = "Nouvel élément";
  @Output() addItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() delItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() moveItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addItem() {
    this.addItemEvent.emit();
  }

  delItem(item: ViewItem) {
    this.delItemEvent.emit(item.id);
  }

  moveItem(event: CdkDragDrop<Object[]>) {
    this.moveItemEvent.emit({oldIndex: event.previousIndex, newIndex: event.currentIndex});
  }

  showStartAddBtn(): boolean {
    return (this.addBtnPosition == 'start' || this.addBtnPosition == 'both');
  }

  showEndAddBtn(): boolean {
    return (this.addBtnPosition == 'end' || this.addBtnPosition == 'both');
  }

  onClick(index) {
    this.clicked.emit(index);
  }
}
