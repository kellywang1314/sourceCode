var list = [
    {name:'上海',code:'shanghai',},
    {name:'西安', code:'xian'},
    {name:'深圳', code:'shenzhen'},
    {name:'北京', code:'beijing'}
];
list.sort((a,b)=>{
    let order=['beijing','xian','shanghai','shenzhen'];
    return order.indexOf(a.code)-order.indexOf(b.code);
});


[-2,0,0,2,2]
function a(arr = []){
    let res = []
    arr.sort((a,b) => a-b)
    for(let i=0;i<arr.length-1;i++){
        let target = 0-arr[i]
        let temp = twoSum(arr.slice(i+1),target)
        res.push([arr[i],...temp].sort((a,b) => a-b))
    }
    return res 
}

function twoSum(arr=[],target){
    let map = {}
    for(let i in arr){
        if(map[target-arr[i]] !== undefined){
            return [arr[i],map[target-arr[i]]]
        }else{
            map[arr[i]] = arr[i]
        }
    }
    return []
}

console.log(list);