import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Playlist } from 'src/app/types/playlist';
import { PlaylistsService } from 'src/app/service/playlists.service';
import { Observable } from 'rxjs';
import { ViewType } from 'src/app/types/view-type';
import { ViewItem } from 'src/app/types/view-item';

@Component({
  templateUrl: './playtech.component.html',
  styleUrls: ['./playtech.component.scss']
})
export class PlaytechComponent implements OnInit {
  ngOnInit(): void {
  }
}
