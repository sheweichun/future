// import {Store} from '../../../src/render/dsl/store';
var Store = require('../../../lib/render/dsl/store').Store;
test('store', function () {
    var s = new Store({
        a: 3,
        b: 4,
        c: {
            age: 100
        }
    }, {
        prototype: {
            hello: function () {
                console.log('a :', this.getIn(['c', 'age']));
                // console.log('hello:',this.updateIn(['c','age'],(old:any)=>{
                //     console.log('old :',old)
                //     return 12
                // }))
                console.log('hello :', this.getIn(['c']).updateIn(['age'], function (a, b, c) {
                    console.log('in update :', a, b, c);
                    return 199;
                }));
                console.log('after a :', this.getIn(['c', 'age']));
            }
        }
    });
    //@ts-ignore
    s.currentState.hello();
});
