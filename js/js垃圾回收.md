### 垃圾回收的算法---- 垃圾回收不当会导致内存泄漏

#### 1. 引用计数（最大的劣势是无法解决循环引用无法回收的问题 这就是前文中IE9之前出现的问题）
当前对象是否被引用，如果被引用标记。最后没有被标记的则清除。这样有个问题就是程序中两个不需要的参数互相引用，这样两个都会被标记，然后都无法被删除，也就是锁死了。为了解决这个问题，所以出现了标记清除法（mark sweap）。

#### 2. 标记清除法
这个方法是从这个程序的global开始，被global引用到的参数则标记。最后清除所有没有被标记的对象，这样可以解决两对象互相引用，无法释放的问题。
通过垃圾回收机制，我们也可以发现，global中定义的内容要谨慎，因为global相当于是主函数，浏览器不会随便清除这一部分的内容。所以要注意，变量提升问题。
GC从全局作用域的变量，沿作用域逐层往里遍历（对，是深度遍历），当遍历到堆中对象时，说明该对象被引用着，则打上一个标记，继续递归遍历（因为肯定存在堆中对象引用另一个堆中对象），直到遍历到最后一个（最深的一层作用域）节点。