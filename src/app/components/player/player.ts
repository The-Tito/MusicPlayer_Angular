import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { AudioService } from '../../services/audio-service';
import { MusicDataService } from '../../../data/data';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '../../../interface/interface_data';
import { SpotifyApiService } from '../../services/spotify/spotify-api.service';
import { SpotifyAuthService } from '../../services/spotify/spotify-auth.service';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit, OnDestroy {
  // Estado de vista
  showSearchResults: boolean = false;
  
  // Búsqueda
  searchTerm$ = new Subject<string>();
  searchQuery: string = '';
  tracks: SpotifyTrack[] = [];
  albums: SpotifyAlbum[] = [];
  artists: SpotifyArtist[] = [];
  isLoading: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private audioService: AudioService,
    private musicDataService: MusicDataService,
    private spotifyApiService: SpotifyApiService,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
    // Inicializar reproductor local
    const songs = this.musicDataService.getSongs();
    this.audioService.init(songs);
    this.audioService.loadSong();
    
    // Configurar autenticación de Spotify
    this.ensureAuthentication();
    
    // Configurar búsqueda
    this.setupSearch();
  }

  private ensureAuthentication(): void {
    if (!this.spotifyAuthService.hasValidToken()) {
      this.spotifyAuthService.getClientCredentialsToken()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => console.log('Token obtenido exitosamente'),
          error: (err) => console.error('Error obteniendo token:', err)
        });
    }
  }

  private setupSearch(): void {
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap(term => {
        if (term.trim() === '') {
          this.clearSearch();
          return [];
        }
        
        this.isLoading = true;
        return this.spotifyApiService.search(term, ['track', 'album', 'artist'], 10);
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

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchTerm$.next(input.value);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.showSearchResults = true;
      this.searchTerm$.next(this.searchQuery);
    }
  }

  clearSearch(): void {
    this.showSearchResults = false;
    this.tracks = [];
    this.albums = [];
    this.artists = [];
    this.searchQuery = '';
  }

  backToPlayer(): void {
    this.showSearchResults = false;
    this.clearSearch();
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