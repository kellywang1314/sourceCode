

1. 说说对 TypeScript 中命名空间与模块的理解？区别？
核⼼总结：⼆者核⼼⽬的⼀致，都是解决全局命名冲突，实现代码封装/隔离/复⽤，只是设计规范、作
⽤域、使⽤场景完全不同。
- 命名空间(Namespace)：TS独有语法，ES6⽆此概念；是逻辑层⾯的代码容器，⼀个⽂件可定义多
    个命名空间，内部成员通过 export 暴露，外部通过 /// <reference path="xxx.ts"/> 引⼊；编译后转成全局的⽴即执⾏函数(IIFE)；适合单⽂件内逻辑分类、⽼TS项⽬维护。
- 模块(Module)：TS完全遵循ES6 Module标准规范，⽆⾃定义拓展；核⼼准则是⼀个⽂件就是⼀个
    模块，⽂件级别的物理隔离，成员默认私有，通过 export/import 导⼊导出；编译后可转为ES
    Module/CommonJS等规范；适合⼯程化项⽬、跨⽂件复⽤、团队协作、引⼊第三⽅依赖，是现
    代TS开发的⾸选。
- 核⼼区别
    ◦ 语法归属：命名空间是TS专属，模块是ES6⾏业标准；
    ◦ 作⽤域：命名空间是⽂件内的逻辑隔离，模块是⽂件级的物理隔离；
    ◦ 引⼊⽅式：命名空间⽤三斜杠指令，模块⽤标准 import/export ；
    ◦ ⼯程化：模块完美适配webpack/vite，命名空间⽆依赖管理能⼒。
- 最佳实践：现代TS开发优先⽤模块，命名空间仅作为兜底⽅案，也可在模块内部嵌套命名空间做⼆次分类。

2. 说说你对 typescript 的理解？与 javascript 的区别？
① 对TS的理解
TypeScript 是 JavaScript 的超集（所有JS语法在TS中都能运⾏），由微软开发，核⼼是在JS的基础
上增加了静态类型系统，最终TS代码会被编译成纯JS代码运⾏在浏览器/Node环境中。
TS的设计初衷：解决JS「动态弱类型」带来的类型不明确、语法松散、易出错、维护性差的问题，在代码编写阶段就发现错误，⽽⾮运⾏时。
② TS 与 JS 的核⼼区别
| 对比维度 | TypeScript | JavaScript |
| --- | --- | --- |
| 类型系统 | 静态强类型，编写阶段做类型校验 | 动态弱类型，运行时才会暴露类型问题 |
| 语法规范 | 包含 JS 全部语法，新增：类型、接口、泛型、枚举等 | 只有原生语法，无类型相关能力 |
| 开发体验 | 有代码提示、语法校验、重构友好，大型项目开发效率高 | 无类型提示，调试成本高，适合小项目 |
| 运行方式 | 不能直接运行，必须编译成 JS 后执行 | 可直接在环境中运行 |
| 项目适配 | 适合中大型、多人协作的工程化项目 | 适合小型项目、快速迭代的业务场景 |
| 学习成本 | 高于 JS，需要掌握类型相关语法 | 入门简单，语法灵活 |
③ 补充加分点
TS 完全兼容 JS，⽀持渐进式接⼊，可在现有JS项⽬中逐步替换为TS，⽆迁移成本。

3. Typescript 中泛型是什么？
① 核⼼概念
泛型是TS的核⼼特性，定义：不预先指定具体的类型，⽽是在使⽤的时候再指定类型的⼀种语法，核⼼符号 <T> （T是类型变量，可⾃定义名称）。
② 核⼼作⽤
解决类、接⼝、函数的复⽤性问题，让⼀份代码⽀持多种数据类型，同时保证类型安全，替代 any的万能类型（避免丢失类型校验）。核⼼思想：将类型作为参数传递。
③ 核⼼特点+常⽤语法
- ⽀持泛型约束：通过 extends 限制泛型的类型范围；
- ⽀持泛型默认值：指定泛型的默认类型；
- ⽀持多泛型参数： <T, U, K>
④ 最简⽰例
```ts
// 泛型函数：复⽤性⾼，⽀持任意类型，且类型安全
function getValue<T>(value: T): T {
    return value;
}
getValue<string>("TS"); // 指定类型为字符串
getValue<number>(123); // 指定类型为数字
// 泛型约束：限制泛型必须有length属性
function getLength<T extends { length: number }>(value: T): number {
return value.length;
}
getLength("abc"); // 正确
getLength([1,2,3]); // 正确
```
⑤ 加分点
泛型的使⽤场景：封装通⽤⼯具函数、定义通⽤接⼝/类、封装组件库（React/Vue的TS组件必⽤）。

