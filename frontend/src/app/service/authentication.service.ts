import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  register(user: { email: string, password: string }) {
    return this.http.post(environment.play_api_url + '/users', user);
  }

  login(email, password) {
    return this.http.post(environment.play_api_url + '/auth/token', {
      email, password
    });
  }
}
