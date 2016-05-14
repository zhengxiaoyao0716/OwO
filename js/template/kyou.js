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

OwO.config.image = "./static/image/Kyou/10.png";
OwO.config.parent = document.getElementById("owoRoom");
OwO.config.draggableY = false;

OwO.chat.config.defaultWords = "《CLANNAD》是日本游戏品牌Key继《Kanon》、《AIR》后发行的第三款恋爱冒险游戏，游戏于2004年4月28日发行PC初回限定版，并依此为原作改编或扩充跨媒体制作的作品。";

OwO.chat.config.queue = [
    0, {"content": [
        "::./static/image/Kyou/33.png",
        "叫.::./static/image/Kyou/33.png",
        "叫.我.::./static/image/Kyou/33.png",
        "叫.我.冈.::./static/image/Kyou/33.png",
        "叫.我.冈.崎.::./static/image/Kyou/31.png",
        "叫.我.冈.崎.杏！::./static/image/Kyou/33b.png"
    ], "delay": 20, "wait": 3},
    1, {"content": ["汐是个很乖的孩子~::smile"], "delay": 0, "wait": 3},
    2, {"content": [
        "期待杏After吗？::shy",
        "期待杏After吗？::shy",
        "然而估计不会有了。。。::./static/image/Kyou/23.png",
    ], "delay": 60, "wait": 1.5},
    3, {"content": [
        "有人说我表情帝::./static/image/Kyou/30.png",
        "有人说我表情帝。::./static/image/Kyou/30.png",
        "有人说我表情帝。。::./static/image/Kyou/30a.png",
        "有人说我表情帝。。。::./static/image/Kyou/30a.png",
        "切，::./static/image/Kyou/31a.png",
        "切，::./static/image/Kyou/31a.png",
        "真没见识←_←::./static/image/Kyou/31.png",
    ], "delay": 30, "wait": 2},
    4, {"content": [
        "别打扰我，走开::./static/image/Kyou/18.png",
        "(明天怎么跟朋也。。。）::./static/image/Kyou/19a.png",
        "有办法了(☆_☆)/~~::./static/image/Kyou/24a.png",
        "骑电车撞他~~~::./static/image/Kyou/21b.png",
    ], "delay": 90, "wait": 1},
    5, {"content": [
        "近战打不过智代::./static/image/Kyou/10b.png",
        "群攻，有纪宁。。。::./static/image/Kyou/26a.png",
        "魔法的话，琴美音波。。。::./static/image/Kyou/13a.png",
        "风子的海星召唤、妹妹的占卜、::./static/image/Kyou/22.png",
        "还有剂师早苗阿姨特质毒面包::./static/image/Kyou/31a.png",
        "不过远程射击嘛::./static/image/Kyou/33b.png",
        "刚刚谁说要炖牡丹？::./static/image/Kyou/32.png"
    ], "delay": 90, "wait": 1},
    6//, {"wait": 6},
    //30
];
OwO.chat.config.face = {
    "smile": ["./static/image/Kyou/11.png", "./static/image/Kyou/11a.png", "./static/image/Kyou/11b.png"],
    "shy": ["./static/image/Kyou/21.png", "./static/image/Kyou/21a.png", "./static/image/Kyou/21b.png"],
}

OwO.menu.config.color = "#f0c";
OwO.menu.config.shadowColor = "#c0f";
OwO.menu.config.focusColor = "#c0f";
//OwO.menu.config.alwaysShow = false;
OwO.menu.config.defaultButtons.hideButton.bye = "再见咯~";
OwO.menu.config.defaultButtons.hideButton.showButton.text = "呼唤杏";
OwO.menu.config.defaultButtons.hideButton.showButton.hello = "是在叫我吗？";


}());