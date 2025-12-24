/*
 * @Author: your name
 * @Date: 2021-07-27 16:19:10
 * @LastEditTime: 2021-07-27 16:24:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/callBack包装成promise.js
 */
const promisify = function (fn, receiver) {
    return function () {
        let args = [...arguments]
        return new Promise((resolve, reject) => {
            // 注： 以下数组内的function执行的是fn的最后一个参数，在示例里面就是fs.readFile的最后一个回调函数，该函数
            fn.apply(receiver, [].concat(args, [function (err, res) {
                return err ? reject(err) : resolve(res)
            }]))
        })
    }
}


