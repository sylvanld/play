import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-external-playlist-gen',
  templateUrl: './external-playlist-gen.component.html',
  styleUrls: ['./external-playlist-gen.component.scss']
})
export class ExternalPlaylistGenComponent implements OnInit {
  @Output() completed: EventEmitter<any> = new EventEmitter();
  @Input() playlistId: string;

  constructor() { }

  ngOnInit() {
  }

}
