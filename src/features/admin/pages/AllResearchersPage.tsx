import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { DashboardLayout } from '../components/DashboardLayout'
import { AllResearchersPanel } from '../components/AllResearchersPanel'
import { fetchResearchersPage, clearAdminFeedback } from '../model/adminSlice'

export default function AllResearchersPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) dispatch(fetchResearchersPage({ page: 1 }))
    return () => void dispatch(clearAdminFeedback())
  }, [dispatch, isAdmin])

  return (
    <DashboardLayout>
      <div className="w-full">
        <AllResearchersPanel />
      </div>
    </DashboardLayout>
  )
}
