import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AutocompleteChipListComponent } from 'src/app/component/core/autocomplete-chip-list/autocomplete-chip-list.component';
import { PlayService } from 'src/app/service/play.service';
import { User } from '~types/index';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-input-users',
  templateUrl: '../../../core/autocomplete-chip-list/autocomplete-chip-list.component.html',
  styleUrls: ['./input-users.component.scss']
})
export class InputUsersComponent extends AutocompleteChipListComponent<User> implements OnInit {
  placeholder = 'Add an user';
  _users: User[] = [];

  constructor(private play: PlayService) { super(); }

  ngOnInit() {
    this.play.getUsers().subscribe((users) => this._users = users);
  }

  search(query: string): Observable<User[]> {
    return of(this._users).pipe(

      // custom filter
      map((users: User[]) => {
        const returns: User[] = [];
        for (const user of users) {
          if (user.email.startsWith(query)) {
            returns.push(user);
          }
        }
        return returns;
      })
    );
  }

  display(item) {
    return {
      title: item.email
    };
  }

}
