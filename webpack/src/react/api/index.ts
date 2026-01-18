import axios from 'axios';


type QueryParams = {
    timeRange: { start: string; end: string };
    filters: any[];
    config: any;
};
/**
 * fetchChartData
 * 功能：使用 axios 并接入 AbortController 的 signal，可被 Hook/队列中止
 * @param params 查询参数
 * @param signal AbortSignal（来自 useVisibleQuery）
 * @returns Promise<any>
 */
export function fetchChartData(params: QueryParams, signal: AbortSignal) {
    return axios.post('/api/charts', {
        params,
        signal,            // 关键：接入取消信号
        timeout: 15000,    // 可选：超时
    })
        .then(res => res.data)
        .catch(err => {
            // axios v1 取消错误类型通常为 'CanceledError'
            if (err.name === 'CanceledError') {
                // 被取消，按需忽略
                return Promise.reject(err);
            }
            return Promise.reject(err);
        });
}