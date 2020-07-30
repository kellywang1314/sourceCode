/**
 *  
 **/

 // 1. new的实现原理

 function myNew(){
    let obj = {}
    let fn = [...arguments].slice(0,1)
    let args = [...arguments].slice(1)
    obj.__proto__ = fn.prototype
    let result = fn.apply(obj,args)
    return typeof result === 'object' ? result : obj
 }

 // 2. 描述下new做了什么
 /* 2.1 创建一个空的对象
    2.2 把函数的原型对象赋值给对象的__proto__
    2.3 调用函数，并把函数的this指向新创建的对象
    2.4 如果该函数没有返回值或者返回值不是对象，则返回创建的对象，如果返回值是对象，则直接返回该对象。 */
 
// 3. {}/new Object()/Object.create() 的区别
/**
 * 
 * 首先三者都能创建一个新的对象，
 * {}和new Object()相比，{}效率更高，因为后者本质是一个函数，涉及到在原型链中遍历该函数，找到之后，还要涉及生成和销毁堆栈信息
 * 
 * Object.create()和前面两个不同是create创建的对象是以函数的参数为原型，而前面两个是用Object.prototype为原型
 * 
 * **/
