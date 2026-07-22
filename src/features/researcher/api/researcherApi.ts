import { apiRequest } from '../../../shared/lib/api'
import type { Division, HierarchyDistrict, Upazila } from '../../admin/types/admin'
import type {
  ResearcherCreateSubmissionPayload,
  ResearcherDashboard,
} from '../types/researcher'

export function getResearcherDashboardRequest() {
  return apiRequest<ResearcherDashboard>('/api/researcher/dashboard')
}

export function getMySubmissionsRequest() {
  return apiRequest<ResearcherDashboard['submissions']>('/api/researcher/submissions/mine')
}

export function createResearcherSubmissionRequest(
  payload: ResearcherCreateSubmissionPayload,
) {
  return apiRequest('/api/researcher/submissions', {
    method: 'POST',
    body: payload,
  })
}

export function createResearcherBulkSubmissionRequest(
  payload: { submissions: ResearcherCreateSubmissionPayload[] },
) {
  return apiRequest('/api/researcher/submissions/bulk', {
    method: 'POST',
    body: payload,
  })
}

export function getPublicDivisionsRequest() {
  return apiRequest<Division[]>('/api/public/divisions')
}

export function getPublicDistrictsRequest(divisionCode?: number) {
  const query = divisionCode ? `?divisionCode=${divisionCode}` : ''
  return apiRequest<HierarchyDistrict[]>(`/api/public/locations/districts${query}`)
}

export function getPublicUpazilasRequest(districtCode: number) {
  return apiRequest<Upazila[]>(`/api/public/locations/districts/${districtCode}/upazilas`)
}
