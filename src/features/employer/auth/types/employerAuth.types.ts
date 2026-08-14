export interface RoleObject {
  key: string
  value: string
}

export interface StatusObject {
  key: string
  value: string
}

export interface EmployerAuthUser {
  id: string | number
  name: string
  email: string
  role: RoleObject
  status?: StatusObject
  email_verified_at?: string | null
}

export interface EmployerAuthSession {
  accessToken: string
  refreshToken?: string
  user: EmployerAuthUser
}

export interface EmployerLoginCredentials {
  email: string
  password: string
}

export interface EmployerRegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  company_name: string
  company_website: string
  phone: string
  terms_accepted: boolean
}
