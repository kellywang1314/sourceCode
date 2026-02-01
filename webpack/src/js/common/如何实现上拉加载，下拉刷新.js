// 概念定义
// - 上拉加载：当用户向下滚动接近列表底部时，自动或点击触发“加载下一页”的动作，一般把新数据追加到列表底部
// - 下拉刷新：当列表已滚动到顶部时，用户继续向下拉动，触发“刷新当前数据”的动作，一般重置分页并重新请求第一页，更新列表内容。
// 交互与体验
// - 下拉刷新：顶部出现下拉指示与进度（箭头/转圈），超过阈值松手触发刷新，刷新中保持提示，完成后回弹复位。
// - 上拉加载：底部出现“加载中/没有更多了”提示，可在接近底部提前预取，减少等待。

// （Web 推荐：IntersectionObserver）
// - 思路 ：列表底部放一个“哨兵元素”（sentinel），当它进入视口就加载下一页。
// - 关键状态 ：
// - cursor ：分页指针（推荐后端用 cursor）
// - hasMore ：是否还有下一页
//     - loading ：防止重复触发
//     - requestId 或 abortController ：防止乱序覆盖
// 示例（简化版）

/**
 * 创建下拉刷新观察器：当哨兵进入视口时触发 loadMore
 * @param {HTMLElement} sentinel 哨兵元素
 * @param {() => Promise<void>} loadMore 加载下一页函数
 * @returns {() => void} 取消观察函数
 */
export function createInfiniteScrollObserver(
    sentinel,
    loadMore
){
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

/* 上拉加载
- MemberDayFeedProduct 的“下滑刷新”是“滑到底部自动加载更多”的实现
- 靠监听页面容器 memberDayLayout 的滚动事件，接近底部时触发 onLoadMore，
服务端返回新数据后适配到组件状态，直到 hasMore 为 false 显示“没有更多商品了”。
*/
<div id='memberDayLayout'>...</div>
useEffect(() => {
    const wrapperDom = document.getElementById('memberDayLayout');
    const handleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = wrapperDom;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      if (scrollBottom < 10 && !loading && hasMore) {
        handleLoadMore?.();
      }
    }, 100);

    wrapperDom?.addEventListener?.('scroll', handleScroll);

    if (!hasMore) {
      wrapperDom?.removeEventListener('scroll', handleScroll);
    }
    return () => {
      wrapperDom?.removeEventListener('scroll', handleScroll);
    };
}, [loading, hasMore, handleLoadMore]);


/**
 * createPullToRefreshObserver
 * 功能：基于触摸手势的下拉刷新。仅当滚动容器到顶（scrollTop===0）时响应下拉，
 * 超过阈值触发 refresh，过程带阻尼位移与回弹动画，防并发，支持清理监听。
 * @param {HTMLElement} scrollContainer 滚动容器（需固定高度且 overflow: auto）
 * @param {() => Promise<void>} refresh 刷新函数（一般重置分页并拉取第一页）
 * @returns {() => void} 清理函数
 */
export function createPullToRefreshObserver(scrollContainer, refresh) {
    // 刷新锁：防止并发刷新
    let locked = false
    // 起始触点 Y 坐标
    let startY = 0
    // 是否处于下拉过程
    let pulling = false
    // 当前下拉位移（像素，含阻尼）
    let pullDistance = 0
    // 触发刷新阈值（下拉超过该像素触发刷新）
    const thresholdPx = 100
    // 最大可下拉位移（上限，避免过度拉动）
    const maxPullPx = 160
    // 刷新中的停留位移（给予用户视觉反馈）
    const holdPx = 60
    // 位移的内容节点（优先使用容器的第一个子节点）
    const content = scrollContainer.firstElementChild || scrollContainer
    // rAF ID：用于合并绘制、避免抖动
    let rafId = 0

    // 将内容整体向下位移，使用 rAF 合并绘制，避免频繁重排
    const applyTransform = (y) => {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
            // 位移：translateY，不影响布局流，性能更好
            content.style.transform = `translateY(${y}px)`
        })
    }

    // 手势开始：仅在容器“到顶”时才开始捕获下拉
    const onTouchStart = (e) => {
        // 刷新进行中，忽略新的手势
        if (locked) return
        // 非顶部不响应，避免与正常滚动冲突
        if (scrollContainer.scrollTop > 0) return
        // 记录起点
        startY = e.touches[0].clientY
        pulling = true
        pullDistance = 0
        // 过程不启用过渡，提升跟手性
        content.style.transition = 'none'
    }

    // 手势移动：计算下拉距离，加入阻尼并位移
    const onTouchMove = (e) => {
        if (!pulling) return
        const curY = e.touches[0].clientY
        const delta = curY - startY
        // 只处理“向下”位移
        if (delta <= 0) return
        // 阻止默认 overscroll 橡皮筋行为
        e.preventDefault()
        // 阻尼：控制位移感，限制最大下拉位移
        pullDistance = Math.min(maxPullPx, delta * 0.5)
        applyTransform(pullDistance)
    }

    // 手势结束：超过阈值触发刷新，否则回弹
    const onTouchEnd = async () => {
        if (!pulling) return
        pulling = false
        // 回弹/停留使用过渡动画
        content.style.transition = 'transform 200ms ease'
        if (pullDistance >= thresholdPx && !locked) {
            // 刷新锁，避免并发
            locked = true
            // 刷新中停留在一个固定高度，给视觉反馈
            applyTransform(holdPx)
            try {
                // 触发实际刷新逻辑（通常重置分页并拉取第一页）
                await refresh()
            } finally {
                // 刷新完成后回弹复位并释放锁
                applyTransform(0)
                locked = false
            }
        } else {
            // 未达阈值，直接回弹
            applyTransform(0)
        }
    }

    scrollContainer.addEventListener('touchstart', onTouchStart, { passive: true })
    scrollContainer.addEventListener('touchmove', onTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', onTouchEnd)
    scrollContainer.addEventListener('touchcancel', onTouchEnd)

    return function cleanup() {
        scrollContainer.removeEventListener('touchstart', onTouchStart)
        scrollContainer.removeEventListener('touchmove', onTouchMove)
        scrollContainer.removeEventListener('touchend', onTouchEnd)
        scrollContainer.removeEventListener('touchcancel', onTouchEnd)
        content.style.transition = ''
        content.style.transform = ''
    }
}
