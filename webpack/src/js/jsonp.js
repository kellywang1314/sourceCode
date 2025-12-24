/**
 * jsonp
 * 以 JSONP 方式请求跨域数据，动态插入 script 标签并通过全局回调接收数据
 * @param {string} url 请求地址，不包含查询参数
 * @param {Object} data 查询参数对象，会自动追加回调字段
 * @param {string} callback 回调函数名，服务端需按此名称包装响应
 * @returns {Promise<any>} 返回一个 Promise，在回调触发时 resolve 数据
 */
function jsonp(url, data = {}, callback = 'callback') {
    //处理json对象，拼接url
    data.callback = callback
    let params = ''
    for (let key in data) {
        params = `${params}&${key}=${encodeURIComponent(data[key])}`
    }
    const finalUrl = `url?${params}`
    let script = document.createElement('script')
    script.src = finalUrl
    script.onerror = () => {
        try { throw new Error('JSONP script load error') } catch (e) { }
    }
    document.body.appendChild(script)

    //返回Promise
    return new Promise((resolve, reject) => {
        window[callback] = (data) => {
            try {
                resolve(data)
            } catch (e) {
                reject(e)
            } finally {
                //移除script元素
                script.parentNode.removeChild(script)
                try { delete window[callback] } catch (e) { }
            }
        }
    })
}

/**
 * corsFetch
 * 使用 CORS 发起跨域请求，需服务端正确设置 CORS 响应头
 * @param {string} url 请求地址
 * @param {RequestInit} options fetch 选项，支持自定义 headers/method/body
 * @returns {Promise<Response>} fetch 的 Response Promise
 */
function corsFetch(url, options = {}) {
    const init = {
        mode: 'cors',
        credentials: options.credentials || 'omit',
        ...options
    }
    return fetch(url, init)
}

/**
 * proxyRequest
 * 通过同源代理转发跨域请求（如 devServer.proxy 或 Nginx 反向代理）
 * @param {string} path 同源代理路径，如 /api/users
 * @param {RequestInit} options fetch 选项
 * @returns {Promise<Response>} 同源请求的响应
 */
function proxyRequest(path, options = {}) {
    return fetch(path, options)
}

/**
 * postMessageBridge
 * 使用 postMessage 在跨域窗口间传递数据（父子窗口或同源打开的窗口）
 * @param {Window} targetWindow 目标窗口对象，如 iframe.contentWindow
 * @param {string} targetOrigin 目标源限制，例如 'https://example.com'
 * @param {any} payload 要发送的数据
 * @param {number} timeoutMs 超时时间，默认 5000ms
 * @returns {Promise<MessageEvent>} 接收到响应消息时 resolve
 */
function postMessageBridge(targetWindow, targetOrigin, payload, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const handle = (ev) => {
            if (targetOrigin !== '*' && ev.origin !== targetOrigin) return
            window.removeEventListener('message', handle)
            resolve(ev)
        }
        window.addEventListener('message', handle)
        try {
            targetWindow.postMessage(payload, targetOrigin)
        } catch (e) {
            window.removeEventListener('message', handle)
            reject(e)
            return
        }
        const timer = setTimeout(() => {
            window.removeEventListener('message', handle)
            reject(new Error('postMessage timeout'))
        }, timeoutMs)
    })
}

/**
 * websocketConnect
 * 通过 WebSocket 建立跨域连接（由浏览器和服务器同源策略支持，非同源也可）
 * @param {string} url WebSocket 地址，如 wss://example.com/socket
 * @returns {WebSocket} WebSocket 实例
 */
function websocketConnect(url) {
    const ws = new WebSocket(url)
    return ws
}

/**
 * windowNameTransport
 * 使用 window.name 传输跨域数据：远端页面设置 window.name，随后跳转到同源空白页再读取
 * @param {string} url 远端页面地址（需设置 window.name）
 * @param {number} timeoutMs 超时时间，默认 8000ms
 * @returns {Promise<string>} 解析到的 window.name 字符串
 */
function windowNameTransport(url, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        let phase = 0
        const cleanup = () => {
            iframe.onload = null
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
        }
        const timer = setTimeout(() => {
            cleanup()
            reject(new Error('window.name transport timeout'))
        }, timeoutMs)
        iframe.onload = () => {
            if (phase === 0) {
                phase = 1
                iframe.src = 'about:blank'
            } else {
                try {
                    const data = iframe.contentWindow.name
                    clearTimeout(timer)
                    cleanup()
                    resolve(data)
                } catch (e) {
                    clearTimeout(timer)
                    cleanup()
                    reject(e)
                }
            }
        }
        iframe.src = url
        document.body.appendChild(iframe)
    })
}


//请求数据
jsonp('http://photo.sina.cn/aj/index', {
    page: 1,
    cate: 'recommend',
}, 'jsoncallback').then(data => {
    console.log(data)
})



