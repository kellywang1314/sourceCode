function jsonp (url,data={},callback='callback') {
    //处理json对象，拼接url
    data.callback = callback
    let params = []
    for(let key in data){
        params.push(key + '=' + data[key])
    }
    let script = document.creatElement('script')
    script.src = url + '?' + params.join('&')
    document.body.appendChild(script)
    
    //返回Promise
    return new Promise ((resolve,reject) => {
       window[callback] = (data) => {
           try{
               resolve (data)
           } catch(e){
               reject(e)
           } finally {
               //移除script元素
               script.parentNode.removeChild(script)
               console.log(script)
           }
       }
    })
}


//请求数据
jsonp('http://photo.sina.cn/aj/index',{
    page:1,
    cate:'recommend',
},'jsoncallback').then(data => {
    console.log(data)
})


