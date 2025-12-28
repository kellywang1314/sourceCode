// 下面是加载各类资源的实现，比如获取html文件、js文件、css文件。在整个流程中，这个方法会被多次使用来加载资源。
// 加载任意的资源，但是都是会转为 string
// 加载任意的资源，但是都是会转为 string
function load(url: string, config?: RequestInit) {
    // 移除了部分代码只保留说明性的部分
    config = { mode: 'cors', ...config, ...requestConfig };
    this.loadings[url] = fetch(url, config)
        .then((res) => {
            // 响应码大于 400 的当做错误
            if (res.status >= 400) {
                error(`load failed with status "${res.status}"`);
            }
            const type = res.headers.get('content-type');
            return res.text().then((code) => ({ code, type, res }));
        })
        .then(({ code, type, res }) => {
            let manager;
            const blob = new Blob([code]);
            const size = Number(blob.size);
            const ft = parseContentType(type);
            // 对加载的资源进行分类处理
            // 下方new 的几个实例的目的都是保存代码块字符串和资源类型等一些基本信息
            if (isJs(ft) || /\.js/.test(res.url)) {
                manager = new JsResource({ url, code, size, attributes: [] });
            } else if (isHtml(ft) || /\.html/.test(res.url)) {
                manager = new HtmlResource({ url, code, size });
            } else if (isCss(ft) || /\.css/.test(res.url)) {
                manager = new CssResource({ url, code, size });
            } else {
                error(`Invalid resource type "${type}"`);
            }

            // 所有的请求会存在一个promise map来维护，加载完成后清空
            this.loadings[url] = null;
            currentSize += isNaN(size) ? 0 : size;
            if (!isOverCapacity(currentSize) || this.forceCaches.has(url)) {
                // 尝试缓存加载的资源
                this.caches[url] = manager;
            }
            return manager;
        })
        .catch((e) => {
            const message = e instanceof Error ? e.message : String(e);
            error(`${message}, url: "${url}"`);
        });
    return this.loadings[url];
}



   // 子应用实例化：每个子引用都会通过这个方法来实例化
  private createApp(
    appInfo: AppInfo,
    opts: LoadAppOptions,
    manager: HtmlResource,
    isHtmlMode: boolean,
) {
    const run = (resources: ResourceModules) => {
        // 这里是获取沙箱环境
        let AppCtor = opts.sandbox.snapshot ? SnapshotApp : App;
        if (!window.Proxy) {
            warn(
                'Since proxy is not supported, the sandbox is downgraded to snapshot sandbox',
            );
            AppCtor = SnapshotApp;
        }
        // 将app在沙箱内实例化以保证独立运行
        const app = new AppCtor(
            this.context,
            appInfo,
            opts,
            manager,
            resources, // 提供的html入口
            isHtmlMode,
        );
        this.context.emit(CREATE_APP, app);
        return app;
    };

    // 如果是 html, 就需要加载用到的资源
    const mjs = Promise.all(this.takeJsResources(manager as HtmlResource));
    const mlink = Promise.all(this.takeLinkResources(manager as HtmlResource));
    return Promise.all([mjs, mlink]).then(([js, link]) => run({ js, link }));
}



// 沙箱的实现：主要是 copy 一份 window 和 document
export function createFakeObject(
    target: Record<PropertyKey, any>,
    filter?: (PropertyKey) => boolean,
    isWritable?: (PropertyKey) => boolean,
) {
    // 继承window对象的原型创建一个新的对象
    const fakeObject = Object.create(Object.getPrototypeOf(target));
    // 存一份设置过的属性的记录
    const propertyMap = {};
    // 拦截window属性上的set操作，所有set的值都会保留在这个新的对象上。（避免set污染到window）
    const storageBox = Object.create(null); // 不能直接写入fakeObject，会造成死循环，需要临时对象存储
    const propertyNames = rawObject.getOwnPropertyNames(target);

    const def = (p: string) => {
        // 获取属性描述符
        const descriptor = rawObject.getOwnPropertyDescriptor(target, p);

        if (descriptor?.configurable) {
            const hasGetter = hasOwn(descriptor, 'get');
            const hasSetter = hasOwn(descriptor, 'set');
            const canWritable = typeof isWritable === 'function' && isWritable(p);

            // 下方标注的两部分表明，一旦手动设置了每个值即触发set,那么这个值会被storageBox存储。
            // 下一次便只从这个storageBox获取，不会再获取target的值，这也是一个优化
            if (hasGetter) {
                // prettier-ignore
                descriptor.get = () => hasOwn(storageBox, p)
                    ? storageBox[p]
                    : target[p];
            }

            if (hasSetter) {
                descriptor.set = (val) => {
                    storageBox[p] = val;
                    return true;
                };
            }

            // 更改为可写
            if (canWritable) {
                if (descriptor.writable === false) {
                    descriptor.writable = true;
                } else if (hasGetter) {
                    descriptor.set = (val) => {
                        storageBox[p] = val;
                        return true;
                    };
                }
            }
            // 不允许再次更改window上的属性描述符，避免造成逃逸
            rawObject.defineProperty(fakeObject, p, rawObject.freeze(descriptor));
        }
    };

    propertyNames.forEach((p) => {
        // 如果有指定的跳过代理的函数则执行跳过逻辑
        if (typeof filter === 'function') {
            !filter(p) && def(p);
        } else {
            def(p);
        }
        propertyMap[p] = true;
    });

    // 有可能是原型链上的属性
    for (const prop in target) {
        // 自身对象赋值过的key直接跳过
        !propertyMap[prop] && def(prop);
    }

    return fakeObject as any;
}