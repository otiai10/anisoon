/**
 * labスクリプトのエントリポイント
 * build:
 */
//`tsc client/src/lab/**/*.ts --out public/js/src/lab.js`

/// <reference path="../../external/jquery.d.ts" />
/// <reference path="../../external/underscore.d.ts" />
/// <reference path="../../external/backbone.d.ts" />

var swfobject = swfobject || {};
var anisonList = anisonList || [];
var labController: Lab.Controller;

module Lab {
    /**
     * コントローラクラスだと思ってください
     * constructorしか定義しない
     */
    export class Controller {
        constructor(){
            console.log("This is LabController, DO SOMETHING HERE");
        }
    }
}
$(function(){
    labController = new Lab.Controller();
});

module Lab {
    // アニメを表現するモデル
    export class Anime extends Backbone.Model {
        constructor(tid: number, title: string){
            super({
                TID   : tid,
                Title : title
            });
        }
        getId(): number {
            return this.get("TID");
        }
        getTitle(): string {
            return this.get("Title");
        }
    }
}
module Lab {
    // アニソンを表現するモデル
    export class Anison extends Backbone.Model {
        constructor(title: string, type: number){
            super({
                Title    : title,
                Type     : type,
                TypeText : Anison.mapTypeText(type)
            });
        }
        static mapTypeText(type: number): string {
            if (type == 0) return "OP";
            //if (type == 1) return "ED";
            return "ED";
        }
    }
}
module Lab {
    export class Entry extends Backbone.Model {
        constructor(anime: Anime, anison: Anison, index: number = 0){
            super({
                Anime  : anime,
                Anison : Anison,
                Index  : index
            });
        }
        setIndex(index: number){
            this.set("Index", index);
        }
        getIndex(): number {
            return this.get("Index");
        }
    }
}
module Lab {
    export class Video extends Backbone.Model {
        constructor(title: string, hash: string){
            super({
                Title : title,
                Hash  : hash
            });
        }
        getHash(): string {
            return this.get("Hash");
        }
    }
}
module Lab {
    export class NowPlaying extends Entry {
        public Video: Video;
        constructor(anime: Anime, anison: Anison, video: Video){
            super(anime, anison);
            this.Video = video;
        }
    }
}
module Lab {
    export class Streaming extends Backbone.Collection {
        public nowPlaying: NowPlaying;
        //public streamView: StreamView;
        constructor(entries: Entry[]){
            super({
                collection : entries
            });
        }

        playNext() {
            var nextIndex = this.nowPlaying.getIndex() + 1;
            var nextEntry = this.at(nextIndex);
            if (! nextEntry) nextEntry = this.first();
            this.updateNowPlaying(nextEntry);
        }
        playPrev() {
            var prevIndex = this.nowPlaying.getIndex() - 1;
            var prevEntry = this.at(prevIndex);
            if (! prevEntry) prevEntry = this.last();
            this.updateNowPlaying(prevEntry);
        }

        private updateNowPlaying(entry: any/* いや、Entryだろここは */){
            var video = VideoRepository.createVideo(entry);
            this.nowPlaying = new Lab.NowPlaying(
                entry.get("Anime"),
                entry.get("Anison"),
                video
            );
            Player.singleton().play(this.nowPlaying);
            //this.streamView.update(this.nowPlaying);
        }
    }
}
module Lab {
    export class VideoRepository {
        static createVideo(entry: Entry){
            // とりあえずここは固定値
            return new Video(
                "Fallin' Fallin' Fallin'",
                "UwrKHOHIzoU"
            )
        }
    }
}

module Lab {
    export class Player {
        // public static nowPlayingView: NowPlayingView;
        private static instance: any = null;//swfObject?
        private static errorHandler: () => any;
        private static endedHandler: () => any;
        public static eventListener: (state: number) => any;
        constructor(){
            Player.instance = Player.getSwfObject();
        }
        public static singleton(): any {
            if (Player.instance == null) Player.instance = Player.getSwfObject();
            return Player.instance;
        }
        private static getSwfObject(): any {
            return document.getElementById("player");
        }
        play(nowPlaying: NowPlaying){
            Player.instance.loadVideoById(nowPlaying.Video.getHash())
            //this.nowPlayingView.update(nowPlaying);
        }
        private static listen() {
            Player.eventListener = state => {
                switch(state){
                    case 0:
                        Player.errorHandler();
                        break;
                }
            }
            Player.instance.addEventListener("onStateChange","Player.eventListener");
        }
        public static onError(func: (any?) => any){
            Player.errorHandler = func;
            Player.listen();
        }
        public static onEnded(func: (any?) => any){
            Player.endedHandler = func;
            Player.listen();
        }
    }
}
