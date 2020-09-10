// 练习题：https://juejin.im/post/6859121743869509646； https://juejin.im/post/6844903575538106376

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


/* 2020年8月7日*/

// 复习promise的实现

function myPromise(fn){
    this.callBack = []
    function resolve(value){
        setTimeout(() => {
            this.data = value
            this.callBack.forEach(item => item(value))
        },0)
    }
    fn(resolve)
}

myPromise.prototype.then = function(onfullied){
    return new myPromise(resolve => {
        this.callBack.push(() => {
            let res = onfullied(this.data)
            if(res instanceof myPromise){
                res.then(resolve)
            }else{
                resolve(res)
            }
        })
        
    })  
}


/* 2020年8月10日*/

// instanceof
function instanceOf(left,right){
    left = left.__proto__
    right = right.prototype
    while(left){
        if(left == right){
            return true
        }else{
            left = left.__proto__
        }
    }
    return false
}

// 请在此处完善代码，不能直接使用 new 操作符
function myNew(constructor, ...rest) {
   let obj = {}
   obj.__proto__ = constructor.prototype
   let res = constructor.apply(obj,rest)
   return res instanceof Object ? res : obj
}
// 测试代码
function Fun(name,sex) {
    this.name = name
    this.sex = sex
  }
  Fun.prototype.getUserInfo = function() {
    return `我的姓名${this.name},我的性别${this.sex}`
  }
  
  const fun = myNew(Fun,'子君','男')
  console.log(fun.getUserInfo())


/* 2020年8月11日 */

  /* 
    如下为一段代码，请完善sum函数，使得 sum(1,2,3,4,5,6) 函数返回值为 21 ,
    需要在 sum 函数中调用 asyncAdd 函数，且不能修改asyncAdd函数
  */

  /**
 * 请在 sum函数中调用此函数，完成数值计算
 * @param {*} a 要相加的第一个值
 * @param {*} b 要相加的第二个值
 * @param {*} callback 相加之后的回调函数
 */
function asyncAdd(a,b,callback) {
    setTimeout(function(){
     callback(null, a+b)
    },100)
  }
  
  /**
   * 请在此方法中调用asyncAdd方法，完成数值计算
   * @param  {...any} rest 传入的参数
   */
  async function sum(...rest) {
    let result = rest.shift()
    for(let num of rest){
        result = await new Promise(resolve => {
            asyncAdd(result,num,(_,res) => {
                resolve(res)
            })
        })
    }
    return result 

  }

// promise all
  async function sum(...rest) {
    let result = 0
    const obj = {}
    obj.toString = function(){
        return result
    }
    const promises = []
    for(let num of rest){
        promiseAll.push(new Promise(resolve => {
            asyncAdd(result,num,(_,res) => {
                resolve(res)
            })
        }).then(res => {
            result = res
        })
        )
    }
    await Promise.all(promises)

  }
  
  
  let start = window.performance.now()
  sum(1, 2, 3, 4, 5, 6).then(res => {
    // 请保证在调用sum方法之后，返回结果21
    console.log(res)
    console.log(`程序执行共耗时: ${window.performance.now() - start}`)
  })




/* 2020年8月14日练习 */
// Q: 实现一个简单的虚拟 DOM 渲染
let domNode = {
    tagName: 'ul',
    props: { class: 'list' },
    children: [{
      tagName: 'li',
      children: ['item1']
    }, {
      tagName: 'li',
      children: ['item1']
    }]
  };
  
  // 构建一个 render 函数，将 domNode 对象渲染为 以下 dom
  <ul class="list">
      <li>item1</li>
      <li>item2</li>
  </ul>
  

function render(domNode){
    if(!domNode) return document.createElement('')
    let $el 
    if(typeof domNode === 'object'){
        $el = document.createElement(domNode.tagName)
        if(domNode.props){
            for(let i in domNode.props){
                $el.setAttribute(i,domNode.props[i])
            }   
        }
        if(domNode.children.length){
            for(let i in domNode.children){
                let temp = render(domNode.children[i])
                $el.appendChild(temp)
            }
        }
    }else{
        $el = document.createTextNode(domNode)
    }
    return $el
}
  

/* 2020年8月17日练习 */
// 数据绑定
<input type='text' id='in'/>
<div id='d'></div>
let $input = document.getElementById('in')
let $div = document.getElementById('d')

let targetD = new Proxy({},{
    set:function(target,key,value){
        // target[key] = value
        $input.value = value
        $div.innerHTML = value
    }
})
$input.onchange = function(e){
    targetD['hello'] = e.target.value
}

/* 2020年9月1日练习 */

