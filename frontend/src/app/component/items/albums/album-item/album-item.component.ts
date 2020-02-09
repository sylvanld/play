import { Component, OnInit, Input } from '@angular/core';
import { Album } from '~types/album';

@Component({
  selector: 'app-album-item',
  templateUrl: './album-item.component.html',
  styleUrls: [ './album-item.component.scss' ]
})
export class AlbumItemComponent implements OnInit {
  @Input() album: Album;

  constructor() {}

  ngOnInit() {}
}
