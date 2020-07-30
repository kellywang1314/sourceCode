/* 
*
* 柯里化：本质就是把一个参数很多的函数分解成单一参数的多个函数(必包)
* 实际应用：延迟计算；参数复用；动态创建函数
*/
function curry(fn){
    let len = fn.length
    let resArg = [...arguments].slice(1)
    let that = this
    if(len === resArg.length){
        return fn.apply(that,resArg)
    }else{
        return function(){
            resArg = [...resArg,...arguments]
            if(len=== resArg.length){
                return fn.apply(that,resArg)
            }
        }
    }
}

function add(a,b,c,d){
    let res = a+b+c+d
    return res
}
console.log(curry(add,1,2,3,4));//输出 10
console.log(curry(add,1,2,3)(4));//输出 10

