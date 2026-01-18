import React, { useMemo, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useVisibleQuery } from '../hooks/useVisibleQuery';

type QueryParams = {
  timeRange: { start: string; end: string };
  filters: any[];
  config: any;
};

/**
 * 图表组件：仅在可视区触发查询；离开时取消
 * @param queryParams 查询依赖项（时间、筛选、配置）
 * @param fetchChartData 查询函数（支持取消）
 */
export function ChartWidget({
  queryParams,
  fetchChartData,
}: {
  queryParams: QueryParams;
  fetchChartData: (params: QueryParams, signal: AbortSignal) => Promise<any>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(containerRef, { threshold: [0, 0.5, 1], rootMargin: '50px 0px'  });

  const deps = useMemo(() => queryParams, [queryParams]);

  const { data, loading, error, refresh } = useVisibleQuery(
    isVisible,
    deps,
    (signal) => fetchChartData(queryParams, signal)
  );

  return (
    <div ref={containerRef} style={{ height: 300 }}>
      {loading && <div>加载中...</div>}
      {error && <div onClick={refresh}>查询失败，点击重试</div>}
      {data && <div>这里渲染图表，数据点数：{data?.length ?? 0}</div>}
    </div>
  );
}