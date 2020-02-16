import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player.service';
import { PlayerProviders } from '~types/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  private currentPlayer: PlayerProviders = undefined;

  constructor(private player: PlayerService) { }

  ngOnInit() {
    this.subscription.add(
      this.player.provider
        .subscribe((val: PlayerProviders) => this.currentPlayer = val)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
