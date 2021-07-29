
/* parseInt(string,radix)的参数radix必须介于2~36之间，
而且字符串string中的数字不能大于radix才能正确返回数字结果值。

radix，可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。
如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。
如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。

*/

const arr = ['-10','0','3','4','5','NaN','NaN110']
arr.map(parseInt)