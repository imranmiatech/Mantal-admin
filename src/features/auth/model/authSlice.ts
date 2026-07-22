import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { clearStoredToken, getStoredToken, setStoredToken } from '../../../shared/lib/storage'
import { getProfileRequest, signInRequest, signUpRequest } from '../api/authApi'
import type { AuthUser, LoginPayload, SignupPayload } from '../types/auth'

type AuthState = {
  token: string | null
  user: AuthUser | null
  initialized: boolean
  status: 'idle' | 'loading' | 'authenticated'
  signUpStatus: 'idle' | 'loading' | 'success'
  error: string | null
  signUpMessage: string | null
}

const initialState: AuthState = {
  token: getStoredToken(),
  user: null,
  initialized: false,
  status: 'idle',
  signUpStatus: 'idle',
  error: null,
  signUpMessage: null,
}

function getResearcherApprovalError(user: AuthUser) {
  if (user.role !== 'RESEARCHER') {
    return null
  }

  if (user.approvalStatus === 'PENDING') {
    return 'Your researcher account is still pending admin approval. You will be able to sign in after approval.'
  }

  if (user.approvalStatus === 'REJECTED') {
    return 'Your researcher account was not approved. Please contact an admin before trying again.'
  }

  return null
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await signInRequest(payload)
      const approvalError = getResearcherApprovalError(response.user)

      if (approvalError) {
        return rejectWithValue(approvalError)
      }

      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  },
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      return await signUpRequest(payload)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign up.')
    }
  },
)

export const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getProfileRequest()
      const approvalError = getResearcherApprovalError(user)

      if (approvalError) {
        clearStoredToken()
        return rejectWithValue(approvalError)
      }

      return user
    } catch (error) {
      clearStoredToken()
      return rejectWithValue(error instanceof Error ? error.message : 'Session expired.')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthFeedback(state) {
      state.error = null
      state.signUpMessage = null
    },
    signOut(state) {
      clearStoredToken()
      state.token = null
      state.user = null
      state.status = 'idle'
      state.initialized = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.initialized = true
        state.token = action.payload.accessToken
        state.user = action.payload.user
        setStoredToken(action.payload.accessToken)
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'idle'
        state.initialized = true
        state.token = null
        state.user = null
        state.error = (action.payload as string) ?? action.error.message ?? 'Unable to sign in.'
      })
      .addCase(signUp.pending, (state) => {
        state.signUpStatus = 'loading'
        state.error = null
        state.signUpMessage = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpStatus = 'success'
        state.signUpMessage = action.payload.message
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpStatus = 'idle'
        state.error = (action.payload as string) ?? action.error.message ?? 'Unable to sign up.'
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.status = state.token ? 'loading' : 'idle'
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
        state.initialized = true
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        state.initialized = true
        state.error = (action.payload as string) ?? 'Unable to restore session.'
      })
  },
})

export const { clearAuthFeedback, signOut } = authSlice.actions
export const authReducer = authSlice.reducer
