// 尽可能的全面正确的解析一个任意 url 的所有参数为 Object
// let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
// parseParam(url)

function parseParam(url){
    url = decodeURIComponent(url)
    let result = {}
    if(!url.includes('?')) return {}
    let res = url.split('?')[1]
    if(res){
        res.split('&').map(item => {
            let temp = item.split('=')
            if( temp[1]){
                result[temp[0]] = temp[1]
            }
        })
    }
    return result
}