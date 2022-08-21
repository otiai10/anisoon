/** @jsx h */
import { h } from "preact";
import { StateUpdater, useEffect, useMemo, useState } from "preact/hooks";

import {
  PlayerState,
  YouTubePlayerDelegate,
  YouTubePlayerView,
} from "https://deno.land/x/fresh_youtube@0.2.2/mod.ts";
// } from "../../fresh-youtube/mod.ts";

import { Track } from "../models/anisoon/index.ts";
import { tw } from "../utils/twind.ts";

const __init__ = (
  setTracks: StateUpdater<Track[]>,
  initialIndex: number,
  delegate: YouTubePlayerDelegate,
) => {
  fetch("/api/tracks").then((res) => res.json()).then((tracks: Track[]) => {
    tracks = tracks.filter((track) => track.youtube.videos.length);
    setTracks(tracks);
    const id = tracks[initialIndex].youtube.videos[0].id;
    delegate.addPlayerOnReadyListener(() => delegate.cue(id));
  });
};

export default function Jukebox() {
  const [index, setIndex] = useState<number>(9);
  const [preference, setPreference] = useState<number>(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.UNSTARTED,
  );

  const delegate = useMemo(
    () => new YouTubePlayerDelegate({ stateUpdater: setPlayerState }),
    [],
  );

  useEffect(() => __init__(setTracks, index, delegate), []);

  console.log("[[[DEBUG]]]");
  console.log(tracks.length ? tracks[index] : 0);

  const track = tracks[index];
  const video = track?.youtube.videos[preference];

  return (
    <div class={tw`flex flex-col`}>
      <div
        id="main-stage"
        class={tw`h-96`}
        style={{
          background:
            `linear-gradient(0deg, rgba(20 20 40 / 90%), rgba(20 20 40 / 40%)), ` +
            (video
              ? `center / cover no-repeat url(${video.thumbnails["high"].url})`
              : ""),
        }}
      >
        <div class={tw`h-full flex lg:px-24 md:px-8 lg:py-20 md:py-12`}>
          <div class={tw`flex flex-col`}>
            <YouTubePlayerView
              class={tw`w-80 h-60`}
              style={{ boxShadow: `0 0 12px -4px #101020` }}
              delegate={delegate}
            />
          </div>
          <div class={tw`flex-auto pl-8`}>
            <div>
              {video
                ? (
                  <h1 class={tw`font-bold text-4xl text-gray-200`}>
                    {video.title}
                  </h1>
                )
                : null}
            </div>
            <div>
              {video
                ? (
                  <blockquote class={tw`text-gray-400`}>
                    {video.channel.title}
                  </blockquote>
                )
                : null}
            </div>
          </div>
        </div>
      </div>

      <div>{playerState}</div>

      <div>
        <ul>
          {tracks.map((track) => {
            return (
              <li>
                <div>
                  <h2>
                    {track.anime.tid} {track.anime.title} {track.song.label}
                  </h2>
                  <div>
                    <img
                      src={track.youtube.videos[preference].thumbnails["high"]
                        .url}
                      style={{ height: "24px" }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
