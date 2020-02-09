import { Component, OnInit } from '@angular/core';
import { Artist } from '~types/artist';
import { Track } from '~types/track';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  itemsTypes = [{
    name: 'track',
    icon: 'audiotrack'
  }, {
    name: 'album',
    icon: 'album'
  }, {
    name: 'artist',
    icon: 'people'
  }];

  query = {
    itemsTypes: ['track', 'album']
  }

  simpleFilters = {
    startDate: null,
    endDate: null,
    artists: [],
    tracks: [],
    genres: []
  };

  constructor() { }

  ngOnInit() {
  }

  search() {
    console.log(this.query);
  }

  appendArtists(filtersList) {
    if (this.simpleFilters && this.simpleFilters.artists.length > 0) {
      filtersList.push(
        'seed_artists=' + this.simpleFilters.artists.map(
          (artist: Artist) => artist.id
        ).join(',')
      );
    }
  }

  appendGenres(filtersList) {
    if (this.simpleFilters && this.simpleFilters.genres.length > 0) {
      filtersList.push(
        'seed_genres=' + this.simpleFilters.genres.join(',')
      )
    }
  }

  appendTracks(filtersList) {
    if (this.simpleFilters && this.simpleFilters.tracks.length > 0) {
      filtersList.push(
        'seed_tracks=' + this.simpleFilters.tracks.map(
          (track: Track) => track.external_ids.spotify
        ).join(',')
      )
    }
  }

  filtersToUrl() {
    const filters = [];
    this.appendArtists(filters);
    this.appendTracks(filters);
    this.appendGenres(filters);
    console.log('filters', filters);
  }

  notify() {
    this.filtersToUrl();
  }
}
