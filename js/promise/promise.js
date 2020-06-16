//实现一个promsie：https://segmentfault.com/a/1190000009478377

// 第一版promise: then是用来注册promise异步操作完成之后的回调函数；resolve用来把异步执行数据给到回调函数执行
function Promise(fn) {
    var value = null, callbacks = []  
    this.then = function (onFulfilled) {
        callbacks.push(onFulfilled)
        return this
    }
    function resolve(value) {
        callbacks.forEach(function (callback) {
            callback(value)
        })
    }
    fn(resolve)
}

// 第二版promise：如果resolve在then执行该怎么控制？ 答案就是增加延时机制

function Promise(fn) {
    var value = null, callbacks = []  
    this.then = function (onFulfilled) {
        callbacks.push(onFulfilled)
    }
    function resolve(value) {
        setTimeout(function() {
            callbacks.forEach(function (callback) {
                callback(value)
            })
        }, 0)
    }
    fn(resolve)
}


// 第三版promsie：第二版如果Promise异步操作已经成功，在异步操作成功之前注册的回调都会执行，但是在Promise异步操作成功这之后调用的then注册的回调就再也不会执行了(不理解)？增加状态
function Promise(fn) {
    var value = null, callbacks = [], state = 'pending'
    this.then = function (onFulfilled) {
        if (state === 'pending') {
            callbacks.push(onFulfilled)
            return this
        }
        onFulfilled(value)
        return this
    }
    function resolve(newValue) {
        value = newValue
        state = 'fulfilled'
        setTimeout(function() {
            callbacks.forEach(function (callback) {
                callback(value)
            })
        }, 0)
    }
    fn(resolve)
}


// 第四版promise：支持链式调用？ then方法里面return一个promise
function Promise(fn) {
    var state = 'pending',
        value = null,
        callbacks = [];

    this.then = function (onFulfilled) {
        return new Promise(function (resolve) {
            handle({
                onFulfilled: onFulfilled || null,
                resolve: resolve
            });
        });
    };

    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback);
            return;
        }
        //如果then中没有传递任何东西
        if(!callback.onFulfilled) {
            callback.resolve(value);
            return;
        }

        var ret = callback.onFulfilled(value);
        callback.resolve(ret);
    }
    
    function resolve(newValue) {
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve);
                return;
            }
        }
        state = 'fulfilled';
        value = newValue;
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }

    fn(resolve);
}


// 第五版promise：补充上失败的处理和异常处理
function Promise(fn) {
    var state = 'pending',
        value = null,
        callbacks = [];

    this.then = function (onFulfilled, onRejected) {
        return new Promise(function (resolve, reject) {
            handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    };

    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback);
            return;
        }

        var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
            ret;
        if (cb === null) {
            cb = state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(value);
            return;
        }
        try {
            ret = cb(value);
            callback.resolve(ret);
        } catch (e) {
            callback.reject(e);
        } 
    }

    function resolve(newValue) {
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve, reject);
                return;
            }
        }
        state = 'fulfilled';
        value = newValue;
        execute();
    }

    function reject(reason) {
        state = 'rejected';
        value = reason;
        execute();
    }

    function execute() {
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }

    fn(resolve, reject);
}




