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
      <style>{`
        .table-container {
          margin-top: 16px;
          overflow-x: auto;
        }
        .submission-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
        }
        .submission-table th {
          padding: 14px 16px;
          color: var(--text-soft);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .submission-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: top;
        }
        .table-row {
          transition: background 0.2s ease;
        }
        .table-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .location-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 2px;
          display: block;
        }
        .meta-text {
          color: var(--text-soft);
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px 8px;
          font-size: 0.8rem;
          color: var(--text-soft);
        }
        .scores-grid strong {
          color: #fff;
        }
        .narrative-text {
          font-size: 0.9rem;
          color: var(--text-soft);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 300px;
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
        title="Pending researcher submissions"
        description="Approve for publishing or reject pending district risk submissions from researchers."
      >
        <div className="table-container">
          <table className="submission-table">
            <thead>
              <tr>
                <th>Location & Author</th>
                <th>Risk Data</th>
                <th>Narrative</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }} className="empty-state">
                    No pending submissions waiting for review.
                  </td>
                </tr>
              ) : (
                pendingSubmissions.map((submission) => (
                  <tr key={submission.id} className="table-row">
                    <td>
                      <span className="location-name">
                        {submission.district}
                        {submission.upazilaName ? `, ${submission.upazilaName}` : ''}
                      </span>
                      <div className="meta-text">
                        {submission.division} <br />
                        By {submission.researcher.fullName} <br />
                        ({submission.researcher.email}) <br />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ minWidth: '160px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span className="pill">{submission.riskLevel}</span>
                      </div>
                      <div className="scores-grid">
                        <span>Index: <strong>{submission.riskIndex}</strong></span>
                        <span>CE: <strong>{submission.values.climateExposure}</strong></span>
                        <span>AI: <strong>{submission.values.ageingIndex}</strong></span>
                        <span>PS: <strong>{submission.values.psychologicalStress}</strong></span>
                        <span>AC: <strong>{submission.values.adaptabilityCapacity}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div className="narrative-text" title={submission.narrative}>
                        {submission.narrative}
                      </div>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div className="row" style={{ flexDirection: 'column', gap: '8px' }}>
                        <Button
                          type="button"
                          busy={actionLoading}
                          onClick={() => dispatch(publishSubmission(submission.id))}
                          style={{ width: '100%' }}
                        >
                          Publish
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          busy={actionLoading}
                          onClick={() => dispatch(rejectSubmission(submission.id))}
                          style={{ width: '100%' }}
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
          <div className="pagination-controls">
            <span className="pagination-info">
              Showing page {pendingSubmissionsMeta.page} of {pendingSubmissionsMeta.totalPages} ({pendingSubmissionsMeta.total} total)
            </span>
            <div className="row">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={pendingSubmissionsMeta.page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={pendingSubmissionsMeta.page === pendingSubmissionsMeta.totalPages}
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
