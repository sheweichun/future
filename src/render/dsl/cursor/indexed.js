import {Seq} from 'immutable';
import Base from './base';
import {updateCursor} from './util';

function Indexed(rootData, keyPath, updater, deref, prototype, size) {
  Base.call(this, rootData, keyPath, updater, deref, prototype, size);
}

Indexed.prototype = Object.create(Seq.Indexed.prototype);
Object.assign(Indexed.prototype, Base.prototype);

Indexed.prototype.push = function() {
  const prevArguments = arguments
  return updateCursor(this, m => m.push.apply(m, prevArguments));
};

Indexed.prototype.pop = function() {
  return updateCursor(this, m => m.pop());
};

Indexed.prototype.unshift = function() {
  const prevArguments = arguments
  return updateCursor(this, m => m.unshift.apply(m, prevArguments));
};

Indexed.prototype.shift = function() {
  return updateCursor(this, m => m.shift());
};

Indexed.prototype.toString = function() {
  return this.__toString('Cursor [', ']');
};

export default Indexed;