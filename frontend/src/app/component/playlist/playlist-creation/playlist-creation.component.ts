import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from 'src/app/view/playtech/playlists.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-playlist-creation',
  templateUrl: './playlist-creation.component.html',
  styleUrls: ['./playlist-creation.component.scss']
})
export class PlaylistCreationComponent implements OnInit {
  @ViewChild('stepper', {static: false}) private stepper: MatStepper;
  playlistTitle: string;
  private viewMode: string = null;
  private step = 0;
  private sectionTitle = 'Création';

  constructor(private data: PlaylistsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.viewMode = params.view;
    });
  }

  goToNewPlaylist() {
    const playlistId = this.data.createPlaylist().id;
    if (this.viewMode != null) {
      // this.router.navigateByUrl('/playlist/edit/' + playlistId, { queryParams: { view: this.viewMode} });
      this.router.navigate(['/playlist/edit/' + playlistId], { queryParams: { view: this.viewMode } });
    } else {
      // this.router.navigateByUrl('/playlist/edit/' + playlistId);
      this.router.navigate(['/playlist/edit/' + playlistId]);
    }
  }

  nextStep() {
    this.step++;
    this.sectionTitle = (this.step === 1) ? 'Importation' : 'Création';
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

  goBack() {
    if (this.viewMode != null) {
      // this.router.navigateByUrl('/playtech', { queryParams: { view: this.viewMode} });
      this.router.navigate(['/playtech'], { queryParams: { view: this.viewMode } });
    } else {
      // this.router.navigateByUrl('/playtech');
      this.router.navigate(['/playtech']);
    }
  }
}
