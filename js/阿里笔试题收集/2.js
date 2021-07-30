var createPromise =function(time) {
    return (resolve, reject)=>
        new Promise((resolve, reject)=>{
            setTimeout(()=>{
                console.log('timein'+time)
                resolve();
            }, time*1000)
        })
}
 
function serpromise(arr) {
    arr.reduce((pre, next, index, carr)=>{
        return pre.then(next)
    }, Promise.resolve())
}
 
var arr=[createPromise(2),createPromise(1),createPromise(3),createPromise(4),createPromise(5)];
// Promise.resolve().then(createPromise(2)).then(createPromise(1))
serpromise(arr)