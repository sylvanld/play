import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ViewItem } from '~types/view-item';

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
  @Input() items: ViewItem[] = [];
  @Input() editMode = true;
  @Input() emptyMsg = 'no item is present'

  @Output() deletedItem: EventEmitter<any> = new EventEmitter();
  @Output() movedItem: EventEmitter<any> = new EventEmitter();
  @Output() clickedItem: EventEmitter<any> = new EventEmitter();

  private showBin = false;

  // long press detection
  /*longPressTimer ?: ReturnType<typeof setTimeout> = undefined;
  mouseDown = false;*/

  constructor() { }

  ngOnInit() {
  }

  isMovable(): boolean {
    return this.movedItem.observers.length !== 0;
  }

  // event dispatch
  /*clickItem(item: ViewItem) {
    this.clickedItem.emit(item.id);
  }

  deleteItem(item: ViewItem) {
    this.deletedItem.emit(item.id);
  }*/

  clickItem(index: number) {
    this.clickedItem.emit(index);
  }

  deleteItem(index: number) {
    this.deletedItem.emit(index);
  }

  moveItem(event: CdkDragDrop<any>) {
    if (this.isMovable()) {
      this.movedItem.emit({
        id: this.items[event.currentIndex],
        oldIndex: event.previousIndex,
        newIndex: event.currentIndex
      });
      this.showBin = false;
    }
  }

  delete(event: CdkDragDrop<any>) {
    //const item = event.previousContainer.data[event.previousIndex];
    this.deleteItem(event.previousIndex);
    this.showBin = false;
  }

  // longPress menu
  /*longPressMenu(item: ViewItem) {
    this.bottomSheet.open(BottomSheetMenuViewItemsComponent, {
      data: {
        delItem: () => { this.deleteItem(item); }
      },
    });
  }

  // long press detection
  mousedown(item: ViewItem): void {
    this.mouseDown = true;
    this.longPressTimer = setTimeout(() => {
      if (this.mouseDown) {
        this.longPressMenu(item);
      }
     }, 800);
  }

  mouseup(): void {
    this.mouseDown = false;
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
  }*/
}
