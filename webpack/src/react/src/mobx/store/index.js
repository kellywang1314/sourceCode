import { action, computed, observable } from 'mobx'
export default class Store{

    // 被观察者
    @observable num = 0

    // 计算值
    @computed
    get retunum() {
        return `${this.num}`
    }

    @computed
    get addNum() {
        return this.num + 1
    }

    @computed
    get reduceNum() {
        return this.num - 1
    }

    // 使用action更改被观察者
    @action
    add() {
        this.num++ 
    }

    @action
    reduce() {
        this.num--
    }


}
