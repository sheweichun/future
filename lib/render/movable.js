import { CanvasEvent } from '../core/event';
import { setStyle, px2Num } from '../utils/style';
import { completeOptions } from '../utils/index';
var DEFAULT_OPTIONS = {};
var tabIndex = 0;
var Moveable = /** @class */ (function () {
    function Moveable(child, options) {
        this.left = 0;
        this.top = 0;
        this._options = completeOptions(options, DEFAULT_OPTIONS);
        var _a = this._options, left = _a.left, top = _a.top;
        this.left = px2Num(left, 0);
        this.top = px2Num(top, 0);
        var div = document.createElement('div');
        div.tabIndex = tabIndex++;
        this.style = {
            position: 'absolute',
            outline: 'none',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'transparent'
        };
        this.setStyle(div);
        div.appendChild(child);
        this.el = div;
        this.listen();
    }
    Moveable.prototype.getBoundingClientRect = function () {
        return this.el.getBoundingClientRect();
    };
    Moveable.prototype.setStyle = function (el) {
        var target = el || this.el;
        this.style.left = this.left + "px";
        this.style.top = this.top + "px";
        setStyle(target, this.style);
    };
    Moveable.onDocMouseMove = function (e) {
        Moveable.onMouseMoveQueue.forEach(function (callback) {
            callback(e);
        });
    };
    Moveable.addGloablEvent = function (name, callback, fireEl) {
        fireEl.addEventListener(name, callback);
    };
    Moveable.prototype.addEvent = function (name, callback, fireEl) {
        var el = fireEl || this.el;
        el.addEventListener(name, callback);
    };
    Moveable.prototype.onFoucs = function (e) {
        this.style.borderColor = 'blue';
        this.setStyle();
    };
    Moveable.prototype.onBlur = function (e) {
        this.style.borderColor = 'transparent';
        this.setStyle();
    };
    Moveable.prototype.listen = function () {
        this.addEvent(CanvasEvent.MOUSEDOWN, this.onMouseDown.bind(this));
        this.addEvent(CanvasEvent.FOUCS, this.onFoucs.bind(this));
        this.addEvent(CanvasEvent.BLUR, this.onBlur.bind(this));
        Moveable.onMouseMoveQueue.push(this.onMouseMove.bind(this));
        this.addEvent(CanvasEvent.MOUSEUP, this.onMouseUp.bind(this));
    };
    Moveable.prototype.onMouseDown = function (e) {
        this.canMove = true;
        var x = e.x, y = e.y;
        this.startX = x;
        this.startY = y;
        e.stopPropagation();
    };
    Moveable.prototype.onMouseMove = function (e) {
        if (!this.canMove)
            return;
        var x = e.x, y = e.y;
        this.left += x - this.startX;
        this.top += y - this.startY;
        this.startX = x;
        this.startY = y;
        this.setStyle();
    };
    Moveable.prototype.onMouseUp = function (e) {
        this.canMove = false;
    };
    Moveable.onMouseMoveQueue = [];
    return Moveable;
}());
export { Moveable };
Moveable.addGloablEvent(CanvasEvent.MOUSEMOVE, Moveable.onDocMouseMove, document.body);
