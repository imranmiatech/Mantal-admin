import { apiRequest } from '../../../shared/lib/api'
import type { Division, HierarchyDistrict } from '../../admin/types/admin'
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

export function getPublicDivisionsRequest() {
  return apiRequest<Division[]>('/api/public/divisions')
}

export function getPublicDistrictsRequest(divisionCode?: number) {
  const query = divisionCode ? `?divisionCode=${divisionCode}` : ''
  return apiRequest<HierarchyDistrict[]>(`/api/public/locations/districts${query}`)
}
