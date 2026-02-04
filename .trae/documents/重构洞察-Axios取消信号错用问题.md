# 1. 问题

在 React 模块的接口封装中，`fetchChartData` 将 `AbortSignal` 当作请求体字段传入 axios，而不是作为 axios 配置项。这会导致取消信号无法生效，网络请求无法被中止，同时把不可序列化对象意外发往后端，增加接口异常与调试成本。

## 1.1. **取消信号传参错误**
- 位置：`webpack/src/react/api/index.ts` 第 16-31 行。
- 现状：`axios.post('/api/charts', { params, signal, timeout })` 将 `signal` 放入第二个参数（请求体），而不是第三个参数（axios 配置）。
- 影响：`AbortController` 取消不会生效；请求在视图离开或依赖变化时仍持续进行，占用资源并可能造成数据“回写过期”。

```ts
// 错误示例（节选）
export function fetchChartData(params: QueryParams, signal: AbortSignal) {
  return axios.post('/api/charts', {
    params,
    signal,            // 被作为请求体的一部分
    timeout: 15000,
  })
    .then(res => res.data)
    .catch(err => {
      if (err.name === 'CanceledError') {
        return Promise.reject(err);
      }
      return Promise.reject(err);
    });
}
```

## 1.2. **请求体污染与后端解析风险**
- 现状：把 `AbortSignal`（复杂对象）塞进请求体，后端可能收到异常字段或序列化失败。
- 影响：接口日志出现不明字段；部分框架在严格模式下可能直接报 400/422；问题定位成本上升。

## 1.3. **与可见性/取消机制脱节**
- 现状：`useVisibleQuery` 正确传入 `signal`，但 axios 未按规范接入，导致 Hook 的取消语义失效。
- 影响：视图离开/依赖变化时不正确中断请求；出现竞态条件与“旧数据覆盖新数据”的风险。

# 2. 收益

一句话：正确接入 axios 的 `signal` 配置项，实现可控取消，避免请求体污染，提升稳定性与维护效率。

## 2.1. **取消生效，减少资源浪费**
- 视图离开或依赖变化时，快速中止不再需要的请求，释放连接与线程。
- 预计核心查询函数的分支复杂度可从依赖额外判断减少到更清晰的 **~8** 左右（取消逻辑集中在 Hook），降低认知负担。

## 2.2. **避免请求体污染与后端误解析**
- 不再发送 `AbortSignal` 到后端，接口的入参更干净，错误更少、日志更清晰。

## 2.3. **更易测试与定位**
- 前端集成测试可精确模拟取消；后端不再需要处理奇怪字段。

# 3. 方案

总体思路：将 `signal` 放到 axios 的配置对象中（第三个参数），同时保持取消错误的分流处理，确保视图离开/依赖变化时的中止行为与 UI 状态一致。

## 3.1. **修改前代码示例**
```ts
export function fetchChartData(params: QueryParams, signal: AbortSignal) {
  return axios.post('/api/charts', {
    params,
    signal,            // 错误：放入请求体
    timeout: 15000,
  })
    .then(res => res.data)
    .catch(err => {
      if (err.name === 'CanceledError') {
        return Promise.reject(err);
      }
      return Promise.reject(err);
    });
}
```

## 3.2. **修改后代码示例**
```ts
export function fetchChartData(params: QueryParams, signal: AbortSignal) {
  return axios.post(
    '/api/charts',
    params,                     // 正确：请求体只放业务参数
    { signal, timeout: 15000 }  // 正确：取消信号放配置项
  )
    .then(res => res.data)
    .catch(err => {
      // axios v1 取消错误通常为 'CanceledError'
      if (err.name === 'CanceledError') return Promise.reject(err);
      return Promise.reject(err);
    });
}
```

- 解释：
  - axios 的第三个参数是配置对象，`signal` 必须在此处传递，取消才会生效。
  - 避免把复杂对象塞入请求体，保证入参可序列化且后端易解析。

## 3.3. **配套检查与使用建议**
- 在调用侧统一约定：所有支持取消的 API 均以 `(params, signal)` 形式，并由 Hook 或控制器生成 `signal`。
- 对常用 API 封装单测：校验 axios 调用时 `config.signal` 存在且为 `AbortSignal`。
- 可加轻量 ESLint 规则/自定义 lint（可选）：禁止把 `signal` 放入请求体。

# 4. 回归范围

从端到端场景验证取消生效与数据一致性，关注视图可见性变化与依赖更新。

## 4.1. 主链路
- 场景一：组件进入视图后触发查询，然后快速离开视图。
  - 预期：请求被取消，UI 不出现“旧数据覆盖”/无意义的错误提示。
- 场景二：依赖变化（时间范围/筛选项变更）触发新查询。
  - 预期：旧请求被取消，新请求完成后正确渲染。
- 场景三：手动刷新 `refresh()`。
  - 预期：并发控制合理，取消与重新发起不产生竞态污染。

## 4.2. 边界情况
- 取消后立刻重新发起：确保上一次请求不会在完成时覆盖新数据。
- 后端慢响应与超时：取消应及时生效，不等待超时；前端避免卡顿。
- 异常处理：`CanceledError` 不展示错误提示，其它错误按业务提示与重试策略执行。