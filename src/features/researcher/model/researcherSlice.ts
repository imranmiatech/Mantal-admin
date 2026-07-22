import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AnyAction } from '@reduxjs/toolkit'
import {
  createResearcherSubmissionRequest,
  createResearcherBulkSubmissionRequest,
  getMySubmissionsRequest,
  getPublicDistrictsRequest,
  getPublicDivisionsRequest,
  getPublicUpazilasRequest,
  getResearcherDashboardRequest,
} from '../api/researcherApi'
import type { ResearcherCreateSubmissionPayload, ResearcherDashboard } from '../types/researcher'
import type { Division, HierarchyDistrict, Upazila } from '../../admin/types/admin'

type ResearcherState = {
  dashboard: ResearcherDashboard | null
  submissions: ResearcherDashboard['submissions']
  divisions: Division[]
  districts: HierarchyDistrict[]
  upazilas: Upazila[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  successMessage: string | null
}

const initialState: ResearcherState = {
  dashboard: null,
  submissions: [],
  divisions: [],
  districts: [],
  upazilas: [],
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
}

export const fetchResearcherDashboard = createAsyncThunk(
  'researcher/fetchDashboard',
  async () => {
    const [dashboard, divisions, districts, submissions] = await Promise.all([
      getResearcherDashboardRequest(),
      getPublicDivisionsRequest(),
      getPublicDistrictsRequest(),
      getMySubmissionsRequest(),
    ])

    return { dashboard, divisions, districts, submissions }
  },
)

export const fetchResearcherDistricts = createAsyncThunk(
  'researcher/fetchDistricts',
  async (divisionCode?: number) => getPublicDistrictsRequest(divisionCode),
)

export const fetchResearcherUpazilas = createAsyncThunk(
  'researcher/fetchUpazilas',
  async (districtCode: number) => getPublicUpazilasRequest(districtCode),
)

export const createResearcherSubmission = createAsyncThunk(
  'researcher/createSubmission',
  async (payload: ResearcherCreateSubmissionPayload, { dispatch }) => {
    const response = await createResearcherSubmissionRequest(payload)
    await dispatch(fetchResearcherDashboard())
    return response
  },
)

export const createResearcherBulkSubmission = createAsyncThunk(
  'researcher/createBulkSubmission',
  async (payload: { submissions: ResearcherCreateSubmissionPayload[] }, { dispatch }) => {
    const response = await createResearcherBulkSubmissionRequest(payload)
    await dispatch(fetchResearcherDashboard())
    return response
  },
)

const researcherSlice = createSlice({
  name: 'researcher',
  initialState,
  reducers: {
    clearResearcherFeedback(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResearcherDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResearcherDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.dashboard = action.payload.dashboard
        state.divisions = action.payload.divisions
        state.districts = action.payload.districts
        state.submissions = action.payload.submissions
      })
      .addCase(fetchResearcherDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Unable to load researcher dashboard.'
      })
      .addCase(fetchResearcherDistricts.fulfilled, (state, action) => {
        state.districts = action.payload
        state.upazilas = []
      })
      .addCase(fetchResearcherDistricts.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load districts.'
      })
      .addCase(fetchResearcherUpazilas.fulfilled, (state, action) => {
        state.upazilas = action.payload
      })
      .addCase(fetchResearcherUpazilas.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load upazilas.'
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('researcher/') &&
          action.type.endsWith('/pending') &&
          !action.type.includes('fetchDashboard') &&
          !action.type.includes('fetchDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state) => {
          state.actionLoading = true
          state.error = null
          state.successMessage = null
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('researcher/') &&
          action.type.endsWith('/fulfilled') &&
          !action.type.includes('fetchDashboard') &&
          !action.type.includes('fetchDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state, action: AnyAction) => {
          state.actionLoading = false
          state.successMessage = action.payload?.message ?? 'Action completed successfully.'
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('researcher/') &&
          action.type.endsWith('/rejected') &&
          !action.type.includes('fetchDashboard') &&
          !action.type.includes('fetchDistricts') &&
          !action.type.includes('fetchUpazilas'),
        (state, action: AnyAction) => {
          state.actionLoading = false
          state.error = action.error.message ?? 'Unable to complete researcher action.'
        },
      )
  },
})

export const { clearResearcherFeedback } = researcherSlice.actions
export const researcherReducer = researcherSlice.reducer
