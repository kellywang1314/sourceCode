
/* 
实现思路
1. 创建一个对象
2. 在该对象上创建一个缓存列表（调度中心）
3. on 方法用来把函数 fn 都加到缓存列表中（订阅者注册事件到调度中心）
4. emit 方法取到 arguments 里第一个当做 event，根据 event 值去执行对应缓存列表中的函数（发布者发布事件到调度中心，调度中心处理代码）
5. off 方法可以根据 event 值取消订阅（取消订阅）
6. once 方法只监听一次，调用完毕后删除缓存函数（订阅一次） 
*/

class EventEmitter{
    callBacks = {}
    on = (type,callBack) => {
        if(!this.callBacks[type]){
            this.callBacks[type] = []
        }
        this.callBacks[type].push(callBack)
    }

    off = (type,callBack) => {
        if(!this.callBacks[type]) return
        this.callBacks[type] = this.callBacks[type].filter(item => item !== callBack)
    }

    emit = (type,...rest) => {
        for(let i in this.callBacks){
            if(i === type){
                this.callBacks[type].map(item => item.apply(this,rest))
            }
        }
    }

    // 需要注意下
    once = (type,callBack) => {
        const fn = (...rest) => {
            callBack.apply(this,rest)
            this.off(type, fn)
          }
          this.on(type, fn)
    }

}

// 测试用例
const event = new EventEmitter();
const handle = (...rest) => {
  console.log(rest);
}
event.on("click", handle)

event.emit("click", 1, 2, 3, 4)

event.off("click", handle)

event.emit("click", 1, 2)

event.once("dbClick", () => {
  console.log(123456)
});
event.emit("dbClick")
event.emit("dbClick")

class EventEmit{
    constructor(){
        this.handleEventCallback = {}
    }

    emit(eventType,...rest){
        for(let i in this.handleEventCallback){
            if(eventType === i){
                let temp = this.handleEventCallback[eventType]
                temp.forEach((item) => item.apply(this,rest))
            }
        }
    }

    off(eventType,callBack){
        if(!this.handleEventCallback[eventType] ) return 
        this.handleEventCallback[eventType] = this.handleEventCallback[eventType].filter((item) => item!=callBack)
    }

    on(eventType,callBack){
        if(!this.handleEventCallback[eventType]){
            this.handleEventCallback[eventType]= []
        }
        this.handleEventCallback[eventType].push(callBack)
    }

    // 这里需要注意，调用on 注册
    once(eventType,callBack){
        const fn = () => {
            callBack()
            this.off(eventType, fn)
          }
          this.on(eventType, fn)


    }
}

