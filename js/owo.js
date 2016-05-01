/*
 * ================================================================
 * OwO: moe web plugin - zhengxiaoyao0716
 * http://owo.zheng0716.com
 * ----------------------------------------------------------------
 * Javascript released under the Apache2.0 license
 * https://github.com/zhengxiaoyao0716/OwO/raw/gh-pages/LICENSE
 * ================================================================
 */

/** 默认配置，请酌情修改 */
var OwO = {
    "template": "",     //模板js文件的url路径，只做标识用，表明继承关系。模板是指配置OwO的js文件，请在模板内先配置好这个参数
    "locale": {},       //本地化，将默认项翻译成本地语言。这个项可供各模板自行扩展，目前内置了OwO.locale.chinese();方法
    "info": {
        "name": "OwO",
        "gender": "--",
        "birth": "--",
        "master": "--",
        "home": {"name": "OwO乐园", "link": "http://owo.zheng0716.com"}
    },
    "config": {
        "image": "",            //无动作时显示的图片
        "parent": undefined,    //指定父视图，undefined表示相对整个窗口，而不是页面，所以不随页面滚动（fixed）
        "zIndex": 99,
        "coord": [1, 1, 1],     //[(0, 1), (0, 1), (0, +oo)]  coord[2]是z轴上的坐标，实际上相当于缩放，而不是图层。0为最小不可见，1为原大小
        "axis": [1, 1],         //[(0, 1), (0, 1)] 轴心位置。通过坐标coord、轴心axis两个参数就能很精确的定位了
        "cursor": "moe",        //"moe", "simple" or url
        "title": "OwO",
        "draggableX": true,     //是否允许横向拖动
        "draggableY": true,     //是否允许纵向拖动
        "onTouch": undefined,   //鼠标按下，function (perX, perY) { ... }, 参数是鼠标按下位置占比，返回true则不会再传递到onClick事件
        "onClick": undefined    //鼠标按下后无移动原地抬起，function (perX, perY) { ... } 参数同上，注意这不是浏览器默认的onclick
    },
    "anim": {
        "config": {
            /**
             * 动画列，有random、sequence两种模式，写法不同.
             * 区分random与sequence的唯一判别条件: queue[0] === 0
             * ------------------------------------------------------------
             * random: 随机动画，从散列抽取执行.
             * e.g: [0, {actionA}, 1, {actionB}, 4, {actionC}, 9, {"wait": 0.5}, 30]
             * 解析：actionA播放的概率为1/30，actionB为1/10，actionC为1/6。为了提高效率，你应该尽量把概率小的写在前面
             * !由于去重复，概率会有一定偏差，尤其在基数较小时
             * ------------------------------------------------------------
             * sequence: 顺序动画，沿队列依次执行.
             * e.g: [{actionA}, {"wait": 0.5}, {actionB}, {"wait": 1}, {actionC}]
             * 解析：播放actionA -> 停顿0.5s -> 播放actionB -> 停顿1s -> 播放actionC -> 播放actionA -> 循环...
             * ------------------------------------------------------------
             * {action}是指描述动作集行为的JsonObject.
             * e.g: {"frames": ["imageUrl", , , ...], "delay": 0, "wait": 0, "repeat": 0, "offset": [moveX, moveY, moveZ], "onFinish": function () {}}
             * @param frames 动画帧图的资源路径的数组，数组长度决定帧数，undefined表示不变，""表示清除（不显示任何图片）
             * @param delay 动画帧切换的延时，单位为浏览器帧时，近似 1s = 60帧
             * @param wait 动画播放结束后等待时间，单位为秒，只会影响到动画列内的动作集
             * @param repeat 重复次数，无限循环不需要靠这个参数解决，anim只放一个动作集就好了
             * @param offset OwO每帧在x、y、z三个方向上的位移，其中z位移相当于缩放(scale += offset[2] / 100)，而不是改变图层(zIndex)
             * @param onFinish 动画播放结束时回调
             * @return time 一个动作集完整播放结束所用的时间 time ~= frames.length * (1 + delay) / 60 * repeat + wait (s)
             * ------------------------------------------------------------
             * 我说的应该还算详细吧，看大伙的领悟能力咯。。。
             */
            "queue": [],
            "play1Focus": true,     //当OwO获得光标焦点时，是否继续播放动画（不包括移动）
            "move1Focus": true,     //当OwO获得光标焦点时，是否允许OwO移动的动画效果
            "resize1Finish": true   //播放结束时是否回到初始状态
        }
    },
    "menu": {
        "config": {
            "class": "",
            "fontSize": "medium",
            "fontFamily": "inherit",
            "color": "black",
            "bgColor": "white",
            "shadowColor": "#888",
            "focusColor": "#aaa",
            "coord": [0, 0.5],      //相对OwO主体0代表OwO的最左(上)坐标处，1代表最右（下）坐标处
            "axis": [1, 0.5],       //轴心位置，相对菜单主体，[0.5, 0.5]为中心
            "strictFollow": true,   //是否严格跟随，即与OwO一起移动
            "alwaysShow": true,     //是否一直显示
            "infoPanel": {
                "title": "OwO Information",
                "keyMap": { "name": "Name", "gender": "Gender", "birth": "Birth", "master": "Master", "home": "Home", "github": "GitHub", "adopt": "Adopt", "back": "Back" },   //信息面板上的键名
            },
            "defaultButtons": {
                "hideButton": {
                    "showed": true, "text": "hide", "bye": "I'll miss you, goodbye~",
                    "showButton": { "showed": true, "text": "call OwO", "hello": "WoW, OwO comed back!!!" }
                },
                "topButton": { "showed": true, "text": "top" },
                "homeButton": { "showed": true, "text": "home"}
            },
            "onclick": undefined    //会传给浏览器默认的onclick事件，鼠标点击菜单区域内（包括按钮、聊天面板等等）触发
        }
    },
    "chat": {
        "config": {
            "minHeight": "60px",   //默认布局是横向约束纵向扩展的，你可以通过css来深度自定义
            "defaultWords": "Best wish to you from the two dimensional world.", //一个有效的html文本或字符串, 作为消息面板默认的innerHtml
            /**
             * 消息列，有random、sequence两种模式，写法不同.
             * 区分random与sequence的唯一判别条件: queue[0] === 0
             * ------------------------------------------------------------
             * random: 随机动画，从散列抽取执行.
             * e.g: [0, {messageA}, 1, {messageB}, 4, {messageC}, 9, {"wait": 3}, 30]
             * 解析：messageA发布的概率为1/30，messageB为1/10，messageC为1/6。为了提高效率，你应该尽量把概率小的写在前面
             * !由于去重复，概率会有一定偏差，尤其在基数较小时
             * ------------------------------------------------------------
             * sequence: 顺序动画，沿队列依次执行.
             * e.g: [{messageA}, {"wait": 3}, {messageB}, {"wait": 5}, {messageC}]
             * 解析：发布messageA -> 隐藏3s -> 发布messageB -> 隐藏5s -> 发布messageC -> 发布messageA -> 循环...
             * ------------------------------------------------------------
             * {message}是指描述消息集的JsonObject.
             * e.g: {"content": ["messageBody", , , ...], "delay": 30, "wait": 0.5, "onFinish": function () {}}
             * @param content 消息内容的数组，里面是一些列消息体。content为[]、undefined时不弹出消息
             * @param delay 消息内容切换的延时，单位为浏览器帧时，近似 1s = 60帧
             * @param wait 消息滚动完成后等待时间，单位为秒，只会影响到消息列中的消息集
             * @param onFinish 消息结束时回调
             * @return time 一个消息集完整播放结束所用的时间 time ~= content.length * (1 + delay) / 60 + wait (s)
             * ------------------------------------------------------------
             * "messageBody"是指描述消息体的字符串, undefined表示不变，""表示清空（不显示任何消息）.
             * e.g: "textContent<p>htmlContent</p>::faceResource::soundResource::..."
             * 解析：messageBody会"::"划分开，成为这样["textContent<p>htmlContent</p>", "faceResource", "soundResource", ...]
             * @param part0 第一部分是一个有效的html文本或字符串
             * @param part1 第二部分是表情资源的链接，可以是face集指定的faceId，也可以是一个有效的url，优先检索face集
             * @param part2 预计作为音效资源的链接（然而目前并没有加入），可以是sound集指定的soundId，也可以是一个有效的url，优先检索sound集
             * @param other 后面的部分暂时没作用，以后可能会扩展一些功能
             * 总之，"::"将被作为分隔符使用，注意避免冲突
             */
            "queue": [],
            /**
             * 表情包, 两种写法，Object或Array都行.
             * Object.e.g:  {"smile": ["smile.png"], "trick": ["trickA.png", "trickB.png"], "shy": ["shy.png"]}
             * //faceId分别是"smile", "trick", "shy"
             * Array.e.g:   [["smile.png"], ["trickA.png", "trickB.png"], ["shy.png"]]
             * //faceId分别是0, 1, 2（也可以写成"0", "1", "2"）
             * 解析：表情是指几帧立绘图，当聊天输出内容时指定faceId，则OwO会随机切换到其中的某张，即变换表情
             * !表情切换后不会还原到初始状态，你需要手动指定下一帧为初始图片(OwO.config.image)
             */
            "face": {}  //[]
        }
    },
    "util": {
        "config": {
            "log": false,
            "debug": false,
            "info": true,
            "warn": true,
            "error": true,
            "monitor": false
        }
    }
};
/* 本地化模块 */
(function () {
    //配置成中文
    OwO.locale.chinese = function () {
        OwO.config.title = "我是来自二次元的OwO~";
        OwO.menu.config.infoPanel = {
            "title": "OwO信息",
            "keyMap": { "name": "姓名", "gender": "性别", "birth": "生日", "master": "主人", "home": "居所", "github": "GitHub", "adopt": "抱走", "back": "返回" },  //信息面板上的键名
        };
        OwO.menu.config.defaultButtons = {
            "hideButton": {
                "showed": true, "text": "隐藏", "bye": "我会想念你的，再见~",
                "showButton": { "showed": true, "text": "呼唤OwO", "hello": "WoW, 萌萌哒OwO又回来咯!!!" }
            },
            "topButton": { "showed": true, "text": "顶部" },
            "homeButton": { "showed": true, "text": "回家" }
        };
        OwO.chat.config.defaultWords = "OwO为你送上来自二次元的问候~";
    };
}());

