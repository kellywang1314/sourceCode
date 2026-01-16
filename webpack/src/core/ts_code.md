TypeScript高频30道面试题+标准答案

说明

本文档包含30道TypeScript高频面试题，所有答案均为面试标准答案，精简无冗余、重点突出，概念题分点清晰，编程题带完整TS可运行代码+边界处理，兼顾「理解」和「背诵」，适配中高级前端面试要求。


---
1. 说说对 TypeScript 中命名空间与模块的理解？区别？

答案

核心总结：二者核心目的一致，都是解决全局命名冲突，实现代码封装/隔离/复用，只是设计规范、作用域、使用场景完全不同。

1. 命名空间(Namespace)：TS独有语法，ES6无此概念；是逻辑层面的代码容器，一个文件可定义多个命名空间，内部成员通过export暴露，外部通过/// <reference path="xxx.ts" />引入；编译后转成全局的立即执行函数(IIFE)；适合单文件内逻辑分类、老TS项目维护。

2. 模块(Module)：TS完全遵循ES6 Module标准规范，无自定义拓展；核心准则是一个文件就是一个模块，文件级别的物理隔离，成员默认私有，通过export/import导入导出；编译后可转为ES Module/CommonJS等规范；适合工程化项目、跨文件复用、团队协作、引入第三方依赖，是现代TS开发的首选。

3. 核心区别

  - 语法归属：命名空间是TS专属，模块是ES6行业标准；

  - 作用域：命名空间是文件内的逻辑隔离，模块是文件级的物理隔离；

  - 引入方式：命名空间用三斜杠指令，模块用标准import/export；

  - 工程化：模块完美适配webpack/vite，命名空间无依赖管理能力。

4. 最佳实践：现代TS开发优先用模块，命名空间仅作为兜底方案，也可在模块内部嵌套命名空间做二次分类。


---
2. 说说你对 typescript 的理解？与 javascript 的区别？

答案

① 对TS的理解

TypeScript 是 JavaScript 的超集（所有JS语法在TS中都能运行），由微软开发，核心是在JS的基础上增加了 静态类型系统，最终TS代码会被编译成纯JS代码运行在浏览器/Node环境中。

TS的设计初衷：解决JS「动态弱类型」带来的类型不明确、语法松散、易出错、维护性差的问题，在代码编写阶段就发现错误，而非运行时。

② TS 与 JS 的核心区别

对比维度

TypeScript

JavaScript

类型系统

静态强类型，编写阶段做类型校验

动态弱类型，运行时才会暴露类型问题

语法规范

包含JS全部语法，新增：类型、接口、泛型、枚举等

只有原生语法，无类型相关能力

开发体验

有代码提示、语法校验、重构友好，大型项目开发效率高

无类型提示，调试成本高，适合小项目

运行方式

不能直接运行，必须编译成JS后执行

可直接在环境中运行

项目适配

适合中大型、多人协作的工程化项目

适合小型项目、快速迭代的业务场景

学习成本

高于JS，需要掌握类型相关语法

入门简单，语法灵活

③ 补充加分点

TS 完全兼容 JS，支持渐进式接入，可在现有JS项目中逐步替换为TS，无迁移成本。


---
3. Typescript 中泛型是什么？

答案

① 核心概念

泛型是 TS 的核心特性，定义：不预先指定具体的类型，而是在使用的时候再指定类型的一种语法，英文Generic，核心符号 <T>（T是类型变量，可自定义名称）。

② 核心作用

解决 类、接口、函数的复用性 问题，让一份代码支持多种数据类型，同时保证类型安全，替代any的万能类型（避免丢失类型校验）。

核心思想：将类型作为参数传递。

③ 核心特点+常用语法

- 支持泛型约束：通过extends限制泛型的类型范围；

- 支持泛型默认值：指定泛型的默认类型；

- 支持多泛型参数：<T, U, K>。

④ 最简示例（面试必写）

// 泛型函数：复用性高，支持任意类型，且类型安全
function getValue<T>(value: T): T {
  return value;
}
getValue<string>("TS"); // 指定类型为字符串
getValue<number>(123);  // 指定类型为数字

// 泛型约束：限制泛型必须有length属性
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}
getLength("abc"); // 正确
getLength([1,2,3]); // 正确

⑤ 面试加分点

泛型的使用场景：封装通用工具函数、定义通用接口/类、封装组件库（React/Vue的TS组件必用）。


---
4. TypeScript 中有哪些声明变量的方式？

答案

TS 中声明变量的方式分为 变量声明关键字 和 变量类型声明方式 两部分，面试需全答，缺一不可：

