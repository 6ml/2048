import 'normalize.css';
import './css/index.scss';
import {isPC, addEvent, throttle} from './js/tools';
import {handleKeyDown, renderBg, initArr, move, restart} from './js/render';
import touch from 'touchjs';

window.onload = () => {
    // 创建 Canvas 并插入到 DOM 中
    let canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    document.getElementById('root').appendChild(canvas);
    canvas.width = 520;
    canvas.height = 520;

    let context;

    // 获取 context
    if (canvas.getContext('2d')) {
        context = canvas.getContext('2d');
        window.localStorage.setItem('context', context);
    } else {
        alert('您的浏览器不支持 Canvas 的浏览，请升级您的浏览器或者更换更高级的浏览器已达到最好的浏览效果！');
    }

    // 创建 score 属性 getter setter
    Object.defineProperty(window, 'score', {
        get: function() {
            return this._score || +window.localStorage.getItem('score') || 0;
        },
        set: function(val) {
            this._score = val;
            window.localStorage.setItem('score', val);
            document.getElementById('score').innerHTML = val;
        }
    });

    // 创建 highestScore 属性 getter setter
    Object.defineProperty(window, 'highestScore', {
        get: function() {
            return this._highestScore || +window.localStorage.getItem('highestScore') || 0;
        },
        set: function(val) {
            this._highestScore = val;
            window.localStorage.setItem('highestScore', val);
            document.getElementById('highestScore').innerHTML = val;
        }
    });

    window.highestScore = +window.localStorage.getItem('highestScore') || 0;

    document.getElementById('score').innerHTML = window.score;

    // 渲染背景
    renderBg(context);

    // 初始化 canvas 数据
    let cellArr = initArr(context);

    // 判断是桌面端还是手机端，绑定对应事件
    if(isPC()) {

        // PC端事件绑定
        // 绑定键盘输入事件，根据键盘 keycode 判断对应操作
        addEvent(document.documentElement, 'keydown', throttle(handleKeyDown, 70, 150, cellArr));

        // 绑定重新开始事件
        addEvent(document.getElementById('restart'), 'click', function() {
            restart(cellArr);
        });
    } else {

        // 移动端事件绑定
        // 绑定手指向左滑动事件
        touch.on(document.getElementById('canvas'), 'swipeleft', function(ev) {
            move('left', cellArr);
            ev.originEvent.preventDefault();
        });

        // 绑定手指向右滑动事件
        touch.on(document.getElementById('canvas'), 'swiperight', function(ev) {
            move('right', cellArr);
            ev.originEvent.preventDefault();
        });

        // 绑定手指向上滑动事件
        touch.on(document.getElementById('canvas'), 'swipeup', function(ev) {
            move('top', cellArr);
            ev.originEvent.preventDefault();
        });

        // 绑定手指向下滑动事件
        touch.on(document.getElementById('canvas'), 'swipedown', function(ev) {
            move('bottom', cellArr);
            ev.originEvent.preventDefault();
        });

        // 绑定重新开始事件
        touch.on(document.getElementById('restart'), 'tap', function() {
            restart(cellArr);
        });
    }
};