/**
 * 初始化并召唤OwO.
 * 请完成所有自定义配置
 * 然后再调用该方法进行初始化
 * 之后你将得到一系列操作OwO的方法
 * 但请勿再修改配置、
 * 我不保证之后的修改会生效
 */
OwO.init = function () {


/** OwO.util 辅助方法 */
(function () {
    var config = OwO.util.config;
    var workspace = console;
    
    //保护性装饰器
    function protect(allow, func) {
        if (allow) return func;
        else return function () {};
    }
    
    /** 一般信息 */
    OwO.util.log = protect(config.log, function (flag, message) {
        workspace.log("[log]\t" + flag + ": " + message);
    });
    
    /** 调试信息 */
    OwO.util.debug = protect(config.debug, function (flag, message) {
        workspace.debug("[debug]\t" + flag + ": " + message);
    });
    
    /** 提示信息 */
    OwO.util.info = protect(config.info, function (flag, message) {
        workspace.info("[info]\t" + flag + ": " + message);
    });
    
    /** 警告信息 */
    OwO.util.warn = protect(config.warn, function (flag, message) {
        workspace.warn("[warn]\t" + flag + ": " + message);
    });
    
    /** 错误信息 */
    OwO.util.error = protect(config.error, function (flag, message) {
        workspace.error("[error]\t" + flag + ": " + message);
    });
    
    /** 信息组 */
    OwO.util.group = function (content) { workspace.group(content); };
    OwO.util.groupEnd = function (content) { workspace.groupEnd(content); };
    
    /** 步进监视 */
    OwO.util.monitor = (function () {
        if (!config.monitor) return function () {};
        
        //输出日志装饰器
        function decorate(context, func, title) {
            return function () {
                var result;
                
                OwO.util.group(title);
                OwO.util.debug("Func status", "begin");
                
                try {
                    result = func.apply(context, arguments);
                } catch (e) {
                    OwO.util.error(e.name, e.message + "\n" + e.stack);
                    OwO.util.warn("Func status", "error!");
                } finally {
                    OwO.util.debug("Func status", "fin");
                    OwO.util.groupEnd();
                }
                
                return result;
            };
        }
        
        //监视对象所有方法执行流程
        return function (obj, objName) {        
            for (var key in obj)
            {
                if (typeof(obj[key]) != "function") continue;
                
                obj[key] = decorate(obj, obj[key], "Monitor: " + objName + "." + key + "();");
            }
        };
    }());
    
    /** 请求/取消动画帧 */
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame;
        //优化，多数情况到此为止，后面一大段省了
        if ( requestAnimationFrame && cancelAnimationFrame ) return;
        
        var lastTime = 0;
        var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

        var prefix;
        //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
        for( var i = 0; i < prefixes.length; i++ ) {
            if ( requestAnimationFrame && cancelAnimationFrame ) {
            break;
            }
            prefix = prefixes[i];
            requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
            cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
        }

        //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
        if ( !requestAnimationFrame || !cancelAnimationFrame ) {
            requestAnimationFrame = function( callback, element ) {
            var currTime = new Date().getTime();
            //为了使setTimteout的尽可能的接近每秒60帧的效果
            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ); 
            var id = window.setTimeout( function() {
                callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
            };
            
            cancelAnimationFrame = function( id ) {
            window.clearTimeout( id );
            };
        }

        //得到兼容各浏览器的API
        window.requestAnimationFrame = requestAnimationFrame; 
        window.cancelAnimationFrame = cancelAnimationFrame;
    }());
    OwO.util.requestAnimationFrame = function (func) {
        return window.requestAnimationFrame(func);
    };
    OwO.util.cancelAnimationFrame = function (func) {
        return window.cancelAnimationFrame(func);
    };
    
    /* 构造队列的获取集合方法 */
    OwO.util.reqCollect = function (queue) {
        var index = -1;
        //随机抽取
        function extract() {
            if (queue[0] !== 0) return false;
            
            var dis = 0;
            var max = queue[queue.length - 1];
            return function req () {
                var rand = dis + parseInt(Math.random() * (max - dis));
                var _index;
                for (_index = queue.length - 3; _index >= 0; _index-=2) {
                    if (queue[_index] > rand) continue;
                    
                    if (_index == index) {
                        rand -= dis;
                        continue;
                    }
                    
                    index = _index;
                    dis = queue[_index + 2] - queue[_index];
                    return queue[_index + 1];
                }
                return req();
            };
        };
        //顺序执行
        function enqueue() {
            if (queue[0] === 0) return false;
            
            return function () {
                if (++index >= queue.length) index = 0;
                return queue[index];
            };
        };
        return extract() || enqueue();
    }
    
    /** 加载图片 */
    OwO.util.loadImage = function (src, callback) {
        return function () {
            var image = new Image();
            image.src = src;
            image.onerror = function() {
                OwO.util.warn("Load image failed", "src = " + OwO.config.image);
                callback();
            }
            if (image.complete) callback();
            else image.onload = callback;
        }
    };
    
    /** 光标进入 */
    OwO.util.addMouseEnterListen = function (el, func) {
        if (el.onmouseenter === null) el.onmouseenter = func;
        else el.onmouseover = func;
    } 
    /** 光标离开 */
    OwO.util.addMouseLeaveListen = function (el, func) {
        if (el.onmouseleave === null) el.onmouseleave = func;
        else el.onmouseout = func;
    }
    
    /** 共享变量 */
    OwO.util.share = {};
}());
OwO.util.info("Init", "Base utilities is ready.");


