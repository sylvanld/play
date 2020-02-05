import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '@youtube/youtube.service';
import { PlayerService } from '@play/player.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-player',
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
    this.modelChanged.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(
        (query) => {
          this.query = query;
          this.youtube.searchTrack(query)
            .subscribe((object: any) => {
              if (object.length > 0) {
                const id: string = object.items[0].id.videoId;
                this.player.loadPlaylist([id], 0);
              } else {
                this.snackBar.open('Aucun résultat pour ce titre.', null, { duration: 1500 });
              }
            });
        }
      );
  }

  changed(text: string) {
    this.modelChanged.next(text);
  }
}
