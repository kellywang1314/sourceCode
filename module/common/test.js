var basicNum = 0;
function add(a, b) {
    setTimeout(() => {
        basicNum = 4;
        console.log(basicNum,'neibu')
    },3000)
    return a + b;
}


module.exports = {
  add: add,
  basicNum: basicNum
}
