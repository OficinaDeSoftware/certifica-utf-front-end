import { useForm } from 'react-hook-form'

import { format, isWithinInterval, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { IEventDate } from '@/types/IEvent'
import { onNestedSubmit } from '@/utils/onNestedSubmit'
import { zodResolver } from '@hookform/resolvers/zod'

import { TimePickerDemo } from './TimePickerDemo'

type DialogEventDateProps = {
  onSubmit: (data: IEventDate) => void
  startDate: string
  endDate: string
}

const DialogEventDateSchema = z
  .object({
    title: z.string().min(1, 'Nome do horário é obrigatório'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'Horário inválido',
    }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'Horário inválido',
    }),
    date: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data inválida',
    }),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(':').map(Number)
      const [endHour, endMinute] = data.endTime.split(':').map(Number)
      return startHour * 60 + startMinute <= endHour * 60 + endMinute
    },
    {
      message:
        'O horário de início deve ser anterior ou igual ao horário de fim',
      path: ['endTime'],
    }
  )

export default function DialogEventDate(props: DialogEventDateProps) {
  const { onSubmit, startDate, endDate } = props

  const form = useForm({
    resolver: zodResolver(DialogEventDateSchema),
    defaultValues: {
      id: '',
      startTime: '',
      endTime: '',
      date: '',
      title: '',
    },
  })

  const parseDate = (date: string) =>
    date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined

  const onInnerSubmit = onNestedSubmit({
    handleSubmit: form.handleSubmit,
    submitFunction: onSubmit,
  })

  const startParsed = parse(startDate, 'yyyy-MM-dd', new Date())
  const endParsed = parse(endDate, 'yyyy-MM-dd', new Date())

  return (
    <Form {...form}>
      <form
        id="dialog-event-date"
        onSubmit={onInnerSubmit}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'date'}
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        form="dialog-event-date"
                        variant={'outline'}
                        className={cn(
                          'h-12 pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(parseDate(field.value)!, 'PPP', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>DD/MM/AAAA</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      className="pointer-events-auto"
                      mode="single"
                      selected={
                        field.value ? parseDate(field.value) : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }
                      disabled={(date) =>
                        !isWithinInterval(date, {
                          start: startParsed,
                          end: endParsed,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Horário de Inicio</FormLabel>
                <TimePickerDemo
                  setDate={(date: Date | undefined) =>
                    field.onChange(date ? format(date, 'HH:mm') : '')
                  }
                  date={
                    field.value
                      ? parse(field.value, 'HH:mm', new Date())
                      : undefined
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Horário de Fim</FormLabel>
                <TimePickerDemo
                  setDate={(date: Date | undefined) =>
                    field.onChange(date ? format(date, 'HH:mm') : '')
                  }
                  date={
                    field.value
                      ? parse(field.value, 'HH:mm', new Date())
                      : undefined
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
