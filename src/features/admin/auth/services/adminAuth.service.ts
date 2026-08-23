import { API_ENDPOINTS, STORAGE_KEYS } from "@/config"
import { api } from "@/lib/api"
import { isRecord, unwrapEntity } from "@/features/admin/shared/services/adminResponse.utils"
import type {
  AdminAuthSession,
  AdminAuthUser,
  AdminLoginCredentials,
} from "../types/adminAuth.types"

function normalizeSession(response: unknown): AdminAuthSession {
  const payload = unwrapEntity<Record<string, unknown>>(response)
  const token = payload.access_token ?? payload.token
  const user = payload.user

  if (typeof token !== "string" || !isRecord(user)) {
    throw new Error("The login response does not contain a valid token and user.")
  }

  return {
    accessToken: token,
    user: user as unknown as AdminAuthUser,
  }
}

export const adminAuthService = {
  async login(credentials: AdminLoginCredentials): Promise<AdminAuthSession> {
    const response = await api.post<unknown>(API_ENDPOINTS.auth.login, credentials)
    return normalizeSession(response)
  },

  async me(): Promise<AdminAuthUser> {
    const response = await api.get<unknown>(API_ENDPOINTS.auth.me)
    const payload = unwrapEntity<Record<string, unknown>>(response)
    return (isRecord(payload.user) ? payload.user : payload) as unknown as AdminAuthUser
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.auth.logout)
  },

  storeSession(session: AdminAuthSession): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user))
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.user)
  },
}
