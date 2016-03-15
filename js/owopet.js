var OwOpet = {
    info: {
        name: "OwO",
        gender: "boy",
        birth: "2016/3/6",
        master: "zhengxiaoya0716"
    },
    config: {
        imgSrc: "./static/image/feihe.png",
        position: "fixed",
        coord: [-10, 10, 99],
        axis: [1, -1],
        cursor: "url(http://os.zheng0716.com/public/static/image/OwO.ico), auto",
        title: "Hi，我是萌宠OwO~",
        draggable: true
    }
};
/** 为OwOpet配置方法 */
(function () {
    var pet = undefined;
    /** 召唤 */
    OwOpet.call = function () {
        if (pet) return false;
        pet = {};
        
        var petImg = document.createElement("img");
        petImg.src = OwOpet.config.imgSrc;
        petImg.draggable = false;
        var petDiv = document.createElement("div");
        petDiv.appendChild(petImg);
        
        var showed = false;
        //显示
        pet.show = function () {
            if (showed) return false;
            
            document.body.appendChild(petDiv);
            showed = true;
        };
        pet.show();
        
        //隐藏
        pet.hide = function () {
            if (!showed) return false;
            
            petDiv.remove();
            showed = false;
        };
        
        var coord = OwOpet.config.coord.concat();
        //调整位置
        pet.resize = function () {
            if (!showed) return false;
            
            petDiv.style.position = OwOpet.config.position;
            coord = OwOpet.config.coord.concat();
            if (coord[0] < 0) coord[0] += document.body.clientWidth;
            if (coord[1] < 0) coord[1] += document.body.clientHeight;
            coord[0] -= (1 + OwOpet.config.axis[0]) * petDiv.clientWidth / 2;
            coord[1] -= (1 + OwOpet.config.axis[1]) * petDiv.clientHeight / 2;
            petDiv.style.left = coord[0] + "px";
            petDiv.style.top = coord[1] + "px";
            petDiv.style.zIndex = String(coord[2]);
        };
        pet.resize();
        window.addEventListener("resize", pet.resize);
        
        petDiv.style.cursor = OwOpet.config.cursor;
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
            //todo 点击处理
        };
    };

    /** 隐藏 */
    OwOpet.hide = function () {
        return pet.hide();
    };


    /** 显示 */
    OwOpet.show = function () {
        return pet.show();
    };


    /** 释放 */
    OwOpet.free = function () {
        if (!pet) return false;
        
        pet.hide();
        pet = undefined;
    }
    
    /** 归位 */
    OwOpet.resize = function () {
        return pet.resize();
    }
}());