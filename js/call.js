//call源码实现:主要是把调用call的函数赋值给thisObj对象
Function.prototype.myCall = function(thisObj){
    if (typeof this !== 'function') {
        throw this + ' is not a function';
    }
    let args = [...arguments].slice(1)
    let fn = Symbol('fn')
    thisObj[fn] = this
    const result = thisObj[fn](...args)
    delete thisObj[fn]
    return result
}

//bind的实现:同call不同的是不是立即执行的
Function.prototype.myBind= function(thisObj){
    if (typeof this !== 'function') {
        throw TypeError("Bind must be called on a function");
      }
    const args = [...arguments],
    self = this,
    bound = function() {
        return self.apply(thisObj,args)
    }
    return bound
}
export { myCall, myBind }


// Array.prototype.slice.call(this,args)

