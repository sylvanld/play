import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  authHeaders = { headers: { Authorization: 'Bearer ' + this.auth.getToken() } };

  constructor(private auth: AuthenticationService, private http: HttpClient) { }

  myAccounts() {
    return this.http.get(environment.play_api_url + '/users/me/accounts', this.authHeaders);
  }

  myFriends() {
    return this.http.get(environment.play_api_url + '/users/me/friends', this.authHeaders);
    /*
    return of([
      { name: 'Jean Dupont', id: 1 },
      { name: 'Claude Dupont', id: 2 },
      { name: 'Bob Dupont', id: 3 },
    ]);
    */
  }
}
