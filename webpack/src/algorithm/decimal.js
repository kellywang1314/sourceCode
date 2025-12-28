// js实现进制转换

// 十进制转二进制
function decimalToBinary(decNumber) {
    // 使用数组模拟栈
    const remStack = []
    let number = decNumber
    let rem
    let binaryString = ''
    while (number > 0) {
      // 获得余数为2的数
      rem = Math.floor(number % 2)
      // 把2的余数放入栈中
      remStack.push(rem)
      // 把传入的十进制数与2整除
      number = Math.floor(number / 2)
    }
    if(remStack.length!=0) {
      // 用 pop 方法把栈中的元素都移除，再组成一个字符串
      binaryString = remStack.join('')
    }
  
    return binaryString
  }


// 任意进制的转换
// decNumber 为传入的要转换的十进制数字
// base: 要转成的进制类型
function baseConverter(decNumber, base) {
    // 创建 Stack 类
    const remStack = []
    // 定义一个进制位数，这里设置了 36 位进制，可自定义位数
    let number = decNumber
    let rem
    let baseString = ''
    if (!(base >= 2 && base <= 36)) {
      return ''
    }
    while (number > 0) {
      rem = Math.floor(number % base)
      remStack.push(rem)
      number = Math.floor(number / base)
    }
    if (remStack.length != 0) {
      // 对栈中的数字做转化
      binaryString = remStack.join('')
    }
    return baseString
  }

  // 10进制转为16进制，使用位运算
  function decimalToABC(decNumber) {
    let i, temp, res
    for( i = 7; i >= 0; i-- ){
        // //和 1111(二进制) 进行与运算，得到十六进制的最后一位,右移四位，继续与运算。
        temp = ( decNumber >> 4 * i ) & 15
        if(temp > 9){
            console.log(temp-10+'A')
           res = temp-10+'A'
        }else{
            console.log(temp)
            res = temp
        }
    }
    return res
  }


  
