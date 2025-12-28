// 求两个数组的交集，并按照大小排序
// arr1=[3,4,1,7,0,6], arr2 = [7,2,5,6,4]

function inter(arr1,arr2){
    let res = arr1.filter((item) => {
        return arr2.indexOf(item)>-1
    })
    res.sort((a,b) => {return a-b})
    return res
}


// js正则表达式,好好看看
function fuc(string){
    let reg = /^\{(+d)?(+w)?\}$/
}