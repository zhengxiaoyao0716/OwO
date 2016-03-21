var OwOpet = {
    info: {
        name: "OwO",
        gender: "boy",
        birth: "2016/3/6",
        master: "zhengxiaoya0716"
    },
    config: {
        image: "./static/image/feihe.png",
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
        }
    },
    develop: {
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


/** OwOpet.develop 开发辅助 */
(function () {
    var config = OwOpet.develop.config;
    var workspace = console;
    
    //保护性装饰器
    function protect(allow, func) {
        if (allow) return func;
        else return function () {};
    }
    
    /** 一般信息 */
    OwOpet.develop.log = protect(config.log, function (flag, message) {
        workspace.log("[log]\t" + flag + ": " + message);
    });
    
    /** 调试信息 */
    OwOpet.develop.debug = protect(config.debug, function (flag, message) {
        workspace.debug("[debug]\t" + flag + ": " + message);
    });
    
    /** 提示信息 */
    OwOpet.develop.info = protect(config.info, function (flag, message) {
        workspace.info("[info]\t" + flag + ": " + message);
    });
    
    /** 警告信息 */
    OwOpet.develop.warn = protect(config.warn, function (flag, message) {
        workspace.warn("[warn]\t" + flag + ": " + message);
    });
    
    /** 错误信息 */
    OwOpet.develop.error = protect(config.error, function (flag, message) {
        workspace.error("[error]\t" + flag + ": " + message);
    });
    
    /** 信息组 */
    OwOpet.develop.group = function (content) { workspace.group(content); };
    OwOpet.develop.groupEnd = function (content) { workspace.groupEnd(content); };
    
    /** 步进监视 */
    OwOpet.develop.monitor = (function () {
        if (!config.monitor) return function () {};
        
        //输出日志装饰器
        function decorate(context, func, title) {
            return function () {
                var result;
                
                OwOpet.develop.group(title);
                OwOpet.develop.debug("Func status", "begin");
                
                try {
                    result = func.apply(context, arguments);
                } catch (e) {
                    OwOpet.develop.error(e.name, e.message);
                    OwOpet.develop.warn("Func status", "error!");
                } finally {
                    OwOpet.develop.debug("Func status", "fin");
                    OwOpet.develop.groupEnd();
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
}());


/** OwOpet 主体模块 */
(function () {
    var pet;
    /** 召唤 */
    OwOpet.call = function () {
        if (pet)
        {
            OwOpet.develop.warn("IllegalState", "Already called.");
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
                OwOpet.develop.warn("IllegalState", "Already showed.");
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
                OwOpet.develop.warn("IllegalState", "Already hided.");
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
                OwOpet.develop.warn("IllegalState", "Can not resized when hided.");
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
            
            OwOpet.menu.hide();
        };
        pet.resize();
        
        petDiv.style.cursor = 'url("' + OwOpet.config.cursor + '"), url("http://os.zheng0716.com/static/image/OwO_simple.ico"), auto';
        petDiv.title = OwOpet.config.title;
        var pressed = false;
        var offset = [0, 0];
        petDiv.onmousedown = function (e) {   
            pressed = OwOpet.config.draggable && true;
            offset[0] = e.pageX - coord[0];
            offset[1] = e.pageY - coord[1];
        };
        var moved = false;
        petDiv.onmousemove = function (e) {
            if (!pressed) return;
            moved = true;
            coord[0] = e.pageX - offset[0];
            coord[1] = e.pageY - offset[1];
            petDiv.style.left = coord[0] + "px";
            petDiv.style.top = coord[1] + "px";
        };
        petDiv.onmouseleave = function (e) {    
            pressed = false;
        };
        petDiv.onmouseup = function (e) {
            pressed = false;
            if (moved)
            {
                moved = false;
                return;
            }
            var perX = (e.layerX || e.offsetX) / petDiv.clientWidth;
            var perY = (e.layerY || e.offsetY) / petDiv.clientHeight;
            
            OwOpet.menu.show();
        };
        
        OwOpet.menu.init();
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!pet)
            {
                OwOpet.develop.warn("IllegalState", "Not called yet.");
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
    
    /** 释放 */
    OwOpet.free = protect(function () {
        OwOpet.hide();
        pet = undefined;
        
        OwOpet.menu.release();
    });
    
    /** 归位 */
    OwOpet.resize = protect(function () {
        return pet.resize();
    });
    
    //监视
    OwOpet.develop.monitor(OwOpet, "OwOpet");
}());


/** OwOpet.menu 菜单模块 */
(function () {
    var menu;
    
    /** 初始化 */
    OwOpet.menu.init = function () {
        if (menu)
        {
            OwOpet.develop.warn("IllegalState", "Menu has already init.");
            return;
        }
        menu = {};
        
        var menuDiv = document.createElement("div");
        //添加
        menu.add = function (image) {
            //todo
        };
        
        var showed;
        //显示
        menu.show = function () {
            if (showed)
            {
                OwOpet.develop.warn("IllegalState", "Menu has already showed.");
                return;
            }
            
            showed = true;
        };
        
        //隐藏
        menu.hide = function () {
            if (showed)
            {
                OwOpet.develop.warn("IllegalState", "Menu has already hided.");
                return;
            }
            
            showed = false;
        };
    };
    
    //保护性装饰器
    function protect(func) {
        return function () {
            if (!menu)
            {
                OwOpet.develop.warn("IllegalState", "Menu has not inited yet.");
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
    
    /** 释放 */
    OwOpet.menu.release = protect(function () {
        OwOpet.menu.hide();
        menu = undefined;
    });
    
    //监视
    OwOpet.develop.monitor(OwOpet.menu, "OwOpet.menu");
}());


/** window 窗口配置 */
(function () {
    var timeout;
    window.addEventListener("resize", function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            OwOpet.develop.log("debounce", "resize();");
            
            OwOpet.resize();
            timeout = undefined;
        }, 250);
    });
}());