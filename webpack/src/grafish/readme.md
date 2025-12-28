近期有落地一些微前端业务场景，也遇到一些问题，看了下他们的实现发现目前无论是garfish还是qiankun对于这一块的实现都在不断的完善中，但是qiankun我也看了一下他们的实现，在一些case的处理上较garfish存在一定不足。所以本次是针对garfish的实现分析。下面会从资源加载入口，资源解析，沙箱环境，代码执行四大块进行分析，了解微前端的主要实现逻辑。
下文中对比qiankun的版本为2.4.0，如有不正确的还请评论指正。
文中涉及大量的代码分析，希望能够从实现层面更加直接的看出实现的逻辑，而不是通过几张图来解释概念。
如何解析资源（html入口）
获取资源内容
根据提供的url作为入口文件加载资源。加载的实现很简单，通过fetch拿到资源内容，如果是html资源入口会进行标签的序列化和相关处理，这个后面会看到。如果是js文件则会直接实例化一个js资源类，目的是保存加载到资源的类型，大小，代码字符串等基本信息。并会尝试缓存加载的资源。

在html入口被加载的时候，这个方法便帮助我们获取到了入口html文件内容，接下载需要解析这个html文件。
序列化DOM树
因为html入口比较特殊，下面单独对这部分进行分析。如何解析并处理html文件的呢。首先我们在上一步获得了资源的文件内容。下一步是对加载的html资源进行ast解析,结构化dom，以便提取不同类型的标签内容。这里使用到了 himalaya 这个辅助库。在线尝试地址https://jew.ski/himalaya/, 解析内容格式如下，将dom文本解析文json结构。
[图片]

结构化后进行深度优先遍历把link,style,script标签提取出来
// 调用方式
this.queryVNodesByTagNames(['link', 'style', 'script']) 

// 具体实现
// 实现代码截取 其中this.ast就是上面演示的parse的结果
private queryVNodesByTagNames(tagNames: Array<string>) {
    const res: Record<string, Array<VNode>> = {};
    for (const tagName of tagNames) {
      res[tagName] = [];
    }
    const traverse = (vnode: VNode | VText) => {
      if (vnode.type === 'element') {
        const { tagName, children } = vnode;
        if (tagNames.indexOf(tagName) > -1) {
          res[tagName].push(vnode);
        }
        children.forEach((vnode) => traverse(vnode));
      }
    };
    this.ast.forEach((vnode) => traverse(vnode));
    return res;
  }
由于当前各个框架的实现基本都是有js生成dom并挂载到指定的元素上，因此这里只要把这三种加载资源的标签提取出来基本就完成了页面的加载。当然还需要配合微前端的加载方式改造下子系统入口，让挂载函数指向主应用提供的dom。至此我们完成了基本资源的提取。
构建运行环境
接下来就是实例化当前子应用了。我们需要子应用的运行时独立的环境不影响主应用的代码。因此子应用需要在指定的沙箱内运行，这也是微前端实现的核心部分。首先看下实例化子应用的代码
  // 每个子引用都会通过这个方法来实例化
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
这里只需要大致看一下一个子应用的大致创建和加载流程，基本就是一个上下文，一些资源信息。具体细节后续可以看看源码串下整体流程。接下来看下应用的运行上下文——沙箱的实现
沙箱的实现
构造沙箱window
为了避免数据污染，沙箱内的数据不会暴露到全局，因此需要劫持并代理window来保证数据的安全。garfish采取的是将window对象的所有属性复制一份到新的自定义全局对象上，并将后续对全局变量的访问都代理到这个新的变量上。
// 主要是 copy 一份 window 和 document
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
其中rawObject 以及之后出现的raw开头的数据基本都是原window对象属性的引用，声明文件如下
// 保存一些原始的属性
export const rawWindow = window;
export const rawDocument = document;
export const rawDocumentCtor = Document;

export const rawSetTimeout = rawWindow.setTimeout;
export const rawSetInterval = rawWindow.setInterval;
// 省略一部分
export const rawAppendChild = HTMLElement.prototype.appendChild;
export const rawRemoveChild = HTMLElement.prototype.removeChild;

export const rawObject = Object;
export const rawObjectKeys = rawObject.keys;
export const rawObjectCreate = rawObject.create;
export const rawObjectDefineProperty = rawObject.defineProperty;
export const rawObjectGetOwnPropertyDescriptor =
  rawObject.getOwnPropertyDescriptor;
