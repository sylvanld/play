import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from 'src/app/view/playtech/playlists.service';
import { SliderAdapter } from '../../slider/sliderAdapter.service';
import { Playlist } from 'src/app/classes/Playlist';

@Component({
  selector: 'app-playlist-creation-stepper',
  templateUrl: './playlist-creation-stepper.component.html',
  styleUrls: ['./playlist-creation-stepper.component.scss']
})
export class PlaylistCreationStepperComponent implements OnInit {
  @ViewChild('stepper', {static: false}) stepper;
  playlist: Playlist;
  newPlaylist: boolean = true;
  playlistTitle: string;
  private creationStep = 1;

  constructor(private data: PlaylistsService, private sliderController: SliderAdapter) {}

  ngOnInit() {
    let backAction = () => {
      this.complete();
      this.sliderController.hideSlider();
    }
    this.sliderController.setBarBackAction(backAction);
  }

  modeNewPlaylist(state: boolean) {
    this.newPlaylist = state;
    this.stepper.next();
  }
  
  addSongs($event) {
    // TODO: From filter
  }

  stepChange(event) {
    if (event.previouslySelectedIndex == this.creationStep && event.selectedIndex == this.creationStep+1) {
      this.playlist = this.data.createPlaylist(this.playlistTitle);
    }
  }

  complete() {
    this.stepper.reset();
    this.playlist = undefined;
    this.newPlaylist = true;
  }
}
