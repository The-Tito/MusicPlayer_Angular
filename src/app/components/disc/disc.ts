import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AudioService, Song } from '../../services/audio-service';

@Component({
  selector: 'app-disc',
  standalone: false,
  templateUrl: './disc.html',
  styleUrl: './disc.css'
})
export class Disc implements OnInit, OnDestroy {
  currentSong: Song | null = null;
  private destroy$ = new Subject<void>();

  constructor(private audioService: AudioService) {
    console.log('DiscComponent constructor');
  }

  ngOnInit(): void {
    console.log('DiscComponent ngOnInit');
    
    this.audioService.currentSong$
      .pipe(takeUntil(this.destroy$))
      .subscribe(song => {
        console.log('Canción recibida en Disc:', song);
        this.currentSong = song;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}