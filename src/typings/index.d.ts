interface IPageRequest<T> {
  current: number
  pages: number
  records: T[]
  total: number
}

interface RequestDto {
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

interface MpInfo {
  id: number;
  mpId: string;
  mpName: string;
  o2RealAvg: string;
  o2StandardAvg: string;
  gmtCreate: string;
  gmtModified: string;
}

interface UserInfo {
  id: number
  account: string
  project: string
  username: string
  department: string
  type: number
  gmtCreate: string
  phone: string
}

interface AuthInfo {
  id: number
  account: string
  project: string
}

interface TokenInfo {
  id: number
  tokenId: string
  gmtCreate: string
}

interface Emission {
  id: number
  code: string
  name: string
  standard: string;
  unit: string
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

interface CreateUserReq {
  account: string
  project: string
  username: string
  department: string
  phone: string
  password1: string
  password2: string
  type: number
}