// https://segmentfault.com/a/1190000015727237

/**
 * 继承图片中上半部分，不采用Object.create的继承方式
 * 
 **/
// 1. 原型链继承  问题1: 不能传递参数给父元素，初始化父元素；问题2: 所有实例共享继承的属性
function Parent() {
    this.parent = [1, 2, 3]
}
Parent.prototype.getP = function () {
    console.log(this.parent)
}
function Child(child) {
    this.child = child
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

{
    let v1 = new Child([4, 5, 6])
    let v2 = new Child([7, 8, 9])
    // v1.parent = ['a']  不能这样去修改数组的值,如果这样修改了，v1.parent就不再指向Parent中的parent了，而是指向了一个全新的数组。
    v1.parent.push(8)
    v1.getP()
    v2.getP()
}


// 2. 构造函数继承  问题1: 无法继承父类原型链上的属性和函数； 问题2: 每个子类实例都有自己的父类函数，这是没必要的
function Parent(parent) {
    this.parent = parent
    this.getName = function () {
        console.log(this.parent)
    }
}
Parent.prototype.getP = function () {
    console.log(this.parent)
}
function Child(Parentvalue, Child) {
    Parent.call(this, Parentvalue)
    this.Child = Child
}

{
    let v1 = new Child([1, 2, 3], [4, 5, 6])
    let v2 = new Child([1, 2, 3], [7, 8, 9])
    v1.parent.push(8)
    v1.getName()
    v2.getName()
    v1.getP() // 报错
}


// 3.组合继承：ES6 中利用 class 的方法实际上就是利用了组合模式 问题：父类的构造函数执行两次Parent.call(this,name)/new Parent()
function Parent(parent) {
    this.parent = parent
}
Parent.prototype.getP = function () {
    console.log(this.parent)
}
function Child(Parentvalue, Child) {
    Parent.call(this, Parentvalue)
    this.Child = Child
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

{
    let v1 = new Child([1, 2, 3], [4, 5, 6])
    let v2 = new Child([1, 2, 3], [7, 8, 9])
    v1.parent.push(8)
    v1.getP()
    v2.getP()
}


/**
 * 继承图片中下半部分，采用Object.create的继承方式
 * 
 **/
// 1. 原型式继承：原型式继承的object方法本质上是对参数对象的一个浅复制。问题和原型链继承一样。
function object(o) {
    function F() { }
    F.prototype = o
    return new F()
}

var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person)
anotherPerson.friends.push("Rob")

var yetAnotherPerson = object(person)
yetAnotherPerson.friends.push("Barbie")
console.log(person.friends)

// 2. 寄生式继承：使用原型式继承获得一个目标对象的浅复制，然后增强这个浅复制的能力
function createAnother(original) {
    var clone = object(original)
    clone.sayHi = function () {      //以某种方式来增强这个对象
        alert("hi")
    };
    return clone
}

// 3. 寄生组合继承：比较完美的方案
function Parent(parent) {
    this.parent = parent
}
Parent.prototype.getName = function () {
    console.log(this.parent)
}
function Child(name, child) {
    Parent.call(this, name)
    this.child = child
}

//创建父类原型的一个副本,把副本赋值给子类原型，而不是new Parent(),减少一次父构造函数的调用
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

/**
 * objectCreatePolyfill
 * 简化版 Object.create 的实现：基于指定原型创建新对象，并可选定义属性描述符
 * @param {object|null} proto 目标原型（可为 null）
 * @param {object} [properties] 可选的属性描述符集合，等价于 Object.defineProperties 的第二参
 * @returns {object} 以 proto 为原型的新对象
 */
function objectCreatePolyfill(proto, properties) {
    if (proto !== null && typeof proto !== 'object') throw new TypeError('proto must be object or null')
    function F() { }
    F.prototype = proto
    const obj = new F()
    if (properties && typeof properties === 'object') {
        Object.defineProperties(obj, properties)
    }
    return obj
}

// 使用示例：等价于下方原生写法
// Child.prototype = objectCreatePolyfill(Parent.prototype)


// 4. es6的写法
class Parent {
    constructor(parent) {
        this.parent = parent
    }
    // 相当于在Parent的原型链上
    getP() {
        console.log(this.parent)
    }
}

class Child extends Parent {
    constructor(parent, child) {
        super(parent)
        this.child = child
    }
}

{
    let v1 = new Child([1, 2, 3], [4, 5, 6])
    let v2 = new Child([1, 2, 3], [7, 8, 9])
    v1.parent.push(8)
    v1.getP()
    v2.getP()
}


/* 
1.  extends做了什么？
    a.把子类构造函数Child的原型,指向父类构造函数Parent
    b.把子类实例v1的原型对象的原型指向父类的原型对象
    c.子类构造函数使用`super`继承父类构造函数属性

2.  寄生继承和extends的区别
    ES6继承的结果和寄生组合继承相似，本质上，ES6继承是一种语法糖。
    ES6继承中子类的构造函数的原型链指向父类的构造函数，ES5中使用的是构造函数复制，没有原型链指向。
    ES6子类实例的构建，基于父类实例，所以必须先调用super方法；ES5中不是，先创建子类实例this对象，然后再对其使用父类增强

 */