一、变量声明的3个关键字（继承JS，优先级区分）

1. var：全局作用域/函数作用域，存在变量提升、重复声明、污染全局的问题，TS中不推荐使用；

2. let：块级作用域，无变量提升，不能重复声明，支持暂时性死区，推荐日常声明变量；

3. const：块级作用域，声明常量，赋值后不可修改，无变量提升，不能重复声明；声明对象/数组时，引用地址不可变，内部属性可修改，推荐声明常量、固定值。

二、TS专属的「变量类型声明方式」（核心考点）

基于let/const，TS有3种类型声明方式，也是变量的类型指定规则：

1. 隐式类型推导：TS自动根据赋值推导变量类型，简洁，推荐简单场景使用

let name = "张三"; // 自动推导为 string 类型，后续不能赋值数字

2. 显式类型注解：手动指定变量类型，规范，推荐复杂场景/团队协作使用

let age: number = 20;
let arr: Array<number> = [1,2,3];

3. 类型断言：手动告诉TS变量的具体类型，解决类型推导不准确的问题，两种语法

let val: unknown = "hello";
let len1 = (val as string).length; // 推荐：as 语法
let len2 = (<string>val).length;   // 兼容语法：尖括号

面试总结

TS中优先使用 let/const 声明变量，结合「显式类型注解」保证代码规范，尽量避免var和类型断言的滥用。


---
5. 什么是Typescript的方法重载？

答案

① 核心概念

方法重载（函数重载）：指 一个函数可以根据传入的参数类型/参数个数的不同，执行不同的逻辑，并且TS会在编译阶段做参数类型的校验。

- TS的方法重载是静态的类型校验能力，属于TS语法层面的特性；

- JS本身没有真正的方法重载，只能通过arguments判断参数个数/类型模拟重载逻辑，无类型校验。

② 核心语法

TS的方法重载分为两步：1. 声明重载签名（只定义参数和返回值，无函数体） 2. 实现重载方法（写具体逻辑）

③ 面试必写示例

// 1. 声明重载签名：定义2种入参规则
function add(a: number, b: number): number;
function add(a: string, b: string): string;

// 2. 实现重载方法：写具体逻辑，参数类型用联合类型兼容所有重载场景
function add(a: number | string, b: number | string): number | string {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  } else if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  throw new Error("参数类型不匹配");
}

// 调用：TS会自动校验参数类型，匹配对应的重载签名
add(1,2); // √ 正确，返回number
add("1","2"); // √ 正确，返回string
add(1,"2"); // × 报错，无此重载签名

④ 面试加分点

重载的核心价值：为同一个函数提供不同的参数类型约束，提升代码复用性和类型安全性，常用于封装通用工具函数。


---
6. 请实现下面的 sleep 方法

答案

需求说明

实现一个sleep方法，作用：延迟指定时间后执行后续逻辑，TS中最常用、最优的实现是「Promise+async/await」版本，面试必写此版本，兼容性最好，无回调地狱。

实现方式一：Promise 核心版（推荐，面试满分答案）

/**
 * 延迟执行方法
 * @param time 延迟时间，单位：毫秒
 * @returns Promise<void>
 */
function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 调用方式：配合async/await
async function test() {
  console.log("开始");
  await sleep(2000); // 延迟2秒
  console.log("结束");
}
test();

实现方式二：定时器回调版（备用，兼容无Promise环境）

function sleep(time: number, callback: () => void) {
  setTimeout(callback, time);
}
// 调用
sleep(2000, () => {
  console.log("延迟2秒执行");
});


---
7. typescript 中的 is 关键字有什么用？

答案

① 核心概念

is关键字在TS中称为 类型谓词，是TS的类型守卫核心语法，只能用在函数的返回值类型注解中。

② 核心作用

精准判断一个变量的具体类型，并告诉TS编译器这个变量的真实类型，让TS在后续的代码中能正确推导类型，实现「类型收窄」，解决typeof/instanceof在复杂场景下类型判断不准确的问题。

③ 语法格式

// 函数返回值：参数名 is 具体类型
function 函数名(参数名: 联合类型): 参数名 is 具体类型 {
  // 类型判断逻辑
  return true/false;
}

④ 面试必写完整示例（高频考点）

// 定义联合类型
type NumOrStr = number | string;

// 使用is关键字做类型守卫：判断val是否为string类型
function isString(val: NumOrStr): val is string {
  return typeof val === "string";
}

// 使用is关键字做类型守卫：判断val是否为number类型
function isNumber(val: NumOrStr): val is number {
  return typeof val === "number";
}

