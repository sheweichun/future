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
import { DrawEntity, Point } from '../entities/index';
import { completeOptions, controlDelta } from '../utils/index';
import { Ruler } from './ruler';
import { CanvasEvent } from '../core/event';
var DEFAULT_OPTIONS = {
    length: 5
};
var RulerGroup = /** @class */ (function (_super) {
    __extends(RulerGroup, _super);
    function RulerGroup(drawer, options) {
        var _this = _super.call(this, drawer) || this;
        var _drawer = _this._drawer;
        _this._options = completeOptions(options, DEFAULT_OPTIONS);
        var _a = _this._options, lineStyle = _a.lineStyle, length = _a.length, rulerBackgroundColor = _a.rulerBackgroundColor;
        var halfLineWidth = _drawer.getLineWidth() / 2;
        _this._topRuler = new Ruler({
            start: new Point(20 - halfLineWidth, halfLineWidth),
            size: length - halfLineWidth * 2,
            backgroundColor: rulerBackgroundColor,
            lineStyle: lineStyle,
            end: new Point(_drawer.width, halfLineWidth)
        });
        _this._leftRuler = new Ruler({
            isVertical: true,
            start: new Point(halfLineWidth, 20 - halfLineWidth),
            size: length - halfLineWidth * 2,
            lineStyle: lineStyle,
            backgroundColor: rulerBackgroundColor,
            end: new Point(halfLineWidth, _drawer.height)
        });
        return _this;
    }
    RulerGroup.prototype.onMousewheel = function (deltaX, deltaY, repaint) {
        var shouldUpdate = false;
        if (deltaX != 0) {
            this._topRuler.changeValue(deltaX);
            shouldUpdate = true;
        }
        if (deltaY != 0) {
            this._leftRuler.changeValue(deltaY);
            shouldUpdate = true;
        }
        shouldUpdate && repaint();
    };
    RulerGroup.prototype.fireEvent = function (name, e, repaint) {
        switch (name) {
            case CanvasEvent.MOUSEWHEEL:
                var _a = this._options, wheelSpeedX = _a.wheelSpeedX, wheelSpeedY = _a.wheelSpeedY;
                var deltaX = e.deltaX, deltaY = e.deltaY;
                this.onMousewheel(controlDelta(deltaX, wheelSpeedX), controlDelta(deltaY, wheelSpeedY), repaint);
        }
    };
    RulerGroup.prototype.draw = function (drawer) {
        this._topRuler.draw(drawer);
        this._leftRuler.draw(drawer);
    };
    return RulerGroup;
}(DrawEntity));
export { RulerGroup };
