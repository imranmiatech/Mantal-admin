export type Role = 'ADMIN' | 'RESEARCHER'
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: Role
  approvalStatus: ApprovalStatus
  createdAt?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type SignupPayload = {
  fullName: string
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  user: AuthUser
}

export type SignupResponse = {
  message: string
  user: AuthUser
}
