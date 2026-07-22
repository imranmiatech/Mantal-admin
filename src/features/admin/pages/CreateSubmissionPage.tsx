import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { CreateSubmissionPanel } from '../components/CreateSubmissionPanel'
import { fetchDashboardData, clearAdminFeedback } from '../model/adminSlice'
import { ResearcherCreateSubmissionPanel } from '../../researcher/components/ResearcherCreateSubmissionPanel'
import { clearResearcherFeedback, fetchResearcherDashboard } from '../../researcher/model/researcherSlice'

export default function CreateSubmissionPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
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

  return (
    <DashboardLayout>
      <div className="w-full">
        {isAdmin ? <CreateSubmissionPanel /> : <ResearcherCreateSubmissionPanel />}
      </div>
    </DashboardLayout>
  )
}
