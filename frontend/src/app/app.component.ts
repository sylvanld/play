import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private spotify: SpotifyService) { }

  ngOnInit() {

  }
}
