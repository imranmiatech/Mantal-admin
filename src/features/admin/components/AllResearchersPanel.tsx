import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Panel } from '../../../shared/ui/Panel'
import { Button } from '../../../shared/ui/Button'
import { fetchResearchersPage } from '../model/adminSlice'
import { ResearcherPostsModal } from './ResearcherPostsModal'
import type { AllResearcher } from '../types/admin'

export function AllResearchersPanel() {
  const dispatch = useAppDispatch()
  const { allResearchers, researcherMeta } = useAppSelector((state) => state.admin)
  const [selectedResearcher, setSelectedResearcher] = useState<AllResearcher | null>(null)
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

  return (
    <>
      <Panel
        title="All Researchers"
        description="View and manage researchers. Click a row to see their submissions."
      >
        <div className="mb-4">
          <div className="relative max-w-sm">
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

        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Researcher</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Posts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allResearchers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
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
                    <td className="px-6 py-4">
                      <span className="block font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{researcher.fullName}</span>
                      <span className="block text-sm text-slate-500">{researcher.email}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(researcher.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {researcher.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-all">
                        {researcher._count.submissions}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {researcherMeta && researcherMeta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{researcherMeta.page}</strong> of <strong className="text-slate-900">{researcherMeta.totalPages}</strong> ({researcherMeta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={researcherMeta.page === 1}
                className="!min-h-10 !py-2 !px-4 text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={researcherMeta.page === researcherMeta.totalPages}
                className="!min-h-10 !py-2 !px-4 text-xs"
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
    </>
  )
}

