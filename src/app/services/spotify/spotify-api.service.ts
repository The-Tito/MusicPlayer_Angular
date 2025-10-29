import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { SpotifySearchResponse, SpotifyTrack } from '../../../interface/interface_data';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  constructor(private http: HttpClient) {}

  search(
    query: string, 
    types: string[] = ['track', 'album', 'artist'],
    limit: number = 10
  ): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', types.join(','))
      .set('limit', limit.toString());

    return this.http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search`,
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error en búsqueda de Spotify:', error);
        return of({
          tracks: { items: [], total: 0 },
          albums: { items: [], total: 0 },
          artists: { items: [], total: 0 }
        });
      })
    );
  }

  getTrack(trackId: string): Observable<SpotifyTrack> {
    return this.http.get<SpotifyTrack>(
      `${environment.API_URL}/tracks/${trackId}`
    );
  }

  getRecommendations(limit: number = 20): Observable<{ tracks: SpotifyTrack[] }> {
    const params = new HttpParams()
      .set('seed_genres', 'pop,rock,hip-hop')
      .set('limit', limit.toString());

    return this.http.get<{ tracks: SpotifyTrack[] }>(
      `${environment.API_URL}/recommendations`,
      { params }
    );
  }
}