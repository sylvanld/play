import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistTypeEnum } from 'src/app/classes/PlaylistType';
import { PlaylistsService } from 'src/app/view/playtech/playlists.service';

@Component({
  selector: 'app-playlist-creation-stepper',
  templateUrl: './playlist-creation-stepper.component.html',
  styleUrls: ['./playlist-creation-stepper.component.scss']
})
export class PlaylistCreationStepperComponent implements OnInit {
  @ViewChild('stepper', {static: false}) stepper;
  playlistType: PlaylistTypeEnum;
  playlistId: string;
  genComplete: boolean = false;
  playlistLocker: boolean = false;

  constructor(private data: PlaylistsService) { }

  ngOnInit() {
    this.playlistType = PlaylistTypeEnum.Manual;
  }


  isFiltered() {
    return (this.playlistType == PlaylistTypeEnum.Filtered);
  }

  isExternal() {
    return (this.playlistType == PlaylistTypeEnum.External);
  }

  isManual() {
    return (this.playlistType == PlaylistTypeEnum.Manual);
  }

  checkGeneration() {
    this.genComplete = (this.genComplete || this.isManual());
    console.log('genComplete:', this.genComplete)
  }

  step2Completed() {
    //TODO ...
    this.genComplete = true;
  }

  stepChange(event) {
    if (event.selectedIndex == 0 && this.playlistType != null) {
      console.log('generate playlist of type:', this.playlistType);
      this.playlistId = this.data.createPlaylist(this.playlistType);
    }
  }

  playlistTypeChoice() {
    return Object.values(PlaylistTypeEnum);
  }
}
