/*
 * @Author: your name
 * @Date: 2020-07-01 14:15:31
 * @LastEditTime: 2021-07-12 14:04:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/promise/promsieAjax.js
 */
// 基于promise实现ajax请求
const ajaxMise = (url = '', method = 'get', data = {}, async = true, headers = {}) => {
    var xhr = new XMLHttpRequest()
    return new Promise(function(resolve, reject) {
        xhr.open(method, url, async)
        let keys = Object.keys(headers)
        if(keys.length){
            for(let i in keys){
                xhr.setRequestHeader(i,headers[i])
            }  
        }
        xhr.onloadend = function() {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                resolve(xhr)
            } else
                reject({
                    errorType: "status_error",
                    xhr: xhr
                })
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


