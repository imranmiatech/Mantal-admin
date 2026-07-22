import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { DashboardLayout } from '../components/DashboardLayout'
import { StatsGrid } from '../components/StatsGrid'
import { clearAdminFeedback, fetchDashboardData } from '../model/adminSlice'
import { clearResearcherFeedback, fetchResearcherDashboard } from '../../researcher/model/researcherSlice'

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
      <div className="w-full">
        <div id="stats" className="w-full">
          <StatsGrid stats={isAdmin ? adminStats : researcherStats} />
        </div>

        <StatusMessage tone="error" message={isAdmin ? admin.error : researcher.error} />
        <StatusMessage tone="success" message={isAdmin ? admin.successMessage : researcher.successMessage} />

        {(isAdmin ? admin.loading : researcher.loading) ? (
          <div className="glass-panel mt-4 p-6 text-center animate-pulse sm:mt-6 sm:p-12">
            <p className="text-lg text-slate-400 font-medium">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="w-full mt-5 sm:mt-8">
            <h3 className="mb-3 text-lg font-bold sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <Link to="/dashboard/create" className="glass-panel cursor-pointer rounded-2xl p-4 transition hover:scale-[1.01] sm:p-6">
                <p className="text-sm text-slate-500">Create</p>
                <h4 className="mt-1.5 text-lg font-bold sm:mt-2 sm:text-xl">Create Submission</h4>
                <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">Quickly create a new submission</p>
              </Link>

              <Link to="/dashboard/pending-researchers" className="glass-panel cursor-pointer rounded-2xl p-4 transition hover:scale-[1.01] sm:p-6">
                <p className="text-sm text-slate-500">Review</p>
                <h4 className="mt-1.5 text-lg font-bold sm:mt-2 sm:text-xl">Pending Researchers</h4>
                <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">Approve or reject researcher requests</p>
              </Link>

              <Link to="/dashboard/pending-submissions" className="glass-panel cursor-pointer rounded-2xl p-4 transition hover:scale-[1.01] sm:p-6">
                <p className="text-sm text-slate-500">Moderate</p>
                <h4 className="mt-1.5 text-lg font-bold sm:mt-2 sm:text-xl">Pending Submissions</h4>
                <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">Review submissions awaiting approval</p>
              </Link>

              <Link to="/dashboard/published" className="glass-panel cursor-pointer rounded-2xl p-4 transition hover:scale-[1.01] sm:p-6">
                <p className="text-sm text-slate-500">View</p>
                <h4 className="mt-1.5 text-lg font-bold sm:mt-2 sm:text-xl">Published Submissions</h4>
                <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">Browse published content</p>
              </Link>

              <Link to="/dashboard/researchers" className="glass-panel cursor-pointer rounded-2xl p-4 transition hover:scale-[1.01] sm:p-6">
                <p className="text-sm text-slate-500">Manage</p>
                <h4 className="mt-1.5 text-lg font-bold sm:mt-2 sm:text-xl">All Researchers</h4>
                <p className="mt-1.5 text-sm text-slate-500 sm:mt-2">View and search all researchers</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
