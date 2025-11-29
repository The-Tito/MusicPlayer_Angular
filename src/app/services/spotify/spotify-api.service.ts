import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SpotifySearchResponse, SpotifyTrack, SpotifyAlbum } from '../../../interface/interface_data';
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

  /**
   * Busca el álbum "La vida era más corta" de Milo J
   */
  searchMiloJAlbum(): Observable<SpotifyAlbum | null> {
    const params = new HttpParams()
      .set('q', 'la vida era mas corta milo j')
      .set('type', 'album')
      .set('limit', '1');

    return this.http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search`,
      { params }
    ).pipe(
      map(response => {
        if (response.albums && response.albums.items.length > 0) {
          return response.albums.items[0];
        }
        return null;
      }),
      catchError(error => {
        console.error('Error buscando álbum de Milo J:', error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene los tracks de un álbum específico
   */
  getAlbumTracks(albumId: string): Observable<SpotifyTrack[]> {
    return this.http.get<{ items: SpotifyTrack[] }>(
      `${environment.API_URL}/albums/${albumId}/tracks`
    ).pipe(
      map(response => response.items || []),
      catchError(error => {
        console.error('Error obteniendo tracks del álbum:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la información completa de un álbum incluyendo sus tracks
   */
  getAlbumWithTracks(albumId: string): Observable<SpotifyAlbum> {
    return this.http.get<SpotifyAlbum>(
      `${environment.API_URL}/albums/${albumId}`
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo álbum completo:', error);
        throw error;
      })
    );
  }
}