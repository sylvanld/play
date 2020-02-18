import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Track, Artist } from '~types/index';

interface AdvancedFilter {
  range: number[];
  selection: number[];
  name: string;
}

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  simpleFilters = {
    startDate: null,
    endDate: null,
    artists: [],
    tracks: [],
    genres: []
  };

  advancedFilters: AdvancedFilter[] = [];

  constructor(public dialogRef: MatDialogRef<AdvancedSearchComponent>) { }

  ngOnInit() {
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

  appendProsodics(filtersList) {
    this.advancedFilters.map((parameter) => {
      filtersList.push('min_' + parameter.name + '=' + parameter.selection[0]);
      filtersList.push('max_' + parameter.name + '=' + parameter.selection[1]);
    });
  }

  filtersToUrl() {
    const filters = [];
    this.appendArtists(filters);
    this.appendTracks(filters);
    this.appendGenres(filters);
    this.appendProsodics(filters);
    return filters.join('&');
  }

  onAdvancedFiltersChange(advancedFilters) {
    this.advancedFilters = advancedFilters;
  }

  onSubmit() {
    this.dialogRef.close(this.filtersToUrl());
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
