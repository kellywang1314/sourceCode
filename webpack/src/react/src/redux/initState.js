import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
        add(state) { state.value += 1 },
        less(state) { state.value -= 1 },
        addBy(state, action) { state.value += action.payload }
    }
})

/**
 * add
 * 递增计数器
 * @returns {{type:string}} 动作对象
 */
export function add() { return counterSlice.actions.add() }

/**
 * less
 * 递减计数器
 * @returns {{type:string}} 动作对象
 */
export function less() { return counterSlice.actions.less() }

/**
 * addBy
 * 指定加法
 * @param {number} n 增量
 * @returns {{type:string,payload:number}} 动作对象
 */
export function addBy(n) { return counterSlice.actions.addBy(n) }

/**
 * reducer
 * 计数器 reducer
 * @returns {(state:any,action:any)=>any}
 */
export const reducer = counterSlice.reducer