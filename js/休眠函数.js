/*
 * @Author: your name
 * @Date: 2021-07-25 20:10:16
 * @LastEditTime: 2021-07-25 20:10:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/休眠函数.js
 */

function sleep (ms = 100) {
    let sleepSwitch = true
    let s = Date.now()
    while (sleepSwitch) {
        if (Date.now() - s > ms) {
            sleepSwitch = false
        }
    } 
}
