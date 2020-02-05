import { Component, OnInit, Input } from '@angular/core';
import { Track } from '~types/track';

@Component({
	selector: 'app-tracks-list',
	templateUrl: './tracks-list.component.html',
	styleUrls: [ './tracks-list.component.scss' ]
})
export class TracksListComponent implements OnInit {
	@Input() tracks: Track[] = [];
	displayedColumns: string[] = [ 'title', 'artist', 'album', 'release' ];

	constructor() {}

	ngOnInit() {}
}
