import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from 'src/app/service/spotify.service';
import { SearchResult } from '~types/search-result';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrls: [ './search-bar.component.scss' ]
})
export class SearchbarComponent implements OnInit {
	query = '';
	placeholder = 'Search by ...';

	// about filters
	filterIcon = { track: 'audiotrack', album: 'album', artist: 'people' };
	filtersList = [ 'track', 'album', 'artist' ];
	filters = new FormControl([ 'track', 'album', 'artist' ]);

	@Output() results = new EventEmitter<SearchResult>();

	constructor(private spotify: SpotifyService) {}

	ngOnInit() {}

	getFilters() {
		return this.filters.value;
	}

	submitSearch() {
		this.spotify.search(this.query, this.getFilters()).subscribe((results: SearchResult) => {
			this.results.emit(results);
		});
	}
}
