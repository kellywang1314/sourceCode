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
    resolve("childern6");
  }, 0);
}).then((res) => {
  console.log("children7");
  setTimeout(() => {
    console.log(res);
  }, 0);
});

// start
// childern4
// children2
// children3
// children5
// children7
// childern6

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
  await b; //这里被卡了下，没有很理解
  console.log("b");
  resolve();
});
console.log("end");

//promise1
//end
//promise2
//a
//timeout
