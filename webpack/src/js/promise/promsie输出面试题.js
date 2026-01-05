// https://juejin.cn/post/6844904077537574919#heading-3



const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
  .then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })

console.log("start");
setTimeout(() => {
  console.log("children2");
  Promise.resolve().then(() => {
    console.log("children3");
  });
}, 0);
new Promise(function (resolve, reject) {
  console.log("childern4");
  setTimeout(function () {
    console.log("children5");
    resolve("children6");
  }, 0);
}).then((res) => {
  console.log("children7");
  setTimeout(() => {
    console.log(res);
  }, 0);
});

// start  childern4  catch: error  then3:success2  children2  children3 children5 children7 children6

const a = new Promise((resolve, reject) => {
  console.log("promise1");
  resolve();
}).then(() => {
  console.log("promise2");
});

setTimeout(() => {
  console.log("timeout");
});
const b = new Promise(async (resolve, reject) => {
  await a;
  console.log("a");
  // 在 b 的执行器里写了 await b ，这相当于“等待自己完成”。 b 的状态只有在执行到 resolve() 时才会变为已完成，而要到达 resolve() 这行，必须先等 await b 返回。形成自我等待的闭环， b 永远处于 pending 状态，后续的 console.log("b") 和 resolve() 都不会执行。
  await b;
  queueMicrotask(() => {
    console.log("b");
  });
  resolve();
});
console.log("end");

//promise1
//end
//promise2
//a
//timeout
