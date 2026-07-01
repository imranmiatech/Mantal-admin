import { useAppSelector } from '../../../app/hooks'
import { Panel } from '../../../shared/ui/Panel'

export function ResearcherSubmissionsPanel() {
  const submissions = useAppSelector((state) => state.researcher.submissions)

  return (
    <Panel
      title="My submissions"
      description="Track every submission you have created and see whether it is pending, published, or rejected."
    >
      <div className="list">
        {submissions.length === 0 ? (
          <p className="empty-state">You have not submitted any district data yet.</p>
        ) : (
          submissions.map((submission) => (
            <article key={submission.id} className="list-card">
              <div className="list-card__header">
                <div>
                  <h3>{submission.district}</h3>
                  <p>{submission.division}</p>
                </div>
                <span className="pill">{submission.status}</span>
              </div>
              <p className="muted">
                Risk index {submission.riskIndex} • {submission.riskLevel}
              </p>
              <div className="score-row">
                <span>CE {submission.values.climateExposure}</span>
                <span>AI {submission.values.ageingIndex}</span>
                <span>PS {submission.values.psychologicalStress}</span>
                <span>AC {submission.values.adaptabilityCapacity}</span>
              </div>
              <p>{submission.narrative}</p>
              <p className="muted">
                Created {new Date(submission.createdAt).toLocaleString()}
                {submission.publishedAt
                  ? ` • Published ${new Date(submission.publishedAt).toLocaleString()}`
                  : ''}
              </p>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
