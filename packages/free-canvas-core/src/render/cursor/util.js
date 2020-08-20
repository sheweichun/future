import {Collection as Iterable, Record, Map} from 'immutable';
import KeyedCursor from './keyed';
import IndexedCursor from './indexed';

function setProp(prototype, name) {
  Object.defineProperty(prototype, name, {
    get: function() {
      return this.get(name);
    },
    set: function() {
      if (!this.__ownerID) {
        throw new Error('Cannot set on an immutable record.');
      }
    }
  });
}

export function defineRecordProperties(cursor, value) {
  try {
    value._keys.forEach(setProp.bind(undefined, cursor));
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}
// IndexedCursor.prototype = Object.create(Object.assign(Cursor.prototype, prototype))
// KeyedCursor.prototype = Object.create(Object.assign(Cursor.prototype, prototype))

export function makeCursor(rootData, keyPath, updater, deref, prototype ,value) {
  if (arguments.length < 6) {
    value = rootData.getIn(keyPath);
  }
  const size = value && value.size;
  const Cursor = Iterable.isIndexed(value) ? IndexedCursor : KeyedCursor;
  // Cursor.prototype = Object.create(Object.assign(Cursor.prototype, prototype));
  const cursor = new Cursor(rootData, keyPath, updater, deref, prototype, size);

  if (value instanceof Record) {
    defineRecordProperties(cursor, value);
  }

  return cursor;
}

export function listToKeyPath(list) {
  return Array.isArray(list) ? list : Iterable(list).toArray();
}

export function newKeyPath(head, tail) {
  return head.concat(listToKeyPath(tail));
}

export function valToKeyPath(val) {
  if (Array.isArray(val)) {
    return val;
  } else {
    if (Iterable.isIterable(val)) {
      return val.toArray();
    } else {
      return val || [];
    }
  }
}

export function subCursor(cursor, keyPath, value) {
  // if (arguments.length < 3) {
  //   return makeCursor( // call without value
  //     cursor._rootData,
  //     newKeyPath(cursor._keyPath, keyPath),
  //     cursor._updater,
  //     cursor._deref,
  //     cursor._prototype
  //   );
  // }
  return makeCursor(
    cursor._rootData,
    newKeyPath(cursor._keyPath, keyPath),
    cursor._updater,
    cursor._deref,
    cursor._prototype,
    value
  );
}

export function updateCursor(cursor, changeFn, keyPath) {
  const deepChange = arguments.length > 2;
  // console.log('_keyPath :',cursor._keyPath,keyPath,cursor._deref().toJS());
  // console.log('before update :',cursor._deref().getIn(cursor._keyPath).toJS().extra);
  const updateFn = (oldState) => {
    const ret = oldState.updateIn(
      cursor._keyPath,
      deepChange ? Map() : undefined,
      changeFn
    );
    return ret;
  }
  return makeCursor(
    cursor._updater(updateFn, newKeyPath(cursor._keyPath, keyPath)),
    cursor._keyPath,
    cursor._updater,
    cursor._deref,
    cursor._prototype
    
  );
}

// export function updateCursor(cursor, changeFn, changeKeyPath) {
//   var deepChange = arguments.length > 2;
//   var newRootData = cursor._rootData.updateIn(
//     cursor._keyPath,
//     deepChange ? Map() : undefined,
//     changeFn
//   );
//   var keyPath = cursor._keyPath || [];
//   var result = cursor._onChange && cursor._onChange.call(
//     undefined,
//     newRootData,
//     cursor._rootData,
//     deepChange ? newKeyPath(keyPath, changeKeyPath) : keyPath
//   );
//   if (result !== undefined) {
//     newRootData = result;
//   }
//   return makeCursor(newRootData, cursor._keyPath, cursor._onChange, null, cursor.store);
// }

export function wrappedValue(cursor, keyPath, value) {
  return Iterable.isIterable(value) ? subCursor(cursor, keyPath, value) : value;
}