重写关键方法
重写关键方法的目的是覆盖全局对象的相同方法，保证沙箱内执行不会污染全局。如何保证不污染全局呢？当前的实现基本分三大部分，1.对全局变量的操作只可读不可写（会有单独处理的部分可写数据如cookie）,2.对document的操作单独处理script，style等可能出现逃逸问题的标签。3.对事件监听及定时器进行方法重写以保证可清除副作用。重写方法如下
document
eventListener // addEventListener 和removeEventListener
history
storage
timer // setTimeout 和 setInterval 基本实现是保留了每次调用生成的timeID，以便卸载的时候清除所有定时器
xhr
比如我们通过document对象来添加dom到文档流，这个过程很容易把dom挂载到html或者body上，如果不做处理和很容易造成子应用的元素挂载到全局导致污染。当然最重要的还是避免script的逃逸。比如下面这行代码。
 const script = document.createElement('script');
 script.innerText = 'console.log(window)';
 var firstScript = document.getElementsByTagName('script')[0];
 firstScript.parentNode.insertBefore(script, firstScript);
这段代码如果是在qiankun内是会造成代码逃逸的，他没有处理dom元素父级查找链路的顶级元素拦截，进而导致parentNode的方式可以越过子应用dom树。
下面以document的重写实现为例，看下拦截了那些操作。其他几种方法类似
首先列举一个场景来看下预期表现
当我们获取页面dom元素时
document.querySelector('.name')
我们希望这个被找到的元素只可能是子应用的元素，要么就是找不到。不应该查找到父应用的元素。这也是我们覆盖原有document的目的。下面列举一下覆盖的方法。这些方法我们都需要保证只会获取到当前应用的dom树的元素。
 'querySelector'
 'querySelectorAll'
 'getElementById'
 'getElementsByTagName'
 'getElementsByTagNameNS'
 'getElementsByClassName'
具体怎么处理呢？首先依然是像构造沙箱window一样构造一份document的副本来作为沙箱内的document元素，保证document的set不会影响全局。这一部分实现就不在多说了。下一步就是代理这个副本document。代理的目标主要是两部分：第一对于上面列举的获取dom元素的方法让他的document对象指向子应用挂载的那个dom。第二对于body和head这种顶级元素代理到子应用挂载dom下沙箱元素（在初始化子应用会在挂载dom下由garfish新建这些临时节点）。
代码实现示例如下
// fakeDocument 为保留了document所有属性的对象  
const fakeDocumentProto = new Proxy(fakeDocument, {
    get(target: any, p: PropertyKey, receiver?: any) {
      // 触发get事件将html的parentNode设置为代理节点，应用卸载后重置
      microTaskHtmlProxyDocument(proxyDocument);

      // 指定的子应用挂载的dom
      const rootEl = rootElm(sandbox);
      const value = hasOwn(target, p)
        ? Reflect.get(target, p, receiver)// 覆盖了document的所有属性和方法
        : Reflect.get(rawDocument, p); // 同 window proxy.get，如果访问了document不存在的属性，则去全局找

      if (rootEl) {
        if (p === 'createElement') {
          return function (tagName, options) {
            // 创建dom元素的操作上下文依然指回原有的document
            const el = value.call(rawDocument, tagName, options);
            if (isObject(el)) {
              Object.defineProperty(el, 'GARFISH_SANDBOX', {
                configurable: true,
                enumerable: false,
                value: sandbox,
              });
            }
            return el;
          };
        }

        // 严格模式下会将document.body和document.head操作指向garfish创建的自定义元素上
        if (strictIsolation) {
          if (p === 'head') {
            return findTarget(rootEl, ['head', 'div[__GarfishMockHead__]']);
          }
          if (p === 'body') {
            return findTarget(rootEl, ['body', 'div[__GarfishMockBody__]']);
          }
          if (queryFunctions(p)) {
            return p === 'getElementById'
              ? (id) => rootEl.querySelector(`#${id}`)
              : rootEl[p].bind(rootEl);
          }
        }
      }

      // 处理document bind原型链污染的问题
      if (typeof value === 'function') {
        let newValue = hasOwn(value, __documentBind__)
          ? value[__documentBind__]
          : null;

        if (!newValue) {
          newValue =
            typeof value.bind === 'function'
              ? value.bind(rawDocument)
              : bind(value, rawDocument);
        }
       // 校验是否有对应属性
        const verifyResult = verifyDescriptor(target, p, newValue);

        if (verifyResult > 0) {
          if (verifyResult === 1) return value;
          if (verifyResult === 2) return undefined;
        }
        value[__documentBind__] = newValue;
        return newValue;
      }

      return value;
    },
  });
