import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss']
})
export class ViewToggleComponent implements OnInit {
  private switchMode = 0;
  @Input() hideLocker = false;
  @Input() locker = false;
  @Output() lockerChange = new EventEmitter<boolean>();
  @Output() mode = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  isListMode(): boolean {
    return this.switchMode === 0;
  }

  isCardMode(): boolean {
    return this.switchMode === 1;
  }

  listMode() {
    this.switchMode = 0;
    this.mode.emit(this.switchMode);
  }

  cardMode() {
    this.switchMode = 1;
    this.mode.emit(this.switchMode);
  }

  swapLocker() {
    this.locker = !this.locker;
    this.lockerChange.emit(this.locker);
  }
}
