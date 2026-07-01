import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { Panel } from '../../../shared/ui/Panel'
import { SelectField } from '../../../shared/ui/SelectField'
import {
  createResearcherSubmission,
  fetchResearcherDistricts,
} from '../model/researcherSlice'

const scoreFields = [
  { key: 'climateExposure', label: 'Climate exposure' },
  { key: 'ageingIndex', label: 'Ageing index' },
  { key: 'psychologicalStress', label: 'Psychological stress' },
  { key: 'adaptabilityCapacity', label: 'Adaptability capacity' },
] as const

export function ResearcherCreateSubmissionPanel() {
  const dispatch = useAppDispatch()
  const { divisions, districts, actionLoading } = useAppSelector((state) => state.researcher)
  const [form, setForm] = useState({
    divisionCode: '',
    districtSlug: '',
    climateExposure: '0.50',
    ageingIndex: '0.50',
    psychologicalStress: '0.50',
    adaptabilityCapacity: '0.50',
    narrative: '',
  })

  const divisionOptions = useMemo(
    () => [
      { label: 'Select division', value: '' },
      ...divisions.map((division) => ({
        label: division.name,
        value: String(division.code),
      })),
    ],
    [divisions],
  )

  const districtOptions = useMemo(
    () => [
      { label: 'Select district', value: '' },
      ...districts.map((district) => ({
        label: district.name,
        value: district.slug,
      })),
    ],
    [districts],
  )

  return (
    <Panel
      title="Create researcher submission"
      description="Submit district risk data for admin review. Researcher submissions stay pending until an admin publishes them."
    >
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(
            createResearcherSubmission({
              districtSlug: form.districtSlug,
              climateExposure: Number(form.climateExposure),
              ageingIndex: Number(form.ageingIndex),
              psychologicalStress: Number(form.psychologicalStress),
              adaptabilityCapacity: Number(form.adaptabilityCapacity),
              narrative: form.narrative,
            }),
          )
        }}
      >
        <div className="grid grid--3">
          <SelectField
            label="Division"
            value={form.divisionCode}
            options={divisionOptions}
            onChange={(event) => {
              const divisionCode = event.target.value
              setForm((current) => ({
                ...current,
                divisionCode,
                districtSlug: '',
              }))
              dispatch(fetchResearcherDistricts(divisionCode ? Number(divisionCode) : undefined))
            }}
          />
          <SelectField
            label="District"
            value={form.districtSlug}
            options={districtOptions}
            onChange={(event) =>
              setForm((current) => ({ ...current, districtSlug: event.target.value }))
            }
            required
          />
        </div>

        <div className="grid grid--4">
          {scoreFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form[field.key]}
              onChange={(event) =>
                setForm((current) => ({ ...current, [field.key]: event.target.value }))
              }
              required
            />
          ))}
        </div>

        <InputField
          as="textarea"
          label="Narrative"
          value={form.narrative}
          onChange={(event) =>
            setForm((current) => ({ ...current, narrative: event.target.value }))
          }
          minLength={10}
          maxLength={500}
          placeholder="Minimum 10 characters, maximum 500 characters"
          required
        />

        <Button type="submit" busy={actionLoading}>
          Send for review
        </Button>
      </form>
    </Panel>
  )
}
