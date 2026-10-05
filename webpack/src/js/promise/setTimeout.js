// 同时输出6
for (var i = 0; i <= 5; i++) {
    setTimeout(function () {
        console.log(i)
    }, 1000)
}


// 同时输出0，1，2，3，4，5
for (var i = 0; i <= 5; i++) {
    // 立即执行函数会为每次循环创建独立的函数作用域
    (
        function (i) {
            // 参数 i 保存了本次循环的值，定时器回调通过闭包读取该值
            setTimeout(function () {
                console.log(i)
            }, 1000)
        }
        // 将当前循环中的 i 作为参数传入立即执行函数
    )(i)
}

/**
 * 创建一个延迟一秒后输出指定值并完成的 Promise。
 * @param {number} i 需要输出的值
 * @returns {Promise<boolean>} 一秒后完成的 Promise
 */
function timeoutPromise(i) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(i);
            resolve(true);
        }, 1000);
    });
}

// 循环不会等待 Promise 完成，六个定时器会被近乎同时创建
for (var i = 0; i <= 5; i++) {
    // 每次函数调用都会创建新的执行上下文和参数绑定
    timeoutPromise(i);
}

/**
 * 通过 await 等待每个任务完成，实现每隔一秒输出一个值。
 * @returns {Promise<void>}
 */
async function init() {
    for (var i = 0; i < 10; i++) {
        // 当前 Promise 完成后，循环才会进入下一次迭代
        await timeoutPromise(i);
    }
}

init();

// 休眠函数
