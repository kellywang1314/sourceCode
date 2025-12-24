
// 判断文件夹是否存在
export const getFileStat = (path) => {
    return new Promise((resolve,reject) => {
        fs.stat(path, (err,data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data.isDirectory)
            }
        })
    })
}