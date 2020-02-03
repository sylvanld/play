import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  connected = false;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.auth.connected.subscribe(connected => {
      this.connected = connected;
    });
  }

}
