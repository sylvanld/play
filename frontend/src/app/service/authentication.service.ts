import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { map, catchError } from 'rxjs/operators';

/**
 * load query params as an object
 */
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

interface Token {
  access_token?: string;
  refresh_token: string;
  expires?: number;
}

// key use to set/get item in store
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

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
    private notify: NotificationService
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
    this.http.post(environment.play_api_url + '/play/token', {
      email, password
    }).subscribe(
      (token: Token) => {
        this.setToken(token);
        this.router.navigateByUrl('/');
      },
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

  /**
   * Remove refresh token from cookies and change connected state to false.
   */
  logout() {
    this.accessToken = null;
    this.storage.del(REFRESH_TOKEN);
    this._connected.next(false);
    this.router.navigateByUrl('/login');
  }

  getToken() {
    return this.accessToken;
  }

  setToken(token: Token) {
    // set access token for use in application
    this.accessToken = token.access_token;
    // set refresh token to keep user authenticated
    this.storage.set(REFRESH_TOKEN, token.refresh_token);

    // change application state to display features that require auth
    this._connected.next(true);
  }

  /**
   * Set token from response and verify its validity
   */
  setAndVerifyToken(partialToken: Token): Observable<boolean> {
    if (!partialToken || !partialToken.refresh_token) {
      return of(false);
    }

    // access a protected resource to ensure token is valid
    return this.http.post(
      environment.play_api_url + '/play/token', {},
      { headers: { Authorization: 'Bearer ' + partialToken.refresh_token } }
    )
      .pipe(
        map((token: Token) => {
          // after tocken has been verified, set fresh token
          this.setToken(token);

          // remove potential token in query params
          // Remove query params
          this.router.navigate([], {
            queryParams: {
              yourParamName: null,
              youCanRemoveMultiple: null,
            },
            queryParamsHandling: 'merge'
          })
          return true;
        }), catchError(error => {
          // if an error occured, this token is not valid, user is logged out
          this.logout();
          return of(false)
        }));
  }

  loadTokenFromUrl(): Observable<boolean> {
    console.log('call load token from url')
    const token = <Token>getUrlParams();
    return this.setAndVerifyToken(token);
  }

  refreshToken(): Observable<boolean> {
    /* utilise le refresh token pour obtenir un nouvel accessToken */
    console.log('call refresh token')
    const refresh = this.storage.get(REFRESH_TOKEN);
    return this.setAndVerifyToken({ refresh_token: refresh });
  }

  loadToken() {
    console.log('call load token');
    return Observable.create((observer: Observer<boolean>) => {
      this.loadTokenFromUrl().subscribe(tokenLoaded => {
        if (tokenLoaded) {
          console.log('token loaded from url')
          // token loaded (from url)
          observer.next(true);
          observer.complete();
        } else {
          // no token in url, try to reload token from refresh token
          console.log('try to use refresh token')
          this.refreshToken().subscribe(tokenRefreshed => {
            console.log('refresh result ' + tokenRefreshed);
            observer.next(tokenRefreshed);
            observer.complete();
          })
        }
      })
    })
  }

}
