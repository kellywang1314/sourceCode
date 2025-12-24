/**
 * @description 多次尝试执行异步任务, 最后一次尝试失败才返回异常结果
 * @param { Function } - 返回Promise的函数
 * @param { number } [count = 3] - 尝试的次数
 * @param { boolean } [isShowLog = false] - 是否开启调试, 打印输出函数重试的次数
 */
function retryAsync ( asyncFn, count = 3, isShowLog ) { 
    const initCount = count
    return new Promise( async ( resolve, reject ) => { 
        while ( count-- ) { 
            try {
                const res = await asyncFn()
                resolve( res )
                break
            } catch ( err ) {
                if ( count === 0 ) { 
                    reject(err)
                }
            } finally { 
                if ( isShowLog ) { 
                    console.log(`${asyncFn.name} retried count ${initCount - count}`)
                }
            }
        }
    })
}