常用泛型工具函数
- keyof： keyof T的结果为T上已知的公共属性名的联合
- Partial：将T的所有属性都变为可选值
- Required：将T的所有属性都变为必填值
- Pick：从T中选择出⼀个⼦集，构成新的接⼝
- Omit：从T中排除出⼀个⼦集，构成新的接⼝
- Record：将K（键）映射到T（值），构造新的接⼝
- Exclude：从T中排除U（联合类型），构造新的联合类型
- Extract：从T中提取U（联合类型），构造新的联合类型
```ts
interface Person {
    name: string;
    age: number;
    sex: string;
}
let personProps: keyof Person; // 'name' | 'age' | 'sex'
let personProps1: Partial<Person> = { // 所有属性都变为可选值
    name: '小王',
    age: 21,
}
let person: Pick<Person, 'name' | 'age'> = { // 只能包含name和age属性
    name: '小王',
    age: 21,
}
let person1: Omit<Person, 'sex'> = { // 只能包含name和age属性
    name: '小王',
    age: 21,
}
let person2: Record<'name' | 'age', string> = { // 只能包含name和age属性，且值必须为字符串
    name: '小王',
    age: '12',
}
type Mixed = 'a' | 1 | 2 | 'b'
type OnlyNumber = Extract<Mixed, number> // 1 | 2
type OnlyString = Exclude<Mixed, number> // 'a' | 'b'

```

6 请实现下⾯的 myMap ⽅法
实现⼀个模拟数组原⽣ map ⽅法的 myMap 函数，核⼼功能：遍历数组，对每个元素执⾏回调函数，
返回新数组，不改变原数组，TS中⽤泛型实现，保证类型安全，是⾯试⾼频⼿写题。
完整TS实现（⾯试满分答案，含边界处理+泛型约束）
```ts
/**
* 模拟数组map⽅法
* @param arr 源数组
* @param callback 回调函数，参数：当前元素、索引、原数组，返回处理后的值
* @returns 新数组
*/
function myMap<T, U>(arr: T[], callback: (item: T, index: number, arr: T[]) => U): U[] {
    // 边界处理：⾮数组、空数组直接返回空数组
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const newArr: U[] = [];
    for (let i = 0; i < arr.length; i++) {
        // 执⾏回调，将结果推⼊新数组
        newArr.push(callback(arr[i], i, arr));
    }
    return newArr;
}
// 测试⽤例
const arr1 = [1,2,3];
const res1 = myMap(arr1, (item) => item * 2); // [2,4,6]
const arr2 = ["a","b","c"];
const res2 = myMap(arr2, (item, index) => item + index); // ["a0","b1","c2"]
```
核⼼要点
- ⽤泛型 <T,U> ：T是原数组类型，U是新数组类型，保证类型安全；
- 不修改原数组，返回新数组；
- 回调函数参数包含：元素、索引、原数组，和原⽣map⼀致；
- 做边界处理：⾮数组、空数组兼容。

4. TypeScript 中有哪些声明变量的⽅式？
TS 中声明变量的⽅式分为变量声明关键字 和 变量类型声明⽅式 两部分，⾯试需全答，缺⼀不可：
⼀、变量声明的3个关键字（继承JS，优先级区分）
1. var ：全局作⽤域/函数作⽤域，存在变量提升、重复声明、污染全局的问题，TS中不推荐使⽤；
2. let ：块级作⽤域，⽆变量提升，不能重复声明，⽀持暂时性死区，推荐⽇常声明变量；
3. const ：块级作⽤域，声明常量，赋值后不可修改，⽆变量提升，不能重复声明；声明对象/数组
时，引⽤地址不可变，内部属性可修改，推荐声明常量、固定值。

