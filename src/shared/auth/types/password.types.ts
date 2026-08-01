export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordInput {
  current_password: string
  password: string
  password_confirmation: string
}

export interface AuthMessageResponse {
  message?: string
}
