import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-deezer-login-button',
  templateUrl: './deezer-login-button.component.html',
  styleUrls: ['./deezer-login-button.component.scss']
})
export class DeezerLoginButtonComponent implements OnInit {
  deezerAuthorizationUrl: string;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    const identifier = (!!this.auth.accessToken) ? '?token=' + this.auth.accessToken : '';
    this.deezerAuthorizationUrl = environment.play_api_url + '/auth/deezer' + identifier;
  }

}
