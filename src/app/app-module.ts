import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Player } from './components/player/player';
import { PlayerBar } from './components/player-bar/player-bar';
import { Disc } from './components/disc/disc';
import { Playlist } from './components/playlist/playlist';
import { Search } from './components/search/search';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor-interceptor';
import { addAuthHeaderInterceptor } from './interceptors/add-auth-header.interceptor-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AudioService } from './services/audio-service';
import { MusicDataService } from '../data/data';
import { SpotifyApiService } from './services/spotify/spotify-api.service';
import { SpotifyAuthService } from './services/spotify/spotify-auth.service';
import { CookiesStorageService } from './services/cookies-storage.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    App,
    Player,
    PlayerBar,
    Search,
    Disc,
    Playlist
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        addAuthHeaderInterceptor
      ])
    ),
    CookieService,
    AudioService,
    MusicDataService,
    SpotifyApiService,
    SpotifyAuthService,
    CookiesStorageService
  ],
  bootstrap: [App]
})
export class AppModule { }
