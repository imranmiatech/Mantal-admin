import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AnyAction } from '@reduxjs/toolkit'
import {
  approveResearcherRequest,
  createSubmissionRequest,
  getDistrictOptionsRequest,
  getDivisionsRequest,
  getHierarchyDistrictsRequest,
  getPendingResearchersRequest,
  getPendingSubmissionsRequest,
  getPublishedSubmissionsRequest,
  getUpazilasRequest,
  publishSubmissionRequest,
  rejectSubmissionRequest,
} from '../api/adminApi'
import type {
  CreateSubmissionPayload,
  DistrictOption,
  Division,
  HierarchyDistrict,
  PendingResearcher,
  PendingSubmission,
  PublishedSubmission,
  Upazila,
} from '../types/admin'

type AdminState = {
  divisions: Division[]
  hierarchyDistricts: HierarchyDistrict[]
  upazilas: Upazila[]
  districtOptions: DistrictOption[]
  pendingResearchers: PendingResearcher[]
  pendingSubmissions: PendingSubmission[]
  publishedSubmissions: PublishedSubmission[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  successMessage: string | null
}

const initialState: AdminState = {
  divisions: [],
  hierarchyDistricts: [],
  upazilas: [],
  districtOptions: [],
  pendingResearchers: [],
  pendingSubmissions: [],
  publishedSubmissions: [],
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
}

export const fetchDashboardData = createAsyncThunk(
  'admin/fetchDashboardData',
  async () => {
    const [
      divisions,
      districtOptions,
      pendingResearchers,
      pendingSubmissions,
      publishedSubmissions,
    ] = await Promise.all([
      getDivisionsRequest(),
      getDistrictOptionsRequest(),
      getPendingResearchersRequest(),
      getPendingSubmissionsRequest(),
      getPublishedSubmissionsRequest(),
    ])

    return {
      divisions,
      districtOptions,
      pendingResearchers,
      pendingSubmissions,
      publishedSubmissions,
    }
  },
)

export const fetchHierarchyDistricts = createAsyncThunk(
  'admin/fetchHierarchyDistricts',
  async (divisionCode?: number) => getHierarchyDistrictsRequest(divisionCode),
)

export const fetchUpazilas = createAsyncThunk(
  'admin/fetchUpazilas',
  async (districtCode: number) => getUpazilasRequest(districtCode),
)

export const createSubmission = createAsyncThunk(
  'admin/createSubmission',
  async (payload: CreateSubmissionPayload, { dispatch }) => {
    const response = await createSubmissionRequest(payload)
    await dispatch(fetchDashboardData())
    return response
  },
)

export const approveResearcher = createAsyncThunk(
  'admin/approveResearcher',
  async (payload: { id: string; note?: string }, { dispatch }) => {
    const response = await approveResearcherRequest(payload.id, payload.note)
    await dispatch(fetchDashboardData())
    return response
  },
)

export const publishSubmission = createAsyncThunk(
  'admin/publishSubmission',
  async (id: string, { dispatch }) => {
    const response = await publishSubmissionRequest(id)
    await dispatch(fetchDashboardData())
    return response
  },
)

export const rejectSubmission = createAsyncThunk(
  'admin/rejectSubmission',
  async (id: string, { dispatch }) => {
    const response = await rejectSubmissionRequest(id)
    await dispatch(fetchDashboardData())
    return response
  },
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminFeedback(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.divisions = action.payload.divisions
        state.districtOptions = action.payload.districtOptions
        state.pendingResearchers = action.payload.pendingResearchers
        state.pendingSubmissions = action.payload.pendingSubmissions
        state.publishedSubmissions = action.payload.publishedSubmissions
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Unable to load dashboard data.'
      })
      .addCase(fetchHierarchyDistricts.fulfilled, (state, action) => {
        state.hierarchyDistricts = action.payload
      })
      .addCase(fetchHierarchyDistricts.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load districts.'
      })
      .addCase(fetchUpazilas.fulfilled, (state, action) => {
        state.upazilas = action.payload
      })
      .addCase(fetchUpazilas.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load upazilas.'
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/pending') &&
          !action.type.includes('fetchDashboardData') &&
          !action.type.includes('fetchHierarchyDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state) => {
          state.actionLoading = true
          state.error = null
          state.successMessage = null
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/fulfilled') &&
          !action.type.includes('fetchDashboardData') &&
          !action.type.includes('fetchHierarchyDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state, action: AnyAction) => {
          state.actionLoading = false
          state.successMessage = action.payload?.message ?? 'Action completed successfully.'
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('admin/') &&
          action.type.endsWith('/rejected') &&
          !action.type.includes('fetchDashboardData') &&
          !action.type.includes('fetchHierarchyDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state, action: AnyAction) => {
          state.actionLoading = false
          state.error = action.error.message ?? 'Unable to complete admin action.'
        },
      )
  },
})

export const { clearAdminFeedback } = adminSlice.actions
export const adminReducer = adminSlice.reducer
