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

const initialForm = {
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
}

export function CreateSubmissionPanel() {
  const dispatch = useAppDispatch()
  const { divisions, hierarchyDistricts, upazilas, districtOptions, actionLoading } =
    useAppSelector((state) => state.admin)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    dispatch(clearAdminFeedback())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHierarchyDistricts(undefined))
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
        className="flex flex-col gap-4 sm:gap-6"
        onSubmit={async (event) => {
          event.preventDefault()

          await dispatch(
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
          ).unwrap()
          setForm(initialForm)
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-6">
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

        <label className="flex w-full items-center gap-3 cursor-pointer group sm:w-fit">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className="appearance-none w-6 h-6 rounded border border-slate-300 bg-white checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all peer cursor-pointer"
              checked={form.publishNow}
              onChange={(event) =>
                setForm((current) => ({ ...current, publishNow: event.target.checked }))
              }
            />
            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Publish immediately</span>
        </label>

        <div className="pt-2">
          <Button type="submit" busy={actionLoading} className="w-full sm:w-fit">
            Save submission
          </Button>
        </div>
      </form>
    </Panel>
  )
}
