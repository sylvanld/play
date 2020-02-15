import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PlayerService } from '../../player.service';
import { PlayerState, Track } from '~types/index';

@Component({
  selector: 'app-player-container',
  templateUrl: './player-container.component.html',
  styleUrls: ['./player-container.component.scss']
})
export class PlayerContainerComponent implements OnInit {

  private _prevVolume: number;
  private timeInterval;

  private volume = 100;
  private title: string;
  private state: PlayerState;

  private get isUnstated(): boolean { return this.state === PlayerState.UNSTARTED; }
  private get isReady(): boolean { return this.state !== PlayerState.UNSTARTED; }
  private get isPaused(): boolean { return this.state === PlayerState.PAUSED; }
  private get isPlaying(): boolean { return this.state === PlayerState.PLAYING; }

  /////////////////////////////////////////////////

  @Input() isMuted: boolean;
  @Input() timer: number;
  @Input() duration: number;

  @Output() prevEvent = new EventEmitter();
  @Output() nextEvent = new EventEmitter();
  @Output() playEvent = new EventEmitter();
  @Output() pauseEvent = new EventEmitter();

  @Output() muteEvent = new EventEmitter();
  @Output() unMuteEvent = new EventEmitter();

  @Output() timerChange = new EventEmitter();
  @Output() volumeChange = new EventEmitter();

  ////////////////////////////////////////////////
  constructor(private player: PlayerService) { }
  ngOnInit() {
    this.player.state.subscribe((state: PlayerState) => this.state = state);
    this.player.currentTrack.subscribe((track: Track) => {
      this.title = track.title + ' -- ' + track.artist;
    });

    this.timeInterval = setInterval(() => { }, 500); // tricks to force update values
  }

  ///////////////////////////////////////////////

  onPrevEvent() { this.prevEvent.emit(); }
  onNextEvent() { this.nextEvent.emit(); }
  onPlayEvent() { this.playEvent.emit(); }
  onPauseEvent() { this.pauseEvent.emit(); }

  onTimerChange({ value }) {
    this.timerChange.emit({ value, reload: true });
    this.playEvent.emit();
  }

  onTimerEvent({ value }) {
    this.timerChange.emit({ value, reload: false });
    this.pauseEvent.emit();
  }

  onVolumeEvent({ value }) {
    this.unMuteEvent.emit();
    this.volumeChange.emit({ value });
    this.volume = value;
  }

  onToggleMute() {
    if (!this.isMuted) {
      this.muteEvent.emit();
      this._prevVolume = this.volume;
      this.volume = 0;
      this.isMuted = true;
    } else {
      this.unMuteEvent.emit();
      this.volume = this._prevVolume;
      this.isMuted = false;
    }
  }

}
