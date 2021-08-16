// 并发控制 https://juejin.cn/post/6844903678906728456
/* 
    原理: 在开发中，我们可能会遇到一些对异步请求数做并发量限制的场景，比如说微信小程序的request并发最多为5个，
    又或者我们需要做一些批量处理的工作，可是我们又不想同时对服务器发出太多请求（可能会对服务器造成比较大的压力）。
    这个时候我们就可以对请求并发数进行限制，并且使用排队机制让请求有序的发送出去。 

    推送任务中：多个推送任务需要做并发控制，否则多个看板（每个看板下多个图表，每个图表绑定查询，维度，时间维度相应接口）同时打开，
    会触发多个query,对服务端造成太大压力
*/

// 利用promise分组，每次利用promise.all执行完一组之后在执行下一组
const requestsLimit = (list, limit, asyncHandle) => {
  return new Promise((resolve) => {
    let _limit = limit;
    let recordList = []; // 记录异步操作
    let index = 0;
    let originListCopy = [].concat(list);
    let asyncList = []; // 正在进行的所有并发异步操作
    const asyncFunc = () => {
      while (_limit--) {
        const data = originListCopy.shift();
        if (data) asyncList.push(asyncHandle(data, index++));
      }
      Promise.all(asyncList).then((response) => {
        // 监听并记录每一次请求的结果
        recordList = recordList.concat(response.filter((item) => item));
        if (originListCopy.length !== 0) {
          _limit = limit;
          asyncList = [];
          asyncFunc(); // 数组还未迭代完，递归继续进行迭代
        } else {
          // 所有并发异步操作都完成后，本次并发控制迭代完成，返回记录结果
          resolve(recordList);
        }
      });
    };
    asyncFunc();
  });
};

var dataLists = [1, 2, 3, 4, 5, 6, 7, 8];
requestsLimit(dataLists, 3, (item, index) => {
  return new Promise((resolve) => {
    // 执行异步处理
    setTimeout(() => {
      // 筛选异步处理的结果
      console.log(index);
      if (item % 2 === 0) resolve({ item, index });
      else resolve();
    }, Math.random() * 5000);
  });
}).then((response) => {
  console.log("finish", response);
});

// 第一种方法不太好，需要等
//省略代码
function limitLoad(urls, handler, limit) {
  // 对数组做一个拷贝
  const sequence = [...urls];
  let promises = [];
  //并发请求到最大数
  promises = sequence.splice(0, limit).map((url, index) => {
    // 这里返回的 index 是任务在 promises 的脚标，
    //用于在 Promise.race 之后找到完成的任务脚标
    return handler(url).then((res) => {
      return index;
    });
  });

  (async function loop() {
    let p = Promise.race(promises);
    for (let i = 0; i < sequence.length; i++) {
      p = p.then((res) => {
        promises[res] = handler(sequence[i]).then(() => {
          return res;
        });
        return Promise.race(promises);
      });
    }
  })();
}
limitLoad(urls, loadImg, 3);


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
  }),new Promise((resolve, reject) => {
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
function limitPromise(urls, limit = 3) {
  // 计数器
  let count = 0;
  // 全局锁
  let lock = [];
  const l = urls.length;
  let result = []
  // 阻塞函数
  function block() {
    let _resolve;
    return new Promise((resolve, reject) => {
      _resolve = resolve;
      // resolve不执行,将其推入lock数组;
      lock.push(_resolve);
    });
  }

  // 叫号机
  function next() {
    lock.length && lock.shift()()
  }

  async function bao(i) {
    if (count >= limit) {
      //超过限制利用await和promise进行阻塞;
      await block();
    }

    if (urls.length > 0) {
      count++;
      let res = await urls.shift()
      result[i] = res
      count--;
      next();
    }
    if(result.length === l){
      return result
    }
  }

  for (let i = 0; i < l; i++) {
    bao(i);
  }

}
