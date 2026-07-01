import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { Panel } from '../../../shared/ui/Panel'
import { publishSubmission, rejectSubmission } from '../model/adminSlice'

export function PendingSubmissionsPanel() {
  const dispatch = useAppDispatch()
  const { pendingSubmissions, actionLoading } = useAppSelector((state) => state.admin)

  return (
    <Panel
      title="Pending researcher submissions"
      description="Approve for publishing or reject pending district risk submissions from researchers."
    >
      <div className="list">
        {pendingSubmissions.length === 0 ? (
          <p className="empty-state">No pending submissions waiting for review.</p>
        ) : (
          pendingSubmissions.map((submission) => (
            <article key={submission.id} className="list-card">
              <div className="list-card__header">
                <div>
                  <h3>
                    {submission.district}
                    {submission.upazilaName ? `, ${submission.upazilaName}` : ''}
                  </h3>
                  <p>
                    {submission.division} • {submission.researcher.fullName} (
                    {submission.researcher.email})
                  </p>
                </div>
                <span className="pill">{submission.riskLevel}</span>
              </div>
              <p className="muted">
                Risk index {submission.riskIndex} • Submitted{' '}
                {new Date(submission.createdAt).toLocaleString()}
              </p>
              <div className="score-row">
                <span>CE {submission.values.climateExposure}</span>
                <span>AI {submission.values.ageingIndex}</span>
                <span>PS {submission.values.psychologicalStress}</span>
                <span>AC {submission.values.adaptabilityCapacity}</span>
              </div>
              <p>{submission.narrative}</p>
              <div className="row">
                <Button
                  type="button"
                  busy={actionLoading}
                  onClick={() => dispatch(publishSubmission(submission.id))}
                >
                  Publish
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  busy={actionLoading}
                  onClick={() => dispatch(rejectSubmission(submission.id))}
                >
                  Reject
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
