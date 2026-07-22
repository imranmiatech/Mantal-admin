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
        className="flex w-full flex-col gap-4 sm:gap-6"
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
        <div className="flex w-full flex-col gap-4 sm:gap-6">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/70 p-3 sm:gap-5 sm:p-4"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <h4 className="min-w-0 text-base font-bold text-slate-900">Submission #{index + 1}</h4>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeRow(index)}
                    className="!min-h-9 !px-4 !py-1.5 text-xs"
                  >
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

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-6">
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

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={addRow} className="w-full sm:w-fit">
            Add another row
          </Button>
          <Button type="submit" busy={actionLoading} className="w-full sm:w-fit">
            Submit All
          </Button>
        </div>
      </form>
    </Panel>
  )
}
