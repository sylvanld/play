import { Component, OnInit, Input } from '@angular/core';
import { SearchResult } from '~types/search-result';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [ './search-results.component.scss' ]
})
export class SearchResultsComponent implements OnInit {
  @Input() results: SearchResult = { tracks: [], artists: [], albums: [] };

  constructor() {}

  ngOnInit() {}
}
