import { apiRequest } from '../../../shared/lib/api'
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
} from '../types/auth'

export function signInRequest(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function signUpRequest(payload: SignupPayload) {
  return apiRequest<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export function getProfileRequest() {
  return apiRequest<AuthUser>('/api/auth/me')
}
