import { Provider } from 'mobx-react' 
import * as React from 'react'
import Cal from './component/index'
import Store from './store/index'

const store = {
    store:new Store()
}

export default class MobxTest extends React.Component{

    // 把store注入到Provider中，实现共享
    render(){
        return (
            <Provider {...store}>
                <Cal  />
            </Provider>
        )
    }
}