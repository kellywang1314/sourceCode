/**
 * finally
 * Promise.prototype.finally 的简易实现：无论前序 Promise 成功或失败，都会执行回调
 * - 回调不接收上一个结果，仅用于清理副作用
 * - 使用 Promise.resolve 包装回调返回值，保证以微任务串行执行
 * - 保持链值不变：成功时返回原 value，失败时重新抛出原 err
 * @param {() => any} callback 清理函数（不会修改链值）
 * @returns {Promise<any>} 链式 Promise
 */
Promise.prototype.finally = function (callback) {
    return this.then(
        // fulfilled 分支：执行 callback 后继续传递原 value
        (value) => {
            return Promise.resolve(callback()).then(() => value)
        },
        // rejected 分支：执行 callback 后继续抛出原错误
        (err) => {
            return Promise.resolve(callback()).then(() => { throw err })
        }
    )
}

// finally 成功或者失败都会执行
export function promiseFinally(promise, onFinally) {
    // 回调包装成一个 Promise，确保异步执行
    const handler = () => Promise.resolve(onFinally());
    return promise.then(
        (val) => handler().then(() => val),
        (err) => handler().then(() => { throw err; })
    );
}


