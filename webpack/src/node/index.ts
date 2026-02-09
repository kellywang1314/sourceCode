// 常规，DI, IOC
//Notification/Email间从业务角度可以解耦。未来需要改发送邮件的逻辑时,还需要更改Notification里的代码块

// 常规
// class Notification {
//     sendNotification(userEmail, message) {
//         this.sendEmail(userEmail, message);
//     }
//     private sendEmail(userEmail, message) {
//         //do some heavy work
//     }
// }


// class Logger {
//     log(message: string) {
//         console.log(message);
//     }
// }

// class EmailService {
//     sendEmail(userEmail, message) {
//         // send email
//     }
// }

// // DI
// class Notification {
//     constructor(private emailService: EmailService, private logger: Logger) { }
//     sendNotification(userEmail, message) {
//         this.emailService.sendEmail(userEmail, message);
//         this.logger.log(`Sent email to ${userEmail}: ${message}`);
//     }
// }

// const logger = new Logger();
// const emailService = new EmailService();
// const notification = new Notification(emailService, logger);



// // IOC
// class NotificationForIOC {
//     constructor(private notification: Notification) { }
//     sendNotification(userEmail, message) {
//         this.emailService.sendEmail(userEmail, message);
//     }
// }

// // IOC Container
// class IocContainer {
//     constructor() {
//         this.services = {}
//     }

//     register(name, dependencies, implementation) {
//         this.services[name] = { dependencies, implementation };
//     }

//     resolve(name) {
//         const target = this.services[name];
//         if (!target) {
//             throw new Error(`Cannot resolve service: ${name}`);
//         }
//         // 递归解析依赖
//         const dependencies = target.dependencies.map(this.resolve.bind(this))
//         return new target.implementation(...dependencies);
//     }
// }


// const iocContainer = new IoCContainer();
// iocContainer.register('emailService', [], () => EmailService)
// iocContainer.register('notification', ['emailService'], NotificationForIOC)
// const notification = iocContainer.resolve('notification');


/**
 * EmailService
 * 功能：封装发送邮件的具体实现
 * @returns {void}
 */
class EmailService {
    sendEmail(userEmail: string, message: string): void {
        console.log(`[EmailService] to=${userEmail}, message=${message}`)
    }
}

/**
 * Logger
 * 功能：记录日志
 * @returns {void}
 */
class Logger {
    log(message: string): void {
        console.log(`[Logger] ${message}`)
    }
}

/**
 * ConventionalNotification（常规）
 * 特点：强耦合。类内部直接 new/实现依赖，改动邮件或日志实现需要改本类
 */
class ConventionalNotification {
    /**
     * sendNotification
     * 功能：发送邮件通知（内部直接实现依赖）
     * @param userEmail 收件人邮箱
     * @param message 发送内容
     * @returns {void}
     */
    sendNotification(userEmail: string, message: string): void {
        this.sendEmail(userEmail, message)
        console.log(`[Conventional] sent to ${userEmail}`)
    }

    /**
     * sendEmail
     * 功能：具体的发信逻辑（强耦合，难以替换/测试）
     * @param userEmail 收件人邮箱
     * @param message 发送内容
     * @returns {void}
     */
    private sendEmail(userEmail: string, message: string): void {
        // 假装做一些重逻辑
        console.log(`[Conventional::sendEmail] to=${userEmail}, message=${message}`)
    }
}

/**
 * DiNotification（依赖注入 DI）
 * 特点：弱耦合。通过构造函数注入依赖，便于替换实现与单元测试
 */
class DiNotification {
    constructor(private emailService: EmailService, private logger: Logger) { }

    /**
     * sendNotification
     * 功能：调用注入的服务完成业务逻辑
     * @param userEmail 收件人邮箱
     * @param message 发送内容
     * @returns {void}
     */
    sendNotification(userEmail: string, message: string): void {
        this.emailService.sendEmail(userEmail, message)
        this.logger.log(`DiNotification sent to ${userEmail}`)
    }
}

/**
 * Container（IOC 容器）
 * 功能：统一注册与解析依赖，控制对象的创建与装配（控制反转）
 * @returns {void}
 */
class Container {
    private registry = new Map<string, (c: Container) => any>()

    /**
     * register
     * 功能：向容器注册一个工厂方法（如何创建某依赖）
     * @param name 依赖标识
     * @param factory 创建该依赖的工厂方法
     * @returns {void}
     */
    register<T>(name: string, factory: (c: Container) => T): void {
        this.registry.set(name, factory)
    }

    /**
     * resolve
     * 功能：从容器解析一个依赖实例，按需递归解析其依赖
     * @param name 依赖标识
     * @returns {T} 依赖实例
     */
    resolve<T>(name: string): T {
        const factory = this.registry.get(name)
        if (!factory) throw new Error(`Cannot resolve: ${name}`)
        return factory(this) as T
    }
}

/**
 * IocNotification（IOC）
 * 特点：对象的创建与装配由容器控制；类只声明需要什么，不关心如何获得
 */
class IocNotification {
    constructor(private emailService: EmailService, private logger: Logger) { }

    /**
     * sendNotification
     * 功能：使用容器装配好的依赖完成业务逻辑
     * @param userEmail 收件人邮箱
     * @param message 发送内容
     * @returns {void}
     */
    sendNotification(userEmail: string, message: string): void {
        this.emailService.sendEmail(userEmail, message)
        this.logger.log(`IocNotification sent to ${userEmail}`)
    }
}

/**
 * demoConventional
 * 功能：演示常规实现（强耦合）
 * @returns {void}
 */
function demoConventional(): void {
    const n = new ConventionalNotification()
    n.sendNotification('a@demo.com', 'Hello Conventional')
}

/**
 * demoDi
 * 功能：演示 DI 实现（构造注入）
 * @returns {void}
 */
function demoDi(): void {
    const email = new EmailService()
    const logger = new Logger()
    const n = new DiNotification(email, logger)
    n.sendNotification('b@demo.com', 'Hello DI')
}

/**
 * demoIoc
 * 功能：演示 IOC 容器注册与解析，统一装配依赖
 * @returns {void}
 */
function demoIoc(): void {
    const container = new Container()

    // 注册基础服务
    container.register<EmailService>('emailService', () => new EmailService())
    container.register<Logger>('logger', () => new Logger())

    // 注册通知类，声明依赖的解析方式
    container.register<IocNotification>('notification', (c) => {
        const email = c.resolve<EmailService>('emailService')
        const logger = c.resolve<Logger>('logger')
        return new IocNotification(email, logger)
    })

    // 解析并使用
    const n = container.resolve<IocNotification>('notification')
    n.sendNotification('c@demo.com', 'Hello IOC')
}

// 运行示例
demoConventional()
demoDi()
demoIoc()