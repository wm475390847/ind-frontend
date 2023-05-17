import { Client } from "@/utils/client"

const client = new Client({})


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
    });
}

/**
 * 用户列表接口
 * @returns 响应结果 
 */
export const getUserInfo: () => Promise<UserInfo> = () => {
    return new Promise(async (resolve, reject) => {
        await client.get('/user/info')
            .then((res: any) => {
                if (res.success) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            })
    });
}

/**
 * 获取token信息
 * @returns 响应结果 
 */
export const addMpInfoList: (data: MpInfo[]) => Promise<RequestDto> = (data) => {
    return new Promise(async (resolve, reject) => {
        await client.post('/config/mp', data)
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
    });
}


/**
 * 获取token信息
 * @returns 响应结果 
 */
export const getMpInfoList: () => Promise<RequestDto> = () => {
    return new Promise(async (resolve, reject) => {
        await client.get('/config/mp')
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
    });
}


/**
 * 获取token信息
 * @returns 响应结果 
 */
export const getTokenInfo: () => Promise<TokenInfo> = () => {
    return new Promise(async (resolve, reject) => {
        await client.get('/config/token')
            .then((res: any) => {
                if (res.success) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            })
    });
}

/**
 * 获取token信息
 * @returns 响应结果 
 */
export const modifyToken: (data: { tokenId: string }) => Promise<RequestDto> = (data) => {
    return new Promise(async (resolve, reject) => {
        await client.post('/config/token', data, 'multipart/form-data')
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
    });
}

/**
 * 获取排放标准信息
 * @returns 响应结果 
 */
export const getEmisssionList: () => Promise<RequestDto> = () => {
    return new Promise(async (resolve, reject) => {
        await client.get('/config/emission/list')
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
    });
}

/**
 * 修改排放标准信息
 * @returns 响应结果 
 */
export const modifyEmission: (data: { id: number, standard: string }) => Promise<RequestDto> = (data) => {
    return new Promise(async (resolve, reject) => {
        await client.post('/config/emission', data)
            .then((res: any) => {
                if (res.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            })
    });
}