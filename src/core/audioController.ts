import { data } from "../interface/interface_data";


export class audioController{
    private _lastSong: data[] = [];
    private _nextSong: data[] = [];
    private _actualSong: data | null = null;
    private _controller: HTMLAudioElement | null = null;
    private _currentIndex: number = 0;
    private _allSongs: data[] = [];

    public init(songs: data[], audioElement: HTMLAudioElement):void{
        this._allSongs = songs;
        this._controller = audioElement;
        this._currentIndex = 0;
        this._actualSong = songs[0];
        this._nextSong = songs.slice(1);
        this._lastSong = [];
    }

    public nextSong(){
         if (this._currentIndex < this._allSongs.length - 1) {
            this._currentIndex++;
            this._actualSong = this._allSongs[this._currentIndex];
            this.loadSong();
            return true;
        }
        return false;
    }

    public prevSong() {
        if (this._currentIndex > 0) {
            this._currentIndex--;
            this._actualSong = this._allSongs[this._currentIndex];
            this.loadSong();
            return true;
        }
        return false;
    }

    public loadSong() {
        if (this._actualSong && this._controller) {
            this._controller.src = this._actualSong.song_url;
            this._controller.load();
        }
    }

    public playSong(index: number): data | null {
        if (index >= 0 && index < this._allSongs.length) {
            this._currentIndex = index;
            this._actualSong = this._allSongs[index];
            this.loadSong();
            this._controller!.play();
            return this._actualSong;
        }
        return null;
    }

    public play() {
        if (this._controller) {
            this._controller.play();
        }
    }

    public pause() {
        if (this._controller) {
            this._controller.pause();
        }
    }

    public togglePlayPause(): 'playing' | 'paused' {
        if (this._controller) {
        if (this._controller.paused) {
            this._controller.play();
            return 'playing';
        } else {
            this._controller.pause();
            return 'paused';
        }   
    }
            return 'paused';

    }

    public getCurrentSong(): data | null {
        return this._actualSong;
    }
}