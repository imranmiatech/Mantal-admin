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
      <style>{`
        .table-container {
          margin-top: 16px;
          overflow-x: auto;
        }
        .published-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
        }
        .published-table th {
          padding: 14px 16px;
          color: var(--text-soft);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .published-table td {
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
        title="Published submissions"
        description="Live district and upazila records already exposed through the admin published endpoint."
      >
        <div className="table-container">
          <table className="published-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Risk Level</th>
                <th>Scores</th>
                <th>Published Date</th>
              </tr>
            </thead>
            <tbody>
              {publishedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }} className="empty-state">
                    No published submissions found.
                  </td>
                </tr>
              ) : (
                publishedSubmissions.map((submission) => (
                  <tr key={submission.id} className="table-row">
                    <td>
                      <span className="location-name">{submission.district}</span>
                      <div className="meta-text">
                        {submission.division}
                        {submission.upazilaName ? ` • ${submission.upazilaName}` : ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ marginBottom: '8px' }}>
                        <span className="pill">{submission.riskLevel}</span>
                      </div>
                      <div className="meta-text">
                        Index: <strong>{submission.riskIndex}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="scores-grid">
                        <span>CE: <strong>{submission.ce}</strong></span>
                        <span>AI: <strong>{submission.ag}</strong></span>
                        <span>PS: <strong>{submission.ps}</strong></span>
                        <span>AC: <strong>{submission.ac}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div className="meta-text">
                        {submission.publishedAt ? new Date(submission.publishedAt).toLocaleString() : '-'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {publishedSubmissionsMeta && publishedSubmissionsMeta.totalPages > 1 && (
          <div className="pagination-controls">
            <span className="pagination-info">
              Showing page {publishedSubmissionsMeta.page} of {publishedSubmissionsMeta.totalPages} ({publishedSubmissionsMeta.total} total)
            </span>
            <div className="row">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={publishedSubmissionsMeta.page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
                disabled={publishedSubmissionsMeta.page === publishedSubmissionsMeta.totalPages}
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
