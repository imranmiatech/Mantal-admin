import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { PublicOnlyRoute } from './features/auth/components/PublicOnlyRoute'
import { SignInPage } from './features/auth/pages/SignInPage'
import { SignUpPage } from './features/auth/pages/SignUpPage'
import { DashboardPage } from './features/admin/pages/DashboardPage'
import CreateSubmissionPage from './features/admin/pages/CreateSubmissionPage'
import PendingResearchersPage from './features/admin/pages/PendingResearchersPage'
import PendingSubmissionsPage from './features/admin/pages/PendingSubmissionsPage'
import PublishedSubmissionsPage from './features/admin/pages/PublishedSubmissionsPage'
import AllResearchersPage from './features/admin/pages/AllResearchersPage'
import { UnauthorizedPage } from './features/auth/pages/UnauthorizedPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route
          path="/sign-in"
          element={
            <PublicOnlyRoute>
              <SignInPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create"
          element={
            <ProtectedRoute>
              <CreateSubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pending-researchers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PendingResearchersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pending-submissions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PendingSubmissionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/published"
          element={
            <ProtectedRoute>
              <PublishedSubmissionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/researchers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AllResearchersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
