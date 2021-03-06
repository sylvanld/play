import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SpotifyService } from 'src/app/service/spotify.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { SearchResult } from '~types/index';

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
  @Input() filtersList = ['track', 'album', 'artist'];

  _resultsTypes = ['track', 'album', 'artist'];
  @Input()
  set resultsTypes(filters: string[]) {
    this._resultsTypes = filters;
    console.log('results types changes');
    if (this.filters) {
      this.filters.setValue(this._resultsTypes);
    }

    this.resultsTypesChange.emit(this._resultsTypes);
  }
  get resultsTypes() {
    return this._resultsTypes;
  }
  @Output() resultsTypesChange = new EventEmitter();

  @Input() displayFilters = true;
  filters: FormControl;

  @Output() results = new EventEmitter<SearchResult>();

  constructor(private spotify: SpotifyService, private dialog: MatDialog) {
    this.spotify.getNewReleases().subscribe(
      (results: SearchResult) => {
        this.results.emit(results);
      }
    )
  }

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
    this.filters = new FormControl(this.resultsTypes.slice());

    this.filters.setValidators(this.validateFilters);
    // update placeholder when filters change
    this.filters.valueChanges.subscribe((filters) => {
      this.placeholder = 'Search by ' + filters.join(',');
      this.resultsTypes = filters;
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

  submitAdvancedSearch(filtersQueryParams: string) {
    this.spotify.suggestions(filtersQueryParams).subscribe(
      (results: SearchResult) => {
        this.results.emit(results);
      }
    );
  }

  openFilters(event) {
    console.log(event);
    const dialog = this.dialog.open(AdvancedSearchComponent, {
      width: '500px'
    });
    //
    dialog.afterClosed().subscribe(
      filtersQueryParams => this.submitAdvancedSearch(filtersQueryParams)
    );
  }

  onResultsTypesChange() {
    console.log(this.filters);
  }
}
