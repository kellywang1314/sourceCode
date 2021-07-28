/*
 * @Author: your name
 * @Date: 2021-07-27 16:34:08
 * @LastEditTime: 2021-07-27 16:39:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/array/数组乱序.js
 */

// 1. set
function unique(arr) {
    return Array.from(new Set(arr));
  }
  
  // 2. 二重循环
  function unique(arr) {
    len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (arr[i] === arr[j]) {
          arr.splice(j, 1);
          j--; // 每删除一个数j的值就减1
          len--; // j值减小时len也要相应减1（减少循环次数，节省性能）
        }
      }
    }
    return arr;
  }
  
  // 3. indexOf/includes
  function unique(arr) {
    var arr1 = []; // 新建一个数组来存放arr中的值
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr1.indexOf(arr[i]) === -1) {
        arr1.push(arr[i]);
      }
    }
    return arr1;
  }
  
  // 4. filter去重
  
  function unique(arr) {
    // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
    return arr.filter(function (item, index) {
      return arr.indexOf(item, 0) === index;
    });
  }
  