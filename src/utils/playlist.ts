import getRandom from "./utils";

export default function createPlaylist(songs: any, actual_playlist: any){
    let playlist = [];
    if (actual_playlist !== null){
        playlist = actual_playlist;
    }

    if (songs.legth !== 0){
        let index_song = getRandom(songs.legth);
        playlist.push(songs[index_song]);
        playlist.splice(index_song, 1);
        return createPlaylist(songs, playlist);
    }
    return playlist;
}