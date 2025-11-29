import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, switchMap, catchError, of } from 'rxjs';
import { AudioService } from '../../services/audio-service';
import { MusicDataService } from '../../../data/data';
import { SpotifyApiService } from '../../services/spotify/spotify-api.service';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoadingAlbum = false;
  albumError = false;

  constructor(
    private audioService: AudioService,
    private musicDataService: MusicDataService,
    private spotifyApiService: SpotifyApiService,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
    this.loadMiloJAlbum();
  }

  private loadMiloJAlbum(): void {
    this.isLoadingAlbum = true;
    this.albumError = false;

    // Asegurar autenticación primero
    this.ensureAuthentication()
      .pipe(
        switchMap(() => this.spotifyApiService.searchMiloJAlbum()),
        switchMap(album => {
          if (!album) {
            console.warn('No se encontró el álbum de Milo J');
            this.isLoadingAlbum = false;
            this.loadLocalPlaylist();
            return of(null);
          }

          console.log('Álbum encontrado:', album.name, 'ID:', album.id);
          return this.spotifyApiService.getAlbumWithTracks(album.id);
        }),
        catchError(error => {
          console.error('Error en el proceso de carga:', error);
          this.isLoadingAlbum = false;
          this.albumError = true;
          this.loadLocalPlaylist();
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (album) => {
          this.isLoadingAlbum = false;

          if (album && album.tracks?.items) {
            const albumImage = album.images?.[0]?.url || '';
            const songs = this.audioService.convertSpotifyTracksToSongs(
              album.tracks.items,
              albumImage
            );

            if (songs.length > 0) {
              console.log(`Cargadas ${songs.length} canciones del álbum "${album.name}"`);
              this.audioService.init(songs);
              this.audioService.loadSong();
            } else {
              console.warn('No se encontraron canciones en el álbum');
              this.loadLocalPlaylist();
            }
          } else if (album === null) {
            // Ya se manejó el fallback arriba
            console.log('Usando playlist local');
          }
        },
        error: (error) => {
          console.error('Error cargando álbum de Milo J:', error);
          this.isLoadingAlbum = false;
          this.albumError = true;
          this.loadLocalPlaylist();
        }
      });
  }

  private ensureAuthentication(): Observable<any> {
    if (!this.spotifyAuthService.hasValidToken()) {
      return this.spotifyAuthService.getClientCredentialsToken();
    }
    return of(true);
  }

  private loadLocalPlaylist(): void {
    console.log('Cargando playlist local como fallback');
    const songs = this.musicDataService.getSongs();
    this.audioService.init(songs);
    this.audioService.loadSong();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}