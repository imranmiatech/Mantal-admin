import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Panel } from '../../../shared/ui/Panel'
import { Button } from '../../../shared/ui/Button'
import { deleteResearcher, fetchResearchersPage } from '../model/adminSlice'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { ResearcherPostsModal } from './ResearcherPostsModal'
import type { AllResearcher } from '../types/admin'

export function AllResearchersPanel() {
  const dispatch = useAppDispatch()
  const { allResearchers, researcherMeta } = useAppSelector((state) => state.admin)
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'ADMIN')
  const [selectedResearcher, setSelectedResearcher] = useState<AllResearcher | null>(null)
  const [researcherToDelete, setResearcherToDelete] = useState<AllResearcher | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const timer = setTimeout(() => {
      dispatch(fetchResearchersPage({ page: 1, search }))
    }, 400)
    return () => clearTimeout(timer)
  }, [search, dispatch])

  const handleNextPage = () => {
    if (researcherMeta && researcherMeta.page < researcherMeta.totalPages) {
      dispatch(fetchResearchersPage({ page: researcherMeta.page + 1, search }))
    }
  }

  const handlePrevPage = () => {
    if (researcherMeta && researcherMeta.page > 1) {
      dispatch(fetchResearchersPage({ page: researcherMeta.page - 1, search }))
    }
  }

  const handleDeleteResearcher = async () => {
    if (!researcherToDelete) return
    const nextPage =
      researcherMeta && allResearchers.length === 1 && researcherMeta.page > 1
        ? researcherMeta.page - 1
        : researcherMeta?.page ?? 1

    setDeletingId(researcherToDelete.id)
    try {
      await dispatch(deleteResearcher({ id: researcherToDelete.id, page: nextPage, search })).unwrap()
      setResearcherToDelete(null)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Panel
        title="All Researchers"
        description="View and manage researchers. Click a row to see their submissions."
      >
        <div className="mb-3 sm:mb-4">
          <div className="relative max-w-sm sm:w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              className="glass-input h-11 w-full rounded-xl pl-11 pr-4 outline-none transition-all duration-200 text-sm"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="responsive-table-wrap">
          <table className="responsive-table min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Researcher</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Posts</th>
                {isAdmin ? <th className="px-6 py-4 text-right">Action</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allResearchers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} data-empty="true" className="px-4 py-8 text-center text-slate-400 sm:px-6 sm:py-12">
                    No researchers found.
                  </td>
                </tr>
              ) : (
                allResearchers.map((researcher) => (
                  <tr 
                    key={researcher.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedResearcher(researcher)}
                  >
                    <td data-label="Researcher" className="px-6 py-4">
                      <span className="block font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{researcher.fullName}</span>
                      <span className="block break-all text-sm text-slate-500">{researcher.email}</span>
                    </td>
                    <td data-label="Joined Date" className="px-6 py-4 text-sm text-slate-600">
                      {new Date(researcher.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td data-label="Status" className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {researcher.approvalStatus}
                      </span>
                    </td>
                    <td data-label="Posts" className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-all">
                        {researcher._count.submissions}
                      </span>
                    </td>
                    {isAdmin ? (
                      <td data-label="Action" className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="danger"
                          busy={deletingId === researcher.id}
                          disabled={deletingId !== null && deletingId !== researcher.id}
                          onClick={(event) => {
                            event.stopPropagation()
                            setResearcherToDelete(researcher)
                          }}
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

        {researcherMeta && researcherMeta.totalPages > 1 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:mt-6 sm:flex-row sm:gap-4 sm:pt-6">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{researcherMeta.page}</strong> of <strong className="text-slate-900">{researcherMeta.totalPages}</strong> ({researcherMeta.total} total)
            </span>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={researcherMeta.page === 1}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={researcherMeta.page === researcherMeta.totalPages}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Panel>

      <ResearcherPostsModal
        researcher={selectedResearcher}
        onClose={() => setSelectedResearcher(null)}
      />

      {researcherToDelete ? (
        <DeleteConfirmModal
          title="Delete researcher?"
          description={`This will delete ${researcherToDelete.fullName}'s researcher account. This action cannot be undone.`}
          busy={deletingId === researcherToDelete.id}
          onCancel={() => setResearcherToDelete(null)}
          onConfirm={handleDeleteResearcher}
        />
      ) : null}
    </>
  )
}
