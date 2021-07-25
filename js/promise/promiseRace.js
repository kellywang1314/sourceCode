/*
 * @Author: your name
 * @Date: 2021-07-24 15:08:05
 * @LastEditTime: 2021-07-24 15:08:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/promise/promiseRace.js
 */
Promise.race = function (promises) {
    //promises 必须是一个可遍历的数据结构，否则抛错
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then((data) => {
                    resolve(data);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        }
    });
}

