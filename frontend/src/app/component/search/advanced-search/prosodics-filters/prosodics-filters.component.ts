import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'search-prosodics-filters',
  templateUrl: './prosodics-filters.component.html',
  styleUrls: ['./prosodics-filters.component.scss']
})
export class ProsodicsFiltersComponent implements OnInit {
  rangedParameters = [
    /*{
      name: "acousticness",
      range: [0.0, 1.0]
    },*/
    {
      name: "danceability",
      range: [0.0, 1.0],
      description: `Danceability describes how suitable a track is for dancing based on a combination of musical elements`
    },
    /*{
      name: "energy",
      range: [0.0, 1.0]
    },
    {
      name: "loudness",
      range: [-60, 0.0]
    },
    {
      name: "speechiness",
      range: [0.0, 1.0]
    },
    {
      name: "instrumentalness",
      range: [0.0, 1.0]
    },
    {
      name: "liveness",
      range: [0.0, 1.0]
    },
    {
      name: "valence",
      range: [0.0, 1.0]
    },*/
    {
      name: "tempo",
      range: [0.0, 200],
      description: `Tempo measure the average beat duration.`
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
