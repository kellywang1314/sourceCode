/* 
1. 接收一个 Promise 实例的数组或具有 Iterator 接口的对象，
2、如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
3、如果全部成功，状态变为 resolved，返回值将组成一个数组传给回调
4、只要有一个失败，状态就变为 rejected，返回值将直接传递给回调all() 的返回值也是新的 Promise 对象 */

function PromiseAll(promises){
    let results = []
    let count = 0, len = promises.length
     // 参数判断
     if(!Array.isArray(promises)){
        throw new TypeError("promises must be an array")
    }
    return new Promise((resolve,reject) => {
       for(let i of promises){
           Promise.resolve(i).then((res) =>{
                results[count] = res
                count++
                if(len === count){
                    resolve(results)
                }
           }).catch(err => { reject({ message: err}) })
       }
    })
}

// 测试用例
let p1 = new Promise(resolve => { resolve('p1') })
let p2 = new Promise(resolve => { setTimeout(() => { resolve('p2') }, 3000) })
let p3 = new Promise(resolve => { resolve('p3') })
let p4 = new Promise(resolve => { setTimeout(() => { resolve('p4') }, 1500) })
let p5 = new Promise(resolve => { resolve('p5') })

PromiseAll([p1, p2, p3, p4, p5]).then(res => {
	console.log(res)
}).catch(err => {
	console.error(err)
})


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
  