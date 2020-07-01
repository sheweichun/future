var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CanvasEvent, EventHandler } from './event';
var KeyBoard = /** @class */ (function (_super) {
    __extends(KeyBoard, _super);
    function KeyBoard(_el) {
        var _this = _super.call(this) || this;
        _this._el = _el;
        _this._keyHandleCenter = {
            'metaKey+z': _this.undo,
            'metaKey+shiftKey+z': _this.redo
        };
        _el.tabIndex = -1000;
        _this.listen();
        return _this;
    }
    KeyBoard.prototype.undo = function () {
        console.log('undo1!');
    };
    KeyBoard.prototype.redo = function () {
        console.log('redo!');
    };
    KeyBoard.prototype.onKeyDown = function (e) {
        var key = e.key, metaKey = e.metaKey, shiftKey = e.shiftKey;
        var code = [metaKey ? 'metaKey+' : '', shiftKey ? 'shiftKey+' : '', key.toLowerCase()].join('');
        var target = this._keyHandleCenter[code];
        target && target();
        e.preventDefault();
        e.stopPropagation();
    };
    KeyBoard.prototype.listen = function () {
        this.addEvent(this._el, CanvasEvent.KEYDOWN, this.onKeyDown.bind(this));
    };
    return KeyBoard;
}(EventHandler));
export { KeyBoard };
