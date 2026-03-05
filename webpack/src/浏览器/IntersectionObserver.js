/**
 * observeElementVisibility
 * 功能：观测单个元素进入/离开可视区，进入时触发 onEnter，离开时触发 onLeave
 * @param {Element} target 需要观测的元素
 * @param {IntersectionObserverInit} [options] IO 配置（root、rootMargin、threshold）
 * @param {(entry: IntersectionObserverEntry) => void} [onEnter] 进入可视区回调
 * @param {(entry: IntersectionObserverEntry) => void} [onLeave] 离开可视区回调
 * @returns {() => void} 取消观测函数
 */
export function observeElementVisibility(target, options = { threshold: [0, 0.5, 1] }, onEnter, onLeave) {
    if (!target) return () => { };
    const io = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) onEnter && onEnter(entry);
        else onLeave && onLeave(entry);
    }, options);
    io.observe(target);
    return () => io.disconnect();
}

/**
 * createInfiniteScrollObserver
 * 功能：底部“哨兵元素”进入可视区时触发加载更多；常用于上拉加载
 * @param {HTMLElement} sentinel 底部哨兵元素（放在列表末尾）
 * @param {() => Promise<void>|void} loadMore 加载更多函数
 * @param {IntersectionObserverInit} [options] IO 配置（可用 root 指定滚动容器，rootMargin 做预取）
 * @returns {() => void} 取消观测函数
 */
export function createInfiniteScrollObserver(
    sentinel,
    loadMore,
    options = { root: null, rootMargin: '200px 0px', threshold: 0 }
) {
    if (!sentinel || typeof loadMore !== 'function') return () => { };
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
    }, options);
    io.observe(sentinel);
    return () => io.disconnect();
}

/**
 * observeLazyImages
 * 功能：懒加载图片。对带有 data-src 的 <img> 进行观测，进入可视区后将 data-src 替换为 src 并停止观测
 * @param {NodeListOf<HTMLImageElement>|HTMLImageElement[]} images 需要懒加载的图片集合
 * @param {IntersectionObserverInit} [options] IO 配置（rootMargin 推荐 '200px 0px' 以提前加载）
 * @returns {() => void} 取消观测函数
 */
export function observeLazyImages(images, options = { root: null, rootMargin: '200px 0px', threshold: 0 }) {
    const list = Array.from(images || []).filter((img) => img && img.tagName === 'IMG');
    if (list.length === 0) return () => { };
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            const nextSrc = img.getAttribute('data-src');
            if (nextSrc) {
                img.src = nextSrc;
                img.removeAttribute('data-src');
            }
            io.unobserve(img);
        });
    }, options);
    list.forEach((img) => io.observe(img));
    return () => io.disconnect();
}

/**
 * 示例用法（在页面脚本中按需启用）
 */
// 1) 元素进入/离开可视区
// const stop = observeElementVisibility(
//   document.querySelector('#box'),
//   { threshold: [0, 0.5, 1] },
//   (entry) => console.log('进入可视区', entry.intersectionRatio),
//   () => console.log('离开可视区')
// );
// stop(); // 取消观测

// 2) 上拉加载：底部哨兵进入可视区时 loadMore
// const unobserve = createInfiniteScrollObserver(
//   document.querySelector('#sentinel'),
//   async () => {
//     await fetchNextPageAndAppend();
//   },
//   { root: document.querySelector('#scrollContainer'), rootMargin: '150px 0px', threshold: 0 }
// );
// unobserve(); // 取消观测

// 3) 图片懒加载：为所有带 data-src 的图片绑定懒加载
// const cancelLazy = observeLazyImages(document.querySelectorAll('img[data-src]'), { rootMargin: '200px 0px' });
// cancelLazy(); // 取消观测