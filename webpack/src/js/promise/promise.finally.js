/**
 * finally
 * - 保持链值不变：成功时返回原 value，失败时重新抛出原 err
 * @param {() => any} callback 清理函数（不会修改链值）
 * @returns {Promise<any>} 链式 Promise
 */
Promise.prototype.finally = function (callback) {
    return this.then( // 劫持then
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


