
//二分查找
module.exports =  Binsearch = (arr,low,high,target) => {
    if(low > high) return -1
    let pos = Math.floor((low+high)/2)
    if(target>arr[pos]){
        return Binsearch(arr,pos+1,high,target)
    }else if(target<arr[pos]){
        return Binsearch(arr,low+1,pos,target)
    }else{
        return pos
    }
}

