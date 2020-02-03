import { Component, OnInit } from '@angular/core';
import { YoutubeService } from 'src/app/service/youtube.service';
import { PlayerService } from 'src/app/service/player.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  query: string;
  private modelChanged: Subject<string> = new Subject<string>();

  constructor(private player: PlayerService, private youtube: YoutubeService) { }

  ngOnInit() {
    this.modelChanged.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(
        (query) => {
          this.query = query;
          this.youtube.searchTrack(query)
            .subscribe((object: any) => {
              const id: string = object.items[0].id.videoId;
              console.log(id);
              this.player.loadPlaylist([id], 0);
            });
        }
      );
  }

  changed(text: string) {
    this.modelChanged.next(text);
  }

}
