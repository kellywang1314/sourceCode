/*
 * @Author: your name
 * @Date: 2021-07-24 15:10:10
 * @LastEditTime: 2021-07-24 15:10:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/promise/promiseResolve.js
 */
Promise.resolve = function (param) {
    if (param instanceof Promise) {
    return param;
}
    return new Promise((resolve, reject) => {
        if (param && param.then && typeof param.then === 'function') {
            setTimeout(() => {
                param.then(resolve, reject);
            });
        } else {
            resolve(param);
        }
    });
}