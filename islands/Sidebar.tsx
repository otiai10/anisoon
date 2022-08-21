/** @jsx h */
import { h } from "preact";
import { tw } from "../utils/twind.ts";

export default function Sidebar() {
  return (
    <div class={tw`flex flex-col h-full`}>
      <div class={tw`flex-auto grow`}>
        <h1
          class={tw`text-white -rotate-90 top-24 -left-2 relative text-xl font-extrabold`}
        >
          anisoon.fm
        </h1>
      </div>
      <div>
        <div class={tw`h-16 flex justify-center content-center`}>
          <a
            href="https://github.com/otiai10/anisoon"
            target="_blank"
            class={tw`block`}
          >
            <img src="/github-64px.png" width={32} height={32} />
          </a>
        </div>
      </div>
    </div>
  );
}
