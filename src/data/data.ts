// src/app/services/music-data.service.ts
import { Injectable } from '@angular/core';
import { Song } from '../app/services/audio-service';


@Injectable({
  providedIn: 'root'
})
export class MusicDataService {
  private songs: Song[] = [
    {
      song_name: "IMH",
      artist_name: "V.I.N",
      song_url: "/media/songs/IMH.mp3",
      caratula: "/media/photos/guy.jpg",
      duration: "3:45"
    },
    {
      song_name: "TU VAS SIN(fav)",
      artist_name: "Rels B",
      song_url: "/media/songs/TU VAS SIN (fav) - Rels B (Letra).mp3",
      caratula: "/media/photos/Reels-b.jfif",
      duration: "4:12"
    },
    {
      song_name: "cancion CHIDA 3",
      artist_name: "artista 3",
      song_url: "/media/song_3.mp3",
      caratula: "https://picsum.photos/200",
      duration: "3:30"
    }
  ];

  getSongs(): Song[] {
    return this.songs;
  }
}
