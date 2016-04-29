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


OwO.template = "https://zhengxiaoyao0716.github.io/OwO/js/template/kyou.js";

OwO.locale.chinese();

OwO.info = {
    "name": "杏",
    "gender": "Girl",
    "birth": "2016/4/29",
    "master": "她自己",
    "home": {"name": "OwO乐园", "link": "http://owo.zheng0716.com"}
};

OwO.config.image = "./image/Kyou/10.png";
OwO.config.parent = document.getElementById("owoRoom");
OwO.config.draggableY = false;

OwO.menu.config.color = "#f0c";
OwO.menu.config.shadowColor = "#c0f";
OwO.menu.config.focusColor = "#c0f";
OwO.menu.config.defaultButtons.hideButton.bye = "再见咯~";
OwO.menu.config.defaultButtons.hideButton.showButton.text = "呼唤杏";
OwO.menu.config.defaultButtons.hideButton.showButton.hello = "是在叫我吗？";

OwO.chat.config.maxWidth = "220px";

OwO.chat.config.defaultWords = ["《CLANNAD》是日本游戏品牌Key继《Kanon》、《AIR》后发行的第三款恋爱冒险游戏，游戏于2004年4月28日发行PC初回限定版，并依此为原作改编或扩充跨媒体制作的作品。"];


}());