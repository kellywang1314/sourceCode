
// 上拉加载（Web 推荐：IntersectionObserver）
// - 思路 ：列表底部放一个“哨兵元素”（sentinel），当它进入视口就加载下一页。
// - 关键状态 ：
// - page / cursor ：分页指针（推荐后端用 cursor）
// - hasMore ：是否还有下一页
//     - loading ：防止重复触发
//         - requestId 或 abortController ：防止乱序覆盖
// 示例（简化版）

/**
 * 创建上拉加载观察器：当哨兵进入视口时触发 loadMore
 * @param {HTMLElement} sentinel 哨兵元素
 * @param {() => Promise<void>} loadMore 加载下一页函数
 * @returns {() => void} 取消观察函数
 */
export function createInfiniteScrollObserver(
    sentinel: HTMLElement,
    loadMore: () => Promise<void>
): () => void {
    let locked = false;

    const io = new IntersectionObserver(async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (locked) return;
        locked = true;
        try {
            await loadMore();
        } finally {
            locked = false;
        }
    }, { root: null, rootMargin: '200px 0px', threshold: 0 });

    io.observe(sentinel);
    return () => io.disconnect();
}


// 下拉刷新（Web：监听触摸 + 顶部 overscroll）
// - 思路 ：用户在列表顶部继续下拉时，显示刷新 UI；超过阈值触发刷新；松手后执行请求并回弹。
// - 关键点
//     - 只能在“滚动容器已在顶部”时生效： scrollTop === 0
//         - 用 touchstart / touchmove / touchend 计算下拉距离
//             - 有 refreshing 状态防并发
//                 - 刷新动作一般是：重置分页指针、清空列表、重新拉第一页
// 简化伪代码

