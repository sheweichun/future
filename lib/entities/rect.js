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
    color: 'white'
};
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(options) {
        var _this = _super.call(this) || this;
        _this._options = completeOptions(options || {}, DEFAULT_LINESTYLE);
        return _this;
    }
    Rect.prototype.draw = function (drawer) {
        var context = drawer.context;
        var _a = this._options, x = _a.x, y = _a.y, width = _a.width, height = _a.height, color = _a.color;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
    };
    return Rect;
}(Entity));
export { Rect };
