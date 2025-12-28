
// [2,1,3,5,4], 7  => 有重复的注意去重
function getSum(arr=[],sum){
  if(arr.length === 0) return 0
  let arrSort = arr.sort((a,b) => {return a-b})
  let left = 0, right = arr.length-1, res = []
  while(left < right){
    if(arrSort[left]+arrSort[right] > sum){
        right--
    }else if(arrSort[left]+arrSort[right] < sum){
        left++
    }else{
        res.push([arrSort[left],arrSort[right]])
        left++
        right--
    }
  }
  return res
}