// 测试：TS能精准推导类型，无报错
function handleVal(val: NumOrStr) {
  if (isString(val)) {
    console.log(val.length); // √ val被确定为string类型
  } else if (isNumber(val)) {
    console.log(val.toFixed(2)); // √ val被确定为number类型
  }
}
handleVal("TS");
handleVal(123);

⑤ 面试加分点

is关键字的核心优势：相比普通的return boolean，is能永久告诉TS变量的类型，而普通布尔值返回无法做到精准类型推导；常用于复杂联合类型、自定义类/接口的类型判断。


---
8. TypeScript 支持的访问修饰符有哪些？

答案

① 核心概念

访问修饰符是TS为类的属性和方法提供的权限控制关键字，作用：限制类的成员在「类内部、子类、外部」的访问权限，实现类的封装，TS中共有3个核心访问修饰符 + 1个只读修饰符，面试需全答。

② 完整访问修饰符列表（含作用+示例）

class Person {
  // 1. public 公共修饰符（默认值）
  // 作用：类内部、子类、外部都可以访问，不写修饰符默认就是public
  public name: string = "张三";

  // 2. private 私有修饰符
  // 作用：仅能在「当前类内部」访问，子类、外部都不能访问
  private age: number = 20;

  // 3. protected 受保护修饰符
  // 作用：能在「当前类内部、子类内部」访问，外部不能访问
  protected gender: string = "男";

  // 4. readonly 只读修饰符
  // 作用：属性只能赋值一次，后续不可修改，只读不影响访问权限
  readonly id: number = 1;
}

class Student extends Person {
  getInfo() {
    console.log(this.name); // √ public 子类可访问
    console.log(this.gender); // √ protected 子类可访问
    console.log(this.age); // × private 子类不可访问
  }
}

const p = new Person();
console.log(p.name); // √ public 外部可访问
console.log(p.gender); // × protected 外部不可访问
console.log(p.age); // × private 外部不可访问
p.id = 2; // × readonly 只读，不可修改

③ 补充面试高频考点

1. 访问修饰符的优先级：private > protected > public；

2. TS3.8+新增 私有字段#：#age: number = 20，比private更严格，编译后也是真正的私有属性；

3. 访问修饰符可用于构造函数的参数，简化代码：constructor(public name: string) {} 等价于 声明+赋值。


---
9. 请实现下面的 myMap 方法

答案

需求说明

实现一个模拟数组原生map方法的myMap函数，核心功能：遍历数组，对每个元素执行回调函数，返回新数组，不改变原数组，TS中用泛型实现，保证类型安全，是面试高频手写题。

完整TS实现（面试满分答案，含边界处理+泛型约束）

/**
 * 模拟数组map方法
 * @param arr 源数组
 * @param callback 回调函数，参数：当前元素、索引、原数组，返回处理后的值
 * @returns 新数组
 */
function myMap<T, U>(arr: T[], callback: (item: T, index: number, arr: T[]) => U): U[] {
  // 边界处理：非数组、空数组直接返回空数组
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const newArr: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    // 执行回调，将结果推入新数组
    newArr.push(callback(arr[i], i, arr));
  }
  return newArr;
}

// 测试用例
const arr1 = [1,2,3];
const res1 = myMap(arr1, (item) => item * 2); // [2,4,6]

const arr2 = ["a","b","c"];
const res2 = myMap(arr2, (item, index) => item + index); // ["a0","b1","c2"]

核心要点

1. 用泛型<T,U>：T是原数组类型，U是新数组类型，保证类型安全；

2. 不修改原数组，返回新数组；

3. 回调函数参数包含：元素、索引、原数组，和原生map一致；

4. 做边界处理：非数组、空数组兼容。


---
10. 请实现下面的 treePath 方法

答案

需求说明

实现treePath方法，根据指定节点id，查找树形结构中该节点的完整路径（从根节点到目标节点），树形结构是前端高频数据结构，递归实现是最优解，TS完整实现。

完整TS实现（面试满分答案，递归版+边界处理）

// 定义树形结构的接口
interface TreeNode {
  id: number | string;
  name: string;
  children?: TreeNode[];
}

/**
 * 查找树形节点的完整路径
 * @param tree 树形数据
 * @param targetId 目标节点id
 * @param path 临时存储路径，无需手动传参
 * @returns 目标节点的路径数组 | []
 */
function treePath(tree: TreeNode[], targetId: number | string, path: string[] = []): string[] {
  for (const node of tree) {
    // 将当前节点加入路径
    path.push(node.name);
    // 找到目标节点，返回路径
    if (node.id === targetId) {
      return path;
    }
    // 有子节点，递归查找
    if (node.children && node.children.length > 0) {
      const res = treePath(node.children, targetId, path);
      // 递归找到结果，返回路径
      if (res.length > 0) {
        return res;
      }
    }
    // 无结果，回溯：移除当前节点
    path.pop();
  }
  // 未找到目标节点，返回空数组
  return [];
}

