import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { PlaylistsService } from 'src/app/service/playlists.service';
import { PlayService } from 'src/app/service/play.service';
import { Playlist } from '~types/index';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  friends = [];
  playlists: Playlist[];

  shareForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private play: PlayService,
    private playlist: PlaylistsService) {

    this.shareForm = this.builder.group({
      firendsControl: new FormControl([], [Validators.required]),
      playlistsControl: new FormControl([], [Validators.required]),
    });
  }

  ngOnInit() {

    this.subscription.add(
      this.play.myFriends()
        .pipe(take(1))
        .subscribe((users) => this.friends = users)
    );

    this.subscription.add(
      this.playlist.playlists
        .pipe(take(1))
        .subscribe((playlists: Playlist[]) => {
          this.playlists = playlists;
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit({ firendsControl, playlistsControl }) {
    // TODO: notify
  }

}
