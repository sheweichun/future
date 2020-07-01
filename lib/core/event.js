export var CanvasEvent;
(function (CanvasEvent) {
    CanvasEvent["MOUSEWHEEL"] = "mousewheel";
    CanvasEvent["CLICK"] = "click";
    CanvasEvent["MOUSEDOWN"] = "mousedown";
    CanvasEvent["MOUSEMOVE"] = "mousemove";
    CanvasEvent["MOUSEUP"] = "mouseup";
    CanvasEvent["FOUCS"] = "focus";
    CanvasEvent["BLUR"] = "blur";
    CanvasEvent["KEYDOWN"] = "keydown";
    CanvasEvent["KEYUP"] = "keyup";
})(CanvasEvent || (CanvasEvent = {}));
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this._listeners = [];
    }
    EventHandler.prototype.addEvent = function (el, name, func) {
        this._listeners.push({
            name: name,
            listener: func,
            el: el
        });
        el.addEventListener(name, func);
    };
    EventHandler.prototype.destroy = function () {
        this._listeners.forEach(function (item) {
            item.el.removeEventListener(item.name, item.listener);
        });
    };
    return EventHandler;
}());
export { EventHandler };
