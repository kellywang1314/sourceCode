/*
 * @Author: kellywang
 * @Date: 2021-07-10 20:12:49
 * @LastEditTime: 2021-07-10 20:34:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/实现xss-filter.js
 */

 //  XSS 防护最重要和有效的手段就是进行 XSS-Filter 处理


// 黑名单的技术, 对用户输入的某些字符串进行替换
export const REMARK_REG =  /^|[_\!\@\$\#\+\-\/\%\^\&\*\>\<]+|$/

// 白名单技术，仅允许部分安全属性输入，存在一个白名单列表,不在白名单的统统干掉

let whiteList = {
    a: ['target', 'href', 'title'],
    abbr: ['title'],
    address: [],
    area: ['shape', 'coords', 'href', 'alt'],
    div: [],
  
}

function safeAttrValue(name, value) {
    var Reg = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a)\:/gi;
    if (name === "href" || name === "src") {
       value = value.trim()
      if (
        !(
          value.substr(0, 7) === "http://" ||
          value.substr(0, 8) === "https://" ||
          value.substr(0, 7) === "mailto:" ||
          value.substr(0, 4) === "tel:" ||
          value[0] === "#" ||
          value[0] === "/"
        )
      ) {
        // 如果href和src属性不是链接则清空，防止href="javascript:alert(/xss/)"这种情形
        return "";
      }
    } else if (name === "background") {
      if (reg.test(value)) {
        // 如果包含javascript脚本则清空
        return "";
      }
    }
  
    // escape `<>"` before returns
    var REGEXP_QUOTE = /"/g;
    var REGEXP_LT = /</g;
    var REGEXP_GT = />/g;
    value =value.replace(REGEXP_QUOTE, "&quot;").replace(REGEXP_LT, "&lt;").replace(REGEXP_GT, "&gt;");
    return value;
  }
  