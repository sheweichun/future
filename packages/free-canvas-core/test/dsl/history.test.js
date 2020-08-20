"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../../src/render/dsl/history");
test('history undo', function () {
    var h = new history_1.History({ a: 3 });
    h.push({ a: 4 });
    h.push({ a: 5 });
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.undo();
    expect(h.currentState.a).toEqual(3);
});
test('history redo', function () {
    var h = new history_1.History({ a: 3 });
    h.push({ a: 4 });
    h.push({ a: 5 });
    h.undo();
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(4);
    h.redo();
    expect(h.currentState.a).toEqual(5);
});
test('history undo push undo', function () {
    var h = new history_1.History({ a: 3 });
    h.push({ a: 4 });
    h.push({ a: 5 });
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(5);
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.push({ a: 6 });
    h.undo();
    expect(h.currentState.a).toEqual(4);
});
test('history undo push redo', function () {
    var h = new history_1.History({ a: 3 });
    h.push({ a: 4 });
    h.push({ a: 5 });
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(5);
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.push({ a: 6 });
    h.redo();
    expect(h.currentState.a).toEqual(6);
});
