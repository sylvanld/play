import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'play';
  connected = false;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.auth.connected.subscribe(connected => this.connected = connected);
  }
}
