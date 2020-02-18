import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayService } from 'src/app/service/play.service';
import { Subscription, forkJoin } from 'rxjs';
import { User } from '~types/index';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-friendship',
  templateUrl: './friendship.component.html',
  styleUrls: ['./friendship.component.scss']
})
export class FriendshipComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  items = [];

  private me: User;

  accepted: { accepted: boolean, friend: User, id: number }[];
  incoming: { accepted: boolean, friend: User, id: number }[];
  outgoing: { accepted: boolean, friend: User, id: number }[];

  constructor(
    private play: PlayService
  ) { }

  ngOnInit() {
    this.subscription.add(this.play.whoami().subscribe((me: User) => this.me = me));
    this.subscription.add(
      this.play.myRequestFriendships()
        .subscribe(
          ({ accepted, pending }: {
            accepted: { accepted: boolean, friend: User, id: number }[],
            pending: {
              incoming: { accepted: boolean, friend: User, id: number }[],
              outgoing: { accepted: boolean, friend: User, id: number }[]
            }
          }) => {
            this.accepted = accepted;
            this.incoming = pending.incoming;
            this.outgoing = pending.outgoing;
            console.log(this.accepted, this.incoming, this.outgoing);
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addItem($event) {
    this.items = $event;
  }


  acceptFrienship(id) {
    this.play.acceptFriendship(id).subscribe(() => {
      console.log('user accepted!');
    });
  }

  onSubmitFriendship() {
    console.log('submit');
    for (const user of this.items) {
      this.play.inviteFriend(user.id).subscribe(
        (u: any) => {
          this.items = [];
        }
      );
    }
  }
}
