/// <reference path="../../../external/jquery.d.ts" />
/// <reference path="../../../external/underscore.d.ts" />
/// <reference path="../../../external/backbone.d.ts" />

/// <reference path="../lab.ts" />

module Lab {
    export class AnisonView extends Backbone.View {
        model: Anison;
        constructor(options?){
            super(options);
        }
        public template = _.template($("#lab-anison-tpl").html());
        render(): AnisonView {
            console.log(this.model.toJSON());
            var params = {
                anime  : this.model.get("Anime").toJSON(),
                anison : this.model.get("Anison").toJSON()
            };
            var tpl = this.template(params);
            this.$el.html(tpl);
            return this;
        }
        test() {
            alert("this is test!!");
        }
    }
}
module Lab {
    export class StreamView extends Backbone.View {
        constructor(options?){
            super(options);
        }
        render(): StreamView {
            this.collection.each(anison => {
                var anisonView = new AnisonView({
                    model: anison,
                    tagName: 'tr',
                    events : {
                        //'click .anison-title' : "playByAnisonClick"
                        'click .anison-title' : "test"
                    }
                });
                this.$el.append(anisonView.render().$el);
            });
            return this;
        }
    }
}
