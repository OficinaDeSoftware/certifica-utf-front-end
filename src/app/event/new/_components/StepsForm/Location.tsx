import { useForm } from 'react-hook-form'

import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import IEvent from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

type LocalizationProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const localizationSchema = z.object({
  location: z.object({
    description: z
      .string()
      .min(10, {
        message: 'Descrição deve ter pelo menos 10 caracteres',
      })
      .max(160, {
        message: 'Descrição deve ter no máximo 160 caracteres',
      }),
  }),
})

export default function Localization(props: LocalizationProps) {
  const { formData, handleStepSubmit } = props

  const form = useForm({
    resolver: zodResolver(localizationSchema),
    defaultValues: formData,
  })

  return (
    <Form {...form}>
      <form
        id="location"
        onSubmit={form.handleSubmit(handleStepSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="location.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do localização do evento"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
