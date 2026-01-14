export const test = [
    '1. 使用Promise实现红绿灯交替重复亮',
    '2. bind、call、apply有什么区别？如何实现一个bind？',
    '3. 利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。',
    '4. 说说new操作符具体干了什么？',
    '5. 如何实现上拉加载，下拉刷新？',
    '6. 大文件怎么实现断点续传？',
    '7. 什么是防抖和节流，以及如何编码实现？',
    '8. 说说ajax的原理，以及如何实现？',
    '9. 深拷贝浅拷贝有什么区别？怎么实现深拷贝？',
    '10. 用js实现二叉树的定义和基本操作',
    '11. 如何实现一个轮播图组件？',
    '12. 写出一个函数trans，将数字转换成汉语的输出，输入为不超过10000...',
    '13. 将下面的数组转成树状结构',
    '15. 实现lodash的set和get方法',
    '16. 去除字符串中出现次数最少的字符，不改变原字符串的顺序。',
    '17. 实现一个批量请求函数，要求能够限制并发量',
    '18. 树转数组',
    '20. 删除链表的一个节点',
    '21. 请实现一个函数，要求能在页面请求很多时，尽可能快地按照顺序输..',
    '22. 实现一个请求函数:fetchWithRetry，要求会最多自动重试 3 次，任...',
    '23. 链表中，环的入口节点',
    '24. 多叉树指定层节点的个数',
    '25. 请手写“快速排序”',
    '26. 使用js实现有序数组组原地去重',
    '27. 计算出下面数组中的平均时间',
    '28. 实现 compose 函数,类似于koa 的中间件洋葱模型',
    '29. 请按以下要求实现方法 fn:遇到退格字符就删除前面的字符，遇到两.',
    '30. Promise 的 finally 怎么实现的？'
];

/**
 * 1. startTrafficLightLoop
 * 功能：使用 Promise/async 实现红绿黄灯依次循环亮；times 不传则无限循环
 * @param times 循环次数（可选）
 */
export async function startTrafficLightLoop(times?: number): Promise<void> {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    async function oneCycle() {
        console.log('red'); await delay(1000);
        console.log('green'); await delay(1000);
        console.log('yellow'); await delay(500);
    }
    if (times === undefined) {
        // 无限循环
        // eslint-disable-next-line no-constant-condition
        while (true) { await oneCycle(); }
    } else {
        for (let i = 0; i < times; i++) await oneCycle();
    }
}

/**
 * 2. myBind
 * 功能：实现一个 bind，绑定 this 与预置参数；支持作为构造函数使用
 * @param fn 目标函数
 * @param context 绑定的 this
 * @param preset 预置参数
 * @returns 绑定后的函数
 */
export function myBind<T extends (...args: any[]) => any>(fn: T, context: any, ...preset: any[]) {
    function bound(this: any, ...later: any[]) {
        const isNew = this instanceof (bound as any);
        const thisArg = isNew ? this : context;
        return fn.apply(thisArg, [...preset, ...later]);
    }
    (bound as any).prototype = Object.create((fn as any).prototype);
    return bound as T;
}

/**
 * 3. compressString
 * 功能：按字符连续出现次数压缩字符串，如 aabcccccaaa -> a2b1c5a3；若压缩后更长则返回原串
 * @param s 输入字符串
 * @returns 压缩结果或原串
 */
export function compressString(s: string): string {
    if (!s) return s;
    let res = '';
    let cnt = 1;
    for (let i = 1; i <= s.length; i++) {
        if (i < s.length && s[i] === s[i - 1]) cnt++;
        else { res += s[i - 1] + String(cnt); cnt = 1; }
    }
    return res.length < s.length ? res : s;
}

/**
 * 4. myNewOperator
 * 功能：模拟 new 操作符：创建实例、绑定原型、执行构造函数并返回对象
 * @param ctor 构造函数
 * @param args 构造参数
 * @returns 新实例对象
 */
export function myNewOperator(ctor: Function, ...args: any[]): any {
    const obj = Object.create(ctor.prototype);
    const ret = ctor.apply(obj, args);
    return (ret !== null && (typeof ret === 'object' || typeof ret === 'function')) ? ret : obj;
}