⼆、TS专属的「变量类型声明⽅式」（核⼼考点）
基于 let/const，TS有3种类型声明⽅式，也是变量的类型指定规则：
```ts
// 1. 隐式类型推导：TS⾃动根据赋值推导变量类型，简洁，推荐简单场景使⽤
let name = "张三"; // ⾃动推导为 string 类型，后续不能赋值数字
// 2. 显式类型注解：⼿动指定变量类型，规范，推荐复杂场景/团队协作使⽤
let age: number = 20;
let arr: Array<number> = [1,2,3];
// 3. 类型断⾔：⼿动告诉TS变量的具体类型，解决类型推导不准确的问题，两种语法
let val: unknown = "hello";
let len1 = (val as string).length; // 推荐：as 语法
let len2 = (<string>val).length; // 兼容语法：尖括号
```
总结
TS中优先使⽤ let/const 声明变量，结合「显式类型注解」保证代码规范，尽量避免 var 和类型断⾔的滥⽤。

5. 什么是Typescript的⽅法重载？
① 核⼼概念
⽅法重载（函数重载）：指⼀个函数可以根据传⼊的参数类型/参数个数的不同，执⾏不同的逻辑，并且TS会在编译阶段做参数类型的校验。
• TS的⽅法重载是静态的类型校验能⼒，属于TS语法层⾯的特性；
• JS本⾝没有真正的⽅法重载，只能通过 arguments 判断参数个数/类型模拟重载逻辑，⽆类型校验。
② 核⼼语法
TS的⽅法重载分为两步：1.声明重载签名（只定义参数和返回值，⽆函数体） 2. 实现重载⽅法（写具体逻辑）
③ 必写⽰例
```ts
// 1. 声明重载签名：定义2种⼊参规则
function add(a: number, b: number): number;
function add(a: string, b: string): string;
// 2. 实现重载⽅法：写具体逻辑，参数类型⽤联合类型兼容所有重载场景
function add(a: number | string, b: number | string): number | string {
if (typeof a === "number" && typeof b === "number") {
return a + b;
} else if (typeof a === "string" && typeof b === "string") {
return a + b;
}
throw new Error("参数类型不匹配");
}
// 调⽤：TS会⾃动校验参数类型，匹配对应的重载签名
add(1,2); // √ 正确，返回number
add("1","2"); // √ 正确，返回string
add(1,"2"); // × 报错，⽆此重载签名
```
④ 加分点
重载的核⼼价值：为同⼀个函数提供不同的参数类型约束，提升代码复⽤性和类型安全性，常⽤于封装通⽤⼯具函数。

7. typescript 中的 is 关键字有什么⽤？
① 核⼼概念
is 关键字在TS中称为 类型谓词，是TS的类型守卫核⼼语法，只能⽤在函数的返回值类型注解中。
② 核⼼作⽤
精准判断⼀个变量的具体类型，并告诉TS编译器这个变量的真实类型，让TS在后续的代码中能正确推导类型，实现「类型收窄」，解决 typeof/instanceof 在复杂场景下类型判断不准确的问题。
③ 语法格式
```ts
// 函数返回值：参数名 is 具体类型
function 函数名(参数名: 联合类型): 参数名 is 具体类型 {
    // 类型判断逻辑
    return true/false;
}
```
④ ⾯试必写完整⽰例（⾼频考点）
```ts
// 定义联合类型
type NumOrStr = number | string;
// 使⽤is关键字做类型守卫：判断val是否为string类型
function isString(val: NumOrStr): val is string {
    // 类型判断逻辑
    return typeof val === "string";
}
// 使⽤is关键字做类型守卫：判断val是否为number类型
function isNumber(val: NumOrStr): val is number {
    // 类型判断逻辑
    return typeof val === "number";
}
// 测试：TS能精准推导类型，⽆报错
function handleVal(val: NumOrStr) {
    if (isString(val)) {
        console.log(val.length); // √ val被确定为string类型
    } else if (isNumber(val)) {
        console.log(val.toFixed(2)); // √ val被确定为number类型
    }
}
handleVal("TS");
handleVal(123);
```
⑤ 加分点
is 关键字的核⼼优势：相⽐普通的 return boolean ， is 能永久告诉TS变量的类型，⽽普通布尔值返回⽆法做到精准类型推导；常⽤于复杂联合类型、⾃定义类/接⼝的类型判断。

