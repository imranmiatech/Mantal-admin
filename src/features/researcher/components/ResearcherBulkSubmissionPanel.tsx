import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { Panel } from '../../../shared/ui/Panel'
import { SelectField } from '../../../shared/ui/SelectField'
import { createResearcherBulkSubmission } from '../model/researcherSlice'

const defaultRow = {
  districtSlug: '',
  climateExposure: '0.50',
  ageingIndex: '0.50',
  psychologicalStress: '0.50',
  adaptabilityCapacity: '0.50',
  narrative: '',
}

export function ResearcherBulkSubmissionPanel() {
  const dispatch = useAppDispatch()
  const { districts, actionLoading } = useAppSelector((state) => state.researcher)
  
  const [rows, setRows] = useState([{ ...defaultRow }])

  const districtOptions = [
    { label: 'Select district', value: '' },
    ...districts.map((d) => ({ label: d.name, value: d.slug })),
  ]

  const updateRow = (index: number, field: string, value: string) => {
    setRows((current) => {
      const newRows = [...current]
      newRows[index] = { ...newRows[index], [field]: value }
      return newRows
    })
  }

  const addRow = () => setRows((current) => [...current, { ...defaultRow }])
  
  const removeRow = (index: number) => {
    setRows((current) => current.filter((_, i) => i !== index))
  }

  return (
    <Panel
      title="Bulk Create Submissions"
      description="Submit data for multiple districts at once. Upazila is omitted in bulk mode for simplicity."
    >
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(
            createResearcherBulkSubmission({
              submissions: rows.map((r) => ({
                districtSlug: r.districtSlug,
                climateExposure: Number(r.climateExposure),
                ageingIndex: Number(r.ageingIndex),
                psychologicalStress: Number(r.psychologicalStress),
                adaptabilityCapacity: Number(r.adaptabilityCapacity),
                narrative: r.narrative,
              })),
            })
          ).then(() => {
            setRows([{ ...defaultRow }]) // Reset on success
          })
        }}
      >
        <div className="stack" style={{ gap: '2rem' }}>
          {rows.map((row, index) => (
            <div key={index} className="stack" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Submission #{index + 1}</h4>
                {rows.length > 1 && (
                  <Button type="button" variant="danger" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                )}
              </div>
              
              <SelectField
                label="District"
                value={row.districtSlug}
                options={districtOptions}
                onChange={(e) => updateRow(index, 'districtSlug', e.target.value)}
                required
              />

              <div className="grid grid--4">
                <InputField
                  label="Climate exposure"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={row.climateExposure}
                  onChange={(e) => updateRow(index, 'climateExposure', e.target.value)}
                  required
                />
                <InputField
                  label="Ageing index"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={row.ageingIndex}
                  onChange={(e) => updateRow(index, 'ageingIndex', e.target.value)}
                  required
                />
                <InputField
                  label="Psychological stress"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={row.psychologicalStress}
                  onChange={(e) => updateRow(index, 'psychologicalStress', e.target.value)}
                  required
                />
                <InputField
                  label="Adaptability capacity"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={row.adaptabilityCapacity}
                  onChange={(e) => updateRow(index, 'adaptabilityCapacity', e.target.value)}
                  required
                />
              </div>

              <InputField
                as="textarea"
                label="Narrative"
                value={row.narrative}
                onChange={(e) => updateRow(index, 'narrative', e.target.value)}
                minLength={10}
                maxLength={500}
                placeholder="Minimum 10 characters, maximum 500 characters"
                required
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="button" variant="secondary" onClick={addRow}>
            + Add Another Row
          </Button>
          <Button type="submit" busy={actionLoading}>
            Submit All
          </Button>
        </div>
      </form>
    </Panel>
  )
}
