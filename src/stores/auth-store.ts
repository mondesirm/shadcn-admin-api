import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'

type AuthUser = {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

type AuthState = {
  auth: {
    user: AuthUser | null
    accessToken: string
    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const accessToken = getCookie(ACCESS_TOKEN)

  return {
    auth: {
      user: null,
      accessToken: accessToken ? JSON.parse(accessToken) : '',
      setUser: (user) => set((s) => ({ ...s, auth: { ...s.auth, user } })),
      setAccessToken: (accessToken) =>
        set((s) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...s, auth: { ...s.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((s) => {
          removeCookie(ACCESS_TOKEN)
          return { ...s, auth: { ...s.auth, accessToken: '' } }
        }),
      reset: () =>
        set((s) => {
          removeCookie(ACCESS_TOKEN)
          return { ...s, auth: { ...s.auth, accessToken: '', user: null } }
        }),
    },
  }
})
