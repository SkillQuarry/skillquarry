import { supabase } from '../../lib/supabase'

export type SignUpInput = {
  email: string
  password: string
  displayName: string
}

export type LoginInput = {
  email: string
  password: string
}

export async function signUp({
  email,
  password,
  displayName,
}: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function login({
  email,
  password,
}: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function handleAuthCallback(search: string) {
  const params = new URLSearchParams(search)
  const code = params.get('code')
  const error = params.get('error')
  const errorDescription = params.get('error_description')

  if (error) {
    throw new Error(errorDescription ?? error)
  }

  if (!code) {
    return null
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    throw exchangeError
  }

  return null
}