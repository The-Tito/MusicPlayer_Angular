// src/app/core/models/spotify.models.ts
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  type: 'artist';
  uri: string;
  images?: SpotifyImage[];
  genres?: string[];
  followers?: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  type: 'album';
  uri: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  release_date: string;
  total_tracks: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  type: 'track';
  uri: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
  };
}

// src/app/models/song.interface.ts
export interface Song {
  song_name: string;
  artist_name: string;
  song_url: string;
  caratula: string;
  duration: string;
}
