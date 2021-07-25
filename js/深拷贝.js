
// 浅拷贝
function copy(obj){
    let newObj
    if(typeof obj === 'object'){
        newObj = {}
        for(let i in obj){
            newObj[i] = obj[i]
        }
    }else{
        newObj = obj
    }
    return newObj
}


// 深拷贝
function deepCopy(obj,hash = new WeakMap()){
    if(typeof obj !== 'object') return obj
    if(hash.has(obj)) return hash.get(obj)
    let newObj = Object.prototype.toString.call(obj) === '[object Object]' ? {} : []
    hash.set(obj,newObj)
    for(let i in obj){
        if(typeof obj[i] === 'object'){
            newObj[i] = deepCopy(obj[i],hash)
        }else{
            newObj[i] = obj[i] 
        }
    }
    return newObj
}

// 测试用例
let a = {
    b:{
        c:[1,2,3],
        e:'wa',
    },
}

function deepCopy(obj,hash = new WeakMap()){
    if(typeof obj !== 'object') return obj
    let newObj = Array.isArray(obj) ? [] : {}
    if(hash.has(obj)){
        return hash.get(obj)
    }
    hash.set(obj,newObj)
    for(let i in obj){
        if(typeof obj[i] === 'object'){
            newObj[i] = deepCopy(obj[i],hash)
        }else{
            newObj[i] = obj[i]
        }
    }
    return newObj
}


 

