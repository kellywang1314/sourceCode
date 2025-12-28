import { configureStore } from '@reduxjs/toolkit'
import { reducer, add, less, addBy } from './initState'

/**
 * createAppStore
 * 使用 Redux Toolkit 创建并返回应用级 store
 * @returns {ReturnType<typeof configureStore>} 应用 Store
 */
export function createAppStore() {
    return configureStore({ reducer })
}

export const store = createAppStore()
export { add, less, addBy }

/**
 * selectCounterValue
 * 选择计数器当前值
 * @param {any} state 根状态对象
 * @returns {number} 计数器值
 */
export function selectCounterValue(state) {
    return state.value
}


// const createStore = (action,initState = {}) => {
//   let currentState = initState
//   let listeners = []
//   function getState(){
//     return currentState
//   }
//   function dispatch(action){
//     currentState = action(preState,actioncreateData)
//     listeners.forEach(fn => fn())
//   }
//   function subscribe(fn){
//     listeners.push(fn)
//   }
//   return {getState,dispatch,subscribe}
// }




