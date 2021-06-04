// https://juejin.cn/post/6968713283884974088

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
        const fn = () => {
            callBack()
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
