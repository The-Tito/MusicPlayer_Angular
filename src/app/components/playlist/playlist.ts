import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService, Song } from '../../services/audio-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist implements OnInit, OnDestroy {
  songs: Song[] = [];
  currentIndex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.songs = this.audioService.getAllSongs();

    this.audioService.currentIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe(index => {
        this.currentIndex = index;
      });
  }

  onSongClick(index: number): void {
    this.audioService.playSong(index);
  }

  isActive(index: number): boolean {
    return this.currentIndex === index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
