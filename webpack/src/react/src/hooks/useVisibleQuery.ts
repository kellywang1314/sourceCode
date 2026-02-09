


// 功能：仅在 isVisible 为 true 且依赖项变化时触发查询；离开视区取消请求；使用 AbortController 进行取消
import { useEffect, useRef, useState } from 'react';
import { WorkerHelper } from '../web-workder/workerHelper';

/**
 * 可见才触发查询的 Hook（使用 AbortController 取消）
 * @param isVisible 是否在可视区
 * @param deps 查询的依赖项（配置、时间范围、筛选等），用于去重
 * @param queryFn 查询函数，接受 AbortSignal 用于取消
 * @returns data/loading/error/refresh
 */
export function useVisibleQuery<T>(
    isVisible: boolean,
    deps: unknown,
    queryFn: () => Promise<T>,
    cancelId?: string
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const lastDeps = useRef<string>('');

    /** 手动刷新：在可见时重复触发一次查询（取消统一由外部维护） */
    async function refresh() {
        if (!isVisible) return;
        setLoading(true);
        setError(null);
        try {
            const res = await queryFn();
            setData(res);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const depsKey = JSON.stringify(deps ?? {});
        if (!isVisible) {
            if (cancelId) WorkerHelper.cancelQuery(cancelId);
            return;
        }
        if (depsKey === lastDeps.current) {
            return;
        }
        lastDeps.current = depsKey;
        setLoading(true);
        setError(null);

        queryFn()
            .then(res => setData(res))
            .catch(e => setError(e))
            .finally(() => setLoading(false));

        return () => {
            if (cancelId) WorkerHelper.cancelQuery(cancelId);
        };
    }, [isVisible, deps, queryFn, cancelId]);

    return { data, loading, error, refresh };
}

