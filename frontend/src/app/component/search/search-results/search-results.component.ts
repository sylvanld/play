import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchResult } from '~types/search-result';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [ './search-results.component.scss' ]
})
export class SearchResultsComponent implements OnInit {
  @Input() results: SearchResult = { tracks: [], artists: [], albums: [] };
  @Input() noActionBtn = false;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  
  constructor() {}

  ngOnInit() {}

  onSelected(row) {
    this.selected.emit(row);
  }
}
