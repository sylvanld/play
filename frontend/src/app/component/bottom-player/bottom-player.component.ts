import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/service/player.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-bottom-player',
  templateUrl: './bottom-player.component.html',
  styleUrls: ['./bottom-player.component.scss']
})
export class BottomPlayerComponent implements OnInit {
  isConnected = false;
  isDefined = false;

  constructor(public player: PlayerService, private auth: AuthenticationService) { }

  ngOnInit() {
    // subscribe to the state
    this.player.isDefined.subscribe(val => this.isDefined = val);
    this.auth.connected.subscribe(val => this.isConnected = val);
  }

}
