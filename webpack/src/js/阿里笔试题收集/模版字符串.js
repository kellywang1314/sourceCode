function render(template, data) {
    let reg = /\$\{(.*?)\}/g;
    return template.replace(reg, (match, key) => data[key.trim()])
}


function render(str, data) {
    let reg = /\$\{(.*?)\}/
    if (reg.test(str)) {
        let key = reg.exec(str)[1].trim()
        str = str.replace(reg, data[key])
        return render(str, data)
    }
    return str
}

render("My name is ${ name }, Im ${ age } years old.", { name: '小王', age: 20 })

