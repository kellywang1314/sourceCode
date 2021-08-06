// 洗牌算法：原理就是遍历数组元素，将当前元素与随机抽取的一个剩余元素进行交换
function shuffle(arr) {
    for(let i=arr.length-1; i>=0; i--) {
        let rIndex = Math.floor(Math.random()*(i+1));
        // 打印交换值
        [arr[i],arr[rIndex]] = [arr[rIndex],arr[i]]
    }
    return arr
}


// sort 
var aa = [1,2,3,4,5,6,7,8,9,10]
function s(a,b){ 
    return Math.random()>0.5 ? 1 : -1
}
aa.sort(s)


// splice
function mixSort(list = []){
    const newList = []
    for(let i=0;i<10;i++){
        let num = Math.floor(Math.random()*(list.length-1))
        newList.push(list[num])
        list.splice(num,1)
    }
    return newList
}

