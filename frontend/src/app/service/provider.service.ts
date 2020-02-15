import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';


/* define token types */
interface TokenType {
  type: 'bearer' | 'queryparam';
  key?: string; // required only for queryparam
}

/*  */
interface RequestParameters {
  relativeUrl: string;
  body?: any;
  headers?: HttpHeaders;
}


interface Request {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: RequestParameters;
}


export abstract class ProviderService {
  protected lastRequest: Request = null;
  protected baseUrl: string;
  protected accessToken: string;
  protected tokenType: TokenType;

  constructor(protected http: HttpClient, baseUrl: string, tokenType: TokenType) {
    this.baseUrl = baseUrl;
    this.tokenType = tokenType;
  }

  /**
   * Generic method to perform XMLHttpRequest using angular HttpClient.
   * It handle authorization using bearer or access token.
   */
  request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', params: RequestParameters, original = true) {
    let url = this.baseUrl + params.relativeUrl;
    let headers: { Authorization?: string } = {};

    // cache last request to replay it in case of token expiration
    this.lastRequest = { method: method, params };

    console.log(this.accessToken);
    if (this.accessToken) {
      if (this.tokenType.type === 'queryparam') {
        // append token to url in case it should be provided as a query param
        url += (url.indexOf('?') === -1 ? '?' : '&') + this.tokenType.key + '=' + this.accessToken;
      } else if (this.tokenType.type === 'bearer' && !!this.accessToken) {
        // add authorization headers if token has bearer type
        console.log('add bearer token to request headers');
        headers.Authorization = 'Bearer ' + this.accessToken;
      }
    }

    // perform authenticated request and send back result
    return this.http.request<T>(
      method, url,
      {
        body: params.body,
        headers
      }
    ).pipe(catchError(
      // handle 401 errors codes
      error => {
        // if this requested is already replayed, don't loop infintely
        if (original) {
          return this.handleTokenExpiration(error);
        } else {
          console.log('already done');
          throw error;
        }
      }
    ));
  }

  get<T>(relativeUrl: string, headers?) {
    return this.request<T>('GET', { relativeUrl, headers });
  }

  post<T>(relativeUrl: string, body, headers?) {
    return this.request<T>('POST', { relativeUrl, body, headers });
  }

  put<T>(relativeUrl: string, body: any, headers?) {
    return this.request<T>('PUT', { relativeUrl, body, headers });
  }

  delete<T>(relativeUrl: string, headers?) {
    return this.request<T>('DELETE', { relativeUrl, headers });
  }

  abstract renewToken(): Observable<string>;

  setToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  replayLastRequest(observer: Observer<any>) {
    const { method, params } = this.lastRequest;
    this.request(method, params, false).pipe(
      finalize(() => { observer.complete(); })
    ).subscribe(
      (data) => { observer.next(data); },
      (error) => { observer.error(error); }
    );
  }


  handleTokenExpiration(error: HttpErrorResponse) {
    console.log('error during request to third party');
    if (error.status === 401) {
      // return an observable that will resolve the value of the previous
      // request after having update this provider's accessToken
      return Observable.create(
        (observer: Observer<any>) => {
          // ask for a new access token using provider specific method
          this.renewToken().subscribe(
            accessToken => {
              // set the new access token in the provider store
              this.setToken(accessToken);
              // replace last request
              this.replayLastRequest(observer);
            }
          );
        }
      );
    } else {
      throw error;
    }
  }

}