/**
 * 5. initInfiniteScroll
 * 功能：上拉加载（IntersectionObserver 简化版）
 * @param container 容器元素
 * @param loadMore 加载更多回调（返回 Promise）
 * @returns 销毁函数
 */
export function initInfiniteScroll(container: HTMLElement, loadMore: () => Promise<any>) {
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    container.appendChild(sentinel);
    let loading = false;
    const io = new IntersectionObserver(async (entries) => {
        if (entries.some(e => e.isIntersecting) && !loading) {
            loading = true;
            await loadMore();
            loading = false;
        }
    });
    io.observe(sentinel);
    return () => { io.disconnect(); sentinel.remove(); };
}

/**
 * 5+. initPullToRefresh
 * 功能：下拉刷新（移动端简化版，基于 touch 事件）
 * @param container 容器元素（需可滚动）
 * @param onRefresh 刷新回调（返回 Promise）
 * @returns 销毁函数
 */
// 一般基于server分页
// rn,
// hasMore,
// reqIndex,
export function initPullToRefresh(container: HTMLElement, onRefresh: () => Promise<any>) {
    let startY = 0;
    let pulling = false;
    const threshold = 60; // 触发阈值（像素）
    const onStart = (e: TouchEvent) => {
        if (container.scrollTop === 0) {
            startY = e.touches[0].clientY;
            pulling = true;
        }
    };
    const onMove = async (e: TouchEvent) => {
        if (!pulling) return;
        const delta = e.touches[0].clientY - startY;
        if (delta > threshold) {
            pulling = false;
            await onRefresh();
        }
    };
    const onEnd = () => { pulling = false; };
    container.addEventListener('touchstart', onStart, { passive: true });
    container.addEventListener('touchmove', onMove, { passive: true });
    container.addEventListener('touchend', onEnd, { passive: true });
    return () => {
        container.removeEventListener('touchstart', onStart);
        container.removeEventListener('touchmove', onMove);
        container.removeEventListener('touchend', onEnd);
    };
}

/**
 * 6. splitFileToChunks / uploadWithResume
 * 功能：大文件切片与断点续传（简化版）
 */
export function splitFileToChunks(file: File, chunkSize = 1024 * 1024): Blob[] {
    const chunks: Blob[] = [];
    let offset = 0;
    while (offset < file.size) {
        chunks.push(file.slice(offset, offset + chunkSize));
        offset += chunkSize;
    }
    return chunks;
}

/**
 * 功能：顺序上传切片（示例），业务端可结合服务端记录实现真正的断点续传
 * @param file 文件对象
 * @param request 上传请求函数 (chunk, index)
 * @param chunkSize 切片大小
 */
export async function uploadWithResume(
    file: File,
    request: (chunk: Blob, index: number) => Promise<void>,
    chunkSize = 1024 * 1024
) {
    const chunks = splitFileToChunks(file, chunkSize);
    for (let i = 0; i < chunks.length; i++) {
        await request(chunks[i], i);
    }
}

/**
 * 7. debounce
 * 功能：实现防抖（在等待时间内重新触发则重新计时）
 * @param fn 目标函数
 * @param wait 等待时间（毫秒）
 * 业务场景：
 * - 输入框搜索建议：停止输入 wait 毫秒后再发起请求
 * - 表单校验：用户停止输入后统一触发校验，减少频繁校验
 * - 自动保存草稿：编辑停止一段时间后后台保存
 * - 窗口 resize：拖拽结束后再进行重排/重绘/复杂计算
 * - 过滤条件切换：快速勾选筛选项，稳定后再请求数据
 * - 连续点击按钮：最后一次点击才执行（防重复提交/点赞）
 * - 滚动结束统计：滚动结束后再触发统计/打点
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300) {
    let timer: any = null;
    return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    } as T;
}

/**
 * 7+. throttle
 * 功能：实现节流（在间隔内仅触发一次）
 * @param fn 目标函数
 * @param wait 间隔时间（毫秒）
 * 业务场景：用户连续触发事件（如滚动、输入），仅在间隔内触发一次（如搜索、提交）
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait = 300) {
    let last = 0;
    let timer: any = null;
    return function (this: any, ...args: any[]) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        } else if (!timer) {
            timer = setTimeout(() => {
                last = Date.now();
                timer = null;
                fn.apply(this, args);
            }, wait - (now - last));
        }
    } as T;
}

/**
 * 8. ajaxRequest
 * 功能：XMLHttpRequest 封装为 Promise
 * @param url 请求地址
 * @param method 方法（默认 GET）
 * @param body 请求体
 * @param headers 头信息
 * @returns 文本响应
 */
