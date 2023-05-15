import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getItem, removeItem, setItem } from './Storage';
import { BASE_PATH, DOMAIN } from "@/constants";
import qs from 'qs';

export class Client {

    /**
     * 存在本地缓存中的key
     */
    public static TOKEN_IDENTIFIER: string = 'ind.token';

    /**
     * 服务端的token
     */
    protected _token!: string;

    /**
     * 用户信息
     */
    protected _userInfo!: any;

    /**
     * 请求工具
     */
    public request!: AxiosInstance;

    /**
     * 构造函数
     * @param options 参数
     */
    constructor(options: { http?: string }) {
        // 不传入的话使用默认的url
        options.http = DOMAIN;
        this.createAxios(options.http)

    }

    /**
     * 创建一个请求
     * @param baseURL 基础url
     * @returns 请求工具
     */
    protected createAxios(baseURL: string) {
        // 创建一个 Axios 实例
        const request = axios.create({
            headers: {
                // 设置请求头中默认的 Content-Type 和 Accept
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            // 允许发送跨域请求时携带cookie
            withCredentials: true
        });

        // 添加请求拦截器
        request.interceptors.request.use(async config => {
            if (this.token) {
                config.headers.voucher = this.token;
            }
            return config;
        }, (err: any) => err);

        // 全局响应拦截器保证最后执行
        request.interceptors.response.use(
            // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
            (res: AxiosResponse) => {
                if (res.data.code === '1100') {
                    console.log('token过期');
                    // 登录已过期
                    this.retuenLoginPage()
                }
                if (res.data.code === '1102') {
                    console.log('token失效');
                    // 登录已过期
                    this.retuenLoginPage()
                }
                return res.data
            },
            err => {
                // 当响应异常时做一些处理
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400: err.message = '请求错误(400)'; break;
                        case 401: err.message = '未授权，请重新登录(401)'; break;
                        case 403: err.message = '拒绝访问(403)'; break;
                        case 404: err.message = '请求出错(404)'; break;
                        case 408: err.message = '请求超时(408)'; break;
                        case 500: err.message = '服务器错误(500)'; break;
                        case 501: err.message = '服务未实现(501)'; break;
                        case 502: err.message = '网络错误(502)'; break;
                        case 503: err.message = '服务不可用(503)'; break;
                        case 504: err.message = '网络超时(504)'; break;
                        case 505: err.message = 'HTTP版本不受支持(505)'; break;
                        default: err.message = `连接出错(${err.response.status})!`;
                    }
                } else {
                    err.message = '连接服务器失败!'
                }
                return Promise.reject(err);
            },
        );
        this.request = request;
    }

    /**
     * 退出登录
     */
    public logout(): Promise<RequestDto> {
        return new Promise(async (resolve, reject) => {
            const res: any = await this.get(`/auth/logout`);
            if (res?.code === '200') {
                this.retuenLoginPage()
                // 请空本地缓存token及浏览器缓存
                this._token = '';
                removeItem(Client.TOKEN_IDENTIFIER);
                resolve(this._userInfo);
            } else {
                reject(res)
            }
        });
    }

    /**
     * 登录
     * @param data 请求数据
     * @returns 
     */
    public login(data: LoginReq): Promise<RequestDto> {
        return new Promise(async (resolve, reject) => {
            const res: any = await this.post(`/auth/login`, data);
            if (res?.code === '200') {
                this._token = res.data.token;
                this._userInfo = res.data
                setItem(Client.TOKEN_IDENTIFIER, this._token);
                resolve(res);
            } else {
                reject(res)
            }
        });
    }

    public async get(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        const queryString = qs.stringify(data);
        const fullUrl = `${BASE_PATH}${url}${queryString ? `?${queryString}` : ''}`;
        return this.request.get(this.addTimestamp(fullUrl), config);
    }

    public async post(url: string, data?: any, contentType?: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        const newConfig = contentType && this.getConfig(contentType)
        return this.request.post(this.addTimestamp(`${BASE_PATH}${url}`), data, newConfig ? newConfig : config);
    }

    public async put(url: string, data?: any, contentType?: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        const newConfig = contentType && this.getConfig(contentType)
        return this.request.put(this.addTimestamp(`${BASE_PATH}${url}`), data, newConfig ? newConfig : config);
    }

    public async patch(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        return this.request.patch(this.addTimestamp(`${BASE_PATH}${url}`), data, config);
    }

    public async delete(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        return this.request.delete(this.addTimestamp(`${BASE_PATH}${url}`), config);
    }

    /**
     * 给 URL 加上 _t=时间戳
     * @param {string} url 完整 url 或者 path
    */
    private addTimestamp(url: string): string {
        const t = `_t=${Date.now()}`;
        const sep = url.includes('?') ? '&' : '?';
        return url + sep + t;
    }

    private retuenLoginPage() {
        //返回登录页面
        const loginPageUrl = '/login';
        const newUrl = `${loginPageUrl}`;
        window.location.href = newUrl;
    }

    private getConfig(contentType: string): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': contentType == null ? "application/json" : contentType
            }
        }
    }

    /**
     * 获取token方法
    */
    get token(): string {
        if (!this._token) {
            // 从浏览器缓存中获取 token 参数
            this._token = getItem(Client.TOKEN_IDENTIFIER)
        }
        return this._token
    }
}