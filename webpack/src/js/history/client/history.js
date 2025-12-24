// pushState, replaceState, popState的用法
import routes from './router'
class HistoryRoute{
    constructor(){
        this.dealRoutes()
        this.listenPopState()
        this.listenLink()
    }

    // 处理路由表为合适的数据结构
    dealRoutes() {
        this.routers = new Map()
        routes.map((item) => {
            this.routers.set(item.path,item.content)
        })
    }

    //跳转到path
    pushState(path){
        history.pushState({path},null,path)
        this.dealPathHandler(path)
    }

    //替换为path
    replace(path){
        let allpath = location.pathname + path
        history.replaceState({path},null,path)
        this.dealPathHandler(path)
    }

    //监听popstate,前进后退
    listenPopState(){
        window.addEventListener('popstate',(e)=>{
            let state = e.state || {},
                path = state.path || ''
                console.log(state)
                this.dealPathHandler(path)
        },false)
    }
    //组织a链接的默认行为，让它走pushstate
    listenLink(){
        window.addEventListener('click',(e)=>{
            let dom = e.target
            if(dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')){
                e.preventDefault()
                this.pushState(dom.getAttribute('href'))
            }
            console.log(history)
        },false)

    }
    dealPathHandler(path){
        // 判断当前访问的path是否存在，存在则取出对应的回调函数，并执行
        let handle
        if(this.routers.has(path)){
            handle = this.routerscb[path]
        }else{
            handle = this.routerscb['error']
        }
        try{
            handle.call(this)
        }catch(e){
            console.log(e)
            handle.call(this)
        }
    }

    register(container) {
        this.routerscb = {}
        for(let [key,value] of this.routers.entries()){
            this.routerscb[key] = () => {
                container.innerHTML = value
            }
        }
        //注册一个错误处理函数
        this.routerscb['error'] = () => {
            container.innerHTML = '不存在404'
        }
    }

    load(){
        let path = '/'
        this.dealPathHandler(path)
    }
}

// 项目入口函数
export default function start() {
    const router = new HistoryRoute()
    let container = document.getElementById('container')
    // 注册所有页面的回调函数
    router.register(container)
    router.load()
    
    // 主动触发pushState
    let btn = document.getElementById('btn')
    if(btn){
        btn.onclick = () => router.pushState('/page2')
    }
    
}