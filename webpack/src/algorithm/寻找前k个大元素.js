// 1. 排序，求前k个大的数
function maxK(arr,k){
    return arr.sort((a,b) => b-a).slice(0,k)
}


// 分治
// 假设有 n 个数存在数组 S 中，从数组 S 中随机找一个元素 X，遍历数组，比 X 大的放在 S1 中，比 X 小的放在 S2 中，那么会出现以下三种情况：
// S1 的数字个数等于 K，结束查找，返回 S1;
// S1 的数字个数大于 K，继续在 S1 中找取最大的K个数字;
// S1 的数字个数小于 K，继续在 S2 中找取最大的 K-S1.length 个数字，拼接在 S1 后;
// 这样递归下去，就可以找出答案来了。


const partition = (arr) => {
    const length = arr.length; // 数组长度
  
    const mid = ~~(length / 2); // 取数组中间的位置，可随机
    const middle = arr[mid]; // 数组中间的值
    const maxarr = []; // 比中间值大
    const minarr = []; // 比中间值小
  
    // 数组长度为 2 的要特殊处理
    if (length === 2) {
      maxarr.push(Math.max(arr[0], arr[1]));
      minarr.push(Math.min(arr[0], arr[1]));
    } else {
      arr.forEach((v, i) => {
        if (i !== mid) {
          if (v >= middle) {
            maxarr.push(v);
          } else {
            minarr.push(v);
          }
        }
      })
  
      // 将中间值放到 maxarr 的最后一位
      minarr.push(middle);
    }
  
    return { maxarr, minarr }
  }
  
/**
 * 查找前 K 个最大的元素
 * 
 * @param {number[]} arr - 要查询的数组
 * @param {number} k - 最大个数
 * 
 * @return {number[]}
 */
const findKMax = (arr, k) => {

if (arr.length < k) {
    return arr;
}

// 分割数组
const { maxarr, minarr } = partition(arr);

if (maxarr.length === k) {
    return maxarr;
}

if (maxarr.length > k) {
    return findKMax(maxarr, k);
}

if (maxarr.length < k) {
    return maxarr.concat(findKMax(minarr, k - maxarr.length));
}
}


// 可以取数组的前 K 位构建一个小顶堆（也叫最小堆），
// 这么堆顶就是前 K 位最小的值，然后从 K+1 遍历数组，
//如果小于堆顶，则将其交换，并重新构建堆，使堆顶最小，
// 这么遍历结束后，堆就是最大的 K 位，堆顶是前 K 位的最小值。