重写Document构造函数
为了避免通过 new Document的方式创建对象来获取和更改document对象，需要将构造函数进行重写。方式也很简单，通过我们上面创建的fakeDocumentProto作为原型来构造新的Document
  const fakeDocumentCtor = function Document() {
    if (!(this instanceof fakeDocumentCtor)) {
      throw new TypeError(
        // eslint-disable-next-line quotes
        "Failed to construct 'Document': Please use the 'new' operator.",
      );
    }
    const docInstance = new rawDocumentCtor();
    // 如果继承 fakeDocumentProto，将会得到 rawDocument 上的属性和方法，不符合预期
    rawObject.setPrototypeOf(docInstance, fakeDocument);
    return docInstance;
  };

  fakeDocumentCtor.prototype = fakeDocumentProto;
  fakeDocumentCtor.prototype.constructor = fakeDocumentCtor;
最后一步则是劫持set操作，这里我们劫持的依然是fakeDocumentProto，所有的set除了cookie和title会设置到原生document的属性上，其余均设置到我们副本document上，保证数据的环境隔离。
代码示例如下
  proxyDocument = new Proxy(
    Object.create(fakeDocumentProto, {
      // 内置的一些属性
      currentScript: {
        value: null,
        writable: true,
      },
      [__proxyNode__]: {
        writable: false,
        configurable: false,
        value: rawDocument,
      },
    }),
    {
      // document.cookie和title 不做隔离
      set(target: any, p: PropertyKey, value: any, receiver: any) {
        const rawDocumentKey = ['title', 'cookie'];
        const verifyResult = verifySetDescriptor(
          // prettier-ignore
          typeof p === 'string' && rawDocumentKey.indexOf(p) !== -1
            ? rawDocument
            : receiver
              ? receiver
              : target,
          p,
          value,
        );

        // 值相同，直接返回设置成功。不可设置直接返回失败，在safari里面Reflect.set默认没有进行这部分处理
        if (verifyResult > 0) {
          if (verifyResult === 1 || verifyResult === 2) return false;
          if (verifyResult === 3) return true;
        }

        return typeof p === 'string' && rawDocumentKey.indexOf(p) !== -1
          ? Reflect.set(rawDocument, p, value)
          : Reflect.set(target, p, value, receiver);
      },

      defineProperty: (
        target: any,
        p: PropertyKey,
        descriptor: PropertyDescriptor,
      ) => {
        // cookie 不做处理
        return p === 'cookie'
          ? Reflect.defineProperty(rawDocument, p, descriptor)
          : Reflect.defineProperty(target, p, descriptor);
      },
    },
  );