/** OwO 主体模块 */
(function () {
    var config = OwO.config;
    
    var owo;
    /** 召唤 */
    OwO.call = OwO.util.loadImage(config.image, function () {
        if (owo)
        {
            OwO.util.warn("IllegalState", "Already called.");
            return;
        }
        owo = {};
        
        var owoImg = document.createElement("img");
        owoImg.draggable = false;
        owoImg.src = config.image;
        owoImg.style.display = "block";     //防止img在结尾补换行
        
        var focus;
        //是否有焦点
        owo.isFocus = function () { return focus; };
        
        //设置纹理
        owo.setTexture = function (texture) {
            owoImg.src = texture;
        };
        
        var owoDiv = document.createElement("div");
        owoDiv.appendChild(owoImg);
        owoDiv.style.zIndex = config.zIndex;
        
        if (OwO.config.parent) {
            OwO.util.share.parent = OwO.config.parent;
            OwO.util.share.position = "absolute";
        }
        else {
            OwO.util.share.parent = document.documentElement;
            OwO.util.share.position = "fixed";
        }
        owoDiv.style.position = OwO.util.share.position;
        
        var showed;
        //显示
        owo.show = function () {
            if (showed)
            {
                OwO.util.warn("IllegalState", "Already showed.");
                return;
            }
            
            focus = false;
            OwO.anim.play();
            OwO.chat.scroll();
            OwO.util.share.parent.appendChild(owoDiv);
            showed = true;
        };
        OwO.anim.init();
        OwO.chat.init();
        owo.show();
        OwO.util.share.width = owoDiv.clientWidth;
        OwO.util.share.height =  owoDiv.clientHeight
        
        //隐藏
        owo.hide = function () {
            if (!showed)
            {
                OwO.util.warn("IllegalState", "Already hided.");
                return;
            }
            
            OwO.anim.stop();
            OwO.chat.stop();
            owoDiv.remove();
            showed = false;
            
            OwO.menu.hide();
        };
        
        
        var coord = [];
        //移动
        owo.move = function(offset) {
            coord[2] += (coord[2] * offset[2] / 100);
            if (coord[2] < 0) coord[2] = 0; 
            coord[0] += offset[0] * coord[2];
            coord[1] += offset[1] * coord[2];
            owoDiv.style.left = coord[0] + "px";
            owoDiv.style.top = coord[1] + "px";
            owoDiv.style.transform = "scale(" + coord[2] + ", " + coord[2] + ")";
            
            OwO.menu.config.strictFollow && OwO.menu.follow(coord[0], coord[1]);
        }
        
        //归位
        owo.resize = function () {
            if (!showed)
            {
                OwO.util.warn("IllegalState", "Can not resized when hided.");
                return;
            }
            
            coord[0] = config.coord[0] * OwO.util.share.parent.clientWidth;
            coord[1] = config.coord[1] * OwO.util.share.parent.clientHeight;
            if (OwO.util.share.parent.style.position != "relative"
                && OwO.util.share.parent.style.position != "absolute"
                && OwO.util.share.parent.style.position != "fixed"
                && OwO.util.share.parent.style.position != "inherit"
            ) {
                var rect = OwO.util.share.parent.getBoundingClientRect();
                coord[0] += rect.left;
                coord[1] += rect.top;
            }
            coord[0] -= config.axis[0] * owoDiv.clientWidth;
            coord[1] -= config.axis[1] * owoDiv.clientHeight;
            owoDiv.style.left = coord[0] + "px";
            owoDiv.style.top = coord[1] + "px";
            coord[2] = config.coord[2];
            owoDiv.style.transform = undefined;
            
            OwO.menu.follow(coord[0], coord[1]);
            OwO.anim.replay();
            //OwO.chat.replay();
        };
        owo.resize();
        
        //配置光标样式
        if (config.cursor == "simple") config.cursor = "http://os.zheng0716.com/static/image/OwO_simple.ico";
        else if (config.cursor == "moe") config.cursor = "http://os.zheng0716.com/static/image/OwO_moe.ico";
        owoDiv.style.cursor = 'url("' + config.cursor + '"), url("http://os.zheng0716.com/static/image/OwO_simple.ico"), auto';
        owoDiv.title = config.title;
        
        //鼠标进入
        OwO.util.addMouseEnterListen(owoDiv, function (e) {
            focus = true;
            OwO.menu.follow(coord[0], coord[1]);
            OwO.menu.show();
        });
        var pressed = false;
        var offset;
        var percent;
        //鼠标按下
        owoDiv.onmousedown = function (e) {
            pressed = true;
            offset = [e.pageX - coord[0], e.pageY - coord[1]]
            if (config.onClick) {
                var perX = (e.layerX || e.offsetX) / owoDiv.clientWidth;
                var perY = (e.layerY || e.offsetY) / owoDiv.clientHeight;
                percent = (config.onTouch && config.onTouch(perX, perY)) ? undefined : [perX, perY];
            }
        };
        var moved = false;
        //鼠标移动
        owoDiv.onmousemove = function (e) {
            if (!pressed) return;
            moved = true;
            
            if (config.draggableX) {
                coord[0] = e.pageX - offset[0];
                owoDiv.style.left = coord[0] + "px";
            }
            if (config.draggableY) {
                coord[1] = e.pageY - offset[1];
                owoDiv.style.top = coord[1] + "px";
            }
            
            OwO.menu.config.strictFollow && OwO.menu.follow(coord[0], coord[1]);
        };
        //鼠标抬起
        owoDiv.onmouseup = function (e) {
            pressed = false;
            
            if (moved)
            {
                moved = false;
                OwO.menu.follow(coord[0], coord[1]);
                return;
            }
            if (config.onClick) {
                var perX = (e.layerX || e.offsetX) / owoDiv.clientWidth;
                var perY = (e.layerY || e.offsetY) / owoDiv.clientHeight;
                if (percent && percent[0] == perX && percent[1] == perY) config.onClick(perX, perY);
                percent = undefined;
            }
        };
        //鼠标离开
        OwO.util.addMouseLeaveListen(owoDiv, function (e) {
            focus = false;
            pressed = false;
            
            if (!OwO.menu.config.alwaysShow) OwO.menu.hide();
            else OwO.util.log("Lose focus", "Menu doesn't hide, config is always show");
        });
    });
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!owo)
            {
                OwO.util.warn("IllegalState", "Not called yet.");
                return;
            }
            
            return func.apply(OwO, arguments);
        };
    }
    
    /** 显示 */
    OwO.show = protect(function () {
        return owo.show();
    });
    
    /** 隐藏 */
    OwO.hide = protect(function () {
        return owo.hide();
    });
    
    /** 归位 */
    OwO.resize = protect(function () {
        return owo.resize();
    });
    
    /** 释放 */
    OwO.free = protect(function () {
        OwO.hide();
        owo = undefined;
        
        OwO.menu.release();
        OwO.anim.release();
        OwO.chat.release();
    });
    
    //监视
    OwO.util.monitor(OwO, "OwO");
    
    /* 留给anim与chat的接口 */
    
    /** 是否获得焦点 */
    OwO.util.share.isFocus = protect(function () {
        return owo.isFocus();
    })
    
    /** 设置纹理 */
    OwO.util.share.setTexture = protect(function (texture) {
        return owo.setTexture(texture);
    })
    
    /** 移动位置 */
    OwO.util.share.move = protect(function (offset) {
        return owo.move(offset);
    })
}());
OwO.util.info("Init", "Main body is ready.");


