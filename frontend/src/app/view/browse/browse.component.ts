import { Component, OnInit, Input } from '@angular/core';
import { SearchResult } from '~types/index';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  results: SearchResult = { tracks: [], artists: [], albums: [] };
  resultsTypes = ['track', 'album', 'artist'];

  constructor() { }

  ngOnInit() { }

  onResultsChange(results: SearchResult) {
    this.results = results;
  }

  onTypeChange() {
    console.log('type change', this.resultsTypes);
  }
}
