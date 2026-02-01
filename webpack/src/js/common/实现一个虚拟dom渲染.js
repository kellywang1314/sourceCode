
let domNode = {
    tagName: 'ul',
    props: { class: 'list' },
    children: [{
        tagName: 'li',
        children: ['item1']
    }, {
        tagName: 'li',
        children: ['item1']
    }]
};

// 构建一个 render 函数，将 domNode 对象渲染为 以下 dom
<ul class="list">
    <li>item1</li>
    <li>item2</li>
</ul>

// 递归渲染子节点
function render(domNode) {
    if (!domNode) return null
    let node = document.createElement(domNode.tagName)
    if (domNode.props) {
        for (let i in domNode.props) {
            node.setAttribute(i, domNode.props[i])
        }
    }
    if (domNode.children) {
        for (let i in domNode.children) {
            if (typeof domNode.children[i] === 'object') {
                node.appendChild(render(domNode.children[i]))
            } else {
                node.appendChild(document.createTextNode(domNode.children[i]))
            }
        }
    }
    return node
}



/**
 * flattenArray
 * 递归扁平化嵌套数组
 * @param {any[]} arr 输入数组
 * @returns {any[]} 扁平结果
 */
function flattenArray(arr) {
    const res = []
        ; (function helper(a) {
            for (const item of a) {
                if (Array.isArray(item)) helper(item)
                else res.push(item)
            }
        })(arr)
    return res
}

/**
 * dfsTree
 * 深度优先遍历树结构（children 作为子节点）
 * @param {{children?: any[]}} node 根节点
 * @param {(n:any)=>void} visit 访问回调
 * @returns {void}
 */
function dfsTree(node, visit) {
    if (!node) return
    visit(node)
    const children = node.children || []
    for (const child of children) dfsTree(child, visit)
}

/**
 * renderToHtmlString
 * 递归将虚拟节点渲染为 HTML 字符串
 * @param {any} dom 虚拟节点
 * @returns {string} HTML 字符串
 */
function renderToHtmlString(dom) {
    if (typeof dom === 'string') return dom
    const attrs = dom.props ? Object.keys(dom.props).map(k => `${k}="${dom.props[k]}"`).join(' ') : ''
    const open = attrs ? `<${dom.tagName} ${attrs}>` : `<${dom.tagName}>`
    const children = (dom.children || []).map(c => renderToHtmlString(c)).join('')
    return `${open}${children}</${dom.tagName}>`
}

/**
 * permutations
 * 递归生成数组的全排列
 * @param {any[]} arr 输入数组
 * @returns {any[][]} 全排列结果
 */
function permutations(arr) {
    const res = []
    const used = Array(arr.length).fill(false)
    const path = []
    function backtrack() {
        if (path.length === arr.length) {
            res.push(path.slice())
            return
        }
        for (let i = 0; i < arr.length; i++) {
            if (used[i]) continue
            used[i] = true
            path.push(arr[i])
            backtrack()
            path.pop()
            used[i] = false
        }
    }
    backtrack()
    return res
}

/**
 * subsets
 * 递归生成数组的所有子集（幂集）
 * @param {any[]} arr 输入数组
 * @returns {any[][]} 子集结果
 */
function subsets(arr) {
    const res = []
    const path = []
    function dfs(i) {
        if (i === arr.length) {
            res.push(path.slice())
            return
        }
        dfs(i + 1)
        path.push(arr[i])
        dfs(i + 1)
        path.pop()
    }
    dfs(0)
    return res
}

/**
 * getValueByPath
 * 递归按路径读取嵌套对象的值
 * @param {object} obj 对象
 * @param {string[]} path 路径数组
 * @returns {any} 路径值
 */
function getValueByPath(obj, path) {
    if (!path || path.length === 0) return obj
    const [head, ...tail] = path
    if (obj == null) return undefined
    return getValueByPath(obj[head], tail)
}

/**
 * sumNestedNumbers
 * 递归求嵌套结构中所有数字之和
 * @param {any} input 输入
 * @returns {number} 求和结果
 */
function sumNestedNumbers(input) {
    if (Array.isArray(input)) return input.reduce((acc, cur) => acc + sumNestedNumbers(cur), 0)
    if (typeof input === 'number') return input
    if (input && typeof input === 'object') return Object.values(input).reduce((acc, cur) => acc + sumNestedNumbers(cur), 0)
    return 0
}
