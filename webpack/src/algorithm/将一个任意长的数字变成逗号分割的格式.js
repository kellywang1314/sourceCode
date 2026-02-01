function parseToMoney(num) {
  num = parseFloat(num.toFixed(3));
  let [integer, decimal] = String.prototype.split.call(num, '.');
  // (?=)：正向零宽断言,该规则意思是配置一个数字从第二个数开始全部为数字，且出现次数是3的整数倍。
  integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
  return integer + '.' + (decimal ? decimal : '');

}