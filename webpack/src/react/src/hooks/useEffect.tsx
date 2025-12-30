// https://codepen.io/kellywang/pen/LYvjqoK?editors=1111

import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client'
// 通过数组形式存储有关使用hook的值
const memorizedState: any = [];
// 初始化指针
let stateCursor = 0;
export const useState = (initialState: any) => {
    // 当前指针
    const currentCursor = stateCursor;
    // 赋值
    memorizedState[currentCursor] = memorizedState[currentCursor] || initialState;
    // setfun
    const setState = (value: any) => {
        memorizedState[currentCursor] =
            typeof value === "function" ? value(memorizedState[currentCursor]) : value;
        render();
    }
    stateCursor++;
    return [memorizedState[currentCursor], setState];
}

const useEffect = (callback, deps = []) => {
    // useEffect初始化
    if (!memorizedState[stateCursor]) {
        memorizedState[stateCursor] = deps;
        setTimeout(() => callback(), 0)
    } else {
        // 获取上次依赖项
        const preDeps = memorizedState[stateCursor];
        // 对比最新依赖项和上次依赖项是不是相同,对象进行浅比较
        const hasSame = deps.every((item, index) => preDeps[index] === item)
        if (!hasSame) {
            setTimeout(() => callback(), 0)
            memorizedState[stateCursor] = deps;
        }
    }
    // 更新指针，保证下个hook取到对的值
    stateCursor++
}

const App = () => {
    const [keyword, setKeyword] = useState('');
    const [count, setCount] = useState(1);
    const handleClick = () => setCount((pre) => pre + 1)
    const handleChange = (e) => setKeyword(e.target.value)

    useEffect(() => {
        console.log('wa')
    }, [])

    useEffect(() => {
        console.log('wa1')
    }, [count])

    return <div>
        <label>输入:<input value={keyword} onChange={handleChange} /><span>{keyword}</span></label>
        <div><button onClick={handleClick} >点击: </button><span>{count}</span></div>
    </div>

}

const render = () => {
    stateCursor = 0;
    const container = document.getElementById('react-root')
    const root = createRoot(container)
    root.render(<App />)
}

render();

