import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { Panel } from '../../../shared/ui/Panel'
import { publishSubmission, rejectSubmission, fetchPendingSubmissionsPage } from '../model/adminSlice'

export function PendingSubmissionsPanel() {
  const dispatch = useAppDispatch()
  const { pendingSubmissions, pendingSubmissionsMeta, actionLoading } = useAppSelector((state) => state.admin)

  const handleNextPage = () => {
    if (pendingSubmissionsMeta && pendingSubmissionsMeta.page < pendingSubmissionsMeta.totalPages) {
      dispatch(fetchPendingSubmissionsPage(pendingSubmissionsMeta.page + 1))
    }
  }

  const handlePrevPage = () => {
    if (pendingSubmissionsMeta && pendingSubmissionsMeta.page > 1) {
      dispatch(fetchPendingSubmissionsPage(pendingSubmissionsMeta.page - 1))
    }
  }

  return (
    <>
      <Panel
        title="Pending researcher submissions"
        description="Approve for publishing or reject pending district risk submissions from researchers."
      >
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Location & Author</th>
                <th className="px-6 py-4">Risk Data</th>
                <th className="px-6 py-4">Narrative</th>
                <th className="px-6 py-4 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No pending submissions waiting for review.
                  </td>
                </tr>
              ) : (
                pendingSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="block font-semibold text-slate-900">
                        {submission.district}
                        {submission.upazilaName ? `, ${submission.upazilaName}` : ''}
                      </span>
                      <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                        <p>{submission.division}</p>
                        <p>By {submission.researcher.fullName}</p>
                        <p className="text-slate-500 truncate w-48">({submission.researcher.email})</p>
                        <p className="text-slate-600 font-medium">{new Date(submission.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[160px]">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {submission.riskLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>Index: <strong className="text-slate-900">{submission.riskIndex}</strong></span>
                        <span>CE: <strong className="text-slate-900">{submission.values.climateExposure}</strong></span>
                        <span>AI: <strong className="text-slate-900">{submission.values.ageingIndex}</strong></span>
                        <span>PS: <strong className="text-slate-900">{submission.values.psychologicalStress}</strong></span>
                        <span>AC: <strong className="text-slate-900">{submission.values.adaptabilityCapacity}</strong></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 line-clamp-4 max-w-xs" title={submission.narrative}>
                        {submission.narrative}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          busy={actionLoading}
                          onClick={() => dispatch(publishSubmission(submission.id))}
                          className="w-full !min-h-9 !py-1.5 !px-3 text-xs shadow-none"
                        >
                          Publish
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          busy={actionLoading}
                          onClick={() => dispatch(rejectSubmission(submission.id))}
                          className="w-full !min-h-9 !py-1.5 !px-3 text-xs shadow-none"
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pendingSubmissionsMeta && pendingSubmissionsMeta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{pendingSubmissionsMeta.page}</strong> of <strong className="text-slate-900">{pendingSubmissionsMeta.totalPages}</strong> ({pendingSubmissionsMeta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={pendingSubmissionsMeta.page === 1}
                className="!min-h-10 !py-2 !px-4 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={pendingSubmissionsMeta.page === pendingSubmissionsMeta.totalPages}
                className="!min-h-10 !py-2 !px-4 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </>
  )
}
