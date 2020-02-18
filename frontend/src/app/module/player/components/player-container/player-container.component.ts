import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { PlayerService } from '../../player.service';
import { PlayerState, Track } from '~types/index';
import { Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TracksQueueComponent } from '../tracks-queue/tracks-queue.component';

@Component({
  selector: 'app-player-container',
  templateUrl: './player-container.component.html',
  styleUrls: ['./player-container.component.scss']
})
export class PlayerContainerComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  private _prevVolume: number;
  private timeInterval;

  queue: Track[] = [];
  currentTrack: Track;

  volume = 100;
  private state: PlayerState;

  get isUnstated(): boolean { return this.state === PlayerState.UNSTARTED; }
  get isReady(): boolean { return this.state !== PlayerState.UNSTARTED; }
  get isPaused(): boolean { return this.state === PlayerState.PAUSED; }
  get isPlaying(): boolean { return this.state === PlayerState.PLAYING; }

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
  constructor(
    private player: PlayerService,
    private bottomQueue: MatBottomSheet
  ) { }

  ngOnInit() {
    this.subscription.add(
      this.player.state.subscribe((state: PlayerState) => this.state = state)
    );
    this.subscription.add(
      this.player.currentTrack.subscribe((track: Track) => {
        this.currentTrack = track;
      })
    );
    this.subscription.add(
      this.player.tracksQueue.subscribe((tracks: Track[]) => {
        this.queue = tracks;
      })
    )

    this.timeInterval = setInterval(() => { }, 500); // tricks to force update values
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.timeInterval);
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

  showQueue() {
    const queue = this.bottomQueue.open(TracksQueueComponent, {
      data: { currentTrack: this.currentTrack, tracksQueue: this.queue }
    });
    queue.instance.selection.subscribe(index => {
      this.player.setPosition(index);
    })
  }

}
