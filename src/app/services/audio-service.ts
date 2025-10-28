import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Song {
  song_name: string;
  artist_name: string;
  song_url: string;
  caratula: string;
  duration: string;
}


@Injectable({
  providedIn: 'root'
})

export class AudioService {
  private _lastSong: Song[] = [];
  private _nextSong: Song[] = [];
  private _actualSong: Song | null = null;
  private _controller: HTMLAudioElement;
  private _currentIndex: number = 0;
  private _allSongs: Song[] = [];

  // Observables para comunicación entre componentes
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  private currentIndexSubject = new BehaviorSubject<number>(0);
  private playStateSubject = new BehaviorSubject<'playing' | 'paused'>('paused');

  public currentSong$: Observable<Song | null> = this.currentSongSubject.asObservable();
  public currentIndex$: Observable<number> = this.currentIndexSubject.asObservable();
  public playState$: Observable<'playing' | 'paused'> = this.playStateSubject.asObservable();

  constructor() {
    this._controller = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this._controller.addEventListener('play', () => {
      this.playStateSubject.next('playing');
    });

    this._controller.addEventListener('pause', () => {
      this.playStateSubject.next('paused');
    });
  }

  init(songs: Song[]): void {
    this._allSongs = songs;
    this._currentIndex = 0;
    this._actualSong = songs[0];
    this._nextSong = songs.slice(1);
    this._lastSong = [];
    this.currentSongSubject.next(this._actualSong);
    this.currentIndexSubject.next(this._currentIndex);
  }

  nextSong(): boolean {
    if (this._currentIndex < this._allSongs.length - 1) {
      this._currentIndex++;
      this._actualSong = this._allSongs[this._currentIndex];
      this.loadSong();
      this.currentSongSubject.next(this._actualSong);
      this.currentIndexSubject.next(this._currentIndex);
      return true;
    }
    return false;
  }

  prevSong(): boolean {
    if (this._currentIndex > 0) {
      this._currentIndex--;
      this._actualSong = this._allSongs[this._currentIndex];
      this.loadSong();
      this.currentSongSubject.next(this._actualSong);
      this.currentIndexSubject.next(this._currentIndex);
      return true;
    }
    return false;
  }

  loadSong(): void {
    if (this._actualSong) {
      this._controller.src = this._actualSong.song_url;
      this._controller.load();
    }
  }

  playSong(index: number): Song | null {
    if (index >= 0 && index < this._allSongs.length) {
      this._currentIndex = index;
      this._actualSong = this._allSongs[index];
      this.loadSong();
      this._controller.play();
      this.currentSongSubject.next(this._actualSong);
      this.currentIndexSubject.next(this._currentIndex);
      return this._actualSong;
    }
    return null;
  }

  play(): void {
    this._controller.play();
  }

  pause(): void {
    this._controller.pause();
  }

  togglePlayPause(): 'playing' | 'paused' {
    if (this._controller.paused) {
      this._controller.play();
      return 'playing';
    } else {
      this._controller.pause();
      return 'paused';
    }
  }

  getCurrentSong(): Song | null {
    return this._actualSong;
  }

  getCurrentIndex(): number {
    return this._currentIndex;
  }

  getAudioElement(): HTMLAudioElement {
    return this._controller;
  }

  getAllSongs(): Song[] {
    return this._allSongs;
  }
}