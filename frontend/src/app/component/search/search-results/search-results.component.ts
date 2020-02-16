import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Track, SearchResult } from '~types/index';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() results: SearchResult = { tracks: [], artists: [], albums: [] };
  @Input() noActionBtn = false;
  @Output() selected: EventEmitter<Track[]> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSelected(tracks: Track[]) {
    console.log('tracks selected', tracks);
    this.selected.emit(tracks);
  }
}
