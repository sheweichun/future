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
var Entity = /** @class */ (function () {
    function Entity() {
    }
    Entity.prototype.change = function (timestamp) { };
    Entity.prototype.size = function (width, height) { };
    Entity.prototype.fireEvent = function (name, e, repaint) { };
    return Entity;
}());
export { Entity };
var DrawEntity = /** @class */ (function (_super) {
    __extends(DrawEntity, _super);
    function DrawEntity(_drawer) {
        var _this = _super.call(this) || this;
        _this._drawer = _drawer;
        return _this;
    }
    return DrawEntity;
}(Entity));
export { DrawEntity };
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.getDistance = function (point) {
        return Math.abs(Math.sqrt(Math.pow(point.y - this.y, 2) + Math.pow(point.x - this.x, 2)));
    };
    Point.prototype.getYDistance = function (point) {
        return Math.abs(point.y - this.y);
    };
    Point.prototype.getXDistance = function (point) {
        return Math.abs(point.x - this.x);
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.addX = function (x) {
        return new Point(this.x + x, this.y);
    };
    Point.prototype.addY = function (y) {
        return new Point(this.x, this.y + y);
    };
    return Point;
}());
export { Point };
