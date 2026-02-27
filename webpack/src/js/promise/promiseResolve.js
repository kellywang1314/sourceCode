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
            queueMicrotask(() => {
                try {
                    then.call(param, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        } else {
            resolve(param)
        }
    })
}

/**
 * Promise.prototype.resolve
 * 功能：创建一个“已完成”的 Promise；等价于 Promise.resolve 的原型版
 * 说明：
 * - 若 value 为 Promise，直接返回；若为 thenable，微任务中同化；否则直接 resolve
 * @param {any} value 输入值/thenable/Promise
 * @returns {Promise<any>} 归一化后的 Promise
 */
Promise.prototype.resolve = function (value) {
    if (value instanceof Promise) return value
    return new Promise((resolve, reject) => {
        const then = value && typeof value.then === 'function' ? value.then : null
        if (then) {
            queueMicrotask(() => {
                try {
                    then.call(value, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        } else {
            resolve(value)
        }
    })
}