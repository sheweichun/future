import { completeOptions } from '../utils/index';
var DEFAULT_OPTIONS = {};
var Render = /** @class */ (function () {
    function Render(el, options) {
        this.el = el;
        this._options = completeOptions(options, DEFAULT_OPTIONS);
    }
    return Render;
}());
export { Render };
