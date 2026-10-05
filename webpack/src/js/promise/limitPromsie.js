const urls = [
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(0.5);
    }, 500);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(2);
    }, 2000);
  }), new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(5);
    }, 5000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1.5);
    }, 1500);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 3000);
  })
]
/**
 * limitPromise
 * 计数器 + 阻塞锁实现的并发控制：超过上限时阻塞，空位释放后继续
 * @param {Promise<any>[]} urls 任务 Promise 列表（将被 shift 逐个执行）
 * @param {number} [limit=3] 并发上限
 * @returns {Promise<any[]>|void} 结果数组（按原序填写）
 */
/**
 * limitPromise
 * 并发受限执行并返回结果：保证在并发上限内依次消费 urls（Promise 列表），最终返回按原序的结果数组
 * @param {Promise<any>[]} urls 任务 Promise 列表（将被 shift 逐个执行）
 * @param {number} [limit=3] 并发上限
 * @returns {Promise<any[]>} 最终结果数组（与输入顺序一致）
 */
function limitPromise(urls, limit = 3) {
  return new Promise((resolve, reject) => {
    let count = 0
    let done = 0
    const lock = []
    const l = urls.length
    const result = new Array(l)

    // 阻塞：超过并发上限时挂起，等待 next 释放
    function block() {
      return new Promise((r) => { lock.push(r) })
    }

    // 释放一个阻塞的任务
    function next() { lock.length && lock.shift()() }

    // 执行第 i 个任务，并在完成后写入结果与释放槽位
    async function run(i) {
      try {
        if (count >= limit) await block()
        if (urls.length > 0) {
          count++
          const res = await urls.shift()
          result[i] = res
          count--
          done++
          next()
          if (done === l) resolve(result)
        }
      } catch (e) { reject(e) }
    }

    for (let i = 0; i < l; i++) run(i)
  })
}

limitPromise(urls, 2).then(res => console.log(res))
