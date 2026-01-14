
 // 1. new的实现原理

 function myNew(fn){
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

/**
 * demoMyNew
 * 功能：演示自实现 myNew 的行为，包括：
 * 1）原型链关联（instanceof / __proto__）
 * 2）构造函数返回对象时的覆盖规则
 * 3）this 绑定与参数传递
 * @returns {void}
 */
function demoMyNew() {
  // 构造函数：设置属性与原型方法
  function Person(name) { this.name = name; this.tag = 'P' }
  Person.prototype.say = function () { return 'Hello ' + this.name }

  // 使用自定义 myNew 创建实例
  const person = myNew(Person, 'Jack')
  console.log('person name:', person.name)
  console.log('person say:', person.say())
  console.log('instanceof(Person):', person instanceof Person)
  console.log('__proto__ === Person.prototype:', Object.getPrototypeOf(person) === Person.prototype)

  // 构造函数返回一个对象：遵循“返回对象优先”规则
  function ReturnsObj(name) { this.name = name; return { name: 'Override', flag: true } }
  const resObj = myNew(ReturnsObj, 'Rose')
  console.log('returns object case:', resObj.name, resObj.flag)

  // 参数传递与 this 绑定示例
  function Adder(a, b) { this.sum = a + b }
  const adder = myNew(Adder, 2, 3)
  console.log('adder sum:', adder.sum)
}

// 运行测试示例
demoMyNew()
