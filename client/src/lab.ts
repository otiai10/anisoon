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
    this.player = document.getElementById("player");
    this.player.playVideo();
    this.isPlayerReady = true;
}

module Anisoon {
    export class Lab {

        public isPlayerReady: boolean = false;
        public player: any;

        constructor(){
            var anisons = new Anisoon.Anisons(anisonList);
            var anisonsView = new Anisoon.AnisonsView({
                collection : anisons,
                tagName: 'table',
                className: 'table'
            });
            $("#anison-container").html(anisonsView.render().el);

            // ためしに
            //setTimeout(() => {
            //    this.play("rvhbnKaX3p8");
            //},3000);
        }

        play(vhash: string) {
            if (this.isPlayerReady) {
                this.player.loadVideoById(vhash);//ByUrlの方がいいかな？
                return;
            }
            swfobject.embedSWF(
                "http://www.youtube.com/v/"+ vhash +"?enablejsapi=1&playerapiid=player",//Initial URL
                "player",// DOM id
                "400",// width
                "300",// height
                "8",// SWF Version
                null,null,
                {allowScriptAccess: "always"},
                {id:"player"}
            );

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
                    lr : "ja",
                    vq : query,
                    alt: "json"
                },
                (data, statusText, xhr) => {
                    // FIXME : とりあえず
                    var hash = data.feed.entry[0].id.$t.match(/^.+\/([a-zA-Z0-9_]+)$/)[1];
                    done(hash);
                }
            );
        }
    }
    export class Anisons extends Backbone.Collection {
        constructor(arr){
            var list = [];
            _.each(arr, anison => {
                list.push(new Anisoon.Anison(anison));
            });
            super(list);
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
            var done = hash => {
                lab.play(hash);
            };
            this.model.getYoutubeHash(done);
        }
    }
}

$(function(){
    lab = new Anisoon.Lab();
});
