export interface AdminLoginCredentials {
  email: string
  password: string
}

export interface RoleObject {
  key: string
  value: string
}

export interface StatusObject {
  key: string
  value: string
}

export interface AdminAuthUser {
  id: string | number
  name: string
  email: string
  role: RoleObject
  status?: StatusObject
}

export interface AdminAuthSession {
  accessToken: string
  refreshToken?: string
  user: AdminAuthUser
}
