// Q: 实现一个简单的模板引擎：
/*
    let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
    let data = {
    name: '姓名',
    age: 18
    }
    render(template, data); // 我是姓名，年龄18，性别undefined
*/

function render(template,data){
    const reg = /\{\{(\w+)\}\}/
    if(reg.test(template)){ 
        const name = reg.exec(template)[1]
        template = template.replace(reg, data[name])
        return render(template, data) // 递归渲染
    }
    return template

}


function render(template,data){
    let reg = /\{\{{w+}\}\}/
    if(reg.test(template)){
        const name = reg.exec(template)[1]
        template = template.replace(reg, data[name])
        return render(template, data)
    }
    return template
}