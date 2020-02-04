import { Component, OnInit, Input } from '@angular/core';
import { DeezerService } from '~deezer/deezer.service';
import { DeezerGlobalSearchResult } from '~types/deezer';

const ALL = 'ALL';
const TRACKS = 'TRACKS';
const ARTISTS = 'ARTISTS';
const ALBUMS = 'ALBUMS';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchbarComponent implements OnInit {
  query = '';
  placeholder = 'Search by ...';
  filters = [ALL, TRACKS, ARTISTS, ALBUMS];

  @Input() appliedFilter = ARTISTS;
  @Input() results: DeezerGlobalSearchResult = { tracks: [], artists: [], albums: [] };

  constructor(private deezer: DeezerService) { }

  ngOnInit() {

  }

  submitSearch() {
    console.log(this.query);
    this.deezer.search(this.query).subscribe((results: DeezerGlobalSearchResult) => {
      console.log(results);
    });
  }

}
