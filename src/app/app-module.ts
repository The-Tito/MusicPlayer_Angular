import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Player } from './components/player/player';
import { PlayerBar } from './components/player-bar/player-bar';
import { Disc } from './components/disc/disc';
import { Playlist } from './components/playlist/playlist';
import { Search } from './components/search/search';


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
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
