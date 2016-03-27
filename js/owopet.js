/** 默认配置，请酌情修改 */
var OwOpet = {
    "info": {
        "name": "OwO",
        "gender": "boy",
        "birth": "2016/3/6",
        "master": "zhengxiaoya0716"
    },
    "config": {
        "image": "./image/feihe.png",
        "anim": {
            //todo
        },
        "position": "fixed",
        "coord": [1, 0, 99],
        "axis": [1, 0],
        //cursor: "./image/OwO_moe.ico",
        "cursor": "./image/OwO_simple.ico",
        "title": "Hi，我是萌宠OwO~",
        "draggable": true
    },
    "menu": {
        "config": {
            //todo
            "class": "",            //在class之后的属性不会被用户自定义的css覆盖
            "bgColor": "white",
            "shadowColor": "#888",
            "focusColor": "#aaa",
            "strictFollow": false,  //是否严格跟随，即与宠物一起移动
            "autoHide": true,       //是否自动隐藏
            "defaultButtons": {
                "hideButton": { "showed": true, "bye": "我会想念你的，再见咯~", "hello": "WoW，萌萌哒OwO又回来咯！" }
            }
        }
    },
    "chat": {
        "config": {
            "maxWidth": "300px",
            "class": "",            //在class之前的属性可以被用户自定义的css覆盖，在class之后的属性不会
            "bgColor": "white",
            "shadowColor": "#888",
            "defaultWords": ["爱冷剑，怜悲箫，月下狼孤啸；轻点画，慢勾描，云中人逍遥。"]
        }
    },
    "util": {
        "config": {
            "log": true,
            "debug": true,
            "info": true,
            "warn": true,
            "error": true,
            "monitor": true
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
                    OwOpet.util.error(e.name, e.message + "\n" + e.stack);
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
    
    /** 光标进入 */
    OwOpet.util.addMouseEnterListen = function (el, func) {
        if (el.onmouseenter === null) el.onmouseenter = func;
        else el.onmouseover = func;
    } 
    /** 光标离开 */
    OwOpet.util.addMouseLeaveListen = function (el, func) {
        if (el.onmouseleave === null) el.onmouseleave = func;
        else el.onmouseout = func;
    } 
}());
OwOpet.util.info("Init", "Base utilities is ready.");


/** OwOpet 主体模块 */
(function () {
    var config = OwOpet.config;
    
    var pet;
    /** 召唤 */
    OwOpet.call = OwOpet.util.loadImage(config.image, function () {
        if (pet)
        {
            OwOpet.util.warn("IllegalState", "Already called.");
            return;
        }
        pet = {};
        
        var petImg = document.createElement("img");
        petImg.src = config.image;
        petImg.draggable = false;
        var petDiv = document.createElement("div");
        petDiv.appendChild(petImg);
        petDiv.style.position = config.position;
        petDiv.style.zIndex = String(config.coord[2]);
        
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
        
        var coord = [];
        //调整位置
        pet.resize = function () {
            if (!showed)
            {
                OwOpet.util.warn("IllegalState", "Can not resized when hided.");
                return;
            }
            
            coord[0] = config.coord[0] * document.documentElement.clientWidth;
            coord[1] = config.coord[1] * document.documentElement.clientHeight;
            coord[0] -= config.axis[0] * petDiv.clientWidth;
            coord[1] -= config.axis[1] * petDiv.clientHeight;
            petDiv.style.left = coord[0] + "px";
            petDiv.style.top = coord[1] + "px";
            
            OwOpet.menu.follow(coord[0] + 0.5 * petDiv.clientWidth, coord[1] + (config.axis[1] > 0.5 ? -0.5 : 1.5) * petDiv.clientHeight);
        };
        OwOpet.menu.init();
        pet.resize();
        
        petDiv.style.cursor = 'url("' + config.cursor + '"), url("http://os.zheng0716.com/static/image/OwO_simple.ico"), auto';
        petDiv.title = config.title;
        
        //鼠标进入
        OwOpet.util.addMouseEnterListen(petDiv, function (e) {
            OwOpet.menu.show();
        });
        var pressed = false;
        var offset = [0, 0];
        //鼠标按下
        petDiv.onmousedown = function (e) {
            pressed = config.draggable && true;
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
            
            if (OwOpet.menu.config.strictFollow) OwOpet.menu.follow(coord[0] + 0.5 * petDiv.clientWidth, coord[1] + (config.axis[1] > 0.5 ? -0.5 : 1.5) * petDiv.clientHeight);
        };
        //鼠标抬起
        petDiv.onmouseup = function (e) {
            pressed = false;
            
            if (moved)
            {
                moved = false;
                
                OwOpet.menu.follow(coord[0] + 0.5 * petDiv.clientWidth, coord[1] + (config.axis[1] > 0.5 ? -0.5 : 1.5) * petDiv.clientHeight);
                return;
            }
            //var perX = (e.layerX || e.offsetX) / petDiv.clientWidth;
            //var perY = (e.layerY || e.offsetY) / petDiv.clientHeight;
        };
        //鼠标离开
        OwOpet.util.addMouseLeaveListen(petDiv, function (e) {
            pressed = false;
            
            
            if (config.autoHide) OwOpet.menu.hide();
            else OwOpet.util.log("Lose focus", "Menu doesn't hide, config is always show");
        });
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
    var config = OwOpet.menu.config;
    
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
        menuDiv.style.position = OwOpet.config.position;
        menuDiv.style.zIndex = String(1 + OwOpet.config.coord[2]);
        menuDiv.className = config.class; //允许用户自定义的class
        var menuPanel = document.createElement("div");
        menuDiv.appendChild(menuPanel);
        var defaultButton = document.createElement("p");
        defaultButton.textContent = "OwO";
        
        //添加默认样式
        menu.addDefaultButtonStyle = function (button) {
            button.style.display = "inline-block";
            button.style.paddingLeft = "6px";
            button.style.paddingRight = "6px";
            button.style.marginLeft = "6px";
            button.style.marginRight = "6px";
            button.style.cursor = "pointer";
            button.style.backgroundColor = config.bgColor;
            button.style.boxShadow = "0px 0px 8px " + config.shadowColor;
            button.style.borderRadius = "6px";
            button.style.border = config.bgColor + " 3px solid";
            button.style.cssFloat = "right";
            
            OwOpet.util.addMouseEnterListen(button, function (e) {
                button.style.border = config.focusColor + " 3px solid";
            });
            OwOpet.util.addMouseLeaveListen(button, function (e) {
                button.style.border = config.bgColor + " 3px solid";
            });
            
            return button;
        }
        menu.addDefaultButtonStyle(defaultButton);
        
        //切换按钮面板
        menu.changePanel = function(panel) {
            menuDiv.innerHTML = "";
            menuDiv.appendChild(panel);
            if (showed) {
                //调整位置
                showed = false;
                menuDiv.remove();
                menu.show();
            }
        };
        defaultButton.onclick = function(e) {
            var aboutDiv = document.createElement("div");
            aboutDiv.textContent = "info";
            menu.changePanel(aboutDiv);
        }
        
        //添加按钮
        menu.add = function (button) {
            menuPanel.appendChild(button);
        };
        menu.add(OwOpet.chat.getPanel());
        menu.add(document.createElement("br"));
        menu.add(defaultButton);
        
        var coord;
        //跟随
        menu.follow = function (coordX, coordY) {
            coord = [coordX, coordY];
            
            if (!config.autoHide) OwOpet.menu.show();
            else if (showed)
            {
                menuDiv.remove();
                showed = false;
                menu.show();
            }
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
            
            menuDiv.style.left = coord[0] - 0.5 * menuDiv.clientWidth + "px";
            menuDiv.style.top = coord[1] - 0.5 * menuDiv.clientHeight + "px";
            
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
                alpha -= 2;
                menuDiv.style.filter = 'alpha(opacity='+alpha+')';
                menuDiv.style.opacity = alpha / 100;
                
                if (alpha < 0) {
                    menuDiv.innerHTML = "";
                    menuDiv.remove();
                    menuDiv.appendChild(menuPanel);
                }
                else OwOpet.util.requestAnimationFrame(hide);
            }());
        };
        
        //鼠标进入
        OwOpet.util.addMouseEnterListen(menuDiv, function (e) {
            OwOpet.menu.show();
        });
        //鼠标点击
        menuDiv.onclick = function (e) {
            //todo
        };
        //鼠标离开
        OwOpet.util.addMouseLeaveListen(menuDiv, function (e) {
            if (config.autoHide) OwOpet.menu.hide();
            else OwOpet.util.log("Lose focus", "Menu doesn't hide, config is always show");
        });
        
        //默认添加的按钮组
        (function () {
            //隐藏宠物
            if (config.defaultButtons.hideButton.showed) (function () {
                var hideButton = document.createElement("p");
                hideButton.textContent = "hide";
                hideButton.onclick = function (e) {
                    var byePanel = document.createElement("div");
                    byePanel.textContent = config.defaultButtons.hideButton.bye;
                    menu.changePanel(menu.addDefaultButtonStyle(byePanel));
                    OwOpet.hide();
                    
                    var showButton = document.createElement("div");
                    showButton.textContent = "show pet";
                    menu.addDefaultButtonStyle(showButton);
                    showButton.style.position = "fixed";
                    showButton.style.right = "0px";
                    showButton.style.bottom = "0px";
                    showButton.style.margin = "6px";
                    showButton.onclick = function (e) {
                        OwOpet.show();
                        showButton.remove();
                        
                        var hiPanel = document.createElement("div");
                        hiPanel.textContent = config.defaultButtons.hideButton.hello;
                        menu.changePanel(menu.addDefaultButtonStyle(hiPanel));
                        OwOpet.menu.show();
                        setTimeout(function () {
                            if (config.autoHide) OwOpet.menu.hide();
                            else menu.changePanel(menuPanel); 
                        }, 1000);
                    }
                    setTimeout(function () {
                        showed = false;
                        menuDiv.innerHTML = "";
                        menuDiv.remove();
                        menuDiv.appendChild(menuPanel);
                        document.body.appendChild(showButton);
                    }, 1000);
                }
                OwOpet.menu.add(menu.addDefaultButtonStyle(hideButton));
            }());
        }());
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
    
    /** 为按钮添加默认样式 */
    OwOpet.menu.addDefaultButtonStyle = protect(function (button) {
        return menu.addDefaultButtonStyle(button);
    });
    
    /** 切换整个按钮面板 */
    OwOpet.menu.changePanel = protect(function (panel) {
        return menu.changePanel(panel);
    });
    
    /** 添加新的按纽 */
    OwOpet.menu.add = protect(function (button) {
        return menu.add(button);
    });
    
    /** 显示 */
    OwOpet.menu.show = protect(function () {
        return menu.show();
    });
    
    /** 隐藏 */
    OwOpet.menu.hide = protect(function () {
        return menu.hide();
    });
    
    /** 跟随 */
    OwOpet.menu.follow = protect(function (coordX, coordY) {
        return menu.follow(coordX, coordY);
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


/** OwOpet.chat 聊天模块 */
(function () {
    var config = OwOpet.chat.config;
    
    OwOpet.chat.getPanel = function () {
        var panelDiv = document.createElement("div");
        panelDiv.style.maxWidth = config.maxWidth;
        panelDiv.style.display = "inline-block";
        panelDiv.style.padding = "6px";
        panelDiv.style.backgroundColor = config.bgColor;
        panelDiv.style.boxShadow = "0px 0px 8px " + config.shadowColor;
        panelDiv.style.borderRadius = "6px";
            
        panelDiv.className = config.class;  //允许用户自定义的class
        
        panelDiv.textContent = config.defaultWords[0];
        
        return panelDiv;
    };
}());

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