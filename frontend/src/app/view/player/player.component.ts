import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { YoutubeService } from 'src/app/service/youtube.service';
import { PlayerService } from 'src/app/module/player/services/player.service';
import { Track } from 'src/app/types/track';

@Component({
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  query: string;
  private modelChanged: Subject<string> = new Subject<string>();

  constructor(private player: PlayerService,
              private youtube: YoutubeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.modelChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((query) => {
      this.query = query;
      this.youtube.searchTrack(query).subscribe((object: any) => {
        if (object.length > 0) {
          const id: string = object.items[0].id.videoId;
          const track: Track = {
            isrc: 'n',
            title: 'n',
            artist: 'n',
            album: 'n',
            release: null,
            external_ids: { spotify: 'n', youtube: id }
          };
          this.player.provider.loadTracks(track);
        } else {
          this.snackBar.open('Aucun résultat pour ce titre.', null, { duration: 1500 });
        }
      });
    });
  }

  changed(text: string) {
    this.modelChanged.next(text);
  }
}
