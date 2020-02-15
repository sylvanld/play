import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth._connected.getValue()) {
      return true;
    } else {
      // demande un nouveau token a partir du refresh token existant
      // retourne true si l'OP est un success / false sinon
      return this.auth.loadToken().pipe(map(tokenValid => {
        if (!tokenValid) {
          this.router.navigateByUrl('/login');
        }
        return tokenValid;
      }));
    }
  }
}
