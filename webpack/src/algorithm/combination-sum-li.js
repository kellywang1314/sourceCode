/* 给出一组候选数C和一个目标数T，找出候选数中起来和等于T的所有组合。
C中的每个数字在一个组合中只能使用一次。
注意：
题目中所有的数字（包括目标数T）都是正整数
组合中的数字 (a 1, a 2, … , a k) 要按非递增排序 (ie, a 1 ≤ a 2 ≤ … ≤ a k).
结果中不能包含重复的组合
例如：给定的候选数集是[10,1,2,7,6,1,5]，目标数是8
解集是：
[1, 7]
[1, 2, 5]
[2, 6]
[1, 1, 6] */

function combin(arr=[],target){
    let res = [],list=[]
    let arrSort = arr.sort((a,b) => {
        return a-b
    })
    bt(res,list,arrSort,target,0)
    return res
}
function bt(res,list,arrSort,target,index){
    if(target === 0){
        res.push(list)
        return
    }else if(target<0){
        return 
    }else{
        for(let i=index; i<arrSort.length; i++){
            if(i>index && arrSort[i] === arrSort[i-1]){
                continue
            }
            list.push(arrSort[i])
            bt(res,list,arrSort,target-arrSort[i],i+1)
            list = []
        }
    }

}

