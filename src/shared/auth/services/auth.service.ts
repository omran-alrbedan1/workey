import { API_ENDPOINTS, STORAGE_KEYS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapEmployerEntity,
} from "@/features/employer/shared/services/employerResponse.utils"

export interface RoleObject {
  key: string
  value: string
}

export interface StatusObject {
  key: string
  value: string
}

export interface AuthUser {
  id: string | number
  name: string
  email: string
  role: RoleObject
  status?: StatusObject
  email_verified_at?: string | null
}

export function isEmailVerified(user?: AuthUser | null): boolean {
  if (!user) return false
  if (typeof user.email_verified_at === "boolean") return user.email_verified_at
  return Boolean(user.email_verified_at)
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

function normalizeSession(response: unknown): AuthSession {
  const payload = unwrapEmployerEntity<Record<string, unknown>>(response)
  const token = payload.access_token ?? payload.token
  const user = payload.user

  if (typeof token !== "string" || !isRecord(user)) {
    throw new Error("The login response does not contain a valid token and user.")
  }

  return {
    accessToken: token,
    user: user as unknown as AuthUser,
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return normalizeSession(await api.post(API_ENDPOINTS.auth.login, credentials))
  },

  async me(): Promise<AuthUser> {
    const payload = unwrapEmployerEntity<Record<string, unknown>>(
      await api.get(API_ENDPOINTS.auth.me),
    )
    return (isRecord(payload.user) ? payload.user : payload) as unknown as AuthUser
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.auth.logout)
  },

  storeSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user))
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.user)
  },

  getSession(): AuthSession | null {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
    const userStr = localStorage.getItem(STORAGE_KEYS.user)

    if (!accessToken || !userStr) return null

    try {
      const user = JSON.parse(userStr)
      return {
        accessToken,
        user,
      }
    } catch {
      return null
    }
  },
}
