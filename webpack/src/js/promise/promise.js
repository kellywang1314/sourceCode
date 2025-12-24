// 实现一个promsie：https://juejin.cn/post/6945319439772434469

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

// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      for (let item of this.onFulfilledCallbacks) {
        item(value);
      }
    }
  };

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };


  resolvePromise(promise2, x, resolve, reject) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    // if (promise2 === x) {
    //   return reject(
    //     new TypeError("Chaining cycle detected for promise #<Promise>")
    //   );
    // }
    // 判断x是不是 MyPromise 实例对象
    if (x instanceof MyPromise) {
      // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
      x.then(resolve, reject);
    } else {
      // 普通值
      resolve(x);
    }
  }
  

  then(onFulfilled, onRejected) {
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        setTimeout(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const rejectedMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        setTimeout(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = onRejected(this.reason);
            // 传入 resolvePromise 集中处理
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.status === REJECTED) {
        rejectedMicrotask();
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });

    return promise2;
  }
}

new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
.then((res) => {
  console.log(res);
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 500);
  });
})
.then((res) => {
  console.log(res);
});