到这里我们就完成了document代理的分析，其余集中事件思想类似。
代理window
前两步构造了新的window,并重写了关键方法。最后一步就是代理这个window,并将重写的方法绑定的新的window对象上。代理window的主要目的是劫持属性的修改。对于set操作均设置到新的window上，并会同时设置到一个内部维护的变量storageBox，每次get会优先从这个变量取值。
    const baseHandlers = {
      get: (target: FakeWindow, p: PropertyKey, receiver: any) => {
        let value;
        // 重写的方法
        const overrides = this.overrideContext.overrides;
        if (this.isProtectVariable(p)) {
          // receiver 不要传，否则会造成 this 指向不对
          return Reflect.get(rawWindow, p);
        } else if (this.isInsulationVariable(p)) {
          value = Reflect.get(target, p, receiver);
        } else {
          value = hasOwn(target, p)
            ? Reflect.get(target, p, receiver)
            : Reflect.get(rawWindow, p);
        }

        if (typeof value === 'function') {
          // 以下几种情况不需要 bind
          // 1. 原生的 es 标准上的全局方法
          // 2. 沙箱内部或用户重写的方法
          // 3. 构造函数
          // 当过滤掉自定义和原生 es 的函数后，就只剩下 bom，dom 上的函数
          // 对这些环境有关的函数做构造函数等判断，进一步缩小需要 bind 的范围
          if (
            isEsMethod(p) ||
            hasOwn(overrides, p) ||
            isConstructor(value) ||
            this.isExternalGlobalVariable.has(p)
          ) {
            return value;
          }
        } else {
          return value;
        }

        const newValue = hasOwn(value, __windowBind__)
          ? value[__windowBind__]
          : bind(value, rawWindow);
        const verifyResult = verifyDescriptor(target, p, newValue);
        if (verifyResult > 0) {
          if (verifyResult === 1) return value;
          if (verifyResult === 2) return undefined;
        }
        value[__windowBind__] = newValue;
        return newValue;
      },

      set: (
        target: FakeWindow,
        p: PropertyKey,
        value: unknown,
        receiver: any,
      ) => {
        const verifyResult = verifySetDescriptor(
          // prettier-ignore
          this.isProtectVariable(p)
            ? rawWindow
            : receiver
              ? receiver
              : target,
          p,
          value,
        );
        // 值相同，直接返回设置成功。不可设置直接返回失败，在safari里面Reflect.set默认没有进行这部分处理
        if (verifyResult > 0) {
          if (verifyResult === 1 || verifyResult === 2) return false;
          if (verifyResult === 3) return true;
        }

        // isProtectVariable 可以理解为白名单，是全局共享的变量，是可以设置到全局window的
        if (this.isProtectVariable(p)) {
          return Reflect.set(rawWindow, p, value);
        } else {
          const success = Reflect.set(target, p, value, receiver);
          if (success) {
            if (this.initComplete) {
              this.isExternalGlobalVariable.add(p);
            }
            // 更新需要优化的变量
            if (this.context) {
              const { $optimizeMethods, $optimizeUpdateStack } = this.context;
              if (Array.isArray($optimizeMethods)) {
                if ($optimizeMethods.indexOf(p) > -1) {
                  $optimizeUpdateStack.forEach((fn) => fn(p, value));
                }
              }
            }
          }
          return success;
        }
      },

      defineProperty: (
        target: FakeWindow,
        p: PropertyKey,
        descriptor: PropertyDescriptor,
      ) => {
        if (this.isProtectVariable(p)) {
          return Reflect.defineProperty(rawWindow, p, descriptor);
        } else {
          const success = Reflect.defineProperty(target, p, descriptor);
          if (this.initComplete && success) {
            this.isExternalGlobalVariable.add(p);
          }
          return success;
        }
      },

      deleteProperty: (target: FakeWindow, p: PropertyKey) => {
        if (hasOwn(target, p)) {
          delete target[p as any];
          if (this.initComplete && this.isExternalGlobalVariable.has(p)) {
            this.isExternalGlobalVariable.delete(p);
          }
        } else if (__DEV__) {
          if (hasOwn(rawWindow, p) && this.isProtectVariable(p)) {
            warn(`The "${String(p)}" is global protect variable."`);
          }
        }
        return true;
      },
    };
修正window的顶层对象
我们你知道window 对象上有self,top,globalThis,parent 指向全局window，因此我么你需要让这部分的指向液位我们代理的window.
    const parentHandlers = {
      ...baseHandlers,
      has: (_: FakeWindow, p: PropertyKey) => {
        return this.isProtectVariable(p) ? false : true;
      },
    };

    // 其实都是代理 window, 但是通过 has 能够解决 var xxx 的问题
    const proxy = new Proxy(fakeWindow, parentHandlers);
    const subProxy = new Proxy(fakeWindow, baseHandlers);

    proxy.self = subProxy;
    proxy.window = subProxy;
    proxy.globalThis = subProxy;


    proxy.top = rawWindow.top === rawWindow
      ? subProxy
      : rawWindow.top;

    proxy.parent = rawWindow.parent === rawWindow
      ? subProxy
      : rawWindow.top;
执行环境
初始化容器
这部分结构可以在指定挂载的dom下看到。代码执行不仅需要js环境也需要dom树的构建，因此在一切开始之前会先初始化子应用挂载的dom树结构
export function createAppContainer(name: string, strictIsolation: boolean) {
  // 创建临时节点，该节点由 module 自行销毁
  const appContainer = document.createElement('div');
  const htmlNode = document.createElement(strictIsolation ? 'html' : 'div');

  appContainer.id = `garfish_app_for_${name || 'unknow'}_${createKey()}`;

  if (strictIsolation) {
    const root = appContainer.attachShadow({ mode: 'open' });
    root.appendChild(htmlNode);
    asyncNodeAttribute(htmlNode, rawDocument.body);
    dispatchEvents(root);
  } else {
    htmlNode.setAttribute('__GarfishMockHtml__', '');
    appContainer.appendChild(htmlNode);
  }

  return {
    htmlNode,
    appContainer,
  };
}
初始化结果基本如下
[图片]

