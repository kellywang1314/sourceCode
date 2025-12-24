/**
 * 示例对象
 * 用于演示如何通过深度冻结防止对象及其嵌套属性被修改
 */
const myObj = {
  a: 1,
  b: 'hello',
  c: [0, 1, 2],
  d: { e: 1, f: 2 }
};

/**
 * deepFreeze
 * 递归调用 Object.freeze 深度冻结对象，阻止对对象及其嵌套属性的增删改
 * 在非严格模式下，非法赋值将被静默忽略；严格模式下会抛出 TypeError
 * @param {object} obj 目标对象
 * @returns {object} 冻结后的同一对象引用
 */
const deepFreeze = obj => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
};

deepFreeze(myObj);

// 以下赋值在非严格模式下将被忽略（不生效），严格模式下会抛出异常
myObj.a = 10;
myObj.b = 'hi';
myObj.c[1] = 4;
myObj.d.e = 0;


