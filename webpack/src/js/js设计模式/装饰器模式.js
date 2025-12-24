// 在不改变对象自身的基础上，动态的给某个对象添加新的功能，同时又不改变其接口
// 方便动态的扩展功能，且提供了比继承更多的灵活性。
class test1{
    update(){
        console.log('wa1')
    }
}

class test{
    constructor(test1){
        this.test = test1
    }
    update(){
        this.test.update()
        // 增加
        console.log('wa2')
    }
}

let re = new test(new test1())
re.update()