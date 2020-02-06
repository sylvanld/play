import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-tempo',
  templateUrl: './input-tempo.component.html',
  styleUrls: ['./input-tempo.component.scss']
})
export class InputTempoComponent implements OnInit {
  rangeValues: number[] = [0, 100];

  constructor() { }

  ngOnInit() {
  }

}
