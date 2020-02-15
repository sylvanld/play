import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Artist, Track } from '~types/index';


interface SimpleFilters {
  startDate: Date;
  endDate: Date;
  artists: Artist[];
  tracks: Track[];
  genres: string[];
}

@Component({
  selector: 'search-simple-filters',
  templateUrl: './simple-filters.component.html',
  styleUrls: ['./simple-filters.component.scss']
})
export class SimpleFiltersComponent implements OnInit {
  /* filters io */
  _filters: SimpleFilters;

  @Input()
  get filters() {
    return this._filters;
  }
  set filters(_filters: SimpleFilters) {
    this._filters = this.filters;
    this.filtersChange.emit(this._filters);
  }

  @Output() filtersChange = new EventEmitter();


  /* startDate getters and setters */
  set startDate(date: Date) {
    this._filters.startDate = date;
    this.filtersChange.emit(this._filters);
  }
  get startDate() {
    return this._filters.startDate;
  }
  /* endDate getters and setters */
  set endDate(date: Date) {
    this._filters.endDate = date;
    this.filtersChange.emit(this._filters);
  }
  get endDate() {
    return this._filters.endDate;
  }
  /* artists getters and setters */
  set artists(artists: Artist[]) {
    this._filters.artists = artists;
    this.filtersChange.emit(this._filters);
  }
  get artists() {
    return this._filters.artists;
  }
  /* albums getters and setters */
  set tracks(tracks: Track[]) {
    this._filters.tracks = tracks;
    this.filtersChange.emit(this._filters);
  }
  get tracks() {
    return this._filters.tracks;
  }
  /* genres getters and setters */
  set genres(genres: string[]) {
    this._filters.genres = genres;
    this.filtersChange.emit(this._filters);
  }
  get genres() {
    return this._filters.genres;
  }

  constructor() { }

  ngOnInit() {
    this.resetFilters();
  }

  resetFilters() {
    this._filters = {
      startDate: null,
      endDate: null,
      artists: [],
      tracks: [],
      genres: []
    };
  }

}
