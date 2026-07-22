import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { Panel } from '../../../shared/ui/Panel'
import { deletePost, fetchPublishedSubmissionsPage } from '../model/adminSlice'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import type { PublishedSubmission } from '../types/admin'

export function PublishedSubmissionsPanel() {
  const dispatch = useAppDispatch()
  const { publishedSubmissions, publishedSubmissionsMeta } = useAppSelector((state) => state.admin)
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'ADMIN')
  const [postToDelete, setPostToDelete] = useState<PublishedSubmission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleDeletePost = async () => {
    if (!postToDelete) return
    const nextPage =
      publishedSubmissionsMeta && publishedSubmissions.length === 1 && publishedSubmissionsMeta.page > 1
        ? publishedSubmissionsMeta.page - 1
        : publishedSubmissionsMeta?.page ?? 1

    setDeletingId(postToDelete.id)
    try {
      await dispatch(deletePost({ id: postToDelete.id, page: nextPage })).unwrap()
      setPostToDelete(null)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Panel
        title="Published submissions"
        description="Live district and upazila records already published for the dashboard."
      >
        <div className="responsive-table-wrap">
          <table className="responsive-table min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Scores</th>
                <th className="px-6 py-4">Published Date</th>
                {isAdmin ? <th className="px-6 py-4 text-right">Action</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {publishedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} data-empty="true" className="px-4 py-8 text-center text-slate-400 sm:px-6 sm:py-12">
                    No published submissions found.
                  </td>
                </tr>
              ) : (
                publishedSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50 transition-colors group">
                    <td data-label="Location" className="px-6 py-4">
                      <span className="block font-semibold text-slate-900">{submission.district}</span>
                      <div className="text-sm text-slate-500 mt-1">
                        {submission.division}
                        {submission.upazilaName ? ` - ${submission.upazilaName}` : ''}
                      </div>
                    </td>
                    <td data-label="Risk Level" className="px-6 py-4">
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {submission.riskLevel}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Index: <strong className="text-slate-900">{submission.riskIndex}</strong>
                      </div>
                    </td>
                    <td data-label="Scores" className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>CE: <strong className="text-slate-900">{submission.ce}</strong></span>
                        <span>AI: <strong className="text-slate-900">{submission.ag}</strong></span>
                        <span>PS: <strong className="text-slate-900">{submission.ps}</strong></span>
                        <span>AC: <strong className="text-slate-900">{submission.ac}</strong></span>
                      </div>
                    </td>
                    <td data-label="Published Date" className="px-6 py-4">
                      <div className="text-sm text-slate-500">
                        {submission.publishedAt ? new Date(submission.publishedAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </div>
                    </td>
                    {isAdmin ? (
                      <td data-label="Action" className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="danger"
                          busy={deletingId === submission.id}
                          disabled={deletingId !== null && deletingId !== submission.id}
                          onClick={() => setPostToDelete(submission)}
                          className="!min-h-9 w-full !py-1.5 !px-4 text-xs shadow-none sm:w-fit"
                        >
                          Delete
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {publishedSubmissionsMeta && publishedSubmissionsMeta.totalPages > 1 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:mt-6 sm:flex-row sm:gap-4 sm:pt-6">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{publishedSubmissionsMeta.page}</strong> of <strong className="text-slate-900">{publishedSubmissionsMeta.totalPages}</strong> ({publishedSubmissionsMeta.total} total)
            </span>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={publishedSubmissionsMeta.page === 1}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={publishedSubmissionsMeta.page === publishedSubmissionsMeta.totalPages}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>

      {postToDelete ? (
        <DeleteConfirmModal
          title="Delete published post?"
          description={`This will delete the published post for ${postToDelete.district}${postToDelete.upazilaName ? `, ${postToDelete.upazilaName}` : ''}. This action cannot be undone.`}
          busy={deletingId === postToDelete.id}
          onCancel={() => setPostToDelete(null)}
          onConfirm={handleDeletePost}
        />
      ) : null}
    </>
  )
}
