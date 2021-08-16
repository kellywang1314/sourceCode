
//call源码实现:主要是把调用call的函数赋值给thisObj对象
let obj = {
  a:[1,2,3]
}
Function.prototype.myCall = function(context,...args){
    if (typeof this !== 'function') {
        throw this + ' is not a function';
    }
    if (!context || context === null) {
        context = window;
    }
    let fn = Symbol('fn')
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}

//bind的实现:同call不同的是不是立即执行的
Function.prototype.myBind = function (context, ...args) {
    // 创造唯一的key值  作为我们构造的context内部方法名
    let fn = Symbol();
    context[fn] = this;
    let _this = this;
    //  bind情况要复杂一点, 分为两种情况，绑定函数作为构造函数，不改变this，作为普通函数，改变this
    const result = function (...innerArgs) {
      // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
      // 此时由于new操作符作用  this指向result实例对象
      if (this instanceof _this === true) {
        // 此时this指向指向result的实例  这时候不需要改变this指向
        this[fn] = _this;
        this[fn].apply(context,[...args, ...innerArgs])
        delete this[fn];
      } else {
        // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
        context[fn].apply(context,[...args, ...innerArgs])
        delete context[fn];
      }
    };
    // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
    // 实现继承的方式: 使用Object.create
    result.prototype = Object.create(this.prototype);
    return result;
};






