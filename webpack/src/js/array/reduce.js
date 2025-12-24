//reduce的实现
Array.prototype.myreduce = function reduce(callback){

    //调用数组
    let self = this
    let i = 0, len = self.length, isiexist = false, ivalue = self[0],accmulator = undefined

    //reduce 参数，第一个为回调，从第二个开始计算参数
    let initValue = arguments.length>1? arguments[1]:null

    //处理边界条件
    if(typeof callback != 'function'){
        throw new TypeError(`${callback} is not a function`)
    }

    if(len === 0 && arguments.length < 2){
        throw new TypeError('Reduce of empty array with no initial value');
    }

    if(arguments.length > 1 ){
        accmulator = initValue
    } else{
        accmulator = ivalue  
        ++i
    }

    while(i<len){
        isiexist = self.hasOwnProperty(i)
        if(isiexist ){
            const ivalue = self[i]
            //重点是这个累加器
            accmulator = callback.apply(undefined,[accmulator,ivalue,i,self])
        }
        ++i
    }
    return accmulator
}