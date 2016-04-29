/**
 * ================================================================
 * Template of OwO. - zhengxiaoyao0716
 * http://owo.zheng0716.com
 * ----------------------------------------------------------------
 * !Must be loaded after owo.js.
 * ----------------------------------------------------------------
 * Javascript released under the Apache2.0 license
 * https://github.com/zhengxiaoyao0716/OwO/raw/gh-pages/LICENSE
 * ================================================================
 */
(function () {


OwO.template = "https://zhengxiaoyao0716.github.io/OwO/js/template/feihe.js";

OwO.locale.chinese();

OwO.info = {
    "name": "飞鹤",
    "gender": "Boy",
    "birth": "2016/3/6",
    "master": "正逍遥0716",
    "home": {"name": "逍遥居", "link": "http://xiaoyao.zheng0716.com"}
};

OwO.config.image = "./image/feihe.png";
OwO.config.cursor = "simple";
OwO.config.parent = document.getElementById("owoRoom");
OwO.config.coord = [1, 1, 1];
OwO.config.axis = [1, 1];

OwO.anim.config.type = 1;
var frameArray = [];
var imgNum;
for (imgNum = 1; imgNum < 30; imgNum++) {
    frameArray.push("./image/feihe/" + imgNum + ".png");
}
OwO.anim.config.queue = [
    {"frames": frameArray, "delay": 1, "repeat": 8, "offset": [-8, -1.5, -0.3]}
];
OwO.anim.config.move1Focus = false;

OwO.menu.config.coord = [0.5, 1];
OwO.menu.config.axis = [0.5, 0];
OwO.menu.config.strictFollow = false;
OwO.menu.config.alwaysShow = false;

OwO.chat.config.defaultWords = ["爱冷剑，怜悲箫，月下狼孤啸；<br />轻点画，慢勾描，云中人逍遥。"];


}());