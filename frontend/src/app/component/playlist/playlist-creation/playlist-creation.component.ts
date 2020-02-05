import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from 'src/app/view/playtech/playlists.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-playlist-creation',
  templateUrl: './playlist-creation.component.html',
  styleUrls: ['./playlist-creation.component.scss']
})
export class PlaylistCreationComponent implements OnInit {
  @ViewChild('stepper', {static: false}) private stepper: MatStepper;
  playlistTitle: string;
  private step = 0;

  constructor(private data: PlaylistsService, private router: Router) { }

  ngOnInit() {
  }

  goToNewPlaylist() {
    const playlistId = this.data.createPlaylist().id;
    this.router.navigateByUrl('/playlist/edit/?id=' + playlistId);
  }

  nextStep() {
    this.step++;
  }

  selectSource(source: string) {
    switch (source) {
      case 'spotify':
        this.stepper.next();
        break;
      case 'youtube':
        this.stepper.next();
        break;
      case 'deezer':
        this.stepper.next();
        break;
      default:
        break;
    }
  }

  stepChange(event) {
    // event.previouslySelectedIndex
    // event.selectedIndex

  }
}
