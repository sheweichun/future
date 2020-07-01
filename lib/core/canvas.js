import { completeOptions } from '../utils/index';
import hidpi, { getRatio } from './hidpi';
var DEFAULT_OPTION = {};
var Canvas = /** @class */ (function () {
    function Canvas(_el, option) {
        this._el = _el;
        this._options = completeOptions(option, DEFAULT_OPTION);
        this.context = _el.getContext('2d');
        this.resize();
    }
    Canvas.prototype.getLineWidth = function () {
        return this.context.lineWidth * this._radio;
    };
    Canvas.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.resize = function () {
        var _el = this._el;
        var rect = _el.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this._radio = getRatio(this.context);
        hidpi(_el, this.width, this.height, this._radio);
    };
    return Canvas;
}());
export default Canvas;
