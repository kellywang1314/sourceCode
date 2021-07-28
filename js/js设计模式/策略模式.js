// 典型应用场景是表单检验
// 分离了校验逻辑的代码
var strategies = {
    isNonEmpty: function (value, errorMsg) {
        if (value === '' || value === null) {
            return errorMsg;
        }
    },
    isMobile: function (value, errorMsg) { // 手机号码格式
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    }
};

var loginForm = document.getElementById('login-form');

loginForm.onsubmit = function (e) {
    e.preventDefault(); 
    var accountIsMobile = strategies.isMobile(account,'手机号格式错误');
    var pwdMinLength = strategies.minLength(pwd,8,'密码不能小于8位');
    var errorMsg = accountIsMobile||pwdMinLength; 
    if(errorMsg){
        alert(errorMsg);
        return false;
    }
}
