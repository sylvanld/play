import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayService } from 'src/app/service/play.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friendship',
  templateUrl: './friendship.component.html',
  styleUrls: ['./friendship.component.scss']
})
export class FriendshipComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(
    private play: PlayService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
