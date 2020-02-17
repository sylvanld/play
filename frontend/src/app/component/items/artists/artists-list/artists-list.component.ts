import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '~types/play/play-artist';
import { ViewItem } from '~types/view-item';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  items: ViewItem[] = [];

  private _artists: Artist[] = [];
  @Input()
  set artists(artist: Artist[]) {
    const maxTitleLength = 50;
    this._artists = artist;

    this.items = artist.map((artist: Artist) => ({
      id: artist.id,
      picture: artist.picture,
      mainContent: artist.name.length > maxTitleLength ? artist.name.slice(0, maxTitleLength) + '...' : artist.name,
      secondaryContent: artist.genres.join(' / ')
    }));
  }

  @Output() artistClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onArtistClicked(index: number) {
    // callback defining what happened when album is clicked
    this.artistClicked.emit(this._artists[index].id);
  }

}
