import { Model } from './model';
import { Moveable } from './movable';
var FragmentView = /** @class */ (function () {
    function FragmentView(_el) {
        this._el = _el;
        this.rootEl = document.createDocumentFragment();
    }
    FragmentView.prototype.appendChild = function (view) {
        this.rootEl.appendChild(view.getRoot());
    };
    FragmentView.prototype.getModel = function () {
        return Model.EmptyModel;
    };
    FragmentView.prototype.update = function () { };
    FragmentView.prototype.getFragmentAndChange = function () {
        var fragment = this.rootEl;
        this.rootEl = this._el;
        return fragment;
    };
    FragmentView.prototype.getRoot = function () {
        return this._el;
    };
    return FragmentView;
}());
export { FragmentView };
var View = /** @class */ (function () {
    function View(_model) {
        this._model = _model;
        var el = document.createElement(_model.tag);
        this.el = el;
        var elStyle = _model.attribute.style || {};
        this.topEl = new Moveable(el, {
            left: elStyle.left,
            top: elStyle.top
        });
        this.initAttribute();
    }
    View.prototype.getBoundingClientRect = function () {
        return this.topEl.getBoundingClientRect();
    };
    View.prototype.getModel = function () {
        return this._model;
    };
    View.prototype.initAttribute = function () {
        var _a = this, el = _a.el, _model = _a._model;
        var attribute = _model.attribute;
        Object.keys(attribute).forEach(function (name) {
            if (name === 'style') {
                var styleSheet_1 = attribute[name];
                Object.keys(styleSheet_1).forEach(function (styleName) {
                    //@ts-ignore
                    el.style[styleName] = styleSheet_1[styleName];
                });
                return;
            }
            el.setAttribute(name, attribute[name]);
        });
    };
    View.prototype.getRoot = function () {
        return this.topEl.el;
    };
    View.prototype.appendChild = function (view) {
        if (view == null)
            return;
        this.el.appendChild(view.getRoot());
    };
    View.prototype.update = function (model) {
        this._model = model;
    };
    return View;
}());
export { View };
export function createView(model) {
    return new View(model);
}
