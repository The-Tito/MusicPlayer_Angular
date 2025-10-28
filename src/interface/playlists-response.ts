export interface PlaylistResponse {
    collaborative: boolean;
    description:   string;
    external_urls: ExternalUrls;
    followers:     Followers;
    href:          string;
    id:            string;
    images:        Image[];
    name:          string;
    owner:         Owner;
    primary_color: null;
    public:        boolean;
    snapshot_id:   string;
    tracks:        Tracks;
    type:          string;
    uri:           string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href:  null;
    total: number;
}

export interface Image {
    height: number | null;
    url:    string;
    width:  number | null;
}

export interface Owner {
    display_name?: string;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    type:          Type;
    uri:           string;
    name?:         string;
}

export enum Type {
    Artist = "artist",
    User = "user",
}

export interface Tracks {
    href:     string;
    items:    Item[];
    limit:    number;
    next:     null;
    offset:   number;
    previous: null;
    total:    number;
}

export interface Item {
    added_at:        Date;
    added_by:        Owner;
    is_local:        boolean;
    primary_color:   null;
    track:           Track;
    video_thumbnail: VideoThumbnail;
}

export interface Track {
    preview_url:       null;
    available_markets: string[];
    explicit:          boolean;
    type:              string;
    episode:           boolean;
    track:             boolean;
    album:             Album;
    artists:           Owner[];
    disc_number:       number;
    track_number:      number;
    duration_ms:       number;
    external_ids:      ExternalIDS;
    external_urls:     ExternalUrls;
    href:              string;
    id:                string;
    name:              string;
    popularity:        number;
    uri:               string;
    is_local:          boolean;
}

export interface Album {
    available_markets:      string[];
    type:                   string;
    album_type:             string;
    href:                   string;
    id:                     string;
    images:                 Image[];
    name:                   string;
    release_date:           Date;
    release_date_precision: string;
    uri:                    string;
    artists:                Owner[];
    external_urls:          ExternalUrls;
    total_tracks:           number;
}

export interface ExternalIDS {
    isrc: string;
}

export interface VideoThumbnail {
    url: null;
}
