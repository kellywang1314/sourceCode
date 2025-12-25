
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

// 节流
function throttle(fn, timeout){
    let timer = null
    return function (){
        let args = [...arguments]
        let that = this
        if(!timer){
        timer = setTimeout(()=> {
            fn.apply(that,args)
            timer = null
        },timeout)
    }
    }
    
}

// 防抖
function debunce(fn, timeout) {
    let timer = null
    return function () {
        let args = [...arguments]
        let that = this
        if(timer){
            clearTimeout(timer)
        }else{
            timer = setTimeout(() => {
                fn.apply(that,args)
            },timeout)
        }
    }
}


function f(parm) {
    console.log(parm * 2)
}

window.addEventListener('resize', this.debunce(() =>f(1),1000))