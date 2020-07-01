import { completeOptions, controlDelta } from '../utils/index';
import { CanvasEvent } from './event';
import { createViewModel } from '../render/index';
import { KeyBoard } from './keyboard';
var Content = /** @class */ (function () {
    function Content(_el, _data, options) {
        var _this = this;
        this._el = _el;
        this._data = _data;
        this._options = completeOptions(options, { x: 0, y: 0 });
        this._x = this._options.x;
        this._y = this._options.y;
        this.setStyle();
        this._viewModels = createViewModel(null, _data, _el);
        this._keyboard = new KeyBoard(_el);
        setTimeout(function () {
            _data.push({
                //@ts-ignore
                id: '112',
                tag: 'div',
                attribute: {
                    style: {
                        left: '800px',
                        top: '400px',
                        width: '150px',
                        height: '150px',
                        backgroundColor: 'orange'
                    }
                }
            });
            _this._viewModels.update(_data);
        }, 2000);
    }
    Content.prototype.setStyle = function () {
        var _a = this, _el = _a._el, _x = _a._x, _y = _a._y;
        _el.setAttribute('style', "outline:none !important;background:#dddddd;width:100%;height:100%;transform:translate3d(" + _x + "px," + _y + "px,0)");
    };
    Content.prototype.onMousewheel = function (deltaX, deltaY) {
        // console.log('on mouse!! :',deltaX,deltaY,this._x,this._y);
        this._x += -deltaX;
        this._y += deltaY;
        this.setStyle();
    };
    Content.prototype.fireEvent = function (name, e, repaint) {
        switch (name) {
            case CanvasEvent.MOUSEWHEEL:
                var _a = this._options, wheelSpeedX = _a.wheelSpeedX, wheelSpeedY = _a.wheelSpeedY;
                var _b = e, deltaX = _b.deltaX, deltaY = _b.deltaY;
                this.onMousewheel(controlDelta(deltaX, wheelSpeedX), controlDelta(deltaY, wheelSpeedY));
        }
    };
    return Content;
}());
export { Content };
