import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '../../../interface/interface_data';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { SpotifyApiService } from '../../services/spotify/spotify-api.service';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit, OnDestroy {
  tracks: SpotifyTrack[] = [];
  albums: SpotifyAlbum[] = [];
  artists: SpotifyArtist[] = [];
  isLoading: boolean = false;
  searchQuery: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private spotifyApiService: SpotifyApiService,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
    this.ensureAuthentication();
    
    // Escuchar cambios en los query params (q=término)
    this.route.queryParams.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        this.searchQuery = params['q'] || '';
        
        if (!this.searchQuery.trim()) {
          this.clearResults();
          return [];
        }
        
        this.isLoading = true;
        return this.spotifyApiService.search(this.searchQuery, ['track', 'album', 'artist'], 10);
      })
    ).subscribe({
      next: (results) => {
        this.tracks = results.tracks?.items || [];
        this.albums = results.albums?.items || [];
        this.artists = results.artists?.items || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.isLoading = false;
      }
    });
  }

  private ensureAuthentication(): void {
    if (!this.spotifyAuthService.hasValidToken()) {
      this.spotifyAuthService.getClientCredentialsToken()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  private clearResults(): void {
    this.tracks = [];
    this.albums = [];
    this.artists = [];
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getArtistNames(artists: SpotifyArtist[]): string {
    return artists.map(artist => artist.name).join(', ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}