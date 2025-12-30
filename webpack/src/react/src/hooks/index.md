# react 17中一共定义了14种hooks, 可以根据其有无副作用分为状态hook和副作用hooks
## 状态hooks
  只要能实现数据持久化且没有副作用的hook, 均可以视为状态hook。除了useState之外还包括useContext, useRef, useCallback, useMemo等. 这类Hook内部没有使用useState/useReducer, 但是它们也能实现多次render时, 保持其初始值不变(即数据持久化)且没有任何副作用.
## 副作用hooks
  什么是副作用？是相对于主要作用的，在这里并非指的是负面作用，而是主要作用的补充功能，可以理解为函数内部和外部的互动，日常开发中最常见的副作用是下边这些：
  1. 引用外部变量
  2. 调用外部函数
  3. 修改DOM
  4. 修改全局变量
  5. 计时器
  6. 存储相关
  7. 网络请求
  hooks中最常用的副作用是useEffect


hooks类型定义
export type Hook = {
  memoizedState: any, // 存放hooks链表
  baseState: any, // useState中保存最新的状态
  baseQueue: Update<any, any | null>, // useState中保存最新的更新队列。
  queue: UpdateQueue<any, any | null>, // 待更新队列
  next: Hook | null // 指针
}