/** OwO.anim 动画模块 */
(function () {
    var config = OwO.anim.config;
    
    var anim;
    //初始化
    OwO.anim.init = function (param) {
        if (anim) {
            OwO.util.warn("IllegalState", "Animation inited.");
            return;
        }
        anim = {};
        
        if (config.queue == false) {
            anim.play = anim.stop = function () { OwO.util.log("InvalidArgument", "Empty animation queue."); };
            return;
        }
        
        //请求一个动作集
        var reqAction = OwO.util.reqCollect(config.queue);
        
        var actionHandle;
        var frameHandle;
        var playing;
        //播放动画
        anim.play = function () {
            if (playing) {
                OwO.util.warn("IllegalState", "Animation has already playing");
                return;
            }
            playing = true;
            
            var action = reqAction();
            var index = -1;
            var delay = 0;
            var repeat = action.repeat || 0;
            function playFrame() {
                if (!playing) return;
                
                if (delay-- > 0) {
                    frameHandle = OwO.util.requestAnimationFrame(playFrame);
                    return;
                }
                delay = action.delay;
                
                (OwO.util.share.isFocus() && !config.move1Focus) || action.offset && OwO.util.share.move(action.offset);
                if (action.frames && repeat >= 0) {
                    if (!OwO.util.share.isFocus()) {
                        if (++index >= action.frames.length) {
                            repeat--;
                            index = 0;
                        }
                        
                        action.frames[index] != undefined && OwO.util.share.setTexture(action.frames[index]);
                    }
                    else if (config.play1Focus) {
                        if (++index >= action.frames.length) index = 0;
                        
                        action.frames[index] != undefined && OwO.util.share.setTexture(action.frames[index]);
                    }
                    
                    frameHandle = OwO.util.requestAnimationFrame(playFrame);
                    return;
                }
                
                clearTimeout(actionHandle);
                actionHandle = undefined;
                if (playing) {
                    playing = false;
                    actionHandle = setTimeout(anim.play(), 1000 * action.wait || 0);
                }
                
                if (config.resize1Finish) {
                    OwO.util.share.setTexture(OwO.config.image);
                    OwO.resize();
                }
                action.onFinish && action.onFinish();
            }
            frameHandle = OwO.util.requestAnimationFrame(playFrame);
        }
        
        //停止播放
        anim.stop = function () {
            if (!playing) return;
            playing = false;
            OwO.util.cancelAnimationFrame(frameHandle);
            clearTimeout(actionHandle);
            frameHandle = actionHandle = undefined;
        };
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!anim)
            {
                OwO.util.warn("IllegalState", "Animation has not inited yet.");
                return;
            }
            
            return func.apply(OwO.anim, arguments);
        };
    }
    
    /** 播放 */
    OwO.anim.play = protect(function () {
        return anim.play();
    });
    
    /** 停止 */
    OwO.anim.stop = protect(function () {
        return anim.stop();
    });
    
    /** 重置 */
    OwO.anim.replay = protect(function () {
        anim.stop();
        return anim.play();
    });
    
    /** 释放 */
    OwO.anim.release = protect(function () {
        OwO.anim.stop();
        anim = undefined;
    });
    
    //监视
    //OwO.util.monitor(OwO.anim, "OwO.anim");
}());
OwO.util.info("Init", "Anim module is ready.");


