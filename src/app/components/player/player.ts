import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AudioService } from '../../services/audio-service';
import { MusicDataService } from '../../../data/data';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private audioService: AudioService,
    private musicDataService: MusicDataService
  ) {}

  ngOnInit(): void {
    const songs = this.musicDataService.getSongs();
    this.audioService.init(songs);
    this.audioService.loadSong();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}