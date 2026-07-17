import type { Division, HierarchyDistrict } from '../../admin/types/admin'

export type ResearcherSubmission = {
  id: string
  district: string
  slug?: string
  division: string
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED'
  values: {
    climateExposure: number
    ageingIndex: number
    psychologicalStress: number
    adaptabilityCapacity: number
  }
  riskIndex: number
  riskLevel: string
  narrative: string
  createdAt: string
  publishedAt: string | null
}

export type ResearcherDashboard = {
  profile: {
    id: string
    fullName: string
    email: string
    role: 'RESEARCHER'
    approvalStatus: string
    createdAt: string
  }
  summary: {
    totalSubmissions: number
    pendingSubmissions: number
    publishedSubmissions: number
    rejectedSubmissions: number
  }
  recentSubmissions: ResearcherSubmission[]
  submissions: ResearcherSubmission[]
}

export type ResearcherCreateSubmissionPayload = {
  districtSlug: string
  upazilaCode?: number
  upazilaName?: string
  climateExposure: number
  ageingIndex: number
  psychologicalStress: number
  adaptabilityCapacity: number
  narrative: string
}

export type ResearcherReferenceData = {
  divisions: Division[]
  districts: HierarchyDistrict[]
}
