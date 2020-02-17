import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Track, SearchResult } from '~types/index';
import { SpotifyService } from 'src/app/service/spotify.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  @Input() results: SearchResult = { tracks: [], artists: [], albums: [] };
  @Input() noActionBtn = false;
  @Output() selected: EventEmitter<Track[]> = new EventEmitter();

  constructor(private spotify: SpotifyService) { }

  ngOnInit() { }

  onSelected(tracks: Track[]) {
    console.log('tracks selected', tracks);
    this.selected.emit(tracks);
  }

  onAlbumClicked(albumId) {
    console.log('in parent, album clicked', albumId);
    this.spotify.getAlbumTracks(albumId).subscribe(
      (results: SearchResult) => this.results = results
    )
  }
}
