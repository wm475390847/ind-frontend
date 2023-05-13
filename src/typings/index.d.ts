interface IPageRequest<T> {
  current: number
  pages: number
  records: T[]
  total: number
}

interface RequestOpt {
  map(arg0: (e: any) => void): unknown;
  code: string
  data: any
  message?: null | string
  pageNo?: number
  pageSize?: number
  requestId?: null | string | number
  success: boolean
  total?: number
}

interface ExitDto {
  exitId: string
  exitName: string
}

// -----------------------------------返回接口
interface UserInfo {
  id: number
  account: string
  project: string
}

interface AuthInfo {
  id: number
  account: string
  project: string
}

// -----------------------------------请求接口

interface LoginReq {
  account: string
  password: string
  project: string
}

interface SelectUserReq {
  pageNo: number
  pageSize: number
}