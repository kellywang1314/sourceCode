
(function(){
    let $file
    let reqdata = []
    let LEN = 10
    let input = document.querySelector('#file')
    let div = document.querySelector('#upload')
    let span = document.querySelector('#text')
    input.onchange = (e) => {this.handleFileChange(e)}
    div.onclick = () => {this.handleUploadFile()}
    
    handleFileChange = (e) => {
        let file =  e.target.files[0]
        if(!file) return
        $file = file
        span.innerHTML = file.name

    }

    createFileChunk = (file, LEN) =>{
        const fileList = []
        const chucksize = Math.ceil(file.size/10)
        let currentsize = 0
        while(currentsize < file.size){
            fileList.push({file:file.slice(currentsize,currentsize+chucksize)})
            currentsize += chucksize
        }
        return fileList
    }

    uploadChunk = async () => {
        const reqList = reqdata
        .map(({chunk,hash})=>{
            let formData = new FormData()
            formData.append('chunk',chunk)
            formData.append('hash',hash)
            formData.append('filename',$file.name)
            return {formData}
        })
        .map(async ({formData}) => {
            fetch({
                method:"POST",
                url:'http://localhost:8080/upload',
                data:formData
            })
        })
       Promise.all(reqList).then(() =>{
        // 上传完成之后，请求合并
        span.innerHTML = '请选择文件'
        setTimeout(() => {
            requestMerge()
           },2000)
       })
    }

    handleUploadFile = async() => {
       if(!$file) return
       const fileChunkList = createFileChunk($file,LEN)
       reqdata = fileChunkList.map(({file},index)=>(
            {
                chunk:file,
                hash:$file.name + '-' + index
            }
       ))
       // 发送请求
       await uploadChunk()
    }

    requestMerge = async() => {
        let filename = $file.name
        fetch({
            method:'POST',
            url:'http://localhost:8080/merge',
            headers:{"content-type":"application/json"},
            data:JSON.stringify({filename:filename})
        }).then((data) => {
            console.log(data)
        })
    }

    fetch = ({
        method,
        url,
        // 这里为什么需要JSON.stringify序列化data：xhr.send()方法要求传入数据格式是字符串/DOM/formData/Blob,不能是对象
        data = {},
        headers = {}
    }) => {
        return new Promise((resolve,reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open(method,url)
            Object.keys(headers).forEach((item) => {
                xhr.setRequestHeader(item,headers[item])
            })
            xhr.send(data)
            xhr.onload = (e) => {
                resolve(e.target.response)
            }
        })   
    }

})(window)