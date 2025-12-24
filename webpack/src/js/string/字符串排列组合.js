

// 'abcd'
function fn(str = 'abcd'){
    const len = str.length
    const result = []
    if(str.length>1){
        for(let i=0; i<len; i++){
            let temp = str[i]
            let rest = `${str.slice(0,i)}${str.slice(i+1)}`
            let res = fn(rest)
            for(let i=0; i<res.length;i++){
                result.push(`${temp}${res[i]}`)
            }
        }
    }else{
        result.push(str)
    }
    return result
    
}
