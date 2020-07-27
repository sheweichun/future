import {History} from '../../src/render/dsl/history';




test('history undo',()=>{
    const h = new History({a:3});
    h.push({a:4});
    h.push({a:5});
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.undo();
    expect(h.currentState.a).toEqual(3);
})

test('history redo',()=>{
    const h = new History({a:3});
    h.push({a:4});
    h.push({a:5});
    h.undo();
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(4);
    h.redo();
    expect(h.currentState.a).toEqual(5);
})

test('history undo push undo',()=>{
    const h = new History({a:3});
    h.push({a:4});
    h.push({a:5});
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(5);
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.push({a:6})
    h.undo();
    expect(h.currentState.a).toEqual(4);
})

test('history undo push redo',()=>{
    const h = new History({a:3});
    h.push({a:4});
    h.push({a:5});
    h.undo();
    h.redo();
    expect(h.currentState.a).toEqual(5);
    h.undo();
    expect(h.currentState.a).toEqual(4);
    h.push({a:6})
    h.redo();
    expect(h.currentState.a).toEqual(6);
})