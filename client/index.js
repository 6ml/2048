import 'normalize.css';
import './css/index.css';

window.onload = () => {
    var canvas = document.createElement('canvas');

    canvas.id = 'canvas';

    document.getElementById('root').appendChild(canvas);

    if (canvas.getContext('2d')) {
        var context = canvas.getContext('2d');
    } else {
        alert('您的浏览器不支持 Canvas 的浏览，请升级您的浏览器或者更换更高级的浏览器已达到最好的浏览效果！');
    }

    Object.defineProperty(window, 'score', {
        get: function() {
            return this._score || 0;
        },
        set: function(val) {
            this._score = val;
            document.getElementById('score').innerHTML = val;
        }
    });

    document.getElementById('score').innerHTML = window.score;

    canvas.width = 520;
    canvas.height = 520;

    renderBg(context);

    var cellArr = [];
    for (var i = 0; i < 4; i++) {
        cellArr[i] = [];
        for (var j = 0; j < 4; j++) {
            cellArr[i][j] = {
                cxt: context,
                number: 0,
                left: 35 + j * (100 + 20),
                top: 35 + i * (100 + 20),
                right: 125 + j * (100 + 20),
                bottom: 125 + i * (100 + 20),
                alpha: 1,
                animation: false
            };
        }
    }

    render(cellArr);

    addEvent(document.documentElement, 'keydown', throttle(handleKeyDown, 50, 120, cellArr));
};

function handleKeyDown (event, arr) {
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;

    switch (keyCode) {

    case 37:
        move('left', arr);
        break;
    case 38:
        move('top', arr);
        break;
    case 39:
        move('right', arr);
        break;
    case 40:
        move('bottom', arr);
        break;
    default:
        break;

    }
}

function renderBg (cxt) {
    cxt.beginPath();
    cxt.lineJoin = 'round';
    cxt.moveTo(15, 15);
    cxt.lineTo(505, 15);
    cxt.lineTo(505, 505);
    cxt.lineTo(15, 505);
    cxt.lineTo(15, 15);
    cxt.lineWidth = 10;
    cxt.strokeStyle = '#bbada0';
    cxt.fillStyle = '#bbada0';

    cxt.stroke();
    cxt.fill();
    cxt.closePath();
}

function move(direction, arr) {
    var _isRender = [],
        _needSort,
        _canMerge;
    switch (direction) {
    case 'left':
        arr = arr.map(function(col) {
            _needSort = sort(col);
            _canMerge  = merge(col);
            _isRender.push(!_needSort && !_canMerge ? false : true);
            return col;
        });
        _isRender.reduce(add) && render(arr);
        break;
    case 'right':
        arr = arr.map(function(col) {
            _needSort = sort(col.reverse());
            _canMerge  = merge(col, arr);
            _isRender.push(!_needSort && !_canMerge ? false : true);
            return col.reverse();
        });
        _isRender.reduce(add) && render(arr);
        break;
    case 'top':
        arr = changeDirection(arr);
        arr = arr.map(function(col) {
            _needSort = sort(col);
            _canMerge  = merge(col, arr);
            _isRender.push(!_needSort && !_canMerge ? false : true);
            return col;
        });
        arr = changeDirection(arr);
        _isRender.reduce(add) && render(arr);
        break;
    case 'bottom':
        arr = changeDirection(arr);
        arr = arr.map(function(col) {
            _needSort = sort(col.reverse());
            _canMerge  = merge(col, arr);
            _isRender.push(!_needSort && !_canMerge ? false : true);
            return col.reverse();
        });
        arr = changeDirection(arr);
        _isRender.reduce(add) && render(arr);
        break;
    default:
        break;
    }
}

function add(a, b) {
    return a + b;
}

function changeDirection(arr) {
    var temp,
        animation,
        res = arr.map(function(item) {
            return item;
        });

    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < i; j++) {
            temp = arr[j][i].number;
            arr[j][i].number = res[i][j].number;
            res[i][j].number = temp;
            animation = arr[j][i].animation;
            arr[j][i].animation = res[i][j].animation;
            res[i][j].animation = animation;
        }
    }

    return res;
}

function sort(arr) {
    var temp, _needSort = false;

    for(var i = 0; i < arr.length; i++) {
        if(arr[i].number === 0) {
            for(var j = i; j < arr.length; j++) {
                if(arr[j].number !== 0) {
                    temp = arr[i].number;
                    arr[i].number = arr[j].number;
                    arr[j].number = temp;
                    _needSort = true;
                    break;
                }
            }
        }
    }

    // merge(arr);

    return _needSort;
}

function animation(obj, arr) {
    var _obj = JSON.parse(JSON.stringify(obj));
    new Promise(function(resolve) {
        var timer = setInterval(function() {
            var cxt = obj.cxt;
            cxt.clearRect(obj.left - 5, obj.top - 5, obj.right - obj.left + 10, obj.bottom - obj.top + 10);
            obj.left--;
            obj.top--;
            obj.right++;
            obj.bottom++;
            obj.alpha -= 0.01;
            drawCell(obj);
            if(obj.right - _obj.right >= 10) {
                clearInterval(timer);
                obj.left = _obj.left;
                obj.right = _obj.right;
                obj.top = _obj.top;
                obj.bottom = _obj.bottom;
                obj.alpha = _obj.alpha;
                obj.animation = !_obj.animation;
                obj.cxt.globalAlpha = obj.alpha;
                resolve();
            }
        }, 10);
    }).then(function() {
        update(arr);
    });
}