export function ajaxRequest(
    url: string,
    method: string = 'GET',
    body?: any,
    headers: Record<string, string> = {}
): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
        xhr.onload = () => ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
            ? resolve(xhr.responseText)
            : reject(new Error(String(xhr.status)));
        xhr.onerror = () => reject(new Error('network_error'));
        xhr.send(body);
    });
}

/**
 * 9. deepClone
 * 功能：深拷贝对象/数组，支持循环引用与常见内置类型
 * @param obj 源对象
 * @returns 拷贝结果
 */
export function deepClone(obj: any, map = new WeakMap()): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (map.has(obj)) return map.get(obj);

    // 处理内置类型
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
    if (obj instanceof Map) {
        const m = new Map();
        map.set(obj, m);
        obj.forEach((v, k) => m.set(deepClone(k, map), deepClone(v, map)));
        return m;
    }
    if (obj instanceof Set) {
        const s = new Set();
        map.set(obj, s);
        obj.forEach(v => s.add(deepClone(v, map)));
        return s;
    }

    const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
    map.set(obj, clone);
    for (const key of Reflect.ownKeys(obj)) {
        (clone as any)[key as any] = deepClone((obj as any)[key as any], map);
    }
    return clone;
}

/**
 * 10. 二叉树定义与遍历
 * 功能：定义 TreeNode，并提供前序/中序/后序/层序遍历示例
 */
export class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 11. initCarousel
 * 功能：简易轮播图，自动播放与手动控制（容器子元素为轮播项）
 * @param {HTMLElement} container 容器元素
 * @param {number} [intervalMs=3000] 自动播放间隔毫秒
 * @returns {{start:Function, stop:Function, next:Function, prev:Function}}
 */
