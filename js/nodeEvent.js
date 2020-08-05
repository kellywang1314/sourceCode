// node事件基于观察者模式

function nodeEvent(){
    this.on = function(eventName,callback){
        if(!this.handleCallbacks){
            this.handleCallbacks = {}
        }
        if(!this.handleCallbacks[eventName]){
            this.handleCallbacks[eventName] = []
        }
        this.handleCallbacks[eventName].push(callback)
    }

    this.emit = function(eventName,obj){
        if(this.handleCallbacks[eventName]){
            for(let i in this.handleCallbacks[eventName]){
                this.handleCallbacks[eventName][i](obj)
            }
        }
    }

    this.remove = function(eventName, callback) {
        if (this.handleCallbacks[eventName]) {
            this.handleCallbacks[eventName] = this.handleCallbacks[eventName].filter(cb => cb != callback)
        }
    }
    return this
}

var events=new  EventLister()
events.on('say',function(name){
    console.log('Hello',name)
})
events.emit('say','Jony yu')

