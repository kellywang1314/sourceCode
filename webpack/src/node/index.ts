// 常规，DI, IOC
//Notification/Email间从业务角度可以解耦。未来需要改发送邮件的逻辑时,还需要更改Notification里的代码块

// 常规
class Notification {
    sendNotification(userEmail, message) {
        this.sendEmail(userEmail, message);
    }
    private sendEmail(userEmail, message) {
        //do some heavy work
    }
}



class Logger {
    log(message: string) {
        console.log(message);
    }
}

class EmailService {
    sendEmail(userEmail, message) {
        // send email
    }
}

// DI
class Notification {
    constructor(private emailService: EmailService, private logger: Logger) { }
    sendNotification(userEmail, message) {
        this.emailService.sendEmail(userEmail, message);
        this.logger.log(`Sent email to ${userEmail}: ${message}`);
    }
}

const logger = new Logger();
const emailService = new EmailService();
const notification = new Notification(emailService, logger);


// IOC
class NotificationForIOC {
    constructor(private notification: Notification) { }
    sendNotification(userEmail, message) {
        this.emailService.sendEmail(userEmail, message);
    }
}

// IOC Container
class IocContainer {
    constructor() {
        this.services = {}
    }

    register(name, dependencies, implementation) {
        this.services[name] = { dependencies, implementation };
    }

    resolve(name) {
        const target = this.services[name];
        if (!target) {
            throw new Error(`Cannot resolve service: ${name}`);
        }
        // 递归解析依赖
        const dependencies = target.dependencies.map(this.resolve.bind(this))
        return new target.implementation(...dependencies);
    }
}


const iocContainer = new IoCContainer();
iocContainer.register('emailService', [], () => EmailService)
iocContainer.register('notification', ['emailService'], NotificationForIOC)
const notification = iocContainer.resolve('notification');


