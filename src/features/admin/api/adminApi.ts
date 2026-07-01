import { apiRequest } from '../../../shared/lib/api'
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

export function getDivisionsRequest() {
  return apiRequest<Division[]>('/api/admin/divisions')
}

export function getHierarchyDistrictsRequest(divisionCode?: number) {
  const query = divisionCode ? `?divisionCode=${divisionCode}` : ''
  return apiRequest<HierarchyDistrict[]>(`/api/admin/locations/districts${query}`)
}

export function getUpazilasRequest(districtCode: number) {
  return apiRequest<Upazila[]>(
    `/api/admin/locations/districts/${districtCode}/upazilas`,
  )
}

export function getDistrictOptionsRequest() {
  return apiRequest<DistrictOption[]>('/api/admin/districts')
}

export function getPublishedSubmissionsRequest() {
  return apiRequest<PublishedSubmission[]>('/api/admin/submissions/published')
}

export function createSubmissionRequest(payload: CreateSubmissionPayload) {
  return apiRequest('/api/admin/submissions', {
    method: 'POST',
    body: payload,
  })
}

export function getPendingResearchersRequest() {
  return apiRequest<PendingResearcher[]>('/api/admin/users/pending')
}

export function approveResearcherRequest(id: string, note?: string) {
  return apiRequest(`/api/admin/users/${id}/approve`, {
    method: 'PATCH',
    body: note ? { note } : {},
  })
}

export function getPendingSubmissionsRequest() {
  return apiRequest<PendingSubmission[]>('/api/admin/submissions/pending')
}

export function publishSubmissionRequest(id: string) {
  return apiRequest(`/api/admin/submissions/${id}/publish`, {
    method: 'PATCH',
    body: {},
  })
}

export function rejectSubmissionRequest(id: string) {
  return apiRequest(`/api/admin/submissions/${id}/reject`, {
    method: 'PATCH',
    body: {},
  })
}
