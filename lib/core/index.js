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
import Canvas from './canvas';
import { RulerGroup, Content } from '../components/index';
import { completeOptions } from '../utils/index';
import { CanvasEvent, EventHandler } from './event';
var DEFAULT_OPTIONS = {
    wheelSpeedX: 5,
    wheelSpeedY: 8,
    data: null
};
function createCanvas(parent) {
    var canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('style', 'width:100%;height:100%;position:absolute;pointer-events:none');
    parent.appendChild(canvasEl);
    return canvasEl;
}
var Core = /** @class */ (function (_super) {
    __extends(Core, _super);
    function Core(el, options) {
        var _this = _super.call(this) || this;
        _this._mouseWheelList = [];
        _this.margin = 20;
        _this._options = completeOptions(options, DEFAULT_OPTIONS);
        _this.initEl(el);
        var _a = _this._options, wheelSpeedX = _a.wheelSpeedX, wheelSpeedY = _a.wheelSpeedY, rulerBackgroundColor = _a.rulerBackgroundColor;
        // const x = 219
        // var line = new Line(new Point(x,0),new Point(x,this._canvas.height),{lineStyle:null});
        // line.draw(this._canvas);
        _this._rulerGroup = new RulerGroup(_this._canvas, {
            length: _this.margin,
            wheelSpeedX: wheelSpeedX,
            wheelSpeedY: wheelSpeedY,
            rulerBackgroundColor: rulerBackgroundColor
        });
        _this._mouseWheelList.push(_this._rulerGroup);
        _this.draw = _this.draw.bind(_this);
        _this.listen();
        _this.draw();
        return _this;
    }
    Core.prototype.draw = function () {
        var _this = this;
        if (this._drawTimeId != null)
            return;
        this._drawTimeId = setTimeout(function () {
            _this._canvas.clear();
            _this._rulerGroup.draw(_this._canvas);
            _this._drawTimeId = null;
        });
    };
    Core.prototype.createEventElement = function (parent, children) {
        var _a = this._options, wheelSpeedX = _a.wheelSpeedX, wheelSpeedY = _a.wheelSpeedY, data = _a.data;
        var div = document.createElement('div');
        div.setAttribute('style', "width:100%;height:100%;position:absolute;padding:" + this.margin + "px 0 0 " + this.margin + "px");
        var contentDiv = document.createElement('div');
        this._content = new Content(contentDiv, data, {
            wheelSpeedX: wheelSpeedX, wheelSpeedY: wheelSpeedY
        });
        this._mouseWheelList.push(this._content);
        var fragment = document.createDocumentFragment();
        if (children) {
            for (var i = 0; i < children.length; i++) {
                fragment.appendChild(children[i]);
            }
        }
        fragment.appendChild(contentDiv);
        div.appendChild(fragment);
        parent.appendChild(div);
        this._eventEl = div;
        // this._eventHandler = new EventHandler(div);
    };
    Core.prototype.initEl = function (el) {
        this._parentEl = document.getElementById(el);
        var fragment = document.createDocumentFragment();
        this.createEventElement(fragment, this._parentEl.children);
        this._rootEl = createCanvas(fragment); //顺序不能错
        this._parentEl.appendChild(fragment);
        this._canvas = new Canvas(this._rootEl, this._options.canvas);
    };
    Core.prototype.listen = function () {
        var _this = this;
        this._mouseWheelList.forEach(function (ett) {
            _this.addEvent(_this._eventEl, CanvasEvent.MOUSEWHEEL, function (e) {
                ett.fireEvent(CanvasEvent.MOUSEWHEEL, e, _this.draw);
                e.stopPropagation();
                e.preventDefault();
            });
        });
    };
    return Core;
}(EventHandler));
export default Core;
