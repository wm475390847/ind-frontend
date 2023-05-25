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

interface Mp {
  id: number;
  mpId: string;
  mpName: string;
  o2RealAvg: string;
  o2StandardAvg: string;
  gmtCreate: string;
  gmtModified: string;
}

interface User {
  id: number
  project: string
  username: string
  department: string
  roleId: number
  gmtCreate: string
  phone: string
}

interface Auth {
  id: number
  phone: string
  project: string
}

interface Token {
  id: number
  tokenId: string
  gmtCreate: string
}

interface Pollutant {
  id: number
  code: string
  name: string
  standard: string;
  unit: string
}

// -----------------------------------请求接口

interface LoginReq {
  phone: string
  password: string
  project: string
}

interface SelectUserReq {
  pageNo: number
  pageSize: number
}

interface CreateUserReq {
  project: string
  username: string
  department: string
  phone: string
  password: string
  roleId: number
}



interface GroupHourAvg {
  mpName: string
  mpId: string
  value: object
}

interface ShiftHourAvg {
  mpName: string
  mpId: string
  value: object
}