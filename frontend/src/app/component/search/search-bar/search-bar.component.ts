import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SpotifyService } from 'src/app/service/spotify.service';
import { SearchResult } from '~types/search-result';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchbarComponent implements OnInit {
  query = '';
  placeholder = 'Search';

  // about filters
  filterIcon = { track: 'audiotrack', album: 'album', artist: 'people' };
  filtersList = ['track', 'album', 'artist'];
  filters: FormControl;

  @Input() noTrack = false;
  @Input() noAlbum = false;
  @Input() noArtist = false;
  @Output() results = new EventEmitter<SearchResult>();


  constructor(private spotify: SpotifyService) { }

  validateFilters(formControl) {
    return formControl.value && formControl.value.length
      ? null
      : {
        requiredList: {
          valid: false
        }
      };
  }

  ngOnInit() {
    if (this.noTrack) { this.filtersList.splice(this.filtersList.indexOf('track'), 1); }
    if (this.noAlbum) { this.filtersList.splice(this.filtersList.indexOf('album'), 1); }
    if (this.noArtist) { this.filtersList.splice(this.filtersList.indexOf('artist'), 1); }
    this.filters = new FormControl( this.filtersList.slice() );

    this.filters.setValidators(this.validateFilters);
    // update placeholder when filters change
    this.filters.valueChanges.subscribe((filters) => {
      this.placeholder = 'Search by ' + filters.join(',');
    });
  }

  getFilters() {
    return this.filters.value;
  }

  submitSearch() {
    this.spotify.search(this.query, this.getFilters()).subscribe((results: SearchResult) => {
      this.results.emit(results);
    });
  }
}
