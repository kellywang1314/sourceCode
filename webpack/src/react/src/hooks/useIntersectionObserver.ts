// React + TS 示例
// 功能：检测某个元素是否进入可视区
// 使用原生 IntersectionObserver，支持 threshold 与 rootMargin
import { useEffect, useState, RefObject } from 'react';

/**
 * 检测元素是否在可视区
 * @param targetRef 需要观测的元素 ref
 * @param options IntersectionObserver 可选配置
 * @returns isVisible：是否在可视区
 */
export function useIntersectionObserver(
    targetRef: RefObject<Element>,
    options: IntersectionObserverInit = { threshold: [0, 0.5, 1] }
) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = targetRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(entries => {
            const entry = entries[0];
            setIsVisible(entry.intersectionRatio > 0);
        }, options);

        observer.observe(el);
        return () => observer.unobserve(el);
    }, [targetRef, options.root, options.rootMargin, options.threshold]);

    return isVisible;
}