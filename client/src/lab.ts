/**
 * labスクリプトのエントリポイント
 * build:
 *      `tsc client/src/lab.ts --out public/js/lab.js`
 */

/// <reference path="../external/jquery.d.ts" />

var anisonList = anisonList || [];

module Anison {
    export class Lab {
        constructor(){
            console.log(anisonList);
            alert('This is constructor');
        }
    }
}

$(function(){
    var anisonLab = new Anison.Lab();
});
