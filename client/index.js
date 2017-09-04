import 'normalize.css';

var score = 0;

window.onload = () => {
    var canvas = document.createElement('canvas');

    document.getElementById('root').appendChild(canvas);

    canvas.id = 'canvas';

    if (canvas.getContext('2d')) {
        var context = canvas.getContext('2d');
    } else {
        alert('您的浏览器不支持 Canvas 的浏览，请升级您的浏览器或者更换更高级的浏览器已达到最好的浏览效果！');
    }

    canvas.width = 520;
    canvas.height = 520;

    context.beginPath();
    context.lineJoin = 'round';
    context.moveTo(15, 15);
    context.lineTo(505, 15);
    context.lineTo(505, 505);
    context.lineTo(15, 505);
    context.lineTo(15, 15);
    context.lineWidth = 10;
    context.strokeStyle = '#bbada0';
    context.fillStyle = '#bbada0';

    context.stroke();
    context.fill();
    context.closePath();

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
                bottom: 125 + i * (100 + 20)
            };
        }
    }

    render(cellArr);

    addEvent(document.documentElement, 'keydown', function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;

        switch (keyCode) {

        case 37:
            move('left', cellArr);
            break;
        case 38:
            move('top', cellArr);
            break;
        case 39:
            move('right', cellArr);
            break;
        case 40:
            move('bottom', cellArr);
            break;
        default:
            break;

        }
    });
};

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
            _canMerge  = merge(col);
            _isRender.push(!_needSort && !_canMerge ? false : true);
            return col.reverse();
        });
        _isRender.reduce(add) && render(arr);
        break;
    case 'top':
        arr = changeDirection(arr);
        arr = arr.map(function(col) {
            _needSort = sort(col);
            _canMerge  = merge(col);
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
            _canMerge  = merge(col);
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
        res = arr.map(function(item) {
            return item;
        });

    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < i; j++) {
            temp = arr[j][i].number;
            arr[j][i].number = res[i][j].number;
            res[i][j].number = temp;
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

    return _needSort;
}

function merge(arr) {
    var _canMerge = false;

    for(var i = 0; i < arr.length; i++) {
        var _isEqual = false;
        _isEqual = arr[i + 1] && (arr[i].number === arr[i + 1].number) && arr[i].number;
        if(_isEqual) {
            arr[i].number *= 2;
            score += arr[i].number;
            arr[i + 1].number = 0;
            _canMerge = true;

            sort(arr);
            i++;
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
            drawCell(item);
        });
    });

    if(isOver(arr)) {
        alert('over');
    }
}


function drawCell(cellObj) {
    cellObj.color = getNumberBackgroundColor(cellObj.number);

    cellObj.cxt.lineWidth = 10;
    cellObj.cxt.strokeStyle = cellObj.color;
    cellObj.cxt.fillStyle = cellObj.color;

    cellObj.cxt.beginPath();
    cellObj.cxt.moveTo(cellObj.left, cellObj.top);
    cellObj.cxt.lineTo(cellObj.right, cellObj.top);
    cellObj.cxt.lineTo(cellObj.right, cellObj.bottom);
    cellObj.cxt.lineTo(cellObj.left, cellObj.bottom);
    cellObj.cxt.lineTo(cellObj.left, cellObj.top);

    cellObj.cxt.stroke();
    cellObj.cxt.fill();

    cellObj.cxt.font = getNumberSize(cellObj.number) + 'px arial bolder';
    cellObj.cxt.textAlign = 'center';
    cellObj.cxt.textBaseline = 'middle';
    cellObj.cxt.fillStyle = getNumberColor(cellObj.number);

    cellObj.cxt.fillText(cellObj.number, (cellObj.left + cellObj.right) / 2, (cellObj.top + cellObj.bottom) / 2);
    cellObj.cxt.closePath();
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
        if(Math.random() < 0.5) {
            arr[first][second].number = 2;
        } else {
            arr[first][second].number = 4;
        }
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