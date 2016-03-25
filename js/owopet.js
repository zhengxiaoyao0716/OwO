/** 默认配置，请酌情修改 */
var OwOpet = {
    info: {
        name: "OwO",
        gender: "boy",
        birth: "2016/3/6",
        master: "zhengxiaoya0716"
    },
    config: {
        image: "./image/feihe.png",
        anim: {
            //todo
        },
        position: "fixed",
        coord: [1, 0, 99],
        axis: [1, 0],
        //cursor: "./image/OwO_moe.ico",
        cursor: "./image/OwO_simple.ico",
        title: "Hi，我是萌宠OwO~",
        draggable: true
    },
    menu: {
        config: {
            //todo
        }
    },
    util: {
        config: {
            log: true,
            debug: true,
            info: true,
            warn: true,
            error: true,
            monitor: true
        }
    }
};
/**
 * 初始化并召唤宠物.
 * 请完成所有自定义配置
 * 然后再调用该方法进行初始化
 * 之后你将得到一系列操作宠物的方法
 * 但请勿再修改配置、
 * 我不保证之后的修改会生效
 */
OwOpet.init = function () {


/** OwOpet.util 辅助方法 */
(function () {
    var config = OwOpet.util.config;
    var workspace = console;
    
    //保护性装饰器
    function protect(allow, func) {
        if (allow) return func;
        else return function () {};
    }
    
    /** 一般信息 */
    OwOpet.util.log = protect(config.log, function (flag, message) {
        workspace.log("[log]\t" + flag + ": " + message);
    });
    
    /** 调试信息 */
    OwOpet.util.debug = protect(config.debug, function (flag, message) {
        workspace.debug("[debug]\t" + flag + ": " + message);
    });
    
    /** 提示信息 */
    OwOpet.util.info = protect(config.info, function (flag, message) {
        workspace.info("[info]\t" + flag + ": " + message);
    });
    
    /** 警告信息 */
    OwOpet.util.warn = protect(config.warn, function (flag, message) {
        workspace.warn("[warn]\t" + flag + ": " + message);
    });
    
    /** 错误信息 */
    OwOpet.util.error = protect(config.error, function (flag, message) {
        workspace.error("[error]\t" + flag + ": " + message);
    });
    
    /** 信息组 */
    OwOpet.util.group = function (content) { workspace.group(content); };
    OwOpet.util.groupEnd = function (content) { workspace.groupEnd(content); };
    
    /** 步进监视 */
    OwOpet.util.monitor = (function () {
        if (!config.monitor) return function () {};
        
        //输出日志装饰器
        function decorate(context, func, title) {
            return function () {
                var result;
                
                OwOpet.util.group(title);
                OwOpet.util.debug("Func status", "begin");
                
                try {
                    result = func.apply(context, arguments);
                } catch (e) {
                    OwOpet.util.error(e.name, e.message);
                    OwOpet.util.warn("Func status", "error!");
                } finally {
                    OwOpet.util.debug("Func status", "fin");
                    OwOpet.util.groupEnd();
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
    OwOpet.util.requestAnimationFrame = function (func) {
        return window.requestAnimationFrame(func);
    };
    OwOpet.util.cancelAnimationFrame = function (func) {
        return window.cancelAnimationFrame(func);
    };
    
    /** 加载图片 */
    OwOpet.util.loadImage = function (src, callback) {
        return function () {
            var image = new Image();
            image.src = src;
            if (image.complete) callback();
            else image.onload = callback;
        }
    };
}());
OwOpet.util.info("Init", "Base utilities is ready.");


/** OwOpet 主体模块 */
(function () {
    var pet;
    /** 召唤 */
    OwOpet.call = OwOpet.util.loadImage(OwOpet.config.image, function () {
        if (pet)
        {
            OwOpet.util.warn("IllegalState", "Already called.");
            return;
        }
        pet = {};
        
        var petImg = document.createElement("img");
        petImg.src = OwOpet.config.image;
        petImg.draggable = false;
        var petDiv = document.createElement("div");
        petDiv.appendChild(petImg);
        
        var showed;
        //显示
        pet.show = function () {
            if (showed)
            {
                OwOpet.util.warn("IllegalState", "Already showed.");
                return;
            }
            
            document.body.appendChild(petDiv);
            showed = true;
        };
        pet.show();
        
        //隐藏
        pet.hide = function () {
            if (!showed)
            {
                OwOpet.util.warn("IllegalState", "Already hided.");
                return;
            }
            
            petDiv.remove();
            showed = false;
            
            OwOpet.menu.hide();
        };
        
        var coord;
        //调整位置
        pet.resize = function () {
            if (!showed)
            {
                OwOpet.util.warn("IllegalState", "Can not resized when hided.");
                return;
            }
            
            petDiv.style.position = OwOpet.config.position;
            coord = [0, 0, OwOpet.config.coord[2]];
            coord[0] = OwOpet.config.coord[0] * document.documentElement.clientWidth;
            coord[1] = OwOpet.config.coord[1] * document.documentElement.clientHeight;
            coord[0] -= OwOpet.config.axis[0] * petDiv.clientWidth;
            coord[1] -= OwOpet.config.axis[1] * petDiv.clientHeight;
            petDiv.style.left = coord[0] + "px";
            petDiv.style.top = coord[1] + "px";
            petDiv.style.zIndex = String(coord[2]);
            
            OwOpet.menu.move(coord);
        };
        OwOpet.menu.init();
        pet.resize();
        
        petDiv.style.cursor = 'url("' + OwOpet.config.cursor + '"), url("http://os.zheng0716.com/static/image/OwO_simple.ico"), auto';
        petDiv.title = OwOpet.config.title;
        
        //鼠标进入
        function onmouseenter(e) {
            OwOpet.menu.show();
        };
        if (petDiv.onmouseenter === null) petDiv.onmouseenter = onmouseenter;
        else petDiv.onmouseover = onmouseenter;
        var pressed = false;
        var offset = [0, 0];
        //鼠标按下
        petDiv.onmousedown = function (e) {
            pressed = OwOpet.config.draggable && true;
            offset[0] = e.pageX - coord[0];
            offset[1] = e.pageY - coord[1];
        };
        var moved = false;
        //鼠标移动
        petDiv.onmousemove = function (e) {
            if (!pressed) return;
            moved = true;
            
            coord[0] = e.pageX - offset[0];
            coord[1] = e.pageY - offset[1];
            petDiv.style.left = coord[0] + "px";
            petDiv.style.top = coord[1] + "px";
        };
        //鼠标抬起
        petDiv.onmouseup = function (e) {
            pressed = false;
            
            if (moved)
            {
                moved = false;
                
                OwOpet.menu.move(coord);
                return;
            }
            //var perX = (e.layerX || e.offsetX) / petDiv.clientWidth;
            //var perY = (e.layerY || e.offsetY) / petDiv.clientHeight;
        };
        //鼠标离开
        function onmouseleave(e) {
            pressed = false;
            
            OwOpet.menu.hide();
        };
        if (petDiv.onmouseleave === null) petDiv.onmouseleave = onmouseleave;
        else petDiv.onmouseout = onmouseleave;
    });
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!pet)
            {
                OwOpet.util.warn("IllegalState", "Not called yet.");
                return;
            }
            
            return func.apply(OwOpet, arguments);
        };
    }
    
    /** 隐藏 */
    OwOpet.hide = protect(function () {
        return pet.hide();
    });
    
    /** 显示 */
    OwOpet.show = protect(function () {
        return pet.show();
    });
    
    /** 归位 */
    OwOpet.resize = protect(function () {
        return pet.resize();
    });
    
    /** 移动 */
    OwOpet.move = protect(function (left, right) {
        pet.move(left, right);
    });
    
    /** 释放 */
    OwOpet.free = protect(function () {
        OwOpet.hide();
        pet = undefined;
        
        OwOpet.menu.release();
    });
    
    //监视
    OwOpet.util.monitor(OwOpet, "OwOpet");
}());
OwOpet.util.info("Init", "Main body is ready.");


/** OwOpet.menu 菜单模块 */
(function () {
    var menu;
    
    /** 初始化 */
    OwOpet.menu.init = function () {
        if (menu)
        {
            OwOpet.util.warn("IllegalState", "Menu has already init.");
            return;
        }
        menu = {};
        
        var menuDiv = document.createElement("div");
        menuDiv.textContent = "test";
        
        //添加
        menu.add = function (image) {
            //todo
        };
        
        var showed;
        var alpha = 0, tranGrad;
        //显示
        menu.show = function () {
            if (showed)
            {
                OwOpet.util.warn("IllegalState", "Menu has already showed.");
                return;
            }
            
            document.body.appendChild(menuDiv);
            
            menuDiv.style.left = coord[0] + "px";
            menuDiv.style.top = coord[1] + "px";
            
            showed = true;
            
            OwOpet.util.cancelAnimationFrame(tranGrad);
            (function show() {
                if (!showed) return;
                //todo
                alpha += 5;
                menuDiv.style.filter = 'alpha(opacity='+alpha+')';
                menuDiv.style.opacity = alpha / 100;
                
                if (alpha < 100)  tranGrad = OwOpet.util.requestAnimationFrame(show);
            }());
        };
        //隐藏
        menu.hide = function () {
            if (!showed)
            {
                OwOpet.util.warn("IllegalState", "Menu has already hided.");
                return;
            }
            
            showed = false;
            
            OwOpet.util.cancelAnimationFrame(tranGrad);
            (function hide() {
                if (showed) return;
                //todo
                alpha -= 1;
                menuDiv.style.filter = 'alpha(opacity='+alpha+')';
                menuDiv.style.opacity = alpha / 100;
                
                if (alpha > 0)  OwOpet.util.requestAnimationFrame(hide);
                else menuDiv.remove();
            }());
        };
        
        var coord;
        //调整位置
        menu.move = function (petCoord) {
            OwOpet.util.log("menu move: ", petCoord);
            coord = petCoord;
            
            menuDiv.style.position = OwOpet.config.position;
            menuDiv.style.zIndex = String(1 + coord[2]);
            
            if (showed)
            {
                menuDiv.remove();
                showed = false;
                menu.show();
            }
        };
        
        //鼠标进入
        function onmouseenter(e) {
            menu.show();
        };
        if (menuDiv.onmouseenter === null) menuDiv.onmouseenter = onmouseenter;
        else menuDiv.onmouseover = onmouseenter;
        //鼠标点击
        menuDiv.onclick = function (e) {
            //todo
        };
        //鼠标离开
        function onmouseleave(e) {
            menu.hide();
        };
        if (menuDiv.onmouseleave === null) menuDiv.onmouseleave = onmouseleave;
        else menuDiv.onmouseout = onmouseleave;
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!menu)
            {
                OwOpet.util.warn("IllegalState", "Menu has not inited yet.");
                return;
            }
            
            return func.apply(OwOpet.menu, arguments);
        };
    }
    
    /** 显示 */
    OwOpet.menu.show = protect(function () {
        return menu.show();
    });
    
    /** 隐藏 */
    OwOpet.menu.hide = protect(function () {
        return menu.hide();
    });
    
    /** 移动 */
    OwOpet.menu.move = protect(function (petCoord) {
        return menu.move(petCoord);
    });
    
    /** 释放 */
    OwOpet.menu.release = protect(function () {
        OwOpet.menu.hide();
        menu = undefined;
    });
    
    //监视
    OwOpet.util.monitor(OwOpet.menu, "OwOpet.menu");
}());
OwOpet.util.info("Init", "Menu module is ready.");


/** default items 默认初始项 */
(function () {
    //窗口调整适配
    var timeout;
    window.addEventListener("resize", function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            OwOpet.util.log("debounce", "resize();");
            
            OwOpet.resize();
            timeout = undefined;
        }, 250);
    });
}());
OwOpet.util.info("Init", "Initialization complete.");


return OwOpet.call();
};