import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ViewItem } from '~types/index';

export enum Position { Start = 'start', End = 'end', Both = 'both', None = 'none' }

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        query('.list-item', [
          style({ opacity: 0, transform: 'translateX(-100px)' }),
          stagger(30, [
            animate('0.2s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ListviewComponent implements OnInit {
  @Input() noPicture = false;
  @Input() items: ViewItem[] = [];
  @Input() locked = true;
  @Input() addBtnPosition: Position = Position.Start;
  @Input() addBtnLabel = 'Nouvel élément';
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

  moveItem(event: CdkDragDrop<any[]>) {
    this.moveItemEvent.emit({ oldIndex: event.previousIndex, newIndex: event.currentIndex });
  }

  showStartAddBtn(): boolean {
    return (!this.locked && (this.addBtnPosition === Position.Start || this.addBtnPosition === Position.Both));
  }

  showEndAddBtn(): boolean {
    return (!this.locked && (this.addBtnPosition === Position.End || this.addBtnPosition === Position.Both));
  }

  onClick(index) {
    if (!(this.locked && this.items[index].ro_diasabled)) {
      this.clicked.emit(index);
    }
  }
}
