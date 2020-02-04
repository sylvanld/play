import { Component, OnInit, Input } from '@angular/core';
import { DeezerGlobalSearchResult } from '~types/deezer';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() results: DeezerGlobalSearchResult = { tracks: [], artists: [], albums: [] };

  constructor() { }

  ngOnInit() {
  }

}