// 测试用例
const tree: TreeNode[] = [
  { id: 1, name: "一级菜单1", children: [{ id: 11, name: "二级菜单11" }] },
  { id: 2, name: "一级菜单2", children: [{ id: 21, name: "二级菜单21", children: [{ id: 211, name: "三级菜单211" }] }] },
];
console.log(treePath(tree, 211)); // ["一级菜单2", "二级菜单21", "三级菜单211"]


---
11. 请实现下面的 product 方法

答案

需求说明

实现product方法，计算一个数字数组中所有元素的乘积，TS实现，含边界处理：空数组、元素为0、负数、单元素数组。

完整TS实现（面试满分答案）

/**
 * 计算数组元素的乘积
 * @param arr 数字数组
 * @returns 乘积结果
 */
function product(arr: number[]): number {
  // 边界处理：空数组返回 0
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  // 初始值为1，遍历相乘
  return arr.reduce((prev, curr) => prev * curr, 1);
}

// 测试用例
product([1,2,3]); // 6
product([0,1,2]); // 0
product([-1,-2,3]); // 6
product([5]); //5
product([]); //0


---
12. 请实现下面的 myAI 方法（笔误：实际为 myApply 方法，面试高频）

答案

需求说明

前端面试高频手写题：实现模拟原生apply方法的myApply，apply核心作用：改变函数的this指向，接收数组形式的参数，同理myCall（接收零散参数），TS完整实现。

完整TS实现（面试满分答案）

/**
 * 模拟原生apply方法
 * @param fn 要执行的函数
 * @param context this指向的上下文
 * @param args 数组形式的参数
 * @returns 函数执行结果
 */
Function.prototype.myApply = function(context: any = window, args: any[] = []): any {
  // 防止context为null/undefined，默认指向window
  const ctx = context || window;
  // 生成唯一key，避免覆盖原有属性
  const fnKey = Symbol("fn");
  // 将函数挂载到上下文上
  ctx[fnKey] = this;
  // 执行函数，传入数组参数
  const result = ctx[fnKey](...args);
  // 删除挂载的函数，避免污染
  delete ctx[fnKey];
  // 返回执行结果
  return result;
};

// 测试用例
function fn(a: number, b: number) {
  return this.name + a + b;
}
const obj = { name: "张三" };
console.log(fn.myApply(obj, [1,2])); // 张三3


---
13. 请实现下面的 sum 方法

答案

需求说明

面试有2种高频sum需求，均需掌握，TS分别实现，含边界处理。

实现一：数字求和（两个/多个数字）

// 方式1：两个数字求和
function sum(a: number, b: number): number {
  return a + b;
}

// 方式2：多个数字求和（剩余参数）
function sum(...args: number[]): number {
  return args.reduce((prev, curr) => prev + curr, 0);
}

实现二：数组求和（含多维数组扁平化求和，高频考点）

/**
 * 数组求和，兼容多维数组
 * @param arr 数字数组（支持多维）
 * @returns 总和
 */
function sum(arr: any[]): number {
  let total = 0;
  arr.forEach(item => {
    if (Array.isArray(item)) {
      total += sum(item); // 递归扁平化
    } else if (typeof item === "number") {
      total += item;
    }
  });
  return total;
}
// 测试
sum([1,2,[3,4,[5]]]); // 15


---
14. 请实现下面的 mergeArray 方法

答案

需求说明

实现mergeArray方法，数组合并+去重，前端面试高频，分2种场景：基础类型数组（数字/字符串）、对象数组，TS均实现，满足所有面试要求。

实现一：基础类型数组合并去重（推荐，面试满分）

/**
 * 数组合并并去重（数字/字符串）
 * @param arrs 多个数组
 * @returns 去重后的新数组
 */
function mergeArray<T>(...arrs: T[][]): T[] {
  // 合并所有数组 + Set去重 + 转数组
  return [...new Set([].concat(...arrs))];
}
// 测试
mergeArray([1,2,3], [2,3,4], [4,5,6]); // [1,2,3,4,5,6]
mergeArray(["a","b"], ["b","c"]); // ["a","b","c"]

实现二：对象数组去重（按指定属性去重，高频拓展）

/**
 * 对象数组合并去重
 * @param arrs 多个对象数组
 * @param key 去重的属性名
 * @returns 去重后的新数组
 */
