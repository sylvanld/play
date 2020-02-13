import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-dates',
  templateUrl: './input-dates.component.html',
  styleUrls: ['./input-dates.component.scss'],
})
export class InputDatesComponent implements OnInit {
  /* about start date */
  _startDate = new Date();

  @Input()
  get startDate() {
    return this._startDate;
  }

  @Output() startDateChange = new EventEmitter();

  set startDate(date: Date) {
    this._startDate = date;
    this.startDateChange.emit(this._startDate);
  }

  /* about end date */
  _endDate = new Date();

  @Input()
  get endDate() {
    return this._endDate;
  }

  @Output() endDateChange = new EventEmitter();

  set endDate(date: Date) {
    this._endDate = date;
    this.endDateChange.emit(this._endDate);
  }

  constructor() { }

  ngOnInit() {
  }

}
