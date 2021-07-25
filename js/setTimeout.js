/* 
    setInterval缺点：
        1. setInterval无视代码错误，setInterval执行的代码由于某种原因出了错，它还会持续不断（不管不顾）地调用该代码
        2. setInterval无视网络延迟，对服务器轮询，无视网络延迟，仍然会按定时触发请求，最终客户端网络队列会塞满Ajax调用
        3. setInterval不保证执行，内部函数执行时间太长，后续重复会被取消
            JavaScript中使用 setInterval 开启轮询。定时器代码可能在代码再次被添加到队列之前还没有完成执行，
            结果导致定时器代码连续运行好几次，而之间没有任何停顿。而javascript引擎对这个问题的解决是：
            当使用setInterval()时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。
            这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。
        4. setInterval容易造成内存泄露，在执行clearInterval之前，系统不会释放掉setInterval的回调函数引用到的变量，及时释放内存就需要手动执行clearInterval。

*/

/*
    requestAnimationFrame
    屏幕的刷新率为60次/s,每帧的预算时间为16ms，刨除浏览器自身耗费时间，你的工作需要在10ms完成，否则会卡顿
    requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。
    在做js动画的时候，之前经常使用setTimeout(不推荐)，requestAnimationFrame的基本思想就是与刷新频率保持同步，利用这个刷新频率进行页面重绘，
    此外，使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力（setTimeout仍然会执行）
    requestAnimationFrame使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。

*/


// setTimeout实现 setInterval
let timeWorker = {}
function mySetInterval(fn, time){
    // 定义一个key，来标识此定时器
    let key = Symbol()
    function interval(){
        timeWorker[key] = setTimeout(interval,time)
        fn()
    }
    setTimeout(interval, time)
    return key
}

// clearInterval
function myClearInterval(key){
    if(key in timeWorker){
        clearTimeout(timeWorker[key])
        delete timeWorker[key]
    }
}

// setInterval 实现 setTimeout
function mySetTimeOut(fn,time){
    const timer = setInterval(() => {
        clearInterval(timer)
        fn()
    }, time)
}

