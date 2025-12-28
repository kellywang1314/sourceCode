import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'

/**
 * App
 * React 根组件示例：展示同步批量更新 flushSync 与基础状态
 * @returns {JSX.Element} 组件节点
 */
function App() {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)

  /**
   * handleClick
   * 使用 flushSync 强制同步刷新两次状态更新
   * @returns {void}
   */
  function handleClick() {
    flushSync(() => { setCount(c => c + 1) })
    flushSync(() => { setCount2(c => c + 1) })
  }

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>React 18 本地运行</h1>
      <button onClick={handleClick}>点击</button>
      <span>count:{count}</span>
      <span>count2:{count2}</span>
    </div>
  )
}

/**
 * renderApp
 * 在页面上的 `#react-root` 节点渲染 React 应用
 * @returns {void}
 */
function renderApp() {
  const container = document.getElementById('react-root')
  const root = createRoot(container)
  root.render(<App />)
}

renderApp()
