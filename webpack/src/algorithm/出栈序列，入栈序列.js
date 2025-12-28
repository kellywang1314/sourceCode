/* 输入两个整数序列。其中一个序列表示栈的push顺序，判断另一个序列有没有可能是对应的pop顺序。
为了简单起见，我们假设push序列的任意两个整数都是不相等的。 

核心思路：判断栈顶元素是否等于此时出栈序列的第一个元素，若是，则执行出栈操作，同时指针后移，若否，继续入栈新的元素，继续执行判断操作。
*/

//入栈序列1->2->3->4->5，出栈序列2->3->5->4->1
function isPushPop(arr1=[],arr2=[]){
    if(!arr1.length || !arr2.length || arr1.length === arr2.length ){
        let pushLen = arr1.length
        let popLen = arr2.length
        let stack = []
        let pushIndex = 0, popIndex = 0
        while(pushIndex < pushLen){
            stack.push(arr1[pushIndex])
            pushIndex++
            while(stack.length && (stack.pop() === arr2[popIndex])){
                stack.pop()
                popIndex++
            }
        }
        if(!stack.length && popIndex == popLen){
            return true
        }else{
            return false
        }
    }
}
