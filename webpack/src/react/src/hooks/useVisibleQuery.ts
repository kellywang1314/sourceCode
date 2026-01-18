


// 功能：仅在 isVisible 为 true 且依赖项变化时触发查询；离开视区取消请求；使用 AbortController 进行取消
import { useEffect, useRef, useState } from 'react';

/**
 * 可见才触发查询的 Hook（使用 AbortController 取消）
 * @param isVisible 是否在可视区
 * @param deps 查询的依赖项（配置、时间范围、筛选等），用于去重
 * @param queryFn 查询函数，接受 AbortSignal 用于取消
 * @returns data/loading/error/refresh/cancel
 */
export function useVisibleQuery<T>(
    isVisible: boolean,
    deps: unknown,
    queryFn: (signal: AbortSignal) => Promise<T>
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const lastDeps = useRef<string>('');
    const controllerRef = useRef<AbortController | null>(null);

    /** 手动刷新：在可见时重复触发一次查询 */
    async function refresh() {
        if (!isVisible) return;
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        setError(null);
        try {
            const res = await queryFn(controller.signal);
            setData(res);
        } catch (e: any) {
            if (e.name !== 'AbortError') setError(e);
        } finally {
            setLoading(false);
            controllerRef.current = null;
        }
    }

    useEffect(() => {
        const depsKey = JSON.stringify(deps ?? {});
        if (!isVisible || depsKey === lastDeps.current) {
            return () => {
                if (controllerRef.current) controllerRef.current.abort();
            };
        }
        lastDeps.current = depsKey;
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true); setError(null);

        queryFn(controller.signal)
            .then(res => setData(res))
            .catch(e => { if (e.name !== 'AbortError') setError(e); })
            .finally(() => { setLoading(false); controllerRef.current = null; });

        return () => controller.abort();
    }, [isVisible, deps, queryFn]);

    function cancel() {
        if (controllerRef.current) controllerRef.current.abort();
    }

    return { data, loading, error, refresh, cancel };
}