function mergeArray<T>(arrs: T[][], key: keyof T): T[] {
  const map = new Map();
  const merged = [].concat(...arrs);
  return merged.filter(item => {
    const val = item[key];
    if (!map.has(val)) {
      map.set(val, true);
      return true;
    }
    return false;
  });
}
// 测试
mergeArray([[{id:1,name:"a"}],[{id:1,name:"a"},{id:2,name:"b"}]], "id"); // [{id:1,name:"a"},{id:2,name:"b"}]


---
15. 实现下面的 firstSinglechar 方法

答案

需求说明

实现firstSinglechar方法，查找字符串中第一个只出现一次的字符，返回该字符，无则返回空字符串，TS实现，两种解法，面试写第一种即可。

实现一：哈希表（推荐，时间复杂度O(n)，面试满分）

/**
 * 查找第一个只出现一次的字符
 * @param str 目标字符串
 * @returns 第一个唯一字符 | ''
 */
function firstSinglechar(str: string): string {
  if (str.length === 0) return "";
  const map = new Map<string, number>();
  // 统计每个字符出现的次数
  for (const char of str) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  // 遍历字符串，找第一个次数为1的字符
  for (const char of str) {
    if (map.get(char) === 1) {
      return char;
    }
  }
  // 无唯一字符
  return "";
}
// 测试
firstSinglechar("abaccdeff"); // "b"
firstSinglechar("aabbcc"); // ""


---
16. 实现下面的 reverseword 方法

答案

需求说明

实现reverseword方法，反转字符串中的单词，要求：移除首尾空格、单词间多个空格只保留一个、单词顺序反转，TS实现，面试最优解。

完整TS实现（面试满分答案）

/**
 * 反转字符串中的单词
 * @param str 目标字符串
 * @returns 反转后的字符串
 */
function reverseword(str: string): string {
  // 步骤：1.去除首尾空格 2.按空格分割成数组（过滤空字符串）3.反转数组 4.拼接成字符串
  return str.trim().split(/\s+/).reverse().join(" ");
}
// 测试
reverseword("  hello world  "); // "world hello"
reverseword("the sky is blue"); // "blue is sky the"
reverseword("a good   example"); // "example good a"


---
17. 如何定义一个数组，它的元素可能是字符串类型，也可能是数值类型？

答案

需求说明

定义「元素为字符串/数字混合类型」的数组，TS中有3种常用写法，面试全答加分，优先级：方式1 > 方式2 > 方式3。

方式1：联合类型数组（推荐，最简最常用）

// 语法：(string | number)[]
const arr: (string | number)[] = [1, "2", 3, "4"];

方式2：数组泛型+联合类型（规范，推荐团队协作）

// 语法：Array<string | number>
const arr: Array<string | number> = [1, "2", 3, "4"];

方式3：类型别名/接口（适合复用，复杂场景）

// 类型别名
type StrOrNum = string | number;
const arr: StrOrNum[] = [1, "2", 3, "4"];

// 接口
interface StrOrNumArr extends Array<string | number> {}
const arr: StrOrNumArr = [1, "2", 3, "4"];

面试补充

联合类型|表示「或」，可扩展为多个类型：(string | number | boolean)[]。


---
18. 请补充 objToArray 函数

答案

需求说明

实现objToArray方法，对象转数组，前端有2种高频业务场景，均为面试考点，TS全实现，含泛型保证类型安全。

场景一：对象转「值数组」（最常用，取对象的所有value组成数组）

/**
 * 对象转值数组
 * @param obj 源对象
 * @returns 值数组
 */
function objToArray<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj);
}
// 测试
objToArray({name: "张三", age: 20}); // ["张三", 20]

场景二：对象转「键值对二维数组」（取key+value组成二维数组）

/**
 * 对象转键值对二维数组
 * @param obj 源对象
 * @returns 键值对数组
 */
function objToArray<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj);
}
// 测试
objToArray({name: "张三", age: 20}); // [["name", "张三"], ["age", 20]]


---
19. 使用 TS 实现一个判断传入参数是否是数组类型的方法（与23题重复，合并答案）

答案

需求说明

实现一个方法，精准判断入参是否为数组类型，TS中有4种实现方式，面试写前2种即可，优先级：方式1 > 方式2 > 方式3 > 方式4。

方式1：Array.isArray（推荐，最优解，精准判断所有数组）

function isArray<T>(val: T): val is T[] {
  return Array.isArray(val);
}

方式2：Object.prototype.toString.call（万能类型判断，精准度最高）

function isArray<T>(val: T): val is T[] {
  return Object.prototype.toString.call(val) === "[object Array]";
}

