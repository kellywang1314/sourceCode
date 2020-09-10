var list = [
    {name:'上海',code:'shanghai',},
    {name:'西安', code:'xian'},
    {name:'深圳', code:'shenzhen'},
    {name:'北京', code:'beijing'}
];
list.sort((a,b)=>{
    let order=['beijing','xian','shanghai','shenzhen'];
    return order.indexOf(a.code)-order.indexOf(b.code);
});
console.log(list);