// 非常常用的一种方式是转化为json进行解析
function blah(string) { 
    string = string.replace(/\(/g, "["); 
    string = string.replace(/\)/g, "]"); 
    string = string.replace(/[或,且]/g, ",\"$&\",");
    string = string.replace(/[A-Z]/g, "\"$&\""); 
    string = "[" + string + "]"; 
    console.log(string) 
    return JSON.parse(string); 
     
} 

// console.log(blah("((A或B)且(C且D))或E"))
// console.log(blah("(((A或B)且C)且D)或E"))

// 判断数组的层次
let res = blah("((A或B)且(C且D))或E")  

