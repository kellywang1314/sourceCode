// compose函数: 就是将几个有特点的函数拼凑在一起, 让它们结合， 产生一个崭新的函数: const compose = (f,g) => (...arg) => f(g(...arg))
function compose() {
    var fns = [...arguments]
    return function (initialArg) {
        var res = initialArg
        for (var i = fns.length - 1; i > -1; i--) {
            res = fns[i](res)
        }
        return res
    }
}


function compose(...fn) {
    if (!fn.length) return (v) => v;
    if (fn.length === 1) return fn[0];
    return fn.reduce(
      (pre, cur) =>
        (...args) =>
          pre(cur(...args))
    )
}


// 测试用例
let toUpperCase = (x) => x.toUpperCase()
let exclaim = (x) => x + '!';
compose(toUpperCase,exclaim)('hello world')


// compose是很多中间件的原理，比如redux和koa的中间件

// very good
function compose(){
    let funcs = [...arguments]
    return function(){
        let res = [...arguments]
        for(let i=funcs.length-1;i>=0;i--){
            res = funcs[i](res)
        }
        return res
    }
}
