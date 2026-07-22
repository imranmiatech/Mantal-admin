import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { PendingSubmissionsPanel } from '../components/PendingSubmissionsPanel'
import { fetchPendingSubmissionsPage, clearAdminFeedback } from '../model/adminSlice'

export default function PendingSubmissionsPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) dispatch(fetchPendingSubmissionsPage(1))
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isAdmin])

  return (
    <DashboardLayout>
      <div className="w-full">
        <PendingSubmissionsPanel />
      </div>
    </DashboardLayout>
  )
}
