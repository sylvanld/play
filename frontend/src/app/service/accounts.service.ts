import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  authHeaders = { headers: { Authorization: 'Bearer ' + this.auth.getToken() } };

  constructor(private auth: AuthenticationService, private http: HttpClient) { }

  myAccounts() {
    return this.http.get(environment.play_api_url + '/users/me/accounts', this.authHeaders);
  }
}
