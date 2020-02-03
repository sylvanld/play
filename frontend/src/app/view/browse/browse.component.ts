import { Component, OnInit, Input } from '@angular/core';
import { DeezerGlobalSearchResult } from 'src/app/module/deezer/deezer-global-search-result';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  results: DeezerGlobalSearchResult = { tracks: [], artists: [], albums: [] };

  constructor() { }

  ngOnInit() {
  }

}
