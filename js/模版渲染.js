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

// 实现一个简单的字符串模版渲染
// 例如字符串如下： 你好，我们是{{XXXX}}公司，是{{XXXX}}组，现在正在招聘{{XX.job[0]}}、{{XX['job'][1]}}等职位。
const obj = {
    company: 'XX公司',
    hire: {
        group: 'XX公司',
        job: ['前端', '后端', '客户端']
    }
}
function render (template, obj) {}


