// promise串行
const createPromise = (time) => {
    return () =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('timein' + time)
                resolve();
            }, time * 1000)
        })
}

// promise串行执行
function promiseChain(arr) {
    arr.reduce((pre, next) => {
        // 上一个完成后再执行下一个”的串行效果
        return pre.then(next)
        // 初始值采用 Promise.resolve() ，保证第一个任务立即开始执行
    }, Promise.resolve())
}

// 

const arr = [createPromise(2), createPromise(1), createPromise(3), createPromise(4), createPromise(5)];
promiseChain(arr)



const promise1 = () => Promise.resolve(1)
const promise2 = () => new Promise(resolve => {
    setTimeout(() => { console.log('2'), resolve(2) }, 2000)
})
const promise3 = () => new Promise(resolve => {
    setTimeout(() => { console.log('3'), resolve(3) }, 3000)
})

const list = [promise1, promise2, promise3]
promiseChain(list)

/**
 * serialAsyncFor
 * 使用 async/await for-of 顺序执行并收集结果
 * @param {Array<() => Promise<any>>} tasks 任务函数数组
 * @returns {Promise<any[]>} 结果数组
 */
async function serialAsyncFor(tasks) {
    const results = []
    for (const fn of tasks) {
        const v = await fn()
        results.push(v)
    }
    return results
}

/**
 * serialReduce
 * 使用 reduce 链式串行，完成后返回结果数组
 * @param {Array<() => Promise<any>>} tasks 任务函数数组
 * @returns {Promise<any[]>} 结果数组
 */
function serialReduce(tasks) {
    const results = []
    return tasks
        .reduce((p, fn) => p.then(() => fn().then(v => { results.push(v) })), Promise.resolve())
        .then(() => results)
}

/**
 * serialRecursion
 * 使用递归索引串行执行任务
 * @param {Array<() => Promise<any>>} tasks 任务函数数组
 * @returns {Promise<any[]>} 结果数组
 */
function serialRecursion(tasks) {
    const results = []
    function run(i) {
        if (i >= tasks.length) return Promise.resolve(results)
        return Promise.resolve()
            .then(() => tasks[i]())
            .then(v => {
                results.push(v);
                return run(i + 1)
            })
    }
    return run(0)
}

/**
 * serialWithValue
 * 管道式串行：将上一个结果作为下一个函数的输入
 * @param {Array<(prev:any)=> Promise<any>>} tasks 任务函数数组（接收上一个结果）
 * @param {any} initial 初始值
 * @returns {Promise<any>} 最终结果
 */
function serialWithValue(tasks, initial) {
    return tasks.reduce((p, fn) => p.then(fn), Promise.resolve(initial))
}





