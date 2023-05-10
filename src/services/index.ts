import { Client } from "@/utils/client"

const client = new Client({})

/**
 * ok接口
 * @returns 响应结果 
 */
export const ok = () => {
    return new Promise((resolve, reject) => {
        client.post('/auth/ok')
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