import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/types/album';
import { AutocompleteChipListComponent } from 'src/app/component/core/autocomplete-chip-list/autocomplete-chip-list.component';
import { SpotifyService } from 'src/app/service/spotify.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-input-albums',
  templateUrl: '../../../core/autocomplete-chip-list/autocomplete-chip-list.component.html',
  styleUrls: ['./input-albums.component.scss']
})
export class InputAlbumsComponent extends AutocompleteChipListComponent<Album> implements OnInit {
  placeholder = "List of albums";

  constructor(private spotify: SpotifyService) { super() }

  ngOnInit() {
  }

  search(query: string): Observable<Album[]> {
    return this.spotify.searchAlbum(query);
  }

  display(item) {
    return {
      title: item.name
    }
  }

}
