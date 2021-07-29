// [1,2,[3,4,[6,7,8]],9]

// 直接调用函数
var arr = [1,[2,3],[4,[5,6]]]
var arr_flat = arr.flat(Infinity)


// 递归
var arr = [1,[2,3],[4,[5,6]]]
function fn(arr){　　　　
	let arr1 = []
    arr.forEach((val)=>{
        if(val instanceof Array){
            arr1 = arr1.concat(fn(val))
        }
        else{
            arr1.push(val)
        }
    })
    return arr1
}


// reduce
function fn(arr) {
    return arr.reduce((res, element) => {
        let temp = Array.isArray(element) ? fn(element) : element
        return res.concat(temp)
    }, [])
}

// toString
var arr = [1,[2,3],[4,[5,6]]]
var arr_flat = arr.toString().split(',') //["1", "2", "3", "4", "5", "6"] 字符串类型的
let arr_flat = arr.toString().split(',').map((val)=>{
    return parseInt(val)
})

// 正则
JSON.stringify([1,[2,3],[4,[5,6]]]).replace(/[\[|\]]/g,'')


