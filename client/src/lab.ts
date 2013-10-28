/**
 * labスクリプトのエントリポイント
 * build:
 *      `tsc client/src/lab.ts --out public/js/lab.js`
 */

/// <reference path="../external/jquery.d.ts" />
/// <reference path="../external/underscore.d.ts" />
/// <reference path="../external/backbone.d.ts" />

var anisonList = anisonList || [];

module Anison {
    export class Lab {
        constructor(){
            var Anison = Backbone.Model.extend({});
            var Anisons = Backbone.Collection.extend({model: Anison});
            var AnisonView = Backbone.View.extend({
                tagName: 'li',
                template: _.template($("#anison-tpl").html()),
                render: function(): Backbone.View {
                    var tpl = this.template(this.model.toJSON());
                    this.$el.html(tpl);
                    return this;
                }
            })
            var AnisonsView = Backbone.View.extend({
                tagName: 'ul',
                render : function(): Backbone.View {
                    this.collection.each(anison => {
                        var anisonView = new AnisonView({model:anison});
                        this.$el.append(anisonView.render().$el);
                    });
                    return this;
                }
            });
            var anisons = new Anisons(anisonList);
            var anisonsView = new AnisonsView({
                collection : anisons
            });
            $("#anison-container").html(anisonsView.render().el);
        }
    }
}

$(function(){
    var anisonLab = new Anison.Lab();
});
