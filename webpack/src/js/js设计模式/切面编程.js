/*
  aop: 面向切面编程（AOP）：它所面对的是处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果(目的是降低耦合)。
    装饰器适合处理跨越多个模块的功能，如日志记录、权限检查、性能监控等。通过将这些横切关注点从核心业务逻辑中分离出来，使代码更加模块化和可维护
*/

Function.prototype.after = function (action) {
    //保留当前函数，这里this指向运行函数即clickHandler
    var func = this;
    // return 被包装过的函数，这里就可以执行其他功能了。
    // 并且该方法挂在Function.prototype上，
    // 被返回的函数依然具有after属性,可以链式调用
    return function () {
        // 原函数执行，这里不考虑异步
        var result = func.apply(this, arguments);
        // 执行之后的操作
        action.apply(this, arguments);
        // 将执行结果返回
        return result;
    };
};
// before 实现类似，只不过执行顺序差别而已
Function.prototype.before = function (action) {
    var func = this;
    return function () {
        // action 是核心业务逻辑之外的其余逻辑，示例中代表
        action.apply(this, arguments);
        // func 是核心业务逻辑，示例中代表clickHandler
        return func.apply(this, arguments);
    };
};

const logger = (s) => {
    console.log(s, ">>>日志")
}
const perform = (s) => {
    console.log(s, ">>>性能")
}
const doSomething = () => {
    console.log('doSomething')
}
let clickHandler = () => {
    doSomething()
}
clickHandler = clickHandler.before(() => logger('1')).after(perform)
clickHandler() // 执行结果和预期一致





// gulux中应用 => node
// 1. BFF在生成配置化dsl时候通过劫持api的生命周期注入全局状态，写入日志

/**
 * withBefore
 * 装饰器：为函数增加前置逻辑（不改原接口），支持同步/异步
 * @param {Function} action 前置逻辑函数
 * @returns {(fn:Function)=>Function} 装饰器
 */
function withBefore(action) {
    return function (fn) {
        return function (...args) {
            const r = action.apply(this, args)
            if (r && typeof r.then === 'function') {
                return r.then(() => fn.apply(this, args))
            }
            return fn.apply(this, args)
        }
    }
}

/**
 * withAfter
 * 装饰器：为函数增加后置逻辑（不改原接口），支持同步/异步
 * @param {Function} action 后置逻辑函数
 * @returns {(fn:Function)=>Function} 装饰器
 */
function withAfter(action) {
    return function (fn) {
        return function (...args) {
            const res = fn.apply(this, args)
            if (res && typeof res.then === 'function') {
                return res.then((v) => {
                    action.apply(this, args)
                    return v
                }).catch((e) => {
                    action.apply(this, args)
                    throw e
                })
            }
            action.apply(this, args)
            return res
        }
    }
}

/**
 * composeDecorators
 * 组合多个装饰器：从右到左依次包裹
 * @param  {...Function} decorators 装饰器列表
 * @returns {(fn:Function)=>Function} 组合装饰器
 */
function composeDecorators(...decorators) {
    return function (fn) { return decorators.reduceRight((acc, d) => d(acc), fn) }
}

// 装饰器方式重写示例（等价于 before/after 链式）
const clickHandlerDecorated = composeDecorators(
    withAfter(perform),
    withBefore(() => logger('1'))
)(clickHandler)

// 执行结果保持一致
clickHandlerDecorated()

