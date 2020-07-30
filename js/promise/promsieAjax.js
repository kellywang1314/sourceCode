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