export type AuthUser = {
  id: string
  email: string
  fullName?: string
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
}
