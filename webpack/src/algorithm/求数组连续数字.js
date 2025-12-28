// 求数组连续的数字
function arrange(arr){
    let result = []
    let temp = []
    let res = []
    arr.sort((a,b) => {return a-b})
    .concat(Infinity)
    .reduce((source,dest) => {
        temp.push(source)
        if(dest-source>1){
            result.push(temp)
            temp = []
        }
        return dest
    })
    result.map((item) => {
        if(item.length>1){
            res.push(item[0]+'-'+item[item.length-1])
        }else{
            res.push(item[0])
        }
    })
    return res
}