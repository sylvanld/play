import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-filtered-playlist-gen',
  templateUrl: './filtered-playlist-gen.component.html',
  styleUrls: ['./filtered-playlist-gen.component.scss']
})
export class FilteredPlaylistGenComponent implements OnInit {
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Input() playlistId:string;

  constructor() { }

  ngOnInit() {
  }

}
