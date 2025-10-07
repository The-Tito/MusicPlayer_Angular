import { Song } from "./interface_song";

export class interfaceData{
    private _discImg: HTMLImageElement | null = null;
    private _infoTitle: HTMLElement | null = null;
    private _infoArtist: HTMLElement | null = null;
    private _infoPhoto: HTMLElement | null = null;
    private _infoTime: HTMLElement | null = null;

    public init(): void{
        this._discImg = document.querySelector('.disc img') as HTMLImageElement;
        this._infoTitle = document.querySelector('.info-music.playlist-element__title');
        this._infoArtist = document.querySelector('.info-music.playlist-element__autor');
        this._infoPhoto = document.querySelector('.info-music.playlist-element__photo');
        this._infoTime = document.querySelector('.info-music.playlist-element__time');
    }

    public updateInterface(song: Song): void{
        if (this._discImg) {
            this._discImg.src = song.caratula;
        }

        if (this._infoArtist) {
            this._infoArtist.textContent = song.infoArtist;
        }

        if (this._infoTitle) {
            this._infoTitle.textContent = song.infoTitle
        }

        if (this._infoPhoto) {
            this._infoPhoto.style.backgroundImage = `url(${song.caratula})`
        }

        if (this._infoTime){
            this._infoTime.textContent = song.infoTime;
        }
    }

    public updateActivePlaylistItem(index: number): void{
        const allIntems = document.querySelectorAll('.playlist-element');
        allIntems.forEach(item => item.classList.remove('active'));

        const activeItem = document.querySelector(`.playlist-element[data-index="${index}"]`);
        if (activeItem){
            activeItem.classList.add('active');
        }
    }

}

export interface data{
    song_name: string,
    artist_name: string,
    song_url: string,
    caratula: string,
    duration: string,
}

