import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WorkerHelper } from './WorkerHelper';

/**
 * 仅在可视区触发查询的图表组件（结合 Web Worker 格式化）
 * @param props.type 图表类型，如 'line'/'bar'/'table'
 * @param props.source 资产来源，如 'cockpit'/'dashboard'
 * @param props.resourceId 资产 id
 * @param props.params 查询参数（需包含唯一 id）
 * @param props.baseUrl 接口基础地址
 * @param props.isShared 是否为分享场景
 * @param props.sharedResult 分享场景预置查询结果
 */
export function ChartWidget(props: {
  type: string;
  source: string;
  resourceId: string;
  params: any;
  baseUrl?: string;
  isShared?: boolean;
  sharedResult?: any;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const depsKey = useMemo(() => JSON.stringify(props.params ?? {}), [props.params]);

  /**
   * 观测容器是否进入可视区
   * @param el 容器元素
   */
  const observeVisibility = (el: Element) => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.intersectionRatio > 0);
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const unobserve = observeVisibility(el);
    return unobserve;
  }, []);

  /**
   * 当进入可视区且依赖变化时触发查询；离开可视区取消请求
   */
  useEffect(() => {
    if (!isVisible) {
      // 离开视区取消进行中请求
      const id = String(props.params?.id ?? '');
      if (id) WorkerHelper.cancelQuery(id);
      return;
    }

    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await WorkerHelper.query(
          props.type,
          props.params,

        );
        if (mounted) setData(res);
      } catch (e: any) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [isVisible, depsKey, props.type, props.source, props.resourceId, props.baseUrl, props.isShared]);

  return (
    <div ref={containerRef} style={{ height: 320, border: '1px solid #eee', padding: 12 }}>
      {loading && <div>加载中...</div>}
      {error && (
        <div style={{ color: 'red' }}>
          查询失败：{error.message}
        </div>
      )}
      {!loading && !error && data && (
        <div>
          {/* 这里渲染图表库（ECharts/Recharts/LightCharts 等），演示用 */}
          <div>数据点数量：{Array.isArray(data?.data) ? data.data.length : 0}</div>
          <div>序列数量：{Array.isArray(data?.series) ? data.series.length : 0}</div>
        </div>
      )}
    </div>
  );
}