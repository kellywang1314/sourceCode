
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
 * 递归深拷贝对象/数组，处理循环引用，并支持 Date、RegExp、Map 和 Set。
 * @param {any} source 源数据
 * @param {WeakMap<any, any>} cache 引用缓存
 * @returns {any} 拷贝结果
 */
export function deepClone(source, cache = new WeakMap()) {
    if (source === null || typeof source !== 'object') return source
    if (cache.has(source)) return cache.get(source)
    // Date
    if (source instanceof Date) {
        const clonedDate = new Date(source.getTime())
        cache.set(source, clonedDate)
        return clonedDate
    }
    // RegExp（保留正则表达式的源与标志，并复制 lastIndex）
    if (source instanceof RegExp) {
        // 例如`/ab+/gi`,- `source.source` ：正则内容，例如`"ab+"`; `source.flags` ：正则修饰符，例如`"gi"`
        const clonedRegExp = new RegExp(source.source, source.flags)
        clonedRegExp.lastIndex = source.lastIndex
        cache.set(source, clonedRegExp)
        return clonedRegExp
    }
    // Map：键和值都需要递归拷贝；先缓存空 Map，避免循环引用导致无限递归
    if (source instanceof Map) {
        const clonedMap = new Map()
        cache.set(source, clonedMap)
        source.forEach((value, key) => {
            clonedMap.set(deepClone(key, cache), deepClone(value, cache))
        })
        return clonedMap
    }
    // Set：递归拷贝每个元素；先缓存空 Set，避免循环引用导致无限递归
    if (source instanceof Set) {
        const clonedSet = new Set()
        cache.set(source, clonedSet)
        source.forEach(value => {
            clonedSet.add(deepClone(value, cache))
        })
        return clonedSet
    }
    const target = Array.isArray(source) ? [] : {}
    cache.set(source, target)
    for (let i in source) {
        const val = source[i]
        target[i] = (val !== null && typeof val === 'object') ? deepClone(val, cache) : val
    }
    return target
}

// 循环引用
const circularObj = {};
circularObj.self = circularObj;


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
