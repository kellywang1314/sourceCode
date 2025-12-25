// 在不改变对象自身的基础上，动态的给某个对象添加新的功能，同时又不改变其接口
// 方便动态的扩展功能，且提供了比继承更多的灵活性。


/**
 * enable note
 * 使用 TypeScript 装饰器需要在 tsconfig.json 开启 `experimentalDecorators: true`
 */

/**
 * sealed
 * 类装饰器：冻结构造函数与原型，防止后续扩展
 * @returns {ClassDecorator}
 */
function sealed(): ClassDecorator {
    return function (value, _context) {
        Object.freeze(value)
        Object.freeze((value as any).prototype)
    }
}

/**
 * controller
 * 类装饰器：为类绑定基础路径与中间件（示例，不依赖 reflect-metadata）
 * @param {string} basePath 基础路径
 * @returns {ClassDecorator}
 */
function controller(basePath: string): ClassDecorator {
    return function (value, _context) {
        ; (value as any).__basePath = basePath
    }
}

/**
 * useMiddleware
 * 方法装饰器：注册中间件到类的元数据中
 * @param {(ctx:any)=>void} mw 中间件函数
 * @returns {MethodDecorator}
 */
function withMiddleware(mw: (ctx: any) => void): MethodDecorator {
    return function (original, context) {
        const name = String((context as any).name)
        return function (this: any, ...args: any[]) {
            try { mw({ method: name, args }) } catch { }
            return (original as Function).apply(this, args)
        }
    } as any
}

/**
 * logMethod
 * 方法装饰器：打印入参与耗时，支持同步/异步
 * @returns {MethodDecorator}
 */
function logMethod(): MethodDecorator {
    return function (original, context) {
        const name = String((context as any).name)
        return function (this: any, ...args: any[]) {
            const start = Date.now()
            try {
                const res = (original as Function).apply(this, args)
                if (res && typeof (res as any).then === 'function') {
                    return (res as Promise<any>).then(v => {
                        console.log(`[${name}] ${Date.now() - start}ms`, args)
                        return v
                    })
                }
                console.log(`[${name}] ${Date.now() - start}ms`, args)
                return res
            } catch (e) {
                console.error(`[${name}] error`, e)
                throw e
            }
        }
    } as any
}

/**
 * debounceMethod
 * 方法装饰器：为实例方法增加防抖（简版）
 * @param {number} wait 等待时间毫秒
 * @returns {MethodDecorator}
 */
function debounceMethod(wait: number): MethodDecorator {
    return function (original, _context) {
        const timers = new WeakMap<any, any>()
        return function (this: any, ...args: any[]) {
            const self = this
            const t = timers.get(self)
            if (t) clearTimeout(t)
            const id = setTimeout(() => (original as Function).apply(self, args), wait)
            timers.set(self, id)
        }
    } as any
}

/**
 * configurableAccessor
 * 访问器装饰器：设置访问器的 configurable 属性
 * @param {boolean} cfg 是否可配置
 * @returns {MethodDecorator}
 */
function configurableAccessor(cfg: boolean) {
    return function (original: any, context: any) {
        if (context && typeof context === 'object') {
            context.configurable = cfg
        }
        return original
    }
}

/**
 * required
 * 参数装饰器：标记必填参数索引
 * @returns {ParameterDecorator}
 */
function requireArgs(...indexes: number[]): MethodDecorator {
    return function (original, _context) {
        return function (this: any, ...args: any[]) {
            for (const i of indexes) {
                const v = args[i]
                if (v === undefined || v === null) throw new Error(`参数 ${i} 必填`)
            }
            return (original as Function).apply(this, args)
        }
    } as any
}

/**
 * DemoController
 * 装饰器综合示例：类路径、中间件、方法日志、防抖、参数校验
 */
@sealed()
@controller('/demo')
class DemoController {
    private _name = 'demo'

    /**
     * name
     * 访问器示例
     */
    @configurableAccessor(false)
    get name() { return this._name }

    /**
     * search
     * 查询方法：日志 + 防抖 + 参数必填校验
     * @param {string} q 关键词
     * @returns {Promise<string[]>}
     */
    @withMiddleware((ctx) => console.log('mw', ctx))
    @logMethod()
    @debounceMethod(300)
    @requireArgs(0)
    async search(q: string): Promise<string[]> {
        return ['a', 'b', 'c'].filter(s => s.includes(q))
    }
}

/**
 * runDemo
 * 运行示例，展示装饰器效果
 */
function runDemo(): void {
    const demo = new DemoController()
    console.log('basePath:', (DemoController as any).__basePath)
    demo.search('a').then(console.log)
    demo.search('ab').then(console.log)
    try { (demo as any).search(undefined) } catch (e) { console.error('校验异常', e) }
}

runDemo()
