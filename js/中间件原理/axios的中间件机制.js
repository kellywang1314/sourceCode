// https://juejin.im/post/5e13ea6a6fb9a0482b297e8e
// promise.then链式调用的原理，每个then回调函数作为一个拦截器


// axios中拦截器的应用：可以看到use接受两个函数，类似于then
axios.interceptors.request.use(
    (config) => {
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)


// 拦截器的实现
axios.interceptors = {
    request: [],
    response: []
}

axios.useRequestinterceptors = (resolved,rejected) => {
    axios.interceptors.request.push({
        resolved,rejected
    })
}

axios.useResponseinterceptors = (resolved,rejected) => {
    axios.interceptors.response.push({
        resolved,rejected
    })
}


axios.run = config =>{
    // promsie链，初始值是正常的请求，把它也够造成一个拦截器
    const chain = [
        {
            resolved:axios,
            rejected:undefined
        }
    ]

    axios.interceptors.request.forEach(interceptor => {
        chain.unshift(interceptor)
    })

    axios.interceptors.response.forEach(interceptor => {
        chain.push(interceptor)
    })

    // config包装成一个promsie
    let promise = new Promise(config)

    // 重点代码,// 利用promise.then的能力递归执行所有的拦截器
    while(chain.length){
        let {resolved,rejected} = chain.shift()
        promise = promise.then(resolved,rejected)
    }
    return promsie
}


