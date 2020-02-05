import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-spotify-login-button',
  templateUrl: './spotify-login-button.component.html',
  styleUrls: ['./spotify-login-button.component.scss']
})
export class SpotifyLoginButtonComponent implements OnInit {
  spotifyAuthorizationUrl: string;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    const identifier = (!!this.auth.accessToken) ? '?token=' + this.auth.accessToken : '';
    this.spotifyAuthorizationUrl = environment.play_api_url + '/auth/spotify' + identifier;
  }

}
