import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../features/auth/model/authSlice'
import { adminReducer } from '../features/admin/model/adminSlice'
import { researcherReducer } from '../features/researcher/model/researcherSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    researcher: researcherReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
