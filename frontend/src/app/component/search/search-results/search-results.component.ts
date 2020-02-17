import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Track, SearchResult } from '~types/index';
import { SpotifyService } from 'src/app/service/spotify.service';
import { Observable } from 'rxjs';

interface ResultsTypes extends Array<'track' | 'artist' | 'album'> { }

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() results: SearchResult = { tracks: [], artists: [], albums: [] };
  @Input() noActionBtn = false;
  @Input() reset: Observable<boolean>;
  @Output() selected: EventEmitter<Track[]> = new EventEmitter();

  _resultsTypes: ResultsTypes = ['track', 'album', 'artist'];
  @Input()
  set resultsTypes(rt: ResultsTypes) {
    this._resultsTypes = rt;
    this.resultsTypesChange.emit(this._resultsTypes);
  }
  get resultsTypes() {
    return this._resultsTypes;
  }
  @Output() resultsTypesChange = new EventEmitter();

  constructor(private spotify: SpotifyService) { }

  ngOnInit() { }

  onSelected(tracks: Track[]) {
    this.selected.emit(tracks);
  }

  onAlbumClicked(albumId) {
    this.spotify.getAlbumTracks(albumId).subscribe(
      (results: SearchResult) => {
        this.results = results;
      }
    );
  }

  onArtistClicked(artistId) {
    this.spotify.discoverArtist(artistId).subscribe(
      (results: SearchResult) => {
        this.results = results;
      }
    );
  }

  displayArtists() {
    return this.resultsTypes.includes('artist') && this.results.artists.length > 0;
  }

  displayAlbums() {
    return this.resultsTypes.includes('album') && this.results.albums.length > 0;
  }

  displayTracks() {
    return this.resultsTypes.includes('track') && this.results.tracks.length > 0;
  }
}
