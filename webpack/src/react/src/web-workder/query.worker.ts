/* eslint-disable */

/**
 * 处理主线程发来的数据格式化请求
 * @param event Web Worker 接收的消息，包含 method 与 options
 * @description
 * - method: 当前仅支持 'format'
 * - options: { id, data, type, params, lang }
 * 返回：{ id, data } 或 { id, error }
 */
const handleMessage = (event: MessageEvent) => {
  const { method, options } = event.data || {};
  const { id, data, type, params } = options || {};
  try {
    if (method === 'format') {
      const formatted = formatDataByType(type, data, params);
      // 约定回传结构
      (self as any).postMessage({ id, data: formatted });
    } else {
      (self as any).postMessage({ id, error: new Error('unsupported method') });
    }
  } catch (error) {
    (self as any).postMessage({ id, error });
  }
};

/**
 * 根据图表类型格式化数据
 * @param type 图表类型（如 'line'、'bar' 等）
 * @param rawData 原始返回数据
 * @param params 查询请求参数（可用于辅助格式化）
 * @returns 格式化后的数据结构，供图表组件直接渲染
 */
function formatDataByType(type: string, rawData: any, params: any) {
  // 示例：最小实现，直接透传
  // 实际中可按类型做堆积/百分比/多序列合并/标注转换等重运算
  return {
    data: rawData?.data ?? [],
    series: rawData?.series ?? [],
    delayedMessage: rawData?.delayedMessage ?? [],
    aimValues: rawData?.aimValues ?? [],
    percent: rawData?.percent ?? { main: false, secondary: false },
    feQueryConfig: rawData?.feQueryConfig ?? {},
  };
}

(self as any).addEventListener('message', handleMessage);