export function initCarousel(container: HTMLElement, intervalMs = 3000) {
    const items = Array.from(container.children) as HTMLElement[];
    let index = 0; let timer: any = null;
    function show(i: number) {
        items.forEach((el, k) => (el.style.display = k === i ? 'block' : 'none'));
    }
    function next() {
        index = (index + 1) % items.length; show(index);
    }
    function prev() {
        // 向前切换一项：index 减一并通过加 items.length 后取模，避免负数下标并实现回绕到最后一张
        index = (index - 1 + items.length) % items.length;
        show(index);
    }
    function start() { if (!timer) { timer = setInterval(next, intervalMs); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    show(0);
    return { start, stop, next, prev };
}

/**
 * 12. transToChinese
 * 功能：将 0-9999 的整数转换为中文读法（不含单位“万”）
 * @param {number} n 输入整数
 * @returns {string} 中文读法
 */
export function transToChinese(n: number): string {
    const num = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['', '十', '百', '千'];
    if (n === 0) return '零';
    if (n < 0 || n > 9999 || !Number.isInteger(n)) throw new Error('仅支持 0-9999 的整数');
    const digits = String(n).split('').map(d => Number(d));
    let res = ''; let lastZero = false;
    const len = digits.length;
    for (let i = 0; i < len; i++) {
        const d = digits[i]; const pos = len - i - 1;
        if (d === 0) { lastZero = true; }
        else {
            if (lastZero && res !== '') res += '零';
            res += num[d] + unit[pos];
            lastZero = false;
        }
    }
    res = res.replace(/^一十/, '十');
    return res;
}

/**
 * 13. arrayToTree
 * 功能：将扁平数组转为树结构（按 id/pid）
 * @param {Array<{id:number,pid:number|null|undefined}>} list 输入数组
 * @param {number|null} [rootPid=0] 作为根的 pid 值
 * @returns {any[]} 树结构数组
 */
export function arrayToTree<T extends { id: number; pid?: number | null }>(list: T[], rootPid: number | null = 0): (T & { children?: any[] })[] {
    const map = new Map<number, T & { children?: any[] }>();
    const roots: (T & { children?: any[] })[] = [];
    list.forEach(item => map.set(item.id, { ...item, children: [] }));
    list.forEach(item => {
        const node = map.get(item.id)!;
        const p = item.pid ?? null;
        // 根节点：pid 等于 rootPid 或父节点不存在
        if (p === rootPid || !map.get(p as any)) {
            roots.push(node);
        } else {
            const parent = map.get(p as any)!;
            (parent.children as any[]).push(node);
        }
    });
    return roots;
}



/**
 * 15. lodashGet / lodashSet
 * 功能：实现 lodash 的 get/set 简化版，支持 a.b[0].c 形式
 */
export function lodashGet(obj: any, path: string, defaultValue?: any): any {
    const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
    let cur = obj;
    for (const t of tokens) { if (cur == null) return defaultValue; cur = cur[t]; }
    return cur === undefined ? defaultValue : cur;
}

/**
 * 15. lodashSet
 * 函数功能：按照路径设置对象属性，支持点语法与数组下标（如 a.b[0].c）。
 * 参数：
 * - obj: any 目标对象（会被原地修改并返回同一引用）
 * - path: string 属性路径，支持 a.b[0].c 形式
 * - value: any 要设置的值
 * 行为与细节：
 * - 将 [index] 转为 .index 统一解析；遇到不存在的中间节点时自动创建（下一个 token 是数字则创建数组，否则创建对象）。
 * - 返回原始 obj 引用，便于链式操作；不处理原型链，仅操作自有属性。
 * 边界：
 * - 若路径为空字符串，保持对象不变；若中间节点为 null/undefined，则会按需创建。
 */
export function lodashSet(obj: any, path: string, value: any): any {
  // ["a", "b", "0", "c"] 
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean); // 统一路径为点分隔
  let cur = obj;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const isLast = i === tokens.length - 1;
    if (isLast) {
      cur[t] = value; // 最末节赋值
    } else {
      const nextIsIndex = /^\d+$/.test(tokens[i + 1]); // 下一个是否为数组下标
      if (cur[t] == null) cur[t] = nextIsIndex ? [] : {}; // 自动创建中间容器
      cur = cur[t]; // 下钻到下一层
    }
  }
  return obj;
}

/**
 * demoLodashSet
 * 功能：演示 lodashSet 路径解析与中间节点自动创建；配合 lodashGet 验证取值
 * @returns {void}
 */
export function demoLodashSet(): void {
  const obj: any = {};
  lodashSet(obj, 'a.b[0].c', 42); // 自动创建 a/b 数组与索引 0 的对象
  lodashSet(obj, 'a.b[1].d', 'X'); // 再设置索引 1 的对象属性
  lodashSet(obj, 'user.profile.name', 'Jack'); // 普通点语法
  console.log('demoLodashSet obj:', JSON.stringify(obj));
  console.log('get a.b[0].c =', lodashGet(obj, 'a.b[0].c'));
  console.log('get user.profile.name =', lodashGet(obj, 'user.profile.name'));
}

/**
 * 16. removeLeastFrequentChars
 * 功能：去除字符串中出现次数最少的字符，不改变原字符串顺序（删除所有最少频字符）
 * @param {string} s 输入字符串
 * @returns {string} 处理后的字符串
 */
export function removeLeastFrequentChars(s: string): string {
    if (!s) return s;
    const freq = new Map<string, number>();
    for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
    let min = Infinity;
    for (const v of freq.values()) min = Math.min(min, v);
    let res = '';
    for (const ch of s) { if ((freq.get(ch) || 0) !== min) res += ch; }
    return res;
}

/**
 * 17. runBatchWithConcurrencyLimit
 * 功能：并发限制的批量任务执行，保持结果与任务顺序一致；任一任务失败则整体拒绝
 * @param {Array<() => Promise<T>>} tasks 任务函数数组
 * @param {number} limit 并发上限（>=1）
 * @returns {Promise<T[]>} 所有任务的结果（按原顺序）
 */