8. TypeScript ⽀持的访问修饰符有哪些？
① 核⼼概念
访问修饰符是TS为类的属性和⽅法提供的权限控制关键字，作⽤：限制类的成员在「类内部、⼦类、
外部」的访问权限，实现类的封装，TS中共有3个核⼼访问修饰符 + 1个只读修饰符，⾯试需全答。
② 完整访问修饰符列表（含作⽤+⽰例）
```ts
class Person {
    // 1. public 公共修饰符（默认值）
    // 作⽤：类内部、⼦类、外部都可以访问，不写修饰符默认就是public
    public name: string = "张三";
    // 2. private 私有修饰符
    // 作⽤：仅能在「当前类内部」访问，⼦类、外部都不能访问
    private age: number = 20;
    // 3. protected 受保护修饰符
    // 作⽤：能在「当前类内部、⼦类内部」访问，外部不能访问
    protected gender: string = "男";
    // 4. readonly 只读修饰符
    // 作⽤：属性只能赋值⼀次，后续不可修改，只读不影响访问权限
    readonly id: number = 1;
}
class Student extends Person {
    getInfo() {
    console.log(this.name); // √ public ⼦类可访问
    console.log(this.gender); // √ protected ⼦类可访问
    console.log(this.age); // × private ⼦类不可访问
    }
}
const p = new Person();
console.log(p.name); // √ public 外部可访问
console.log(p.gender); // × protected 外部不可访问
console.log(p.age); // × private 外部不可访问
p.id = 2; // × readonly 只读，不可修改
```
③ 补充⾯试⾼频考点
- 访问修饰符的优先级： private > protected > public ；
- TS3.8+新增 私有字段 # ： #age: number = 20 ，⽐ private 更严格，编译后也是真正的私有属性；
- 访问修饰符可⽤于构造函数的参数，简化代码： constructor(public name: string){} 等价于 声明+赋值。

5. interface和type的区别？
核⼼区别
- 定义语法：interface使⽤ interface 关键字定义，type使⽤ type 关键字定义；
- 定义范围：interface只能定义接⼝（属性+⽅法），type可以定义任意类型（基础类型、联合类型、交叉类型等）；
- 实现机制：interface是TS独有的，编译后会被擦除，不影响运⾏时；type是TS的类型别名，编译后会被替换为具体类型，不影响运⾏时。
- 使⽤场景：interface主要⽤于定义接⼝、类的形状，type主要⽤于定义任意类型、联合类型、交叉类型等。

9. 请实现下⾯的 treePath ⽅法
实现 treePath ⽅法，根据指定节点id，查找树形结构中该节点的完整路径（从根节点到⽬标节
点），树形结构是前端⾼频数据结构，递归实现是最优解，TS完整实现。
完整TS实现（⾯试满分答案，递归版+边界处理）
```ts
// 定义树形结构的接⼝
interface TreeNode {
    id: number | string;
    name: string;
    children?: TreeNode[];
}
/**
* 查找树形节点的完整路径
* @param tree 树形数据
* @param targetId ⽬标节点id
* @param path 临时存储路径，⽆需⼿动传参
* @returns ⽬标节点的路径数组 | []
*/
function treePath(tree: TreeNode[], targetId: number | string, path: string[]= []): string[] {
    for (const node of tree) {
        // 将当前节点加⼊路径
        path.push(node.name);
        // 找到⽬标节点，返回路径
        if (node.id === targetId) {
            return path;
        }
        // 有⼦节点，递归查找
        if (node.children && node.children.length > 0) {
            const res = treePath(node.children, targetId, path);
            // 递归找到结果，返回路径
            if (res.length > 0) {
                return res;
            }
        }
        // ⽆结果，回溯：移除当前节点
        path.pop();
    }
    // 未找到⽬标节点，返回空数组
    return [];
}
// 测试⽤例
const tree: TreeNode[] = [
{ id: 1, name: "⼀级菜单1", children: [{ id: 11, name: "⼆级菜单11" }] },
{ id: 2, name: "⼀级菜单2", children: [{ id: 21, name: "⼆级菜单21", children:
[{ id: 211, name: "三级菜单211" }] }] },
];
console.log(treePath(tree, 211)); // ["⼀级菜单2", "⼆级菜单21", "三级菜单211"]
```

