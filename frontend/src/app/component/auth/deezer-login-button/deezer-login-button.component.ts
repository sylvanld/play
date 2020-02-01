import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deezer-login-button',
  templateUrl: './deezer-login-button.component.html',
  styleUrls: ['./deezer-login-button.component.scss']
})
export class DeezerLoginButtonComponent implements OnInit {
  deezerAuthorizationUrl: string;

  constructor() { }

  ngOnInit() {
    this.deezerAuthorizationUrl = environment.play_api_url + '/auth/deezer';
  }

}
