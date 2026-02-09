import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ChartWidget } from './ChartWidget';

/**
 * 容器：栅格项进入可视区才挂载子组件
 * @param items 图表项数组，包含 id 与 queryParams
 */
/**
 * DashboardItem
 * 功能：使用 useIntersectionObserver 观测自身进入可视区，首次可见后挂载图表组件
 * @param item 图表项（包含 id 与 queryParams）
 * @param fetchChartData 获取图表数据的函数
 * @returns JSX.Element
 */
function DashboardItem({
    item,
}: {
    item: { id: string; queryParams: any };
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: [0, 0.5, 1], rootMargin: '50px 0px' });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isVisible && !mounted) setMounted(true); // 首次可见后挂载并保持
    }, [isVisible, mounted]);

    return (
        <div ref={ref} style={{ minHeight: 300 }}>
            {mounted && (
               <ChartWidget queryParams={item.queryParams} isVisible={isVisible} />
            )}
        </div>
    );
}

/**
 * 容器：栅格项进入可视区才挂载子组件（基于 useIntersectionObserver）
 * @param items 图表项数组，包含 id 与 queryParams
 * @param fetchChartData 获取图表数据的函数
 */
export function DashboardGrid({
    items,
}: {
    items: Array<{ id: string; queryParams: any }>;
}) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {items.map(item => (
                <DashboardItem key={item.id} item={item} />
            ))}
        </div>
    );
}