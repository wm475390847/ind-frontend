import { Client } from "@/utils/client"
import { SelectUserReq, IPageRequest, UserInfo } from "./interface";


const client = new Client({})

/**
 * ok接口
 * @returns 响应结果 
 */
export const ok = () => {
    return new Promise(async (resolve, reject) => {
        await client.post('/auth/ok')
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
}

/**
 * 用户列表接口
 * @returns 响应结果 
 */
export const getUserList: (data: SelectUserReq) => Promise<IPageRequest<UserInfo>> = (data) => {
    return new Promise(async (resolve, reject) => {
        await client.get('/user/list', data)
            .then((res: any) => {
                if (res.success) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
}

/**
 * 用户列表接口
 * @returns 响应结果 
 */
export const getUserInfo: () => Promise<IPageRequest<UserInfo>> = () => {
    return new Promise(async (resolve, reject) => {
        await client.get('/user/info')
            .then((res: any) => {
                if (res.success) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
}