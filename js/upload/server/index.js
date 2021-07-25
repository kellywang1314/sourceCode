const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fse = require("fs-extra")
const multiparty = require("multiparty")
const cors = require('cors');
const app = express()
//import { getFileStat } from 'util'
app.use(express.static(__dirname + '/static'))

// 用于处理前端传递的JSON, Raw, Text 和 URL 编码的数据
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// 用于处理 enctype="multipart/form-data"的表单数据
// array()内是你要上传的file类型input标签的name名称
// 上传的文件信息fileInfo数据暂时存放在/upload/temp下，等到写到服务器之后可删除
// app.use(multer({dest:path.resolve(__dirname,'./upload/temp')}).array('file'))

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/client/' + 'index.html')
})

const UPLOAD_DIR = path.resolve(__dirname, './upload')
app.post('/upload', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    // 使用multiparty插件,files 参数保存了 FormData 中文件，fields 参数保存了 FormData 中非文件的字段
    const multipart = new multiparty.Form()
    multipart.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }
        const [chunk] = files.chunk
        const [hash] = fields.hash
        const [filename] = fields.filename
        const chunkDir = path.resolve(UPLOAD_DIR,'./',filename)

        // 切片目录不存在，创建切片目录
        if (!fse.existsSync(chunkDir)) {
            await fse.mkdirs(chunkDir)
        }

        // fs-extra 专用方法，类似 fs.rename 并且跨平台
        // fs-extra 的 rename 方法 windows 平台会有权限问题
        // fs-extra 跨平台比fs好
        // https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
        await fse.move(chunk.path, `${chunkDir}/${hash}`)
        res.end("received file chunk")
    });

    // const fileInfo = req.files
    // console.log(fileInfo)
    // let response,isExits
    // 判断目标路径是否存在，不存在则新建
    // getFileStat(path.resolve(__dirname,'./upload')).then((res)=>{
    //     isExits = res
    // })
    // if(!isExits){
    //     console.log('wa')
    //     fs.mkdir(path.resolve(__dirname,'./upload'))
    // }
    // const des = path.resolve(__dirname,'./upload',fileInfo.originalname) 
    // fs.readFile(fileInfo.path, (err,data) => {
    //     fs.writeFile(des, data,(err) => {
    //         if(err){
    //             console.error(err)
    //         }else{
    //             response = {
    //                 message:'upload success',
    //                 filename:fileInfo.originalname
    //             }

    //         }

    //     })
    // })

})

app.post('/merge', async(req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:8082/')
    let filename = req.body.filename
    const filePath = path.resolve(UPLOAD_DIR, './image',filename)
    await mergeFileChunk(filePath, filename)
    res.send({
        code: 1,
        message: 'merge sucess'
    })

})

//合并函数，这里有个问题，同步下写入之后，删除文件，会出现，文件还没写入就被删了
const mergeFileChunk = async (filePath, filename) => {
    const chunkDir = path.resolve(UPLOAD_DIR,filename)
    const chunkPaths = await fse.readdir(chunkDir)
    console.log( chunkPaths)
    await fse.writeFile(filePath, "");
    chunkPaths.forEach(chunkPath => {   
        fse.appendFileSync(filePath, fse.readFileSync(path.resolve(chunkDir,chunkPath)))

    })
    setTimeout(() => {
        rmdirp(chunkDir)
    }, 10000); // 合并后删除保存切片的目录
}

// 删除一个文件夹
function rmdirp(dir) {
    return new Promise((resolve, reject) => {
        fse.stat(dir, function (err, status) {
            if (status.isDirectory()) { //是文件夹
                fse.readdir(dir, function (err, file) {
                    let res = file.map((item) => rmdirp(path.join(dir, item)))
                    Promise.all(res).then( () => { //当所有的子文件都删除后就删除当前文件夹
                        fse.rmdir(dir, resolve)
                    })
                })
            } else {
                fse.unlink(dir, resolve)
            }
        })
    })
}

app.listen(8080, () => {
    console.log('服务器启动成功')
})


