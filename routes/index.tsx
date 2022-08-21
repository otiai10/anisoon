/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Jukebox from "../islands/Jukebox.tsx";
import Sidebar from "../islands/Sidebar.tsx";

export default function Home() {
  return (
    <div id="container" class={tw`w-screen h-screen flex bg-orange-200`}>
      <div class={tw`flex-none w-20 bg-gray-900`}>
        {/* w-48 */}
        <Sidebar />
      </div>
      <div class={tw`flex-auto bg-gray-200`}>
        <Jukebox />
      </div>
    </div>
  );
}
