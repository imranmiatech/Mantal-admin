import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { PublishedSubmissionsPanel } from '../components/PublishedSubmissionsPanel'
import { fetchPublishedSubmissionsPage, clearAdminFeedback } from '../model/adminSlice'

export default function PublishedSubmissionsPage() {
  const dispatch = useAppDispatch()
  const isSignedIn = useAppSelector((s) => Boolean(s.auth.user))

  useEffect(() => {
    if (isSignedIn) dispatch(fetchPublishedSubmissionsPage(1))
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isSignedIn])

  return (
    <DashboardLayout>
      <div className="w-full">
        <PublishedSubmissionsPanel />
      </div>
    </DashboardLayout>
  )
}
