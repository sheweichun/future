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
import { Line } from '../entities/index';
import { completeOptions } from '../utils/index';
var DEFAULT_OPTION = {
    fontSize: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    padding: 5,
    color: '#333'
};
var VLabel = /** @class */ (function (_super) {
    __extends(VLabel, _super);
    function VLabel(start, end, options) {
        var _this = _super.call(this, start, end, completeOptions(options, DEFAULT_OPTION)) || this;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    VLabel.prototype.draw = function (drawer) {
        var _a = this, start = _a.start, _options = _a._options;
        var _b = _options, fontSize = _b.fontSize, fontStyle = _b.fontStyle, color = _b.color, fontFamily = _b.fontFamily, fontWeight = _b.fontWeight, value = _b.value, padding = _b.padding;
        var context = drawer.context;
        _super.prototype.draw.call(this, drawer);
    };
    return VLabel;
}(Line));
var HLabel = /** @class */ (function (_super) {
    __extends(HLabel, _super);
    function HLabel(start, end, options) {
        var _this = _super.call(this, start, end, completeOptions(options, DEFAULT_OPTION)) || this;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    HLabel.prototype.draw = function (drawer) {
        _super.prototype.draw.call(this, drawer);
        var _a = this, start = _a.start, end = _a.end, _options = _a._options;
        var _b = _options, fontSize = _b.fontSize, fontStyle = _b.fontStyle, color = _b.color, fontFamily = _b.fontFamily, fontWeight = _b.fontWeight, value = _b.value, padding = _b.padding;
        var context = drawer.context;
        _super.prototype.draw.call(this, drawer);
        context.save();
        context.font = fontStyle + " " + fontWeight + " " + fontSize + " " + fontFamily;
        context.fillStyle = color;
        context.fillText(value, start.x + padding, end.y + padding * 2);
        context.restore();
    };
    return HLabel;
}(Line));
export function createLabel(start, end, options) {
    if (options.isVertical) {
        return new VLabel(start, end, options);
    }
    return new HLabel(start, end, options);
}
