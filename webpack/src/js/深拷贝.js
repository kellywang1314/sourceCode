
// 浅拷贝
function copy(obj) {
    let newObj
    if (typeof obj === 'object') {
        newObj = {}
        for (let i in obj) {
            newObj[i] = obj[i]
        }
    } else {
        newObj = obj
    }
    return newObj
}

// 常用的JSON.parse(JSON.stringfiy(obj))
// 这种方式依赖JSON，因此它不支持JSON不支持的格式的，比如函数/undefined/Date/RegExp等
// 还会丢失原型上的属性
/**
 * deepClone
 * 递归深拷贝对象/数组，处理循环引用
 * @param {any} source 源数据
 * @param {WeakMap<any, any>} cache 引用缓存
 * @returns {any} 拷贝结果
 */
function deepClone(source, cache = new WeakMap()) {
    if (source === null || typeof source !== 'object') return source
    if (cache.has(source)) return cache.get(source)
    const target = Array.isArray(source) ? [] : {}
    cache.set(source, target)
    // for (const key in source) {
    //     if (Object.prototype.hasOwnProperty.call(source, key)) {
    //         target[key] = deepClone(source[key], cache)
    //     }
    // }
    for (let i in source) {
        if (typeof source[i] === 'object') {
            target[i] = deepClone(source[i], cache)
        } else {
            target[i] = source[i]
        }
    }
    return target
}

// 循环引用
const a = {};
a.self = a;


// 测试用例
let a = {
    b: {
        c: [1, 2, 3],
        e: 'wa',
    },
}
/**
 * getDeepObject
 * 递归遍历对象的层级结构，收集所有叶子键的完整路径（以点分隔）
 * @param {object} obj 输入对象
 * @param {string} parentPre 父级路径前缀（默认空字符串）
 * @param {string[]} target 收集结果的数组（内部累积并返回）
 * @returns {string[]} 所有叶子键的路径列表
 */
function getDeepObject(obj, parentPre = '', target = []) {
    for (let key in obj) {
        const childrenObj = obj[key]
        const childrenPre = parentPre + key;
        if (typeof childrenObj === "object") {
            getDeepObject(childrenObj, childrenPre + '.', target)
        } else {
            target.push(childrenPre)
        }
    }
    return target;
}

const obj = {
    a: {
        a1: 123,
        a2: {
            a21: {
                a211: 1
            },
        }
    },
    b: 3
}
getDeepObject(obj) // ["a.a1", "a.a2.a21.a211", "b"] 

