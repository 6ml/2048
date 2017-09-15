// 判断是否为桌面端
export function isPC() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);
    //跳转语句
    if (system.win || system.mac || system.xll) {
        return true; //是电脑
    } else {
        return false; //是手机
    }
}

// 判断是否为手机端
export function isMobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;  
    var u = navigator.userAgent;  
    if (null == u) {  
        return true;  
    }  
    var result = regex_match.exec(u);  
    if (null == result) {  
        return false;
    } else {  
        return true;
    }  
}

// 绑定事件
export function addEvent(obj, type, fn) {
    if(document.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else {
        obj.attachEvent('on' + type, fn);
    }
}

// 函数节流
export function throttle(fn, delay, atLeast) {
    var timeout = null,
        startTime = Date.now(),
        args = Array.prototype.slice.call(arguments, 3);

    return function (event) {
        var endTime = Date.now();
        clearTimeout(timeout);

        if(endTime - startTime >= atLeast) {
            fn.apply(null, [event].concat(args));
            startTime = endTime;
        } else {
            (function(event, args) {
                timeout = setTimeout(() => {
                    fn.apply(null, [event].concat(args));
                }, delay);
            })(args);
        }
    };
}