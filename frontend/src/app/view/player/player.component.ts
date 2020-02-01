import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { YoutubeService } from '@youtube/youtube.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  private query: string;

  constructor(private youtube: YoutubeService) { }

  ngOnInit() {
  }

  updates() {
    this.youtube.searchTrack(this.query).subscribe(( object ) => {
      let id: string = object.items[0].id.videoId;
      console.log(id);
      this.youtube.loadPlaylist([id], 0);
    });
  }

}