12. 请实现下⾯的 myAI ⽅法（笔误：实际为 myApply ⽅法，⾯试⾼频）
前端⾯试⾼频⼿写题：实现模拟原⽣ apply ⽅法的 myApply ， apply 核⼼作⽤：改变函数的this
指向，接收数组形式的参数，同理 myCall （接收零散参数），TS完整实现。
完整TS实现（⾯试满分答案）
```ts
/**
* 模拟原⽣apply⽅法
* @param fn 要执⾏的函数
* @param context this指向的上下⽂
* @param args 数组形式的参数
* @returns 函数执⾏结果
*/
Function.prototype.myApply = function(context: any = window, args: any[] =[]): any {
// 防⽌context为null/undefined，默认指向window
const ctx = context || window;
// ⽣成唯⼀key，避免覆盖原有属性
const fnKey = Symbol("fn");
// 将函数挂载到上下⽂上
ctx[fnKey] = this;
// 执⾏函数，传⼊数组参数
const result = ctx[fnKey](...args);
// 删除挂载的函数，避免污染
delete ctx[fnKey];
// 返回执⾏结果
return result;
};
// 测试⽤例
function fn(a: number, b: number) {
return this.name + a + b;
}
const obj = { name: "张三" };
console.log(fn.myApply(obj, [1,2])); // 张三3
```

17. 如何定义⼀个数组，它的元素可能是字符串类型，也可能是数值类型？
定义「元素为字符串/数字混合类型」的数组，TS中有3种常⽤写法，全答加分，优先级：⽅式1 >⽅式2 > ⽅式3。
⽅式1：联合类型数组（推荐，最简最常⽤）
```ts
// 语法：(string | number)[]
const arr: (string | number)[] = [1, "2", 3, "4"];
```
⽅式2：数组泛型+联合类型（规范，推荐团队协作）
```ts
// 语法：Array<string | number>
const arr: Array<string | number> = [1, "2", 3, "4"];
```
⽅式3：类型别名/接⼝（适合复⽤，复杂场景）
```ts       
// 类型别名
type StrOrNum = string | number;
const arr: StrOrNum[] = [1, "2", 3, "4"];
// 接⼝
interface StrOrNumArr extends Array<string | number> {}
const arr: StrOrNumArr = [1, "2", 3, "4"];
```
联合类型 | 表⽰「或」，可扩展为多个类型： (string | number | boolean)[] 。

20. TypeScript 的内置数据类型有哪些？
TS的内置数据类型分为 基础数据类型 和 引⽤数据类型 两⼤类，⾯试分点背诵，缺⼀不可，是基础⾼频考点。
- 基础数据类型（原始类型，共9个）
1. boolean ：布尔类型，值为true/false；
2. number ：数字类型，包含整数、浮点数、NaN、Infinity；
3. string ：字符串类型，单引号/双引号/反引号；
4. null ：空值类型，只有⼀个值null；
5. undefined ：未定义类型，只有⼀个值undefined；
6. void ：表⽰⽆返回值，常⽤于函数返回值，值为undefined/null；
7. any ：任意类型，关闭TS的类型校验，慎⽤；
8. unknown ：未知类型，安全的any，必须类型收窄才能使⽤；
9. never ：永不存在的类型，常⽤于抛出错误、死循环的函数返回值。
⼆、引⽤数据类型（复合类型，核⼼3个）
1. array ：数组类型，如 number[] 、 string[]
2. tuple ：元组类型，固定⻓度+固定类型的数组，如 [string, number]
3. object ：对象类型，包含普通对象、函数、数组等⾮原始类型。

