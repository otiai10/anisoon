/**
 * labスクリプトのエントリポイント
 * build:
 *      `tsc client/src/lab.ts --out public/js/lab.js`
 */

/// <reference path="../external/jquery.d.ts" />
/// <reference path="../external/underscore.d.ts" />
/// <reference path="../external/backbone.d.ts" />

var swfobject = swfobject || {};
var anisonList = anisonList || [];
var lab: Anisoon.Lab;

var onYouTubePlayerReady = (playerId) => {
    lab.player = document.getElementById("player");
    lab.player.playVideo();
    lab.isPlayerReady = true;
    lab.player.addEventListener("onStateChange", "listenStateChange");
};
// onYouTubePlayerReadyはモジュール化できないけど、これとかはいける気がする.
// 気がするだけ
var listenStateChange = function(state){
    switch(state){
        case Anisoon.PlayerState.Ended:
            lab.anisons.playNext();
    }
};

module Anisoon {

    export enum PlayerState {
        Loading   = -1,
        Ended     = 0,
        Playing   = 1,
        Stopped   = 2,
        Buffering = 3,
        Headed    = 5
    }

    export class Lab {

        public isPlayerReady: boolean = false;
        public player: any;

        public nowPlaying: Anisoon.NowPlaying;
        public anisons: Anisoon.Anisons;

        constructor(){
            anisonList = anisonList.reverse();
            var list = [];
            _.each(anisonList, (anison,index) => {
                anison.sequence = index;//playNextのために連番が必要
                list.push(new Anisoon.Anison(anison));
            });
            this.anisons = new Anisoon.Anisons(list);
            var anisonsView = new Anisoon.AnisonsView({
                model: Anisoon.Anison,
                collection : this.anisons,
                tagName: 'table',
                className: 'table'
            });
            $("#anison-container").html(anisonsView.render().el);

            // ためしに
            //setTimeout(() => {
            //    this.play("rvhbnKaX3p8");
            //},3000);
        }

        play(nowPlaying: Anisoon.NowPlaying) {
            this.nowPlaying = nowPlaying;
            this.renderNowPlaying();
            var vhash = nowPlaying.getHash();
            if (this.isPlayerReady) {
                this.player.loadVideoById(vhash);//ByUrlの方がいいかな？
                return;
            }
            $("header").animate({height:"310px"},500);
            swfobject.embedSWF(
                "http://www.youtube.com/v/"+ vhash +"?enablejsapi=1&playerapiid=player",//Initial URL
                "player",// DOM id
                "430",// width
                "300",// height
                "8",// SWF Version
                null,null,
                {allowScriptAccess: "always"},
                {id:"player"}
            );

        }

        private renderNowPlaying() {
            var nowPlayingView = new Anisoon.NowPlayingView({model:this.nowPlaying});
            $("#nowplaying-info").html(nowPlayingView.render().$el.html());
        }
    }

    export class Anison extends Backbone.Model {
        constructor(anison: any){
            super(anison);
            switch(this.get("AnisonType")){
                case 0:
                    this.set("AnisonTypeText", "OP");
                    break;
                case 1:
                    this.set("AnisonTypeText", "ED");
                    // break;
            }
        }
        getYoutubeHash(done) {
            var query = this.get("AnisonTitle");// + "+" + this.get("AnimeTitle");
            console.log(query);
            $.get(
                "http://gdata.youtube.com/feeds/api/videos",
                {
                    vq : query,
                    alt: "json"
                },
                (data, statusText, xhr) => {
                    console.log(data);
                    // FIXME : とりあえず
                    var video = data.feed.entry[0];
                    done(video);
                }
            );
        }
    }
    export class Anisons extends Backbone.Collection {

        private nowPlayingAnison: Anisoon.Anison;

        constructor(list){
            super(list);
            this.collection = list;
        }

        playNext() {
            var done = video => {
                var nowPlaying = new NowPlaying(this.nowPlayingAnison, video);
                lab.play(nowPlaying);
            };
            // TODO: もうこのへんカオス過ぎる
            var nextAnison: Anisoon.Anison = new Anisoon.Anison(this.at(lab.nowPlaying.get("anison").sequence + 1).toJSON());
            this.nowPlayingAnison = nextAnison;
            nextAnison.getYoutubeHash(done);
        }
    }
    export class AnisonsView extends Backbone.View {
        constructor(options?){
            super(options);
        }
        render(): AnisonsView {
            this.collection.each(anison => {
                var anisonView = new AnisonView({
                    model: anison,
                    tagName: 'tr',
                    events : {
                        'click .anison-title' : "playByAnisonClick"
                    }
                });
                this.$el.append(anisonView.render().$el);
            });
            return this;
        }
    }

    export class AnisonView extends Backbone.View {
        public model: Anisoon.Anison;
        constructor(options?){
            super(options);
        }
        public template = _.template($("#anison-tpl").html());
        render(): AnisonView {
            var tpl = this.template(this.model.toJSON());
            this.$el.html(tpl);
            return this;
        }
        private playByAnisonClick() {
            var done = video => {
                var nowPlaying = new NowPlaying(this.model, video);
                lab.play(nowPlaying);
            };
            this.model.getYoutubeHash(done);
        }
    }

    export class NowPlaying extends Backbone.Model {
        constructor(anison: Anisoon.Anison, video: any){
            var nowPlayingObject = {
                anison : anison.toJSON(),
                video  : {
                    title : video.title.$t,
                    hash  : video.id.$t.match(/^.*\/([0-9a-zA-Z_\-]+)$/)[1]
                }
            }
            super(nowPlayingObject);
        }
        getHash(): string {
            return this.get("video").hash;
        }
    }

    export class NowPlayingView extends Backbone.View {
        constructor(options?){
            super(options);
        }
        public template = _.template($("#nowplaying-tpl").html());
        render(): NowPlayingView {
            var tpl = this.template(this.model.toJSON());
            this.$el.html(tpl);
            return this;
        }
    }
}

$(function(){
    lab = new Anisoon.Lab();
});