从结构上也可以看出我们前面提到的document的重写部分所做的拦截操作的意义，其实就是为了防止dom元素越界。上图构造的html,body，head就是我们产找dom的顶级元素。
代码的执行
在获取资源内容一节我们已经对script资源的获取进行了解析。但是这个部分代码具体是如何在沙箱环境执行的呢，在实例化app时会有一个方法execScript，实现如下，其中的code参数就是我们script获取的代码字符串。
  execScript(
    code: string,
    url?: string,
    options?: { async?: boolean; noEntry?: boolean },
  ) {
    try {
      (this.sandbox as Sandbox).execScript(code, url, options);
    } catch (e) {
      this.context.emit(ERROR_COMPILE_APP, this, e);
      throw e;
    }
  }
可以看到这部分的实现调用了沙箱中的execScript,这里先说下前置知识，基本所有的沙箱环境的代码执行都会使用with这个语法来处理代码的执行上下文，并且有着天然的优势。在vue中处理模板中访问变量this关键字的方式也采用了这个方式。
接下来看下具体的实现。
  execScript(code: string, url = '', options?: ExecScriptOptions) {
    // 省略一些次要代码，保留核心逻辑
    // 这里的context就是我们上面创建的代理window
    const context = this.context;
    const refs = { url, code, context };

    // 这一步是创建一个script标签如果url存在，src为给定的url,否则code放到标签体内
    // 返回值为清空这个script 元素的引用函数
    const revertCurrentScript = setDocCurrentScript(this, code, url, async);

    try {
      const sourceUrl = url ? `//# sourceURL=${url}\n` : '';
      let code = `${refs.code}\n${sourceUrl}`;

      if (this.options.openSandbox) {
        // 如果是非严格模式则需要with包裹保证内部代码执行的上下文为代理后的window
        code = !this.options.useStrict
          ? `with(window) {;${this.attachedCode + code}}`
          : code;
        // 这个函数构造了代码执行环境
        evalWithEnv(code, {
          window: refs.context,
          ...this.overrideContext.overrides,
          unstable_sandbox: this,
        });
      } 
    } 

    revertCurrentScript();

    if (noEntry) {
      refs.context.module = this.overrideContext.overrides.module;
      refs.context.exports = context.module.exports;
    }
  }
接下来看下evalWithEnv的实现逻辑，这个函数的执行逻辑也很简单，就是把我们的代码内容放到一个构造出来的上下文中执行，上下文中的window,document等对象都是我们重写和代理过的，因此保证了环境的隔离。
export function internFunc(internalizeString) {
  const temporaryOb = {};
  temporaryOb[internalizeString] = true;
  return Object.keys(temporaryOb)[0];
}

export function evalWithEnv(code: string, params: Record<string, any>) {
  const keys = Object.keys(params);
  // 不可使用随机值，否则无法作为常量字符串复用
  // 将我们代理过的全局变量挂到一个指定属性下
  const randomValKey = '__garfish__exec_temporary__';

  const vals = keys.map((k) => `window.${randomValKey}.${k}`);
  try {
    rawWindow[randomValKey] = params;
    // 数组首尾元素中间就是我们代码实际运行的位置
    // 可以看到首先绑定代理过的window作为上下文，然后参数指定了我们代理和重写的对象，
    // 这样代码内获取注入document对象时其实已经是代理过的了
    const evalInfo = [
      `;(function(${keys.join(',')}){`,
      `\n}).call(${vals[0]},${vals.join(',')});`,
    ];
    const internalizeString = internFunc(evalInfo[0] + code + evalInfo[1]);
    // (0, eval) 这个表达式会让 eval 在全局作用域下执行
    (0, eval)(internalizeString);
  } finally {
    delete rawWindow[randomValKey];
  }
}
到这里我们知道代码的执行环境使我们代理的window和重写的方法构造的，配合上面的with语句的特性则可以解决变量提升相关的问题。到这里我们完成了代码从加载到执行的路径分析。
结语
上面的分析大多为了讲解基本思路，阐述微前端的基本实现思想，在实际的执行过程中会有很多其他逻辑的判断以及加载优化，如果有兴趣的可以参考源码实现。目前garfish也在不断的完善过程中，因为很多场景需要用户验证，开发能考虑到的业务case毕竟有限，在写这篇文章的时候每天都会有近百个commit提交更新过来。可以看到优化场景还是挺多的。微前端目前也有业务落地方面的实践，有兴趣的也可以了解下教务中台Garfish落地实践 。总的来说微前端确实很大程度上解决了项目迁移难，技术升级慢和难维护项目的问题。如果有上述痛点是可以尝试一下的。

Garfish 文档：Garfish 微前端框架 
Garfish 代码库：https://code.byted.org/pgcfe/garfish
Garfish 传送门：https://garfish.goofy.app/
