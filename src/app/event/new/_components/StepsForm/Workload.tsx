import { useFieldArray, useForm } from 'react-hook-form'

import { Plus } from 'lucide-react'
import { z } from 'zod'

import EventDates from '@/app/event/detail/[id]/_components/event-dates'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import IEvent, { IEventDate } from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

import DialogEventDate from './DialogEventDate'

type WorkloadProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const workloadSchema = z.object({
  workload: z.number().min(1, 'Carga horária é obrigatória'),
  eventDates: z.array(z.object({})).min(1, 'Ao menos um horário é obrigatório'),
})

export default function Workload(props: WorkloadProps) {
  const { formData, handleStepSubmit } = props

  const form = useForm({
    resolver: zodResolver(workloadSchema),
    defaultValues: formData,
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'eventDates',
  })

  const handleSubmitDialogEventDate = (data: IEventDate) => {
    append({ ...data, id: String(Math.random()) })
  }

  return (
    <Form {...form}>
      <form
        id="workload"
        onSubmit={form.handleSubmit((data) => {
          const updatedData = {
            ...data,
            eventDates: fields.map((field) => ({
              initialDate: field.initialDate,
              finalDate: field.finalDate,
              id: field.id,
            })),
          }

          handleStepSubmit(updatedData)
        })}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="workload"
          render={({ field }) => (
            <FormItem className="flex w-1/2 flex-col">
              <FormLabel>Carga horária</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  form="workload"
                  id="name"
                  placeholder="Carga horária"
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

        <FormField
          control={form.control}
          name="eventDates"
          render={() => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Horários dos eventos</FormLabel>
              <FormControl>
                <Card className="max-h-[400px] overflow-auto">
                  <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
                    <EventDates eventDates={fields} />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button">
                          <Plus /> Adicionar novo horário
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[600px]"
                        aria-describedby={undefined}
                      >
                        <DialogHeader>
                          <DialogTitle>Adicionar novo horário</DialogTitle>
                        </DialogHeader>
                        <DialogEventDate
                          onSubmit={handleSubmitDialogEventDate}
                        />
                        <DialogFooter>
                          <Button type="submit" form="dialog-event-date">
                            Adicionar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
