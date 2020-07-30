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


// 测试用例
let toUpperCase = (x) => x.toUpperCase()
let exclaim = (x) => x + '!';
compose(toUpperCase,exclaim)('hello world')


// compose是很多中间件的原理，比如redux和koa的中间件
