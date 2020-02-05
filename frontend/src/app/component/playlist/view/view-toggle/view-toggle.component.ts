import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss']
})
export class ViewToggleComponent implements OnInit {
  @Input() hideLocker = false;
  @Input() locker = true;
  @Input() mode = 0;
  @Output() lockerChange = new EventEmitter<boolean>();
  @Output() modeChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  isListMode(): boolean {
    return this.mode === 0;
  }

  isCardMode(): boolean {
    return this.mode === 1;
  }

  listMode() {
    this.mode = 0;
    this.modeChange.emit(this.mode);
  }

  cardMode() {
    this.mode = 1;
    this.modeChange.emit(this.mode);
  }

  swapLocker() {
    this.locker = !this.locker;
    this.lockerChange.emit(this.locker);
  }
}