方式3：typeof + instanceof（有缺陷，不推荐，仅作补充）

function isArray(val: any): boolean {
  return typeof val === "object" && val instanceof Array;
}

方式4：结合is关键字（类型守卫，推荐复杂场景）

// 面试满分写法：类型守卫+精准判断
function isArray(val: unknown): val is any[] {
  return Array.isArray(val);
}
// 调用
if (isArray([1,2,3])) {
  console.log(val.length); // √ 类型安全
}


---
20. TypeScript 的内置数据类型有哪些？

答案

TS的内置数据类型分为 基础数据类型 和 引用数据类型 两大类，面试分点背诵，缺一不可，是基础高频考点。

一、基础数据类型（原始类型，共9个）

1. boolean：布尔类型，值为true/false；

2. number：数字类型，包含整数、浮点数、NaN、Infinity；

3. string：字符串类型，单引号/双引号/反引号；

4. null：空值类型，只有一个值null；

5. undefined：未定义类型，只有一个值undefined；

6. void：表示无返回值，常用于函数返回值，值为undefined/null；

7. any：任意类型，关闭TS的类型校验，慎用；

8. unknown：未知类型，安全的any，必须类型收窄才能使用；

9. never：永不存在的类型，常用于抛出错误、死循环的函数返回值。

二、引用数据类型（复合类型，核心3个）

1. array：数组类型，如number[]、string[]；

2. tuple：元组类型，固定长度+固定类型的数组，如[string, number]；

3. object：对象类型，包含普通对象、函数、数组等非原始类型。


---
21. ts any 和 unknown 有什么区别？

答案

核心总结（面试开篇必说）

unknown 是 TypeScript 3.0 新增的安全版 any，二者都表示「任意类型」，但unknown的类型约束远强于any，是面试最高频考点之一。

核心区别（分点+示例，面试满分）

1. 类型校验规则不同（核心）

  - any：完全关闭TS的类型校验，any类型的变量可以赋值给任意类型的变量，也可以调用任意方法/属性，无任何报错，极易引发运行时错误；

  - unknown：严格的类型校验，unknown类型的变量不能直接赋值给其他类型变量，也不能直接调用方法/属性，必须先做「类型收窄」（类型判断/断言）才能使用，是安全的。

2. 语法使用不同

// any 示例：无校验，风险高
let a: any = 123;
a = "abc";
a(); // √ 无报错，运行时可能崩溃
let b: string = a; // √ 无报错

// unknown 示例：有校验，安全
let u: unknown = 123;
u = "abc";
u(); // × 报错，不能直接调用方法
let s: string = u; // × 报错，不能直接赋值

// unknown 正确使用：先类型收窄
if (typeof u === "string") {
  let s: string = u; // √ 类型安全
}

3. 设计初衷不同

  - any：为了兼容JS代码，快速迁移项目，是「妥协的产物」；

  - unknown：为了替代any，实现「类型安全的任意类型」，是「最优解」。

面试加分总结

开发原则：能用unknown就不用any，unknown兼顾灵活性和类型安全。


---
22. 如何将 unknown 类型指定为一个更具体的类型？

答案

核心总结

unknown是TS的「安全任意类型」，不能直接使用，必须通过「类型收窄」的方式指定为具体类型，TS中有3种常用且合法的方式，面试全答加分，优先级：方式1 > 方式2 > 方式3。

方式1：类型守卫（推荐，最优解，安全）

通过typeof/instanceof/is/Array.isArray做类型判断，TS会自动推导类型，无需手动断言，最常用。

let val: unknown = "hello TS";
// 1. typeof 判断基础类型
if (typeof val === "string") {
  console.log(val.length); // √ val被指定为string
}

// 2. instanceof 判断引用类型
val = [1,2,3];
if (val instanceof Array) {
  console.log(val.push(4)); // √ val被指定为数组
}

// 3. is关键字 自定义类型守卫（最优）
function isNumber(v: unknown): v is number {
  return typeof v === "number";
}
if (isNumber(val)) {
  console.log(val.toFixed(2)); // √ val被指定为number
}

方式2：类型断言（常用，手动指定，简洁）

通过as或<>手动告诉TS变量的具体类型，适合确定变量类型的场景，注意：断言是「欺骗TS编译器」，运行时可能出错，慎用。

let val: unknown = "hello TS";
// 方式1：as 语法（推荐）
const str1 = val as string;
console.log(str1.length);

// 方式2：尖括号语法
const str2 = <string>val;
console.log(str2.length);

方式3：类型断言+非空断言（拓展，适合复杂场景）

let val: unknown = { name: "张三" };
const name = (val as { name: string }).name!;


