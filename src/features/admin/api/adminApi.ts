import { apiRequest } from '../../../shared/lib/api'
import type {
  CreateSubmissionPayload,
  DistrictOption,
  Division,
  HierarchyDistrict,
  Upazila,
  PaginatedResearchers,
  PaginatedPendingResearchers,
  PaginatedPendingSubmissions,
  PaginatedPublishedSubmissions,
  ResearcherSubmission,
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

export function getPublishedSubmissionsRequest(page: number = 1, limit: number = 10) {
  return apiRequest<PaginatedPublishedSubmissions>(`/api/admin/submissions/published?page=${page}&limit=${limit}`)
}

export function createSubmissionRequest(payload: CreateSubmissionPayload) {
  return apiRequest('/api/admin/submissions', {
    method: 'POST',
    body: payload,
  })
}

export function getAllResearchersRequest(page: number = 1, limit: number = 5, search?: string) {
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : ''
  return apiRequest<PaginatedResearchers>(`/api/admin/users/researchers?page=${page}&limit=${limit}${searchQuery}`)
}

export function getResearcherSubmissionsRequest(id: string) {
  return apiRequest<ResearcherSubmission[]>(`/api/admin/users/${id}/submissions`)
}

export function getPendingResearchersRequest(page: number = 1, limit: number = 10) {
  return apiRequest<PaginatedPendingResearchers>(`/api/admin/users/pending?page=${page}&limit=${limit}`)
}

export function approveResearcherRequest(id: string, note?: string) {
  return apiRequest(`/api/admin/users/${id}/approve`, {
    method: 'PATCH',
    body: note ? { note } : {},
  })
}

export function getPendingSubmissionsRequest(page: number = 1, limit: number = 10) {
  return apiRequest<PaginatedPendingSubmissions>(`/api/admin/submissions/pending?page=${page}&limit=${limit}`)
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
