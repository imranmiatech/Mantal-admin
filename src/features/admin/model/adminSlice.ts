import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AnyAction } from '@reduxjs/toolkit'
import {
  approveResearcherRequest,
  createSubmissionRequest,
  getDistrictOptionsRequest,
  getDivisionsRequest,
  getHierarchyDistrictsRequest,
  getAllResearchersRequest,
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
  AllResearcher,
  PaginationMeta,
} from '../types/admin'

type AdminState = {
  divisions: Division[]
  hierarchyDistricts: HierarchyDistrict[]
  upazilas: Upazila[]
  districtOptions: DistrictOption[]
  allResearchers: AllResearcher[]
  researcherMeta: PaginationMeta | null
  pendingResearchers: PendingResearcher[]
  pendingResearchersMeta: PaginationMeta | null
  pendingSubmissions: PendingSubmission[]
  pendingSubmissionsMeta: PaginationMeta | null
  publishedSubmissions: PublishedSubmission[]
  publishedSubmissionsMeta: PaginationMeta | null
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
  allResearchers: [],
  researcherMeta: null,
  pendingResearchers: [],
  pendingResearchersMeta: null,
  pendingSubmissions: [],
  pendingSubmissionsMeta: null,
  publishedSubmissions: [],
  publishedSubmissionsMeta: null,
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
      allResearchers,
      pendingResearchers,
      pendingSubmissions,
      publishedSubmissions,
    ] = await Promise.all([
      getDivisionsRequest(),
      getDistrictOptionsRequest(),
      getAllResearchersRequest(),
      getPendingResearchersRequest(),
      getPendingSubmissionsRequest(),
      getPublishedSubmissionsRequest(),
    ])

    return {
      divisions,
      districtOptions,
      allResearchers: allResearchers.data,
      researcherMeta: allResearchers.meta,
      pendingResearchers: pendingResearchers.data,
      pendingResearchersMeta: pendingResearchers.meta,
      pendingSubmissions: pendingSubmissions.data,
      pendingSubmissionsMeta: pendingSubmissions.meta,
      publishedSubmissions: publishedSubmissions.data,
      publishedSubmissionsMeta: publishedSubmissions.meta,
    }
  },
)

export const fetchResearchersPage = createAsyncThunk(
  'admin/fetchResearchersPage',
  async ({ page, search }: { page: number; search?: string }) => getAllResearchersRequest(page, 5, search)
)

export const fetchPendingResearchersPage = createAsyncThunk(
  'admin/fetchPendingResearchersPage',
  async (page: number) => getPendingResearchersRequest(page)
)

export const fetchPendingSubmissionsPage = createAsyncThunk(
  'admin/fetchPendingSubmissionsPage',
  async (page: number) => getPendingSubmissionsRequest(page)
)

export const fetchPublishedSubmissionsPage = createAsyncThunk(
  'admin/fetchPublishedSubmissionsPage',
  async (page: number) => getPublishedSubmissionsRequest(page)
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
        state.allResearchers = action.payload.allResearchers
        state.researcherMeta = action.payload.researcherMeta
        state.pendingResearchers = action.payload.pendingResearchers
        state.pendingResearchersMeta = action.payload.pendingResearchersMeta
        state.pendingSubmissions = action.payload.pendingSubmissions
        state.pendingSubmissionsMeta = action.payload.pendingSubmissionsMeta
        state.publishedSubmissions = action.payload.publishedSubmissions
        state.publishedSubmissionsMeta = action.payload.publishedSubmissionsMeta
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Unable to load dashboard data.'
      })
      .addCase(fetchResearchersPage.fulfilled, (state, action) => {
        state.allResearchers = action.payload.data
        state.researcherMeta = action.payload.meta
      })
      .addCase(fetchResearchersPage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load researchers page.'
      })
      .addCase(fetchPendingResearchersPage.fulfilled, (state, action) => {
        state.pendingResearchers = action.payload.data
        state.pendingResearchersMeta = action.payload.meta
      })
      .addCase(fetchPendingResearchersPage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load pending researchers page.'
      })
      .addCase(fetchPendingSubmissionsPage.fulfilled, (state, action) => {
        state.pendingSubmissions = action.payload.data
        state.pendingSubmissionsMeta = action.payload.meta
      })
      .addCase(fetchPendingSubmissionsPage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load pending submissions page.'
      })
      .addCase(fetchPublishedSubmissionsPage.fulfilled, (state, action) => {
        state.publishedSubmissions = action.payload.data
        state.publishedSubmissionsMeta = action.payload.meta
      })
      .addCase(fetchPublishedSubmissionsPage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to load published submissions page.'
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
          !action.type.includes('fetchResearchersPage') &&
          !action.type.includes('fetchPendingResearchersPage') &&
          !action.type.includes('fetchPendingSubmissionsPage') &&
          !action.type.includes('fetchPublishedSubmissionsPage') &&
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
          !action.type.includes('fetchResearchersPage') &&
          !action.type.includes('fetchPendingResearchersPage') &&
          !action.type.includes('fetchPendingSubmissionsPage') &&
          !action.type.includes('fetchPublishedSubmissionsPage') &&
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
          !action.type.includes('fetchResearchersPage') &&
          !action.type.includes('fetchPendingResearchersPage') &&
          !action.type.includes('fetchPendingSubmissionsPage') &&
          !action.type.includes('fetchPublishedSubmissionsPage') &&
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