export async function runBatchWithConcurrencyLimit<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
    if (limit <= 0) throw new Error('limit 必须 >= 1');
    const results: T[] = new Array(tasks.length);
    let running = 0; let completed = 0; let next = 0;
    return new Promise<T[]>((resolve, reject) => {
        const schedule = () => {
            while (running < limit && next < tasks.length) {
                const i = next++; 
                running++;
                Promise.resolve().then(tasks[i]).then((val) => {
                    results[i] = val; running--; completed++;
                    if (completed === tasks.length) resolve(results); else schedule();
                }).catch(reject);
            }
        };
        schedule();
    });
}

/**
 * 18. treeToArray
 * 功能：树结构转扁平数组，保留 id 与父子关系（生成 pid 字段），移除 children
 * @param {Array<T>} roots 根节点数组
 * @param {number|null} [rootPid=0] 根的 pid 值
 * @returns {Array<Omit<T,'children'> & { pid: number|null }>} 扁平数组
 */
export function treeToArray<T extends { id: number; children?: T[];[k: string]: any }>(
    roots: T[],
    rootPid: number | null = 0
): Array<Omit<T, 'children'> & { pid: number | null }> {
    const res: Array<Omit<T, 'children'> & { pid: number | null }> = [];
    const stack: Array<{ node: T; pid: number | null }> = roots.map(n => ({ node: n, pid: rootPid }));
    while (stack.length) {
        const { node, pid } = stack.pop()!;
        const { children, ...rest } = node as any;
        res.push({ ...(rest as T), pid });
        if (Array.isArray(children)) {
            for (const child of children) stack.push({ node: child, pid: node.id });
        }
    }
    return res.reverse();
}

/**
 * 20. 链表操作：删除节点
 * 功能：提供 ListNode 定义、按值删除节点、以及仅给定节点的删除（LeetCode 237）
 */
export class ListNode { constructor(public val: number, public next: ListNode | null = null) { } }

/**
 * 按值删除：删除链表中第一个值为 val 的节点
 * @param head 头节点
 * @param val 目标值
 * @returns 新的头节点
 */
export function deleteNodeByValue(head: ListNode | null, val: number): ListNode | null {
    if (!head) return null;
    if (head.val === val) return head.next;
    let cur: ListNode | null = head;
    while (cur && cur.next) {
        if (cur.next.val === val) { cur.next = cur.next.next; break; }
        cur = cur.next;
    }
    return head;
}

/**
 * 仅给定节点的删除：用后继覆盖当前节点并删除后继（要求节点非尾节点）
 * @param node 要删除的节点（非尾）
 * @returns {void}
 */
export function deleteNodeGivenOnlyNode(node: ListNode): void {
    if (!node || !node.next) throw new Error('节点必须非尾节点');
    node.val = node.next.val;
    node.next = node.next.next;
}

/**
 * 21. processRequestsInOrder
 * 功能：并发执行任务，尽可能快地“按原顺序”输出结果
 * @param tasks 任务函数数组（返回 Promise）
 * @param onOutput 输出回调 (value, index)
 * @returns Promise<结果数组>
 */
export async function processRequestsInOrder<T>(
  tasks: Array<() => Promise<T>>,
  onOutput: (val: T, index: number) => void
): Promise<T[]> {
  const results: (T | undefined)[] = new Array(tasks.length);
  let next = 0, completed = 0;
  return new Promise<T[]>((resolve, reject) => {
    tasks.forEach((task, i) => {
      Promise.resolve().then(task).then(val => {
        results[i] = val;
        while (next < results.length && results[next] !== undefined) {
          onOutput(results[next] as T, next);
          next++;
        }
        completed++;
        if (completed === tasks.length) resolve(results as T[]);
      }).catch(reject);
    });
  });
}

/**
 * 22. fetchWithRetry
 * 功能：请求失败自动重试（指数回退 + 随机抖动）
 * @param url 请求地址
 * @param options fetch 选项
 * @param maxRetries 最大重试次数（默认 3）
 * @param baseDelayMs 基础延迟毫秒（默认 300）
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseDelayMs = 300
): Promise<Response> {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      throw new Error(String(res.status));
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
      await new Promise(r => setTimeout(r, delay));
      attempt++;
    }
  }
}

/**
 * 23. detectCycle
 * 功能：链表环的入口节点（Floyd 算法，LeetCode 142）
 * @param head 头节点
 * @returns 环入口节点或 null
 */
