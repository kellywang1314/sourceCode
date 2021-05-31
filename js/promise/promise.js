// 实现一个promsie：https://juejin.cn/post/6945319439772434469
// 适合面试中写的promsie, 主要是能实现then链式调用，参考https://juejin.im/post/5e6f4579f265da576429a907
  function Promise(fn) {
    this.cbs = [];
    const resolve = (value) => {
      setTimeout(() => {
        this.data = value;
        this.cbs.forEach((cb) => cb(value));
      });
    }
    fn(resolve)
  }
  
  Promise.prototype.then = function (onResolved) {
    return new Promise((resolve) => {
      this.cbs.push(() => {
        const res = onResolved(this.data);
        if (res instanceof Promise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      })
    })
  }


// 测试用例
new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 500);
  })
    .then((res) => {
      console.log(res)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2)
        }, 500);
      });
    })
    .then((res) => {
        console.log(res)
    });
  


   /*  Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
    Promise 会有三种状态
    
    Pending 等待
    Fulfilled 完成
    Rejected 失败 
    状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
    Promise 中使用 resolve 和 reject 两个函数来更改状态；
    then 方法内部做但事情就是状态判断
    
    如果状态是成功，调用成功回调函数
    如果状态是失败，调用失败回调函数
    
     */

// 同步  ===> 异步  ===> 添加多个then都能输出
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class myPromise {
    constructor(executor){
        // 1. 传入的执行器立即执行
        // 2. executor 传入 resolve 和 reject 方法
        executor(this.resolve,this.reject)
    }

    // 储存状态的变量，初始值是 pending
    status = PENDING
    // 成功之后的值
    value = null
    // 失败之后的原因
    reason = null
    // 存储成功回调函数
    onFulfilledCallbacks = []
    // 存储失败回调函数
    onRejectedCallback = []

    resolve = (value) => {
        if(this.status === PENDING){
            this.status = FULFILLED
            this.value = value
        }
        for(let i in  this.onFulfilledCallback ){
            this.onFulfilledCallback[i](value)
        }
       
    }

    reject = (reason) => {
        if(this.status === PENDING){
            this.status = REJECTED
            this.reason = reason
        }
        for(let i in  this.onRejectedCallback ){
            this.onRejectedCallback[i](value)
        }
    }

    then(onFulfilled, onRejected) {
        // 判断状态
        if (this.status === FULFILLED) {
          // 调用成功回调，并且把值返回
          onFulfilled(this.value)
        } else if (this.status === REJECTED) {
          // 调用失败回调，并且把原因返回
          onRejected(this.reason)
        }else if(this.status === PENDING){
            this.onFulfilledCallback.push(onFulfilled)
            this.onRejectedCallback.push(onRejected)
        }
    }
      
}




// 增加链式调用
class myPromise {
    constructor(executor){
        // 1. 传入的执行器立即执行
        // 2. executor 传入 resolve 和 reject 方法
        try{
            executor(this.resolve,this.reject)
        }catch(error){
            this.reject(error)
        }
    }

    // 储存状态的变量，初始值是 pending
    status = PENDING
    // 成功之后的值
    value = null
    // 失败之后的原因
    reason = null
    // 存储成功回调函数
    onFulfilledCallbacks = []
    // 存储失败回调函数
    onRejectedCallback = []

    resolve = (value) => {
        if(this.status === PENDING){
            this.status = FULFILLED
            this.value = value
        }
        for(let i in  this.onFulfilledCallback ){
            this.onFulfilledCallback[i](value)
        }
       
    }

    reject = (reason) => {
        if(this.status === PENDING){
            this.status = REJECTED
            this.reason = reason
        }
        for(let i in  this.onRejectedCallback ){
            this.onRejectedCallback[i](value)
        }
    }
    

    then(onFulfilled, onRejected) {
        const promise2 = new MyPromise((resolve, reject) => {
          if (this.status === FULFILLED) {
            // 创建一个微任务等待 promise2 完成初始化
            queueMicrotask(() => {
                // 获取成功回调函数的执行结果
                const x = onFulfilled(this.value)
                // 传入 resolvePromise 集中处理
                resolvePromise(promise2, x, resolve, reject)
              })  
          } else if (this.status === REJECTED) {
            onRejected(this.reason)
          } else if (this.status === PENDING) {
            this.onFulfilledCallbacks.push(onFulfilled)
            this.onRejectedCallbacks.push(onRejected)
          }
        }) 
        return promise2
      }
      
}

function resolvePromise(promise2, x, resolve, reject) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if(x instanceof MyPromise) {
      x.then(resolve, reject)
    } else{
      resolve(x)
    }
}

