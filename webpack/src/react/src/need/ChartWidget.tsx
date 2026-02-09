import { useMemo } from 'react';
import { useVisibleQuery } from '../hooks/useVisibleQuery';
import { WorkerHelper } from '../web-workder/workerHelper';

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
  isVisible,
}: {
  queryParams: QueryParams;
  isVisible: boolean;
}) {
  // isVisible 由父组件传入，用于按需触发查询与取消

  const deps = useMemo(() => queryParams, [queryParams]);

  const chartType = useMemo(() => (queryParams as any)?.config?.type ?? 'line', [queryParams]);
  const { data, loading, error, refresh } = useVisibleQuery(
    isVisible,
    deps,
    () => WorkerHelper.query(chartType, queryParams),
    String((queryParams as any)?.id ?? '')
  );

  return (
    <div style={{ height: 300 }}>
      {loading && <div>加载中...</div>}
      {error && <div onClick={refresh}>查询失败，点击重试</div>}
      {data && <div>这里渲染图表，数据点数：{data?.length ?? 0}</div>}
    </div>
  );
}