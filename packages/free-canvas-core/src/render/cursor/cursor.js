/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {valToKeyPath, makeCursor} from './util';
import createAtom from '../atom/atom'
// import createAtom from 'atom-store';

function cursorFrom(data, keyPath, prototype, onChange) {
  const atom = createAtom(data);
  if (arguments.length === 1) {
    keyPath = [];
  } else if (typeof keyPath === 'function') {
    onChange = keyPath;
    keyPath = [];
  } else {
    keyPath = valToKeyPath(keyPath);
  }

  if (typeof onChange !== 'undefined') {
    atom.watch(onChange);
  }

  const cursor = makeCursor(data, keyPath, atom.write,atom.read,prototype);
  // ret.reset(); 
  cursor._atom_reset = atom.clear;
  return cursor;
}

// function cursorFrom(rootData, keyPath, prototype, onChange) {
//   if (arguments.length === 1) {
//     keyPath = [];
//   } else if (typeof keyPath === 'function') {
//     onChange = keyPath;
//     keyPath = [];
//   } else {
//     keyPath = valToKeyPath(keyPath);
//   }
//   return makeCursor(rootData, keyPath, onChange, ()=>rootData, prototype);
// }

exports.from = cursorFrom;