21. TypeScript 的数据类型有哪些？
⼀、基础数据类型（原始类型，共9个）
boolean 、 number 、 string 、 null 、 undefined 、 void 、 any 、 unknown 、
never 。
⼆、引⽤数据类型（复合类型）
array （数组）、 tuple （元组，固定⻓度数组）、 object （普通对象、函数、数组等）。
三、联合类型 & 交叉类型
• 联合类型： A | B ，表⽰「A或B类型」，如 string | number ；
• 交叉类型： A & B ，表⽰「同时包含A和B的属性」，如 {a: number} & {b: string} 。
四、枚举类型（Enum）
TS独有语法，定义常量集合，如 enum Direction { Up, Down } 。
五、字⾯量类型
指定变量的固定值，如 let a: "男" | "⼥" 、 let b: 1 | 2 | 3 。
六、接⼝ & 类型别名
• 接⼝（ interface ）：定义对象的结构，可拓展、可继承，适合定义复杂对象；
• 类型别名（ type ）：给任意类型起别名，可定义任意类型，适合简单类型复⽤。
（注：⽂档部分内容可能由 AI ⽣成）
七、泛型（Generic）
将类型作为参数传递，实现代码复⽤，如 <T> function fn(val: T): T 。
⼋、函数类型
定义函数的⼊参和返回值类型，如 (a: number, b: number) => number 。
总结
TS的类型体系是「静态强类型」，所有类型的核⼼⽬的都是：保证代码的类型安全，提升开发效率和可维护性。


21. ts any 和 unknown 有什么区别？
核⼼总结（⾯试开篇必说）
unknown 是 TypeScript 3.0 新增的安全版 any，⼆者都表⽰「任意类型」，但unknown的类型约束远强于any，是⾯试最⾼频考点之⼀。
核⼼区别（分点+⽰例，⾯试满分）
- 类型校验规则不同（核⼼）
    ◦ any ：完全关闭TS的类型校验， any 类型的变量可以赋值给任意类型的变量，也可以调⽤任
    意⽅法/属性，⽆任何报错，极易引发运⾏时错误；
    ◦ unknown ：严格的类型校验， unknown 类型的变量不能直接赋值给其他类型变量，也不能
    直接调⽤⽅法/属性，必须先做「类型收窄」（类型判断/断⾔）才能使⽤，是安全的。
