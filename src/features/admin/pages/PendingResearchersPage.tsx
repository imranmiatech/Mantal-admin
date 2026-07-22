import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { PendingResearchersPanel } from '../components/PendingResearchersPanel'
import { fetchPendingResearchersPage, clearAdminFeedback } from '../model/adminSlice'

export default function PendingResearchersPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) dispatch(fetchPendingResearchersPage(1))
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isAdmin])

  return (
    <DashboardLayout>
      <div className="w-full">
        <PendingResearchersPanel />
      </div>
    </DashboardLayout>
  )
}
