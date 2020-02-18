import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-prosodics-filters',
  templateUrl: './prosodics-filters.component.html',
  styleUrls: ['./prosodics-filters.component.scss']
})
export class ProsodicsFiltersComponent implements OnInit {
  @Output() advancedFiltersChange = new EventEmitter();

  rangedParameters = [
    {
      name: 'danceability',
      range: [0.0, 1.0],
      step: 0.01,
      selection: [0.0, 1.0],
      description: `Danceability describes how suitable a track is for dancing based on a combination of musical elements`
    },
    {
      name: "instrumentalness",
      range: [0.0, 1.0],
      step: 0.01,
      selection: [0.0, 1.0],
      description: `whether a track contains no vocals.`
    },
    {
      name: "energy",
      range: [0.0, 1.0],
      step: 0.01,
      selection: [0.0, 1.0],
      description: `Energy represents a perceptual measure of intensity and activity.`
    },
    {
      name: "speechiness",
      range: [0.0, 1.0],
      step: 0.01,
      selection: [0.0, 1.0],
      description: `	Speechiness quantify the presence of spoken words in a track.`
    },
    {
      name: 'tempo',
      range: [0.0, 200],
      step: 2,
      selection: [0.0, 200],
      description: `Tempo measure the average beat duration.`
    }
  ];
  constructor() { }

  ngOnInit() {
  }

  notifyObservers() {
    this.advancedFiltersChange.next(this.rangedParameters);
  }

}
