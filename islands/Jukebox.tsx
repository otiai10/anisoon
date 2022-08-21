/** @jsx h */
import { h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import {
  PlayerState,
  YouTubePlayerDelegate,
  YouTubePlayerView,
} from "https://deno.land/x/fresh_youtube@0.2.0/mod.ts";
// } from "../../fresh-youtube/mod.ts";

import { Track } from "../models/anisoon/index.ts";

export default function MyIsland() {
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.UNSTARTED,
  );

  const [playlist, setPlaylist] = useState<Track[]>([]);
  useEffect(() => {
    fetch("/api/tracks").then((res) => res.json()).then(setPlaylist);
  }, []);

  const delegate = useMemo(
    () => new YouTubePlayerDelegate({ stateUpdater: setPlayerState }),
    [],
  );

  return (
    <div>
      <YouTubePlayerView
        style={{ width: "100%", height: "60vh" }}
        delegate={delegate}
      />

      <div>{playerState}</div>

      <div>
        <button
          onClick={() => delegate.play()}
          disabled={playerState == PlayerState.PLAYING}
          style={{
            borderColor: playerState == PlayerState.PLAYING
              ? "transparent"
              : "blue",
            borderWidth: "2px",
          }}
        >
          PLAY
        </button>
        <button
          onClick={() => delegate.pause()}
          disabled={playerState == PlayerState.PAUSED}
          style={{
            borderColor: playerState == PlayerState.PAUSED
              ? "transparent"
              : "green",
            borderWidth: "2px",
          }}
        >
          PAUSE
        </button>
      </div>
    </div>
  );
}
