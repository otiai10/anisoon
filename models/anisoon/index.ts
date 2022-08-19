// @deno-type="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/google-apps-script/apis/youtube_v3.d.ts"

import { Cast, Staff, Song as SyobocalSong } from "../syobocal/syobocaldb.ts";

export interface Anime {
    tid: number;
    title: string;
    last_update: string;
    episodes?: string[]; // FIXME: 自信無い
    staff: Staff;
    cast: Cast;
}

export interface Song extends SyobocalSong {}

export interface SearchItem {
    anime: Anime;
    song: Song;
}

export interface Track {
    anime: Anime;
    song:  Song;
    youtube: {
        query: {
            keyword: string;
            params: string;
            found: number;
        };
        videos: {
            id: string;
            kind: string;
            title: string;
            publishedAt: string;
            channel: {
                id: string;
                title: string;
            };
            thumbnails: GoogleAppsScript.YouTube.Schema.ThumbnailDetails,
        }[];
    };
}