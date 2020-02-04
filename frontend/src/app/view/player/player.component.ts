import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { YoutubeService } from 'src/app/service/youtube.service';
import { PlayerService } from '~player/services/player.service';

@Component({
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
              this.player.provider.loadTracks([id]);
            });
        }
      );
  }

  changed(text: string) {
    this.modelChanged.next(text);
  }

}
