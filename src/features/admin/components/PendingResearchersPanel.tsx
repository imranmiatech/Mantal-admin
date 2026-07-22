import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { Panel } from '../../../shared/ui/Panel'
import { approveResearcher, fetchPendingResearchersPage } from '../model/adminSlice'

export function PendingResearchersPanel() {
  const dispatch = useAppDispatch()
  const { pendingResearchers, pendingResearchersMeta, actionLoading } = useAppSelector((state) => state.admin)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const handleNextPage = () => {
    if (pendingResearchersMeta && pendingResearchersMeta.page < pendingResearchersMeta.totalPages) {
      dispatch(fetchPendingResearchersPage(pendingResearchersMeta.page + 1))
    }
  }

  const handlePrevPage = () => {
    if (pendingResearchersMeta && pendingResearchersMeta.page > 1) {
      dispatch(fetchPendingResearchersPage(pendingResearchersMeta.page - 1))
    }
  }

  return (
    <>
      <Panel
        title="Pending researcher approvals"
        description="Review and approve researcher accounts. Optional notes are stored in the approval audit."
      >
        <div className="responsive-table-wrap">
          <table className="responsive-table min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                <th className="px-6 py-4">Researcher</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 w-[250px]">Approval Note</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingResearchers.length === 0 ? (
                <tr>
                  <td colSpan={5} data-empty="true" className="px-4 py-8 text-center text-slate-400 sm:px-6 sm:py-12">
                    No pending researchers right now.
                  </td>
                </tr>
              ) : (
                pendingResearchers.map((researcher) => (
                  <tr key={researcher.id} className="hover:bg-slate-50 transition-colors group">
                    <td data-label="Researcher" className="px-6 py-4">
                      <span className="block font-semibold text-slate-900">{researcher.fullName}</span>
                      <span className="block break-all text-sm text-slate-500">{researcher.email}</span>
                    </td>
                    <td data-label="Joined Date" className="px-6 py-4 text-sm text-slate-600">
                      {new Date(researcher.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td data-label="Status" className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {researcher.approvalStatus}
                      </span>
                    </td>
                    <td data-label="Approval Note" className="px-6 py-2">
                      <input
                        type="text"
                        className="glass-input h-10 w-full rounded-lg px-3 text-sm outline-none transition-all duration-200 placeholder-slate-500"
                        value={notes[researcher.id] ?? ''}
                        onChange={(event) =>
                          setNotes((current) => ({
                            ...current,
                            [researcher.id]: event.target.value,
                          }))
                        }
                        placeholder="Optional note"
                        maxLength={300}
                      />
                    </td>
                    <td data-label="Action" className="px-6 py-4 text-right">
                      <Button
                        type="button"
                        busy={actionLoading}
                        onClick={() =>
                          dispatch(
                            approveResearcher({
                              id: researcher.id,
                              note: notes[researcher.id] || undefined,
                            }),
                          )
                        }
                        className="!min-h-9 w-full !py-1.5 !px-4 text-xs shadow-none sm:w-fit"
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pendingResearchersMeta && pendingResearchersMeta.totalPages > 1 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:mt-6 sm:flex-row sm:gap-4 sm:pt-6">
            <span className="text-sm text-slate-500 font-medium tracking-wide">
              Showing page <strong className="text-slate-900">{pendingResearchersMeta.page}</strong> of <strong className="text-slate-900">{pendingResearchersMeta.totalPages}</strong> ({pendingResearchersMeta.total} total)
            </span>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={pendingResearchersMeta.page === 1}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={pendingResearchersMeta.page === pendingResearchersMeta.totalPages}
                className="w-full !min-h-10 !py-2 !px-4 text-xs sm:w-fit"
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
