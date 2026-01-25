// 双 Token 分工：
// accessToken：访问令牌（短期有效，如 2 小时），用于所有接口请求，过期则接口返回 401；
// refreshToken：刷新令牌（长期有效，如 7 天），仅用于请求新的accessToken，不参与业务接口请求；
// 拦截器机制：前端请求拦截器自动添加accessToken，响应拦截器捕获 401 错误，触发刷新逻辑；
// 刷新锁：用 Promise 锁避免多个请求同时触发 token 刷新（比如页面多个接口同时返回 401）；
// 请求重试：刷新 token 成功后，自动重试原本失败的请求，用户无感知。

// src/utils/token.ts
/**
 * Token工具类：封装存储、读取、删除逻辑
 */
export const TokenUtil = {
    // 存储Token
    setToken(data: TokenResponse) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // 可选：存储过期时间（用于提前刷新，比如剩余5分钟时主动刷新）
        localStorage.setItem('expiresTime', String(Date.now() + data.expiresIn * 1000));
    },

    // 获取accessToken
    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    // 获取refreshToken
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    // 清除Token
    clearToken() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresTime');
    },

    // 检查accessToken是否过期（提前5分钟刷新）
    isTokenExpired() {
        const expiresTime = localStorage.getItem('expiresTime');
        if (!expiresTime) return true;
        // 提前5分钟刷新（避免刚好过期时请求失败）
        return Date.now() > Number(expiresTime) - 5 * 60 * 1000;
    }
};

// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenUtil } from './token';
import { ElMessage } from 'element-plus'; // 示例：UI组件库提示

// 定义刷新锁：用于防止多个请求同时触发刷新
let refreshLock = false;
// 存储刷新token期间的请求，刷新成功后重试
let retryRequests: Array<(token: string) => void> = [];

// 创建Axios实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. 请求拦截器：添加accessToken
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 给请求头添加accessToken
        const accessToken = TokenUtil.getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. 响应拦截器：处理401错误，实现无感刷新
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 正常响应：直接返回数据
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        // 排除取消请求的错误（如手动abort）
        if (axios.isCancel(error)) return Promise.reject(error);

        // 情况1：接口返回401，且不是刷新token的请求（避免死循环）
        if (error.response?.status === 401 && !originalRequest._isRefresh) {
            // 标记当前请求为“非刷新请求”，避免刷新token的请求触发401时死循环
            originalRequest._isRefresh = true;

            // 情况1.1：已有刷新请求在处理，等待刷新完成后重试
            if (refreshLock) {
                return new Promise((resolve) => {
                    // 将当前请求加入重试队列
                    retryRequests.push((newToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(service(originalRequest));
                    });
                });
            }

            // 情况1.2：无刷新请求，触发token刷新
            refreshLock = true;
            try {
                const refreshToken = TokenUtil.getRefreshToken();
                if (!refreshToken) {
                    // 无refreshToken，引导登录
                    TokenUtil.clearToken();
                    ElMessage.error('登录已过期，请重新登录');
                    // 跳转到登录页（根据项目路由调整）
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // 调用刷新token接口
                const refreshRes = await axios.post<TokenResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
                    { refreshToken }
                );

                // 刷新成功：更新token
                TokenUtil.setToken(refreshRes.data);
                const newAccessToken = refreshRes.data.accessToken;

                // 重试队列中的所有请求
                retryRequests.forEach((cb) => cb(newAccessToken));
                retryRequests = []; // 清空队列

                // 重试当前请求
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return service(originalRequest);
            } catch (refreshError) {
                // 情况1.3：刷新token失败（如refreshToken过期）
                TokenUtil.clearToken();
                ElMessage.error('登录已过期，请重新登录');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                // 释放刷新锁
                refreshLock = false;
            }
        }

        // 情况2：非401错误，直接提示
        ElMessage.error(error.response?.data?.msg || '请求失败');
        return Promise.reject(error);
    }
);

export default service;