import { API_ENDPOINTS, STORAGE_KEYS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapEmployerEntity,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  EmployerAuthSession,
  EmployerAuthUser,
  EmployerLoginCredentials,
  EmployerRegisterInput,
} from "../types/employerAuth.types"

function normalizeSession(response: unknown): EmployerAuthSession {
  console.log(response);
  const payload = unwrapEmployerEntity<Record<string, unknown>>(response)
  const token = payload.access_token ?? payload.token
  const user = payload.user


  if (typeof token !== "string" || !isRecord(user)) {
    throw new Error("The login response does not contain a valid token and user.")
  }

  return {
    accessToken: token,
    refreshToken: typeof payload.refresh_token === "string" ? payload.refresh_token : undefined,
    user: user as unknown as EmployerAuthUser,
  }
}

export const employerAuthService = {
  async login(credentials: EmployerLoginCredentials): Promise<EmployerAuthSession> {
    return normalizeSession(await api.post(API_ENDPOINTS.auth.login, credentials))
  },

  async register(input: EmployerRegisterInput): Promise<void> {
    await api.post(API_ENDPOINTS.auth.registerEmployer, input)
  },

  async me(): Promise<EmployerAuthUser> {
    const payload = unwrapEmployerEntity<Record<string, unknown>>(
      await api.get(API_ENDPOINTS.auth.me),
    )
    return (isRecord(payload.user) ? payload.user : payload) as unknown as EmployerAuthUser
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.auth.logout)
  },

  storeSession(session: EmployerAuthSession): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken)
    if (session.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user))
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    localStorage.removeItem(STORAGE_KEYS.user)
  },
}
