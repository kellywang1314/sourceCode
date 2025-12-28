// 给定一个只包括 '('，')'，'{'，'}'，'['，']'的字符串，判断字符串是否有效。
// 左括号必须用相同类型的右括号闭合。 左括号必须以正确的顺序闭合。 注意空字符串可被认为是有效字符串。

function strDeal(str){
    while(str.length){
        let temp = str
        str.replace('()',"")
        str.replace('{}',"")
        str.replace('[]',"")
        if(temp === str) return false
    }
    return true
}

function isValid(s) {
    let a = [];
    let res=0;
    for(let i=0;i<s.length;i++){
        if(s[i]=='('||s[i]=='{'||s[i]=='['){
            a.push(s[i]);
            res++;
        }
        else if(s[i]==')'){
            if(a[a.length-1]=='('){
               a.pop();
                res--;
            }
            else return false
        }
        else if(s[i]=='}'){
            if(a[a.length-1]=='{'){
               a.pop();
                res--;
            }else return false
        }
        else if(s[i]==']'){
            if(a[a.length-1]=='['){
               a.pop();
                res--;
            }else return false
        }
    }
    return res==0
};


function isValid (s) {
    if (!s) return true;
    let stack = [];
  
    for (let i = 0, len = s.length; i < len; i++) {
      if (!stack.length) stack.push(s[i++]);
      let last = stack[stack.length - 1];
      if ((s[i] === ')' && last === '(') || (s[i] === ']' && last === '[') || (s[i] === '}' && last === '{')) {
        stack.pop()
      } else {
        stack.push(s[i])
      }
    }
  
    return !stack.length;
  };
  
  let test = [
    '([()])',
    '([)(])',
    '(()())'
  ]
  console.log(isValid(test[2]))
