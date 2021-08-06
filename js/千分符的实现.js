function format(num) {
    var str = num+'';
    return str.split("").reverse().reduce((prev, next, index) => {
      return ((index % 3) ? next : (next + ',')) + prev;
    })
  }
  let num = 1234567890; 
  format(num); //"1,234,567,890"



function format(num) {
    let arr = []
    let str = String(num)
    let count = str.length
  
    while (count >= 3) {
      arr.unshift(str.slice(count - 3, count));
      count -= 3;
    }
  
    // 如果是不是3的倍数就另外追加到上去
    if(str.length % 3) arr.unshift(str.slice(0, str.length % 3));
  
    return arr.toString();
  }
  let num = 1234567890; 
  format(num); //"1,234,567,890"
  



  