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

// 以后就写这个了哈
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
    const lock = []
    const l = urls.length
    const result = new Array(l)
    let done = 0

    // 阻塞：超过并发上限时挂起，等待 next 释放
    function block() {
      let _resolve
      return new Promise((r) => { _resolve = r; lock.push(_resolve) })
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


/**
 * Scheduler
 * 简易并发任务调度器：保持 `maxCount` 并发，队列任务按序入列、完成后补位
 * 用法：new Scheduler(2).add(time, order); scheduler.taskStart();
 */
class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  // add相当于注册promise函数
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue.shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();
