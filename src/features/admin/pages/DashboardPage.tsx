import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { CreateSubmissionPanel } from '../components/CreateSubmissionPanel'
import { DashboardLayout } from '../components/DashboardLayout'
import { PendingResearchersPanel } from '../components/PendingResearchersPanel'
import { AllResearchersPanel } from '../components/AllResearchersPanel'
import { PendingSubmissionsPanel } from '../components/PendingSubmissionsPanel'
import { PublishedSubmissionsPanel } from '../components/PublishedSubmissionsPanel'
import { StatsGrid } from '../components/StatsGrid'
import { clearAdminFeedback, fetchDashboardData } from '../model/adminSlice'
import {
  clearResearcherFeedback,
  fetchResearcherDashboard,
} from '../../researcher/model/researcherSlice'
import { ResearcherCreateSubmissionPanel } from '../../researcher/components/ResearcherCreateSubmissionPanel'
import { ResearcherBulkSubmissionPanel } from '../../researcher/components/ResearcherBulkSubmissionPanel'
import { ResearcherSubmissionsPanel } from '../../researcher/components/ResearcherSubmissionsPanel'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const admin = useAppSelector((state) => state.admin)
  const researcher = useAppSelector((state) => state.researcher)
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchDashboardData())
    } else {
      dispatch(fetchResearcherDashboard())
    }

    return () => {
      dispatch(clearAdminFeedback())
      dispatch(clearResearcherFeedback())
    }
  }, [dispatch, isAdmin])

  const adminStats = [
    { label: 'Pending researchers', value: admin.pendingResearchers.length },
    { label: 'Pending submissions', value: admin.pendingSubmissions.length },
    { label: 'Published submissions', value: admin.publishedSubmissions.length },
    { label: 'Total researchers', value: admin.allResearchers.length },
  ]

  const researcherStats = [
    {
      label: 'My submissions',
      value: researcher.dashboard?.summary.totalSubmissions ?? 0,
    },
    {
      label: 'Pending review',
      value: researcher.dashboard?.summary.pendingSubmissions ?? 0,
    },
    {
      label: 'Published',
      value: researcher.dashboard?.summary.publishedSubmissions ?? 0,
    },
    {
      label: 'Rejected',
      value: researcher.dashboard?.summary.rejectedSubmissions ?? 0,
    },
  ]

  return (
    <DashboardLayout>
      <StatsGrid stats={isAdmin ? adminStats : researcherStats} />

      <StatusMessage tone="error" message={isAdmin ? admin.error : researcher.error} />
      <StatusMessage
        tone="success"
        message={isAdmin ? admin.successMessage : researcher.successMessage}
      />

      {(isAdmin ? admin.loading : researcher.loading) ? (
        <div className="panel">Loading dashboard data...</div>
      ) : (
        <div className="dashboard__grid">
          {isAdmin ? (
            <>
              <CreateSubmissionPanel />
              <PendingResearchersPanel />
              <AllResearchersPanel />
              <PendingSubmissionsPanel />
              <PublishedSubmissionsPanel />
            </>
          ) : (
            <>
              <ResearcherCreateSubmissionPanel />
              <ResearcherBulkSubmissionPanel />
              <ResearcherSubmissionsPanel />
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
