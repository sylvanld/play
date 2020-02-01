import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-spotify-login-button',
  templateUrl: './spotify-login-button.component.html',
  styleUrls: ['./spotify-login-button.component.scss']
})
export class SpotifyLoginButtonComponent implements OnInit {
  spotifyAuthorizationUrl: string;

  constructor() { }

  ngOnInit() {
    this.spotifyAuthorizationUrl = environment.play_api_url + '/auth/spotify';
  }

}
