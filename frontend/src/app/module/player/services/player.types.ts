
export interface PlayerConfig {
    default: 'youtube';
    youtube?: YouTubeConfig;
  }
export interface YouTubeConfig {}

export const enum PlayerState {
    UNSTARTED = 0,
    PLAYING = 1,
    PAUSED = 2,
    ENDED = 3
  }

export const enum VolumeState {
  OFF = 0,
  LOW = 50,
  HIGH = 100,
  MUTED = -1,
}

export interface PlayerExtends {

  // functions
    cueTracks(tracks: string | string[]): void;
    currentTime(): number;
    durationTime(): number;
    getVolume(): number;
    loadTracks(tracks: string | string[]): void;
    mute(): void;
    next(): void;
    pause(): void;

    /**Plays the tracks.
     * @param idx: Plays the track at the idx position.
     */
    play(idx?: number): void;
    prev(): void;
    seekTo(seconds: number, reload: boolean): void;
    setVolume(vol: number): void;
    unMute(): void;

    // tslint:disable-next-line: max-line-length
    addEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void);
    // tslint:disable-next-line: max-line-length
    delEventListener(eventName: 'onReady' | 'onStateChange' | 'onPlaybackQualityChange' | 'onPlaybackRateChange' | 'onError' | 'onApiChange', listener: (event: YT.PlayerEvent) => void);
  }
