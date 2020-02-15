import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/service/spotify.service';
import { Observable } from 'rxjs';
import { AutocompleteChipListComponent } from 'src/app/component/core/autocomplete-chip-list/autocomplete-chip-list.component';

@Component({
  selector: 'app-input-genres',
  templateUrl: '../../../core/autocomplete-chip-list/autocomplete-chip-list.component.html',
  styleUrls: ['./input-genres.component.scss']
})
export class InputGenresComponent extends AutocompleteChipListComponent<string> implements OnInit {
  placeholder = 'List of genres';

  constructor(private spotify: SpotifyService) { super(); }

  ngOnInit() {
  }

  search(query: string): Observable<string[]> {
    return this.spotify.searchGenre(query);
  }

  display(item) {
    return {
      title: item
    };
  }

}
