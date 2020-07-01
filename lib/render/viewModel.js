import { View, FragmentView } from './view';
var ViewModelCollection = /** @class */ (function () {
    function ViewModelCollection(_parent, _models) {
        this._parent = _parent;
        this._models = _models;
        this.viewModelList = _models.map(function (model) {
            var viewModel = new ViewModel(new View(model), _parent);
            return viewModel;
        });
    }
    ViewModelCollection.prototype.update = function (newModels) {
        var index = 0;
        var newModelList = [];
        for (; index < this.viewModelList.length; index++) {
            var item = this.viewModelList[index];
            var newModel = newModels[index];
            if (newModel) {
                item.update(newModel);
                newModelList.push(item);
            }
            else {
                item.remove();
            }
        }
        this.viewModelList = newModelList;
        for (; index < newModels.length; index++) {
            var newModel = newModels[index];
            var newViewModel = new ViewModel(new View(newModel), this._parent);
            this.viewModelList.push(newViewModel);
        }
    };
    return ViewModelCollection;
}());
export { ViewModelCollection };
var ViewModel = /** @class */ (function () {
    function ViewModel(view, _parent) {
        this.view = view;
        this._parent = _parent;
        this.children = createViewModel(this, this.getModel().children);
        _parent && _parent.appendChild(this);
    }
    ViewModel.prototype.appendChild = function (viewModel) {
        this.view.appendChild(viewModel.view);
    };
    ViewModel.prototype.remove = function () {
    };
    ViewModel.prototype.getModel = function () {
        return this.view.getModel();
    };
    ViewModel.prototype.update = function (model) {
        if (model == null)
            return;
        this.view.update(model);
        if (this.children) {
            this.children.update(model.children);
        }
    };
    return ViewModel;
}());
export { ViewModel };
export function createViewModel(parent, models, mountNode) {
    if (models == null)
        return;
    var parentViewModel = parent || new ViewModel(new FragmentView(mountNode), null);
    var collection = new ViewModelCollection(parentViewModel, models);
    if (mountNode && parentViewModel.view instanceof FragmentView) {
        mountNode.appendChild(parentViewModel.view.getFragmentAndChange());
    }
    return collection;
}
