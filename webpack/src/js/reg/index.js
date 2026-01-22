// 参考，https://juejin.cn/post/6844903648309297166?from=right_recommend#heading-14




obj2 = {
    child:{
        id: 1,
        parent: 0,
        child: {
            id: 2,
            parent: 1,
            child: {
                id: 3,
                parent: 2
            }
        }
    }
}

function arrChange(arr = [],parent){
    let res = {}
    digui(arr,res,parent)
    return res

}
function digui(arr,res,parent){
    for(let item of arr){
        if(item.parent == parent){
            let newItem = {...item,child:{}}
            res['child'] = {...newItem}
            digui(arr,newItem.child,item.id)
        }
        
    }
}

obj = [
    {id:1,parent:0},
    {id:2,parent:1},
    {id:3,parent:2}
]

arrChange(obj,0)
