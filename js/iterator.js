/*
 * @Author: your name
 * @Date: 2021-07-24 15:14:26
 * @LastEditTime: 2021-07-24 15:14:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/iterator.js
 */
let obj = {
    name: "Yvette",
    age: 18,
    job: 'engineer',
    [Symbol.iterator]() {
        const self = this;
        const keys = Object.keys(self);
        let index = 0;
        return {
            next() {
                if (index < keys.length) {
                    return {
                        value: self[keys[index++]],
                        done: false
                    };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
};

