import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

function getUrlParams() {
  const params = {};
  const paramsPosition = window.location.href.indexOf('?');

  if (paramsPosition === -1) {
    return params;
  }

  for (const item of window.location.href.substr(paramsPosition + 1).split('&')) {
    const d = item.split('=');
    params[d[0]] = d[1];
  }
  return params;
}

// key use to set/get item in store
const ACCESS_TOKEN = 'ACCESS_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  _connected = new BehaviorSubject<boolean>(false);
  connected = this._connected.asObservable();

  accessToken: string = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private notify: NotificationService,
    private route: ActivatedRoute
  ) { }

  register(user: { email: string, password: string }) {
    this.http.post(environment.play_api_url + '/users', user)
      .subscribe(
        resp => {
          this.notify.info('Successfully registered');
          this.login(user.email, user.password);
        },
        error => {
          let message: string = null;
          switch (error.status) {
            case 409:
              message = 'An account already exists with this email address.';
              break;
          }
          this.notify.error(message);
        }
      );
  }

  login(email, password) {
    this.http.post(environment.play_api_url + '/auth/token/play', {
      email, password
    }).subscribe(
      (grant: { access_token: string }) => {
        this.setToken(grant.access_token);
        this.router.navigateByUrl('/');
      }
      ,
      error => {
        let message: string = null;
        switch (error.status) {
          case 401:
            message = 'Wrong credentials. Please try again.';
            break;
          default:
            message = 'Oops! Something went wrong on our end! Try again later.';
            break;
        }
        this.notify.error(message);
      }
    );
  }

  logout() {
    this.storage.del(ACCESS_TOKEN);
    this._connected.next(false);
    this.router.navigateByUrl('/login');
  }

  setToken(accessToken: string) {
    this.accessToken = accessToken;
    this.storage.set(ACCESS_TOKEN, this.accessToken);
    this._connected.next(true);
  }

  getToken() {
    return this.accessToken || null;
  }

  loadTokenFromUrl() {
    const params: { access_token?: string } = getUrlParams();
    return params.access_token;
  }

  reloadToken(): boolean {
    const accessToken = this.loadTokenFromUrl() || this.storage.get(ACCESS_TOKEN);
    if (accessToken) {
      this.setToken(accessToken);
    }
    return !!accessToken;
  }
}
