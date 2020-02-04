import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-player-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onReady = new EventEmitter();

  private showVideo = false;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    // This code loads the YT IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.player.stateObs.subscribe(() => {
      this.onReady.emit();
    });

    this.player.showVideo.subscribe((val: boolean) => {
      this.showVideo = val;
    });
  }
}
