import { useForm } from 'react-hook-form'

import { format, parse } from 'date-fns'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { IEventDate } from '@/types/IEvent'
import { onNestedSubmit } from '@/utils/onNestedSubmit'
import { zodResolver } from '@hookform/resolvers/zod'

type DialogEventDateProps = {
  onSubmit: (data: IEventDate) => void
}

const DialogEventDateSchema = z
  .object({
    initialDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de início inválida',
    }),
    finalDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de fim inválida',
    }),
  })
  .refine(
    (data) => Date.parse(data.initialDate) <= Date.parse(data.finalDate),
    {
      message: 'A data de início deve ser anterior ou igual à data de fim',
      path: ['finalDate'],
    }
  )
  .refine((data) => Date.parse(data.initialDate) >= Date.now(), {
    message: 'A data de início não pode ser no passado',
    path: ['initialDate'],
  })

export default function DialogEventDate(props: DialogEventDateProps) {
  const { onSubmit } = props

  const form = useForm({
    resolver: zodResolver(DialogEventDateSchema),
    defaultValues: {
      id: '',
      initialDate: '',
      finalDate: '',
    },
  })

  const parseDate = (date: string) =>
    date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined

  const onInnerSubmit = onNestedSubmit({
    handleSubmit: form.handleSubmit,
    submitFunction: onSubmit, // submission function
  })

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
            name={'initialDate'}
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Data de início</FormLabel>
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
                        date.getTime() <= new Date().setHours(0, 0, 0, 0) ||
                        date.getTime() < new Date('1900-01-01').getTime()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'finalDate'}
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Data de encerramento</FormLabel>
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
                        date.getTime() <= new Date().setHours(0, 0, 0, 0) ||
                        date.getTime() < new Date('1900-01-01').getTime()
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
      </form>
    </Form>
  )
}