- 语法使⽤不同
```ts
// any ⽰例：⽆校验，⻛险⾼
let a: any = 123;
a = "abc";
a(); // √ ⽆报错，运⾏时可能崩溃
let b: string = a; // √ ⽆报错
// unknown ⽰例：有校验，安全
let u: unknown = 123;
u = "abc";
u(); // × 报错，不能直接调⽤⽅法
let s: string = u; // × 报错，不能直接赋值
// unknown 正确使⽤：先类型收窄
if (typeof u === "string") {
let s: string = u; // √ 类型安全
}
```
3. 设计初衷不同
◦ any ：为了兼容JS代码，快速迁移项⽬，是「妥协的产物」；
◦ unknown ：为了替代any，实现「类型安全的任意类型」，是「最优解」。
开发原则：能⽤unknown就不⽤any，unknown兼顾灵活性和类型安全。
22. 如何将 unknown 类型指定为⼀个更具体的类型？
核⼼总结
unknown 是TS的「安全任意类型」，不能直接使⽤，必须通过「类型收窄」的⽅式指定为具体类型，TS中有3种常⽤且合法的⽅式，⾯试全答加分，优先级：⽅式1 > ⽅式2 > ⽅式3。
⽅式1：类型守卫（推荐，最优解，安全）
通过 typeof/instanceof/is/Array.isArray 做类型判断，TS会⾃动推导类型，⽆需⼿动断⾔，最常⽤。
```ts
let val: unknown = "hello TS";
// 1. typeof 判断基础类型
if (typeof val === "string") {
    console.log(val.length); // √ val被指定为string
}
// 2. instanceof 判断引⽤类型
val = [1,2,3];
if (val instanceof Array) {
    console.log(val.push(4)); // √ val被指定为数组
}
// 3. is关键字 ⾃定义类型守卫（最优）
function isNumber(v: unknown): v is number {
    return typeof v === "number";
}
if (isNumber(val)) {
    console.log(val.toFixed(2)); // √ val被指定为number
}
```
⽅式2：类型断⾔（常⽤，⼿动指定，简洁）
通过 as 或 <> ⼿动告诉TS变量的具体类型，适合确定变量类型的场景，注意：断⾔是「欺骗TS编译器」，运⾏时可能出错，慎⽤。
```ts
let val: unknown = "hello TS";
// ⽅式1：as 语法（推荐）
const str1 = val as string;
console.log(str1.length);
// ⽅式2：尖括号语法
const str2 = <string>val;
console.log(str2.length);
```
⽅式3：类型断⾔+⾮空断⾔（拓展，适合复杂场景）
```ts
let val: unknown = { name: "张三" };
const name = (val as { name: string }).name!;
```
24. tsconfig.json ⽂件有什么⽤？
- 核⼼概念
tsconfig.json 是 TypeScript 编译器的核⼼配置⽂件，当TS编译器编译TS代码时，会⾃动读取
该⽂件的配置项，指定编译规则和编译⾏为；如果项⽬根⽬录有该⽂件，说明该项⽬是TS项⽬。
- 核⼼作⽤
1. 指定TS编译的⼊⼝⽂件和编译范围；
2. 指定编译后⽣成的JS代码的⽬标版本（如ES6/ES5）、模块规范（如ES Module/CommonJS）；
3. 配置编译后的JS⽂件的输出⽬录、是否⽣成源码映射⽂件；
4. 开启/关闭TS的严格模式、类型校验规则；
5. 指定项⽬的类型声明⽂件路径、排除不需要编译的⽂件。
- 核⼼常⽤配置项（⾯试⾼频，必背）
```ts
{
    "compilerOptions": {
    "target": "ES6", // 编译后的JS版本
    "module": "ESNext", // 模块规范
    "outDir": "./dist", // JS输出⽬录
    "rootDir": "./src", // TS源码⽬录
    "strict": true, // 开启严格模式（重中之重，推荐开启）
    "esModuleInterop": true,// 兼容CommonJS模块
    "skipLibCheck": true // 跳过第三⽅库的类型校验
    },
    "include": ["./src/**/*"],// 需要编译的⽂件
    "exclude": ["node_modules"]// 排除的⽂件
}
```
如果执⾏ tsc 命令时不带任何参数，TS编译器会⾃动读取 tsconfig.json 的配置；如果带参数（如 tsc index.ts ），则会忽略该⽂件。

25. TypeScript 中的 Declare 关键字有什么⽤？
核⼼概念: declare 关键字是TS的声明关键字，核⼼作⽤：告诉TS编译器「某个变量/函数/类/模块已经存在」，⽆需编译⽣成对应的JS代码，仅做类型校验。declare 关键字通常写在 .d.ts ⽂件中，该⽂件是TS的类型声明⽂件，只存放类型定义，不存放业务逻辑，是TS项⽬的标配。
核⼼特点： declare 只做「类型声明」，不⽣成任何JS代码，编译后会被移除。
核⼼使⽤场景
    1. 声明全局变量：在TS中使⽤未通过 import 引⼊的全局变量，避免报错
    ```ts declare const $: any; // 声明全局变量$，使⽤jQuery时必备```
    2. 声明全局函数：声明全局的函数，仅定义类型，不实现逻辑
    ```ts declare function fn(name: string): string;```
    3. 声明全局类/接⼝：声明全局的类或接⼝，供项⽬全局使⽤
    ```ts declare class Person { name: string; age: number; }```
    4. 声明模块：为⽆类型声明的第三⽅JS库（如⼀些⼩众插件）声明模块，解决「找不到模块」的报错
    ```ts declare module "xxx-plugin"; // 声明该模块，TS不再报错```
    5. 声明⽂件：在 .d.ts 类型声明⽂件中，所有的类型定义都需要⽤ declare （核⼼场景）。

