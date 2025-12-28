// 如何实现两个非常大的数字(已经超出了Number范围)的加法运算。

// 我们只要将两个数字前面补0至相同的长度，然后从低位到高位进行相加， 同时用一个变量记录进位的信息即可。

function bigNumberSum(a, b) {
    // 123456789
    // 000009876
  
    let cur = 0;
    while (cur < a.length || cur < b.length) {
      if (!a[cur]) {
        a = "0" + a;
      } else if (!b[cur]) {
        b = "0" + b;
      }
      cur++;
    }
  
    let carried = 0;
    const res = [];
  
    for (let i = a.length - 1; i > -1; i--) {
      const sum = carried + +a[i] + +b[i];
      if (sum > 9) {
        carried = 1;
      } else {
        carried = 0;
      }
      res[i] = sum % 10;
    }
  
    if (carried === 1) {
      res.unshift(1);
    }
  
    return res.join("");
}
