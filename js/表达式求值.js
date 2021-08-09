
// 1. 若为数字-〉进入nums
// 2、若匹配到左括号-〉进栈stack
// 3、匹配到右括号-〉进行检查栈顶的元素是否为左括号，如果不是则进行出栈进入到nums
// 4. 匹配到加减，判断stack栈顶元素是否为(,把不为(的都加入到nums中，
// 5. 匹配到加乘法，把stack栈顶不为+-(的都推到nums中
// 6、stack全部进入nums
// 7. 循环nums计算
function solve( s ) {
    // 利用正则拆分
    //  ["(", 2, "*", "(", 3, "-", 40, ")", ")", "*", 5]
    let results = s.matchAll(/[+\-*()]|[0-9]+/g)
    results=Array.from(results).map(item=>{
        if(Number(item[0])){
            return Number(item[0])
        }else{
            return item[0]
        }
    })
    let stack = []
    let postFix = []
    for(let i=0; i<results.length; i++){
        if(typeof results[i] === 'number'){
            postFix.push(results[i])
        }else if(results[i] == '('){
            stack.push(results[i]);
        }else if(results[i] === '+' || results[i] === '-'){
            while(stack.length && stack[stack.length-1] != '('){
                postFix.push(stack.pop())
            }
            stack.push(results[i])
        }else if(results[i] == ')'){
            while(stack[stack.length-1] != '('){
                postFix.push(stack.pop())
            }
            stack.pop()
        }else if(results[i] == '*'){
            while(stack.length!=0 && stack[stack.length-1]!="("
                 && stack[stack.length-1]!="+" && stack[stack.length-1]!="-"){
                postFix.push(stack.pop())
            }
            stack.push(results[i])
        }
    }
    while(stack.length){
        postFix.push(stack.pop())
    }
    for(let i =0;i<postFix.length;i++){
        if(typeof postFix[i] == 'number'){
            stack.push(postFix[i]);
        }else{
            let a = stack.pop();
            let b = stack.pop();
            switch(postFix[i]){
                case '+':
                    stack.push(a+b);
                    break;
                case '-':
                    stack.push(b-a);
                    break;
                case '*':
                    stack.push(a*b);
                    break;
            }
        }
    }
    return stack.pop(); 
}