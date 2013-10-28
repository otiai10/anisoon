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
            setTimeout(() => {
                this.play("rvhbnKaX3p8");
            },3000);
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
    }
    export class Anisons extends Backbone.Collection {
        public model: Anison;
    }
    export class AnisonsView extends Backbone.View {
        constructor(options?){
            super(options);
        }
        render(): AnisonsView {
            this.collection.each(anison => {
                var anisonView = new AnisonView({
                    model:anison,
                    tagName: 'tr'
                });
                this.$el.append(anisonView.render().$el);
            });
            return this;
        }
    }

    export class AnisonView extends Backbone.View {
        constructor(options?){
            super(options);
        }
        public template = _.template($("#anison-tpl").html());
        render(): AnisonView {
            var tpl = this.template(this.model.toJSON());
            this.$el.html(tpl);
            return this;
        }
    }
}

$(function(){
    var anisonLab = new Anisoon.Lab();
});
