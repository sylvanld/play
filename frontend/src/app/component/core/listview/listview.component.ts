import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ViewItem } from '~types/view-item';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

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
  @Input() editMode = true;

  @Output() deletedItem: EventEmitter<any> = new EventEmitter();
  @Output() movedItem: EventEmitter<any> = new EventEmitter();
  @Output() clickedItem: EventEmitter<any> = new EventEmitter();

  // long press detection
  longPressTimer ?: ReturnType<typeof setTimeout> = undefined;
  mouseDown = false;

  constructor(
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
  }

  isMovable(): boolean {
    return this.movedItem.observers.length !== 0;
  }

  // event dispatch
  clickItem(item: ViewItem) {
    this.clickedItem.emit(item.id);
  }

  deleteItem(item: ViewItem) {
    this.deletedItem.emit(item.id);
  }

  moveItem(event: CdkDragDrop<any[]>) {
    this.movedItem.emit({
      id: this.items[event.currentIndex],
      oldIndex: event.previousIndex,
      newIndex: event.currentIndex
    });
  }

  // longPress menu
  longPressMenu(item: ViewItem) {
    this.bottomSheet.open(BottomSheetMenuComponent, {
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
  }
}

/////////////////////////////////////////

// bottom-sheet menu
@Component({
  selector: 'app-bottom-sheet',
  template: `
    <mat-nav-list>
      <button mat-button (click)="delItem($event)">
        <mat-icon aria-hidden="false" aria-label="delete the item">
          delete_outline
        </mat-icon> Delete
      </button>
      <button mat-button (click)="hide($event)">
        <mat-icon aria-hidden="false" aria-label="close bottom sheet">
          arrow_back
        </mat-icon> Cancel
      </button>
    </mat-nav-list>
  `,
})
class BottomSheetMenuComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetMenuComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  hide(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  delItem(event: MouseEvent) {
    this.data.delItem();
    this.hide(event);
  }
}
