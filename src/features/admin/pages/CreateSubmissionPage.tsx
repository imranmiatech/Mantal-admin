import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { CreateSubmissionPanel } from '../components/CreateSubmissionPanel'
import { fetchDashboardData, clearAdminFeedback } from '../model/adminSlice'

export default function CreateSubmissionPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) dispatch(fetchDashboardData())
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isAdmin])

  return (
    <DashboardLayout>
      <div className="w-full">
        <CreateSubmissionPanel />
      </div>
    </DashboardLayout>
  )
}
