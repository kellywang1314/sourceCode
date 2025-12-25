// 典型应用场景是表单检验
// 分离了校验逻辑的代码
/**
 * strategies
 * 表单校验策略集合：将不同校验逻辑解耦为独立策略
 */
const strategies = {
    /**
     * isNonEmpty
     * 非空校验
     * @param {string} value 值
     * @param {string} errorMsg 提示文案
     * @returns {string|undefined} 错误信息
     */
    isNonEmpty(value, errorMsg) {
        if (value === '' || value === null) return errorMsg
    },
    /**
     * isMobile
     * 手机号格式校验（简单示例）
     * @param {string} value 值
     * @param {string} errorMsg 提示文案
     * @returns {string|undefined} 错误信息
     */
    isMobile(value, errorMsg) {
        if (!/(^1[3-9][0-9]{9}$)/.test(String(value))) return errorMsg
    },
    /**
     * minLength
     * 最小长度校验
     * @param {string} value 值
     * @param {number} length 最小长度
     * @param {string} errorMsg 提示文案
     * @returns {string|undefined} 错误信息
     */
    minLength(value, length, errorMsg) {
        if ((value || '').length < Number(length)) return errorMsg
    },
    /**
     * matchesPattern
     * 正则匹配校验
     * @param {string} value 值
     * @param {RegExp} pattern 正则模式
     * @param {string} errorMsg 提示文案
     * @returns {string|undefined} 错误信息
     */
    matchesPattern(value, pattern, errorMsg) {
        if (!pattern.test(String(value))) return errorMsg
    }
}

var loginForm = document.getElementById('login-form');

/**
 * createFormValidator
 * 表单校验器：以策略模式组合校验规则，按需扩展策略集合
 * @param {Record<string,Function>} strategyMap 策略集合
 * @returns {{add:Function, validate:Function}} 校验器
 */
function createFormValidator(strategyMap = strategies) {
    const rules = []
    /**
     * add
     * 添加校验规则
     * @param {() => any} getter 获取值函数（如读取 input 值）
     * @param {string} strategyName 策略名
     * @param {Array<any>} params 其他参数（如长度、正则、错误文案）
     */
    function add(getter, strategyName, ...params) {
        rules.push(() => {
            const fn = strategyMap[strategyName]
            if (typeof fn !== 'function') return `策略未定义: ${strategyName}`
            return fn(getter(), ...params)
        })
    }
    /**
     * validate
     * 执行所有规则，返回首个错误或 undefined
     * @returns {string|undefined} 错误信息
     */
    function validate() {
        for (const rule of rules) {
            const res = rule()
            if (res) return res
        }
        return undefined
    }
    return { add, validate }
}

// 表单策略应用示例
if (loginForm) {
    loginForm.onsubmit = function (e) {
        e.preventDefault()
        const getAccount = () => loginForm.querySelector('[name="account"]')?.value || ''
        const getPwd = () => loginForm.querySelector('[name="pwd"]')?.value || ''
        const validator = createFormValidator()
        validator.add(getAccount, 'isNonEmpty', '账号不能为空')
        validator.add(getAccount, 'isMobile', '手机号格式错误')
        validator.add(getPwd, 'minLength', 8, '密码不能小于8位')
        const error = validator.validate()
        if (error) {
            alert(error)
            return false
        }
        return true
    }
}

/**
 * createPriceCalculator
 * 价格计算策略：按会员等级/活动/优惠券分离计算规则
 * @returns {(base:number, ctx:{level?:'normal'|'vip'|'svip', isHoliday?:boolean, coupon?:number})=> number} 计算函数
 */
function createPriceCalculator() {
    const priceStrategies = {
        level(base, level) {
            const map = { normal: 1, vip: 0.95, svip: 0.9 }
            return base * (map[level || 'normal'] || 1)
        },
        holiday(price, isHoliday) {
            return isHoliday ? price * 0.98 : price
        },
        coupon(price, coupon) {
            return Math.max(0, price - (Number(coupon) || 0))
        }
    }
    return function calc(base, ctx = {}) {
        let p = priceStrategies.level(base, ctx.level)
        p = priceStrategies.holiday(p, ctx.isHoliday)
        p = priceStrategies.coupon(p, ctx.coupon)
        return Number(p.toFixed(2))
    }
}

/**
 * getComparator
 * 排序策略：根据字段类型与方向生成比较函数
 * @param {{key:string, type:'string'|'number'|'date', order?:'asc'|'desc'}} opt 配置
 * @returns {(a:any,b:any)=>number} 比较器
 */
function getComparator(opt) {
    const { key, type, order = 'asc' } = opt
    const dir = order === 'desc' ? -1 : 1
    const pick = (x) => x?.[key]
    const cmp = {
        string: (a, b) => String(a).localeCompare(String(b)),
        number: (a, b) => (Number(a) - Number(b)),
        date: (a, b) => (new Date(a).getTime() - new Date(b).getTime())
    }[type]
    return (a, b) => dir * cmp(pick(a), pick(b))
}

/**
 * createRetryBackoff
 * 请求重试退避策略：linear/exponential/fixed
 * @param {'linear'|'exponential'|'fixed'} mode 模式
 * @param {{base?:number, factor?:number}} opt 参数（基础毫秒/指数因子）
 * @returns {(attempt:number)=>number} 根据重试次数返回等待时间
 */
function createRetryBackoff(mode = 'exponential', opt = {}) {
    const base = Number(opt.base) || 200
    const factor = Number(opt.factor) || 2
    const table = {
        linear: (n) => base * n,
        exponential: (n) => base * Math.pow(factor, Math.max(0, n - 1)),
        fixed: () => base
    }
    return (attempt) => table[mode]?.(attempt) ?? base
}
