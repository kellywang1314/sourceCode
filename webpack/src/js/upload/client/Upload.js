import React from 'react'
import { Upload, Button, Icon, Progress } from 'antd'
// 单个大文件上传

const LEN = 10
export default class FileUpload extends React.Component {
    constructor() {
        super()
        this.state = {
            uploading: false,
            fileList: [],
            fileChunkList: [],
            reqData: []
        }
        this.reqData = []
    }

    createFileChunk = (file, LEN) => {
        const fileList = []
        const chuckSize = Math.ceil(file.size / 10)
        let currentSize = 0
        while (currentSize < file.size) {
            fileList.push({ file: file.slice(currentSize, currentSize + chuckSize) })
            currentSize += chuckSize
        }
        return fileList
    }

    uploadChunk = async () => {
        const { fileList,reqData } = this.state
        const reqList = reqData
            .map(({ chunk, hash, index }) => {
                let formData = new FormData()
                formData.append('chunk', chunk)
                formData.append('hash', hash)
                formData.append('filename', fileList[0].name)
                return { formData, index }
            })
            .map(async ({ formData, index }) => {
                this.fetch({
                    method: "POST",
                    url: 'http://localhost:8080/upload',
                    data: formData,
                    onProgress: this.handleProgress(reqData[index])
                })
            })
        Promise.all(reqList).then(() => {
            // 上传完成之后，请求合并
            setTimeout(() => {
                this.requestMerge()
            }, 1000)
        })

    }

    handleUploadFile = async () => {
        const { fileList } = this.state
        if (!fileList[0]) return
        const fileChunkList = this.createFileChunk(fileList[0], LEN)
        const reqData = fileChunkList.map(({ file }, index) => (
            {
                chunk: file,
                index,
                hash: fileList[0].name + '-' + index,
                percentage: 0
            }
        ))
        //this.reqData = reqData
        this.setState({
            fileChunkList: fileChunkList,
            reqData: reqData
        })
        // 发送请求
        setTimeout(async() => {
            await this.uploadChunk()
        },0)
    }

    // 监控上传进度
    handleProgress = (item) => {
        return e => {
            item.percentage = parseInt(String((e.loaded / e.total) * 100))
        }
    }

    requestMerge = async () => {
        const { fileList } = this.state
        let filename = fileList[0].name
        this.fetch({
            method: 'POST',
            url: 'http://localhost:8080/merge',
            headers: { "content-type": "application/json" },
            data: JSON.stringify({ filename: filename })
        }).then((data) => {
            console.log(data)
        })
    }

    fetch = ({
        method,
        url,
        // 这里为什么需要JSON.stringify序列化data：xhr.send()方法要求传入数据格式是字符串/DOM/formData/Blob,不能是对象
        data = {},
        headers = {},
        onProgress = e => e,
    }) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.upload.onprogress = onProgress
            xhr.open(method, url)
            Object.keys(headers).forEach((item) => {
                xhr.setRequestHeader(item, headers[item])
            })
            xhr.send(data)
            xhr.onload = (e) => {
                resolve(e.target.response)
            }
        })
    }

    render() {
        const { uploading, fileList,reqData } = this.state
        const props = {
            // 删除文件
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file)
                    const newFileList = state.fileList.slice()
                    newFileList.splice(index, 1)
                    return {
                        fileList: newFileList,
                    }
                })
            },
            // 上传文件之前的钩子，参数为上传的文件
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }))
                return false
            },
            fileList,
        };
        console.log(reqData)
        return (
            <div>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 选择文件
                    </Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleUploadFile}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? '上传中' : '开始上传'}
                </Button>
                <div>
                    {reqData.map((item,index) => {
                        <div key={index}>
                            <div>{item.hash}</div>
                            <div>{(item.chunk.size/1024)}</div>
                            <Progress percent={30} />
                        </div>
                    })}
                    
                </div>
            </div>
        )
    }
}