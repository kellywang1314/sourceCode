

                                    // interface和type
// 1. interface 只能定义对象类型, 而 type 声明可以声明任何类型，包括基础类型、联合类型或交叉类型。
// 2. 接口可以 extends、implements,从而扩展多个接口或类。类型没有扩展功能，只能交叉合并
// 联合类型
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
type Shape = Square | Rectangle;

function area(s: Shape) {
    if (s.kind === "square") {
        console.log(s.size * s.size)
    }
    else { 
        console.log(s.width * s.height);
    }
}
// kind = 'rectangle' 只能跟width, height
area({kind:"rectangle",width:12,height:13})
area({kind:"square",size:12 })

// 泛型

function getVal(val) {
    return val
}
getVal(1) // 返回数字类型
getVal('1') // 返回字符串类型
getVal(['2']) // 返回数组类型

// 面对上面的函数传入的参数类型不同的情况，但是这里的T可以是多种，需要进一步约束
function getValValue<T>(val: T): T {
    return val;
}

// 泛型约束
type Params=  string | number | any[];
function getValValue2<T extends Params>(val: T): T {
    return val;
}

// 多个参数是范型
function getName<T,U> (name: T, id: U): [T, U] {
    return [name, id]
}
getName('peen', 1);
getName('peen', '222'); // 正常
// getName<string, number>('peen', '22'); // 报错: '22'不是number类型


// 1. keyof， keyof T的结果为T上已知的公共属性名的联合
interface Person {
    name: string;
    age: number;
}
let personProps: keyof Person; // 'name' | 'age'

// 2. 使用 Partial 将所有的 props 属性都变为可选值

// 3. Pick<T,K>，从 T 中取出一系列 K 的属性

interface Person {
    name: string,
    age: number,
    sex: string,
  }
  let person: Pick<Person, 'name' | 'age'> = {
    name: '小王',
    age: 21,
  }

  // 4. Record<K,T>，将 K 中所有的属性的值转化为 T 类型
  let person1: Record<'name' | 'age', string> = {
    name: '小王',
    age: '12',
  }
  





