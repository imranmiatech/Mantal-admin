import { useAppSelector } from '../../../app/hooks'
import { Panel } from '../../../shared/ui/Panel'

export function ResearcherSubmissionsPanel() {
  const submissions = useAppSelector((state) => state.researcher.submissions)

  return (
    <Panel
      title="My submissions"
      description="Track every submission you have created and see whether it is pending, published, or rejected."
    >
      <div className="flex w-full flex-col gap-3 sm:gap-4">
        {submissions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-10 text-center text-sm font-medium text-slate-400">
            You have not submitted any district data yet.
          </p>
        ) : (
          submissions.map((submission) => (
            <article
              key={submission.id}
              className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:gap-4 sm:p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{submission.district}</h3>
                  <p className="text-sm text-slate-500">{submission.division}</p>
                </div>
                <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {submission.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Risk index {submission.riskIndex} - {submission.riskLevel}
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-4">
                <span className="rounded-xl bg-slate-50 px-3 py-2">CE {submission.values.climateExposure}</span>
                <span className="rounded-xl bg-slate-50 px-3 py-2">AI {submission.values.ageingIndex}</span>
                <span className="rounded-xl bg-slate-50 px-3 py-2">PS {submission.values.psychologicalStress}</span>
                <span className="rounded-xl bg-slate-50 px-3 py-2">AC {submission.values.adaptabilityCapacity}</span>
              </div>
              <p className="leading-7 text-slate-600">{submission.narrative}</p>
              <p className="text-sm text-slate-500">
                Created {new Date(submission.createdAt).toLocaleString()}
                {submission.publishedAt
                  ? ` - Published ${new Date(submission.publishedAt).toLocaleString()}`
                  : ''}
              </p>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
