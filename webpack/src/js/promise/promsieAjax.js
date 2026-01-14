
/**
 * AJAX 原理总结
 * - 使用 XMLHttpRequest（或 fetch）在不重新加载页面的情况下与服务器通信。
 * - 关键流程：
 *   1) 创建 XHR 实例
 *   2) 调用 open(method, url, async) 建立请求配置（第三参控制是否异步）
 *   3) 可选设置请求头 setRequestHeader，并在需要时序列化 data（GET 走查询串，POST 走 body）
 *   4) 发送请求 send(data)
 *   5) 等待事件（onload/onloadend/onreadystatechange），根据 status 判断成功/失败
 * - 核心概念：
 *   - readyState：0-4 阶段（未初始化/已打开/已发送/接收中/完成）
 *   - status：HTTP 状态码，2xx/304 视为成功
 *   - 同源策略与 CORS：跨域需服务端返回 Access-Control-Allow-Origin 等头
 * - Promise 封装：将成功/失败事件映射为 resolve/reject，便于链式调用
 */
/**
 * ajaxMise
 * 函数功能：基于 Promise 封装的 AJAX 请求（XMLHttpRequest）。
 * 参数：
 * - url: string 请求地址
 * - method: string HTTP 方法（GET/POST/PUT/DELETE…）
 * - data: any 请求体或查询参数（GET 建议序列化到 URL）
 * - async: boolean 是否异步（推荐 true）
 * - headers: Record<string,string> 额外请求头
 * 返回：Promise<XMLHttpRequest>
 */
const ajaxMise = (url = '', method = 'get', data = {}, async = true, headers = {}) => {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.open(method, url, async) // 建立连接：method/URL/是否异步
        const keys = Object.keys(headers || {})
        keys.forEach((k) => xhr.setRequestHeader(k, headers[k])) // 设置请求头
        xhr.onloadend = () => {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                resolve(xhr)
            } else {
                reject({
                    errorType: "status_error",
                    xhr: xhr
                })
            }
        }
        xhr.onerror = () => {
            reject({ errorType: "network_error", xhr })
        }
        xhr.ontimeout = () => {
            reject({ errorType: "timeout", xhr })
        }
        xhr.send(data)
    })
}

// 基于promise实现请求图片
const getImage = () => {
    new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            reject('加载错误')
        }
        img.src = src
    })
}


// H5 API fetch
/* 
1. 调用方式不同
2. fetch是基于promise设计的
*/


