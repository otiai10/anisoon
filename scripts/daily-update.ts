import type {} from "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/google-apps-script/apis/youtube_v3.d.ts";

import { SearchItem, Track } from "../models/anisoon/index.ts";
import { SyobocalJSONDBEntry } from "../models/syobocal/syobocaldb.ts";
import * as path from "https://deno.land/std@0.152.0/path/mod.ts";

const YouTubeSearchAPI = "https://youtube.googleapis.com/youtube/v3/search";

const sleep = (msec: number): Promise<void> => {
  return (new Promise((resolve) => setTimeout(() => resolve(), msec)));
};

const __main__ = async (args: string[]) => {
  // Get latest JSON data from DB
  const db = {
    baseurl: "https://raw.githubusercontent.com/otiai10/syobocal/main/db/",
  };
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const year = yesterday.getFullYear(),
    month = ("0" + (yesterday.getMonth() + 1)).slice(-2),
    date = ("0" + yesterday.getDate()).slice(-2);
  const endpoint = db.baseurl + `${year}/${month}/${date}.json`;
  const dbres = await fetch(endpoint);
  console.log("DB:", dbres.status, dbres.statusText);
  const entry: SyobocalJSONDBEntry = await dbres.json();
  if (dbres.status != 200) {
    console.error(entry);
    throw new Error(
      `failed to fetch database: ${dbres.status} ${dbres.statusText}: ${endpoint}`,
    );
  }

  // Prepare queries
  const items: SearchItem[] = entry.animes.flatMap((anime): SearchItem[] => {
    return anime.songs?.map((song): SearchItem => ({ anime, song })) || [];
  });

  const dry = !!(args.length && (args[0] == "--dry"));

  // Execute YouTube search for each
  const tracks = await Promise.all(
    items.map(async (item): Promise<Track | undefined> => {
      const keyword =
        `${item.song.title} ${item.anime.title} ${item.song.label}`;
      const query = new URLSearchParams({
        part: "snippet",
        maxResults: "5",
        q: `${item.song.title} ${item.anime.title} ${item.song.label}`,
        regionCode: "JP",
        type: "video",
        videoDuration: "short",
        key: Deno.env.get("YOUTUBE_API_KEY") as string,
      });

      if (dry) {
        console.log("Query:", keyword);
        return;
      }
      await sleep(Math.random() * 10 * 1000);

      const ytres = await fetch(YouTubeSearchAPI + "?" + query.toString());
      const response: GoogleAppsScript.YouTube.Schema.SearchListResponse =
        await ytres.json();
      console.log("YouTube:", ytres.status, ytres.statusText, keyword);
      if (ytres.status != 200) {
        console.error(response);
        throw new Error(
          `failed to fetch YouTube: ${ytres.status} ${ytres.statusText}`,
        );
      }
      query.delete("key");
      return {
        ...item,
        youtube: {
          query: {
            keyword,
            params: query.toString(),
            found: response.items!.length,
          },
          videos: (response.items || []).map((item) => ({
            id: item.id!.videoId!,
            kind: item.id!.kind!,
            title: item.snippet!.title!,
            publishedAt: item.snippet!.publishedAt!,
            thumbnails: item.snippet!.thumbnails!,
            channel: {
              id: item.snippet!.channelId!,
              title: item.snippet!.channelTitle!,
            },
          })),
        },
      };
    }),
  );

  const fpath = path.join(
    ...entry.context.output.split(path.posix.sep).slice(-3, -1),
  );
  const dirpath = path.join("db", "tracks", fpath);
  const fname = entry.context.output.split(path.posix.sep).at(-1)!;
  console.log("Dir:", dirpath);
  console.log("Fpath:", fpath);
  console.log("File:", fname);

  // Write to a file
  await upsertTrackFile(dirpath, fname, tracks as Track[], dry);

  // Update index
  await updateIndexFile(fpath, fname, dry);
};

async function upsertTrackFile(
  dirpath: string,
  fname: string,
  tracks: Track[],
  dry = false,
) {
  console.log("Track file:", path.join(dirpath, fname));
  if (dry) {
    console.log(tracks);
  } else {
    await Deno.mkdir(dirpath, { recursive: true });
    await Deno.writeTextFile(path.join(dirpath, fname), JSON.stringify(tracks));
  }
}

async function updateIndexFile(fpath: string, fname: string, dry = false) {
  const entrypath = path.join("", fpath, fname);
  const indexpath = path.join("db", "tracks", "index.json");
  const entries = [
    { path: `/${entrypath}`, updated: (new Date()).toString() },
    ...(JSON.parse(await Deno.readTextFile(indexpath)) as {
      path: string;
      updated: string;
    }[])
      .filter((entry) => entry.path != `/${entrypath}`),
  ];
  console.log("Index file:", indexpath);
  if (dry) {
    console.log(entries);
  } else {
    await Deno.writeTextFile(indexpath, JSON.stringify(entries, null, 2));
  }
}

try {
  __main__(Deno.args);
} catch (err) {
  console.log(err);
  Deno.exit(1);
}
