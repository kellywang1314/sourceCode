/*
 * @Author: your name
 * @Date: 2020-07-31 19:45:41
 * @LastEditTime: 2021-07-23 15:08:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/js设计模式/单例模式.js
 */

// 单例模式 : 引用第三方库; 本地存储localstoage
class LoginForm {
    constructor() {
       this.instance = null
    }
    static get getInstance(){
        if(!this.instance){
            this.instance = new LoginForm()
        }
        return this.instance
    }
    show() {
        console.log('登录框显示成功')
    }
    hide() {
        console.log('登录框隐藏成功')
    }
 }
 let obj1 = LoginForm.getInstance
 let obj2 = LoginForm.getInstance
 console.log(obj1.show())
 console.log(obj1 === obj2)

// 应用1:本地存储localstoage，每个本地库只生成一次

// 应用2:全局只出现一次，比如弹窗

let createAlertMessage = function(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
}

function getInstance(fn){
    var res
    return function(){
        return res || fn.apply(this,arguments)
    }
}


