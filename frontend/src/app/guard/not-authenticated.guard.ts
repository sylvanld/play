import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotAuthenticatedGuard implements CanActivate {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth._connected.getValue()) { // user authenticated
      this.router.navigateByUrl('/');
      return false;
    } else { // user not authenticated
      // try to refresh accessToken using stored refreshToken
      return this.auth.loadToken().pipe(map(tokenValid => {
        if (tokenValid) {
          // user shouldn't be connected on this page, get out!
          this.router.navigateByUrl('/');
        }
        // success when user is not authenticated
        return !tokenValid;
      }));
    }
  }
}