---
24. tsconfig.json 文件有什么用？

答案

核心概念

tsconfig.json 是 TypeScript 编译器的核心配置文件，当TS编译器编译TS代码时，会自动读取该文件的配置项，指定编译规则和编译行为；如果项目根目录有该文件，说明该项目是TS项目。

核心作用（面试分点背诵，必答）

1. 指定TS编译的入口文件和编译范围；

2. 指定编译后生成的JS代码的目标版本（如ES6/ES5）、模块规范（如ES Module/CommonJS）；

3. 配置编译后的JS文件的输出目录、是否生成源码映射文件；

4. 开启/关闭TS的严格模式、类型校验规则；

5. 指定项目的类型声明文件路径、排除不需要编译的文件。

核心常用配置项（面试高频，必背）

{
  "compilerOptions": {
    "target": "ES6",        // 编译后的JS版本
    "module": "ESNext",     // 模块规范
    "outDir": "./dist",     // JS输出目录
    "rootDir": "./src",     // TS源码目录
    "strict": true,         // 开启严格模式（重中之重，推荐开启）
    "esModuleInterop": true,// 兼容CommonJS模块
    "skipLibCheck": true    // 跳过第三方库的类型校验
  },
  "include": ["./src/**/*"],// 需要编译的文件
  "exclude": ["node_modules"]// 排除的文件
}

面试加分点

如果执行tsc命令时不带任何参数，TS编译器会自动读取tsconfig.json的配置；如果带参数（如tsc index.ts），则会忽略该文件。


---
25. TypeScript 中的 Declare 关键字有什么用？

答案

核心概念

declare 关键字是TS的声明关键字，核心作用：告诉TS编译器「某个变量/函数/类/模块已经存在」，无需编译生成对应的JS代码，仅做类型校验。

核心特点：declare 只做「类型声明」，不生成任何JS代码，编译后会被移除。

核心使用场景（面试分点背诵，必答，高频）

1. 声明全局变量：在TS中使用未通过import引入的全局变量，避免报错

declare const $: any; // 声明全局变量$，使用jQuery时必备

2. 声明全局函数：声明全局的函数，仅定义类型，不实现逻辑

declare function fn(name: string): string;

3. 声明全局类/接口：声明全局的类或接口，供项目全局使用

declare class Person { name: string; age: number; }

4. 声明模块：为无类型声明的第三方JS库（如一些小众插件）声明模块，解决「找不到模块」的报错

declare module "xxx-plugin"; // 声明该模块，TS不再报错

5. 声明文件：在.d.ts类型声明文件中，所有的类型定义都需要用declare（核心场景）。

面试加分点

declare 关键字通常写在 .d.ts 文件中，该文件是TS的类型声明文件，只存放类型定义，不存放业务逻辑，是TS项目的标配。


---
26. 解释一下 TypeScript 中的枚举？

答案

核心概念

枚举（Enum）是TS的独有语法，ES6无此概念，核心作用：定义一组有名字的常量集合，将一组相关的常量用一个枚举名包裹，提升代码可读性和可维护性，避免魔法值。

枚举的分类（面试分点+示例，必答，4类）

TS中有4种枚举，优先级：数字枚举 > 字符串枚举 > 常量枚举 > 异构枚举。

1. 数字枚举（默认）：枚举值为数字，默认从0开始自增，可手动指定初始值，支持反向映射。

enum Direction { Up, Down, Left, Right } // Up=0, Down=1, Left=2, Right=3
enum Direction { Up=1, Down, Left, Right } // Up=1, Down=2...
console.log(Direction.Up); // 1
console.log(Direction[1]); // Up 反向映射

2. 字符串枚举：枚举值为字符串，无反向映射，必须手动为每个成员赋值，可读性最强，项目中最常用。

enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }

3. 常量枚举：用const enum定义，编译后会被完全移除，直接替换为对应的值，性能最优，适合简单的常量场景。

const enum Color { Red, Green, Blue }
const c = Color.Red; // 编译后：const c = 0;

4. 异构枚举：枚举值既有数字又有字符串，不推荐使用，可读性差。

enum Mix { A = 1, B = "B" }

面试加分点

枚举的核心优势：常量集中管理、避免魔法值、代码语义化，常用于定义状态码、方向、颜色、业务状态等场景。


---
27. TypeScript 的主要特点是什么？

答案

答案（面试分点背诵，简洁精准，满分答案）

TypeScript 是JavaScript的超集，核心特点总结为6点，优先级从上到下：

1. 静态强类型系统：编写阶段做类型校验，提前发现错误，避免运行时类型问题，是TS最核心的特点；

