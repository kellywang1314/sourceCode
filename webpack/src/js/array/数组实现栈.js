/**
 * Stack
 * 使用数组实现的栈结构，遵循后进先出（LIFO）原则
 * @constructor
 */
class Stack {
    /**
     * constructor
     * 初始化栈存储与栈顶指针
     */
    constructor() {
        this.itemArr = []
        this.top = 0
    }

    /**
     * push
     * 入栈：将元素压入栈顶
     * @param {any} el 入栈元素
     * @returns {any} 返回入栈的元素
     */
    push(el) {
        return this.itemArr[this.top++] = el
    }

    /**
     * pop
     * 出栈：移除并返回栈顶元素
     * @returns {any[]} 返回被移除的元素数组（长度为1）
     */
    pop() {
        return this.itemArr.splice(--this.top, 1)
    }

    /**
     * peek
     * 查看栈顶元素但不移除
     * @returns {any} 栈顶元素；当为空栈时返回 `undefined`
     */
    peek() {
        return this.itemArr[this.top - 1]
    }

    /**
     * size
     * 获取当前栈内元素数量
     * @returns {number} 栈大小
     */
    size() {
        return this.top
    }

    /**
     * min
     * 获取当前栈内的最小值（线性扫描）
     * @returns {number} 最小值；当为空栈时返回 `Infinity`
     */
    min() {
        let temp = this.itemArr.slice()
        let min = +Infinity
        for (let i of temp) {
            if (i < min) {
                min = i
            }
        }
        return min
    }

    /**
     * clear
     * 清空栈：重置大小并清空存储数组
     * @returns {any[]} 清空后的空数组
     */
    clear() {
        this.top = 0
        this.itemArr = []
        return this.itemArr
    }
}

let stack = new Stack()
