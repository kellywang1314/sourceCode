// - memoize 是“结果缓存”的技术：对同一入参的纯函数，首次计算后将结果存储，再次调用直接返回缓存，避免重复计算。
// - 适合“幂等、可预测”的计算任务；目标是用空间换时间，降低 CPU 与 I/O 开销。

let memoize = function (fn) {
  let cache = {};
  return function (...args) {
    let key = JSON.stringify(args);
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn.apply(this, args);
    }
    return cache[key];
  };
}