2. 完全兼容JavaScript：所有JS代码都可以直接在TS中运行，支持渐进式接入，无迁移成本；

3. 丰富的语法拓展：在JS基础上新增了类型、接口、泛型、枚举、命名空间等语法，提升代码的封装性和复用性；

4. 面向对象编程支持：完美支持类、继承、多态、访问修饰符等面向对象特性，适配大型项目开发；

5. 优秀的开发体验：配合VSCode等编辑器，提供代码提示、语法高亮、重构、错误提示等功能，提升开发效率；

6. 强大的生态兼容：完美适配webpack/vite等工程化工具，支持所有前端框架（React/Vue/Angular），第三方库基本都有TS类型声明。


---
28. TypeScript 中的方法重写是什么？

答案

核心概念

方法重写（Override）：是面向对象的特性，指 子类继承父类后，重新实现父类中同名的方法，覆盖父类的方法逻辑，方法的「方法名、参数列表、返回值类型」必须和父类保持一致。

核心区别（面试必答，重中之重）

方法重写 ≠ 方法重载，二者是完全不同的概念：

- 方法重写：父子类之间，方法名相同、参数相同、逻辑不同，是「纵向的继承关系」；

- 方法重载：同一个类中，方法名相同、参数不同，是「横向的同级关系」。

面试必写示例

class Parent {
  // 父类方法
  sayHello(name: string): string {
    return `父类：你好${name}`;
  }
}

class Child extends Parent {
  // 子类重写父类的sayHello方法
  sayHello(name: string): string {
    return `子类：你好${name}`;
  }
}

const child = new Child();
console.log(child.sayHello("张三")); // 子类：你好张三

面试加分点

方法重写的核心价值：实现多态特性，子类可以根据自身需求定制父类的方法逻辑，提升代码的灵活性。


---
29. 什么是TypeScript 映射文件？

答案

核心概念

TS的映射文件分为两种，都是TS编译后的产物，核心作用是源码映射和类型声明，文件名分别为 .js.map 和 .d.ts，是TS项目的标配，面试需全答。

一、第一类：.js.map 源码映射文件

1. 生成方式：TS编译器编译TS代码为JS代码时，自动生成的配套文件；

2. 核心作用：将编译后的JS代码映射回原始的TS代码，在浏览器/Node中调试时，能看到TS源码而非编译后的JS代码，极大提升调试效率；

3. 配置方式：在tsconfig.json中通过sourceMap: true开启生成。

二、第二类：.d.ts 类型声明文件（核心考点，重中之重）

1. 生成方式：手动编写 或 TS编译器自动生成，文件中只有类型声明，无业务逻辑；

2. 核心作用：

  - 告诉TS编译器项目中的「变量、函数、类、接口」的类型；

  - 为JS库提供类型声明，让TS能识别JS库的类型；

  - 编译后不会生成JS代码，仅做类型校验；

3. 核心关键字：.d.ts文件中所有的类型定义都用declare关键字。

面试加分点

1. 第三方库的类型声明文件通常在@types/xxx包中（如@types/jquery）；

2. 现代前端库基本都自带.d.ts文件，无需手动安装。


---
30. TypeScript 中的类型有哪些？

答案

核心总结（面试分点背诵，最全最清晰，满分答案）

TS的类型体系非常完善，所有类型分为 8大类，包含了TS的所有核心类型，是基础高频考点，必须全答：

一、基础数据类型（原始类型，共9个）

boolean、number、string、null、undefined、void、any、unknown、never。

二、引用数据类型（复合类型）

array（数组）、tuple（元组，固定长度数组）、object（普通对象、函数、数组等）。

三、联合类型 & 交叉类型

- 联合类型：A | B，表示「A或B类型」，如string | number；

- 交叉类型：A & B，表示「同时包含A和B的属性」，如{a: number} & {b: string}。

四、枚举类型（Enum）

TS独有语法，定义常量集合，如enum Direction { Up, Down }。

五、字面量类型

指定变量的固定值，如let a: "男" | "女"、let b: 1 | 2 | 3。

六、接口 & 类型别名

- 接口（interface）：定义对象的结构，可拓展、可继承，适合定义复杂对象；

- 类型别名（type）：给任意类型起别名，可定义任意类型，适合简单类型复用。

七、泛型（Generic）

将类型作为参数传递，实现代码复用，如<T> function fn(val: T): T。

八、函数类型

定义函数的入参和返回值类型，如(a: number, b: number) => number。

面试加分总结

TS的类型体系是「静态强类型」，所有类型的核心目的都是：保证代码的类型安全，提升开发效率和可维护性。
