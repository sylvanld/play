import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Artist } from '~types/artist';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-artist-item',
	templateUrl: './artist-item.component.html',
	styleUrls: [ './artist-item.component.scss' ]
})
export class ArtistItemComponent implements OnInit {
	@Input() artist: Artist;

	constructor() {}

	ngOnInit() {}
}
