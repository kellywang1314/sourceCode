// promise串行
var createPromise =function(time) {
    return (resolve, reject)=>
        new Promise((resolve, reject)=>{
            setTimeout(()=>{
                console.log('timein'+time)
                resolve();
            }, time*1000)
        })
}
 
function promiseChain(arr) {
    arr.reduce((pre, next, index, carr)=>{
        return pre.then(next)
    }, Promise.resolve())
    
}

var arr=[createPromise(2),createPromise(1),createPromise(3),createPromise(4),createPromise(5)];
promiseChain(arr)



const promise1 = () => Promise.resolve(1)
const promise2 = () => new Promise(resolve => {
    setTimeout(() => {console.log('2'),resolve(2)},2000)
})
const promise3 = () => new Promise(resolve => {
    setTimeout(() => {console.log('3'),resolve(3)},3000)
})

const list = [promise1,promise2,promise3]
promiseChain(list)





