/*
 * @Author: your name
 * @Date: 2020-07-14 16:24:35
 * @LastEditTime: 2021-07-09 18:33:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit)
 * @FilePath: /sourceCode/js/柯里化.js
 */
/* 
*
* 柯里化：本质就是把一个参数很多的函数分解成单一参数的多个函数(必包)
* 实际应用：延迟计算；参数复用；动态创建函数
*/
function curry(fn){
    //去掉curry第一个参数 该参数是后续参数传递结束的一个函数
     let args = [...arguments].slice(1)
     let len = fn.length
     function __curry(){
         args.push(...arguments)
         if(args.length === len){
             return fn.apply(this,args)
         }
         //否则返回函数继续传参
         return __curry
     }
     //判断是否一次性传完参数如果传完参数则传入参数调用需要调用的函数
     if(args.length === len){
         return fn.apply(this,[...args])
     }else{
        return __curry
     }
}
function add(a,b,c,d){
    let res = a+b+c+d
    return res
}
console.log(curry(add,1,2,3,4));//输出 10
console.log(curry(add,1,2,3)(4));//输出 10




// add(1)(2)(3) => 6

function curry(fn){
    let len = fn.length
    let args = [...arguments].slice(1)
    if(args.length === len){
        return fn.apply(this,args)
    }
    function _curry(){
        let that = this
        args.push(...[...arguments])
        if(args.length <len){
            return _curry
        }else{
            return fn.apply(that,args)
        }
    }
    return _curry
}

function fn(a,b,c){
    return a+b+c
}
let add = curry(fn)
add(1)(2)(3)


