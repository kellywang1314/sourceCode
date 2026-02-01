
let obj = {
    name: "Yvette",
    age: 18,
    job: 'engineer',
    /**
     * [Symbol.iterator]
     * 功能：使该对象支持迭代协议（for...of、展开运算符等），按自有可枚举键的“值”顺序迭代
     * 说明：
     * - 每次调用返回一个迭代器对象（包含 next 方法），遵循 { value, done } 协议
     * - 使用 Object.keys(self) 获取自有可枚举属性键，再按键顺序产出对应的属性值
     * - 遍历完毕后返回 { value: undefined, done: true } 表示迭代结束
     */
    [Symbol.iterator]() {
        // 迭代源：当前对象
        const self = this;
        // 键列表：仅自有且可枚举的属性键
        const keys = Object.keys(self);
        // 指针：当前迭代到的键索引
        let index = 0;
        // 返回迭代器对象
        return {
            // 迭代步进：返回下一个 { value, done }
            next() {
                if (index < keys.length) {
                    const value = self[keys[index++]];
                    return { value, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
};

