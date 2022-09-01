/** @jsx h */
import { h } from "preact";
import { StateUpdater, useEffect, useMemo, useState } from "preact/hooks";

import {
  PlayerState,
  YouTubePlayerDelegate,
  YouTubePlayerDelegateOptions,
  YouTubePlayerView,
} from "https://deno.land/x/fresh_youtube@0.2.4/mod.ts";
// } from "../../fresh-youtube/mod.ts";
import { TrackHeader, TrackItem, TrackTable } from "../components/Table.tsx";

import { Track } from "../models/anisoon/index.ts";
import { tw } from "../utils/twind.ts";

const __init__ = (
  initialIndex: number,
  delegate: AnisoonDelegate,
) => {
  fetch("/api/tracks/latest").then((res) => res.json()).then(
    (tracks: Track[]) => {
      tracks = tracks.filter((track) => track.youtube.videos.length);
      delegate.setTracks(tracks);
      const id = tracks[initialIndex].youtube.videos[0].id;
      // delegate.addPlayerOnReadyListener(() => delegate.cue(id));
      delegate.ready.then(() => delegate.cue(id));
    },
  );
};

enum PlaybackMode {
  UNSET = 0,
  CONTINUE = 1,
}

class AnisoonDelegate extends YouTubePlayerDelegate {
  private tracks: Track[] = [];
  private index = 0;
  private preference = 0;
  private playback = PlaybackMode.CONTINUE;

  private delegated: {
    setTracks: StateUpdater<Track[]>;
    setPlayerState: StateUpdater<number>;
    setIndex: StateUpdater<number>;
    setPreference: StateUpdater<number>;
  };

  constructor(
    opts: YouTubePlayerDelegateOptions & {
      setTracks: StateUpdater<Track[]>;
      setPlayerState: StateUpdater<number>;
      setIndex: StateUpdater<number>;
      setPreference: StateUpdater<number>;
    },
  ) {
    super(opts);
    this.delegated = { ...opts };
  }

  setTracks(tracks: Track[], index = 0, pref = 0) {
    this.delegated.setTracks(tracks);
    this.tracks = tracks;
    this.index = index;
    this.preference = pref;
    const id = tracks[index].youtube.videos[pref].id;
    this.ready.then(() => this.cue(id));
  }
  onStateChange(ev: YT.OnStateChangeEvent): void {
    switch (this.state) {
      case PlayerState.CUED:
        if (this.index != 0 && this.playback == PlaybackMode.CONTINUE) {
          this.play();
        }
        break;
      case PlayerState.UNSTARTED:
        if (this.index != 0 && this.playback == PlaybackMode.CONTINUE) {
          this.play();
        }
        break;
      case PlayerState.ENDED:
        this.cueNext();
        break;
      default:
        console.log("[DEBUG]", this.state, PlayerState[this.state]);
    }
  }
  cueNext() {
    this.index += 1;
    if (!this.tracks[this.index]) {
      return console.log("End of registered tracks.");
    }
    this.delegated.setIndex(this.index);
    const id = this.tracks![this.index].youtube.videos[this.preference].id;
    this.cue(id);
  }
  cueByIndex(index: number, pref = 0) {
    this.index = index;
    this.delegated.setIndex(this.index);
    this.preference = pref;
    const id = this.tracks![this.index].youtube.videos[this.preference].id;
    this.cue(id);
  }
}

export default function Jukebox() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [preference, setPreference] = useState<number>(0);
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.UNSTARTED,
  );

  const delegate = useMemo(() =>
    new AnisoonDelegate({
      setTracks,
      setPlayerState,
      setIndex,
      setPreference,
    }), []);

  useEffect(() => __init__(index, delegate), []);

  const track = tracks[index];
  console.log(track);
  const video = track?.youtube.videos[preference];

  return (
    <div class={tw`flex flex-col h-full`}>
      <div
        class={tw`flex-none h-96`}
        style={{
          background:
            `linear-gradient(0deg, rgba(20 20 40 / 90%), rgba(20 20 40 / 40%)), ` +
            (video
              ? `center / cover no-repeat url(${video.thumbnails["high"].url})`
              : ""),
        }}
        id="main-stage"
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
            {track
              ? (
                <h2 class={tw`text-2xl text-gray-200`}>
                  {track.anime.title} {track.song.label}
                  <a
                    href={`http://animetick.net/anime/${track.anime.tid}`}
                    target="_blank"
                  >
                    <img style={{ display: "inline" }} src="/checkbox.svg" />
                  </a>
                </h2>
              )
              : null}
            {video
              ? (
                <h1 class={tw`font-bold text-4xl text-gray-200`}>
                  {video.title}
                </h1>
              )
              : null}
            <div>
              {video
                ? (
                  <p class={tw`text-gray-400 text-xl`}>
                    {video.channel.title}
                  </p>
                )
                : null}
            </div>
          </div>
        </div>
      </div>

      <div class={tw`flex-auto overflow-y-scroll`}>
        <TrackTable>
          {tracks.map((track, index) => (
            <TrackItem
              track={track}
              index={index}
              onClick={() => {
                delegate.cueByIndex(index);
              }}
            />
          ))}
        </TrackTable>
      </div>
    </div>
  );
}
