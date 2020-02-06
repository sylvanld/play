import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { of } from 'rxjs';
import { ViewType } from '~types/view-type';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss']
})
export class ViewToggleComponent implements OnInit {
  @Input() hideLocker = false;
  @Input() locker = true;
  @Input() mode: ViewType = ViewType.Card;
  @Output() lockerChange = new EventEmitter<boolean>();
  @Output() modeChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  isListMode(): boolean {
    return this.mode === ViewType.List;
  }

  isCardMode(): boolean {
    return this.mode === ViewType.Card;
  }

  listMode() {
    this.mode = ViewType.List;
    this.modeChange.emit(this.mode);
  }

  cardMode() {
    this.mode = ViewType.Card;
    this.modeChange.emit(this.mode);
  }

  swapLocker() {
    this.locker = !this.locker;
    this.lockerChange.emit(this.locker);
  }
}
