import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookiesStorageService } from '../cookies-storage.service';
import { SpotifyTokenResponse } from '../../../interface/interface_data';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookiesService: CookiesStorageService
  ) {
    this.initializeToken();
  }

  private initializeToken(): void {
    const token = this.cookiesService.getKeyValue('access_token');
    if (token && this.cookiesService.isCookieValid('access_token')) {
      this.tokenSubject.next(token);
    } else {
      this.getClientCredentialsToken().subscribe();
    }
  }

  getClientCredentialsToken(): Observable<SpotifyTokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: environment.CLIENT_ID,
      client_secret: environment.CLIENT_SECRET
    }).toString();

    return this.http.post<SpotifyTokenResponse>(
      environment.AUTH_API_URL,
      body,
      { headers }
    ).pipe(
      tap(response => {
        this.tokenSubject.next(response.access_token);
      })
    );
  }

  hasValidToken(): boolean {
    return this.cookiesService.exists('access_token') && 
           this.cookiesService.isCookieValid('access_token');
  }

  getToken(): string | null {
    return this.cookiesService.getKeyValue('access_token');
  }
}