/*
 * @Author: your name
 * @Date: 2021-07-24 15:08:05
 * @LastEditTime: 2021-07-24 15:08:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/promise/promiseRace.js
 */
/**
 * PromiseRace
 * 简化版 Promise.race：接收可迭代对象，谁先 settle（resolve/reject）就以其结果/错误结束
 * @param {Iterable<any>} iterable 可迭代输入（数组、Set 等）
 * @returns {Promise<any>} 首个 settle 的结果（输入为空则永远 pending）
 */
function PromiseRace(iterable) {
    if (iterable == null || typeof iterable[Symbol.iterator] !== 'function') {
        throw new TypeError('iterable must be an iterable object')
    }
    const list = Array.from(iterable)
    return new Promise((resolve, reject) => {
        if (list.length === 0) return
        for (const item of list) {
            Promise.resolve(item).then(resolve, reject)
        }
    })
}