export function detectCycle(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head, fast: ListNode | null = head;
  while (fast && fast.next) {
    slow = slow!.next; fast = fast.next.next;
    if (slow === fast) break;
  }
  if (!fast || !fast.next) return null;
  let p1: ListNode | null = head, p2: ListNode | null = slow;
  while (p1 !== p2) { p1 = p1!.next; p2 = p2!.next; }
  return p1;
}

/**
 * 24. MultiTreeNode / countNodesAtLevel
 * 功能：多叉树指定层的节点数量（根为第 1 层）
 */
export class MultiTreeNode { constructor(public val: any, public children: MultiTreeNode[] = []) {} }
export function countNodesAtLevel(root: MultiTreeNode | null, level: number): number {
  if (!root || level <= 0) return 0;
  let depth = 1;
  const q: MultiTreeNode[] = [root];
  while (q.length) {
    const size = q.length;
    if (depth === level) return size;
    for (let i = 0; i < size; i++) {
      const node = q.shift()!;
      for (const c of node.children) q.push(c);
    }
    depth++;
  }
  return 0;
}

/**
 * 25. quickSort
 * 功能：手写快速排序（原地）
 * @param nums 数组
 * @returns 排序后的同一数组引用
 */
export function quickSort(nums: number[]): number[] {
  function partition(lo: number, hi: number): number {
    const pivot = nums[hi]; let i = lo;
    for (let j = lo; j < hi; j++) { if (nums[j] <= pivot) { [nums[i], nums[j]] = [nums[j], nums[i]]; i++; } }
    [nums[i], nums[hi]] = [nums[hi], nums[i]]; return i;
  }
  function sort(lo: number, hi: number) { if (lo >= hi) return; const p = partition(lo, hi); sort(lo, p - 1); sort(p + 1, hi); }
  sort(0, nums.length - 1); return nums;
}

/**
 * 26. removeDuplicatesInPlaceSorted
 * 功能：有序数组原地去重，返回新长度（LeetCode 26）
 */
export function removeDuplicatesInPlaceSorted(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[fast - 1]) { nums[slow] = nums[fast]; slow++; }
  }
  return slow;
}

/**
 * 27. averageTimeMs / formatDurationMs
 * 功能：计算数组中事件的平均耗时（毫秒）与格式化展示
 */
export function averageTimeMs(entries: Array<{ start: number | Date; end: number | Date }>): number {
  if (!entries.length) return 0;
  let sum = 0;
  for (const e of entries) {
    const s = e.start instanceof Date ? e.start.getTime() : e.start;
    const t = e.end instanceof Date ? e.end.getTime() : e.end;
    sum += Math.max(0, t - s);
  }
  return Math.floor(sum / entries.length);
}
export function formatDurationMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/**
 * 28. compose（洋葱模型）
 * 功能：组合中间件，按 next 链式调用（类似 Koa）
 */
export function compose<T>(middlewares: Array<(ctx: T, next: () => Promise<void>) => Promise<void>>) {
  return function run(ctx: T, next?: () => Promise<void>) {
    let index = -1;
    async function dispatch(i: number): Promise<void> {
      if (i <= index) throw new Error('next() called multiple times');
      index = i; const fn = middlewares[i] || next; if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }
    return dispatch(0);
  };
}

/**
 * 29. processBackspace
 * 功能：遇到退格字符（默认 #）删除前一个字符
 */
export function processBackspace(input: string, backspaceChar = '#'): string {
  const stack: string[] = [];
  for (const ch of input) { if (ch === backspaceChar) { if (stack.length) stack.pop(); } else stack.push(ch); }
  return stack.join('');
}

/**
 * 30. promiseFinally
 * 功能：实现 Promise 的 finally 语义（无论成功/失败都执行 onFinally）
 */
export function promiseFinally<T>(promise: Promise<T>, onFinally: () => any): Promise<T> {
  const handler = () => Promise.resolve(onFinally());
  return promise.then(
    (val) => handler().then(() => val),
    (err) => handler().then(() => { throw err; })
  );
}
