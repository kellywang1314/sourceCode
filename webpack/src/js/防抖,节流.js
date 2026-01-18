
/* 
1. 什么是防抖和节流
节流和防抖都是对频繁触发的事件进行限制的性能优化手段，节流是控制高频操作经过多久运行一次；防抖是当高频操作经过时间t没有在重复触发才会执行一次
2. 防抖和节流的区别以及应用场景
    1. window对象的resize、scroll事件
    2. 拖拽时的mousemove事件
    3. 文字输入、自动完成的keyup事件

防抖：
对于window的resize事件，实际需求大多为停止改变大小n毫秒后执行后续处理；
对于用户输入，一般是用户输入结束或者暂停时，才会触发change事件
开发过程中，对功能按钮进行限制，防止多次连续点击

节流：
window.scroll获取scrollTop数据
拖拽一个元素时，要随时拿到该元素被拖拽的位置
*/

/**
 * throttle
 * 函数功能：节流，支持立即执行（leading）。
 * - immediate=true：首次触发立即执行，等待窗口内忽略；
 * - immediate=false：在窗口结束时以“最后一次参数”执行（trailing）。
 * @param {Function} fn 目标函数
 * @param {number} wait 间隔毫秒
 * @param {boolean} [immediate=false] 是否立即执行
 * @returns {Function} 包装后的函数
 */
function throttle(fn, wait, immediate = false) {
    let timer = null
    // let lastArgs = null
    let lastThis = null
    return function (...args) {
        // lastArgs = args
        lastThis = this
        if (!timer) {
            if (immediate) {
                fn.apply(lastThis, args)
            }
            timer = setTimeout(() => {
                if (!immediate) {
                    fn.apply(lastThis, args)
                }
                timer = null
                // lastArgs = null
                lastThis = null
            }, wait)
        }
    }
}

/**
 * debounce
 * 函数功能：防抖，支持立即执行（leading）。
 * - immediate=true：首次触发立即执行，窗口内后续调用忽略；
 * - immediate=false：仅在停止触发 wait 毫秒后执行（trailing）。
 * @param {Function} fn 目标函数
 * @param {number} wait 等待毫秒
 * @param {boolean} [immediate=false] 是否立即执行
 * @returns {Function} 包装后的函数
 */
function debounce(fn, wait, immediate = false) {
    let timer = null
    return function (...args) {
        const that = this
        if (timer) clearTimeout(timer)
        if (immediate && !timer) {
            fn.apply(that, args)
        }
        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(that, args)
            }
            timer = null
        }, wait)
    }
}


function f(parm) {
    console.log(parm * 2)
}

window.addEventListener('resize', debounce(() => f(1), 1000, true))