26. 解释⼀下 TypeScript 中的枚举？
核⼼概念: **枚举（Enum）是TS的独有语法**，ES6⽆此概念，核⼼作⽤：定义⼀组有名字的常量集合，将⼀组相关
的常量⽤⼀个枚举名包裹，提升代码可读性和可维护性，避免魔法值。
枚举的分类
TS中有4种枚举，优先级：数字枚举 > 字符串枚举 > 常量枚举 > 异构枚举。
1. 数字枚举（默认）：枚举值为数字，默认从0开始⾃增，可⼿动指定初始值，⽀持反向映射。

```ts
enum Direction { Up, Down, Left, Right } // Up=0, Down=1, Left=2, Right=3
enum Direction { Up, Down, Left, Right } // Up=0, Down=1, Left=2, Right=3
enum Direction { Up=1, Down, Left, Right } // Up=1, Down=2...
```
2. 字符串枚举：枚举值为字符串，⽆反向映射，必须⼿动为每个成员赋值，可读性最强，项⽬中最常⽤。
```ts
enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
```
3. 常量枚举：⽤ const enum 定义，编译后会被完全移除，直接替换为对应的值，性能最优，适合简单场景。
```ts
const enum Color { Red, Green, Blue }
const c = Color.Red; // 编译后：const c = 0;
```
4. 异构枚举：枚举值既有数字⼜有字符串，不推荐使⽤，可读性差。
```ts
enum Mix { A = 1, B = "B" }
```
枚举的核⼼优势：常量集中管理、避免魔法值、代码语义化，常⽤于定义状态码、⽅向、颜⾊、业务
状态等场景。

27. TypeScript 的主要特点是什么？
TypeScript 是JavaScript的超集，核⼼特点总结为6点，优先级从上到下：
1. 静态强类型系统：编写阶段做类型校验，提前发现错误，避免运⾏时类型问题，是TS最核⼼的特
点；
2. 完全兼容JavaScript：所有JS代码都可以直接在TS中运⾏，⽀持渐进式接⼊，⽆迁移成本；
3. 丰富的语法拓展：在JS基础上新增了类型、接⼝、泛型、枚举、命名空间等语法，提升代码的封装性和复⽤性；
4. ⾯向对象编程⽀持：完美⽀持类、继承、多态、访问修饰符等⾯向对象特性，适配⼤型项⽬开发；
5. 优秀的开发体验：配合VSCode等编辑器，提供代码提⽰、语法⾼亮、重构、错误提⽰等功能，提
升开发效率；
6. 强⼤的⽣态兼容：完美适配webpack/vite等⼯程化⼯具，⽀持所有前端框架
（React/Vue/Angular），第三⽅库基本都有TS类型声明。

29. 什么是TypeScript 映射⽂件？
核⼼概念: TS的映射⽂件分为两种，都是TS编译后的产物，核⼼作⽤是源码映射和类型声明，⽂件名分别为.js.map 和 .d.ts ，是TS项⽬的标配，⾯试需全答。
⼀、第⼀类： .js.map 源码映射⽂件
1. ⽣成⽅式：TS编译器编译TS代码为JS代码时，⾃动⽣成的配套⽂件；
2. 核⼼作⽤：将编译后的JS代码映射回原始的TS代码，在浏览器/Node中调试时，能看到TS源码⽽
⾮编译后的JS代码，极⼤提升调试效率；
3. 配置⽅式：在 tsconfig.json 中通过 sourceMap: true 开启⽣成。
⼆、第⼆类： .d.ts 类型声明⽂件（核⼼考点，重中之重）
1. ⽣成⽅式：⼿动编写 或 TS编译器⾃动⽣成，⽂件中只有类型声明，⽆业务逻辑；
2. 核⼼作⽤：
    ◦ 告诉TS编译器项⽬中的「变量、函数、类、接⼝」的类型；
    ◦ 告诉TS编译器项⽬中的 变量、函数、类、接⼝」的类型；
    ◦ 为JS库提供类型声明，让TS能识别JS库的类型；
    ◦ 编译后不会⽣成JS代码，仅做类型校验；
3. 核⼼关键字： .d.ts ⽂件中所有的类型定义都⽤ declare 关键字。
1. 第三⽅库的类型声明⽂件通常在 @types/xxx 包中（如 @types/jquery ）；
2. 现代前端库基本都⾃带 .d.ts ⽂件，⽆需⼿动安装。

