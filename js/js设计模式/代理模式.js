// 为其他对象提供一种代理，便以控制对这个对象的访问，不能直接访问目标对象,常用的就是es6的proxy

let obj = {}
let res = new Proxy(obj,{
    set:function(target,key,value){
        console.log(value,'wa')
        target[key] = value  
    }
})

res.num = 1


// 应用：js中的校验