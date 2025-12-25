/*
 * @Author: your name
 * @Date: 2020-07-14 16:24:35
 * @LastEditTime: 2021-07-09 18:33:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit)
 * @FilePath: /sourceCode/js/柯里化.js
 */
/* 
*
* 柯里化：本质就是把一个参数很多的函数分解成单一参数的多个函数(必包)
* 实际应用：延迟计算；参数复用；动态创建函数
*/
function curry(fn) {
    //去掉curry第一个参数 该参数是后续参数传递结束的一个函数
    let args = [...arguments].slice(1)
    // len表示fn函数的入参数量
    let len = fn.length
    function __curry() {
        args.push(...arguments)
        if (args.length === len) {
            return fn.apply(this, args)
        }
        //否则返回函数继续传参
        return __curry
    }
    //判断是否一次性传完参数如果传完参数则传入参数调用需要调用的函数
    if (args.length === len) {
        return fn.apply(this, [...args])
    } else {
        return __curry
    }
}
function add(a, b, c, d) {
    let res = a + b + c + d
    return res
}
console.log(curry(add, 1, 2, 3, 4));//输出 10
console.log(curry(add, 1, 2, 3)(4));//输出 10

/**
 * createApi
 * 接口请求配置柯里化：按 baseUrl -> token -> path/options 逐层复用参数
 * @param {string} baseUrl 基础域名
 * @returns {(token:string)=> (path:string, options?:object)=> {url:string, options:object}} 工厂函数
 */
function createApi(baseUrl) {
    return function withToken(token) {
        return function makeRequest(path, options = {}) {
            const url = baseUrl.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
            const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            return { url, options: { ...options, headers } }
        }
    }
}

/**
 * createLogger
 * 日志柯里化：先固定 namespace，再固定 level，最后打印
 * @param {string} namespace 命名空间
 * @returns {(level:'log'|'info'|'warn'|'error')=> (...args:any[])=> void} 逐层固定参数的函数
 */
function createLogger(namespace) {
    return function withLevel(level) {
        return function logWithNs(...args) {
            console[level](`[${namespace}]`, ...args)
        }
    }
}

/**
 * bindEvent
 * 事件绑定柯里化：type -> element -> handler，便于在不同元素上复用事件类型
 * @param {string} type 事件类型，如 'click'
 * @returns {(el:Element)=> (handler:Function)=> ()=> void} 返回解绑函数
 */
function bindEvent(type) {
    return function on(el) {
        return function handler(fn) {
            if (el && el.addEventListener) {
                el.addEventListener(type, fn)
                return function unbind() { el.removeEventListener(type, fn) }
            }
            return function noop() { }
        }
    }
}

/**
 * formatCurrencyCurry
 * 价格格式化柯里化：locale -> currency -> amount
 * @param {string} locale 语言区域，如 'zh-CN'
 * @returns {(currency:string)=> (amount:number)=> string} 本地化货币字符串
 */
function formatCurrencyCurry(locale) {
    return function withCurrency(currency) {
        return function formatAmount(amount) {
            return Number(amount).toLocaleString(locale, { style: 'currency', currency })
        }
    }
}

/**
 * buildUrlCurry
 * URL 构建柯里化：base -> path -> query，常用于路由/接口拼接
 * @param {string} base 基础路径
 * @returns {(path:string)=> (query?:Record<string,any>)=> string} URL 字符串
 */
function buildUrlCurry(base) {
    return function withPath(path) {
        return function withQuery(query) {
            const url = base.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
            const qs = query && Object.keys(query).length
                ? '?' + Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
                : ''
            return url + qs
        }
    }
}

/**
 * hasPermissionCurry
 * 权限校验柯里化：userRoles -> requiredRole
 * @param {string[]} userRoles 用户角色列表
 * @returns {(required:string)=> boolean} 是否具备指定角色
 */
function hasPermissionCurry(userRoles) {
    return function need(required) {
        return Array.isArray(userRoles) && userRoles.includes(required)
    }
}

// 使用示例（在实际项目中常见）：
// const api = createApi('https://api.example.com')('token-xxx')
// const req = api('/user/profile', { method: 'GET' })
// const log = createLogger('UserModule')('info'); log('loaded', req.url)
// const price = formatCurrencyCurry('zh-CN')('CNY')(1234.56)
// const url = buildUrlCurry('/v1')('/list')({ page: 1, size: 20 })
// const canEdit = hasPermissionCurry(['admin','editor'])('editor')
