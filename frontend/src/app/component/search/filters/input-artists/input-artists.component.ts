import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/types/artist';
import { Observable } from 'rxjs';
import { AutocompleteChipListComponent } from 'src/app/component/core/autocomplete-chip-list/autocomplete-chip-list.component';
import { SpotifyService } from 'src/app/service/spotify.service';


@Component({
  selector: 'app-input-artists',
  templateUrl: '../../../core/autocomplete-chip-list/autocomplete-chip-list.component.html',
  styleUrls: ['./input-artists.component.scss']
})
export class InputArtistsComponent extends AutocompleteChipListComponent<Artist> implements OnInit {
  placeholder = "List of artists";

  constructor(private spotify: SpotifyService) { super() }

  ngOnInit() {
  }

  search(query: string): Observable<Artist[]> {
    return this.spotify.searchArtist(query);
  }

  display(item) {
    return {
      title: item.name
    }
  }

}
