import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/types/album';
import { AutocompleteChipListComponent } from 'src/app/component/core/autocomplete-chip-list/autocomplete-chip-list.component';
import { SpotifyService } from 'src/app/service/spotify.service';
import { Observable } from 'rxjs';
import { Track } from '~types/track';

@Component({
  selector: 'app-input-tracks',
  templateUrl: '../../../core/autocomplete-chip-list/autocomplete-chip-list.component.html',
  styleUrls: ['./input-tracks.component.scss']
})
export class InputTracksComponent extends AutocompleteChipListComponent<Track> implements OnInit {
  placeholder = "Tracks that sound like...";

  constructor(private spotify: SpotifyService) { super() }

  ngOnInit() {
  }

  search(query: string): Observable<Track[]> {
    return this.spotify.searchTrack(query);
  }

  display(item) {
    return {
      title: item.title
    }
  }

}
