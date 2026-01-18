// [1,2,[3,4,[6,7,8]],9]

// 直接调用函数
var arr = [1, [2, 3], [4, [5, 6]]]
var arr_flat = arr.flat(Infinity)


// 递归
var arr = [1, [2, 3], [4, [5, 6]]]
function flat(arr = []) {
    let newArr = [];
    arr.map(item => {
        if (Array.isArray(item)) {
            newArr = [...newArr, ...flat(item)]
        } else {
            newArr = [...newArr, item]
        }
    })
    return newArr
}

// 迭代
function flattenArrStack(arr) {
    const stack = [...arr];
    const result = [];
    while (stack.length) {
        const item = stack.pop(); // 从 栈 尾 取 元 素，
        if (Array.isArray(item)) {
            stack.push(...item); // 子数组 元 素入 栈
        } else {
            result.unshift(item); // 保持 原 顺 序
        }
    }
    return result;
}



// 递归reduce
function fn(arr) {
    return arr.reduce((res, element) => {
        let temp = Array.isArray(element) ? fn(element) : element
        return res.concat(temp)
    }, [])
}


// toString
var arr = [1, [2, 3], [4, [5, 6]]]
var arr_flat = arr.toString().split(',') //["1", "2", "3", "4", "5", "6"] 字符串类型的
let arr_flat = arr.toString().split(',').map((val) => {
    return parseInt(val)
})

// 正则匹配
JSON.stringify([1, [2, 3], [4, [5, 6]]]).replace(/\[|\]/g, '')

/**
 * flattenDepthRecursive
 * 函数功能：按指定深度扁平化数组（递归版）
 * @param {any[]} arr 输入数组
 * @param {number} depth 扁平化深度（默认 1；<=0 表示不扁平）
 * @returns {any[]} 扁平化后的新数组
 */
function flattenDepthRecursive(arr = [], depth = 1) {
    if (depth <= 0) return arr.slice();
    const res = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            res.push(...flattenDepthRecursive(item, depth - 1));
        } else {
            res.push(item);
        }
    }
    return res;
}

/**
 * flattenDepthIterative
 * 函数功能：按指定深度扁平化数组（迭代版，一次一层）
 * @param {any[]} arr 输入数组
 * @param {number} depth 扁平化深度
 * @returns {any[]} 扁平化后的新数组
 */
function flattenDepthIterative(arr = [], depth = 1) {
    let res = arr.slice();
    const flattenOneLevel = (a) => a.reduce((acc, cur) => acc.concat(cur), []);
    for (let i = 0; i < depth; i++) {
        if (!res.some(Array.isArray)) break;
        res = flattenOneLevel(res);
    }
    return res;
}

// 示例
// const sample = [1, [2, 3], [4, [5, 6]]];
// console.log(flattenDepthRecursive(sample, 1)); // [1,2,3,4,[5,6]]
// console.log(flattenDepthRecursive(sample, 2)); // [1,2,3,4,5,6]
// console.log(flattenDepthIterative(sample, 2)); // [1,2,3,4,5,6]

/**
 * flattenDepthRecursive
 * 函数功能：按指定深度扁平化数组（递归版）
 * @param {any[]} arr 输入数组
 * @param {number} depth 扁平化深度（默认 1；<=0 表示不扁平）
 * @returns {any[]} 扁平化后的新数组
 */
function flattenDepthRecursive(arr = [], depth = 1) {
    if (depth <= 0) return arr.slice();
    const res = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            res.push(...flattenDepthRecursive(item, depth - 1));
        } else {
            res.push(item);
        }
    }
    return res;
}

// 示例
// const sample = [1, [2, 3], [4, [5, 6]]];
// console.log(flattenDepthRecursive(sample, 1)); // [1,2,3,4,[5,6]]
// console.log(flattenDepthRecursive(sample, 2)); // [1,2,3,4,5,6]
// console.log(flattenDepthIterative(sample, 2)); // [1,2,3,4,5,6]

/**
 * Flat1
 * 函数功能：按指定深度扁平化数组（迭代版，显式栈维护每个元素的剩余深度）
 * 思路：栈元素为 [item, depthLeft]；遇到数组且 depthLeft>0 时展开其子元素并将 depthLeft-1；
 *       其他情况直接输出，保证与原数组顺序一致。
 * @param {any[]} arr 输入数组
 * @param {number} depth 扁平化深度（默认 1；<=0 表示不扁平）
 * @returns {any[]} 扁平化后的新数组
 */
function Flat1(arr = [], depth = 1) {
    if (depth <= 0) return arr.slice();
    const result = [];
    const stack = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        stack.push([arr[i], depth]);
    }
    while (stack.length) {
        const [item, d] = stack.pop();
        if (Array.isArray(item) && d > 0) {
            for (let i = item.length - 1; i >= 0; i--) {
                stack.push([item[i], d - 1]);
            }
        } else {
            result.push(item);
        }
    }
    return result;
}
