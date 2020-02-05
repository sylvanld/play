
export const enum PlayerState {
  UNLOADED = -2,
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

export const enum PlayerVolumeState {
  MUTED = -1,
  OFF = 0,
  LOW = 50,
  HIGH = 100,
}
