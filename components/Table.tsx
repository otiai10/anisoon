/** @jsx h */
import { h } from "preact";
import { Track } from "../models/anisoon/index.ts";
import { tw } from "../utils/twind.ts";

export function TrackTable(props: { children: h.JSX.Element[] }) {
  return (
    <div
      class={tw`h-full lg:px-24 md:px-8 lg:pt-4`}
    >
      <TrackHeader />
      {props.children}
    </div>
  );
}

export function TrackHeader() {
  return (
    <div
      class={tw`h-12 flex items-center`}
      style={{ borderBottom: "1px solid lightgray" }}
    >
      <div class={tw`flex-none w-12`}>#</div>
      <div class={tw`flex-none w-24`}></div>
      <div class={tw`flex-auto`}>Title / Anime</div>
    </div>
  );
}

export function TrackItem(
  props: { track: Track; index: number; onClick: () => void },
) {
  const { track, index } = props;
  return (
    <div class={tw`h-12 flex cursor-pointer`} onClick={props.onClick}>
      <div class={tw`flex-none w-12 grid content-center`}>{props.index}</div>
      <div class={tw`flex-none w-24 grid-content-center`}>
        <img
          src={`${track.youtube.videos[0].thumbnails["high"].url}`}
          style={{ height: "96%" }}
        />
      </div>
      <div class={tw`flex-auto`}>
        <div>{track.youtube.videos[0].title}</div>
        <div>{track.anime.title} {track.song.label}</div>
      </div>
    </div>
  );
}
