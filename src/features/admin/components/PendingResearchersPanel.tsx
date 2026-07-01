import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { Panel } from '../../../shared/ui/Panel'
import { approveResearcher } from '../model/adminSlice'

export function PendingResearchersPanel() {
  const dispatch = useAppDispatch()
  const { pendingResearchers, actionLoading } = useAppSelector((state) => state.admin)
  const [notes, setNotes] = useState<Record<string, string>>({})

  return (
    <Panel
      title="Pending researcher approvals"
      description="Review and approve researcher accounts. Optional notes are stored in the approval audit."
    >
      <div className="list">
        {pendingResearchers.length === 0 ? (
          <p className="empty-state">No pending researchers right now.</p>
        ) : (
          pendingResearchers.map((researcher) => (
            <article key={researcher.id} className="list-card">
              <div className="list-card__header">
                <div>
                  <h3>{researcher.fullName}</h3>
                  <p>{researcher.email}</p>
                </div>
                <span className="pill">{researcher.approvalStatus}</span>
              </div>
              <p className="muted">
                Joined {new Date(researcher.createdAt).toLocaleString()}
              </p>
              <InputField
                label="Approval note"
                value={notes[researcher.id] ?? ''}
                onChange={(event) =>
                  setNotes((current) => ({
                    ...current,
                    [researcher.id]: event.target.value,
                  }))
                }
                placeholder="Optional note, max 300 characters"
                maxLength={300}
              />
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
              >
                Approve researcher
              </Button>
            </article>
          ))
        )}
      </div>
    </Panel>
  )
}
