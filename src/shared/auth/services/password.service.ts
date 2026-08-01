import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import type {
  AuthMessageResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../types/password.types"

export const passwordService = {
  forgotPassword(input: ForgotPasswordInput) {
    return api.post<AuthMessageResponse>(API_ENDPOINTS.auth.forgotPassword, input)
  },

  resetPassword(input: ResetPasswordInput) {
    return api.post<AuthMessageResponse>(API_ENDPOINTS.auth.resetPassword, input)
  },

  changePassword(input: ChangePasswordInput) {
    return api.post<AuthMessageResponse>(API_ENDPOINTS.auth.changePassword, input)
  },

  logoutAll() {
    return api.post<AuthMessageResponse>(API_ENDPOINTS.auth.logoutAll)
  },
}
