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
import { Entity, Point, Line, Rect } from '../entities/index';
import { completeOptions } from '../utils/index';
import { createLabel } from './label';
var DEFAUL_OPTIONS = {
    isVertical: false,
    size: 22,
    base: 0,
    unit: 10
};
var RulerModel = /** @class */ (function () {
    function RulerModel() {
    }
    RulerModel.prototype.changeValue = function (val) {
        this._options.base += val;
        this.initEntities();
    };
    return RulerModel;
}());
var VerticalRulerModel = /** @class */ (function (_super) {
    __extends(VerticalRulerModel, _super);
    function VerticalRulerModel(_options) {
        var _this = _super.call(this) || this;
        _this._options = _options;
        _this.initEntities();
        return _this;
    }
    VerticalRulerModel.prototype.initEntities = function () {
        var _options = this._options;
        var start = _options.start, end = _options.end, base = _options.base, size = _options.size, unit = _options.unit, backgroundColor = _options.backgroundColor;
        var baseRemain = base % unit;
        var baseDiff = unit - baseRemain;
        // this._base = baseRemain === 0 ? base : (base + diff);
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        var lineOpt = {
            lineStyle: _options.lineStyle,
        };
        this.entities = [
            new Line(start, end, lineOpt),
            new Line(start.addX(size), end.addX(size), lineOpt),
            new Rect({
                x: start.x,
                y: start.y,
                color: backgroundColor,
                width: size,
                height: end.y - start.y
            })
        ];
        var startY = start.y;
        var baseY = startY + (this._base - base);
        for (var y = baseY; y <= end.y; y += unit) {
            var interval = size - 5, entity = void 0;
            var curVal = y - baseY + this._base;
            if (curVal % 200 === 0) {
                interval = 0;
                entity = createLabel(new Point(start.x + size, y), new Point(start.x + interval, y), {
                    isVertical: false,
                    value: curVal + '',
                    lineStyle: lineOpt.lineStyle
                });
            }
            else {
                entity = new Line(new Point(start.x + size, y), new Point(start.x + interval, y), lineOpt);
            }
            this.entities.push(entity);
        }
    };
    return VerticalRulerModel;
}(RulerModel));
var HorizontalRulerModel = /** @class */ (function (_super) {
    __extends(HorizontalRulerModel, _super);
    function HorizontalRulerModel(_options) {
        var _this = _super.call(this) || this;
        _this._options = _options;
        _this.initEntities();
        return _this;
    }
    HorizontalRulerModel.prototype.initEntities = function () {
        var _options = this._options;
        var start = _options.start, end = _options.end, base = _options.base, size = _options.size, unit = _options.unit, backgroundColor = _options.backgroundColor;
        var baseRemain = base % unit;
        var baseDiff = unit - baseRemain;
        this._base = baseRemain === 0 ? base : (baseRemain > 0 ? base + baseDiff : base - baseRemain);
        var lineOpt = {
            lineStyle: _options.lineStyle
        };
        this.entities = [
            new Line(start, end, lineOpt),
            new Line(start.addY(size), end.addY(size), lineOpt),
            new Rect({
                x: start.x,
                y: start.y,
                width: end.x - start.x,
                color: backgroundColor,
                height: size
            })
        ];
        var startX = start.x;
        var baseX = startX + (this._base - base);
        for (var x = baseX; x <= end.x; x += unit) {
            var interval = size - 5, entity = void 0;
            var curVal = x - baseX + this._base;
            if (curVal % 200 === 0) {
                interval = 0;
                entity = createLabel(new Point(x, start.y + size), new Point(x, start.y + interval), {
                    isVertical: false,
                    value: curVal + '',
                    lineStyle: lineOpt.lineStyle
                });
            }
            else {
                entity = new Line(new Point(x, start.y + size), new Point(x, start.y + interval), lineOpt);
            }
            this.entities.push(entity);
        }
    };
    return HorizontalRulerModel;
}(RulerModel));
function createRulerModel(options) {
    if (options.isVertical) {
        return new VerticalRulerModel(options);
    }
    return new HorizontalRulerModel(options);
}
var Ruler = /** @class */ (function (_super) {
    __extends(Ruler, _super);
    function Ruler(options) {
        var _this = _super.call(this) || this;
        _this._rulerModel = createRulerModel(completeOptions(options, DEFAUL_OPTIONS));
        return _this;
    }
    Ruler.prototype.changeValue = function (val) {
        this._rulerModel.changeValue(val);
    };
    Ruler.prototype.draw = function (drawer) {
        this._rulerModel.entities.forEach(function (entity) {
            entity.draw(drawer);
        });
    };
    return Ruler;
}(Entity));
export { Ruler };
