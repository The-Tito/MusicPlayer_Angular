import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AudioService, Song } from '../../services/audio-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-player-bar',
  standalone: false,
  templateUrl: './player-bar.html',
  styleUrl: './player-bar.css'
})
export class PlayerBar implements OnInit, OnDestroy {
  @ViewChild('progressBar', { static: true }) progressBar!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider', { static: true }) volumeSlider!: ElementRef<HTMLInputElement>;

  currentSong: Song | null = null;
  isPaused: boolean = true;
  progressValue: number = 0;
  volumePercentage: number = 100;
  private audioElement!: HTMLAudioElement;
  private destroy$ = new Subject<void>();

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.audioElement = this.audioService.getAudioElement();
    
    this.audioService.currentSong$
      .pipe(takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song;
      });

    this.audioService.playState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isPaused = state === 'paused';
      });

    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    // Progress bar actualización automática
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement.duration) {
        this.progressValue = (this.audioElement.currentTime / this.audioElement.duration) * 100;
      }
    });

    // Reset progress bar cuando carga nueva canción
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.progressValue = 0;
    });

    // Auto-play siguiente canción
    this.audioElement.addEventListener('ended', () => {
      if (this.audioService.nextSong()) {
        this.audioService.play();
      }
    });
  }

  onProgressChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (this.audioElement.duration) {
      this.audioElement.currentTime = (parseFloat(target.value) / 100) * this.audioElement.duration;
    }
  }

  togglePlayPause(): void {
    this.audioService.togglePlayPause();
  }

  nextSong(): void {
    if (this.audioService.nextSong()) {
      this.audioService.play();
    }
  }

  prevSong(): void {
    if (this.audioService.prevSong()) {
      this.audioService.play();
    }
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value) / 100;
    this.audioElement.volume = volume;
    this.volumePercentage = parseFloat(target.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}