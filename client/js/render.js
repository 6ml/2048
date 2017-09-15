// 初始化 canvas 数据
export function initArr(context) {
    var cellArr = [],
        localData = window.localStorage.getItem('data');

    if(localData) {
        cellArr = JSON.parse(localData);
        for(var i = 0; i < cellArr.length; i++) {
            for(var j = 0; j < cellArr[i].length; j++) {
                cellArr[i][j].cxt = context;
                cellArr[i][j].animation = false;
            }
        }
        draw(cellArr);

        return cellArr;
    }

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

    return cellArr;
}

// keydown 事件处理程序
export function handleKeyDown (event, arr) {
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;

    switch (keyCode) {

    case 37:
        move('left', arr);
        e.preventDefault();
        e.returnValue = false;
        break;
    case 38:
        move('top', arr);
        e.preventDefault();
        e.returnValue = false;
        break;
    case 39:
        move('right', arr);
        e.preventDefault();
        e.returnValue = false;
        break;
    case 40:
        move('bottom', arr);
        e.preventDefault();
        e.returnValue = false;
        break;
    default:
        break;

    }
    
}

// 渲染背景
export function renderBg (cxt) {
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

// 移动 -> 合并
export function move(direction, arr) {
    var _shouldRender = [],
        _needSort,
        _canMerge;
    switch (direction) {
    case 'left':
        arr = arr.map((col) => {
            _needSort = sort(col);
            _canMerge  = merge(col);
            _shouldRender.push(!_needSort && !_canMerge ? false : true);
            return col;
        });
        _shouldRender.reduce(add) && render(arr);
        break;
    case 'right':
        arr = arr.map((col) => {
            _needSort = sort(col.reverse());
            _canMerge  = merge(col, arr);
            _shouldRender.push(!_needSort && !_canMerge ? false : true);
            return col.reverse();
        });
        _shouldRender.reduce(add) && render(arr);
        break;
    case 'top':
        arr = changeDirection(arr);
        arr = arr.map((col) => {
            _needSort = sort(col);
            _canMerge  = merge(col, arr);
            _shouldRender.push(!_needSort && !_canMerge ? false : true);
            return col;
        });
        arr = changeDirection(arr);
        _shouldRender.reduce(add) && render(arr);
        break;
    case 'bottom':
        arr = changeDirection(arr);
        arr = arr.map((col) => {
            _needSort = sort(col.reverse());
            _canMerge  = merge(col, arr);
            _shouldRender.push(!_needSort && !_canMerge ? false : true);
            return col.reverse();
        });
        arr = changeDirection(arr);
        _shouldRender.reduce(add) && render(arr);
        break;
    default:
        break;
    }
}

// 相加，用于 reduce
function add(a, b) {
    return a + b;
}

// 改变二维数组方向
function changeDirection(arr) {
    var temp,
        animation,
        res = arr.map((item) => {
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

// 将数组排序，若前面为空，补位
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

    return _needSort;
}

// 合并动画
function animation(obj, arr) {
    var _obj = JSON.parse(JSON.stringify(obj));
    new Promise(function(resolve) {
        var timer = setInterval(() => {
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
    }).then(() => {
        update(arr);
    });
}

// 合并
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

// 渲染
function render (arr) {
    init(arr);
    draw(arr);
}

// 将每个小格子画出来
function draw(arr) {
    arr.forEach((col) => {
        col.forEach((item) => {
            if(item.animation) {
                animation(item, arr);
            } else{
                drawCell(item);
            }
        });
    });

    window.localStorage.setItem('data', JSON.stringify(arr));

    if(isOver(arr)) {
        restart(arr);
    }
}

// 更新canvas 画布内容
function update (arr) {
    var cxt = arr[0][0].cxt;
    cxt.clearRect(0, 0, 520, 520);
    renderBg(cxt);

    arr.forEach((col) => {
        col.forEach((item) => {
            drawCell(item);
        });
    });
}

// 画单个方格
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

// 根据 number 获取对应的背景颜色
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
        break;
    case 1024:
        color = '#edc53f';
        break;
    case 2048:
        color = '#e9ca21';
        break;
    default:
        color = '#ccc0b3';
    }
    return color;
}

// 根据 number 获取字体颜色
function getNumberColor(number) {
    if (number <= 4) {
        return '#776e50';
    }
    return '#ffffff';
}

// 根据 number 获取字体大小
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

// 初始化二维数组
function init(arr) {
    var first = Math.floor(Math.random() * 4);
    var second = Math.floor(Math.random() * 4);
    if(arr[first][second].number === 0) {
        arr[first][second].number = Math.random() > 0.9 ? 4 : 2;
    } else {
        return init(arr);
    }
}

// 判断二维数组是否全部占满
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

// 判断游戏结束
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

    if(_isOver && window.score > window.highestScore) {
        window.highestScore = window.score;
    }

    return _isOver;
}

// 重新开始
export function restart(arr) {
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < arr[i].length; j++) {
            arr[i][j].number = 0;
        }
    }

    window.score = 0;

    render(arr);
}