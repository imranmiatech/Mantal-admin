import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { Panel } from '../../../shared/ui/Panel'
import { fetchPublishedSubmissionsPage } from '../model/adminSlice'

export function PublishedSubmissionsPanel() {
  const dispatch = useAppDispatch()
  const { publishedSubmissions, publishedSubmissionsMeta } = useAppSelector((state) => state.admin)

  const handleNextPage = () => {
    if (publishedSubmissionsMeta && publishedSubmissionsMeta.page < publishedSubmissionsMeta.totalPages) {
      dispatch(fetchPublishedSubmissionsPage(publishedSubmissionsMeta.page + 1))
    }
  }

  const handlePrevPage = () => {
    if (publishedSubmissionsMeta && publishedSubmissionsMeta.page > 1) {
      dispatch(fetchPublishedSubmissionsPage(publishedSubmissionsMeta.page - 1))
    }
  }

  return (
    <>
      <Panel
        title="Published submissions"
        description="Live district and upazila records already exposed through the admin published endpoint."
      >
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Scores</th>
                <th className="px-6 py-4">Published Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {publishedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No published submissions found.
                  </td>
                </tr>
              ) : (
                publishedSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="block font-semibold text-slate-900">{submission.district}</span>
                      <div className="text-sm text-slate-500 mt-1">
                        {submission.division}
                        {submission.upazilaName ? ` • ${submission.upazilaName}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {submission.riskLevel}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Index: <strong className="text-slate-900">{submission.riskIndex}</strong>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>CE: <strong className="text-slate-900">{submission.ce}</strong></span>
                        <span>AI: <strong className="text-slate-900">{submission.ag}</strong></span>
                        <span>PS: <strong className="text-slate-900">{submission.ps}</strong></span>
                        <span>AC: <strong className="text-slate-900">{submission.ac}</strong></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">
                        {submission.publishedAt ? new Date(submission.publishedAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {publishedSubmissionsMeta && publishedSubmissionsMeta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{publishedSubmissionsMeta.page}</strong> of <strong className="text-slate-900">{publishedSubmissionsMeta.totalPages}</strong> ({publishedSubmissionsMeta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={publishedSubmissionsMeta.page === 1}
                className="!min-h-10 !py-2 !px-4 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={publishedSubmissionsMeta.page === publishedSubmissionsMeta.totalPages}
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
