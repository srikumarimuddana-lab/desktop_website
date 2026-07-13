'use client'

// Wizard step 2 — vehicle & licence. POSTs /drivers/register (upsert), which
// creates the drivers row (status: pending) and advances onboarding to the
// documents step. Selects are fed by the public /service-areas and
// /vehicle-types endpoints.

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { apiFetch } from '@/lib/spinr-api'

const THIS_YEAR = new Date().getFullYear()

// Saskatchewan requires ride-share vehicles to be under 10 years old.
const vehicleSchema = z.object({
  service_area_id: z.string().min(1, 'Select your city'),
  vehicle_type_id: z.string().min(1, 'Select a vehicle type'),
  vehicle_make: z.string().trim().min(1, 'Required'),
  vehicle_model: z.string().trim().min(1, 'Required'),
  vehicle_color: z.string().trim().min(1, 'Required'),
  vehicle_year: z.coerce
    .number({ invalid_type_error: 'Enter a year' })
    .int()
    .min(THIS_YEAR - 9, `Vehicle must be under 10 years old (${THIS_YEAR - 9} or newer)`)
    .max(THIS_YEAR + 1, 'Enter a valid year'),
  license_plate: z.string().trim().min(1, 'Required'),
  vehicle_vin: z
    .string()
    .trim()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'VIN is 17 characters (no I, O or Q)')
    .optional()
    .or(z.literal('')),
  license_number: z.string().trim().min(1, 'Required'),
  license_expiry_date: z.string().min(1, 'Required'),
  insurance_expiry_date: z.string().min(1, 'Required'),
})

function FieldError({ error }) {
  if (!error) return null
  return <p className="text-sm text-red-600">{error.message}</p>
}

export default function StepVehicle({ user, onDone }) {
  const [areas, setAreas] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      service_area_id: '',
      vehicle_type_id: '',
      vehicle_make: '',
      vehicle_model: '',
      vehicle_color: '',
      vehicle_year: '',
      license_plate: '',
      vehicle_vin: '',
      license_number: '',
      license_expiry_date: '',
      insurance_expiry_date: '',
    },
  })

  const serviceAreaId = watch('service_area_id')
  const vehicleTypeId = watch('vehicle_type_id')

  useEffect(() => {
    apiFetch('/api/v1/service-areas', { retryOn401: false })
      .then((rows) => setAreas(rows || []))
      .catch(() => setAreas([]))
  }, [])

  useEffect(() => {
    if (!serviceAreaId) {
      setVehicleTypes([])
      return
    }
    apiFetch(`/api/v1/vehicle-types?service_area_id=${encodeURIComponent(serviceAreaId)}`, {
      retryOn401: false,
    })
      .then((rows) => setVehicleTypes(rows || []))
      .catch(() => setVehicleTypes([]))
  }, [serviceAreaId])

  const selectedArea = useMemo(
    () => areas.find((a) => a.id === serviceAreaId),
    [areas, serviceAreaId]
  )

  async function onSubmit(values) {
    setSubmitError(null)
    try {
      await apiFetch('/api/v1/drivers/register', {
        method: 'POST',
        body: {
          ...values,
          vehicle_vin: values.vehicle_vin || undefined,
          city: selectedArea?.name || undefined,
          first_name: user?.first_name || undefined,
          last_name: user?.last_name || undefined,
          email: user?.email || undefined,
          gender: user?.gender || undefined,
        },
      })
      toast.success('Vehicle details saved')
      await onDone?.()
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City / service area</Label>
          <Select
            value={serviceAreaId}
            onValueChange={(v) => {
              setValue('service_area_id', v, { shouldValidate: true })
              setValue('vehicle_type_id', '', { shouldValidate: false })
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={areas.length ? 'Select…' : 'Loading…'} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={errors.service_area_id} />
        </div>
        <div className="space-y-2">
          <Label>Vehicle type</Label>
          <Select
            value={vehicleTypeId}
            onValueChange={(v) => setValue('vehicle_type_id', v, { shouldValidate: true })}
            disabled={isSubmitting || !serviceAreaId}
          >
            <SelectTrigger>
              <SelectValue placeholder={serviceAreaId ? 'Select…' : 'Pick a city first'} />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((vt) => (
                <SelectItem key={vt.id} value={vt.id}>
                  {vt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={errors.vehicle_type_id} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dv-make">Make</Label>
          <Input id="dv-make" placeholder="Toyota" {...register('vehicle_make')} />
          <FieldError error={errors.vehicle_make} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dv-model">Model</Label>
          <Input id="dv-model" placeholder="Camry" {...register('vehicle_model')} />
          <FieldError error={errors.vehicle_model} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dv-year">Year</Label>
          <Input id="dv-year" type="number" placeholder={`${THIS_YEAR - 2}`} {...register('vehicle_year')} />
          <FieldError error={errors.vehicle_year} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dv-color">Colour</Label>
          <Input id="dv-color" placeholder="Silver" {...register('vehicle_color')} />
          <FieldError error={errors.vehicle_color} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dv-plate">Licence plate</Label>
          <Input id="dv-plate" {...register('license_plate')} />
          <FieldError error={errors.license_plate} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dv-vin">VIN (optional)</Label>
        <Input id="dv-vin" maxLength={17} {...register('vehicle_vin')} />
        <FieldError error={errors.vehicle_vin} />
      </div>

      <div className="border-t pt-4 space-y-4">
        <p className="text-sm font-medium">Driver's licence</p>
        <p className="text-xs text-gray-500">
          You need a valid Class 5 Saskatchewan licence with at least 3 years of driving
          experience.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dv-license">Licence number</Label>
            <Input id="dv-license" {...register('license_number')} />
            <FieldError error={errors.license_number} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dv-license-exp">Licence expiry</Label>
            <Input id="dv-license-exp" type="date" {...register('license_expiry_date')} />
            <FieldError error={errors.license_expiry_date} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dv-ins-exp">Insurance expiry</Label>
            <Input id="dv-ins-exp" type="date" {...register('insurance_expiry_date')} />
            <FieldError error={errors.insurance_expiry_date} />
          </div>
        </div>
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Continue'}
      </Button>
    </form>
  )
}
