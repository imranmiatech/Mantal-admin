import { useState } from 'react'
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

  const handleNextPage = () => {
    if (researcherMeta && researcherMeta.page < researcherMeta.totalPages) {
      dispatch(fetchResearchersPage(researcherMeta.page + 1))
    }
  }

  const handlePrevPage = () => {
    if (researcherMeta && researcherMeta.page > 1) {
      dispatch(fetchResearchersPage(researcherMeta.page - 1))
    }
  }

  return (
    <>
      <style>{`
        .table-container {
          margin-top: 16px;
          overflow-x: auto;
        }

        .researcher-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
        }

        .researcher-table th {
          padding: 14px 16px;
          color: var(--text-soft);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .researcher-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }

        .table-row {
          transition: background 0.2s ease;
          cursor: pointer;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .researcher-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 2px;
          display: block;
        }

        .researcher-email {
          color: var(--text-soft);
          font-size: 0.85rem;
        }

        .post-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(183, 221, 121, 0.15);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.85rem;
        }
        
        .pagination-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .pagination-info {
          font-size: 0.9rem;
          color: var(--text-soft);
        }
      `}</style>

      <Panel
        title="All Researchers"
        description="View and manage researchers. Click a row to see their submissions."
      >
        <div className="table-container">
          <table className="researcher-table">
            <thead>
              <tr>
                <th>Researcher</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              {allResearchers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }} className="empty-state">
                    No researchers found.
                  </td>
                </tr>
              ) : (
                allResearchers.map((researcher) => (
                  <tr 
                    key={researcher.id} 
                    className="table-row"
                    onClick={() => setSelectedResearcher(researcher)}
                  >
                    <td>
                      <span className="researcher-name">{researcher.fullName}</span>
                      <span className="researcher-email">{researcher.email}</span>
                    </td>
                    <td>{new Date(researcher.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="pill">{researcher.approvalStatus}</span>
                    </td>
                    <td>
                      <span className="post-count-badge">
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
          <div className="pagination-controls">
            <span className="pagination-info">
              Showing page {researcherMeta.page} of {researcherMeta.totalPages} ({researcherMeta.total} total)
            </span>
            <div className="row">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={researcherMeta.page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={researcherMeta.page === researcherMeta.totalPages}
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

