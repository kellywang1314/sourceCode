// es6的继承
class Parent {
    constructor(name) {
        this.parent = name
    }
    go() {
        console.log(this.parent)
    }
}

class Child extends Parent {
    constructor(child) {
        super('parent')
        this.child = child
    }
}

// es5的继承
// 原型链继承：缺点
// 1.每个实例对引用类型的属性的修改也会被其他实例共享，这不是我们想看到的
// 2.创建child的时候无法像构造函数穿参，child实例无法初始化父类属性
function Parent() {
    this.parent = [1, 2, 3]
}
Parent.prototype.getName = function () {
    console.log(this.parent)
}
function Child(child) {
    this.child = child
}

Child.prototype = new Parent()
Child.prototype.constructor = Child


/**
 * demoPrototypeReferenceSharing
 * 展示原型链继承下，原型上的引用类型属性会被多个实例共享
 * @returns {void}
 */
export function demoPrototypeReferenceSharing() {
    function ProtoParent() {
        this.list = [1, 2, 3]
    }
    function ProtoChild() { }
    ProtoChild.prototype = new ProtoParent()
    ProtoChild.prototype.constructor = ProtoChild

    const a = new ProtoChild()
    const b = new ProtoChild()

    a.list.push(99)
    console.log('共享引用属性示例: a.list=', a.list, 'b.list=', b.list)
}


// 构造函数继承：
// 优点：克服了原型链继承带来的2个缺点
// 缺点：子类无法继承父类原型链上的方法；每次生成子类实例都会执行一次父函数
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

// 组合继承：最常用
// 优点：解决了上面两种方法的缺点
// 缺点：父类的构造函数执行两次Parent.call(this,name)/new Parent()
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
Child.prototype = new Parent()
Child.prototype.constructor = Child




//寄生组合继承：比较完美的方案
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

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

