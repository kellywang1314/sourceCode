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


function deepTree(node){
    if(node === null) return 0
    return Math.max(deepTree(node.left),deepTree(node.right))+1
}