import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

enum Position { Start='start', End='end', Both='both'}

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.scss']
})
export class CardviewComponent implements OnInit {
  @Input() items: Array<Object> = [];
  @Input() locked: boolean = true;
  @Input() addBtnPosition: Position = Position.Start;
  @Output() addItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() delItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() moveItemEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addItem() {
    this.addItemEvent.emit();
  }

  /*delItem(item) {
    this.delItemEvent.emit(item);
  }*/

  /*moveItem(item) {
    this.moveItemEvent.emit(item);
  }*/

  delItem(item) {
    let index = this.items.indexOf(item);
    this.delItemEvent.emit(index);
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
}
