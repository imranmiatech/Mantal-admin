import { useAppSelector } from '../../../app/hooks'
import { Panel } from '../../../shared/ui/Panel'

export function PublishedSubmissionsPanel() {
  const publishedSubmissions = useAppSelector(
    (state) => state.admin.publishedSubmissions,
  )

  return (
    <Panel
      title="Published submissions"
      description="Live district and upazila records already exposed through the admin published endpoint."
    >
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Risk</th>
              <th>Scores</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {publishedSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <strong>{submission.district}</strong>
                  <p>
                    {submission.division}
                    {submission.upazilaName ? ` • ${submission.upazilaName}` : ''}
                  </p>
                </td>
                <td>
                  {submission.riskLevel} ({submission.riskIndex})
                </td>
                <td>
                  CE {submission.ce} / AI {submission.ag} / PS {submission.ps} / AC{' '}
                  {submission.ac}
                </td>
                <td>{submission.publishedAt ? new Date(submission.publishedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
