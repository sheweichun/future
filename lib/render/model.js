var Model = /** @class */ (function () {
    function Model(tag, attribute, children) {
        this.tag = tag;
        this.attribute = attribute;
        this.children = children;
    }
    Model.EmptyModel = new Model(null, null, null);
    return Model;
}());
export { Model };
