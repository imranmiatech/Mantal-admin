import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Button } from '../../../shared/ui/Button'
import { InputField } from '../../../shared/ui/InputField'
import { Panel } from '../../../shared/ui/Panel'
import { SelectField } from '../../../shared/ui/SelectField'
import { clearAdminFeedback, createSubmission, fetchHierarchyDistricts, fetchUpazilas } from '../model/adminSlice'

const scoreFields = [
  { key: 'climateExposure', label: 'Climate exposure' },
  { key: 'ageingIndex', label: 'Ageing index' },
  { key: 'psychologicalStress', label: 'Psychological stress' },
  { key: 'adaptabilityCapacity', label: 'Adaptability capacity' },
] as const

export function CreateSubmissionPanel() {
  const dispatch = useAppDispatch()
  const { divisions, hierarchyDistricts, upazilas, districtOptions, actionLoading } =
    useAppSelector((state) => state.admin)
  const [form, setForm] = useState({
    divisionCode: '',
    districtCode: '',
    districtSlug: '',
    upazilaCode: '',
    narrative: '',
    publishNow: true,
    climateExposure: '0.50',
    ageingIndex: '0.50',
    psychologicalStress: '0.50',
    adaptabilityCapacity: '0.50',
  })

  useEffect(() => {
    dispatch(clearAdminFeedback())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHierarchyDistricts())
  }, [dispatch])

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

  const districtChoices = useMemo(() => {
    const byDivision = form.divisionCode
      ? hierarchyDistricts.filter(
          (district) => String(district.divisionCode) === form.divisionCode,
        )
      : hierarchyDistricts

    return [
      { label: 'Select district', value: '' },
      ...byDivision.map((district) => ({
        label: district.name,
        value: String(district.code),
      })),
    ]
  }, [form.divisionCode, hierarchyDistricts])

  const upazilaOptions = useMemo(
    () => [
      { label: 'Optional upazila', value: '' },
      ...upazilas.map((upazila) => ({
        label: upazila.name,
        value: String(upazila.code),
      })),
    ],
    [upazilas],
  )

  return (
    <Panel
      title="Create admin submission"
      description="Post district risk data directly from the admin dashboard. All four scores must stay between 0 and 1."
    >
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault()

          dispatch(
            createSubmission({
              districtSlug: form.districtSlug,
              upazilaCode: form.upazilaCode ? Number(form.upazilaCode) : undefined,
              upazilaName: form.upazilaCode
                ? upazilas.find((upazila) => String(upazila.code) === form.upazilaCode)
                    ?.name
                : undefined,
              climateExposure: Number(form.climateExposure),
              ageingIndex: Number(form.ageingIndex),
              psychologicalStress: Number(form.psychologicalStress),
              adaptabilityCapacity: Number(form.adaptabilityCapacity),
              narrative: form.narrative,
              publishNow: form.publishNow,
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
              setForm((current) => ({
                ...current,
                divisionCode: event.target.value,
                districtCode: '',
                districtSlug: '',
                upazilaCode: '',
              }))
            }}
          />
          <SelectField
            label="District"
            value={form.districtCode}
            options={districtChoices}
            onChange={(event) => {
              const nextDistrictCode = event.target.value
              const selectedDistrict = hierarchyDistricts.find(
                (district) => String(district.code) === nextDistrictCode,
              )
              const districtSlug =
                districtOptions.find(
                  (district) =>
                    district.name.toLowerCase() === selectedDistrict?.name.toLowerCase(),
                )?.slug ?? ''

              setForm((current) => ({
                ...current,
                districtCode: nextDistrictCode,
                districtSlug,
                upazilaCode: '',
              }))

              if (nextDistrictCode) {
                dispatch(fetchUpazilas(Number(nextDistrictCode)))
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

        <label className="toggle">
          <input
            type="checkbox"
            checked={form.publishNow}
            onChange={(event) =>
              setForm((current) => ({ ...current, publishNow: event.target.checked }))
            }
          />
          <span>Publish immediately</span>
        </label>

        <Button type="submit" busy={actionLoading}>
          Save submission
        </Button>
      </form>
    </Panel>
  )
}