function merge(col) {
    var _canMerge = false;

    for(var i = 0; i < col.length; i++) {
        var _isEqual = false;
        _isEqual = col[i + 1] && (col[i].number === col[i + 1].number) && col[i].number;
        if(_isEqual) {
            col[i].number *= 2;
            window.score += col[i].number;
            col[i].animation = true;
            col[i + 1].number = 0;
            _canMerge = true;

            sort(col);
        }
    }

    return _canMerge;
}

function addEvent(obj, type, fn) {
    if(document.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else {
        obj.attachEvent('on' + type, fn);
    }
}

function render (arr) {
    init(arr);

    arr.forEach(function(col) {
        col.forEach(function(item) {
            if(item.animation) {
                animation(item, arr);
            } else{
                drawCell(item);
            }
        });
    });

    if(isOver(arr)) {
        alert('over');
    }
}

function update (arr) {
    var cxt = arr[0][0].cxt;
    cxt.clearRect(0, 0, 520, 520);
    renderBg(cxt);

    arr.forEach(function(col) {
        col.forEach(function(item) {
            drawCell(item);
        });
    });
}


function drawCell(cellObj) {
    var cxt = cellObj.cxt;
    cellObj.color = getNumberBackgroundColor(cellObj.number);

    cxt.lineWidth = 10;
    cxt.strokeStyle = cellObj.color;
    cxt.fillStyle = cellObj.color;

    cxt.beginPath();
    cxt.moveTo(cellObj.left, cellObj.top);
    cxt.lineTo(cellObj.right, cellObj.top);
    cxt.lineTo(cellObj.right, cellObj.bottom);
    cxt.lineTo(cellObj.left, cellObj.bottom);
    cxt.lineTo(cellObj.left, cellObj.top);
    cxt.globalAlpha = cellObj.alpha;

    cxt.stroke();
    cxt.fill();

    cxt.font = getNumberSize(cellObj.number) + 'px arial bolder';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillStyle = getNumberColor(cellObj.number);

    cxt.fillText(cellObj.number, (cellObj.left + cellObj.right) / 2, (cellObj.top + cellObj.bottom) / 2);
    cxt.closePath();
}

function getNumberBackgroundColor(number) {
    var color = 'black';
    switch (number) {

    case 2:
        color = '#eee4da';
        break;
    case 4:
        color = '#ede0c8';
        break;
    case 8:
        color = '#f2b179';
        break;
    case 16:
        color = '#f59563';
        break;
    case 32:
        color = '#f67c5f';
        break;
    case 64:
        color = '#f65e3b';
        break;
    case 128:
        color = '#edcf72';
        break;
    case 256:
        color = '#edcc61';
        break;
    case 512:
        color = '#edc850';
        // 阴影
        // 0 0 30px 10px rgba(243, 215, 116, 0.39683), inset 0 0 0 1px rgba(255, 255, 255, 0.2381)
        break;
    case 1024:
        color = '#edc53f';
        // box-shadow
        // 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571)
        break;
    case 2048:
        color = '#e9ca21';
        break;
    default:
        color = '#ccc0b3';
    }
    return color;
}

function getNumberColor(number) {
    if (number <= 4) {
        return '#776e50';
    }
    return '#ffffff';
}

function getNumberSize(number) {
    if(number < 2) {
        return 0;
    } else if(number < 10) {
        return 50;
    } else if(number < 100) {
        return 43;
    } else if(number < 1000) {
        return 35;
    } else {
        return 30;
    }
}

function init(arr) {
    // if(judgeFull(arr)) return;

    var first = Math.floor(Math.random() * 4);
    var second = Math.floor(Math.random() * 4);
    if(arr[first][second].number === 0) {
        arr[first][second].number = Math.random() > 0.9 ? 4 : 2;
    } else {
        return init(arr);
    }
}

function judgeFull(arr) {
    var _isFull = true;

    outter:
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < arr[i].length; j++) {
            if(arr[i][j].number === 0) {
                _isFull = false;
                break outter;
            }
        }
    }

    return _isFull;
}

function isOver(arr) {
    var _isOver = true;

    if(!judgeFull(arr)) return;

    outter:
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < arr[i].length; j++) {
            var _equalTop = arr[i - 1] && (arr[i - 1][j].number === arr[i][j].number);
            var _equalLeft = arr[i][j - 1] && (arr[i][j - 1].number === arr[i][j].number);

            if(_equalLeft || _equalTop) {
                _isOver = false;
                break outter;
            }
        }
    }

    return _isOver;
}

function throttle(fn, delay, atLeast) {
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
                timeout = setTimeout(function() {
                    fn.apply(null, [event].concat(args));
                }, delay);
            })(args);
        }
    };
}
