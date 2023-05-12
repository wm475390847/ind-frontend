export interface IPageRequest<T> {
  current: number
  pages: number
  records: T[]
  total: number
}

export interface RequestOpt {
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

export interface Login {
  account: string
  password: string
  project: string
}

export interface AuthInfo {
  id: number
  account: string
  project: string
}

export interface SelectUserReq {
  pageNo: number
  pageSize: number
}

export interface UserInfo {
  id: number
  account: string
  project: string
}

