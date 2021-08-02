// 并发控制 https://juejin.cn/post/6844903678906728456
/* 
    原理: 在开发中，我们可能会遇到一些对异步请求数做并发量限制的场景，比如说微信小程序的request并发最多为5个，
    又或者我们需要做一些批量处理的工作，可是我们又不想同时对服务器发出太多请求（可能会对服务器造成比较大的压力）。
    这个时候我们就可以对请求并发数进行限制，并且使用排队机制让请求有序的发送出去。 

    推送任务中：多个推送任务需要做并发控制，否则多个看板（每个看板下多个图表，每个图表绑定查询，维度，时间维度相应接口）同时打开，
    会触发多个query,对服务端造成太大压力
*/


// const pify = require('pify');

class RequestDecorator {
  constructor ({
    maxLimit = 5,
    requestApi,
  }) {
    // 最大并发量
    this.maxLimit = maxLimit;
    // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中
    this.requestQueue = [];
    // 当前并发量数目
    this.currentConcurrent = 0;
    // 使用者定义的请求api，若用户传入needChange2Promise为true,则将用户的callback类api使用pify这个库将其转化为promise类的。
    this.requestApi = requestApi;
    
  }
  // 发起请求api
  async request(...args) {
    // 若当前请求数并发量超过最大并发量限制，则将其阻断在这里。
    // startBlocking会返回一个promise，并将该promise的resolve函数放在this.requestQueue队列里。这样的话，除非这个promise被resolve,否则不会继续向下执行。
    // 当之前发出的请求结果回来/请求失败的时候，则将当前并发量-1,并且调用this.next函数执行队列中的请求
    // 当调用next函数的时候，会从this.requestQueue队列里取出队首的resolve函数并且执行。这样，对应的请求则可以继续向下执行。
    if (this.currentConcurrent >= this.maxLimit) {
      await this.startBlocking();
    }
    try {
      this.currentConcurrent++;
      const result = await this.requestApi(...args);
      console.log(result)
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      console.log('当前并发数:', this.currentConcurrent);
      this.currentConcurrent--;
      this.next();
    }
  }
  // 新建一个promise,并且将该reolsve函数放入到requestQueue队列里。
  // 当调用next函数的时候，会从队列里取出一个resolve函数并执行。
  startBlocking() {
    let _resolve;
    let promise2 = new Promise((resolve, reject) => _resolve = resolve);
    this.requestQueue.push(_resolve);
    return promise2;
  }
  // 从请求队列里取出队首的resolve并执行。
  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    _resolve();
  }
}




// 测试用例
function delay(num, time){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(num)
        },time)
    })
}
  
  // 通过maxLimit设置并发量限制，needChange2Promise将callback类型的请求api转化为promise类型的。
const requestInstance = new RequestDecorator({
    maxLimit: 2,
    requestApi: delay,
    needChange2Promise: false,
});
  
  requestInstance.request(0,100).then(result => console.log('result', result))
  requestInstance.request(1,1000).then(result => console.log('result', result))
  requestInstance.request(2,300).then(result => console.log('result', result))
  requestInstance.request(3,400).then(result => console.log('result', result))
  requestInstance.request(4,500).then(result => console.log('result', result))


// 利用promise分组，每次利用promise.all执行完一组之后在执行下一组
const requestsLimit = (list, limit, asyncHandle) => {
      return new Promise(resolve => {
        let _limit = limit;
        let recordList = []; // 记录异步操作
        let index = 0;
        let originListCopy = [].concat(list);
        let asyncList = []; // 正在进行的所有并发异步操作
        const asyncFunc = () => {
          while(_limit--) {
            const data = originListCopy.shift()
            if (data) asyncList.push(asyncHandle(data, index++)); 
          }
          
          Promise.all(asyncList).then(response => {
            // 监听并记录每一次请求的结果
            recordList = recordList.concat(response.filter(item => item));
            if (originListCopy.length !== 0) {
              _limit = limit;
              asyncList = [];
              asyncFunc() // 数组还未迭代完，递归继续进行迭代
            } else {
              // 所有并发异步操作都完成后，本次并发控制迭代完成，返回记录结果
              resolve(recordList)
            }
          })
        }
        asyncFunc()
      })
}

var dataLists = [1,2,3,4,5,6,7,8];
requestsLimit(dataLists, 3, (item, index) => {
    return new Promise(resolve => {
      // 执行异步处理
      setTimeout(() => {
        // 筛选异步处理的结果
        console.log(index)
        if (item % 2 === 0) resolve({ item, index })
        else resolve()
      }, Math.random() * 5000)  
    });
  }).then(response => {
    console.log('finish', response)
  })




// 第一种方法不太好，需要等
function limitLoad(urls, handler, limit) {
  let sequence = [...urls] // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      return index;
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect.then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then(fastestIndex => { // 获取到已经完成的下标
        	// 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(
            () => {
              return fastestIndex; // 要继续将这个下标返回，以便下一次变量
            }
          );
        })
        .catch(err => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    // 直到urls已经遍历完了，然后将最后三个没有完成的请求(也就是状态没有改变的Promise)用Promise.all()来加载它们。
    .then(() => { 
      return Promise.all(promises);
    });
}
limitLoad(urls, loadImg, 3)
  .then(res => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });


