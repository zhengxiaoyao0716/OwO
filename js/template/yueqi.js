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


OwO.template = "https://zhengxiaoyao0716.github.io/OwO/js/template/yueqi.js";

OwO.locale.chinese();

OwO.info = {
    "name": "越祈",
    "gender": "Girl",
    "birth": "2016/5/15",
    "master": "她自己",
    "home": {"name": "OwO乐园", "link": "http://owo.zheng0716.com"}
};

OwO.config.image = "./static/image/yueqi/15.png";
OwO.config.parent = document.getElementById("owoRoom");

OwO.chat.config.defaultWords = "《仙剑奇侠传六》是《仙剑奇侠传》系列游戏的第八部单机作品，同时也是仙剑二十周年之作。";

OwO.chat.config.queue = [
    0, {"content": [
        "今朝，我饿了::./static/image/yueqi/7.png",
    ], "delay": 20, "wait": 3},
    1, {"content": [
        "今朝对我最好了::./static/image/yueqi/11.png",
    ], "delay": 20, "wait": 3},
    3, {"content": [
        "没有正常人可以一直不长大的。::./static/image/yueqi/9.png",
        "如果有人能一直像个小孩，::./static/image/yueqi/5.png",
        "那是因为::./static/image/yueqi/6.png",
        "有人帮她承担了她应该承担的东西。::./static/image/yueqi/5.png"
    ], "delay": 90, "wait": 1.5},
    5, {"wait": 6},
    30
];

OwO.menu.config.color = "#033";
OwO.menu.config.shadowColor = "#088";
OwO.menu.config.focusColor = "#088";
OwO.menu.config.alwaysShow = false;
OwO.menu.config.defaultButtons.hideButton.bye = "下次见~";
OwO.menu.config.defaultButtons.hideButton.showButton.text = "呼唤祈";
OwO.menu.config.defaultButtons.hideButton.showButton.hello = "又见面了";


}());