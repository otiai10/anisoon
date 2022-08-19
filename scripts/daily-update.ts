// @deno-type="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/google-apps-script/apis/youtube_v3.d.ts"

import { SearchItem, Track } from "../models/anisoon/index.ts";
import { SyobocalJSONDBEntry } from "../models/syobocal/syobocaldb.ts";
import * as path from "https://deno.land/std@0.152.0/path/mod.ts";

const YouTubeSearchAPI = "https://youtube.googleapis.com/youtube/v3/search";

const sleep = (msec: number): Promise<void> => {
  return (new Promise((resolve) => setTimeout(() => resolve(), msec)));
};

const __main__ = async () => {
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

  // Execute YouTube search for each
  const tracks = await Promise.all(items.map(async (item): Promise<Track> => {
    const keyword = `${item.song.title} ${item.anime.title} ${item.song.label}`;
    const query = new URLSearchParams({
      part: "snippet",
      maxResults: "5",
      q: `${item.song.title} ${item.anime.title} ${item.song.label}`,
      regionCode: "JP",
      type: "video",
      videoDuration: "short",
      key: Deno.env.get("YOUTUBE_API_KEY") as string,
    });
    await sleep(Math.random() * 10 * 1000);
    const ytres = await fetch(YouTubeSearchAPI + "?" + query.toString());
    const response: GoogleAppsScript.YouTube.Schema.SearchListResponse =
      await ytres.json();
    console.log("YouTube:", ytres.status, ytres.statusText);
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
  }));

  // Write to a file
  const dirpath = path.join(
    "db",
    "tracks",
    ...entry.context.output.split(path.posix.sep).slice(-3, -1),
  );
  const fname = entry.context.output.split(path.posix.sep).at(-1)!;
  await Deno.mkdir(dirpath, { recursive: true });
  await Deno.writeTextFile(path.join(dirpath, fname), JSON.stringify(tracks));
};

try {
  __main__();
} catch (err) {
  console.log(err);
  Deno.exit(1);
}
