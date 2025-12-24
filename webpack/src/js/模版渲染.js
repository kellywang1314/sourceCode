// Q: 实现一个简单的模板引擎：
/*
    let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
    let data = {
     name: '姓名',
     age: 18
    }
    render(template, data); // 我是姓名，年龄18，性别undefined
*/

function render(template, data) {
    const reg = /\{\{(\w+)\}\}/
    if (reg.test(template)) {
        const name = reg.exec(template)[1]  // ["{{name}}", "name"] 
        template = template.replace(reg, data[name])
        return render(template, data) // 递归渲染
    }
    return template

}

// 实现一个简单的字符串模版渲染
// // 例如字符串如下： 你好，我们是{{company}}公司，是{{hire.group}}组，现在正在招聘{{hire.job[0]}}、{{hire['job'][1]}}等职位。
// const obj = {
//     company: '字节跳动',
//     hire: {
//         group: '生服',
//         job: ['前端', '后端', '客户端']
//     }
// }

/**
 * getValueByExpr
 * 解析表达式（支持 . 与 [] 访问）并从上下文对象中取值
 * @param {object} ctx 上下文对象
 * @param {string} expr 表达式，如：hire.job[0]、hire['group']、hire["job"][1]
 * @returns {any} 解析出的值
 */
function getValueByExpr(ctx, expr) {
    const norm = String(expr)
        .replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]/g, (_, s1, s2, s3) => '.' + (s1 ?? s2 ?? s3))
        .replace(/^\./, '')
    const keys = norm.split('.').filter(Boolean)
    let cur = ctx
    for (const k of keys) {
        if (cur == null) return undefined
        cur = cur[k]
    }
    return cur
}

/**
 * renderStringTemplate
 * 简单字符串模板渲染：替换 {{ expr }} 为上下文中的值
 * 支持 . 与 [] 访问（如 hire.job[0]、hire['group']）
 * @param {string} template 模板字符串
 * @param {object} context 上下文对象
 * @returns {string} 渲染后的字符串
 */
function renderStringTemplate(template, context) {
    const re = /\{\{\s*([^}]+?)\s*\}\}/g
    return String(template).replace(re, (_, expr) => {
        const val = getValueByExpr(context, expr)
        return String(val)
    })
}

// 用法示例：
// const obj = { company: '字节跳动', hire: { group: '生服', job: ['前端','后端'] } }
// const tpl = '你好，我们是{{company}}公司，是{{hire.group}}组，招聘{{hire.job[0]}}、{{hire["job"][1]}}。'
// console.log(renderStringTemplate(tpl, obj))
