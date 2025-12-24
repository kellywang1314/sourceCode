/**
 * formatThousand
 * 千分位格式化：支持负号、小数、可自定义分隔符与分组大小
 * @param {string|number} input 待格式化的值
 * @param {{separator?: string, groupSize?: number}} options 配置项
 * @returns {string} 格式化后的字符串
 */
function formatThousand(input, options = {}) {
  const { separator = ',', groupSize = 3 } = options
  let str = String(input).trim()
  if (!str) return ''

  // 处理符号
  let sign = ''
  if (str[0] === '-' || str[0] === '+') {
    sign = str[0] === '-' ? '-' : ''
    str = str.slice(1)
  }

  // 拆分整数与小数部分
  const parts = str.split('.')
  let intPart = parts[0]
  const decPart = parts[1] != null ? parts[1] : ''


  // 分组函数
  function groupInt(s) {
    if (!s) return '0'
    const out = []
    let i = s.length
    while (i > 0) {
      const start = Math.max(0, i - groupSize) // 7
      out.unshift(s.slice(start, i))
      i = start
    }
    return out.join(separator)
  }

  const grouped = groupInt(intPart)
  const result = decPart ? `${sign}${grouped}.${decPart}` : `${sign}${grouped}`
  return result
}

/**
 * formatThousandLocale
 * 使用 Intl.NumberFormat 进行本地化千分位格式化（自动处理小数与分组）
 * @param {number} value 数值（需为数字类型）
 * @param {string} locale 语言区域，例如 'zh-CN'、'en-US'
 * @param {Intl.NumberFormatOptions} options Intl 配置（如最大小数位）
 * @returns {string} 本地化格式化结果
 */
function formatThousandLocale(value, locale = 'zh-CN', options = {}) {
  const fmt = new Intl.NumberFormat(locale, options)
  return fmt.format(value)
}

// 示例
// console.log(formatThousand(1234567890)) // 1,234,567,890
// console.log(formatThousand(-12345.6789)) // -12,345.6789
// console.log(formatThousand('0012345.00')) // 12,345.00
// console.log(formatThousandLocale(1234567.89, 'zh-CN', { minimumFractionDigits: 2 }))

/**
 * formatThousandSimple
 * 简洁版千分位格式化：正则按整数部分每三位插入分隔符
 * @param {string|number} input 待格式化的值
 * @returns {string} 格式化后的字符串
 */
function formatThousandSimple(input) {
  const s = String(input)
  const sign = s[0] === '-' ? '-' : ''
  const rest = sign ? s.slice(1) : s
  const [int, dec] = rest.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${sign}${grouped}.${dec}` : `${sign}${grouped}`
}

// 示例
// console.log(formatThousandSimple(1234567890)) // 1,234,567,890
// console.log(formatThousandSimple(-12345.6789)) // -12,345.6789
