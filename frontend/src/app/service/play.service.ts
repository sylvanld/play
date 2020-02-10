import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PlayService extends ProviderService {

  constructor(
    protected http: HttpClient,
    private auth: AuthenticationService
  ) {
    super(http, environment.play_api_url, { type: 'bearer' });
  }

  getToken(): Observable<string> {
    return
  }
}
