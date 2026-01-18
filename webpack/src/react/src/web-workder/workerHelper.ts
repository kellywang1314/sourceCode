/**
 * Web Worker 管理与主线程查询入口
 * @description
 * - 在主线程发起网络请求（fetch + AbortController）
 * - 对需要重运算的类型，交由 Worker 进行格式化
 * - 支持同组件重复查询的取消（基于组件 id）
 */
export class WorkerHelper {
  private static worker: Worker | null = null;
  private static callbacks = new Map<number, { resolve: (v: any) => void; reject: (e?: any) => void }>();
  private static requestMap = new Map<string, AbortController>();
  private static uid = 0;

  /**
   * 初始化 Worker 实例与消息通道
   */
  static initWorker() {
    if (this.worker) return;
    this.worker = new Worker(new URL('./query.worker.ts', import.meta.url), { type: 'module' });
    this.worker.addEventListener('message', e => {
      const { id, data, error } = e.data || {};
      const cb = this.callbacks.get(id);
      if (!cb) return;
      this.callbacks.delete(id);
      if (error) cb.reject(error);
      else cb.resolve(data);
    });
    this.worker.addEventListener('error', e => {
      // 可上报错误
      console.error('worker error', e);
    });
  }

  /**
   * 查询图表数据（主线程发请求 + 子线程格式化）
   * @param isShared 是否为分享场景（若 true 直接回传 sharedComponentResult）
   * @param source 资产来源（如 'cockpit'/'dashboard'）
   * @param resourceId 资产 id
   * @param type 图表类型（如 'line'/'bar'/'table'/'rich_text'）
   * @param params 查询参数（需要包含唯一 id）
   * @param sharedComponentResult 分享场景下预先给定的查询结果
   * @param options { baseUrl, skipCancel } 基础地址与是否跳过取消
   * @returns 格式化后的数据结构
   */
  static async query<T = any>(type: string, params: any): Promise<T> {
    this.initWorker();

    const url = `/api/query/${type}`; // demo 简化：固定前缀 + 类型
    const id = String(params?.id ?? '');
    const controller = new AbortController();

    // 新查询前取消旧请求（按组件 id）
    WorkerHelper.requestMap.get(id)?.abort();
    WorkerHelper.requestMap.set(id, controller);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`request failed: ${res.status}`);
    const rawData = await res.json();

    if (type === 'table' || type === 'rich_text') {
      return rawData as T;
    }
    return await WorkerHelper.formatInWorker<T>(rawData, type, params);
  }

  /**
   * 在 Worker 中执行格式化任务
   * @param rawData 原始返回数据
   * @param type 图表类型
   * @param params 查询参数（可用于辅助格式化）
   * @returns 格式化后的数据
   */
  static formatInWorker<T = any>(rawData: any, type: string, params: any): Promise<T> {
    const id = ++this.uid;
    return new Promise<T>((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.worker!.postMessage({
        method: 'format',
        options: { id, data: rawData, type, params, lang: 'zh' },
      });
    });
  }

  /**
   * 取消某组件的进行中请求
   * @param id 组件唯一标识
   */
  static cancelQuery(id: string) {
    WorkerHelper.requestMap.get(id)?.abort();
  }

  /**
   * 批量取消
   * @param ids 组件唯一标识列表
   */
  static cancelMoreQuery(ids: string[]) {
    ids.forEach(id => WorkerHelper.requestMap.get(id)?.abort());
  }

  /**
   * 终止 Worker
   */
  static terminate() {
    WorkerHelper.worker?.terminate();
    WorkerHelper.worker = null;
    WorkerHelper.callbacks.clear();
    WorkerHelper.requestMap.clear();
  }
}


