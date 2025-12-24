function Stack(){
    this.itemArr=[]
    this.top=0//初始化栈顶位置为0
}

Stack.prototype={
    push:function(el){
        return this.itemArr[this.top++]=el
    },
    pop:function(){
        return this.itemArr.splice(--this.top,1)
    },
    peek:function(){
        return this.itemArr[this.top-1]
    },
    size:function(){
        return this.top
    },
    min:function(){
        let temp = this.itemArr.slice()
        let min = +Infinity
        for(let i of temp){
            if(i<min){
                min = i
            }
        }
        return min
    },
    clear:function(){
        this.top=0
        this.itemArr=[]
        return this.itemArr
    }
}

let stack = new Stack()