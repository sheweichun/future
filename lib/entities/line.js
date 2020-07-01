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
import { Entity } from './entity';
import { completeOptions } from '../utils/index';
var DEFAULT_LINESTYLE = {
    lineStyle: '#cccccc'
};
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(start, end, options) {
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.end = end;
        _this._options = completeOptions(options || {}, DEFAULT_LINESTYLE);
        return _this;
    }
    Line.prototype.draw = function (drawer) {
        var context = drawer.context;
        var _a = this, start = _a.start, end = _a.end, _options = _a._options;
        context.save();
        _options.lineStyle && (context.strokeStyle = _options.lineStyle);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
        context.restore();
    };
    Line.prototype.changeX = function (x) {
        var _a = this, start = _a.start, end = _a.end;
        start.x += x;
        end.x += x;
    };
    Line.prototype.changeY = function (y) {
        var _a = this, start = _a.start, end = _a.end;
        start.y += y;
        end.y += y;
    };
    return Line;
}(Entity));
export { Line };
