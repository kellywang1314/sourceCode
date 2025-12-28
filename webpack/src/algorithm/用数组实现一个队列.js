// 
function Quenen(item){
    this.arr = []
    this.push = function(){
        this.arr.push(item)
    }
    this.pop = function(){
        this.arr.shift(item)
    }
}