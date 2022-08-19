export interface SyobocalJSONDBEntry {
  context: {
    time: string;
    query: string;
    output: string;
  };
  animes: Anime[];
}

export interface Anime {
  tid: number;
  title: string;
  last_update: string;
  episodes?: string[]; // FIXME: 自信無い
  songs?: Song[];
  staff: Staff;
  cast: Cast;
}

export interface Song {
  title: string;
  label: string;
  words?: string[];
  music?: string[];
  composer?: string[];
  singer?: string[];
}

export type Staff = { [role: string]: string[] };
export type Cast = { [character: string]: string[] };
