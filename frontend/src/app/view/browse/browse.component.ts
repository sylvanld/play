import { Component, OnInit, Input } from '@angular/core';
import { DeezerGlobalSearchResult } from '~types/deezer';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  results: DeezerGlobalSearchResult = { tracks: [], artists: [], albums: [] };

  constructor() { }

  ngOnInit() {
  }

}
