/*
 * @Author: your name
 * @Date: 2021-07-24 15:10:10
 * @LastEditTime: 2021-07-24 15:10:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/promise/promiseResolve.js
 */
/**
 * PromiseResolve
 * 简化版 Promise.resolve：
 * - 若入参为 Promise，直接返回该实例
 * - 若为 thenable（含 then 方法的对象），在微任务中调用其 then 完成同化
 * - 其他值直接 resolve，并保证 .then 在微任务中执行
 * @param {any} param 输入值/Promise/thenable
 * @returns {Promise<any>} 归一化后的 Promise
 */
function PromiseResolve(param) {
    if (param instanceof Promise) return param
    return new Promise((resolve, reject) => {
        const then = param && typeof param.then === 'function' ? param.then : null
        if (then) {
            const enqueue = typeof queueMicrotask === 'function' ? queueMicrotask : (cb) => Promise.resolve().then(cb)
            enqueue(() => {
                try { then.call(param, resolve, reject) } catch (e) { reject(e) }
            })
        } else {
            resolve(param)
        }
    })
}