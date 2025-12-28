class eventEmitter{
    constructor(){
        this.handler = {}
    }

    on(eventName,callback) {
        if(!this.handler[eventName]){
            this.handler[eventName] = []
        }
        this.handler[eventName].push(callback)

    }

    emit(eventName){
        if(this.handler[eventName]){
            for(let i=0; i<this.handler[eventName].length; i++){
                this.handler[eventName][i]()
            }
        }
    }
    clear(eventName){
        if(this.handler[eventName]){
            this.handler[eventName] = []
        }
    }
}
let event = new eventEmitter()
event.on('click',() => {console.log('waws')})
setTimeout(() => {
    event.emit('click')
},1000)

//
function isDivView(element) {
    let rect = element.getBoundingClientRect()
    let innerHeight = window.innerHeight
    if(rect.top< innerHeight+100) return true
}
let index = 0 
function check() {
    const doms = document.querySelectorAll('.photo')
    for(let i=index; i<doms.length; i++){
        if(isDivView(dom[i])){
            showRealSrc(dom[i])
            index = i
        }
    }
}
function showRealSrc(element) {
    if(!element.src){
        let dataSrc = element.dataset.dataSrc
        element.src = dataSrc
    }  
}
window.onload = checkImgs
window.addEventListener('scroll',throttle(check))