/** OwO.chat 聊天模块 */
(function () {
    var config = OwO.chat.config;
    
    var chat;
    /** 初始化聊天部件 */
    OwO.chat.init = function () {
        if (chat) {
            OwO.util.warn("IllegalState", "Chat panel has already exited.");
            return;
        }
        chat = {};
        
        var panelDiv = document.createElement("div");
        OwO.menu.init(panelDiv);
        panelDiv.style.minHeight = config.minHeight;
        panelDiv.style.padding = "6px";
        panelDiv.style.color = OwO.menu.config.color;
        panelDiv.style.backgroundColor = OwO.menu.config.bgColor;
        panelDiv.style.boxShadow = "0px 0px 8px " + OwO.menu.config.shadowColor;
        panelDiv.style.borderRadius = "6px";
        panelDiv.innerHTML = config.defaultWords;
        
        //隐藏
        chat.hide = function() { panelDiv.style.width = "0px"; }
        //显示
        chat.show = function(width) { panelDiv.style.width = width - panelDiv.clientWidth + "px"; }
        
        if (config.queue == false) {
            chat.stop = chat.scroll = function () { OwO.util.log("InvalidArgument", "Empty message queue."); };
            return;
        }
        
        //请求一个消息集
        var reqMessage = OwO.util.reqCollect(config.queue);
        
        var messageHandle;
        var contentHandle;
        var scrolling;
        //滚动消息
        chat.scroll = function () {
            if (scrolling) {
                OwO.util.warn("IllegalState", "Message is scrolling");
                return;
            }
            scrolling = true;
            
            OwO.menu.config.alwaysShow || OwO.menu.hide();
            var message = reqMessage();
            var index = -1;
            var delay = 0;
            function scrollContent() {
                if (!scrolling) return;
                
                if (delay-- > 0) {
                    contentHandle = OwO.util.requestAnimationFrame(scrollContent);
                    return;
                }
                delay = message.delay;
                
                if (message.content) {
                    OwO.menu.show();
                    if (++index < message.content.length) {
                        if (message.content[index]) {
                            var parts = message.content[index].split("::");
                            parts[0] && (panelDiv.innerHTML = parts[0]);
                            parts[1] && (OwO.util.share.setTexture(
                                config.face[parts[1]] ?
                                (function () {
                                    var faces = config.face[parts[1]];
                                    var rand = parseInt(Math.random() * faces.length);
                                    return faces[rand];
                                }()) : parts[1]
                            ));
                        }
                        contentHandle = OwO.util.requestAnimationFrame(scrollContent);
                        return;
                    }
                }
                
                if (scrolling) {
                    scrolling = false;
                    messageHandle = setTimeout(chat.scroll, 1000 * message.wait || 0);
                }
                message.onFinish && message.onFinish();
            }
            if (message.content) panelDiv.innerHTML = "";
            contentHandle = OwO.util.requestAnimationFrame(scrollContent);
        }
        
        //停止滚动
        chat.stop = function () {
            if (!scrolling) return;
            scrolling = false;    //锁
            clearTimeout(messageHandle);
            OwO.util.cancelAnimationFrame(contentHandle);
            contentHandle = messageHandle = undefined;
        };
        
        return panelDiv;
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!chat)
            {
                OwO.util.warn("IllegalState", "No chat panel found.");
                return;
            }
            
            return func.apply(OwO.chat, arguments);
        };
    }
    
    //隐藏
    OwO.chat.hide = protect(function () {
        return chat.hide();
    });
    //显示
    OwO.chat.show = protect(function (width) {
        return chat.show(width);
    });
    
    //滚动
    OwO.chat.scroll = protect(function () {
        return chat.scroll();
    });
    //停止
    OwO.chat.stop = protect(function () {
        return chat.stop();
    });
    
    /** 释放 */
    OwO.chat.release = protect(function () {
        OwO.chat.stop();
        chat = undefined;
    });
    
    //监视
    //OwO.util.monitor(OwO.chat, "OwO.chat");
}());
OwO.util.info("Init", "Chat module is ready.");


