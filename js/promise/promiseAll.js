/* 
1. 接收一个 Promise 实例的数组或具有 Iterator 接口的对象，
2、如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
3、如果全部成功，状态变为 resolved，返回值将组成一个数组传给回调
4、只要有一个失败，状态就变为 rejected，返回值将直接传递给回调all() 的返回值也是新的 Promise 对象 */

function PromiseAll(promises){
    let results = []
    let count = 0, len = promises.length
    return new Promise((resolve,reject) => {
       for(let i of promises){
           Promise.resolve(i).then((res) =>{
                count++
                results[count] = res
                if(len === count){
                    return resolve(results)
                }
           },(err) => {return reject(err)})
       }
    })
}

// 测试用例
let promises = [new Promise((resolve) => {
    setTimeout(() => {
        resolve(1)
    },4000)  
}),new Promise((resolve) => {
    setTimeout(() => {
        resolve(2)
    },3000)
})]
Promise.all(promises)