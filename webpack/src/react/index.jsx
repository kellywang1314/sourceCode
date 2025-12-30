import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useStateForSelft } from './src/hooks/useState.js'
// import GarfishDemoApp from './src/grafish/test.jsx'


const store = createCounterStore()

/**
 * App
 * React 根组件示例：展示同步批量更新 flushSync 与基础状态
 * @returns {JSX.Element} 组件节点
 */
function App() {
  const [keyword, setKeyword] = useStateForSelft('');
  const [count, setCount] = useStateForSelft(1);
  const handleClick = () => setCount((pre) => pre + 1)
  const handleChange = (e) => setKeyword(e.target.value)
  return (
    <div className="App" style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>React 18 本地运行</h1>
      <label>输入: <input value={keyword} onChange={handleChange} /> <span>{keyword} </span></label >
      <div><button onClick={handleClick} > 点击: </button><span>{count}</span > </div>
    </div>
  )
}

/**
 * CounterRedux
 * 使用 react-redux 的 hooks 与 redux 目录下的 store/actions
 * @returns {JSX.Element} 组件节点
 */
function CounterRedux() {
  const dispatch = useDispatch()
  const value = useSelector(selectCounterValue)
  return (
    <div style={{ marginTop: 16 }}>
      <h2>React-Redux 示例</h2>
      <p>值：{value}</p>
      <button onClick={() => dispatch(add())}>+1</button>
      <button onClick={() => dispatch(less())}>-1</button>
      <button onClick={() => dispatch(addBy(5))}>+5</button>
    </div>
  )
}

/**
 * renderApp
 * 在页面上的 `#react-root` 节点渲染 React 应用
 * @returns {void}
 */
/**
 * renderApp
 * 使用 Provider 将应用包裹并渲染到根节点
 * @returns {void}
 */
function renderApp() {
  const container = document.getElementById('react-root')
  const root = createRoot(container)
  root.render(<Provider store={store}><App /></Provider>)
}

renderApp()
