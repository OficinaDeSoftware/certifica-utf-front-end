/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useForm } from 'react-hook-form'

import { z } from 'zod'

import GoogleMapComponent from '@/components/google-map-component'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import IEvent from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

type LocalizationProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const localizationSchema = z.object({
  location: z.object({
    complement: z
      .string()
      .min(1, {
        message: 'Complemento é obrigatório',
      })
      .max(160, {
        message: 'Complemento deve ter no máximo 160 caracteres',
      }),
    address: z.string().min(1, 'Endereço é obrigatório'),
    capacity: z.number().min(1, 'Limite de pessoas é obrigatória'),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
  }),
})

export default function Localization(props: LocalizationProps) {
  const { formData, handleStepSubmit } = props

  const form = useForm({
    resolver: zodResolver(localizationSchema),
    defaultValues: formData,
  })

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue('location.coordinates', { lat, lng })
  }

  return (
    <Form {...form}>
      <form
        id="location"
        onSubmit={form.handleSubmit(handleStepSubmit)}
        className="flex w-full flex-col gap-4"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      >
        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Espaço</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="address"
                  placeholder="Ex: Sala 101 ou Auditório Principal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="location.complement"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input
                    id="complement"
                    placeholder="Ex: Entrada UTFPR"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.capacity"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Limite de Pessoas</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    form="location.capacity"
                    id="capacity"
                    placeholder="Ex: 120"
                    type="number"
                    onChange={(e) => {
                      const value =
                        e.target.value === '' ? '' : Number(e.target.value)
                      field.onChange(value)
                    }}
                    value={field.value === undefined ? '' : String(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <GoogleMapComponent
            center={{
              lat:
                form.getValues('location.coordinates.lat') ||
                -25.704432566768226,
              lng:
                form.getValues('location.coordinates.lng') ||
                -53.09758561759751,
            }}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </form>
    </Form>
  )
}