/** OwO.menu 菜单模块 */
(function () {
    var config = OwO.menu.config;
    
    var menu;
    /** 初始化 */
    OwO.menu.init = function (chatPanel) {
        if (menu)
        {
            OwO.util.log("InvalidState", "Menu has already init.");
            return;
        }
        menu = {};
        
        var menuDiv = document.createElement("div");
        menuDiv.className = config.class; //允许用户自定义的class
        menuDiv.style.position = OwO.util.share.position;
        menuDiv.style.zIndex = 1 + OwO.config.zIndex;
        menuDiv.style.fontSize = config.fontSize;
        menuDiv.style.fontFamily = config.fontFamily;
        
        //切换按钮面板
        menu.changePanel = function(panel) {
            menuDiv.innerHTML = "";
            menuDiv.appendChild(panel);
            if (showed) {
                //还原位置
                showed = false;
                menuDiv.remove();
                menu.show();
            }
        };
        var menuPanel = document.createElement("div");
        menu.changePanel(menuPanel);
        
        //添加默认样式
        menu.addDefaultButtonStyle = function (button, cssFloat) {
            button.style.paddingLeft = "6px";
            button.style.paddingRight = "6px";
            button.style.margin = "6px";
            button.style.cursor = "pointer";
            button.style.color = config.color;
            button.style.backgroundColor = config.bgColor;
            button.style.boxShadow = "0px 0px 8px " + config.shadowColor;
            button.style.borderRadius = "6px";
            button.style.border = config.bgColor + " 3px solid";
            button.style.cssFloat = cssFloat || "right";
            button.style.fontSize = config.fontSize;
            button.style.fontFamily = config.fontFamily;
            
            OwO.util.addMouseEnterListen(button, function (e) {
                button.style.border = config.focusColor + " 3px solid";
            });
            OwO.util.addMouseLeaveListen(button, function (e) {
                button.style.border = config.bgColor + " 3px solid";
            });
            
            return button;
        }
        
        //添加按钮
        menu.add = function (button) {
            menuPanel.appendChild(button);
        };
        menu.add(chatPanel);
        menu.add(document.createElement("br"));
        
        //快速添加文字按钮
        menu.quickAdd = function (text, func, cssFloat) {
            var button = document.createElement("p");
            button.textContent = text;
            menu.addDefaultButtonStyle(button, cssFloat);
            button.onclick = func;
            menu.add(button);
        };
        menu.quickAdd("OwO", function(e) {
            var infoConf = config.infoPanel;
            var keyMap = infoConf.keyMap;
            var info = OwO.info;
            
            //OwO信息
            var infoDiv = document.createElement("div");
            infoDiv.innerHTML = "<h3>" + infoConf.title + "</h3>"
                + "<hr />"
                + "<li style=\"padding: 6px;\">" + keyMap.name + ": " + info.name + "</li>"
                + "<li style=\"padding: 6px;\">" + keyMap.gender + ": " + info.gender + "</li>"
                + "<li style=\"padding: 6px;\">" + keyMap.birth + ": " + info.birth + "</li>"
                + "<li style=\"padding: 6px;\">" + keyMap.master + ": " + info.master + "</li>"
                + "<li style=\"padding: 6px;\">" + keyMap.home + ": <a href=" + info.home.link + ' target="_blank">' + info.home.name + "</a></li>";
            infoDiv.style.padding = "6px";
            infoDiv.style.marginRight = "12px";
            infoDiv.style.color = config.color;
            infoDiv.style.backgroundColor = config.bgColor;
            infoDiv.style.boxShadow = "0px 0px 8px " + config.shadowColor;
            infoDiv.style.borderRadius = "6px";
            infoDiv.style.cssFloat = "left";
            infoDiv.style.textAlign = "left";
            
            var sideDiv = document.createElement("div");
            sideDiv.style.cssFloat = "right";
            sideDiv.style.marginRight = "10px";
            //GitHub
            var ghButton = document.createElement("p");
            ghButton.textContent = keyMap.github;
            ghButton.onclick = function (e) { window.open("https://github.com/zhengxiaoyao0716/OwO"); };
            menu.addDefaultButtonStyle(ghButton, "left");
            sideDiv.appendChild(ghButton);
            sideDiv.appendChild(document.createElement("br"));
            //领养
            var adoptButton = document.createElement("p");
            adoptButton.textContent = keyMap.adopt;
            adoptButton.onclick = function (e) { window.open("http://owo.zheng0716.com/adopt"
                    + "?template=" + encodeURIComponent(OwO.template)
                    + "?name=" + OwO.info.name
                    + "&home=" + encodeURIComponent(OwO.info.home.link)
                );
            };
            menu.addDefaultButtonStyle(adoptButton, "left");
            sideDiv.appendChild(adoptButton);
            sideDiv.appendChild(document.createElement("br"));
            //返回
            var backButton = document.createElement("p");
            backButton.textContent = keyMap.back;
            backButton.onclick = function (e) { OwO.menu.changePanel(menuPanel); };
            menu.addDefaultButtonStyle(backButton, "left");
            sideDiv.appendChild(backButton);
            sideDiv.appendChild(document.createElement("br"));
            
            var infoPanel = document.createElement("div");
            infoPanel.appendChild(infoDiv);
            infoPanel.appendChild(sideDiv);
            OwO.menu.changePanel(infoPanel);
        });
        
        var coord;
        //跟随
        menu.follow = function (coordX, coordY) {
            coord = [
                coordX + config.coord[0] * OwO.util.share.width,
                coordY + config.coord[1] * OwO.util.share.height
            ];
            
            if (showed) {
                menuDiv.remove();
                showed = false;
                menu.show();
            }
            else if (config.alwaysShow) OwO.menu.show();
        };
        
        var showed;
        var alpha = 0, tranGrad;
        //显示
        menu.show = function () {
            if (showed)
            {
                OwO.util.log("InvalidState", "Menu has already showed.");
                return;
            }
            
            OwO.chat.hide();
            OwO.util.share.parent.appendChild(menuDiv);
            OwO.chat.show(menuPanel.clientWidth);
            
            var _coord = [coord[0] - config.axis[0] * menuDiv.clientWidth, coord[1] - config.axis[1] * menuDiv.clientHeight];
            if (_coord[0] < 0)
                menuDiv.style.left = "0px";
            else if (_coord[0] > document.documentElement.clientWidth - menuDiv.clientWidth)
                menuDiv.style.left = document.documentElement.clientWidth - menuDiv.clientWidth + "px";
            else
                menuDiv.style.left = _coord[0] + "px";
            menuDiv.style.top = _coord[1] + "px";
            
            showed = true;
            
            OwO.util.cancelAnimationFrame(tranGrad);
            (function show() {
                if (!showed) return;
                
                alpha += 5;
                menuDiv.style.filter = 'alpha(opacity='+alpha+')';
                menuDiv.style.opacity = alpha / 100;
                
                if (alpha < 100)  tranGrad = OwO.util.requestAnimationFrame(show);
            }());
        };
        
        //隐藏
        menu.hide = function () {
            if (!showed)
            {
                OwO.util.log("InvalidState", "Menu has already hided.");
                return;
            }
            
            showed = false;
            
            OwO.util.cancelAnimationFrame(tranGrad);
            (function hide() {
                if (showed) return;
                
                alpha -= 2;
                menuDiv.style.filter = 'alpha(opacity='+alpha+')';
                menuDiv.style.opacity = alpha / 100;
                
                if (alpha < 0) {
                    menuDiv.innerHTML = "";
                    menuDiv.remove();
                    menuDiv.appendChild(menuPanel);
                    OwO.chat.hide();
                }
                else OwO.util.requestAnimationFrame(hide);
            }());
        };
        
        //鼠标进入
        OwO.util.addMouseEnterListen(menuDiv, function (e) {
            OwO.menu.show();
        });
        //鼠标点击
        menuDiv.onclick = config.onclick;
        //鼠标离开
        OwO.util.addMouseLeaveListen(menuDiv, function (e) {
            if (!config.alwaysShow) OwO.menu.hide();
            else OwO.util.log("Lose focus", "Menu doesn't hide, config is always show");
        });
        
        //默认添加的按钮组
        (function () {
            //隐藏OwO
            if (config.defaultButtons.hideButton.showed) OwO.menu.quickAdd(
                config.defaultButtons.hideButton.text,
                function (e) {
                    var byePanel = document.createElement("div");
                    byePanel.innerHTML = config.defaultButtons.hideButton.bye;
                    menu.changePanel(menu.addDefaultButtonStyle(byePanel));
                    OwO.hide();
                    
                    setTimeout(function () {
                        showed = false;
                        menuDiv.innerHTML = "";
                        menuDiv.remove();
                        menuDiv.appendChild(menuPanel);
                        
                        if (!config.defaultButtons.hideButton.showButton.showed) return;
                        var showButton = document.createElement("div");
                        showButton.textContent = config.defaultButtons.hideButton.showButton.text;
                        menu.addDefaultButtonStyle(showButton);
                        showButton.style.position = OwO.util.share.position;
                        showButton.style.right = "0px";
                        showButton.style.bottom = "0px";
                        showButton.style.margin = "6px";
                        showButton.onclick = function (e) {
                            OwO.show();
                            OwO.resize();
                            showButton.remove();
                            
                            var hiPanel = document.createElement("div");
                            hiPanel.innerHTML = config.defaultButtons.hideButton.showButton.hello;
                            menu.changePanel(menu.addDefaultButtonStyle(hiPanel));
                            OwO.menu.show();
                            setTimeout(function () {
                                if (!config.alwaysShow) OwO.menu.hide();
                                else menu.changePanel(menuPanel); 
                            }, 1000);
                        }
                        OwO.util.share.parent.appendChild(showButton);
                    }, 1000);
                }
            );
            //返回顶部
            if (config.defaultButtons.topButton.showed) OwO.menu.quickAdd(
                config.defaultButtons.topButton.text,
                function (e) {
                    scrollTo(0, 0);
                }
            );
            //跳转首页
            if (config.defaultButtons.homeButton.showed) OwO.menu.quickAdd(
                config.defaultButtons.homeButton.text,
                function (e) {
                    window.location.href = OwO.info.home.link;
                }
            );
        }());
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!menu)
            {
                OwO.util.warn("IllegalState", "Menu has not inited yet.");
                return;
            }
            
            return func.apply(OwO.menu, arguments);
        };
    }
    
    /** 为按钮添加默认样式 */
    OwO.menu.addDefaultButtonStyle = protect(function (button, cssFloat) {
        return menu.addDefaultButtonStyle(button, cssFloat);
    });
    
    /** 切换整个按钮面板 */
    OwO.menu.changePanel = protect(function (panel) {
        return menu.changePanel(panel);
    });
    
    /** 添加新的按纽 */
    OwO.menu.add = protect(function (button) {
        return menu.add(button);
    });
    
    /** 快速添加文字按钮 */
    OwO.menu.quickAdd = protect(function (text, func, cssFloat) {
        return menu.quickAdd(text, func, cssFloat);
    });
    
    /** 显示 */
    OwO.menu.show = protect(function () {
        return menu.show();
    });
    
    /** 隐藏 */
    OwO.menu.hide = protect(function () {
        return menu.hide();
    });
    
    /** 跟随 */
    OwO.menu.follow = protect(function (coordX, coordY) {
        return menu.follow(coordX, coordY);
    });
    
    /** 释放 */
    OwO.menu.release = protect(function () {
        OwO.menu.hide();
        menu = undefined;
    });
    
    //监视
    OwO.util.monitor(OwO.menu, "OwO.menu");
}());
OwO.util.info("Init", "Menu module is ready.");


/** default items 默认初始项 */
(function () {
    //窗口调整适配
    var timeout;
    window.addEventListener("resize", function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            OwO.util.log("debounce", "resize();");
            
            OwO.resize();
            timeout = undefined;
        }, 250);
    });
}());
OwO.util.info("Init", "Initialization complete.");


OwO.init = function () {
    OwO.util.warn("Init field", "Function 'init' has already been used so that it was been destroyed.")
};
OwO.util.info("Welcome", "Like this plugin? Get it from github: https://github.com/zhengxiaoyao0716/OwO.");
return OwO.call();
};