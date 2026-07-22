import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { Panel } from '../../../shared/ui/Panel'
import { SelectField } from '../../../shared/ui/SelectField'
import {
  createResearcherSubmission,
  fetchResearcherDistricts,
  fetchResearcherUpazilas,
} from '../model/researcherSlice'

const scoreFields = [
  { key: 'climateExposure', label: 'Climate exposure' },
  { key: 'ageingIndex', label: 'Ageing index' },
  { key: 'psychologicalStress', label: 'Psychological stress' },
  { key: 'adaptabilityCapacity', label: 'Adaptability capacity' },
] as const

export function ResearcherCreateSubmissionPanel() {
  const dispatch = useAppDispatch()
  const { divisions, districts, upazilas, actionLoading } = useAppSelector(
    (state) => state.researcher,
  )
  const [form, setForm] = useState({
    divisionCode: '',
    districtCode: '',
    districtSlug: '',
    upazilaCode: '',
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
        value: String(district.code),
      })),
    ],
    [districts],
  )

  const upazilaOptions = useMemo(
    () => [
      { label: 'Optional upazila', value: '' },
      ...(form.districtCode
        ? upazilas.map((upazila) => ({
            label: upazila.name,
            value: String(upazila.code),
          }))
        : []),
    ],
    [form.districtCode, upazilas],
  )

  return (
    <Panel
      title="Create researcher submission"
      description="Submit district risk data for admin review. Researcher submissions stay pending until an admin publishes them."
    >
      <form
        className="flex w-full flex-col gap-4 sm:gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(
            createResearcherSubmission({
              districtSlug: form.districtSlug,
              upazilaCode: form.upazilaCode ? Number(form.upazilaCode) : undefined,
              upazilaName: form.upazilaCode
                ? upazilas.find((upazila) => String(upazila.code) === form.upazilaCode)?.name
                : undefined,
              climateExposure: Number(form.climateExposure),
              ageingIndex: Number(form.ageingIndex),
              psychologicalStress: Number(form.psychologicalStress),
              adaptabilityCapacity: Number(form.adaptabilityCapacity),
              narrative: form.narrative,
            }),
          )
        }}
      >
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
          <SelectField
            label="Division"
            value={form.divisionCode}
            options={divisionOptions}
            onChange={(event) => {
              const divisionCode = event.target.value
              setForm((current) => ({
                ...current,
                divisionCode,
                districtCode: '',
                districtSlug: '',
                upazilaCode: '',
              }))
              dispatch(fetchResearcherDistricts(divisionCode ? Number(divisionCode) : undefined))
            }}
          />
          <SelectField
            label="District"
            value={form.districtCode}
            options={districtOptions}
            onChange={(event) => {
              const districtCode = event.target.value
              const selectedDistrict = districts.find(
                (district) => String(district.code) === districtCode,
              )

              setForm((current) => ({
                ...current,
                districtCode,
                districtSlug: selectedDistrict?.slug ?? '',
                upazilaCode: '',
              }))

              if (districtCode) {
                dispatch(fetchResearcherUpazilas(Number(districtCode)))
              }
            }}
            required
          />
          <SelectField
            label="Upazila"
            value={form.upazilaCode}
            options={upazilaOptions}
            onChange={(event) =>
              setForm((current) => ({ ...current, upazilaCode: event.target.value }))
            }
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-6">
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

        <Button type="submit" busy={actionLoading} className="w-full sm:w-fit">
          Send for review
        </Button>
      </form>
    </Panel>
  )
}