// promiseAll的实现
function promiseAll(promises){
    let count = 0
    let len = promises.length
    let result = []
    return new Promise((resolve,reject) => {
        for(let i in promises){
           promise.resolve(promises[i]).then((res)=>{
                count++
                result[count] = res
                if(count === len){
                    return resolve(result)
                }
           },(error) => {
                return reject(error)
           })
        }
    })
}


/* 2020年9月3日练习 */
// promiseAll的实现
function promiseAll(promises){
    let results = []
    let count = 0
    return new Promise((resolve,reject) => {
        for(let i of promises){
            Promise.resolve(i).then((res) => {
                count++
                results[count] = res
                if(count === promises.length){
                    return resolve(results)
                }
            },(err) => {
                return reject(err)
            })
        }
    })
}

// promsie的实现
function mypromise(fn){
    this.callbacks = []
    function resolve(value){
        setTimeout(() =>{
            this.data = value
            this.callbacks.map(item => item && item())
        })
    }
    fn(resolve)
}

mypromise.prototype.then = function(onResolved){
    return new mypromise((resolve) => {
        this.callbacks.push(() => {
            let temp = onResolved(this.data)
            if(temp instanceof mypromise){
                temp.then(resolve)
            }else{
                resolve(temp)
            }
        })
    })
}


/* 2020年9月4日练习 */
// compose函数: 就是将几个有特点的函数拼凑在一起,让它们结合,产生一个崭新的函数: const compose = (f,g) => (...arg) => f(g(...arg))
function compose(){
    let args = [...arguments]
    return function(params){
        for(var i = args.length - 1; i > -1; i--){
            params = args[i] (params)
        }
        return params
    }
}

let toUpperCase = (x) => x.toUpperCase()
let exclaim = (x) => x + '!';
compose(toUpperCase,exclaim)('hello world')


/* 2020年9月7日练习 */
let domNode = {
    tagName: 'ul',
    props: { class: 'list' },
    children: [{
      tagName: 'li',
      children: ['item1']
    }, {
      tagName: 'li',
      children: ['item1']
    }]
  };
  
  // 构建一个 render 函数，将 domNode 对象渲染为 以下 dom
  <ul class="list">
      <li>item1</li>
      <li>item2</li>
  </ul>

  function render(domNode){
    if(!domNode) return document.createDocumentFragment()
    let dom 
    if(typeof domNode === 'object'){
        dom = document.createElement(domNode.tagName)
        if(dom.props){
            for(let i in dom.props){
                dom.setAttribute(i,dom.props[i])
            }
        }
        if(domNode.children.length){
            for(let i in domNode.children){
                let temp = render(domNode.children[i])
                dom.appendChild(temp)
            }
        }
    }else{
        dom = document.createTextNode(domNode)
    }
    return dom
  }

  /* 2020年9月8日练习 */
  // 柯里化
  function curry(fn){
    let len = fn.length
    let args = [...arguments].slice(1)
    let that = this
    if(args.length === len){
        return fn.apply(that,args)
    }
    function _curry(){
        let arg =  [...arguments]
        args = [...args,...arg]
        if(args.length === len ){
            fn.apply(that,args)
        }else{
            return _curry
        }
    }
    return _curry
        
  }

  function add(a,b,c,d){
    let res = a+b+c+d
    return res
}
curry(add,1,2,3,4)


/* 2020年9月8日晚练习 */

  let domNode = {
    tagName: 'ul',
    props: { class: 'list' },
    children: [{
      tagName: 'li',
      children: ['item1']
    }, {
      tagName: 'li',
      children: ['item1']
    }]
  };
  
  // 构建一个 render 函数，将 domNode 对象渲染为 以下 dom
<ul class="list">
      <li>item1</li>
      <li>item2</li>
  </ul>


function render(domNode){
    if(!domNode) return document.createDocumentFragment()
    let dom
    if(typeof domNode === 'object'){
        dom = document.createElement(domNode.tagName)
        if(domNode.props){
            for(let i in domNode.props){
                dom.setAttribute(i,domNode.props[i])
            }
        }
        if(domNode.children.length){
            for(let i in domNode.children){
                dom.appendChild(render(domNode.children[i]))
            }
        }
    }else{
        dom = document.createTextNode(domNode)
    }
    return dom
}

/* 2020年9月10日练习 */

// 防抖
function debounce(fn,timeout){
    let timer = null 
    return function(){
        let that = this
        let args = [...arguments]
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(that,args)
        },timeout)
            
    }
}

// 节流
function tottle(fn,timeout){
    let timer = null
    return function(){
        let that = this
        let args = [...arguments]
        if(!timer){
            timer = setTimeout(() => {
                fn.apply(that,args)
                timer = null
            },timeout)
        }   
    }
        
}

function d(value){
    console.log(value)
}

window.addEventListener('resize',tottle(function(){d(1)},1000))