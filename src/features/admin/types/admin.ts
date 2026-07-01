export type Division = {
  code: number
  name: string
  bnName?: string
}

export type HierarchyDistrict = {
  code: number
  name: string
  slug: string
  bnName?: string
  divisionCode: number
}

export type Upazila = {
  code: number
  name: string
  bnName?: string
}

export type DistrictOption = {
  id: string
  name: string
  slug: string
  division: string
  summaryNote: string
}

export type PendingResearcher = {
  id: string
  fullName: string
  email: string
  approvalStatus: string
  createdAt: string
}

export type PendingSubmission = {
  id: string
  district: string
  division: string
  upazilaCode: number | null
  upazilaName: string | null
  narrative: string
  riskIndex: number
  riskLevel: string
  createdAt: string
  researcher: {
    fullName: string
    email: string
  }
  values: {
    climateExposure: number
    ageingIndex: number
    psychologicalStress: number
    adaptabilityCapacity: number
  }
}

export type PublishedSubmission = {
  id: string
  district: string
  slug: string
  division: string
  upazilaCode: number | null
  upazilaName: string | null
  ce: number
  ag: number
  ps: number
  ac: number
  riskIndex: number
  riskLevel: string
  narrative: string
  publishedAt: string | null
}

export type CreateSubmissionPayload = {
  districtSlug: string
  upazilaCode?: number
  upazilaName?: string
  climateExposure: number
  ageingIndex: number
  psychologicalStress: number
  adaptabilityCapacity: number
  narrative: string
  publishNow?: boolean
}
