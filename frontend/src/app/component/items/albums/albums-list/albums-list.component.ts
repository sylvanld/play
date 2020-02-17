import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewItem } from '~types/view-item';
import { Album } from '~types/play/play-album';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  items: ViewItem[] = [];
  @Output() albumClicked = new EventEmitter();

  private _albums: Album[] = [];
  @Input()
  set albums(albums: Album[]) {
    const maxTitleLength = 50;
    this._albums = albums;

    this.items = albums.map((album: Album) => ({
      id: album.id,
      picture: album.cover,
      mainContent: album.name.length > maxTitleLength ? album.name.slice(0, maxTitleLength) + '...' : album.name,
      secondaryContent: album.artists.join(' - ')
    }));
  }

  constructor() { }

  ngOnInit() { }

  onAlbumClicked(index: number) {
    // callback defining what happened when album is clicked
    this.albumClicked.emit(this._albums[index].id);
  }
}
