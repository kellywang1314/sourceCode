/* 2020年8月4日*/

import { resolve } from "dns"

// 1.apply
Function.prototype.myApply = function(obj,args){
    obj = obj ? Object(obj) : window
    let fn = Symbol('fn')
    obj[fn]=  this
    let res = obj[fn](args)
    delete obj[fn]
    return res
}

// 2.call
Function.prototype.myCall = function(obj){
    obj = obj ? Object(obj) : window
    let args = [...arguments].slice(1)
    let fn = Symbol('fn')
    obj[fn]=  this
    let res = obj[fn](args)
    delete obj[fn]
    return res
}

// 3.bind(重点)：bind(obj)方法创建一个新函数，当绑定函数被调用时，该参数会作为原函数运行时的this指向。当使用new操作符调用绑定函数时，该参数无效。
/* 1.bind 的参数可以在绑定和调用的时候分两次传入
2.bindArgs 是绑定时除了第一个参数以外传入的参数，args 是调用时候传入的参数，将二者拼接后一起传入
3.如果使用 new 运算符构造绑定函数，则会改变 this 指向，this指向当前的实例
4.通过 Fn 链接原型，这样 fBound 就可以通过原型链访问父类 Fn 的属性 */

Function.prototype.myBind = function(obj){
    let that = this
    let bindArgs = [].slice.call(arguments,1)
    function Fn(){}
    function fBound(){
        let args = [].slice.call(arguments)
        // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
        return that.apply(this instanceof fBound ? this : obj,bindArgs.concat(args))
    }
    Fn.prototype = this.prototype
    fBound.prototype = new Fn()
    return fBound
}


// 4. 手写new：生成对象实例
function myNew(fn){
    let args = [].slice.call(arguments,1)
    let obj = {}
    obj.__proto__ = fn.prototype
    let res = fn.apply(obj,args)
    return res instanceof Object ? res :obj
}

// 5. 手写instanceof: 
/* 1.在 left 的原型链中层层查找，是否有原型等于right.prototype
2.边界条件，如果 left === null，即找到头没找到返回false，right === left，即找到返回 true.__proto__
3.left = left.__proto__，不停的向上查找 */
function myInstanceof(left,right){
    left = left.__proto__
    right = right.prototype
    while(true){
        if(left === null ){
            return false
        }
        if(right === null){
            return true
        }
        left = left.__proto__
    }
    
}

/* 2020年8月5日*/

// 手写Object.create
const myCreate = (obj) => {
    function fn(){}
    fn.prototype = obj
    return new fn()
}

// 手写promise
function myPromise(fn){
    this.callBack = []
    function resolve(value){
        this.data = value
        this.callBack.array.forEach(element => element(value))
    }
    fn(resolve) 
}

myPromise.prototype.then = function(onResolved){
    return new Promise(resolve => {
        this.callBack.push(() => {
            const res = onResolved(this.data)
            if(res instanceof Promise){
                res.then(resolve)
            }else{
                resolve(res)
            }
        })
    })
}

// 手写promiseAll
function promiseAll(arr){
    let result = []
    let count = 0
    return new Promise((resolve,reject) => {
        for(let i in arr){
            let current = Promise.resolve(arr[i])
            current.then((res) => {
                count++
                result[count] = res
                if(count === arr.length) return resolve(result)
            },(err) => {reject(err)})
            
        }
    })
   
}


/* 2020年8月6日*/

// 深拷贝
function deepCopy(obj,hash=new WeakMap()){
    if((!obj instanceof Object)) return obj
    if(hash.has(obj)) return hash.get(obj)
    let newObj = obj instanceof Array ? [] : {}
    hash.set(obj,newObj)
    for(let item in obj){
        if(obj[item] instanceof Object){
            newObj[item] = deepCopy(obj[item],hash)
        }else{
            newObj[item] = obj[item]
        }
    }
    return newObj

}
let a = {
    a1:[1,2,3],
    a2:{
        a3:{a4:'1'}
    }
}
let c = {
    a1:[1,2,3],
    a2:{
        a3:{a4:'1'},
        a4:a
    }
}
let b = deepCopy(c)


// 防抖
function debunce(fn){
    let timer = null
    return function(){
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


// 节流
function tottle(fn,timeout){
    let timer = null
    return function(){
        let args = [...arguments]
        let that = this
        if(!timer){
            timer = setTimeout(() => {
                fn.apply(that,args)
                timer = null
            },timeout)
        }
    }
}


function fn(a){
    console.log(a)
}

window.addEventListener('resize',this.tottle(function(){fn(1)},1000))


