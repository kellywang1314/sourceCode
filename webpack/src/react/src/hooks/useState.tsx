// https://codepen.io/kellywang/pen/ZEZJwBJ
import React from "react";
import { createRoot } from 'react-dom/client'
// 通过数组形式存储有关使用hook的值, 实际使用的是链表
const memorizedState: any = [];
// 初始化指针
let stateCursor = 0;
/**
 * useState
 * 轻量版状态 Hook：支持惰性初始化与函数式更新，并避免不必要的重渲染
 * @param {T | (() => T)} initialState 初始状态或惰性初始化函数
 * @returns {[T, (next: T | ((prev: T) => T)) => void]} 状态与更新函数
 */
export const useState = <T>(initialState: T | (() => T)) => {
  const currentCursor = stateCursor++;
  if (memorizedState[currentCursor] === undefined) {
    memorizedState[currentCursor] =
    typeof initialState === 'function'
      ? (initialState as () => T)()
      : (initialState as T)
  }
    const setState = (value: T | ((prev: T) => T)) => {
        const prev = memorizedState[currentCursor] as T
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
  if (Object.is(prev, next)) return
  memorizedState[currentCursor] = next
  render()
  }
  const snapshot = memorizedState[currentCursor] as T
  stateCursor++
  return [snapshot, setState] as const
}

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [count, setCount] = useState(1);
  const handleClick = () => setCount((pre: any) => pre+1)
  const handleChange = (e: any) => setKeyword(e.target.value)
  return
  <div>
    <label>输入:<input value={keyword} onChange={handleChange} /><span>{keyword}</span></label>
    <div><button onClick={handleClick} >点击: </button><span>{count}</span></div>
  </div>
}

const render = () => {
    stateCursor = 0;
  const container = document.getElementById('react-root') as HTMLElement
  const root = createRoot(container)
  root.render(<App />)
}

  render();



