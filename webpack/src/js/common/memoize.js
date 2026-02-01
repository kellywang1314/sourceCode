// - memoize 是“结果缓存”的技术：对同一入参的纯函数，首次计算后将结果存储，再次调用直接返回缓存，避免重复计算。
// - 适合“幂等、可预测”的计算任务；目标是用空间换时间，降低 CPU 与 I/O 开销。

export function memoizeSingleArg(fn) {
  const cache = new Map()
  return function (...args) {
    const key = args[0]
    if (cache.has(key)) return cache.get(key)
    const res = fn.apply(this, args)
    cache.set(key, res)
    return res
  }
}

export function memoizeByJSON(fn) {
  const cache = Object.create(null)
  return function (...args) {
    const key = JSON.stringify(args)
    if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key]
    const res = fn.apply(this, args)
    cache[key] = res
    return res
  }
}

export function memoizeWithResolver(fn, resolver) {
  const cache = new Map()
  return function (...args) {
    const key = resolver(...args)
    if (cache.has(key)) return cache.get(key)
    const res = fn.apply(this, args)
    cache.set(key, res)
    return res
  }
}

export function memoizeDeep(fn) {
  const root = new Map()
  return function (...args) {
    let node = root
    if (args.length === 0) {
      const noArgsKey = Symbol.for('no_args')
      if (node.has(noArgsKey)) return node.get(noArgsKey)
      const res = fn.apply(this, args)
      node.set(noArgsKey, res)
      return res
    }
    for (let i = 0; i < args.length - 1; i++) {
      const k = args[i]
      if (!node.has(k)) node.set(k, new Map())
      node = node.get(k)
    }
    const lastKey = args[args.length - 1]
    if (node.has(lastKey)) return node.get(lastKey)
    const res = fn.apply(this, args)
    node.set(lastKey, res)
    return res
  }
}

