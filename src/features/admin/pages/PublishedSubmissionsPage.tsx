import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { PublishedSubmissionsPanel } from '../components/PublishedSubmissionsPanel'
import { fetchPublishedSubmissionsPage, clearAdminFeedback } from '../model/adminSlice'

export default function PublishedSubmissionsPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) dispatch(fetchPublishedSubmissionsPage(1))
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isAdmin])

  return (
    <DashboardLayout>
      <div className="w-full">
        <PublishedSubmissionsPanel />
      </div>
    </DashboardLayout>
  )
}
